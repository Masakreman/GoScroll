const { BlobServiceClient } = require('@azure/storage-blob');
const { CosmosClient } = require('@azure/cosmos');

const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
const cosmosClient = new CosmosClient(process.env.COSMOS_DB_CONNECTION_STRING);

module.exports = async function (context, req) {
    try {
        const container = cosmosClient.database('MediaDB').container('ImageMetadata');
        const { resources } = await container.items
            .query('SELECT * FROM c ORDER BY c._ts DESC')
            .fetchAll();
        
        context.res = {
            body: resources
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: { error: 'Failed to fetch images' }
        };
    }
};