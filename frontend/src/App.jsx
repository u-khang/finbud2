import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import { getToken, isAuthenticated } from "./utils/auth";
import config from "./config";

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        try {
          const token = getToken();
          const res = await fetch(`${config.API_BASE_URL}/api/users/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
          } else {
            // Token is invalid, remove it
            localStorage.removeItem('authToken');
          }
        } catch (err) {
          console.error('Auth check failed:', err);
          localStorage.removeItem('authToken');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signup" />} />
      <Route path="/signup" element={<Signup setUser={setUser} />} />
      <Route path="/login" element={<Login setUser={setUser} />} />
      <Route
        path="/dashboard"
        element={user ? <Dashboard user={user} setUser={setUser} /> : <Navigate to="/login" />}
      />
      <Route
        path="/analytics"
        element={user ? <Analytics user={user} setUser={setUser} /> : <Navigate to="/login" />}
      />
      <Route
        path="/logout"
        element={
          <Navigate
            to="/login"
            replace={true}
            state={{ logout: true }}
          />
        }
      />
    </Routes>
  );
}

export default App;
