import LoginForm from "../assets/components/LoginForm";
import { useNavigate, Link } from "react-router-dom";

function Login({ setUser }) {
  const navigate = useNavigate();

  const handleLogin = (user) => {
    setUser(user);
    navigate("/dashboard");
  };

  return (
    <div style={{ maxWidth: "400px", margin: "3rem auto", textAlign: "center" }}>
      <h2>Log In</h2>
      <LoginForm onLogin={handleLogin} />
      <div style={{ marginTop: "2rem", padding: "1rem", borderTop: "1px solid #eee" }}>
        <p style={{ margin: "0.5rem 0", color: "#666" }}>
          Don't have an account?{" "}
          <Link 
            to="/signup" 
            style={{ 
              color: "#007bff", 
              textDecoration: "none",
              fontWeight: "500"
            }}
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
