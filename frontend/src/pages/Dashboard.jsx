import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditTransactionForm from "../assets/components/EditTransactionForm";
import AddTransactionForm from "../assets/components/AddTransactionForm";
import config from "../config";
import { authenticatedFetch, removeToken } from "../utils/auth";

function Dashboard({ user, setUser }) {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await authenticatedFetch(`${config.API_BASE_URL}/api/transactions/my`);
      const data = await res.json();
      if (res.ok) {
        setTransactions(data.transactions);
      } else {
        console.error("Failed to fetch transactions:", data.error);
        if (res.status === 401) {
          // Token expired or invalid, redirect to login
          removeToken();
          setUser(null);
          navigate("/login");
        }
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter transactions by selected month
  const getFilteredTransactions = () => {
    if (!selectedMonth) return transactions;
    
    const [year, month] = selectedMonth.split('-').map(Number);
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getFullYear() === year && 
             transactionDate.getMonth() === month - 1; // Month is 0-indexed
    });
  };

  const filteredTransactions = getFilteredTransactions();

  // Get available months from transactions
  const getAvailableMonths = () => {
    const months = new Set();
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.add(monthKey);
    });
    return Array.from(months).sort().reverse();
  };

  const handleLogout = async () => {
    try {
      // Remove token from localStorage
      removeToken();
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
      const res = await authenticatedFetch(`${config.API_BASE_URL}/api/transactions/${transactionId}`, {
        method: "DELETE"
      });

      if (res.ok) {
        setTransactions(prev => prev.filter(t => t._id !== transactionId));
      } else {
        const data = await res.json();
        alert("Failed to delete transaction: " + (data.error || "Unknown error"));
        if (res.status === 401) {
          removeToken();
          setUser(null);
          navigate("/login");
        }
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

  const formatMonthLabel = (monthString) => {
    const [year, month] = monthString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  const getMonthlyIncome = () => {
    return filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getMonthlyExpenses = () => {
    return filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
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

  // Convert transactions to CSV format
  const convertToCSV = (transactions) => {
    if (transactions.length === 0) return '';
    
    // Define CSV headers
    const headers = [
      'ID',
      'Type',
      'Amount',
      'Category',
      'Date',
      'Note',
      'Transaction Type',
      'Created At'
    ];
    
    // Convert transactions to CSV rows
    const csvRows = transactions.map(transaction => [
      transaction._id,
      transaction.type,
      transaction.amount,
      transaction.category || 'Uncategorized',
      new Date(transaction.date).toISOString().split('T')[0], // Format as YYYY-MM-DD
      transaction.note || '',
      transaction.transactionType || '',
      new Date(transaction.date).toISOString()
    ]);
    
    // Combine headers and rows
    const csvContent = [headers, ...csvRows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    return csvContent;
  };

  // Download CSV file
  const downloadCSV = () => {
    const csvContent = convertToCSV(transactions);
    
    if (!csvContent) {
      alert('No transactions to export');
      return;
    }
    
    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    // Create filename with current date
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const filename = `transactions_${dateStr}.csv`;
    
    // Set up download
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Download filtered CSV (based on current month filter)
  const downloadFilteredCSV = () => {
    const csvContent = convertToCSV(filteredTransactions);
    
    if (!csvContent) {
      alert('No transactions to export for the selected period');
      return;
    }
    
    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    // Create filename with filter info
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    let filename = `transactions_${dateStr}`;
    
    if (selectedMonth) {
      const monthLabel = formatMonthLabel(selectedMonth).replace(' ', '_');
      filename = `transactions_${monthLabel}_${dateStr}.csv`;
    } else {
      filename = `transactions_all_time_${dateStr}.csv`;
    }
    
    // Set up download
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
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
            onClick={() => navigate("/analytics")}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#17a2b8",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "500"
            }}
          >
            View Analytics
          </button>
          <button
            onClick={downloadCSV}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "500"
            }}
            title="Download all transactions as CSV"
          >
            📊 Export All
          </button>
          <button
            onClick={downloadFilteredCSV}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#ffc107",
              color: "#212529",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "500"
            }}
            title="Download filtered transactions as CSV"
          >
            📋 Export Filtered
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

      {/* Month Filter */}
      <div style={{
        marginBottom: "2rem",
        padding: "1rem",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        border: "1px solid #dee2e6"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap"
        }}>
          <label style={{
            fontWeight: "500",
            color: "#333",
            minWidth: "120px"
          }}>
            Filter by Month:
          </label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ced4da",
              fontSize: "1rem",
              minWidth: "200px"
            }}
          >
            <option value="">All Time</option>
            {getAvailableMonths().map(month => (
              <option key={month} value={month}>
                {formatMonthLabel(month)}
              </option>
            ))}
          </select>
          {selectedMonth && (
            <span style={{ color: "#666", fontSize: "0.9rem" }}>
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </span>
          )}
        </div>
      </div>

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
          <h3 style={{ margin: "0 0 0.5rem 0", color: "#1976d2" }}>
            {selectedMonth ? "Monthly Transactions" : "Total Transactions"}
          </h3>
          <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#1976d2" }}>
            {filteredTransactions.length}
          </p>
        </div>
        <div style={{
          padding: "1.5rem",
          backgroundColor: "#e8f5e8",
          borderRadius: "8px",
          textAlign: "center"
        }}>
          <h3 style={{ margin: "0 0 0.5rem 0", color: "#2e7d32" }}>
            {selectedMonth ? "Monthly Income" : "Total Income"}
          </h3>
          <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#2e7d32" }}>
            {formatCurrency(selectedMonth ? getMonthlyIncome() : getTotalIncome())}
          </p>
        </div>
        <div style={{
          padding: "1.5rem",
          backgroundColor: "#ffebee",
          borderRadius: "8px",
          color: "#c62828",
          textAlign: "center"
        }}>
          <h3 style={{ margin: "0 0 0.5rem 0", color: "#c62828" }}>
            {selectedMonth ? "Monthly Expenses" : "Total Expenses"}
          </h3>
          <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#c62828" }}>
            {formatCurrency(selectedMonth ? getMonthlyExpenses() : getTotalExpenses())}
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
        <h2 style={{ marginBottom: "1rem", color: "#333" }}>
          {selectedMonth ? `Transactions for ${formatMonthLabel(selectedMonth)}` : "Your Transactions"}
        </h2>
        
        {filteredTransactions.length === 0 ? (
          <div style={{
            padding: "3rem",
            textAlign: "center",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            color: "#666"
          }}>
            <p style={{ fontSize: "1.1rem", margin: "0 0 1rem 0" }}>
              {selectedMonth ? `No transactions for ${formatMonthLabel(selectedMonth)}` : "No transactions yet"}
            </p>
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
            {filteredTransactions.map((transaction) => (
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
