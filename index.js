const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

// creating app 
const app = express();

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gdexo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    await client.connect();
    const perfumeCollection = client.db('perfumeInventory').collection('perfume');
    const individualCollection = client.db('perfumeInventory').collection('individualItems')

    // get api for find all items 
    app.get('/perfume', async (req, res) => {
        const query = {};
        const cursor = perfumeCollection.find(query);
        const perfumes = await cursor.toArray();
        res.send(perfumes);
    })

    // get api for find an item 
    app.get('/perfume/:id', async (req, res) => {
        const email = req.query.email;
        const query ={email: email};
        // const id = req.params.id;
        // const query = { _id: ObjectId(id) };
        const perfume = await perfumeCollection.findOne(query);
        res.send(perfume);
    })

    // POST api for inserting an item 
    app.post('/perfume', async (req, res) => {
        const newPerfume = req.body;
        const result = await perfumeCollection.insertOne(newPerfume);
        res.send(result);
    })

    // delete api for delete an item
    app.delete('/perfume/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await perfumeCollection.deleteOne(query);
        res.send(result);
    })

    // individual collection api

    // creating GET API for loading individual's item 
    app.get('/myitem', async(req,res)=>{
        const email = req.query.email;
        const query ={email: email};
        const cursor = individualCollection.find(query);
        const items = await cursor.toArray(); 
        res.send(items);
    })


    // create POST API for inserting individual's item 
    app.post('/myitem',async(req,res)=>{
        const myItem = req.body;
        const result = await individualCollection.insertOne(myItem);
        res.send(result);
    })


    app.delete('/myitem/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await individualCollection.deleteOne(query);
        res.send(result);
    })
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running perfume inventory management system');
});

app.listen(port, () => {
    console.log('Listeing to port', port);
})
