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
    try {
        await client.connect();
        const perfumeCollection = client.db('perfumeInventory').collection('perfume');

        // GET API for finding all items 
        app.get('/perfume', async (req, res) => {
            const query = {};
            const cursor = perfumeCollection.find(query);
            const perfumes = await cursor.toArray();
            res.send(perfumes);
        });

        // GET API for finding an item 
        app.get('/perfume/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const perfume = await perfumeCollection.findOne(query);
            res.send(perfume);
        });

        // POST api for inserting an item 
        app.post('/perfume', async (req, res) => {
            const newPerfume = req.body;
            const result = await perfumeCollection.insertOne(newPerfume);
            res.send(result);
        });

        // PUT API for updating items quantity 
        app.put('/perfume/:id',async(req,res)=>{
            const id = req.params.id;
            const newItem = req.body;
            const filter = {_id: ObjectId(id)};
            const options = {upsert: true};
            const updatedDoc = {
                $set:{
                    quantity: newItem.quantity,                
                }
            };
            const result = await perfumeCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

        // DELETE API for deleting an item
        app.delete('/perfume/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await perfumeCollection.deleteOne(query);
            res.send(result);
        });

        // GET API for loading user selected items 
        app.get('/myitem', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = await perfumeCollection.find(query);
            const perfumes = await cursor.toArray();
            res.send(perfumes);
        });

    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running perfume inventory management system');
});

app.listen(port, () => {
    console.log('Listeing to port', port);
})
