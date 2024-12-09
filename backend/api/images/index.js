const { initializeAzureResources } = require('../shared/azure-config');

module.exports = async function (context, req) {
    try {
        const { cosmosContainer } = await initializeAzureResources();
        const { resources } = await cosmosContainer.items
            .query('SELECT * FROM c ORDER BY c.uploadDate DESC')
            .fetchAll();
            
        context.res = {
            status: 200,
            body: resources
        };
    } catch (error) {
        context.log.error('Fetch error:', error);
        context.res = {
            status: 500,
            body: { error: 'Failed to fetch images' }
        };
    }
};