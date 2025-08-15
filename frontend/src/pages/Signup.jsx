import SignupForm from "../assets/components/SignupForm";
import { useNavigate, Link } from "react-router-dom";

function Signup({ setUser }) {
  const navigate = useNavigate();

  const handleSignup = (user) => {
    setUser(user);
    navigate("/dashboard");
  };

  return (
    <div style={{ maxWidth: "400px", margin: "3rem auto", textAlign: "center" }}>
      <h2>Create an Account</h2>
      <SignupForm onSignup={handleSignup} />
      <div style={{ marginTop: "2rem", padding: "1rem", borderTop: "1px solid #eee" }}>
        <p style={{ margin: "0.5rem 0", color: "#666" }}>
          Already have an account?{" "}
          <Link 
            to="/login" 
            style={{ 
              color: "#007bff", 
              textDecoration: "none",
              fontWeight: "500"
            }}
          >
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
