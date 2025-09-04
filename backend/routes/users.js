// backend/routes/users.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// JWT middleware to verify tokens
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.SESSION_SECRET || 'yourSecretKey');
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

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
    
    // Create JWT token for new user
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.SESSION_SECRET || 'yourSecretKey',
      { expiresIn: '24h' }
    );
    
    res.status(201).json({ 
      message: "Sign up successfully", 
      user: saved,
      token 
    });
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
    
    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.SESSION_SECRET || 'yourSecretKey',
      { expiresIn: '24h' }
    );
    
    console.log("JWT token created for user:", user._id);
    res.json({ user, token });
    console.log("Login successful for:", email);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// GET /api/users/profile - check if user is logged in
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
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
