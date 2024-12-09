const { BlobServiceClient } = require('@azure/storage-blob');
const { CosmosClient } = require('@azure/cosmos');

// Azure configuration
const blobConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const cosmosConnectionString = process.env.COSMOS_DB_CONNECTION_STRING;
const blobContainerName = 'media';
const databaseName = 'MediaDB';
const cosmosContainerName = 'ImageMetadata';

// Initialize Azure clients
const blobServiceClient = BlobServiceClient.fromConnectionString(blobConnectionString);
const cosmosClient = new CosmosClient(cosmosConnectionString);

const initializeAzureResources = async () => {
    const blobContainer = blobServiceClient.getContainerClient(blobContainerName);
    await blobContainer.createIfNotExists();
    
    const database = cosmosClient.database(databaseName);
    const cosmosContainer = database.container(cosmosContainerName);
    
    return { blobContainer, cosmosContainer };
};

module.exports = {
    initializeAzureResources,
    blobContainerName,
    databaseName,
    cosmosContainerName
};