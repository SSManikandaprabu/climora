# ClimateTwin X — Global Climate Intelligence Command Centre

<div align="center">

![ClimateTwin X Banner](https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg)

### *"See the Future of Your City."*

An enterprise-grade, cinematic climate intelligence command centre engineered for municipal climate resilience, high-resolution 3D hydrodynamic flood modeling, and compound disaster mitigation.

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.174-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![MapLibre GL](https://img.shields.io/badge/MapLibre_GL-5.1-396B9C?style=for-the-badge&logo=maplibre&logoColor=white)](https://maplibre.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

[Live Demo](http://localhost:5173) • [Documentation](#-key-modules) • [Architecture](#-architecture--system-design) • [Quick Start](#-quick-start)

</div>

---

## 🌍 Overview

**ClimateTwin X** represents a generational leap in urban climate resilience software. Moving deliberately away from conventional SaaS dashboards, it synthesizes design paradigms from **NASA Earth Observation platforms**, **Palantir-style spatial intelligence**, and **Bloomberg analytical terminals** to deliver high-resolution predictive digital twinning.

The platform targets the **Chennai Metropolitan Basin**—one of the world's most ecologically complex coastal deltas—benchmarking its climate vulnerabilities against global twin port megacities including **Rotterdam, Singapore, Tokyo, New York, and Miami**.

---

## 🛰️ Architecture & System Design

```
┌────────────────────────────────────────────────────────────────────────┐
│                          CLIMATETWIN X PLATFORM                        │
├─────────────────────┬────────────────────┬─────────────────────────────┤
│   3D PLANETARY      │   DIGITAL TWIN     │    CLIMATE INTELLIGENCE     │
│   ORBIT (Three.js)  │   GIS (MapLibre)   │    & PREDICTIVE SIMULATOR   │
├─────────────────────┼────────────────────┼─────────────────────────────┤
│ • NASA Blue Marble  │ • Google Hybrid/Sat│ • Specialized Instruments   │
│ • 3,800-Vector Flow │ • 3D Buildings     │ • Coupled Hydro-Sandbox     │
│ • Cyclone Vortices  │ • Water Scrubber   │ • Municipal Interventions   │
│ • Teleconnections   │ • Hydro Network    │ • Averted Loss ROI Counter  │
├─────────────────────┴────────────────────┴─────────────────────────────┤
│         LIVE DATA STREAM: Open-Meteo ECMWF + Copernicus ERA5 + IMD     │
└────────────────────────────────────────────────────────────────────────┘
```

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
| **Emerald** | `#10B981` | Relief shelters, safe corridors & mitigation ROI |
| **Danger** | `#EF4444` | Category-3 inundation & emergency alerts |
| **Warning** | `#F59E0B` | Urban heat island thermal stress |
| **White / Text** | `#F8FAFC` | Primary metric typography |
| **Muted Slate** | `#94A3B8` | Telemetry provenance & coordinates |

### Typography
- **Headings**: `Space Grotesk` (Geometric, scientific, authoritative)
- **Body**: `Inter` (Optimized optical density for data legibility)
- **Telemetry / Instruments**: `JetBrains Mono` (Coordinates, radar decibels, latency)

---

## 🚀 Key Modules

### 1. Planetary 3D Earth Orbit (`EarthGlobe.tsx`)
* **NASA Blue Marble Day/Night PBR**: Authentic high-resolution satellite imagery paired with NASA Black Marble night city lights and specular ocean reflection masks.
* **Geophysical Fluid Dynamics (3,800 Flow Streamlines)**: GPU-accelerated spherical vector field animating planetary wind circulation across 3 selectable modes:
  * 🌀 **Monsoon Vortex**: South-westerly monsoon winds sweeping into a cyclonic storm spiral over the Bay of Bengal into Chennai.
  * 💨 **Jet Stream**: High-velocity mid-latitude wind belts with undulating Rossby waves.
  * 🌊 **Ocean Conveyor**: Thermohaline gyres and currents.
* **Constellations & Teleconnections**: Live-orbiting Sentinel-2A and GPM Core satellites, glowing altitude pins, and 3D teleconnection arcs linking Chennai to partner delta ports.

### 2. Google Maps Digital Twin GIS (`DigitalTwinMap.tsx`)
* **Photorealistic Google Baselayers**: Instant toggling between Google Hybrid (Satellite + Labels), Pure Satellite, Roadmap, Google Terrain (Contours), and Sci-Fi Dark Vector.
* **3D Urban Architecture Extrusions**: Extruded building footprints with true-to-life heights for Chennai Central, TIDEL Park, Olympia Tech Park, Phoenix Marketcity, ELCOT IT SEZ, Airport, and Chepauk.
* **Inundation Water Scrubber**: Interactive water level slider from `0.2m` to `2.5m` simulating tidal backflow and extreme storm deluges.
* **Hydrographic Network**: High-precision vector layers for Adyar River, Cooum River, Buckingham Canal, and the Pallikaranai wetland basin.
* **De-congested Spatial Layout**: Unified top command bar with on-demand collapsible layer drawers and non-intrusive floating intelligence cards.

### 3. Specialized Scientific Instruments (`src/components/intelligence/`)
* **Thermal Instrument (`TemperatureGauge.tsx`)**: Surface air temperature, ERA5 30-year climatological anomaly, and diurnal curve tracking.
* **Precipitation Doppler Radar (`RainfallIntensity.tsx`)**: Dual-polarized radar reflectivity in dBZ, 24-hour accumulation, and historical deluge comparison benchmarks.
* **Compound Flood Risk Index (`FloodRiskGauge.tsx`)**: Composite 0–100 risk score incorporating elevation MSL, soil saturation %, and tidal surge resistance.
* **Urban Heat Island & Canopy (`HeatExposureGauge.tsx`)**: Microclimate thermal anomaly (+3.6°C UHI) paired with satellite NDVI vegetation indices.
* **Atmospheric Telemetry (`EnvironmentalQuality.tsx`)**: Relative humidity, barometric pressure, wind vectors, and CPCB/IMD air quality indices with real-time Open-Meteo ECMWF synchronization.

### 4. Predictive Scenario Simulator & Municipal ROI Sandbox (`ScenarioSimulator.tsx`)
* **Coupled Hydro-Meteorological Sandbox**: Adjust rainfall intensity (mm/h), deluge duration (hours), global warming thermal increase (+°C), sea level surge (+m), and canopy cover changes.
* **Active Municipal Engineering Interventions**: Test real structural countermeasures:
  * *Canal Deep Desilting* (+35% drain capacity → **-18% flood risk**)
  * *Mobile Heavy Sump Pumps* (150 MLD strategic deployment → **-12% flood risk**)
  * *Pallikaranai Sponge Wetland Restoration* (Natural retention → **-15% flood risk & -0.4°C cooling**)
  * *Tidal Backflow Surge Gates* (Ennore/Marina barrage activation → **-22% storm surge**)
* **Live Averted Loss & ROI Counter**: Real-time calculation of square kilometers protected and monetary damages averted in millions of USD (e.g., `+$235M USD Averted`).

### 5. AI Climate Analyst Engine — Aether-9 (`AIAnalystPanel.tsx`)
* **Scientific Natural Language Querying**: Responds to complex urban resilience inquiries (e.g., *"Which Chennai wards have the highest compound flood exposure?"*).
* **Evidence Citations**: Directly cites data sources (Copernicus ERA5 Reanalysis, IMD Doppler Radar, IPCC AR6).
* **Interactive Map Synchronization**: The AI highlights specific wards and zones on the digital twin map directly from chat responses.
* **Executive Briefing Export**: One-click generation of strategic markdown briefings for city officials.

### 6. Emergency Evacuation & Relief Command Network (`EvacuationRoutesModal.tsx`)
* **Designated Municipal Safe Havens**: Detailed telemetry on regional flood relief hubs (Anna University CEG, Jawaharlal Nehru Stadium, Loyola College, Tambaram Air Force Base, Phoenix High Grounds).
* **Tactical Resource Tracking**: Real-time tracking of capacity utilization, potable water reserves (days), auxiliary diesel generators, emergency medical personnel, and NDRF motorized rescue boat fleets.
* **High-Ground Evacuation Corridors**: Mapped elevated road arteries connecting flood sumps (Velachery, Pallikaranai, Perumbakkam) to high-ground sanctuaries.

### 7. Executive Dossier & Global Twin Benchmarking
* **Executive Dossier (`ExecutiveDossierModal.tsx`)**: Full printable (`window.print()`) municipal briefing document containing ward vulnerability matrices, critical asset exposure tallies, and priority capital intervention recommendations.
* **Twin-to-Twin Resilience Benchmark (`TwinComparisonModal.tsx`)**: Cross-city comparative diagnostics benchmarking Chennai against global delta megacities (Rotterdam, Singapore, Tokyo, New York, Miami) across composite risk, thermal anomaly, and IPCC vulnerability indices.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Function |
| :--- | :--- |
| `1` | Switch to **Planetary 3D Earth** |
| `2` | Switch to **Digital Twin GIS** (Google Maps 3D) |
| `3` | Switch to **Climate Intelligence Instruments** |
| `4` | Switch to **Scenario Simulator & Engineering ROI** |
| `5` | Switch to **AI Analyst Engine** (Aether-9) |
| `Ctrl + K` / `Cmd + K` | Open **Global Spatial Search** |
| `D` | Open **Executive Climate Dossier** (Printable PDF) |
| `?` | Toggle **Keyboard Shortcuts Palette** |

---

## 📦 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/climora.git
   cd climora
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Production Build**:
   ```bash
   npm run build
   npm run preview
   ```
   *Compiles clean in under 700ms with optimized code splitting.*

---

## 🛰️ Data Provenance & Scientific Provenance

| Sensor / Dataset | Provider | Calibration Cycle | Resolution |
| :--- | :--- | :--- | :--- |
| **ERA5 Reanalysis** | ECMWF / Copernicus Climate Change Service | Hourly | 0.25° (~31 km) |
| **Integrated Multi-satellite Retrievals (IMERG)** | NASA / JAXA Global Precipitation Measurement (GPM) | 30 minutes | 0.1° (~10 km) |
| **Doppler Weather Radar (DWR)** | India Meteorological Department (IMD) Chennai | 10 minutes | 1.0 km |
| **Topographic Airborne LiDAR** | Survey of India / Chennai Smart City Mission | Decennial | 0.5m MSL |
| **Live Surface AWS Telemetry** | Open-Meteo Integrated Stream | 5 minutes | Point AWS |
| **Urban Heat Island Indices (NDVI)** | Sentinel-2 Multi-Spectral Instrument (ESA) | 5 days | 10m Ground Resolution |

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Engineered with precision for planetary resilience. ClimateTwin X © 2026.</sub>
</div>
