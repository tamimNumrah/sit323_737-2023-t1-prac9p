//const { MongoClient, ServerApiVersion } = require('mongodb');
var mongoose = require('mongoose');
//Database connection

const uri = "mongodb://admin:password@localhost:32000/?authMechanism=DEFAULT";
//const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const client = mongoose.connection;
client.on('connected', () => {
    console.log('Database Connected');
});

client.on('disconnected', () => {
    console.log('Database disconnected');
});
client.on('error', console.error.bind(console, 'connection error:'));

exports.mongoose = client;