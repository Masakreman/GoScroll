const getBaseUrl = () => {
    // In production, use relative path which will be handled by Static Web Apps reverse proxy
    return '/api';
  };
  
  export const api = {
    getImages: async () => {
      const response = await fetch(`${getBaseUrl()}/images`);
      return response.json();
    },
    
    uploadImage: async (formData) => {
      const response = await fetch(`${getBaseUrl()}/upload`, {
        method: 'POST',
        body: formData
      });
      return response.json();
    }
  };