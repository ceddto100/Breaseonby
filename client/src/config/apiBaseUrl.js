const rawApiUrl = import.meta.env.VITE_API_URL;

export const API_BASE_URL = (rawApiUrl || window.location.origin).replace(/\/$/, '');

if (!rawApiUrl && import.meta.env.PROD) {
  console.warn(
    '[auth] VITE_API_URL is not set. Falling back to current origin. ' +
      'Set VITE_API_URL to your backend service URL in production to avoid OAuth misrouting.'
  );
}
