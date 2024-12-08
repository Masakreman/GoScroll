export default App;

// Backend (Node.js) - src/server.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { BlobServiceClient } = require('@azure/storage-blob');
const { CosmosClient } = require('@azure/cosmos');

// Create Express app
const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Azure configuration
const blobConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const cosmosConnectionString = process.env.COSMOS_DB_CONNECTION_STRING;
const blobContainerName = 'images';
const databaseName = 'MediaDB';
const cosmosContainerName = 'ImageMetadata';

// Initialize Azure clients
const blobServiceClient = BlobServiceClient.fromConnectionString(blobConnectionString);
const cosmosClient = new CosmosClient(cosmosConnectionString);

// Initialize containers
let blobContainer;
let cosmosContainer;

async function initializeAzureResources() {
  try {
    // Initialize Blob Storage container
    blobContainer = blobServiceClient.getContainerClient(blobContainerName);
    await blobContainer.createIfNotExists();

    // Initialize CosmosDB database and container
    const database = cosmosClient.database(databaseName);
    cosmosContainer = database.container(cosmosContainerName);
  } catch (error) {
    console.error('Failed to initialize Azure resources:', error);
    process.exit(1);
  }
}

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Upload endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const blobName = `${Date.now()}-${file.originalname}`;
    
    // Upload to Blob Storage
    const blobClient = blobContainer.getBlockBlobClient(blobName);
    await blobClient.upload(file.buffer, file.buffer.length);
    const imageUrl = blobClient.url;

    // Store metadata in CosmosDB
    const metadata = {
      id: blobName,
      name: file.originalname,
      url: imageUrl,
      contentType: file.mimetype,
      uploadDate: new Date().toISOString()
    };

    const { resource: createdItem } = await cosmosContainer.items.create(metadata);
    
    res.json(createdItem);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Get images endpoint
app.get('/api/images', async (req, res) => {
  try {
    const { resources } = await cosmosContainer.items
      .query('SELECT * FROM c ORDER BY c.uploadDate DESC')
      .fetchAll();
    res.json(resources);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Initialize Azure resources before starting the server
initializeAzureResources().then(() => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}).catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

module.exports = app;