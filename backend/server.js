const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const session = require("express-session");
const MongoStore = require("connect-mongo");




const app = express();


//session
app.use(
  session({
    secret: "yourSecretKey", // change to a secure env variable later
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions"
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true,
      secure: false // set to true if using HTTPS
    }
  })
);

app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true                // allow cookies/sessions
}));
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
