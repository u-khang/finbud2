require("dotenv").config();

const config = {
  // Server Configuration
  PORT: process.env.PORT || 4000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database Configuration
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/expense-tracker',
  
  // Session Configuration
  SESSION_SECRET: process.env.SESSION_SECRET || 'yourSecretKey',
  
  // CORS Configuration
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:5173', 'http://localhost:3000'],
  
  // API Configuration
  API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:4000',
  
  // Cookie Configuration
  COOKIE_SECURE: process.env.NODE_ENV === 'production',
  COOKIE_MAX_AGE: 1000 * 60 * 60 * 24, // 1 day
};

module.exports = config;
