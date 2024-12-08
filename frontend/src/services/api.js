const GET_IMAGES_URL = "https://prod-23.northcentralus.logic.azure.com/workflows/f094b174e2c64359b5fcacf267fac354/triggers/When_a_HTTP_request_is_received/paths/invoke/api/images?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=iksL1unUcJd5F4xpJqIwn_Q4r2r1vN8sU5GkSqo-xxI";
const UPLOAD_URL = "https://prod-13.centralus.logic.azure.com:443/workflows/83fc1353a740461d8d7c0efcdbfca417/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=thGzX4JSsBzH2M4-ctyw3-3a-wkSSpTdEgrZH2FuSXw";
export const BLOB_ACCOUNT = "https://goscrollstorageaccount.blob.core.windows.net/";

export const submitNewAsset = async (fileData) => {
  const formData = new FormData();
  // These field names exactly match what your Logic App expects
  formData.append('FileName', fileData.FileName);  // kept as is
  formData.append('UserID', fileData.userID);      // changed to uppercase 'ID'
  formData.append('UserName', fileData.userName);   // changed to uppercase 'N'
  formData.append('File', fileData.File);          // kept as is

  console.log('Submitting to:', UPLOAD_URL);

  const response = await fetch(UPLOAD_URL, {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json'
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
    console.log('Fetching images from:', GET_IMAGES_URL);
    
    const response = await fetch(GET_IMAGES_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch images:', errorText);
      throw new Error(`Failed to fetch images: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Fetched images:', data);
    return data;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
};