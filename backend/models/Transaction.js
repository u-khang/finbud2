// backend/models/Transaction.js
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ["income", "expense"], 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  category: { 
    type: String 
  },
  date: { type: Date, 
    default: Date.now 
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  transactionType: {
    type: String,
    default: null
  },
  note: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model("Transaction", transactionSchema);
