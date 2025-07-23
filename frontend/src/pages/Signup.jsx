import SignupForm from "../assets/components/SignupForm";
import { useNavigate } from "react-router-dom";

function Signup({ setUser }) {
  const navigate = useNavigate();

  const handleSignup = (user) => {
    setUser(user);
    navigate("/dashboard");
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <SignupForm onSignup={handleSignup} />
    </div>
  );
}

export default Signup;
