import { useNavigate } from "react-router-dom";
import AddTransactionForm from "../assets/components/AddTransactionForm";

function NewTransaction() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "2rem" }}>
      <header style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "2rem"
      }}>
        <h2>Create a New Transaction</h2>
        <button 
          onClick={() => navigate("/dashboard")}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Back to Dashboard
        </button>
      </header>
      <AddTransactionForm />
    </div>
  );
}

export default NewTransaction;
