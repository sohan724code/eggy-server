const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q4lid.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db('eggy');
        const FoodsCollection = database.collection('foodItems');
        const RestaurantCollection = database.collection('restaurants');
        const PlaceOrderCollection = database.collection('orders');
        // GET API
        app.get('/items', async (req, res) => {
            const cursor = FoodsCollection.find({});
            const items = await cursor.toArray();
            res.send(items);
        });
        app.get('/orders', async (req, res) => {
            const cursor = PlaceOrderCollection.find({});
            const items = await cursor.toArray();
            res.send(items);
        });

        app.get('/restaurants', async (req, res) => {
            const cursor = RestaurantCollection.find({});
            const items = await cursor.toArray();
            res.send(items);
        });

        // GET Single Service
        app.get('/items/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) };
            const item = await FoodsCollection.findOne(query);
            res.json(item);
        })
        // POST API 
        app.post('/orders', async (req, res) => {
            const orders = req.body;
            const result = await PlaceOrderCollection.insertOne(orders);
            console.log(result);
            res.json(result)
        });

        app.post('/items', async (req, res) => {
            const item = req.body;
            const result = await FoodsCollection.insertOne(item);
            console.log(result);
            res.json(result)
        });
        // DELETE API 
        app.delete('/orders/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await PlaceOrderCollection.deleteOne(query);

            res.json(result);


        })

        // PUT API 
        app.put('/orders/:id', async (req, res) => {

            const id = req.params.id;

            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    status: `approved`
                },
            };
            const result = await PlaceOrderCollection.updateOne(filter, updateDoc);

            res.json(result);


        })


    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Genius Server');
});



app.listen(port, () => {
    console.log('Running Genius Server on port', port);
})
