import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import SignupForm from './assets/components/signUpForm'

function App() {
  const [user, setUser] = useState(null);

  const handleSignup = (newUser) => {
    console.log("Signed up successfully:", newUser);
    setUser(newUser);

    // redirect (React Router):
    // navigate("/dashboard");

    // welcome UI:
    // alert(`Welcome, ${newUser.username}!`);
  };
  return (
    <>
      {!user ? (
        <SignupForm onSignup={handleSignup} />
      ) : (
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <h2>Welcome, {user.username} 🎉</h2>
          <p>You're signed in and ready to roll!</p>
        </div>
      )}
    </>
  );
}

export default App
