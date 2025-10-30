import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  // Legacy watchlist - kept for backwards compatibility
  watchlist: [{ type: Schema.Types.ObjectId, ref: "Movie" }],
  // Reference to user's profiles
  profiles: [{ type: Schema.Types.ObjectId, ref: "Profile" }]
}, { timestamps: true });

export default mongoose.model("User", userSchema);
