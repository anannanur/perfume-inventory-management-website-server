const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// creating app 
const app = express();

//middleware
app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('Running perfume inventory management system');
});

app.listen(port, ()=> {
    console.log('Listeing to port',port);
})
