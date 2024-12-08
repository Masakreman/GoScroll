const API_BASE_URL = "https://goscroll-backend-dnd6dmhbgncugjge.eastus2-01.azurewebsites.net";

// Updated with the correct Blob Storage URL
export const BLOB_ACCOUNT = "https://goscrollstorageaccount.blob.core.windows.net/";

export const submitNewAsset = async (fileData) => {
  const formData = new FormData();
  formData.append('FileName', fileData.FileName);
  formData.append('userID', fileData.userID);
  formData.append('userName', fileData.userName);
  formData.append('File', fileData.File);

  console.log('Submitting to:', `${API_BASE_URL}/api/upload`);

  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: 'POST',
    body: formData,
    cache: 'no-cache',
    headers: {
      'Accept': 'application/json',
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Upload failed:', errorText);
    throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

export const getImages = async () => {
  try {
    console.log('Fetching images from:', `${API_BASE_URL}/api/images`);
    
    const response = await fetch(`${API_BASE_URL}/api/images`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch images:', errorText);
      throw new Error(`Failed to fetch images: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Fetched images:', data); // Debug log to see the response
    return data;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
};