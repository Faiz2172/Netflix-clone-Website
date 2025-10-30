// backend/routes/watchlist.js

import express from "express";
import auth from "../middleware/auth.js";
import { getWatchlist, addToWatchlist, removeFromWatchlist, clearWatchlist } from "../controllers/watchlistController.js";

const router = express.Router();

// IMPORTANT: Order matters! /clear must come before /:movieId
router.get("/", auth, getWatchlist);
router.post("/:movieId", auth, addToWatchlist);
router.delete("/clear", auth, clearWatchlist);
router.delete("/:movieId", auth, removeFromWatchlist);

export default router;