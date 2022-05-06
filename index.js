const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const query = require('express/lib/middleware/query');
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

    app.get('/perfume', async(req, res) => {
        const query = {};
        const cursor = perfumeCollection.find(query);
        const perfumes = await cursor.toArray();
        res.send(perfumes);
    })

    app.get('/perfume/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const perfume = await perfumeCollection.findOne(query);
        res.send(perfume);
    })
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running perfume inventory management system');
});

app.listen(port, () => {
    console.log('Listeing to port', port);
})
