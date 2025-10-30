import mongoose from "mongoose";
const { Schema } = mongoose;

const profileSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 20,
    },
    avatar: {
      type: String,
      required: true,
      default: "🎬",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    watchlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "Movie",
      },
    ],
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Ensure user doesn't exceed 5 profiles
profileSchema.pre("save", async function (next) {
  if (this.isNew) {
    const count = await mongoose
      .model("Profile")
      .countDocuments({ userId: this.userId });
    if (count >= 5) {
      throw new Error("Maximum 5 profiles allowed per user");
    }
  }
  next();
});

export default mongoose.model("Profile", profileSchema);
