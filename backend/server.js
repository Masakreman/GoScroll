const express = require('express');
const multer = require('multer');
const { BlobServiceClient } = require('@azure/storage-blob');
const { CosmosClient } = require('@azure/cosmos');

const app = express();

// Azure configuration
const blobConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const cosmosConnectionString = process.env.COSMOS_DB_CONNECTION_STRING;
const blobContainerName = 'images';
const databaseName = 'MediaDB';
const cosmosContainerName = 'ImageMetadata';

// Initialize Azure clients
const blobServiceClient = BlobServiceClient.fromConnectionString(blobConnectionString);
const cosmosClient = new CosmosClient(cosmosConnectionString);

let blobContainer;
let cosmosContainer;

async function initializeAzureResources() {
  try {
    blobContainer = blobServiceClient.getContainerClient(blobContainerName);
    await blobContainer.createIfNotExists();

    const database = cosmosClient.database(databaseName);
    cosmosContainer = database.container(cosmosContainerName);
  } catch (error) {
    console.error('Failed to initialize Azure resources:', error);
    process.exit(1);
  }
}

const cors = require('cors');
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const blobName = `${Date.now()}-${req.file.originalname}`;
    const blobClient = blobContainer.getBlockBlobClient(blobName);
    
    await blobClient.upload(req.file.buffer, req.file.buffer.length);
    const imageUrl = blobClient.url;

    const metadata = {
      id: blobName,
      name: req.file.originalname,
      url: imageUrl,
      contentType: req.file.mimetype,
      uploadDate: new Date().toISOString()
    };

    const { resource: createdItem } = await cosmosContainer.items.create(metadata);
    res.json(createdItem);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

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

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

initializeAzureResources().then(() => {
  const port = process.env.PORT || 80;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});

app.get('/api/test', (req, res) => {
  res.json({ message: "Backend is connected!" });
});

module.exports = app;