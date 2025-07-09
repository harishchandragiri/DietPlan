import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';

const corsOptions = {
  origin: corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
};

app.use(cors(corsOptions));
// app.options('*', cors(corsOptions));

app.use(express.json({ limit: "500kb" }));
app.use(express.urlencoded({ extended: true, limit: "500kb" }));
app.use(cookieParser());

// Routes
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';

app.use('/', authRoutes);
app.use('/', postRoutes);

export { app };
