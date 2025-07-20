const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();


const app = express();
app.use(cors());
app.use(express.json());


const transactionRoutes = require("./routes/transactions");
app.use("/api/transactions", transactionRoutes);

const userRoutes = require("./routes/users");
app.use("/api/users", userRoutes);


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {}).then(() => console.log("Connected to MongoDB"));

// Example Route
app.get("/", (req, res) => res.send("Finance Tracker API running"));

// Start server
app.listen(process.env.PORT || 4000, () => {
  console.log(`Server listening on port ${process.env.PORT || 4000}`);
});
