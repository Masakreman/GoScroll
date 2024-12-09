const { initializeAzureResources } = require('../shared/azure-config');
const multipart = require('parse-multipart');

module.exports = async function (context, req) {
    try {
        if (!req.body || !req.headers['content-type']) {
            context.res = {
                status: 400,
                body: { error: 'No file uploaded' }
            };
            return;
        }

        // Parse the multipart form data
        const bodyBuffer = Buffer.from(req.body);
        const boundary = multipart.getBoundary(req.headers['content-type']);
        const parts = multipart.Parse(bodyBuffer, boundary);

        if (!parts || parts.length === 0) {
            context.res = {
                status: 400,
                body: { error: 'No file parts found' }
            };
            return;
        }

        const file = parts[0];
        const { blobContainer, cosmosContainer } = await initializeAzureResources();

        // Upload to blob storage
        const blobName = `${Date.now()}-${file.filename}`;
        const blockBlobClient = blobContainer.getBlockBlobClient(blobName);
        await blockBlobClient.upload(file.data, file.data.length);

        // Create metadata in Cosmos DB
        const metadata = {
            id: blobName,
            name: file.filename,
            url: blockBlobClient.url,
            contentType: file.type,
            uploadDate: new Date().toISOString()
        };

        const { resource: createdItem } = await cosmosContainer.items.create(metadata);

        context.res = {
            status: 200,
            body: createdItem
        };
    } catch (error) {
        context.log.error('Upload error:', error);
        context.res = {
            status: 500,
            body: { error: 'Upload failed' }
        };
    }
};
