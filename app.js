import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
// import { errorHandler } from "./middlewares/error.middleware.js";

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],       //a frontend URL from which request are comming 
    credentials: true
}))
app.use(express.json({limit: "500kb"}))
app.use(express.urlencoded({extended: true, limit: "500kb"}))
app.use(cookieParser())


//routes import
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';


// routes declaration
app.use('/', authRoutes);
app.use('/', postRoutes);

export {app}