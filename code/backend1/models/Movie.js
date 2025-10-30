import mongoose from "mongoose";
const { Schema } = mongoose;

const movieSchema = new mongoose.Schema({
  title: String,
  description: String,
  genre: [String],   // ✅ now supports multiple genres
  year: Number,
  posterUrl: String,
}, { timestamps: true });

export default mongoose.model("Movie", movieSchema);