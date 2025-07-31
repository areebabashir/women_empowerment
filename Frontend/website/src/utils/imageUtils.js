// Utility function to get the correct image URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Remove any leading slashes to avoid double slashes
  const cleanPath = imagePath.replace(/^\/+/, '');
  
  // Return the full URL
  return `${API_BASE_URL}/${cleanPath}`;
};

export const getUploadUrl = (filename) => {
  if (!filename) return '';
  return `${API_BASE_URL}/uploads/${filename}`;
}; 