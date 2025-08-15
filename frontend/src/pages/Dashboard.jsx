import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard({ user, setUser }) {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:4000/api/users/logout", {
        method: "POST",
        credentials: "include"
      });
    } catch (err) {
      console.log("Logout error:", err);
    } finally {
      setUser(null);
      navigate("/login");
    }
  };

  const handleTransactionAdded = (newTransaction) => {
    setTransactions(prev => [newTransaction, ...prev]);
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("http://localhost:4000/api/transactions/my", {
          credentials: "include"
        });
        const data = await res.json();
        if (res.ok) {
          setTransactions(data.transactions);
        } else {
          setError(data.error || "Failed to load transactions");
        }
      } catch (err) {
        setError("Server error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.5rem",
    borderBottom: "1px solid #eee",
    marginBottom: "2rem",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px"
  };

  const buttonStyle = {
    padding: "0.75rem 1.5rem",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
    textDecoration: "none",
    display: "inline-block"
  };

  const transactionListStyle = {
    listStyle: "none",
    padding: 0,
    margin: 0
  };

  const transactionItemStyle = {
    padding: "1rem",
    border: "1px solid #eee",
    borderRadius: "6px",
    marginBottom: "1rem",
    backgroundColor: "white",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
  };

  const getTransactionColor = (type) => {
    return type === 'income' ? '#28a745' : '#dc3545';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      <header style={headerStyle}>
        <div>
          <h2 style={{ margin: 0, color: "#333" }}>Welcome, {user?.username}!</h2>
          <p style={{ margin: "0.5rem 0 0 0", color: "#666" }}>
            Manage your expenses and track your finances
          </p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button 
            onClick={() => navigate("/new")}
            style={{
              ...buttonStyle,
              backgroundColor: "#007bff",
              color: "white"
            }}
          >
            Add Transaction
          </button>
          <button 
            onClick={handleLogout}
            style={{
              ...buttonStyle,
              backgroundColor: "#dc3545",
              color: "white"
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
        <div>
          <h3 style={{ marginBottom: "1rem", color: "#333" }}>Recent Transactions</h3>
          
          {isLoading && (
            <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
              Loading transactions...
            </div>
          )}

          {error && (
            <div style={{ 
              padding: "1rem", 
              backgroundColor: "#f8d7da", 
              color: "#721c24", 
              borderRadius: "4px",
              marginBottom: "1rem"
            }}>
              {error}
            </div>
          )}

          {!isLoading && !error && transactions.length === 0 && (
            <div style={{ 
              textAlign: "center", 
              padding: "3rem", 
              color: "#666",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px"
            }}>
              <p>No transactions yet.</p>
              <p>Add your first transaction to get started!</p>
            </div>
          )}

          {!isLoading && !error && transactions.length > 0 && (
            <ul style={transactionListStyle}>
              {transactions.map((tx) => (
                <li key={tx._id} style={transactionItemStyle}>
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    marginBottom: "0.5rem"
                  }}>
                    <div>
                      <span style={{ 
                        fontWeight: "600", 
                        color: getTransactionColor(tx.type),
                        textTransform: "uppercase",
                        fontSize: "0.9rem"
                      }}>
                        {tx.type}
                      </span>
                      {tx.category && (
                        <span style={{ 
                          marginLeft: "1rem", 
                          color: "#666",
                          fontSize: "0.9rem"
                        }}>
                          • {tx.category}
                        </span>
                      )}
                    </div>
                    <span style={{ 
                      fontWeight: "600", 
                      fontSize: "1.1rem",
                      color: getTransactionColor(tx.type)
                    }}>
                      {formatCurrency(tx.amount)}
                    </span>
                  </div>
                  
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    fontSize: "0.9rem",
                    color: "#666"
                  }}>
                    <span>{formatDate(tx.date)}</span>
                    {tx.note && (
                      <span style={{ fontStyle: "italic" }}>
                        "{tx.note}"
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h3 style={{ marginBottom: "1rem", color: "#333" }}>Quick Stats</h3>
          <div style={{ 
            backgroundColor: "#f8f9fa", 
            padding: "1.5rem", 
            borderRadius: "8px",
            border: "1px solid #eee"
          }}>
            <div style={{ marginBottom: "1rem" }}>
              <p style={{ margin: "0.5rem 0", color: "#666" }}>Total Transactions</p>
              <h4 style={{ margin: 0, color: "#333" }}>{transactions.length}</h4>
            </div>
            
            {transactions.length > 0 && (
              <>
                <div style={{ marginBottom: "1rem" }}>
                  <p style={{ margin: "0.5rem 0", color: "#666" }}>Total Income</p>
                  <h4 style={{ margin: 0, color: "#28a745" }}>
                    {formatCurrency(
                      transactions
                        .filter(tx => tx.type === 'income')
                        .reduce((sum, tx) => sum + tx.amount, 0)
                    )}
                  </h4>
                </div>
                
                <div style={{ marginBottom: "1rem" }}>
                  <p style={{ margin: "0.5rem 0", color: "#666" }}>Total Expenses</p>
                  <h4 style={{ margin: 0, color: "#dc3545" }}>
                    {formatCurrency(
                      transactions
                        .filter(tx => tx.type === 'expense')
                        .reduce((sum, tx) => sum + tx.amount, 0)
                    )}
                  </h4>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
