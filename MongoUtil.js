const MongoClient = require('mongodb').MongoClient;

async function connect(mongoUri, databaseName) {
    const client = await MongoClient.connect(mongoUri,{
        useUnifiedTopology: true
        })

        const db = client.db('databaseName');
        return db;
}

//export out the connect function so other JS file can be used
module.exports = {connect};