import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import movieRoutes from "./routes/movies.js";
import watchlistRoutes from "./routes/watchlist.js";
import profileRoutes from "./routes/profiles.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// DB connect
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Mongo connection error:", err.message));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/profiles", profileRoutes);

// Serve static frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FRONTEND_DIR = path.join(__dirname, "../frontend");

// Serve static files
app.use(express.static(FRONTEND_DIR));

// Specific route for root - explicitly serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "index.html"));
});

// Handle specific HTML routes
app.get("/login", (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "login.html"));
});

app.get("/browse", (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "browse.html"));
});

app.get("/watchlist", (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "watchlist.html"));
});

app.get("/profiles", (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "profiles.html"));
});

app.get("/manage-profiles", (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "manage-profiles.html"));
});

// Fallback for SPA routing - but only for non-API routes
app.get("*", (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'API route not found' });
  }
  res.sendFile(path.join(FRONTEND_DIR, "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
