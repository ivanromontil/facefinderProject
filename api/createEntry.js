const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_DB_CONNECTION_STRING;
const key = process.env.COSMOS_DB_KEY;

const client = new CosmosClient({ endpoint, key });
const databaseId = 'my-database';
const containerId = 'my-container';

module.exports = async function (context, req) {
  const { id, data } = req.body;

  try {
    const { database } = await client.databases.createIfNotExists({ id: databaseId });
    const { container } = await database.containers.createIfNotExists({ id: containerId });

    const { resource: createdItem } = await container.items.create({ id, data });

    context.res = {
      status: 200,
      body: createdItem
    };
  } catch (error) {
    context.res = {
      status: 500,
      body: `Error: ${error.message}`
    };
  }
};
