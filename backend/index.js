const express = require('express');
const cors = require('cors');
const app = express();
const categories = require('./app/categories');
const items = require('./app/items');
const places = require('./app/places');
const mysqlDb = require('./mysqlDb');

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const port = 8000;

app.use('/categories', categories);
app.use('/items', items);
app.use('/places',places);


const run = async () => {
    await mysqlDb.connect();

    app.listen(port, ()=>{
        console.log('server started on ' + port);
    });
};

run().catch(console.error);


