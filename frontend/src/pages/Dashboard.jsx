import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard({ user, setUser }) {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call logout endpoint if you have one
      await fetch("http://localhost:4000/api/users/logout", {
        method: "POST",
        credentials: "include"
      });
    } catch (err) {
      console.log("Logout error:", err);
    } finally {
      // Clear user state and redirect to login
      setUser(null);
      navigate("/login");
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/transactions/test", {
          credentials: "include"  // session cookies
        });
        const data = await res.json();
        if (res.ok) {
          setTransactions(data.transactions);
        } else {
          setError(data.error || "Failed to load transactions");
        }
      } catch (err) {
        setError("Server error");
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div>
      <header style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        padding: "1rem",
        borderBottom: "1px solid #eee",
        marginBottom: "2rem"
      }}>
        <h2>Welcome, {user?.username}</h2>
        <div>
          <button 
            onClick={() => navigate("/new")}
            style={{
              marginRight: "1rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Add Transaction
          </button>
          <button 
            onClick={handleLogout}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <h3>Your Transactions</h3>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {transactions.map((tx) => (
          <li key={tx._id}>
            <strong>{tx.type.toUpperCase()}</strong> - ${tx.amount} on {new Date(tx.date).toLocaleDateString()}
            {tx.category}
            {tx.note && <span> • Note: {tx.note}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
