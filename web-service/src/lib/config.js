/**
 * Runtime configuration — reads VITE_* env vars.
 * Exposes `mode` (demo/prod), `apiBase`, `brand`.
 * Demo mode — localStorage-backed store; prod mode — fetches `${apiBase}/*`.
 */
export const config = {
  mode: import.meta.env.VITE_MODE || 'demo',
  apiBase: import.meta.env.VITE_API_BASE || '',
  brand: import.meta.env.VITE_BRAND || 'octa',
  isProd: import.meta.env.PROD,
  isDev: import.meta.env.DEV,
};

export const isDemoMode = () => config.mode === 'demo';
export const isProdMode = () => config.mode === 'prod';
