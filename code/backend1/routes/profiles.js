// Put this is routes/profiles.js

import express from "express";
import auth from "../middleware/auth.js";
import {
  getProfiles,
  createProfile,
  updateProfile,
  deleteProfile,
  getProfileWatchlist,
  addToProfileWatchlist,
  removeFromProfileWatchlist,
  clearProfileWatchlist,
} from "../controllers/profileController.js";

const router = express.Router();

// Profile management routes
router.get("/", auth, getProfiles);
router.post("/", auth, createProfile);
router.put("/:profileId", auth, updateProfile);
router.delete("/:profileId", auth, deleteProfile);

// Profile watchlist routes
router.get("/:profileId/watchlist", auth, getProfileWatchlist);
router.post("/:profileId/watchlist/:movieId", auth, addToProfileWatchlist);
router.delete("/:profileId/watchlist/clear", auth, clearProfileWatchlist);
router.delete(
  "/:profileId/watchlist/:movieId",
  auth,
  removeFromProfileWatchlist
);

export default router;
