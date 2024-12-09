import React, { useState, useEffect } from 'react';
import { api } from './api';

const App = () => {
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await api.uploadImage(formData);
      setImages(prevImages => [...prevImages, response]);
      setSelectedFile(null);
      // Reset file input
      document.querySelector('input[type="file"]').value = '';
    } catch (error) {
      setError('Failed to upload image. Please try again.');
      console.error('Upload failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const data = await api.getImages();
        setImages(data);
      } catch (error) {
        setError('Failed to fetch images. Please refresh the page.');
        console.error('Failed to fetch images:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Media Gallery</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-6 space-y-4">
        <input 
          type="file" 
          onChange={handleFileSelect}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          accept="image/*"
        />
        <button 
          onClick={handleUpload}
          disabled={loading || !selectedFile}
          className={`bg-blue-500 text-white px-6 py-2 rounded-lg ${loading || !selectedFile ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      {loading && <div className="text-center">Loading...</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <div key={image.id} className="border rounded-lg overflow-hidden shadow-sm">
            <img 
              src={image.url} 
              alt={image.name} 
              className="w-full h-48 object-cover"
            />
            <div className="p-3">
              <p className="text-sm text-gray-600">{image.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;