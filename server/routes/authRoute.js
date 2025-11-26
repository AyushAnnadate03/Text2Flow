import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "secret_for_dev_only";

// -------- Register --------
router.post("/register", async (req, res) => {
  try {
    console.log("Register request body:", req.body);
    const { email, username, password } = req.body;

    // Check required fields
    if (!email || !username || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user already exists
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "User already exists" });

    // Hash password and save user
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ email, username, passwordHash });

    console.log("Created user object:", user);
    await user.save();
    console.log("User saved!");

    // Generate JWT
    const token = jwt.sign({ id: user._id, email }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, user: { id: user._id, email, username } });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -------- Login --------
router.post("/login", async (req, res) => {
  try {
    console.log("Login request body:", req.body);
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) return res.status(400).json({ error: "All fields are required" });

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    // Compare password
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign({ id: user._id, email }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, user: { id: user._id, email, username: user.username } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
