// goscroll.js
export const imageUploadEndpoint = "https://prod-13.centralus.logic.azure.com:443/workflows/83fc1353a740461d8d7c0efcdbfca417/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=thGzX4JSsBzH2M4-ctyw3-3a-wkSSpTdEgrZH2FuSXw";
export const getAllImagesEndpoint = "https://prod-23.northcentralus.logic.azure.com:443/workflows/f094b174e2c64359b5fcacf267fac354/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=iksL1unUcJd5F4xpJqIwn_Q4r2r1vN8sU5GkSqo-xxI";

// Match exactly how it was before
export const BLOB_ACCOUNT = "cosmosdbgoscroll";

export const submitNewAsset = async (fileData) => {
  const formData = new FormData();
  formData.append('FileName', fileData.FileName);
  formData.append('userID', fileData.userID);
  formData.append('userName', fileData.userName);
  formData.append('File', fileData.File);

  const response = await fetch(imageUploadEndpoint, {
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
    const response = await fetch(getAllImagesEndpoint);
    if (!response.ok) {
      throw new Error('Failed to fetch images');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
};