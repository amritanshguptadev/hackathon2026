import dotenv from 'dotenv';
dotenv.config();
import mongoose from "mongoose";
const MONGO_URL = process.env.MONGO_CONN;

mongoose.connect(MONGO_URL)
    .then(()=>{
        console.log("✅ MongoDB is connected successfully")
    })
    .catch((error)=>{
        console.log("❌ MongoDB is not connected! There might be some error",error);
    })

