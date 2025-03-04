import express from 'express';
import { app, server } from './utils/socket.js';
import connectDB from './db/dbConnection.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoute from './routes/authRoute.js';
import messageRoute from './routes/messageRoute.js';
import groupRoute from './routes/groupRoute.js';
import './utils/config.js'
import path from 'path';

const __dirname = path.resolve();

app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

connectDB();

app.use("/api/auth", authRoute)
app.use("/api/message", messageRoute)
app.use("/api/group", groupRoute)

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
    })
}

const port = process.env.PORT
server.listen(port, () => {
    console.log(`Server on http://localhost:${port}`);
})