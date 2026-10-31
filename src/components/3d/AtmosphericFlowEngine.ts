import * as THREE from 'three';

export type FlowMode = 'wind' | 'ocean' | 'monsoon';

export interface FlowEngineOptions {
  radius?: number;
  particleCount?: number;
  mode?: FlowMode;
  speedScale?: number;
}

export class AtmosphericFlowEngine {
  public group: THREE.Group;
  private particleCount: number;
  private radius: number;
  private mode: FlowMode;
  private speedScale: number;

  private pointsMesh: THREE.Points;
  private linesMesh: THREE.LineSegments;
  private positions: Float32Array;
  private colors: Float32Array;
  private linePositions: Float32Array;
  private lineColors: Float32Array;
  private ages: Float32Array;
  private maxAges: Float32Array;
  private speeds: Float32Array;

  // Cached vector math
  private pVec = new THREE.Vector3();
  private vVec = new THREE.Vector3();

  constructor(options: FlowEngineOptions = {}) {
    this.radius = options.radius ?? 101.6;
    this.particleCount = options.particleCount ?? 3600;
    this.mode = options.mode ?? 'monsoon';
    this.speedScale = options.speedScale ?? 1.2;

    this.group = new THREE.Group();

    // Allocate arrays for particles (points) and trails (line segments)
    this.positions = new Float32Array(this.particleCount * 3);
    this.colors = new Float32Array(this.particleCount * 3);
    this.linePositions = new Float32Array(this.particleCount * 6); // 2 vertices per line (head and tail)
    this.lineColors = new Float32Array(this.particleCount * 6);
    this.ages = new Float32Array(this.particleCount);
    this.maxAges = new Float32Array(this.particleCount);
    this.speeds = new Float32Array(this.particleCount);

    this.initParticles();

    // 1. Particle Points Geometry
    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    pointsGeo.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));

    // Particle Points Glow Texture
    const pointTexture = this.createParticleTexture();
    const pointsMat = new THREE.PointsMaterial({
      size: 3.2,
      map: pointTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      depthWrite: false,
      opacity: 0.85,
    });
    this.pointsMesh = new THREE.Points(pointsGeo, pointsMat);
    this.group.add(this.pointsMesh);

    // 2. Trailing Streamlines Geometry (Lines)
    const linesGeo = new THREE.BufferGeometry();
    linesGeo.setAttribute('position', new THREE.BufferAttribute(this.linePositions, 3));
    linesGeo.setAttribute('color', new THREE.BufferAttribute(this.lineColors, 3));

    const linesMat = new THREE.LineBasicMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      depthWrite: false,
      opacity: 0.65,
    });
    this.linesMesh = new THREE.LineSegments(linesGeo, linesMat);
    this.group.add(this.linesMesh);
  }

  private createParticleTexture(): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.2, 'rgba(34, 211, 238, 0.9)');
    grad.addColorStop(0.6, 'rgba(59, 130, 246, 0.4)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(32, 32, 30, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  private randomSpherePoint(target: THREE.Vector3, biasTowardBayOfBengal = false) {
    if (biasTowardBayOfBengal && Math.random() < 0.35) {
      // Spawn near Indian Ocean / Bay of Bengal (lat 5 to 25, lon 65 to 95)
      const lat = 5 + Math.random() * 20;
      const lon = 65 + Math.random() * 30;
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      target.set(
        -(this.radius * Math.sin(phi) * Math.cos(theta)),
        this.radius * Math.cos(phi),
        this.radius * Math.sin(phi) * Math.sin(theta)
      );
      return;
    }

    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = this.radius;
    const sinPhi = Math.sin(phi);
    target.set(r * sinPhi * Math.cos(theta), r * Math.cos(phi), r * sinPhi * Math.sin(theta));
  }

  private initParticles() {
    for (let i = 0; i < this.particleCount; i++) {
      this.randomSpherePoint(this.pVec, true);
      const i3 = i * 3;
      const i6 = i * 6;

      this.positions[i3] = this.pVec.x;
      this.positions[i3 + 1] = this.pVec.y;
      this.positions[i3 + 2] = this.pVec.z;

      // Line tail starts at same position
      this.linePositions[i6] = this.pVec.x;
      this.linePositions[i6 + 1] = this.pVec.y;
      this.linePositions[i6 + 2] = this.pVec.z;
      this.linePositions[i6 + 3] = this.pVec.x;
      this.linePositions[i6 + 4] = this.pVec.y;
      this.linePositions[i6 + 5] = this.pVec.z;

      this.ages[i] = Math.random() * 120;
      this.maxAges[i] = 120 + Math.random() * 80;
      this.speeds[i] = 1.0;

      // Default cyan/blue color
      this.colors[i3] = 0.13;
      this.colors[i3 + 1] = 0.82;
      this.colors[i3 + 2] = 0.93;

      this.lineColors[i6] = 0.1;
      this.lineColors[i6 + 1] = 0.4;
      this.lineColors[i6 + 2] = 0.8;
      this.lineColors[i6 + 3] = 0.13;
      this.lineColors[i6 + 4] = 0.82;
      this.lineColors[i6 + 5] = 0.93;
    }
  }

  /**
   * Geophysical Spherical Velocity Field
   * Computes zonal (U) and meridional (V) speed in degrees per second
   */
  private getVelocity(lat: number, lon: number): { u: number; v: number } {
    let u = 0;
    let v = 0;

    if (this.mode === 'wind') {
      // 1. Planetary Atmospheric Wind Circulation
      if (Math.abs(lat) < 28) {
        // Trade Winds: East to West
        u = -1.8;
        v = lat > 0 ? -0.4 : 0.4; // Hadley convergence
      } else if (Math.abs(lat) < 62) {
        // Mid-latitude Jet Stream with Rossby wave undulations
        const wave = Math.sin((lon * 4 * Math.PI) / 180 + Date.now() * 0.0008);
        u = 3.6 + wave * 1.5;
        v = wave * 1.2;
      } else {
        // Polar Easterlies
        u = -1.1;
        v = lat > 0 ? -0.3 : 0.3;
      }
    } else if (this.mode === 'ocean') {
      // 2. Oceanic Thermohaline Currents
      // Gulf stream & Kuroshio clockwise gyres in north, counter-clockwise in south
      const gyreDir = lat > 0 ? 1 : -1;
      u = Math.sin((lat * Math.PI) / 35) * 2.2 * gyreDir;
      v = Math.cos((lon * Math.PI) / 60) * 1.1;

      // Equatorial counter-current
      if (Math.abs(lat) < 8) {
        u = 1.6;
        v = 0;
      }
    } else {
      // 3. Indian Ocean Monsoon & Bay of Bengal Cyclone Vortex (Default)
      // Base wind belts
      if (Math.abs(lat) < 28) {
        u = -1.5;
        v = lat > 0 ? -0.5 : 0.5;
      } else if (Math.abs(lat) < 62) {
        u = 3.2;
        v = Math.sin((lon * 3 * Math.PI) / 180) * 1.2;
      }

      // Strong Southwest Monsoon surge into Arabian Sea & Bay of Bengal
      if (lat >= -5 && lat <= 26 && lon >= 50 && lon <= 100) {
        u = 2.8;
        v = 2.2; // Rushing northeast toward Indian subcontinent
      }

      // Bay of Bengal Cyclone Vortex (Centered near 13.5°N, 84.5°E - just off Chennai)
      const cycloneLat = 13.5;
      const cycloneLon = 84.5;
      const dLat = lat - cycloneLat;
      const dLon = lon - cycloneLon;
      const dist = Math.sqrt(dLat * dLat + dLon * dLon);

      if (dist < 28) {
        const angle = Math.atan2(dLat, dLon) + 0.45; // Inward cyclonic spiral
        const vortexStrength = Math.max(0, 1 - dist / 28) * 5.2;
        u += -Math.sin(angle) * vortexStrength;
        v += Math.cos(angle) * vortexStrength;
      }
    }

    return { u: u * this.speedScale, v: v * this.speedScale };
  }

  public update(deltaTime: number = 0.016) {
    const r = this.radius;
    const dt = deltaTime * 1.0;

    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      const i6 = i * 6;

      this.ages[i]++;

      // Respawn dead or out-of-bounds particles
      if (this.ages[i] > this.maxAges[i]) {
        this.randomSpherePoint(this.pVec, this.mode === 'monsoon');
        this.positions[i3] = this.pVec.x;
        this.positions[i3 + 1] = this.pVec.y;
        this.positions[i3 + 2] = this.pVec.z;

        this.linePositions[i6] = this.pVec.x;
        this.linePositions[i6 + 1] = this.pVec.y;
        this.linePositions[i6 + 2] = this.pVec.z;
        this.linePositions[i6 + 3] = this.pVec.x;
        this.linePositions[i6 + 4] = this.pVec.y;
        this.linePositions[i6 + 5] = this.pVec.z;

        this.ages[i] = 0;
        this.maxAges[i] = 90 + Math.random() * 80;
        continue;
      }

      // Current 3D position
      const px = this.positions[i3];
      const py = this.positions[i3 + 1];
      const pz = this.positions[i3 + 2];

      // Save previous position into line tail
      this.linePositions[i6] = px;
      this.linePositions[i6 + 1] = py;
      this.linePositions[i6 + 2] = pz;

      // Convert Cartesian (x, y, z) to Latitude & Longitude
      const lat = Math.asin(Math.max(-1, Math.min(1, py / r))) * (180 / Math.PI);
      const lon = Math.atan2(pz, -px) * (180 / Math.PI);

      // Evaluate physical velocity field
      const { u, v } = this.getVelocity(lat, lon);
      const speed = Math.sqrt(u * u + v * v);
      this.speeds[i] = speed;

      // Unit vectors tangent to sphere at this point
      const radLat = (lat * Math.PI) / 180;
      const radLon = (lon * Math.PI) / 180;

      // Eastward unit vector
      const eEastX = -Math.sin(radLon);
      const eEastY = 0;
      const eEastZ = Math.cos(radLon);

      // Northward unit vector
      const eNorthX = -Math.sin(radLat) * Math.cos(radLon);
      const eNorthY = Math.cos(radLat);
      const eNorthZ = -Math.sin(radLat) * Math.sin(radLon);

      // 3D velocity step
      const stepScale = 0.35 * dt;
      const vx = (u * eEastX + v * eNorthX) * stepScale;
      const vy = (u * eEastY + v * eNorthY) * stepScale;
      const vz = (u * eEastZ + v * eNorthZ) * stepScale;

      let nextX = px + vx;
      let nextY = py + vy;
      let nextZ = pz + vz;

      // Re-project onto sphere surface of radius r
      const len = Math.sqrt(nextX * nextX + nextY * nextY + nextZ * nextZ);
      if (len > 0.0001) {
        nextX = (nextX / len) * r;
        nextY = (nextY / len) * r;
        nextZ = (nextZ / len) * r;
      }

      // Update positions
      this.positions[i3] = nextX;
      this.positions[i3 + 1] = nextY;
      this.positions[i3 + 2] = nextZ;

      // Line head gets current position
      this.linePositions[i6 + 3] = nextX;
      this.linePositions[i6 + 4] = nextY;
      this.linePositions[i6 + 5] = nextZ;

      // Dynamic color gradient based on speed and life
      const lifeRatio = this.ages[i] / this.maxAges[i];
      const alpha = Math.sin(lifeRatio * Math.PI); // Smooth fade in and out

      // Color mapping: low speed = cyan, medium = electric blue, high/cyclonic = magenta/purple
      let cr = 0.13;
      let cg = 0.82;
      let cb = 0.93;

      if (speed > 4.0) {
        // High speed Jet / Cyclone: Aurora Purple & Magenta
        cr = 0.75 * alpha;
        cg = 0.35 * alpha;
        cb = 0.98 * alpha;
      } else if (speed > 2.2) {
        // Moderate: Electric Blue
        cr = 0.23 * alpha;
        cg = 0.51 * alpha;
        cb = 0.96 * alpha;
      } else {
        // Baseline: Vivid Cyan
        cr = 0.13 * alpha;
        cg = 0.82 * alpha;
        cb = 0.93 * alpha;
      }

      this.colors[i3] = cr;
      this.colors[i3 + 1] = cg;
      this.colors[i3 + 2] = cb;

      // Trail vertex colors
      this.lineColors[i6] = cr * 0.3;
      this.lineColors[i6 + 1] = cg * 0.3;
      this.lineColors[i6 + 2] = cb * 0.3;
      this.lineColors[i6 + 3] = cr;
      this.lineColors[i6 + 4] = cg;
      this.lineColors[i6 + 5] = cb;
    }

    this.pointsMesh.geometry.attributes.position.needsUpdate = true;
    this.pointsMesh.geometry.attributes.color.needsUpdate = true;
    this.linesMesh.geometry.attributes.position.needsUpdate = true;
    this.linesMesh.geometry.attributes.color.needsUpdate = true;
  }

  public setMode(mode: FlowMode) {
    this.mode = mode;
    this.initParticles();
  }

  public setSpeedScale(scale: number) {
    this.speedScale = scale;
  }

  public setVisible(visible: boolean) {
    this.group.visible = visible;
  }

  public dispose() {
    this.pointsMesh.geometry.dispose();
    (this.pointsMesh.material as THREE.Material).dispose();
    this.linesMesh.geometry.dispose();
    (this.linesMesh.material as THREE.Material).dispose();
  }
}
