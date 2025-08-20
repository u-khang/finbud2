// backend/seed.js
const mongoose = require("mongoose");
require("dotenv").config();
const Transaction = require("./models/Transaction");

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    const sampleTransactions = [
      { type: "income", amount: 1200, category: "Salary", date: new Date("2024-07-01") },
      { type: "expense", amount: 300, category: "Groceries", date: new Date("2024-07-03") },
      { type: "income", amount: 200, category: "Freelance", date: new Date("2024-07-05") },
      { type: "expense", amount: 150, category: "Utilities", date: new Date("2024-07-07") },
      { type: "expense", amount: 80, category: "Transport", date: new Date("2024-07-08") }
    ];

    return Transaction.insertMany(sampleTransactions);
  })
  .then(() => {
    console.log("Sample transactions inserted");
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("Error inserting sample data:", err);
    mongoose.disconnect();
  });
