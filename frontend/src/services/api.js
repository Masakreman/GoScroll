const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
console.log('API BASE URL:', API_BASE_URL); // Debug log

export const BLOB_ACCOUNT = "cosmosdbgoscroll";

export const submitNewAsset = async (fileData) => {
  const formData = new FormData();
  formData.append('FileName', fileData.FileName);
  formData.append('userID', fileData.userID);
  formData.append('userName', fileData.userName);
  formData.append('File', fileData.File);

  console.log('Submitting to:', `${API_BASE_URL}/api/upload`); // Debug log

  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: 'POST',
    body: formData,
    cache: 'no-cache',
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }
  return response.json();
};

export const getImages = async () => {
  try {
    console.log('Fetching images from:', `${API_BASE_URL}/api/images`); // Debug log
    const response = await fetch(`${API_BASE_URL}/api/images`);
    if (!response.ok) {
      throw new Error('Failed to fetch images');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
};