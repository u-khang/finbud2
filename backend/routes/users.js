// backend/routes/transactions.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");


// GET /api/users
router.get("/", async (req, res) => {
  const all = await User.find().sort({ date: -1 });
  res.json(all);  
});


// POST /api/users
router.post("/", async (req, res) => {
  try {
    const newTx = new User(req.body);
    const saved = await newTx.save();
    req.session.userId = newTx._id;  // set session
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
  console.log("POST /api/users");
});


// POST /api/users/signup
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = new User({ username, email, password });
    const saved = await user.save();
    req.session.userId = user._id;  // set session
    res.status(201).json({ message: "Sign up successfully", user: saved });
    console.log(saved); // res data
    console.log(req.body); // req data
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
  console.log("POST /api/users/signup");
});

// POST /api/users/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      console.log("Login attempt:", req.body);
      return res.status(401).json({ error: "Invalid credentials" });
    }
    req.session.userId = user._id;  // set session
    res.json({ user });
    console.log(req.body); // req data
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
  console.log("POST /api/users/login");
});

// Check Session
// GET /api/users/profile
router.get("/profile", async (req, res) => {
  if (!req.session.userId) 
    return res.status(401).json({ error: "Not logged in" });
  const user = await User.findById(req.session.userId).select("-password");
  res.json({ message: "User session active", user });
  console.log("GET /api/users/profile");
});


// Logout
// POST /api/users/logout
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out" });
  });
  console.log("POST /api/users/logout");
});


module.exports = router;
