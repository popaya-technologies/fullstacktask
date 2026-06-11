const express=require('express');
const cors=require('cors');
const connectDB = require('./config/db');
const noteRoutes = require('./routes/noteRoutes');
require('dotenv').config();

const app=express();
app.use(cors());
app.use(express.json());

connectDB();
app.get('/',(req,res)=>{
    res.status(200).send('Home')
})
app.use('/notes',noteRoutes)
const port=process.env.PORT
app.listen(port,()=>{
    console.log(`Server Connected to PORT ${port}`)
})