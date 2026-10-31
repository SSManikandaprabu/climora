import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { X, Droplets, Eye, AlertTriangle, ShieldCheck, ArrowRight, RotateCw, ZoomIn, ZoomOut, Compass } from 'lucide-react';
import { soundFx } from '../../utils/audioSynthesizer';

interface StreetInundationViewerProps {
  isOpen: boolean;
  onClose: () => void;
  junctionName?: string;
}

export const StreetInundationViewer: React.FC<StreetInundationViewerProps> = ({
  isOpen,
  onClose,
  junctionName = 'Velachery MRTS Underpass & Vijayanagar Junction',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [waterDepth, setWaterDepth] = useState<number>(0.85); // meters (0.0 to 2.5m)
  const [cameraPerspective, setCameraPerspective] = useState<'driver' | 'pedestrian' | 'overhead'>('pedestrian');

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const waterMeshRef = useRef<THREE.Mesh | null>(null);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen || !mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. SCENE
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1120);
    scene.fog = new THREE.FogExp2(0x0a1120, 0.025);
    sceneRef.current = scene;

    // 2. CAMERA
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 500);
    camera.position.set(0, 1.8, 14);
    camera.lookAt(0, 1.0, 0);
    cameraRef.current = camera;

    // 3. RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. LIGHTING
    const ambientLight = new THREE.AmbientLight(0xdbeafe, 0.8);
    scene.add(ambientLight);

    const streetLampLight = new THREE.DirectionalLight(0xffedd5, 1.6);
    streetLampLight.position.set(8, 15, 10);
    scene.add(streetLampLight);

    const emergencyFlashLight = new THREE.PointLight(0xef4444, 2.5, 30);
    emergencyFlashLight.position.set(-6, 3, 2);
    scene.add(emergencyFlashLight);

    // 5. 3D ROAD SURFACE & SIDEWALKS
    // Asphalt Roadway
    const roadGeo = new THREE.PlaneGeometry(16, 60);
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    roadMesh.rotation.x = -Math.PI / 2;
    roadMesh.position.y = 0;
    scene.add(roadMesh);

    // Road White Dividing Strips
    for (let z = -25; z <= 25; z += 6) {
      const stripeGeo = new THREE.PlaneGeometry(0.3, 3);
      const stripeMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
      const stripe = new THREE.Mesh(stripeGeo, stripeMat);
      stripe.rotation.x = -Math.PI / 2;
      stripe.position.set(0, 0.01, z);
      scene.add(stripe);
    }

    // Concrete Sidewalks (Left and Right)
    const sidewalkGeo = new THREE.BoxGeometry(4, 0.25, 60);
    const sidewalkMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 });

    const leftWalk = new THREE.Mesh(sidewalkGeo, sidewalkMat);
    leftWalk.position.set(-10, 0.125, 0);
    scene.add(leftWalk);

    const rightWalk = new THREE.Mesh(sidewalkGeo, sidewalkMat);
    rightWalk.position.set(10, 0.125, 0);
    scene.add(rightWalk);

    // 6. BUILDINGS & MRTS ELEVATED FLYOVER PILLARS
    // MRTS Flyover Pillars in Middle
    const pillarGeo = new THREE.CylinderGeometry(1.2, 1.4, 18, 16);
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.7 });
    for (let z = -20; z <= 20; z += 18) {
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(-5, 9, z);
      scene.add(pillar);
    }

    // Overhead Metro Viaduct Span
    const viaductGeo = new THREE.BoxGeometry(10, 2, 60);
    const viaductMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
    const viaduct = new THREE.Mesh(viaductGeo, viaductMat);
    viaduct.position.set(-5, 17, 0);
    scene.add(viaduct);

    // Commercial Storefront Buildings on Right
    for (let z = -24; z <= 24; z += 12) {
      const bldgGeo = new THREE.BoxGeometry(8, 16, 10);
      const bldgMat = new THREE.MeshStandardMaterial({
        color: z % 2 === 0 ? 0x1e293b : 0x0f172a,
        roughness: 0.5,
      });
      const bldg = new THREE.Mesh(bldgGeo, bldgMat);
      bldg.position.set(16, 8, z);
      scene.add(bldg);

      // Glass storefront window
      const winGeo = new THREE.BoxGeometry(0.2, 3.5, 7);
      const winMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, metalness: 0.8 });
      const win = new THREE.Mesh(winGeo, winMat);
      win.position.set(11.9, 2.0, z);
      scene.add(win);
    }

    // Depth Gauge Measuring Rod against Pillar
    const rulerGeo = new THREE.BoxGeometry(0.15, 3.0, 0.3);
    const rulerMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    const ruler = new THREE.Mesh(rulerGeo, rulerMat);
    ruler.position.set(-3.7, 1.5, 0);
    scene.add(ruler);

    // 7. DYNAMIC 3D FLOOD WATER PLANE
    const waterGeo = new THREE.PlaneGeometry(40, 60, 32, 32);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.1,
      metalness: 0.3,
      transparent: true,
      opacity: 0.82,
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.y = waterDepth;
    scene.add(waterMesh);
    waterMeshRef.current = waterMesh;

    // ANIMATION TICK LOOP
    const clock = new THREE.Clock();
    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Subtle water ripple undulation
      if (waterMeshRef.current) {
        waterMeshRef.current.position.y = waterDepth + Math.sin(elapsedTime * 2.2) * 0.02;
      }

      // Flashing emergency siren
      emergencyFlashLight.intensity = 1.5 + Math.sin(elapsedTime * 6.0) * 1.5;

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
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [isOpen]);

  // Adjust camera based on perspective selector
  useEffect(() => {
    if (!cameraRef.current) return;
    const camera = cameraRef.current;
    if (cameraPerspective === 'driver') {
      camera.position.set(2, 1.1, 8);
      camera.lookAt(0, 0.8, -10);
    } else if (cameraPerspective === 'pedestrian') {
      camera.position.set(-8, 1.7, 10);
      camera.lookAt(0, 1.0, -5);
    } else {
      camera.position.set(0, 6.5, 18);
      camera.lookAt(0, 1.0, 0);
    }
  }, [cameraPerspective]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none animate-in fade-in">
      <div className="w-full max-w-4xl max-h-[92vh] glass-panel-elevated rounded-2xl border border-cyan-500/30 text-white flex flex-col shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-base text-white">
                  First-Person 3D Street-Level Inundation Camera
                </h3>
                <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold uppercase tracking-wider">
                  0.5m LiDAR GROUND SIM
                </span>
              </div>
              <div className="font-mono text-xs text-slate-400">
                {junctionName}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3D Viewport View */}
        <div className="relative w-full h-80 sm:h-96 bg-slate-950 overflow-hidden">
          <div ref={mountRef} className="w-full h-full" />

          {/* Perspective Angle Switcher Overlay */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 p-1 rounded-xl glass-panel text-xs font-mono border border-white/10">
            <button
              onClick={() => {
                soundFx.playClick();
                setCameraPerspective('driver');
              }}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                cameraPerspective === 'driver' ? 'bg-cyan-500/25 text-cyan-200 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Driver View (1.1m)
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setCameraPerspective('pedestrian');
              }}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                cameraPerspective === 'pedestrian' ? 'bg-cyan-500/25 text-cyan-200 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sidewalk (1.7m)
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setCameraPerspective('overhead');
              }}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                cameraPerspective === 'overhead' ? 'bg-cyan-500/25 text-cyan-200 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Overhead Deck (6.5m)
            </button>
          </div>

          {/* Real-Time Depth Watermark */}
          <div className="absolute top-4 right-4 z-10 p-2.5 rounded-xl glass-panel border border-blue-500/30 text-right font-mono">
            <span className="text-[10px] text-slate-400 block uppercase">Inundation Stage</span>
            <span className="text-2xl font-extrabold text-cyan-300">
              {waterDepth.toFixed(2)}m
            </span>
            <span className="text-[10px] text-slate-400 block">Standing Water</span>
          </div>
        </div>

        {/* Depth Controller & Physical Impact Matrix */}
        <div className="p-5 space-y-4 bg-slate-900/40">
          {/* Depth Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-cyan-400" />
                Simulate Street Water Elevation Level:
              </span>
              <span className="text-cyan-300 font-bold text-sm">
                {waterDepth.toFixed(2)} meters
              </span>
            </div>

            <input
              type="range"
              min="0.0"
              max="2.2"
              step="0.05"
              value={waterDepth}
              onChange={(e) => setWaterDepth(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />

            <div className="flex justify-between font-mono text-[10px] text-slate-500">
              <span>0.0m (Dry)</span>
              <span>0.3m (Cars Stall)</span>
              <span>0.8m (Subgrid Trip)</span>
              <span>1.4m (Basement Flood)</span>
              <span>2.2m (Catastrophic Deluge)</span>
            </div>
          </div>

          {/* Critical Threshold Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
            <div className={`p-2.5 rounded-xl border ${waterDepth >= 0.3 ? 'bg-red-950/30 border-red-500/40 text-red-300' : 'bg-slate-900/60 border-white/5 text-slate-400'}`}>
              <span className="text-[10px] block uppercase">Vehicular Transit</span>
              <span className="font-bold text-white text-xs mt-0.5 block">
                {waterDepth >= 0.3 ? 'Stalled / Submerged' : 'Passable'}
              </span>
              <span className="text-[9px] text-slate-500 block">Threshold: 0.30m</span>
            </div>

            <div className={`p-2.5 rounded-xl border ${waterDepth >= 0.8 ? 'bg-amber-950/30 border-amber-500/40 text-amber-300' : 'bg-slate-900/60 border-white/5 text-slate-400'}`}>
              <span className="text-[10px] block uppercase">Power Substation Grid</span>
              <span className="font-bold text-white text-xs mt-0.5 block">
                {waterDepth >= 0.8 ? 'Grid Trip / Blackout' : 'Energized'}
              </span>
              <span className="text-[9px] text-slate-500 block">Threshold: 0.80m</span>
            </div>

            <div className={`p-2.5 rounded-xl border ${waterDepth >= 1.2 ? 'bg-red-950/30 border-red-500/40 text-red-300' : 'bg-slate-900/60 border-white/5 text-slate-400'}`}>
              <span className="text-[10px] block uppercase">Ground Floor Assets</span>
              <span className="font-bold text-white text-xs mt-0.5 block">
                {waterDepth >= 1.2 ? 'Direct Inundation' : 'Protected'}
              </span>
              <span className="text-[9px] text-slate-500 block">Threshold: 1.20m</span>
            </div>

            <div className={`p-2.5 rounded-xl border ${waterDepth >= 1.8 ? 'bg-red-950/40 border-red-500/60 text-red-300 animate-pulse' : 'bg-slate-900/60 border-white/5 text-slate-400'}`}>
              <span className="text-[10px] block uppercase">Rescue Transport</span>
              <span className="font-bold text-white text-xs mt-0.5 block">
                {waterDepth >= 1.8 ? 'Boats Required Only' : 'Wheeled Transit'}
              </span>
              <span className="text-[9px] text-slate-500 block">Threshold: 1.80m</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
