// frontend/src/api.js
const getBaseUrl = () => {
    if (process.env.NODE_ENV === 'development') {
      return 'http://localhost:80/api';  // Update port if different
    }
    return '/api';
  };
  
  export const api = {
    getImages: async () => {
      try {
        const response = await fetch(`${getBaseUrl()}/images`);
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      } catch (error) {
        console.error('Error fetching images:', error);
        throw error;
      }
    },
      
    uploadImage: async (formData) => {
      try {
        const response = await fetch(`${getBaseUrl()}/upload`, {
          method: 'POST',
          body: formData
        });
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
      }
    }
  };