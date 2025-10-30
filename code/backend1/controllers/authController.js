import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Profile from "../models/Profile.js";

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log("Registration attempt for:", email);

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      email,
      passwordHash,
      watchlist: []
    });

    await user.save();
    console.log("User created successfully:", user._id);

    res.status(201).json({ 
      message: "User created successfully",
      userId: user._id 
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log("Login attempt for:", email);

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      console.log("Password mismatch for:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create JWT token with correct structure
    const payload = {
      user: {
        id: user._id.toString()
      }
    };

    console.log("Creating token with payload:", payload);

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("Login successful for:", email, "User ID:", user._id);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};
