import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('api/upload', formData);
      setImages([...images, response.data]);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('api/images');
        setImages(response.data);
      } catch (error) {
        console.error('Failed to fetch images:', error);
      }
    };
    fetchImages();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Media Gallery</h1>
      <div className="mb-4">
        <input type="file" onChange={handleFileSelect} />
        <button 
          onClick={handleUpload}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Upload
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {images.map((image) => (
          <div key={image.id} className="border p-2">
            <img src={image.url} alt={image.name} className="w-full" />
            <p>{image.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};