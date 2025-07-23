import { useState } from "react";

function LoginForm({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:4000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form)
      });

      const data = await res.json();
      console.log("data received: ", data);
      res.ok ? onLogin(data.user.username) : setError(data.error || "Login failed");
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
      <button type="submit">Log In</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default LoginForm;
