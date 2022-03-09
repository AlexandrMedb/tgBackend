const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
// const path = require('path');
const mongoose = require('mongoose');
const config = require('config');


const { createAdapter } = require("@socket.io/mongo-adapter");
const { MongoClient } = require("mongodb");

app.use(express.json({ extended: true }));

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/map', require('./routes/map.routes'));

app.get('/', (req, res) => {
    res.send('hello world');
});






const PORT = config.get('port') || 5000


async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
    } catch (e) {
        console.log('Server Error', e.message)
        process.exit(1)
    }
}

start()

const DB = "tgDatabase";
const COLLECTION = "socket.io-adapter-events";

const io = new Server();

const mongoClient = new MongoClient(config.get('mongoUri'), {
    useUnifiedTopology: true,
});

const main = async () => {
    await mongoClient.connect();
    console.log('ioConnect');

    try {
        await mongoClient.db(DB).createCollection(COLLECTION, {
            capped: true,
            size: 1e6
        });

    } catch (e) {
        //console.log(e);
        // collection already exists
    }
    const mongoCollection = mongoClient.db(DB).collection(COLLECTION);

    io.adapter(createAdapter(mongoCollection));
    io.listen(4000);
}

main();



