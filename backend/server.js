const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("./config");

const app = express();

// CORS configuration
app.use(cors({
  origin: config.ALLOWED_ORIGINS,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));
app.use(express.json());

// Routes
const transactionRoutes = require("./routes/transactions");
app.use("/api/transactions", transactionRoutes);

const userRoutes = require("./routes/users");
app.use("/api/users", userRoutes);

// Connect to MongoDB
mongoose.connect(config.MONGO_URI, {}).then(() => console.log("Connected to MongoDB"));

// Health check endpoint
app.get("/", (req, res) => res.send("Finance Tracker API running"));

// Health check endpoint for deployment monitoring
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
    cors_origins: config.ALLOWED_ORIGINS,
    authentication: "JWT"
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  if (err.message === 'Not allowed by CORS') {
    res.status(403).json({ 
      error: 'CORS Error', 
      message: 'Origin not allowed',
      origin: req.headers.origin,
      allowedOrigins: config.ALLOWED_ORIGINS
    });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server
app.listen(config.PORT, () => {
  console.log(`🚀 Server listening on port ${config.PORT}`);
  console.log(`🌐 Frontend URL: ${config.FRONTEND_URL}`);
  console.log(`🔧 Environment: ${config.NODE_ENV}`);
  console.log(`✅ Allowed CORS origins: ${config.ALLOWED_ORIGINS.join(', ')}`);
  console.log(`🔐 Authentication: JWT`);
});