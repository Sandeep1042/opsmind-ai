import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import session from "express-session";
import uploadRoutes from "./routes/upload.js";
import searchRoutes from "./routes/search.js";
import testQueryRoutes from "./routes/testQuery.js";
import askRoutes from "./routes/ask.js";
import chatRoutes from "./routes/chat.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import passport from "./config/passport.js";

dotenv.config();
connectDB();
const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());

// Session middleware for passport
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/test", testQueryRoutes);
app.use("/api/ask", askRoutes);
app.use("/api/chat", chatRoutes);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("OpsMind AI backend running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
