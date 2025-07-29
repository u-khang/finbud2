import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NewTransaction from "./pages/NewTransaction";



function App() {
  const [user, setUser] = useState(null);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signup" />} />
      <Route path="/signup" element={<Signup setUser={setUser} />} />
      <Route path="/login" element={<Login setUser={setUser} />} />
      <Route
        path="/dashboard"
        element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
      />
      <Route path="/new" element={<NewTransaction />} />
    </Routes>
  );
}

export default App;
