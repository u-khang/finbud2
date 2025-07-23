import { useState } from "react";

function SignupForm({ onSignup }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:4000/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // keep session cookies
        body: JSON.stringify(form)
      });

      const data = await res.json();
      console.log("Raw response:", res);
      console.log("Parsed data:", data);
      if (res.ok) {
        onSignup(data.username);  // Notify parent component
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (err) {
      console.error("Signup request failed:", err);
      setError("Server error");
    }    
  };

  return (
    <div style={{ maxWidth: "400px", margin: "3rem auto", textAlign: "center" }}>
      <h2>Create an Account</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" onChange={handleChange} required /><br />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required /><br />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required /><br />
        <button type="submit" style={{ marginTop: "1rem" }}>Sign Up</button>
      </form>
      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
    </div>
  );
}

export default SignupForm;
