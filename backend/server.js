// backend/server.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const FormData = require('form-data');
const axios = require('axios');
require('dotenv').config();

const app = express();
const upload = multer({ memory: true });

// Environment variables for Logic Apps
const UPLOAD_LOGIC_APP = process.env.UPLOAD_LOGIC_APP;
const GET_IMAGES_LOGIC_APP = process.env.GET_IMAGES_LOGIC_APP;

app.use(cors({
  origin: process.env.FRONTEND_URL || '*'
}));
app.use(express.json());

// Proxy endpoint for image upload
app.post('/api/upload', upload.single('File'), async (req, res) => {
  try {
    // Create a Node.js compatible FormData instance
    const formData = new FormData();
    
    // Append the file buffer with filename
    formData.append('File', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });
    
    // Append other fields
    formData.append('FileName', req.body.FileName);
    formData.append('userID', req.body.userID);
    formData.append('userName', req.body.userName);
    // Make request to Logic App
    const response = await axios.post(UPLOAD_LOGIC_APP, formData, {
      headers: {
        ...formData.getHeaders() // This will now work with the Node.js FormData
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Upload error details:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Upload failed', 
      details: error.message 
    });
  }
});


// Proxy endpoint for getting images
app.get('/api/images', async (req, res) => {
  try {
    const response = await axios.get(GET_IMAGES_LOGIC_APP);
    res.json(response.data);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});