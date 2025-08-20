#!/bin/bash

echo "Starting Expense Tracker Application..."
echo ""

# Load environment variables
if [ -f "backend/.env" ]; then
    echo "Loading backend environment variables..."
    export $(cat backend/.env | grep -v '^#' | xargs)
else
    echo "No backend .env file found, using defaults..."
fi

if [ -f "frontend/.env" ]; then
    echo "Loading frontend environment variables..."
    export $(cat frontend/.env | grep -v '^#' | xargs)
else
    echo "No frontend .env file found, using defaults..."
fi

# Check if MongoDB is running (macOS)
# if ! pgrep -x "mongod" > /dev/null; then
#     echo "  MongoDB is not running. Please start MongoDB first:"
#     echo "   brew services start mongodb-community"
#     echo "   or"
#     echo "   mongod"
#     echo ""
# fi

# Start backend server
echo "Starting backend server..."
cd backend
npm start &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo "Starting frontend server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "Both servers are starting..."
echo ""
echo "Backend: http://localhost:${PORT:-4000}"
echo "Frontend: http://localhost:${VITE_PORT:-5173}"
echo ""
echo "To customize ports and URLs, create .env files:"
echo "  cp backend/env.example backend/.env"
echo "  cp frontend/env.example frontend/.env"
echo ""

# Wait for user to stop
wait
