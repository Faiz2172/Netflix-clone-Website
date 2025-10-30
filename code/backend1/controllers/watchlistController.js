import User from "../models/User.js";
import Movie from "../models/Movie.js";

export const getWatchlist = async (req, res, next) => {
  try {
    console.log("Getting watchlist for user:", req.user?.id);
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const user = await User.findById(req.user.id).populate("watchlist");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ 
      movies: user.watchlist || [],
      count: user.watchlist?.length || 0
    });
  } catch (error) { 
    console.error("Get watchlist error:", error);
    res.status(500).json({ message: "Error fetching watchlist", error: error.message });
  }
};

export const addToWatchlist = async (req, res, next) => {
  try {
    console.log("Adding to watchlist - User:", req.user?.id, "Movie:", req.params.movieId);
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { movieId } = req.params;
    
    if (!movieId) {
      return res.status(400).json({ message: "Movie ID is required" });
    }

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Get user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if movie is already in watchlist
    const isAlreadyInWatchlist = user.watchlist.some(id => id.toString() === movieId);
    
    if (isAlreadyInWatchlist) {
      return res.status(400).json({ message: "Movie already in watchlist" });
    }

    // Add movie to watchlist
    user.watchlist.push(movieId);
    await user.save();

    // Return updated watchlist
    const populatedUser = await User.findById(req.user.id).populate("watchlist");
    
    res.status(201).json({ 
      message: "Movie added to watchlist",
      movies: populatedUser.watchlist
    });

  } catch (error) { 
    console.error("Add to watchlist error:", error);
    res.status(500).json({ message: "Error adding to watchlist", error: error.message });
  }
};

export const removeFromWatchlist = async (req, res, next) => {
  try {
    console.log("Removing from watchlist - User:", req.user?.id, "Movie:", req.params.movieId);
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { movieId } = req.params;
    
    if (!movieId) {
      return res.status(400).json({ message: "Movie ID is required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Check if movie exists in watchlist
    const movieExists = user.watchlist.some(id => id.toString() === movieId);
    if (!movieExists) {
      return res.status(404).json({ message: "Movie not found in watchlist" });
    }
    
    // Remove movie from watchlist
    user.watchlist = user.watchlist.filter(id => id.toString() !== movieId);
    await user.save();
    
    // Return updated watchlist
    const populatedUser = await User.findById(req.user.id).populate("watchlist");
    
    res.json({ 
      message: "Movie removed from watchlist",
      movies: populatedUser.watchlist
    });

  } catch (error) { 
    console.error("Remove from watchlist error:", error);
    res.status(500).json({ message: "Error removing from watchlist", error: error.message });
  }
};

export const clearWatchlist = async (req, res, next) => {
  try {
    console.log("Clearing watchlist for user:", req.user?.id);
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.watchlist = [];
    await user.save();
    
    res.json({ 
      message: "Watchlist cleared successfully",
      movies: []
    });

  } catch (error) { 
    console.error("Clear watchlist error:", error);
    res.status(500).json({ message: "Error clearing watchlist", error: error.message });
  }
};