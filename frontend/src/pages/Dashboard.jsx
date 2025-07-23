function Dashboard({ user }) {
    return (
      <div>
        <h2>Welcome to your Dashboard, {user?.username}</h2>
        <p>Your transactions are here</p>
      </div>
    );
  }
  
  export default Dashboard;
  