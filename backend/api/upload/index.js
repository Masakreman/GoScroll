// backend/api/upload/index.js
const { BlobServiceClient } = require('@azure/storage-blob');
const { CosmosClient } = require('@azure/cosmos');
const multipart = require('parse-multipart');

module.exports = async function (context, req) {
    try {
        if (!req.body) return { status: 400, body: { error: 'No file uploaded' } };

        const bodyBuffer = Buffer.from(req.body);
        const boundary = multipart.getBoundary(req.headers['content-type']);
        const parts = multipart.Parse(bodyBuffer, boundary);
        const file = parts[0];

        // Upload to blob
        const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
        const containerClient = blobServiceClient.getContainerClient('media');
        const blobName = `${Date.now()}-${file.filename}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        await blockBlobClient.upload(file.data, file.data.length);

        // Save metadata
        const cosmosClient = new CosmosClient(process.env.COSMOS_DB_CONNECTION_STRING);
        const container = cosmosClient.database('MediaDB').container('ImageMetadata');
        const metadata = {
            id: blobName,
            name: file.filename,
            url: blockBlobClient.url,
            uploadDate: new Date().toISOString()
        };

        const { resource } = await container.items.create(metadata);
        context.res = { body: resource };
    } catch (error) {
        context.res = {
            status: 500,
            body: { error: 'Upload failed' }
        };
    }
};