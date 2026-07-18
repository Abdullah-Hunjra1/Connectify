import express from 'express';
import "dotenv/config";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import chatRoute from './routes/chatRoute.js'

import path from 'path';


import { connectDB } from './lib/db.js';

const app = express();
const PORT=process.env.PORT

const __dirname = path.resolve();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute); 
app.use("/api/chat-page", chatRoute);


// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
//   });
// }

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})
