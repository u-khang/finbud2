// backend/routes/transactions.js
const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

router.get("/", async (req, res) => {
  const all = await Transaction.find().sort({ date: -1 });
  res.json(all);  
});

router.post("/", async (req, res) => {
  try {
    const newTx = new Transaction(req.body);
    const saved = await newTx.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
