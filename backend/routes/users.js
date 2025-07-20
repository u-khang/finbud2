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

module.exports = router;


// POST /api/users/signup
router.post("/signup", async (req, res) => {
  try {
    const newUser = new User(req.body);
    const saved = await newUser.save();
    res.status(201).json(saved);
    console.log("new user entry added");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
