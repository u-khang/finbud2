# CORS Configuration for Deployment

## Problem
After deployment, the frontend and backend can't communicate due to CORS (Cross-Origin Resource Sharing) restrictions.

## Solution
The CORS configuration has been updated to handle both development and production environments.

## Environment Variables for Production

### Backend (.env)
```bash
# Server Configuration
PORT=4000
NODE_ENV=production

# Database Configuration
MONGO_URI=your_production_mongodb_uri

# Session Configuration
SESSION_SECRET=your_strong_secret_key_here

# CORS Configuration - CRITICAL FOR DEPLOYMENT
# Set this to your actual deployed frontend URLs
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com,https://your-app.vercel.app

# API Configuration
API_BASE_URL=https://your-backend-domain.com
```

### Frontend (.env)
```bash
# API Configuration - CRITICAL FOR DEPLOYMENT
VITE_API_BASE_URL=https://your-backend-domain.com

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_CSV_EXPORT=true
```

## Common Deployment Platforms

### Vercel (Frontend)
1. Set environment variables in Vercel dashboard
2. Make sure `VITE_API_BASE_URL` points to your backend URL

### Railway/Heroku/DigitalOcean (Backend)
1. Set environment variables in your platform dashboard
2. Make sure `ALLOWED_ORIGINS` includes your frontend URL
3. Make sure `NODE_ENV=production`

## Testing CORS Configuration

### 1. Check Health Endpoint
Visit: `https://your-backend-domain.com/health`

Should return:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production",
  "cors_origins": ["https://yourdomain.com", "https://www.yourdomain.com"]
}
```

### 2. Test from Browser Console
```javascript
fetch('https://your-backend-domain.com/api/transactions/my', {
  credentials: 'include'
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('CORS Error:', error));
```

## Troubleshooting

### CORS Error: "Origin not allowed"
1. Check that your frontend URL is in `ALLOWED_ORIGINS`
2. Make sure there are no trailing slashes in URLs
3. Check that you're using HTTPS in production

### Session/Cookie Issues
1. Make sure `COOKIE_SECURE=true` in production
2. Check that your domain allows cookies
3. Verify session secret is set

### Common Mistakes
- ❌ Using `http://` in production (use `https://`)
- ❌ Forgetting to set `NODE_ENV=production`
- ❌ Not including all frontend URLs in `ALLOWED_ORIGINS`
- ❌ Using localhost URLs in production environment variables

## Quick Fix Commands

### For Vercel (Frontend)
```bash
vercel env add VITE_API_BASE_URL
# Enter: https://your-backend-domain.com
```

### For Railway (Backend)
```bash
railway variables set ALLOWED_ORIGINS="https://yourdomain.com,https://www.yourdomain.com"
railway variables set NODE_ENV="production"
```

## Debug Mode
To see CORS debugging information, check your backend logs. The server will log:
- Allowed CORS origins on startup
- Blocked origins (if any)
- CORS errors with details
