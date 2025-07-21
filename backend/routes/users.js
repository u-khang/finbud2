// backend/routes/transactions.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/", async (req, res) => {
  const all = await User.find().sort({ date: -1 });
  res.json(all);  
});

router.post("/", async (req, res) => {
  try {
    const newTx = new User(req.body);
    const saved = await newTx.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// module.exports = router;


// POST /api/users/signup
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = new User({ username, email, password });
    await user.save();
    req.session.userId = user._id;  // set session
    res.status(201).json({ message: "Signup successful", user });
    console.log("✅ Saved user:", saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    req.session.userId = user._id;  // set session
    res.json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Check Session
router.get("/profile", async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: "Not logged in" });
  const user = await User.findById(req.session.userId).select("-password");
  res.json({ message: "User session active", user });
});

// Logout
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out" });
  });
});



module.exports = router;
