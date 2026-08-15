// Centralized API and Socket.IO configuration for Buykro
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');
export const API_BASE_URL = API_URL;
export const SOCKET_URL = (import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

// Helper to resolve media and uploaded image paths
export const resolveMediaUrl = (path) => {
  if (!path) return '';
  if (typeof path !== 'string') return '';
  if (path.startsWith('http://localhost:3000')) {
    return path.replace('http://localhost:3000', API_URL);
  }
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL}${cleanPath}`;
};

export const resolveImageUrl = resolveMediaUrl;

export default {
  API_URL,
  SOCKET_URL,
  resolveMediaUrl,
  resolveImageUrl,
};

