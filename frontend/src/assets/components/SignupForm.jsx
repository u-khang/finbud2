import { useState } from "react";
import config from "../../config";
import { setToken } from "../../utils/auth";

function SignupForm({ onSignup }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(`${config.API_BASE_URL}/api/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (res.ok) {
        // Store the JWT token if provided
        if (data.token) {
          setToken(data.token);
        }
        onSignup(data.user);  // Pass complete user object
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (err) {
      console.error("Signup request failed:", err);
      setError("Server error");
    } finally {
      setIsLoading(false);
    }    
  };

  return (
    <div style={{ maxWidth: "400px", margin: "3rem auto", textAlign: "center" }}>
      <h2>Create an Account</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input 
          name="username" 
          placeholder="Username" 
          value={form.username}
          onChange={handleChange} 
          required 
          style={{
            padding: "0.75rem",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "1rem"
          }}
        />
        <input 
          name="email" 
          type="email" 
          placeholder="Email" 
          value={form.email}
          onChange={handleChange} 
          required 
          style={{
            padding: "0.75rem",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "1rem"
          }}
        />
        <input 
          name="password" 
          type="password" 
          placeholder="Password" 
          value={form.password}
          onChange={handleChange} 
          required 
          style={{
            padding: "0.75rem",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "1rem"
          }}
        />
        <button 
          type="submit" 
          disabled={isLoading}
          style={{
            padding: "0.75rem",
            backgroundColor: isLoading ? "#ccc" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "1rem",
            cursor: isLoading ? "not-allowed" : "pointer"
          }}
        >
          {isLoading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
    </div>
  );
}

export default SignupForm;
