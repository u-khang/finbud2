import { useState } from "react";

function AddTransactionForm({ onTransactionAdded }) {
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "",
    date: new Date().toISOString().slice(0, 10),
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // session
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        onTransactionAdded?.(data.transaction);
        setFormData({ 
          ...formData, 
          amount: "", 
          category: "", 
          transactionType: "", 
          note: "" 
        });
      } else {
        setError(data.error || "Failed to add transaction");
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
    backgroundColor: isLoading ? "#ccc" : "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
    cursor: isLoading ? "not-allowed" : "pointer",
    fontWeight: "500"
  };

  return (
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
          Transaction Type:
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
          Note:
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

      <button type="submit" disabled={isLoading} style={buttonStyle}>
        {isLoading ? "Adding Transaction..." : "Add Transaction"}
      </button>

      {error && <p style={{ color: "red", textAlign: "center", margin: 0 }}>{error}</p>}
    </form>
  );
}

export default AddTransactionForm;
