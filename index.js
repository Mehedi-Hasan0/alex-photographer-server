const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.69zqaep.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('alex').collection('services');
        const reviewsCollection = client.db('alex').collection('reviews');

        app.get('/limitedServices', async (req, res) => {
            const query = {};
            const sorting = { _id: -1 };
            const cursor = serviceCollection.find(query, sorting).limit(3);
            const limitedServices = await cursor.toArray();
            res.send(limitedServices);
        });

        app.get('/allServices', async (req, res) => {
            const query = {};
            const sorting = { _id: -1 };
            const cursor = serviceCollection.find(query, sorting);
            const allServices = await cursor.toArray();
            res.send(allServices)
        });

        app.get('/serviceDetails/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        // reviews api
        app.post('/reviews', async (req, res) => {
            const reviews = req.body;
            const result = await reviewsCollection.insertOne(reviews);
            res.send(result);

        });

        app.get('/reviews', async (req, res) => {
            const query = {};
            const cursor = reviewsCollection.find(query).sort({ date: -1 });
            const reviews = await cursor.toArray();
            res.send(reviews);
        })
    }
    finally {

    }
}
run().catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Alex-Photography server is running')
});

app.listen(port, () => {
    console.log(`Alex-Photography server is running on port : ${port}`);
})