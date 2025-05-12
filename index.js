import dotenv from 'dotenv';
import mongoose from "mongoose";
import { app } from './app.js';

dotenv.config();
const port = process.env.PORT || 3003;

const DB_CONNECTION = async() =>{
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/DietDB`)
        console.log(`\n MONGODB connected !! DB HOST : ${connectionInstance.connection.host}`)
    }catch (error){
        console.log("MONGODB connection error", error)
        process.exit(1);
    }
}

// Database connection Execution
DB_CONNECTION().
then(()=>{
   app.listen(port, ()=>{
      console.log(`server is running in port no ${port}`)
   })
})
.catch((error)=>{
   console.log('Mongodb connection failed !!!', error)
})

