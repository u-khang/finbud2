import { useState, useEffect } from "react";
import config from "../../config";
import { authenticatedFetch } from "../../utils/auth";

function EditTransactionForm({ transaction, onUpdate, onCancel }) {
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "",
    date: "",
    transactionType: "",
    note: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Categories sorted from most common to least common
  const categories = [
    "Groceries",
    "Transportation", 
    "Utilities",
    "Dining",
    "Shopping",
    "Entertainment",
    "Home",
    "Health, fitness & personal care",
    "Credit Card Payments",
    "Paycheque, Pensions & Annuity",
    "Savings & Investment",
    "Kids and family",
    "Travel",
    "Education",
    "Insurance",
    "Taxes and government",
    "Loan & Mortgage",
    "Other"
  ];

  // Initialize form with transaction data when component mounts or transaction changes
  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type || "expense",
        amount: transaction.amount || "",
        category: transaction.category || "",
        date: transaction.date ? new Date(transaction.date).toISOString().slice(0, 10) : "",
        transactionType: transaction.transactionType || "",
        note: transaction.note || ""
      });
    }
  }, [transaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await authenticatedFetch(`${config.API_BASE_URL}/api/transactions/${transaction._id}`, {
        method: "PUT",
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        onUpdate(data.transaction);
      } else {
        setError(data.error || "Failed to update transaction");
      }
    } catch (err) {
      setError("Server error");
    } finally {
      setIsLoading(false);
    }
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    maxWidth: "500px",
    margin: "0 auto"
  };

  const inputStyle = {
    padding: "0.75rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "1rem"
  };

  const selectStyle = {
    ...inputStyle,
    backgroundColor: "white"
  };

  const buttonStyle = {
    padding: "0.75rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: "500"
  };

  const cancelButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#6c757d"
  };

  const buttonContainerStyle = {
    display: "flex",
    gap: "1rem",
    justifyContent: "center"
  };

  if (!transaction) {
    return <div>No transaction to edit</div>;
  }

  return (
    <div style={{ padding: "1rem", backgroundColor: "#f8f9fa", borderRadius: "8px", border: "1px solid #dee2e6" }}>
      <h3 style={{ margin: "0 0 1rem 0", color: "#333", textAlign: "center" }}>Edit Transaction</h3>
      
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <label>
            Type:
            <select 
              name="type" 
              value={formData.type} 
              onChange={handleChange} 
              required 
              style={selectStyle}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>

          <label>
            Amount:
            <input 
              type="number" 
              name="amount" 
              value={formData.amount} 
              onChange={handleChange} 
              required 
              min="0.01"
              step="0.01"
              placeholder="0.00"
              style={inputStyle}
            />
          </label>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <label>
            Category:
            <select 
              name="category" 
              value={formData.category} 
              onChange={handleChange} 
              required
              style={selectStyle}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label>
            Date:
            <input 
              type="date" 
              name="date" 
              value={formData.date} 
              onChange={handleChange} 
              style={inputStyle}
            />
          </label>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <label>
            Transaction Type (Optional):
            <select 
              name="transactionType" 
              value={formData.transactionType} 
              onChange={handleChange} 
              style={selectStyle}
            >
              <option value="">Select payment method</option>
              <option value="Debit">Debit</option>
              <option value="Credit">Credit</option>
              <option value="Cash">Cash</option>
              <option value="Apple Pay">Apple Pay</option>
              <option value="Google Pay">Google Pay</option>
              <option value="Paypal">Paypal</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label>
            Note (Optional):
            <input 
              type="text" 
              name="note" 
              value={formData.note} 
              onChange={handleChange} 
              placeholder="Optional note"
              style={inputStyle}
            />
          </label>
        </div>

        <div style={buttonContainerStyle}>
          <button type="submit" disabled={isLoading} style={buttonStyle}>
            {isLoading ? "Updating..." : "Update Transaction"}
          </button>
          <button type="button" onClick={onCancel} style={cancelButtonStyle}>
            Cancel
          </button>
        </div>

        {error && (
          <div style={{
            padding: "1rem",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            borderRadius: "4px",
            border: "1px solid #f5c6cb",
            textAlign: "center"
          }}>
            <p style={{ margin: 0, fontSize: "0.9rem" }}>
              <strong>⚠️ {error}</strong>
            </p>
          </div>
        )}
      </form>
    </div>
  );
}

export default EditTransactionForm;
