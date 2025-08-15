import { useNavigate } from "react-router-dom";
import AddTransactionForm from "../assets/components/AddTransactionForm";

function NewTransaction({ user, onTransactionAdded }) {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <header style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "2rem",
        padding: "1rem",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px"
      }}>
        <h2 style={{ margin: 0, color: "#333" }}>Create a New Transaction</h2>
        <button 
          onClick={() => navigate("/dashboard")}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "500"
          }}
        >
          Back to Dashboard
        </button>
      </header>
      
      <AddTransactionForm onTransactionAdded={onTransactionAdded} />
    </div>
  );
}

export default NewTransaction;
