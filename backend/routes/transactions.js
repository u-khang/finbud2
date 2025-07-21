// backend/routes/transactions.js
const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");


// GET /api/transactions
router.get("/", async (req, res) => {
  const all = await Transaction.find().sort({ date: -1 });
  res.json(all);
  console.log("GET /api/transactions");
});


// POST /api/transactions
router.post("/", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not logged in" });
    }

    const transaction = new Transaction({
      ...req.body,
      user: req.session.userId  
    });

    const saved = await transaction.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


module.exports = router;
