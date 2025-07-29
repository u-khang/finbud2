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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/api/transactions/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // session
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        onTransactionAdded?.(data.transaction);
        setFormData({ ...formData, amount: "", category: "", transactionType: "", note: "" });
      } else {
        alert(data.error || "Failed to add transaction");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Type:
        <select name="type" value={formData.type} onChange={handleChange} required>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </label>

      <label>
        Amount:
        <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />
      </label>

      <label>
        Category:
        <input type="text" name="category" value={formData.category} onChange={handleChange} />
      </label>

      <label>
        Date:
        <input type="date" name="date" value={formData.date} onChange={handleChange} />
      </label>

      <label>
        Transaction Type:
        <input type="text" name="transactionType" value={formData.transactionType} onChange={handleChange} />
      </label>

      <label>
        Note:
        <input type="text" name="note" value={formData.note} onChange={handleChange} />
      </label>

      <button type="submit">Add Transaction</button>
    </form>
  );
}

export default AddTransactionForm;
