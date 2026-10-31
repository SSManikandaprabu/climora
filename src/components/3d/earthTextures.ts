import * as THREE from 'three';

/**
 * Ultra-High-Fidelity Procedural Earth Texture Engine
 * Generates photorealistic day diffuse with distinct biomes and bathymetry,
 * NASA Black Marble night city lights, specular ocean reflection masks,
 * and volumetric cyclone cloud formations.
 */

export function createEarthTextures() {
  const width = 4096;
  const height = 2048;

  // Coordinate projector: (lon, lat) -> (canvasX, canvasY)
  const p = (lon: number, lat: number): [number, number] => [
    ((lon + 180) / 360) * width,
    ((90 - lat) / 180) * height,
  ];

  // ==========================================
  // 1. DAY DIFFUSE TEXTURE CANVAS (Biomes & Bathymetry)
  // ==========================================
  const dayCanvas = document.createElement('canvas');
  dayCanvas.width = width;
  dayCanvas.height = height;
  const dCtx = dayCanvas.getContext('2d')!;

  // Deep oceanic bathymetric depth gradient
  const oceanGrad = dCtx.createRadialGradient(
    width * 0.5, height * 0.5, 200,
    width * 0.5, height * 0.5, width * 0.6
  );
  oceanGrad.addColorStop(0, '#06172e');
  oceanGrad.addColorStop(0.4, '#041024');
  oceanGrad.addColorStop(0.8, '#030a18');
  oceanGrad.addColorStop(1, '#020610');
  dCtx.fillStyle = oceanGrad;
  dCtx.fillRect(0, 0, width, height);

  // Helper to draw smooth coastline landmasses with biome shading
  const drawDetailedLandmass = (
    coords: [number, number][],
    baseColor: string,
    shelfColor = 'rgba(26, 92, 148, 0.45)',
    shelfWidth = 18
  ) => {
    // 1. Continental shelf shallow glow
    dCtx.beginPath();
    coords.forEach(([lon, lat], idx) => {
      const [x, y] = p(lon, lat);
      if (idx === 0) dCtx.moveTo(x, y);
      else dCtx.lineTo(x, y);
    });
    dCtx.closePath();
    dCtx.strokeStyle = shelfColor;
    dCtx.lineWidth = shelfWidth;
    dCtx.lineJoin = 'round';
    dCtx.stroke();

    // 2. High-precision landmass fill
    dCtx.beginPath();
    coords.forEach(([lon, lat], idx) => {
      const [x, y] = p(lon, lat);
      if (idx === 0) dCtx.moveTo(x, y);
      else dCtx.lineTo(x, y);
    });
    dCtx.closePath();
    dCtx.fillStyle = baseColor;
    dCtx.fill();
    dCtx.strokeStyle = '#225039';
    dCtx.lineWidth = 1.5;
    dCtx.stroke();
  };

  // --- EURASIA CONTINENTAL COMPLEX ---
  drawDetailedLandmass([
    [-9, 36], [-8, 43], [0, 44], [3, 47], [9, 54], [14, 55], [20, 60], [28, 70], [42, 68], [60, 70],
    [75, 73], [95, 76], [120, 74], [145, 72], [170, 68], [178, 64], [168, 58], [150, 52], [140, 44],
    [130, 36], [122, 30], [118, 22], [108, 18], [105, 10], [100, 4], [96, 16], [90, 22], [88, 27],
    [80, 26], [75, 25], [68, 24], [60, 25], [54, 20], [44, 12], [40, 22], [32, 32], [26, 38], [16, 40],
    [5, 36], [-9, 36]
  ], '#193325');

  // --- DETAILED INDIAN SUBCONTINENT (Centred with Bay of Bengal Basin) ---
  drawDetailedLandmass([
    [68.5, 24.2], [70.2, 21.1], [72.8, 19.0], [73.5, 15.5], [74.8, 12.8], [76.5, 9.5],
    [77.5, 8.1], // Kanyakumari cape
    [78.5, 9.2], [79.8, 10.4],
    [80.27, 13.08], // Chennai port apex
    [80.5, 15.5], [82.5, 17.2], [85.0, 19.5], [87.5, 21.6], [89.0, 22.5],
    [91.5, 24.0], [88.5, 27.2], [85.0, 28.5], [80.0, 30.5], [76.0, 32.5], [72.5, 31.0],
    [68.5, 24.2]
  ], '#224832', 'rgba(34, 211, 238, 0.45)', 24);

  // Sri Lanka
  drawDetailedLandmass([
    [79.8, 9.2], [81.5, 8.5], [81.8, 6.8], [80.5, 6.0], [79.8, 9.2]
  ], '#224832', 'rgba(34, 211, 238, 0.35)', 12);

  // --- AFRICA ---
  drawDetailedLandmass([
    [-17, 14], [-16, 22], [-10, 30], [-5, 36], [10, 37], [24, 32], [32, 31], [42, 22], [51, 12],
    [45, 0], [40, -12], [35, -24], [28, -34], [18, -34], [12, -22], [8, -6], [2, 4], [-12, 6], [-17, 14]
  ], '#2f351f');

  // Sahara Arid Gold Dune Overlay
  dCtx.fillStyle = 'rgba(164, 132, 75, 0.65)';
  dCtx.beginPath();
  const [sx, sy] = p(-12, 32);
  dCtx.moveTo(sx, sy);
  const [sx2, sy2] = p(35, 30);
  dCtx.lineTo(sx2, sy2);
  const [sx3, sy3] = p(40, 16);
  dCtx.lineTo(sx3, sy3);
  const [sx4, sy4] = p(-10, 16);
  dCtx.lineTo(sx4, sy4);
  dCtx.closePath();
  dCtx.fill();

  // --- NORTH AMERICA ---
  drawDetailedLandmass([
    [-168, 66], [-145, 70], [-120, 72], [-90, 70], [-65, 58], [-55, 48], [-68, 44], [-76, 35],
    [-80, 25], [-88, 28], [-97, 24], [-104, 20], [-115, 30], [-124, 48], [-135, 58], [-162, 60], [-168, 66]
  ], '#1d3526');

  // --- SOUTH AMERICA ---
  drawDetailedLandmass([
    [-76, 9], [-60, 10], [-45, -2], [-35, -5], [-37, -15], [-45, -24], [-55, -36], [-66, -54],
    [-74, -46], [-72, -30], [-78, -14], [-81, -4], [-76, 9]
  ], '#183824');

  // --- AUSTRALIA ---
  drawDetailedLandmass([
    [114, -22], [122, -14], [135, -12], [146, -16], [152, -26], [150, -36],
    [138, -36], [128, -32], [115, -34], [114, -22]
  ], '#45351c');

  // Great Barrier Reef Cyan Lagoon
  dCtx.strokeStyle = 'rgba(34, 211, 238, 0.7)';
  dCtx.lineWidth = 14;
  dCtx.beginPath();
  const [gx1, gy1] = p(143, -13);
  const [gx2, gy2] = p(152, -24);
  dCtx.moveTo(gx1, gy1);
  dCtx.lineTo(gx2, gy2);
  dCtx.stroke();

  // --- POLAR ICE SHEETS (Antarctica & Greenland) ---
  dCtx.fillStyle = '#e2e8f0';
  // Antarctica
  dCtx.beginPath();
  dCtx.rect(0, height * 0.90, width, height * 0.10);
  dCtx.fill();
  // Greenland
  drawDetailedLandmass([
    [-50, 60], [-35, 62], [-20, 70], [-25, 80], [-55, 82], [-65, 75], [-50, 60]
  ], '#f1f5f9', 'rgba(186, 230, 253, 0.6)', 12);

  // --- HIMALAYAN SNOW-CAPPED MOUNTAINS RIDGE ---
  dCtx.strokeStyle = 'rgba(248, 250, 252, 0.85)';
  dCtx.lineWidth = 8;
  dCtx.lineCap = 'round';
  dCtx.beginPath();
  const [hx1, hy1] = p(74, 34);
  const [hx2, hy2] = p(94, 27);
  dCtx.moveTo(hx1, hy1);
  dCtx.lineTo(hx2, hy2);
  dCtx.stroke();

  // Subtle longitude & latitude cybernetic telemetry grid
  dCtx.strokeStyle = 'rgba(34, 211, 238, 0.09)';
  dCtx.lineWidth = 1;
  for (let lon = -180; lon <= 180; lon += 30) {
    const [x] = p(lon, 0);
    dCtx.beginPath();
    dCtx.moveTo(x, 0);
    dCtx.lineTo(x, height);
    dCtx.stroke();
  }
  for (let lat = -80; lat <= 80; lat += 20) {
    const [, y] = p(0, lat);
    dCtx.beginPath();
    dCtx.moveTo(0, y);
    dCtx.lineTo(width, y);
    dCtx.stroke();
  }

  // ==========================================
  // 2. NIGHT LIGHTS TEXTURE CANVAS (NASA Black Marble Style)
  // ==========================================
  const nightCanvas = document.createElement('canvas');
  nightCanvas.width = width;
  nightCanvas.height = height;
  const nCtx = nightCanvas.getContext('2d')!;

  nCtx.fillStyle = '#020409';
  nCtx.fillRect(0, 0, width, height);

  const drawCityGlow = (lon: number, lat: number, radius: number, intensity: number) => {
    const [x, y] = p(lon, lat);
    const grad = nCtx.createRadialGradient(x, y, 0, x, y, radius);
    grad.addColorStop(0, `rgba(255, 230, 150, ${intensity})`);
    grad.addColorStop(0.35, `rgba(255, 170, 70, ${intensity * 0.75})`);
    grad.addColorStop(0.7, `rgba(34, 211, 238, ${intensity * 0.35})`);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    nCtx.fillStyle = grad;
    nCtx.beginPath();
    nCtx.arc(x, y, radius, 0, Math.PI * 2);
    nCtx.fill();
  };

  // Dense Indian Metros & Corridors
  drawCityGlow(80.27, 13.08, 30, 1.0); // Chennai Master Node
  drawCityGlow(77.59, 12.97, 26, 0.95); // Bengaluru
  drawCityGlow(72.87, 19.07, 32, 1.0); // Mumbai
  drawCityGlow(77.20, 28.61, 32, 1.0); // Delhi NCR
  drawCityGlow(88.36, 22.57, 26, 0.9); // Kolkata
  drawCityGlow(78.48, 17.38, 24, 0.9); // Hyderabad
  drawCityGlow(76.95, 11.01, 16, 0.8); // Coimbatore

  // Global Megacities
  drawCityGlow(139.69, 35.68, 38, 1.0); // Tokyo
  drawCityGlow(121.47, 31.23, 34, 1.0); // Shanghai
  drawCityGlow(103.81, 1.35, 24, 0.95); // Singapore
  drawCityGlow(-0.12, 51.50, 32, 1.0); // London
  drawCityGlow(4.47, 51.92, 22, 0.9); // Rotterdam
  drawCityGlow(-74.00, 40.71, 36, 1.0); // New York
  drawCityGlow(-80.19, 25.76, 24, 0.9); // Miami
  drawCityGlow(55.27, 25.20, 28, 0.95); // Dubai

  // Glowing Infrastructure Highways
  nCtx.strokeStyle = 'rgba(255, 190, 90, 0.35)';
  nCtx.lineWidth = 1.4;
  const drawTransitLine = (from: [number, number], to: [number, number]) => {
    const [x1, y1] = p(from[0], from[1]);
    const [x2, y2] = p(to[0], to[1]);
    nCtx.beginPath();
    nCtx.moveTo(x1, y1);
    nCtx.lineTo(x2, y2);
    nCtx.stroke();
  };
  drawTransitLine([80.27, 13.08], [77.59, 12.97]); // Chennai-Bengaluru Golden Quadrilateral
  drawTransitLine([77.59, 12.97], [78.48, 17.38]); // Bengaluru-Hyderabad
  drawTransitLine([78.48, 17.38], [72.87, 19.07]); // Hyderabad-Mumbai
  drawTransitLine([72.87, 19.07], [77.20, 28.61]); // Mumbai-Delhi

  // ==========================================
  // 3. SPECULAR OCEAN MASK CANVAS
  // ==========================================
  const specCanvas = document.createElement('canvas');
  specCanvas.width = 2048;
  specCanvas.height = 1024;
  const sCtx = specCanvas.getContext('2d')!;

  // Water is 100% reflective white
  sCtx.fillStyle = '#ffffff';
  sCtx.fillRect(0, 0, 2048, 1024);

  // Black out landmasses so only oceans produce shiny specular glints
  const pS = (lon: number, lat: number): [number, number] => [
    ((lon + 180) / 360) * 2048,
    ((90 - lat) / 180) * 1024,
  ];
  const maskLand = (coords: [number, number][]) => {
    sCtx.beginPath();
    coords.forEach(([lon, lat], idx) => {
      const [x, y] = pS(lon, lat);
      if (idx === 0) sCtx.moveTo(x, y);
      else sCtx.lineTo(x, y);
    });
    sCtx.closePath();
    sCtx.fillStyle = '#080808';
    sCtx.fill();
  };
  maskLand([[-9, 36], [20, 60], [75, 73], [145, 72], [130, 36], [105, 10], [90, 22], [54, 20], [-9, 36]]);
  maskLand([[68.5, 24.2], [76.5, 9.5], [77.5, 8.1], [80.27, 13.08], [89.0, 22.5], [72.5, 31.0], [68.5, 24.2]]);
  maskLand([[-17, 14], [-5, 36], [24, 32], [51, 12], [28, -34], [8, -6], [-17, 14]]);
  maskLand([[-168, 66], [-90, 70], [-55, 48], [-80, 25], [-115, 30], [-168, 66]]);
  maskLand([[-76, 9], [-45, -2], [-37, -15], [-66, -54], [-78, -14], [-76, 9]]);
  maskLand([[114, -22], [135, -12], [152, -26], [138, -36], [114, -22]]);

  // ==========================================
  // 4. VOLUMETRIC CYCLONE & CLOUD CANVAS
  // ==========================================
  const cloudCanvas = document.createElement('canvas');
  cloudCanvas.width = 2048;
  cloudCanvas.height = 1024;
  const cCtx = cloudCanvas.getContext('2d')!;
  cCtx.fillStyle = 'rgba(0,0,0,0)';
  cCtx.fillRect(0, 0, 2048, 1024);

  const drawCloud = (cx: number, cy: number, rx: number, ry: number, op: number) => {
    const grad = cCtx.createRadialGradient(cx, cy, 0, cx, cy, rx);
    grad.addColorStop(0, `rgba(255, 255, 255, ${op})`);
    grad.addColorStop(0.5, `rgba(235, 248, 255, ${op * 0.65})`);
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    cCtx.fillStyle = grad;
    cCtx.beginPath();
    cCtx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    cCtx.fill();
  };

  // ITCZ Tropical Moisture Belt
  for (let x = 0; x < 2048; x += 30) {
    const yB = 512 + Math.sin(x * 0.012) * 70;
    drawCloud(x, yB + (Math.random() - 0.5) * 35, 50 + Math.random() * 45, 16 + Math.random() * 20, 0.48);
  }

  // Realistic Bay of Bengal Cyclone Spiral into Chennai Basin
  const [cycX, cycY] = pS(84.5, 14.0);
  for (let a = 0; a < Math.PI * 5.5; a += 0.18) {
    const rad = a * 11;
    const px = cycX + Math.cos(a) * rad;
    const py = cycY + Math.sin(a) * rad;
    drawCloud(px, py, 22 + a * 3.5, 14 + a * 2.2, 0.72 - a * 0.035);
  }

  // Convert to Three.js Textures
  const dayTexture = new THREE.CanvasTexture(dayCanvas);
  dayTexture.colorSpace = THREE.SRGBColorSpace;

  const nightTexture = new THREE.CanvasTexture(nightCanvas);
  nightTexture.colorSpace = THREE.SRGBColorSpace;

  const specTexture = new THREE.CanvasTexture(specCanvas);

  const cloudTexture = new THREE.CanvasTexture(cloudCanvas);
  cloudTexture.wrapS = THREE.RepeatWrapping;

  return { dayTexture, nightTexture, specTexture, cloudTexture };
}
