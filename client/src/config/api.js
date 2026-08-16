// Centralized API and Socket.IO configuration for BuyKaro
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');
export const API_BASE_URL = API_URL;
export const SOCKET_URL = (import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

// Helper to resolve media and uploaded image paths
export const resolveMediaUrl = (path) => {
  if (!path) return '/images/products/1.jpg';
  if (typeof path !== 'string') return '/images/products/1.jpg';

  // 1. Full external URLs, Supabase CDN, blob, or base64 data URIs
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }

  // 2. Express server uploaded files (under /uploads/ or uploads/)
  if (path.startsWith('/uploads/') || path.startsWith('uploads/')) {
    const cleanUploadPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_URL}${cleanUploadPath}`;
  }

  // 3. Static frontend assets (e.g. /images/products/1.jpg, /images/..., /Sale/..., /hero/...)
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return cleanPath;
};

export const resolveImageUrl = resolveMediaUrl;

export default {
  API_URL,
  SOCKET_URL,
  resolveMediaUrl,
  resolveImageUrl,
};
