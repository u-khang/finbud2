import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditTransactionForm from "../assets/components/EditTransactionForm";
import AddTransactionForm from "../assets/components/AddTransactionForm";

function Dashboard({ user, setUser }) {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/transactions/my", {
        credentials: "include"  // session cookies
      });
      const data = await res.json();
      if (res.ok) {
        setTransactions(data.transactions);
      } else {
        console.error("Failed to fetch transactions:", data.error);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:4000/api/users/logout", {
        method: "POST",
        credentials: "include"
      });
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleTransactionAdded = (newTransaction) => {
    setTransactions(prev => [newTransaction, ...prev]);
    setShowAddForm(false); // Hide the form after successful addition
  };

  const handleTransactionUpdated = (updatedTransaction) => {
    setTransactions(prev => 
      prev.map(t => t._id === updatedTransaction._id ? updatedTransaction : t)
    );
    setEditingTransaction(null); // Close edit form
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setShowAddForm(false); // Hide add form when editing
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/api/transactions/${transactionId}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (res.ok) {
        setTransactions(prev => prev.filter(t => t._id !== transactionId));
      } else {
        const data = await res.json();
        alert("Failed to delete transaction: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Error deleting transaction:", err);
      alert("Failed to delete transaction");
    }
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

  const getTotalIncome = () => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalExpenses = () => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div style={{ fontSize: "1.2rem", color: "#666" }}>Loading transactions...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "2rem",
        padding: "1rem",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px"
      }}>
        <div>
          <h1 style={{ margin: 0, color: "#333" }}>Welcome, {user.username}!</h1>
          <p style={{ margin: "0.5rem 0 0 0", color: "#666" }}>Manage your expenses and income</p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: showAddForm ? "#6c757d" : "#28a745",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "500"
            }}
          >
            {showAddForm ? "Cancel Add" : "Add Transaction"}
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "500"
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Quick Stats */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1rem",
        marginBottom: "2rem"
      }}>
        <div style={{
          padding: "1.5rem",
          backgroundColor: "#e3f2fd",
          borderRadius: "8px",
          textAlign: "center"
        }}>
          <h3 style={{ margin: "0 0 0.5rem 0", color: "#1976d2" }}>Total Transactions</h3>
          <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#1976d2" }}>
            {transactions.length}
          </p>
        </div>
        <div style={{
          padding: "1.5rem",
          backgroundColor: "#e8f5e8",
          borderRadius: "8px",
          textAlign: "center"
        }}>
          <h3 style={{ margin: "0 0 0.5rem 0", color: "#2e7d32" }}>Total Income</h3>
          <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#2e7d32" }}>
            {formatCurrency(getTotalIncome())}
          </p>
        </div>
        <div style={{
          padding: "1.5rem",
          backgroundColor: "#ffebee",
          borderRadius: "8px",
          color: "#c62828",
          textAlign: "center"
        }}>
          <h3 style={{ margin: "0 0 0.5rem 0", color: "#c62828" }}>Total Expenses</h3>
          <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#c62828" }}>
            {formatCurrency(getTotalExpenses())}
          </p>
        </div>
      </div>

      {/* Add Transaction Form */}
      {showAddForm && (
        <div style={{ marginBottom: "2rem" }}>
          <div style={{
            padding: "1rem",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            border: "1px solid #dee2e6"
          }}>
            <h3 style={{ margin: "0 0 1rem 0", color: "#333", textAlign: "center" }}>Add New Transaction</h3>
            <AddTransactionForm onTransactionAdded={handleTransactionAdded} />
          </div>
        </div>
      )}

      {/* Edit Form */}
      {editingTransaction && (
        <div style={{ marginBottom: "2rem" }}>
          <EditTransactionForm
            transaction={editingTransaction}
            onUpdate={handleTransactionUpdated}
            onCancel={handleCancelEdit}
          />
        </div>
      )}

      {/* Transactions List */}
      <div>
        <h2 style={{ marginBottom: "1rem", color: "#333" }}>Your Transactions</h2>
        
        {transactions.length === 0 ? (
          <div style={{
            padding: "3rem",
            textAlign: "center",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            color: "#666"
          }}>
            <p style={{ fontSize: "1.1rem", margin: "0 0 1rem 0" }}>No transactions yet</p>
            <button
              onClick={() => setShowAddForm(true)}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "1rem"
              }}
            >
              Add Your First Transaction
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {transactions.map((transaction) => (
              <div
                key={transaction._id}
                style={{
                  padding: "1rem",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  border: "1px solid #dee2e6",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}
              >
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "1rem"
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      marginBottom: "0.5rem"
                    }}>
                      <span style={{
                        padding: "0.25rem 0.75rem",
                        borderRadius: "20px",
                        fontSize: "0.8rem",
                        fontWeight: "500",
                        backgroundColor: transaction.type === 'income' ? '#d4edda' : '#f8d7da',
                        color: transaction.type === 'income' ? '#155724' : '#721c24'
                      }}>
                        {transaction.type === 'income' ? '💰 Income' : '💸 Expense'}
                      </span>
                      <span style={{
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        color: transaction.type === 'income' ? '#28a745' : '#dc3545'
                      }}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </span>
                    </div>
                    
                    <div style={{ marginBottom: "0.5rem" }}>
                      <strong>Category:</strong> {transaction.category || 'Uncategorized'}
                      {transaction.transactionType && (
                        <span style={{ marginLeft: "1rem", color: "#666" }}>
                          <strong>Type:</strong> {transaction.transactionType}
                        </span>
                      )}
                    </div>
                    
                    {transaction.note && (
                      <div style={{ marginBottom: "0.5rem", color: "#666", fontStyle: "italic" }}>
                        "{transaction.note}"
                      </div>
                    )}
                    
                    <div style={{ fontSize: "0.9rem", color: "#666" }}>
                      {formatDate(transaction.date)}
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => handleEditTransaction(transaction)}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "0.9rem"
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTransaction(transaction._id)}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "0.9rem"
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
