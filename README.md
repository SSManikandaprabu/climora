# ClimateTwin X — Global Climate Intelligence

> **See the Future of Your City.**
> A cinematic, scientific, enterprise-grade climate intelligence command centre engineered for urban climate resilience, high-resolution hydrodynamic flood modeling, and compound disaster mitigation.

---

## 🛰️ Architecture & System Design

ClimateTwin X breaks away from conventional SaaS dashboard patterns to deliver a spatial intelligence platform inspired by NASA Earth observation systems, Palantir-class decision infrastructure, and high-performance geospatial digital twins.

### Core Technology Stack
- **Frontend Framework**: React 19 + TypeScript (Strict Typings)
- **Styling & Design System**: Tailwind CSS v4 + Glassmorphic Surfaces + Dynamic Atmospheric Shaders
- **Planetary 3D Engine**: Three.js (Procedural Canvas Earth textures, Atmospheric Fresnel Scattering Shader, Cloud Spheres, 3D Pulsing Beacons, Interactive Orbital Controls)
- **Geospatial Digital Twin**: MapLibre GL JS (0.5m LiDAR Inundation Polygons, Doppler Reflectivity Grids, Thermal Microclimates, Sentinel-2 Satellites, Topographic Elevation Contours)
- **Scientific Visualizations**: Recharts (CMIP6 / ERA5 1980–2050 Temperature Anomalies, Historic Storm Deluge Benchmarks, Ward Probability Density Functions)
- **Scientific AI Analyst**: Aether-9 Intelligence Engine with evidence-grounded IPCC AR6 & ERA5 citations, inline metric chips, and real-time map highlighting triggers.

---

## 🎨 Color System & Visual Identity

| Token | Hex | Role |
| :--- | :--- | :--- |
| **Primary Background** | `#050811` | Deep space atmospheric black |
| **Secondary Background** | `#090F1B` | Navigational substrate |
| **Surface** | `#0D1725` | Glassmorphic instrument base |
| **Elevated Surface** | `#111E2E` | Highlighted floating intelligence cards |
| **Cyan** | `#22D3EE` | Telemetry live signals & LiDAR contours |
| **Electric Blue** | `#3B82F6` | Precipitation & hydrological flow paths |
| **Aurora Purple** | `#8B5CF6` | Scenario simulations & IPCC models |
| **Danger** | `#EF4444` | Category-3 inundation & emergency alerts |
| **Warning** | `#F59E0B` | Urban heat island thermal stress |
| **White / Text** | `#F8FAFC` | Primary metric typography |
| **Muted Slate** | `#94A3B8` | Telemetry provenance & coordinates |

### Typography
- **Headings**: `Space Grotesk` (Geometric, scientific, authoritative)
- **Body**: `Inter` (Optimized optical density for data legibility)
- **Instruments / Telemetry**: `JetBrains Mono` (Coordinates, radar decibels, latency)

---

## 🚀 Key Modules

### 1. Cinematic Introduction (`CinematicIntro.tsx`)
- Luminous emblem reveal with atmospheric glow rings
- Rotating satellite orbital rings and scanning laser sweeps
- Mission statement: *"Understanding our planet. Predicting our future."*
- Skippable with persistent memory (`localStorage`) and instant replay trigger

### 2. Signature 3D Earth (`EarthGlobe.tsx`)
- 60 FPS interactive planetary sphere with custom procedural landmass and city light cluster shaders
- Atmospheric scattering rim glow (Fresnel shader)
- Independent cloud layer dynamics
- Global city beacons with live risk scores (Chennai, Singapore, Tokyo, Rotterdam, New York, Miami, Mumbai)
- Smooth camera fly-in into Chennai Digital Twin View
- Low-power 2D Canvas Fallback mode

### 3. Chennai Digital Twin GIS (`DigitalTwinMap.tsx`)
- High-resolution local GIS map covering:
  - **Velachery, Pallikaranai Marshland, Madipakkam, Perumbakkam, Adyar Estuary, T. Nagar, Mylapore, Ennore**
- Real geographical data: elevation (MSL), soil saturation, exposed demographics, drainage capacities
- Overlays: Flood Inundation (0–2m), Urban Heat Island (+4.5°C), Doppler Reflectivity (48 dBZ), NDVI Canopy Cover, Water Bodies & Canals, Elevation Contours
- Clickable neighbourhood floating intelligence cards

### 4. Specialized Scientific Instruments (`src/components/intelligence/`)
- **Temperature Instrument**: Air/Skin temperature, diurnal 24h curve, ERA5 baseline anomaly, Wet Bulb index
- **Rainfall Intensity**: mm/h rate, 24h accumulation, Doppler radar dBZ, benchmark storm comparison
- **Flood Risk Gauge**: Hydrological composite index (0–100), soil saturation deficit, storm surge anomaly
- **Heat Exposure Instrument**: Urban heat island thermal plume (+3.6°C), canopy cover percentage
- **Environmental Quality**: Atmospheric pressure (hPa), humidity, surface wind gusts, composite AQI

### 5. Scenario Simulator (`ScenarioSimulator.tsx`)
- Interactive parameter sandbox:
  - Precipitation rate (10–120 mm/h)
  - Storm duration (3–48 h)
  - Mean temperature increase (+0.0°C to +4.5°C)
  - Astronomical tide surge (0.0m to +2.0m)
  - Urban canopy cover change (-30% to +30%)
- Live calculated delta: inundated surface area (sq km), exposed population, economic damage ($M), critical assets at risk
- Baseline vs Simulated vs Side-by-Side comparison modes

### 6. AI Climate Analyst (`AIAnalystPanel.tsx`)
- Scientific natural language assistant grounded in IPCC AR6 and ERA5 datasets
- Interactive metric cards rendered inside chat bubbles
- Real-time map triggers: clicking a suggestion automatically highlights and centers the target ward on the digital twin map
- One-click executive briefing export (`.md`)

### 7. Interactive Climate Timeline (`ClimateTimeline.tsx`)
- Scrubbable temporal axis spanning:
  - 2015 Historic Deluge (494mm)
  - 2019 Day Zero Drought
  - 2023 Cyclone Michaung (390mm)
  - LIVE NOW (Real-time telemetry)
  - +24h & +7d Outlooks
  - 2030 & 2050 IPCC Climate Twins
- Play/Pause automated progression with narrative synthesis

---

## 💻 Developer Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build production bundle (with code splitting)
npm run build

# Preview production build
npm run preview
```
