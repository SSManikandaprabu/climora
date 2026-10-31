import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { CityData } from '../../types/climate';
import { GLOBAL_CITIES } from '../../data/citiesData';
import { createEarthTextures } from './earthTextures';
import { soundFx } from '../../utils/audioSynthesizer';
import { RotateCw, ZoomIn, ZoomOut, Eye, Sparkles, Navigation, Layers, Compass, Radio, Satellite, ShieldCheck } from 'lucide-react';

interface EarthGlobeProps {
  selectedCity: CityData;
  onSelectCity: (city: CityData) => void;
  onTransitionToTwin: (city: CityData) => void;
  autoRotateDefault?: boolean;
}

export const EarthGlobe: React.FC<EarthGlobeProps> = ({
  selectedCity,
  onSelectCity,
  onTransitionToTwin,
  autoRotateDefault = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState(autoRotateDefault);
  const [showAtmosphere, setShowAtmosphere] = useState(true);
  const [showClouds, setShowClouds] = useState(true);
  const [showNightLights, setShowNightLights] = useState(true);
  const [showSatellites, setShowSatellites] = useState(true);
  const [showArcs, setShowArcs] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hoveredCity, setHoveredCity] = useState<CityData | null>(null);

  // References for Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const cloudsMeshRef = useRef<THREE.Mesh | null>(null);
  const atmosphereMeshRef = useRef<THREE.Mesh | null>(null);
  const markersGroupRef = useRef<THREE.Group | null>(null);
  const satellitesGroupRef = useRef<THREE.Group | null>(null);
  const arcsGroupRef = useRef<THREE.Group | null>(null);
  const animFrameId = useRef<number | null>(null);
  const earthMatRef = useRef<THREE.ShaderMaterial | null>(null);

  // Convert lat/lng to 3D sphere coordinate
  const latLngToVector3 = (lat: number, lng: number, radius: number): THREE.Vector3 => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  };

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // SCENE
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // CAMERA
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 2500);
    camera.position.set(0, 20, 310);
    cameraRef.current = camera;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // MASTER GLOBE GROUP (Rotates with user/auto-rotation)
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    // 1. PROCEDURAL 4K MULTI-LAYER TEXTURES
    const { dayTexture, nightTexture, specTexture, cloudTexture } = createEarthTextures();

    // 2. SUN VECTOR
    const sunDirection = new THREE.Vector3(1.2, 0.4, 0.8).normalize();

    // 3. PHOTOREALISTIC SHADER
    const earthRadius = 100;
    const earthGeometry = new THREE.SphereGeometry(earthRadius, 96, 96);

    const earthVertexShader = `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const earthFragmentShader = `
      uniform sampler2D uDayTexture;
      uniform sampler2D uNightTexture;
      uniform sampler2D uSpecTexture;
      uniform vec3 uSunDirection;
      uniform float uNightLightsMix;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        vec3 dayColor = texture2D(uDayTexture, vUv).rgb;
        vec3 nightColor = texture2D(uNightTexture, vUv).rgb;
        float specValue = texture2D(uSpecTexture, vUv).r;

        float nDotL = dot(vNormal, uSunDirection);
        float dayMix = smoothstep(-0.15, 0.25, nDotL);

        vec3 viewDir = normalize(-vPosition);
        vec3 reflectDir = reflect(-uSunDirection, vNormal);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0) * specValue * 1.8;
        vec3 specularColor = vec3(0.3, 0.75, 1.0) * spec;

        vec3 ambient = dayColor * 0.12;
        vec3 finalColor = mix(nightColor * 1.6 * uNightLightsMix, dayColor + specularColor, dayMix) + ambient;
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const earthMaterial = new THREE.ShaderMaterial({
      vertexShader: earthVertexShader,
      fragmentShader: earthFragmentShader,
      uniforms: {
        uDayTexture: { value: dayTexture },
        uNightTexture: { value: nightTexture },
        uSpecTexture: { value: specTexture },
        uSunDirection: { value: sunDirection },
        uNightLightsMix: { value: 1.0 },
      },
    });
    earthMatRef.current = earthMaterial;

    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    globeGroup.add(earthMesh);

    // 4. VOLUMETRIC CLOUDS LAYER
    const cloudsGeo = new THREE.SphereGeometry(earthRadius + 1.4, 64, 64);
    const cloudsMat = new THREE.MeshStandardMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.52,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
    globeGroup.add(cloudsMesh);
    cloudsMeshRef.current = cloudsMesh;

    // 5. RAYLEIGH ATMOSPHERIC SCATTERING GLOW (Outer Halo)
    const atmosphereVertexShader = `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
    const atmosphereFragmentShader = `
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.8);
        vec3 glowColor = mix(vec3(0.13, 0.82, 0.93), vec3(0.55, 0.36, 0.96), 0.25);
        gl_FragColor = vec4(glowColor, 1.0) * intensity * 2.2;
      }
    `;
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmosphereGeo = new THREE.SphereGeometry(earthRadius + 14, 64, 64);
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    scene.add(atmosphereMesh);
    atmosphereMeshRef.current = atmosphereMesh;

    // 6. PROCEDURAL STARFIELD
    const starCount = 1200;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const radius = 600 + Math.random() * 800;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);
      const isCyan = Math.random() > 0.7;
      starColors[i * 3] = isCyan ? 0.6 : 0.95;
      starColors[i * 3 + 1] = isCyan ? 0.9 : 0.95;
      starColors[i * 3 + 2] = 1.0;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    const starMat = new THREE.PointsMaterial({ size: 1.8, vertexColors: true, transparent: true, opacity: 0.8 });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 7. ORBITAL SATELLITES (Sentinel-2A, GPM Core, ERA5 Relay)
    const satellitesGroup = new THREE.Group();
    globeGroup.add(satellitesGroup);
    satellitesGroupRef.current = satellitesGroup;

    interface SatelliteDef {
      name: string;
      radius: number;
      speed: number;
      inclination: number;
      color: number;
      mesh?: THREE.Group;
    }

    const satelliteDefs: SatelliteDef[] = [
      { name: 'Sentinel-2A (ESA Multi-Spectral)', radius: 124, speed: 0.012, inclination: 0.85, color: 0x22d3ee },
      { name: 'GPM Core (NASA/JAXA Doppler)', radius: 118, speed: 0.015, inclination: 0.65, color: 0x3b82f6 },
      { name: 'Copernicus Climate Relay', radius: 135, speed: 0.008, inclination: 0.25, color: 0xa855f7 },
    ];

    satelliteDefs.forEach((sat) => {
      const satGroup = new THREE.Group();

      // Satellite Body
      const bodyGeo = new THREE.BoxGeometry(1.6, 0.8, 1.0);
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.8, roughness: 0.2 });
      const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
      satGroup.add(bodyMesh);

      // Solar Panels
      const panelGeo = new THREE.BoxGeometry(4.2, 0.1, 1.2);
      const panelMat = new THREE.MeshBasicMaterial({ color: 0x1d4ed8 });
      const panelMesh = new THREE.Mesh(panelGeo, panelMat);
      satGroup.add(panelMesh);

      // Orbital Track Ring
      const orbitCurve = new THREE.EllipseCurve(0, 0, sat.radius, sat.radius, 0, 2 * Math.PI, false, 0);
      const orbitPoints = orbitCurve.getPoints(64);
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints.map((p) => new THREE.Vector3(p.x, 0, p.y)));
      const orbitMat = new THREE.LineBasicMaterial({ color: sat.color, transparent: true, opacity: 0.25 });
      const orbitLine = new THREE.Line(orbitGeo, orbitMat);
      orbitLine.rotation.x = sat.inclination;
      satellitesGroup.add(orbitLine);

      sat.mesh = satGroup;
      satellitesGroup.add(satGroup);
    });

    // 8. TELECONNECTION 3D ARCS (Chennai <-> Singapore, Rotterdam, Tokyo, New York)
    const arcsGroup = new THREE.Group();
    globeGroup.add(arcsGroup);
    arcsGroupRef.current = arcsGroup;

    const chennaiPos = latLngToVector3(13.0827, 80.2707, earthRadius);
    const targetCities = [
      { name: 'Singapore', lat: 1.3521, lng: 103.8198 },
      { name: 'Rotterdam', lat: 51.9244, lng: 4.4777 },
      { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
      { name: 'New York', lat: 40.7128, lng: -74.0060 },
    ];

    const arcPulses: { mesh: THREE.Mesh; curve: THREE.QuadraticBezierCurve3; progress: number; speed: number }[] = [];

    targetCities.forEach((target) => {
      const destPos = latLngToVector3(target.lat, target.lng, earthRadius);
      // Midpoint lofted into space
      const midPos = chennaiPos.clone().add(destPos).multiplyScalar(0.5);
      const distance = chennaiPos.distanceTo(destPos);
      midPos.normalize().multiplyScalar(earthRadius + distance * 0.28);

      const curve = new THREE.QuadraticBezierCurve3(chennaiPos, midPos, destPos);
      const points = curve.getPoints(50);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const arcMat = new THREE.LineBasicMaterial({
        color: 0x22d3ee,
        transparent: true,
        opacity: 0.35,
      });
      const arcLine = new THREE.Line(arcGeo, arcMat);
      arcsGroup.add(arcLine);

      // Photon pulse traveling along curve
      const pulseGeo = new THREE.SphereGeometry(1.2, 12, 12);
      const pulseMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
      arcsGroup.add(pulseMesh);
      arcPulses.push({ mesh: pulseMesh, curve, progress: Math.random(), speed: 0.005 + Math.random() * 0.003 });
    });

    // 9. CITY MARKERS WITH CYBERNETIC BEACONS
    const markersGroup = new THREE.Group();
    globeGroup.add(markersGroup);
    markersGroupRef.current = markersGroup;

    GLOBAL_CITIES.forEach((city) => {
      const pos = latLngToVector3(city.lat, city.lng, earthRadius);
      const isChennai = city.id === 'chennai';
      const isCritical = city.riskLevel === 'CRITICAL';

      const marker = new THREE.Group();
      marker.position.copy(pos);
      marker.lookAt(new THREE.Vector3(0, 0, 0));
      marker.userData = { city };

      // Pin stem / vertical laser beacon beam
      const beamHeight = isChennai ? 15 : 10;
      const beamGeo = new THREE.CylinderGeometry(0.3, 0.3, beamHeight, 8);
      beamGeo.rotateX(Math.PI / 2);
      beamGeo.translate(0, 0, beamHeight / 2);
      const beamMat = new THREE.MeshBasicMaterial({
        color: isChennai ? 0x22d3ee : isCritical ? 0xef4444 : 0x3b82f6,
        transparent: true,
        opacity: 0.85,
      });
      const beamMesh = new THREE.Mesh(beamGeo, beamMat);
      marker.add(beamMesh);

      // Beaming apex orb
      const orbGeo = new THREE.SphereGeometry(isChennai ? 2.8 : 2.0, 16, 16);
      orbGeo.translate(0, 0, beamHeight);
      const orbMat = new THREE.MeshBasicMaterial({
        color: isChennai ? 0xffffff : isCritical ? 0xff6666 : 0x38bdf8,
      });
      const orbMesh = new THREE.Mesh(orbGeo, orbMat);
      marker.add(orbMesh);

      // Radar pinging concentric ring
      const ringGeo = new THREE.RingGeometry(2.4, isChennai ? 5.8 : 4.2, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: isChennai ? 0x22d3ee : isCritical ? 0xef4444 : 0x3b82f6,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.set(0, 0, beamHeight);
      marker.add(ringMesh);
      marker.userData.ring = ringMesh;

      markersGroup.add(marker);
    });

    // 10. LIGHTING
    const dirSunLight = new THREE.DirectionalLight(0xfff5e6, 2.4);
    dirSunLight.position.set(250, 80, 160);
    scene.add(dirSunLight);

    const ambientLight = new THREE.AmbientLight(0x0a1426, 1.2);
    scene.add(ambientLight);

    const softFillLight = new THREE.DirectionalLight(0x1a365d, 0.6);
    softFillLight.position.set(-200, -50, -100);
    scene.add(softFillLight);

    // Initial orientation: Target Chennai
    const initialRot = -((selectedCity.lng + 180) * (Math.PI / 180)) + Math.PI / 2;
    globeGroup.rotation.y = initialRot;
    globeGroup.rotation.x = (selectedCity.lat * (Math.PI / 180)) * 0.35;

    // DRAG INTERACTION
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotY = globeGroup.rotation.y;
    let targetRotX = globeGroup.rotation.x;
    let velX = 0;
    let velY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      velX = 0;
      velY = 0;
    };

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        velX = deltaX * 0.005;
        velY = deltaY * 0.005;
        targetRotY += velX;
        targetRotX += velY;
        targetRotX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotX));
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }

      // Check hovered markers
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(markersGroup.children, true);
      if (intersects.length > 0) {
        let obj: THREE.Object3D | null = intersects[0].object;
        while (obj && !obj.userData?.city && obj.parent) {
          obj = obj.parent;
        }
        if (obj && obj.userData?.city) {
          setHoveredCity(obj.userData.city);
          container.style.cursor = 'pointer';
          return;
        }
      }
      setHoveredCity(null);
      container.style.cursor = isDragging ? 'grabbing' : 'grab';
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z += e.deltaY * 0.16;
      camera.position.z = Math.max(160, Math.min(500, camera.position.z));
    };

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(markersGroup.children, true);
      if (intersects.length > 0) {
        let obj: THREE.Object3D | null = intersects[0].object;
        while (obj && !obj.userData?.city && obj.parent) {
          obj = obj.parent;
        }
        if (obj && obj.userData?.city) {
          soundFx.playClick();
          const clickedCity = obj.userData.city as CityData;
          onSelectCity(clickedCity);
        }
      }
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('click', onClick);

    // ANIMATION LOOP
    const clock = new THREE.Clock();
    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      globeGroup.rotation.y += (targetRotY - globeGroup.rotation.y) * 0.08;
      globeGroup.rotation.x += (targetRotX - globeGroup.rotation.x) * 0.08;

      if (autoRotate && !isDragging) {
        targetRotY += 0.0014;
      }

      if (cloudsMeshRef.current) {
        cloudsMeshRef.current.rotation.y += 0.0006;
      }

      // Animate pulsing radar rings
      markersGroup.children.forEach((marker, idx) => {
        const ring = marker.userData.ring as THREE.Mesh;
        if (ring) {
          const s = 1 + 0.45 * Math.sin(elapsedTime * 3.5 + idx * 0.8);
          ring.scale.set(s, s, s);
        }
      });

      // Animate Satellites along orbital paths
      satelliteDefs.forEach((sat, i) => {
        if (sat.mesh) {
          const angle = elapsedTime * sat.speed * 8 + i * 2.1;
          const x = sat.radius * Math.cos(angle);
          const z = sat.radius * Math.sin(angle);
          // Apply inclination rotation
          sat.mesh.position.set(x, z * Math.sin(sat.inclination), z * Math.cos(sat.inclination));
          sat.mesh.rotation.y = angle;
        }
      });

      // Animate photon pulses along teleconnection arcs
      arcPulses.forEach((pulse) => {
        pulse.progress += pulse.speed;
        if (pulse.progress > 1) pulse.progress = 0;
        const pt = pulse.curve.getPoint(pulse.progress);
        pulse.mesh.position.copy(pt);
      });

      starField.rotation.y = elapsedTime * 0.0002;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('click', onClick);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      earthGeometry.dispose();
      earthMaterial.dispose();
      dayTexture.dispose();
      nightTexture.dispose();
      specTexture.dispose();
      cloudTexture.dispose();
    };
  }, []);

  const focusOnCity = (city: CityData) => {
    if (!globeGroupRef.current || !cameraRef.current) return;
    const targetY = -((city.lng + 180) * (Math.PI / 180)) + Math.PI / 2;
    const targetX = (city.lat * (Math.PI / 180)) * 0.35;

    let progress = 0;
    const startY = globeGroupRef.current.rotation.y;
    const startX = globeGroupRef.current.rotation.x;
    const startZ = cameraRef.current.position.z;
    const targetZ = 195;

    const animateFocus = () => {
      progress += 0.04;
      if (progress < 1) {
        const ease = 1 - Math.pow(1 - progress, 3);
        if (globeGroupRef.current) {
          globeGroupRef.current.rotation.y = startY + (targetY - startY) * ease;
          globeGroupRef.current.rotation.x = startX + (targetX - startX) * ease;
        }
        if (cameraRef.current) {
          cameraRef.current.position.z = startZ + (targetZ - startZ) * ease;
        }
        requestAnimationFrame(animateFocus);
      } else {
        if (globeGroupRef.current) {
          globeGroupRef.current.rotation.y = targetY;
          globeGroupRef.current.rotation.x = targetX;
        }
      }
    };
    animateFocus();
  };

  useEffect(() => {
    focusOnCity(selectedCity);
  }, [selectedCity]);

  const handleEnterTwinView = () => {
    soundFx.playRadarPing();
    setIsTransitioning(true);
    if (!cameraRef.current) {
      onTransitionToTwin(selectedCity);
      return;
    }

    let progress = 0;
    const startZ = cameraRef.current.position.z;
    const targetZ = 110;

    const diveIn = () => {
      progress += 0.04;
      if (progress < 1) {
        const ease = Math.pow(progress, 2.8);
        if (cameraRef.current) {
          cameraRef.current.position.z = startZ - (startZ - targetZ) * ease;
        }
        requestAnimationFrame(diveIn);
      } else {
        setIsTransitioning(false);
        onTransitionToTwin(selectedCity);
      }
    };
    diveIn();
  };

  const handleZoom = (delta: number) => {
    soundFx.playClick();
    if (!cameraRef.current) return;
    const newZ = cameraRef.current.position.z + delta;
    cameraRef.current.position.z = Math.max(160, Math.min(500, newZ));
  };

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-radial from-[#09152b] via-[#050914] to-[#020409]">
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Atmospheric Scanning Laser Sweep */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] animate-scanline" />
      </div>

      {/* Top Left Live Geospatial Telemetry HUD */}
      <div className="absolute top-5 left-6 pointer-events-none flex flex-col gap-1.5 z-10">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500 shadow-[0_0_8px_#22d3ee]"></span>
          </span>
          <span className="font-mono text-xs uppercase tracking-widest text-cyan-300 font-bold">
            Photorealistic 3D Earth • Multi-Spectral Orbit
          </span>
        </div>
        <div className="font-mono text-[11px] text-slate-400">
          Selected Target: <strong className="text-white">{selectedCity.name}, {selectedCity.country}</strong> (
          {selectedCity.lat.toFixed(4)}° N, {selectedCity.lng.toFixed(4)}° E)
        </div>
        <div className="font-mono text-[10px] text-slate-500 flex items-center gap-2">
          <span>Constellation: Sentinel-2A & GPM Core Active</span>
          <span>•</span>
          <span>Teleconnection Arcs: 4 Live Synced</span>
        </div>
      </div>

      {/* Hovered City Floating Tooltip Card */}
      {hoveredCity && (
        <div className="absolute top-24 left-6 pointer-events-none glass-panel p-3.5 rounded-xl border border-cyan-500/40 max-w-xs transition-all animate-in fade-in shadow-2xl z-20">
          <div className="flex items-center justify-between gap-3">
            <span className="font-heading font-bold text-white text-sm tracking-wide">
              {hoveredCity.name}
            </span>
            <span
              className={`text-[9px] font-mono px-2 py-0.5 rounded font-extrabold uppercase tracking-wider ${
                hoveredCity.riskLevel === 'CRITICAL'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-sm'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
              }`}
            >
              {hoveredCity.riskLevel}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed font-sans">
            {hoveredCity.description}
          </p>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2.5 pt-2 border-t border-white/10">
            <span>Air Temp: <strong className="text-cyan-300">{hoveredCity.currentTemp}°C</strong></span>
            <span>Risk Score: <strong className="text-amber-400">{hoveredCity.riskScore}/100</strong></span>
          </div>
        </div>
      )}

      {/* Top Right Quick Launch Digital Twin Button */}
      <div className="absolute top-6 right-6 flex items-center gap-2 z-10">
        <button
          onClick={handleEnterTwinView}
          disabled={isTransitioning}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs tracking-wider uppercase shadow-xl shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Navigation className="w-4 h-4 fill-slate-950" />
          <span>Launch {selectedCity.name} 0.5m LiDAR Twin</span>
        </button>
      </div>

      {/* Bottom Left 3D Camera & Layer Controls Bar */}
      <div className="absolute bottom-6 left-6 flex items-center gap-2 glass-panel px-3 py-1.5 rounded-xl border border-cyan-500/20 shadow-2xl z-10 backdrop-blur-xl">
        <button
          onClick={() => {
            soundFx.playClick();
            setAutoRotate(!autoRotate);
          }}
          title="Toggle Planetary Auto-Rotation"
          className={`p-2 rounded-lg transition-colors ${
            autoRotate ? 'text-cyan-400 bg-cyan-500/15' : 'text-slate-400 hover:text-white'
          }`}
        >
          <RotateCw className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-white/10" />

        <button
          onClick={() => handleZoom(-35)}
          title="Zoom Orbit In"
          className="p-2 rounded-lg text-slate-400 hover:text-white transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleZoom(35)}
          title="Zoom Orbit Out"
          className="p-2 rounded-lg text-slate-400 hover:text-white transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-white/10" />

        <button
          onClick={() => {
            soundFx.playClick();
            setShowClouds(!showClouds);
            if (cloudsMeshRef.current) cloudsMeshRef.current.visible = !showClouds;
          }}
          title="Toggle Volumetric Clouds & Cyclones"
          className={`p-2 rounded-lg transition-colors ${
            showClouds ? 'text-cyan-400 bg-cyan-500/15' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            soundFx.playClick();
            setShowAtmosphere(!showAtmosphere);
            if (atmosphereMeshRef.current) atmosphereMeshRef.current.visible = !showAtmosphere;
          }}
          title="Toggle Atmospheric Rayleigh Scattering Halo"
          className={`p-2 rounded-lg transition-colors ${
            showAtmosphere ? 'text-cyan-400 bg-cyan-500/15' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Eye className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            soundFx.playClick();
            const next = !showNightLights;
            setShowNightLights(next);
            if (earthMatRef.current) {
              earthMatRef.current.uniforms.uNightLightsMix.value = next ? 1.0 : 0.0;
            }
          }}
          title="Toggle Metropolitan Night Lights"
          className={`p-2 rounded-lg transition-colors ${
            showNightLights ? 'text-amber-400 bg-amber-500/15' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-white/10" />

        <button
          onClick={() => {
            soundFx.playClick();
            const next = !showSatellites;
            setShowSatellites(next);
            if (satellitesGroupRef.current) satellitesGroupRef.current.visible = next;
          }}
          title="Toggle Satellite Constellation"
          className={`p-2 rounded-lg transition-colors ${
            showSatellites ? 'text-cyan-400 bg-cyan-500/15' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Satellite className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            soundFx.playClick();
            const next = !showArcs;
            setShowArcs(next);
            if (arcsGroupRef.current) arcsGroupRef.current.visible = next;
          }}
          title="Toggle Global Teleconnection Arcs"
          className={`p-2 rounded-lg transition-colors ${
            showArcs ? 'text-purple-400 bg-purple-500/15' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* Cinematic Transition Zoom Flash Overlay */}
      {isTransitioning && (
        <div className="absolute inset-0 bg-cyan-950/50 backdrop-blur-md pointer-events-none transition-opacity duration-700 flex items-center justify-center z-30">
          <div className="text-center font-mono animate-in fade-in">
            <div className="text-cyan-300 text-sm tracking-widest uppercase font-bold animate-pulse">
              Locking Hyper-Local High-Resolution LiDAR Spatial Grid...
            </div>
            <div className="text-slate-300 text-xs mt-1">
              Acquiring Hydro-LiDAR Catchments for {selectedCity.name}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
