// import express from 'express';
// import "dotenv/config";
// import cookieParser from 'cookie-parser';
// import cors from 'cors';
// import authRoute from './routes/authRoute.js';
// import userRoute from './routes/userRoute.js';
// import chatRoute from './routes/chatRoute.js'

// import path from 'path';


// import { connectDB } from './lib/db.js';

// const app = express();
// const PORT=process.env.PORT

// const __dirname = path.resolve();

// app.use(cors({
//     origin: process.env.CLIENT_URL,
//     credentials: true,
// }));

// app.use(express.json());
// app.use(cookieParser());

// app.use("/api/auth", authRoute);
// app.use("/api/users", userRoute); 
// app.use("/api/chat-page", chatRoute);


// // if (process.env.NODE_ENV === "production") {
// //   app.use(express.static(path.join(__dirname, "../frontend/dist")));

// //   app.get("*", (req, res) => {
// //     res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
// //   });
// // }

// app.get("/", (req, res) => {
//   res.send("Backend is running!");
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//     connectDB();
// })







import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import chatRoute from "./routes/chatRoute.js";

import { connectDB } from "./lib/db.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB before handling API requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection error:", error.message);

    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/chat-page", chatRoute);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

export default app;
