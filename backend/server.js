const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const config = require("./config");




const app = express();


//session
app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: config.MONGO_URI,
      collectionName: "sessions"
    }),
    cookie: {
      maxAge: config.COOKIE_MAX_AGE,
      httpOnly: true,
      secure: config.COOKIE_SECURE
    }
  })
);

app.use(cors({
  origin: config.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());


const transactionRoutes = require("./routes/transactions");
app.use("/api/transactions", transactionRoutes);  

const userRoutes = require("./routes/users");
app.use("/api/users", userRoutes);






// Connect to MongoDB
mongoose.connect(config.MONGO_URI, {}).then(() => console.log("Connected to MongoDB"));

// Example Route
app.get("/", (req, res) => res.send("Finance Tracker API running"));

// Start server
app.listen(config.PORT, () => {
  console.log(`Server listening on port ${config.PORT}`);
  console.log(`Frontend URL: ${config.FRONTEND_URL}`);
  console.log(`Environment: ${config.NODE_ENV}`);
});
