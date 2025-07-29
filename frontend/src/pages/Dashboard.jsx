import { useEffect, useState } from "react";

function Dashboard({ user }) {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

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
      <h2>Welcome, {user?.username} </h2>
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
