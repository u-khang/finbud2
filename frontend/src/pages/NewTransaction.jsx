import AddTransactionForm from "../assets/components/AddTransactionForm";

function NewTransaction() {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>Create a New Transaction</h2>
      <AddTransactionForm />
    </div>
  );
}

export default NewTransaction;
