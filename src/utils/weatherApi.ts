export interface LiveWeatherData {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitation: number;
  surfacePressure: number;
  windSpeed: number;
  windDirection: number;
  timestamp: string;
  source: string;
}

const CACHE: Record<string, { data: LiveWeatherData; expiresAt: number }> = {};

export async function fetchLiveCityWeather(lat: number, lng: number): Promise<LiveWeatherData | null> {
  const cacheKey = `${lat.toFixed(2)}_${lng.toFixed(2)}`;
  const now = Date.now();

  if (CACHE[cacheKey] && CACHE[cacheKey].expiresAt > now) {
    return CACHE[cacheKey].data;
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,surface_pressure,wind_speed_10m,wind_direction_10m`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();
    const cur = json.current;

    const data: LiveWeatherData = {
      temperature: cur.temperature_2m,
      apparentTemperature: cur.apparent_temperature,
      humidity: cur.relative_humidity_2m,
      precipitation: cur.precipitation,
      surfacePressure: cur.surface_pressure,
      windSpeed: cur.wind_speed_10m,
      windDirection: cur.wind_direction_10m,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' UTC',
      source: 'Open-Meteo ECMWF Integrated Stream',
    };

    // Cache for 5 minutes
    CACHE[cacheKey] = {
      data,
      expiresAt: now + 5 * 60 * 1000,
    };

    return data;
  } catch (err) {
    console.warn('Live weather telemetry fallback active:', err);
    return null;
  }
}
