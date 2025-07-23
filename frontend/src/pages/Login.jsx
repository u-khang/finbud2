import LoginForm from "../assets/components/LoginForm";
import { useNavigate } from "react-router-dom";

function Login({ setUser }) {
  const navigate = useNavigate();

  const handleLogin = (user) => {
    setUser(user);
    navigate("/dashboard");
  };

  return (
    <div>
      <h2>Log In</h2>
      <LoginForm onLogin={handleLogin} />
    </div>
  );
}

export default Login;
