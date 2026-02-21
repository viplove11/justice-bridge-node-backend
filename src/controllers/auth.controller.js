import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

// Register user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check all fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Existing user?
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
// const hashedPassword = await bcrypt.hash(password, salt);
    // generate salt and hash password (use async, non-blocking)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    // User exists?
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Success
    return res.status(200).json({
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// logout user 
export const logoutUser = async (req, res) => {
    try {
        const { user_id } = req.body;

        // Check user_id
        if (!user_id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Check if user exists
        const user = await User.findById(user_id);

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }

        // If needed, you can clear tokens/sessions here

        return res.status(200).json({
            status: true,
            message: "Logout successful"
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Google OAuth login / register (upsert)
// Expects: { name, email } in req.body (from Google profile)
// Behavior:
//  - If a user with this email exists, reuse it
//  - Otherwise, create a new user with a random password placeholder
// Returns: { message, token, user: { id, name, email } }
export const googleAuth = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user with a placeholder password
      const randomPassword = Math.random().toString(36).slice(-12);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      user = await User.create({
        name: name || email.split("@")[0],
        email,
        password: hashedPassword,
      });
    }

    return res.status(200).json({
      message: "Google auth successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
