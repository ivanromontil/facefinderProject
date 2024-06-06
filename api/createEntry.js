// api/createEntry/index.js
const { CosmosClient } = require("@azure/cosmos");

const config = require('../config');

const endpoint = config.endpoint;
const key = config.key;
const databaseId = config.database.id;
const containerId = config.container.id;

const client = new CosmosClient({ endpoint, key });

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.method !== 'POST') {
        context.res = {
            status: 405,
            body: "Method Not Allowed"
        };
        return;
    }

    const { url } = req.body;

    if (!url) {
        context.res = {
            status: 400,
            body: "Please pass a URL in the request body"
        };
        return;
    }

    try {
        const { database } = await client.databases.createIfNotExists({ id: databaseId });
        const { container } = await database.containers.createIfNotExists({ id: containerId });

        const { resource: createdItem } = await container.items.create({ url });

        context.res = {
            status: 200,
            body: createdItem
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: error.message
        };
    }
};
