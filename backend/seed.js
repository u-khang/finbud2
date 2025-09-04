// backend/seed.js - Comprehensive seeding script
const mongoose = require("mongoose");
require("dotenv").config();
const Transaction = require("./models/Transaction");
const User = require("./models/User");

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Seed Users
    const sampleUsers = [
      {
        username: "alice",
        email: "alice@example.com",
        password: "password123"
      },
      {
        username: "bob",
        email: "bob@example.com",
        password: "securepass456"
      },
      {
        username: "charlie",
        email: "charlie@example.com",
        password: "charlie789"
      }
    ];

    await User.deleteMany({}); // Clear existing users
    const createdUsers = await User.insertMany(sampleUsers);
    console.log("✅ Sample users inserted");

    // Seed Transactions (assign to first user)
    const sampleTransactions = [
      { type: "income", amount: 1200, category: "Salary", date: new Date("2024-07-01"), user: createdUsers[0]._id },
      { type: "expense", amount: 300, category: "Groceries", date: new Date("2024-07-03"), user: createdUsers[0]._id },
      { type: "income", amount: 200, category: "Freelance", date: new Date("2024-07-05"), user: createdUsers[0]._id },
      { type: "expense", amount: 150, category: "Utilities", date: new Date("2024-07-07"), user: createdUsers[0]._id },
      { type: "expense", amount: 80, category: "Transport", date: new Date("2024-07-08"), user: createdUsers[0]._id }
    ];

    await Transaction.deleteMany({}); // Clear existing transactions
    await Transaction.insertMany(sampleTransactions);
    console.log("✅ Sample transactions inserted");

    console.log("🎉 Database seeding completed successfully!");
    
  } catch (err) {
    console.error("❌ Error seeding database:", err);
  } finally {
    await mongoose.disconnect();
    console.log("👋 Disconnected from MongoDB");
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;