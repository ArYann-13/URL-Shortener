require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const connectDB=require('./config/dbConnection');
const urlRoutes=require('./routes/urlRoutes');
const { initCounter } = require('./utils/getNextSequence');


const app=express();


app.use(express.json());
app.use(cors());
connectDB();
app.use('/', urlRoutes);
initCounter();
const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>
    console.log(`Server running on port ${PORT}`));
