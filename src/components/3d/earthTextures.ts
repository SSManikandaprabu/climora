import * as THREE from 'three';

/**
 * Procedural High-Fidelity Earth Textures Generator
 * Creates realistic day diffuse, night city lights, specular ocean mask, and clouds
 */

export function createEarthTextures() {
  const width = 4096;
  const height = 2048;

  // 1. DAY DIFFUSE TEXTURE CANVAS
  const dayCanvas = document.createElement('canvas');
  dayCanvas.width = width;
  dayCanvas.height = height;
  const dCtx = dayCanvas.getContext('2d')!;

  // Deep ocean gradient
  const oceanGrad = dCtx.createLinearGradient(0, 0, 0, height);
  oceanGrad.addColorStop(0, '#040b17');
  oceanGrad.addColorStop(0.3, '#081c3b');
  oceanGrad.addColorStop(0.5, '#0a2347');
  oceanGrad.addColorStop(0.7, '#071833');
  oceanGrad.addColorStop(1, '#030813');
  dCtx.fillStyle = oceanGrad;
  dCtx.fillRect(0, 0, width, height);

  // Continental shelf shallows glow around coasts
  dCtx.strokeStyle = 'rgba(18, 70, 115, 0.45)';
  dCtx.lineWidth = 14;

  // Helper to project lon/lat to canvas coordinates
  const p = (lon: number, lat: number): [number, number] => [
    ((lon + 180) / 360) * width,
    ((90 - lat) / 180) * height,
  ];

  const drawPolygon = (
    coords: [number, number][],
    fillColor: string,
    strokeColor = '#1d486d',
    strokeWidth = 2
  ) => {
    dCtx.beginPath();
    coords.forEach(([lon, lat], idx) => {
      const [x, y] = p(lon, lat);
      if (idx === 0) dCtx.moveTo(x, y);
      else dCtx.lineTo(x, y);
    });
    dCtx.closePath();
    dCtx.fillStyle = fillColor;
    dCtx.fill();
    dCtx.strokeStyle = strokeColor;
    dCtx.lineWidth = strokeWidth;
    dCtx.stroke();
  };

  // Eurasia & Europe
  drawPolygon([
    [-10, 36], [0, 43], [12, 45], [18, 55], [30, 60], [45, 68], [70, 72], [100, 75], [140, 70], [170, 65],
    [180, 60], [160, 50], [140, 42], [130, 35], [120, 30], [110, 20], [105, 10], [98, 4], [90, 15],
    [80, 13], [75, 25], [60, 25], [52, 20], [45, 12], [42, 22], [32, 32], [24, 38], [10, 36], [-8, 36]
  ], '#152e22', '#1b4a36', 3);

  // India & South Asia (Precise subcontinent geometry)
  drawPolygon([
    [68, 24], [72, 31], [76, 32], [82, 30], [88, 27], [89, 22], [85, 18], [80.5, 13.1], // Chennai coast
    [79.8, 10], [77.5, 8], [76.5, 9.5], [74, 15], [72.8, 19], [70, 21], [68, 24]
  ], '#1e3d2b', '#26573c', 3);

  // Africa
  drawPolygon([
    [-17, 14], [-12, 26], [-5, 36], [10, 37], [22, 32], [32, 31], [40, 22], [50, 12], [45, 0],
    [40, -12], [35, -24], [28, -33], [18, -34], [12, -20], [8, -5], [2, 4], [-10, 5], [-17, 14]
  ], '#2c331a', '#3f4722', 3);

  // North America
  drawPolygon([
    [-168, 65], [-140, 70], [-100, 72], [-65, 60], [-55, 48], [-70, 42], [-76, 35], [-80, 25],
    [-88, 28], [-97, 24], [-105, 21], [-115, 32], [-124, 48], [-135, 58], [-160, 60], [-168, 65]
  ], '#162b1d', '#1e422c', 3);

  // South America
  drawPolygon([
    [-76, 8], [-60, 10], [-45, -2], [-35, -5], [-37, -15], [-45, -24], [-55, -35], [-68, -54],
    [-74, -45], [-72, -30], [-78, -12], [-81, -4], [-76, 8]
  ], '#12301c', '#1b4a2a', 3);

  // Australia
  drawPolygon([
    [114, -22], [122, -14], [135, -12], [145, -16], [152, -26], [150, -36],
    [138, -36], [128, -32], [115, -34], [114, -22]
  ], '#3a2d18', '#544122', 3);

  // Japan Islands
  drawPolygon([
    [130, 32], [135, 35], [140, 40], [142, 44], [140, 42], [136, 36], [130, 32]
  ], '#1e3828', '#2a5439', 2);

  // UK & Scandinavia
  drawPolygon([[-6, 50], [1, 52], [0, 58], [-5, 56], [-6, 50]], '#163321', '#224e32', 2);
  drawPolygon([[5, 58], [12, 56], [18, 60], [25, 70], [15, 68], [5, 58]], '#142a1c', '#1e422b', 2);

  // Mountain Ranges Topographic Relief (Himalayas, Andes, Rockies)
  dCtx.strokeStyle = 'rgba(215, 195, 160, 0.65)';
  dCtx.lineWidth = 6;
  dCtx.beginPath();
  // Himalayas ridge
  const [hx1, hy1] = p(72, 34);
  const [hx2, hy2] = p(92, 28);
  dCtx.moveTo(hx1, hy1);
  dCtx.lineTo(hx2, hy2);
  dCtx.stroke();

  // Andes ridge
  const [ax1, ay1] = p(-72, 8);
  const [ax2, ay2] = p(-68, -50);
  dCtx.beginPath();
  dCtx.moveTo(ax1, ay1);
  dCtx.lineTo(ax2, ay2);
  dCtx.stroke();

  // Cybernetic Latitude/Longitude Meridian grid lines
  dCtx.strokeStyle = 'rgba(34, 211, 238, 0.07)';
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

  // 2. NIGHT LIGHTS TEXTURE CANVAS (NASA Black Marble Style)
  const nightCanvas = document.createElement('canvas');
  nightCanvas.width = width;
  nightCanvas.height = height;
  const nCtx = nightCanvas.getContext('2d')!;

  // Pure dark space
  nCtx.fillStyle = '#020409';
  nCtx.fillRect(0, 0, width, height);

  // Glowing city metropolitan clusters
  const drawCityLight = (lon: number, lat: number, radius: number, intensity: number) => {
    const [x, y] = p(lon, lat);
    const grad = nCtx.createRadialGradient(x, y, 0, x, y, radius);
    grad.addColorStop(0, `rgba(255, 220, 130, ${intensity})`);
    grad.addColorStop(0.3, `rgba(255, 175, 70, ${intensity * 0.7})`);
    grad.addColorStop(0.7, `rgba(34, 211, 238, ${intensity * 0.3})`);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    nCtx.fillStyle = grad;
    nCtx.beginPath();
    nCtx.arc(x, y, radius, 0, Math.PI * 2);
    nCtx.fill();
  };

  // High density city lights across globe
  // India & Chennai Corridor
  drawCityLight(80.27, 13.08, 22, 1.0); // Chennai
  drawCityLight(77.59, 12.97, 20, 0.95); // Bengaluru
  drawCityLight(72.87, 19.07, 24, 1.0); // Mumbai
  drawCityLight(77.20, 28.61, 25, 1.0); // Delhi NCR
  drawCityLight(88.36, 22.57, 20, 0.9); // Kolkata
  drawCityLight(78.48, 17.38, 18, 0.9); // Hyderabad

  // East Asia & Japan
  drawCityLight(139.69, 35.68, 32, 1.0); // Tokyo megacity
  drawCityLight(121.47, 31.23, 28, 1.0); // Shanghai
  drawCityLight(114.16, 22.31, 22, 1.0); // Hong Kong
  drawCityLight(103.81, 1.35, 18, 0.95); // Singapore
  drawCityLight(126.97, 37.56, 24, 0.95); // Seoul

  // Europe
  drawCityLight(-0.12, 51.50, 26, 1.0); // London
  drawCityLight(2.35, 48.85, 24, 0.95); // Paris
  drawCityLight(4.47, 51.92, 18, 0.9); // Rotterdam
  drawCityLight(13.40, 52.52, 20, 0.9); // Berlin

  // North America
  drawCityLight(-74.00, 40.71, 30, 1.0); // New York
  drawCityLight(-80.19, 25.76, 20, 0.9); // Miami
  drawCityLight(-118.24, 34.05, 28, 0.95); // Los Angeles
  drawCityLight(-87.62, 41.87, 24, 0.9); // Chicago

  // Fine metropolitan arterial highway web connecting cities
  nCtx.strokeStyle = 'rgba(255, 200, 110, 0.25)';
  nCtx.lineWidth = 1.2;
  const drawHighway = (from: [number, number], to: [number, number]) => {
    const [x1, y1] = p(from[0], from[1]);
    const [x2, y2] = p(to[0], to[1]);
    nCtx.beginPath();
    nCtx.moveTo(x1, y1);
    nCtx.lineTo(x2, y2);
    nCtx.stroke();
  };
  drawHighway([80.27, 13.08], [77.59, 12.97]); // Chennai - Bengaluru
  drawHighway([77.59, 12.97], [78.48, 17.38]); // Bengaluru - Hyderabad
  drawHighway([78.48, 17.38], [72.87, 19.07]); // Hyderabad - Mumbai
  drawHighway([72.87, 19.07], [77.20, 28.61]); // Mumbai - Delhi

  // 3. SPECULAR OCEAN MASK CANVAS
  // Water is bright (high specular reflection), land is black (matte)
  const specCanvas = document.createElement('canvas');
  specCanvas.width = 2048;
  specCanvas.height = 1024;
  const sCtx = specCanvas.getContext('2d')!;
  sCtx.fillStyle = '#ffffff'; // Ocean reflects
  sCtx.fillRect(0, 0, 2048, 1024);

  // Black out continents on specular canvas so only water reflects light
  const pSpec = (lon: number, lat: number): [number, number] => [
    ((lon + 180) / 360) * 2048,
    ((90 - lat) / 180) * 1024,
  ];

  const maskLand = (coords: [number, number][]) => {
    sCtx.beginPath();
    coords.forEach(([lon, lat], idx) => {
      const [x, y] = pSpec(lon, lat);
      if (idx === 0) sCtx.moveTo(x, y);
      else sCtx.lineTo(x, y);
    });
    sCtx.closePath();
    sCtx.fillStyle = '#080808';
    sCtx.fill();
  };

  maskLand([
    [-10, 36], [18, 55], [70, 72], [140, 70], [180, 60], [130, 35], [105, 10], [98, 4], [80, 13],
    [75, 25], [60, 25], [45, 12], [32, 32], [-8, 36]
  ]);
  maskLand([[68, 24], [76, 32], [88, 27], [80.5, 13.1], [77.5, 8], [72.8, 19], [68, 24]]);
  maskLand([[-17, 14], [-5, 36], [22, 32], [50, 12], [28, -33], [12, -20], [-17, 14]]);
  maskLand([[-168, 65], [-100, 72], [-55, 48], [-80, 25], [-115, 32], [-168, 65]]);
  maskLand([[-76, 8], [-45, -2], [-37, -15], [-68, -54], [-78, -12], [-76, 8]]);
  maskLand([[114, -22], [135, -12], [152, -26], [138, -36], [114, -22]]);

  // 4. REALISTIC VOLUMETRIC CLOUDS CANVAS
  const cloudCanvas = document.createElement('canvas');
  cloudCanvas.width = 2048;
  cloudCanvas.height = 1024;
  const cCtx = cloudCanvas.getContext('2d')!;
  cCtx.fillStyle = 'rgba(0,0,0,0)';
  cCtx.fillRect(0, 0, 2048, 1024);

  // Cloud bands and tropical cyclones
  const drawCloudPuff = (cx: number, cy: number, rx: number, ry: number, opacity: number) => {
    const grad = cCtx.createRadialGradient(cx, cy, 0, cx, cy, rx);
    grad.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
    grad.addColorStop(0.5, `rgba(240, 250, 255, ${opacity * 0.6})`);
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    cCtx.fillStyle = grad;
    cCtx.beginPath();
    cCtx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    cCtx.fill();
  };

  // Equatorial Intertropical Convergence Zone (ITCZ) cloud bands
  for (let x = 0; x < 2048; x += 35) {
    const yBase = 512 + Math.sin(x * 0.015) * 80;
    drawCloudPuff(x, yBase + (Math.random() - 0.5) * 40, 45 + Math.random() * 50, 18 + Math.random() * 20, 0.45);
  }

  // Realistic Bay of Bengal / Indian Ocean Cyclone Spiral
  const [cycloneX, cycloneY] = pSpec(84, 15);
  for (let a = 0; a < Math.PI * 5; a += 0.2) {
    const r = a * 12;
    const px = cycloneX + Math.cos(a) * r;
    const py = cycloneY + Math.sin(a) * r;
    drawCloudPuff(px, py, 20 + a * 3, 12 + a * 2, 0.65 - a * 0.03);
  }

  // Mid-latitude storm fronts
  for (let x = 0; x < 2048; x += 60) {
    const yFront = 280 + Math.cos(x * 0.01) * 60;
    drawCloudPuff(x, yFront, 60, 25, 0.38);
    const ySouth = 780 + Math.sin(x * 0.012) * 50;
    drawCloudPuff(x, ySouth, 55, 22, 0.35);
  }

  // Generate Three.js textures
  const dayTexture = new THREE.CanvasTexture(dayCanvas);
  dayTexture.colorSpace = THREE.SRGBColorSpace;

  const nightTexture = new THREE.CanvasTexture(nightCanvas);
  nightTexture.colorSpace = THREE.SRGBColorSpace;

  const specTexture = new THREE.CanvasTexture(specCanvas);

  const cloudTexture = new THREE.CanvasTexture(cloudCanvas);
  cloudTexture.wrapS = THREE.RepeatWrapping;

  return { dayTexture, nightTexture, specTexture, cloudTexture };
}
