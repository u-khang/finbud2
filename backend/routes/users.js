// backend/routes/users.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");


// GET /api/users - get all user profiles (admin)
router.get("/", async (req, res) => {
  try {
    const all = await User.find().sort({ date: -1 });
    res.json(all);  
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/users - create a new user profile
// router.post("/", async (req, res) => {
//   try {
//     const newTx = new User(req.body);
//     const saved = await newTx.save();
//     req.session.userId = newTx._id;  // set session
//     res.status(201).json(saved);
//   } catch (err) {
//     console.error("Create user error:", err);
//     res.status(400).json({ error: err.message });
//   }
// });


// POST /api/users/signup - sign up a new user
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = new User({ username, email, password });
    const saved = await user.save();
    req.session.userId = user._id;  // set session
    res.status(201).json({ message: "Sign up successfully", user: saved });
    console.log("User registered successfully:", email);
  } catch (err) {
    console.error("Signup error:", err);
    res.status(400).json({ error: err.message });
  }
});

// POST /api/users/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Login attempt: User not found");
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    // Use the comparePassword method for secure comparison
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log("Login attempt: Invalid password");
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    req.session.userId = user._id;  // set session
    res.json({ user });
    console.log("Login successful for:", email);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// GET /api/users/profile - check if user is logged in
router.get("/profile", async (req, res) => {
  try {
    if (!req.session.userId) 
      return res.status(401).json({ error: "Not logged in" });
    const user = await User.findById(req.session.userId).select("-password");
    res.json({ message: "User session active", user });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// POST /api/users/logout - log out a user
router.post("/logout", (req, res) => {
  try {
    req.session.destroy(() => {
      res.json({ message: "Logged out" });
    });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
