const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const router = express.Router();

// Test route to verify mounting
router.get("/test", (req, res) => {
  console.log("Auth test route hit!");
  res.json({ message: "Auth routes are working!" });
});

// Register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });
    res.status(201).json({ message: "User registered!" });
  } catch (err) {
    res.status(400).json({ error: "Registration failed", details: err });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ 
      token, 
      username: user.username, 
      userId: user._id,
      displayName: user.displayName,
      profilePicture: user.profilePicture
    });
  } catch (err) {
    res.status(400).json({ error: "Login failed", details: err });
  }
});

// Get all users (except self)
router.get("/users", async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: "Unauthorized" });
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const users = await User.find({ _id: { $ne: decoded.userId } }, { password: 0 });
    res.json(users);
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
});

// Update profile
router.put("/profile", async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: "Unauthorized" });
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const { displayName, profilePicture } = req.body;
    const updateData = {};
    
    if (displayName !== undefined) updateData.displayName = displayName;
    if (profilePicture !== undefined) updateData.profilePicture = profilePicture;
    
    const user = await User.findByIdAndUpdate(
      decoded.id,
      updateData,
      { new: true, select: '-password' }
    );
    
    res.json(user);
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(400).json({ error: "Profile update failed", details: err });
  }
});

// Get current user profile
router.get("/profile", async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: "Unauthorized" });
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id, { password: 0 });
    res.json(user);
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
});

module.exports = router;
