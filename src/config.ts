
// Automatically detects if running in production (deployed) or development
// We use window.location.hostname to avoid issues with import.meta.env in non-Vite environments
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const API_BASE_URL = isLocalhost 
  ? 'http://localhost:5000/api' 
  : '/api';

// CLOUDINARY CONFIGURATION
// Replace these with your actual values from Cloudinary Dashboard & Settings
// 1. Cloud Name: Found on your Dashboard
// 2. Upload Preset: Settings > Upload > Upload presets (Must be 'Unsigned')
export const CLOUDINARY_CLOUD_NAME = "dvrc030ni"; 
export const CLOUDINARY_UPLOAD_PRESET = "cba_uploads";
