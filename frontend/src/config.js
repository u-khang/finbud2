// Frontend Configuration
const config = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000',
  
  // App Configuration
  APP_NAME: 'Expense Tracker',
  APP_VERSION: '1.0.0',
  
  // Feature Flags
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS !== 'false',
  ENABLE_CSV_EXPORT: import.meta.env.VITE_ENABLE_CSV_EXPORT !== 'false',
  
  // Development Configuration
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
};

export default config;
