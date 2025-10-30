import Profile from "../models/Profile.js";
import User from "../models/User.js";
import Movie from "../models/Movie.js";

// Get all profiles for a user
export const getProfiles = async (req, res) => {
  try {
    console.log("Getting profiles for user:", req.user.id);

    const profiles = await Profile.find({ userId: req.user.id }).sort({
      createdAt: 1,
    });

    res.json({
      profiles,
      count: profiles.length,
      maxProfiles: 5,
    });
  } catch (error) {
    console.error("Get profiles error:", error);
    res
      .status(500)
      .json({ message: "Error fetching profiles", error: error.message });
  }
};

// Create a new profile
export const createProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;

    console.log("Creating profile:", name, "for user:", req.user.id);

    // Validation
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: "Profile name is required" });
    }

    if (name.length > 20) {
      return res
        .status(400)
        .json({ message: "Profile name must be 20 characters or less" });
    }

    // Check profile count
    const profileCount = await Profile.countDocuments({ userId: req.user.id });
    if (profileCount >= 5) {
      return res.status(400).json({ message: "Maximum 5 profiles allowed" });
    }

    // Create profile
    const profile = new Profile({
      name: name.trim(),
      avatar: avatar || "🎬",
      userId: req.user.id,
      watchlist: [],
      isDefault: profileCount === 0, // First profile is default
    });

    await profile.save();

    // Add profile to user's profiles array
    await User.findByIdAndUpdate(req.user.id, {
      $push: { profiles: profile._id },
    });

    console.log("Profile created:", profile._id);

    res.status(201).json({
      message: "Profile created successfully",
      profile,
    });
  } catch (error) {
    console.error("Create profile error:", error);
    res
      .status(500)
      .json({ message: error.message || "Error creating profile" });
  }
};

// Update a profile
export const updateProfile = async (req, res) => {
  try {
    const { profileId } = req.params;
    const { name, avatar } = req.body;

    console.log("Updating profile:", profileId);

    // Find profile and verify ownership
    const profile = await Profile.findById(profileId);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (profile.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this profile" });
    }

    // Validation
    if (name !== undefined) {
      if (name.trim().length === 0) {
        return res
          .status(400)
          .json({ message: "Profile name cannot be empty" });
      }
      if (name.length > 20) {
        return res
          .status(400)
          .json({ message: "Profile name must be 20 characters or less" });
      }
      profile.name = name.trim();
    }

    if (avatar !== undefined) {
      profile.avatar = avatar;
    }

    await profile.save();

    console.log("Profile updated:", profileId);

    res.json({
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
};

// Delete a profile
export const deleteProfile = async (req, res) => {
  try {
    const { profileId } = req.params;

    console.log("Deleting profile:", profileId);

    // Find profile and verify ownership
    const profile = await Profile.findById(profileId);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (profile.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this profile" });
    }

    // Check if it's the last profile
    const profileCount = await Profile.countDocuments({ userId: req.user.id });
    if (profileCount <= 1) {
      return res
        .status(400)
        .json({ message: "Cannot delete the last profile" });
    }

    // Delete profile
    await Profile.findByIdAndDelete(profileId);

    // Remove from user's profiles array
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { profiles: profileId },
    });

    console.log("Profile deleted:", profileId);

    res.json({
      message: "Profile deleted successfully",
    });
  } catch (error) {
    console.error("Delete profile error:", error);
    res
      .status(500)
      .json({ message: "Error deleting profile", error: error.message });
  }
};

// Get profile watchlist
export const getProfileWatchlist = async (req, res) => {
  try {
    const { profileId } = req.params;

    console.log("Getting watchlist for profile:", profileId);

    // Find profile and verify ownership
    const profile = await Profile.findById(profileId).populate("watchlist");

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (profile.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this profile" });
    }

    res.json({
      movies: profile.watchlist || [],
      count: profile.watchlist?.length || 0,
    });
  } catch (error) {
    console.error("Get profile watchlist error:", error);
    res
      .status(500)
      .json({ message: "Error fetching watchlist", error: error.message });
  }
};

// Add movie to profile watchlist
export const addToProfileWatchlist = async (req, res) => {
  try {
    const { profileId, movieId } = req.params;

    console.log("Adding movie to profile watchlist:", profileId, movieId);

    // Verify movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Find profile and verify ownership
    const profile = await Profile.findById(profileId);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (profile.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to modify this profile" });
    }

    // Check if movie is already in watchlist
    if (profile.watchlist.some((id) => id.toString() === movieId)) {
      return res.status(400).json({ message: "Movie already in watchlist" });
    }

    // Add movie to watchlist
    profile.watchlist.push(movieId);
    await profile.save();

    // Return updated watchlist
    const updatedProfile = await Profile.findById(profileId).populate(
      "watchlist"
    );

    res.status(201).json({
      message: "Movie added to watchlist",
      movies: updatedProfile.watchlist,
    });
  } catch (error) {
    console.error("Add to profile watchlist error:", error);
    res
      .status(500)
      .json({ message: "Error adding to watchlist", error: error.message });
  }
};

// Remove movie from profile watchlist
export const removeFromProfileWatchlist = async (req, res) => {
  try {
    const { profileId, movieId } = req.params;

    console.log("Removing movie from profile watchlist:", profileId, movieId);

    // Find profile and verify ownership
    const profile = await Profile.findById(profileId);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (profile.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to modify this profile" });
    }

    // Remove movie from watchlist
    profile.watchlist = profile.watchlist.filter(
      (id) => id.toString() !== movieId
    );
    await profile.save();

    // Return updated watchlist
    const updatedProfile = await Profile.findById(profileId).populate(
      "watchlist"
    );

    res.json({
      message: "Movie removed from watchlist",
      movies: updatedProfile.watchlist,
    });
  } catch (error) {
    console.error("Remove from profile watchlist error:", error);
    res
      .status(500)
      .json({ message: "Error removing from watchlist", error: error.message });
  }
};

// Clear profile watchlist
export const clearProfileWatchlist = async (req, res) => {
  try {
    const { profileId } = req.params;

    console.log("Clearing watchlist for profile:", profileId);

    // Find profile and verify ownership
    const profile = await Profile.findById(profileId);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (profile.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to modify this profile" });
    }

    // Clear watchlist
    profile.watchlist = [];
    await profile.save();

    res.json({
      message: "Watchlist cleared successfully",
      movies: [],
    });
  } catch (error) {
    console.error("Clear profile watchlist error:", error);
    res
      .status(500)
      .json({ message: "Error clearing watchlist", error: error.message });
  }
};
