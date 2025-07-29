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

// fetch logged-in user's transactions
router.get("/test", async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: "Unauthorized" });

  const transactions = await Transaction.find({ user: req.session.userId });
  res.json({ transactions });
});

//
// router.post("/test", async (req, res) => {
//   try {
//     const { userId, amount, category, date } = req.body;

//     const newTransaction = new Transaction({
//       userId,
//       amount,
//       category,
//       date: date || new Date()
//     });

//     const savedTransaction = await newTransaction.save();
//     res.status(201).json({ transaction: savedTransaction });
//   } catch (err) {
//     console.error("Error adding transaction:", err);
//     res.status(500).json({ error: "Failed to add transaction" });
//   }
// });


// Add a transaction for logged-in user
router.post("/test", async (req, res) => {
  const { type, amount, category, date, note, transactionType } = req.body;
  if (!req.session.userId) return res.status(401).json({ error: "Unauthorized" });

  const newTransaction = new Transaction({
    user: req.session.userId,
    type,
    amount,
    category,
    note,
    transactionType,
    date: date || new Date()
  });

  const savedTransaction = await newTransaction.save();
  res.status(201).json({ transaction: savedTransaction });
});



module.exports = router;
