const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/User");

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");

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

    return User.insertMany(sampleUsers);
  })
  .then(() => {
    console.log("Sample users inserted");
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("Error seeding users:", err);
    mongoose.disconnect();
  });
