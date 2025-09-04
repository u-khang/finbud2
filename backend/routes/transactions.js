// backend/routes/transactions.js
const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
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

// GET /api/transactions - Get all transactions (admin only)
router.get("/", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not logged in" });
    }
    
    const all = await Transaction.find().sort({ date: -1 });
    res.json(all);
  } catch (err) {
    console.error("Error fetching all transactions:", err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// GET /api/transactions/my - Get logged-in user's transactions
router.get("/my", verifyToken, async (req, res) => {
  try {
    console.log("Transactions request - UserId:", req.userId);

    const transactions = await Transaction.find({ user: req.userId })
      .sort({ date: -1 });
    
    res.json({ transactions });
  } catch (err) {
    console.error("Error fetching user transactions:", err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// POST /api/transactions - Create a new transaction for logged-in user
router.post("/", verifyToken, async (req, res) => {
  try {
    const { type, amount, category, date, note, transactionType } = req.body;

    const transaction = new Transaction({
      user: req.userId,
      type,
      amount,
      category,
      note,
      transactionType,
      date: date || new Date()
    });

    const saved = await transaction.save();
    res.status(201).json({ transaction: saved });
  } catch (err) {
    console.error("Error creating transaction:", err);
    res.status(400).json({ error: err.message });
  }
});

// GET /api/transactions/:id - Get a specific transaction by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.json({ transaction });
  } catch (err) {
    console.error("Error fetching transaction:", err);
    res.status(500).json({ error: "Failed to fetch transaction" });
  }
});

// PUT /api/transactions/:id - Update a transaction
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { type, amount, category, date, note, transactionType } = req.body;

    const transaction = await Transaction.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.userId
      },
      {
        type,
        amount,
        category,
        date,
        note,
        transactionType
      },
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.json({ transaction });
  } catch (err) {
    console.error("Error updating transaction:", err);
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/transactions/:id - Delete a transaction
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.json({ message: "Transaction deleted successfully" });
  } catch (err) {
    console.error("Error deleting transaction:", err);
    res.status(500).json({ error: "Failed to delete transaction" });
  }
});

module.exports = router;
