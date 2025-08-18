import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, Title, CategoryScale, LinearScale, BarElement);

function Analytics({ user, setUser }) {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/transactions/my", {
        credentials: "include"
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

  // Filter transactions by selected month
  const getFilteredTransactions = () => {
    if (!selectedMonth) return transactions;
    
    const [year, month] = selectedMonth.split('-').map(Number);
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getFullYear() === year && 
             transactionDate.getMonth() === month - 1;
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

  const formatMonthLabel = (monthString) => {
    const [year, month] = monthString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Generate chart data for income by category
  const getIncomeChartData = () => {
    const incomeTransactions = filteredTransactions.filter(t => t.type === 'income');
    const categoryData = {};
    
    incomeTransactions.forEach(transaction => {
      const category = transaction.category || 'Uncategorized';
      categoryData[category] = (categoryData[category] || 0) + transaction.amount;
    });

    const categories = Object.keys(categoryData);
    const amounts = Object.values(categoryData);

    // Generate colors for each category
    const colors = [
      '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107',
      '#FF9800', '#FF5722', '#795548', '#9C27B0', '#673AB7',
      '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688'
    ];

    return {
      labels: categories,
      datasets: [{
        data: amounts,
        backgroundColor: categories.map((_, index) => colors[index % colors.length]),
        borderWidth: 2,
        borderColor: '#fff',
        hoverBorderWidth: 3,
        hoverBorderColor: '#fff'
      }]
    };
  };

  // Generate chart data for expenses by category
  const getExpenseChartData = () => {
    const expenseTransactions = filteredTransactions.filter(t => t.type === 'expense');
    const categoryData = {};
    
    expenseTransactions.forEach(transaction => {
      const category = transaction.category || 'Uncategorized';
      categoryData[category] = (categoryData[category] || 0) + transaction.amount;
    });

    const categories = Object.keys(categoryData);
    const amounts = Object.values(categoryData);

    // Generate colors for each category
    const colors = [
      '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
      '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50',
      '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800'
    ];

    return {
      labels: categories,
      datasets: [{
        data: amounts,
        backgroundColor: categories.map((_, index) => colors[index % colors.length]),
        borderWidth: 2,
        borderColor: '#fff',
        hoverBorderWidth: 3,
        hoverBorderColor: '#fff'
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    }
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${formatCurrency(value)}`;
          }
        }
      },
      title: {
        display: true,
        text: `Monthly Transactions - ${selectedYear}`,
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          display: false
        }
      },
      y: {
        title: {
          display: true,
          text: 'Amount ($)',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return formatCurrency(value);
          }
        }
      }
    }
  };

  const getTotalIncome = () => {
    return filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalExpenses = () => {
    return filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  // Generate grouped bar chart data for monthly transactions
  const getMonthlyBarChartData = () => {
    const currentYear = selectedYear;
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const monthlyData = {
      income: new Array(12).fill(0),
      expense: new Array(12).fill(0)
    };

    // Filter transactions for current year
    const yearTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getFullYear() === currentYear;
    });

    // Aggregate data by month
    yearTransactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      const monthIndex = transactionDate.getMonth();
      
      if (transaction.type === 'income') {
        monthlyData.income[monthIndex] += transaction.amount;
      } else {
        monthlyData.expense[monthIndex] += transaction.amount;
      }
    });

    return {
      labels: months,
      datasets: [
        {
          label: 'Income',
          data: monthlyData.income,
          backgroundColor: 'rgba(76, 175, 80, 0.8)',
          borderColor: 'rgba(76, 175, 80, 1)',
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
        },
        {
          label: 'Expenses',
          data: monthlyData.expense,
          backgroundColor: 'rgba(244, 67, 54, 0.8)',
          borderColor: 'rgba(244, 67, 54, 1)',
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
        }
      ]
    };
  };

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div style={{ fontSize: "1.2rem", color: "#666" }}>Loading analytics...</div>
      </div>
    );
  }

  const incomeChartData = getIncomeChartData();
  const expenseChartData = getExpenseChartData();
  const monthlyBarChartData = getMonthlyBarChartData();

  return (
    <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
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
          <h1 style={{ margin: 0, color: "#333" }}>Analytics Dashboard</h1>
          <p style={{ margin: "0.5rem 0 0 0", color: "#666" }}>Visualize your spending patterns</p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#007bff",
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

      {/* Filters */}
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
              Showing data for {formatMonthLabel(selectedMonth)}
            </span>
          )}
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
          marginTop: "1rem"
        }}>
          <label style={{
            fontWeight: "500",
            color: "#333",
            minWidth: "120px"
          }}>
            Bar Chart Year:
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            style={{
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ced4da",
              fontSize: "1rem",
              minWidth: "200px"
            }}
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1rem",
        marginBottom: "2rem"
      }}>
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
            {formatCurrency(getTotalIncome())}
          </p>
        </div>
        <div style={{
          padding: "1.5rem",
          backgroundColor: "#ffebee",
          borderRadius: "8px",
          textAlign: "center"
        }}>
          <h3 style={{ margin: "0 0 0.5rem 0", color: "#c62828" }}>
            {selectedMonth ? "Monthly Expenses" : "Total Expenses"}
          </h3>
          <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#c62828" }}>
            {formatCurrency(getTotalExpenses())}
          </p>
        </div>
        <div style={{
          padding: "1.5rem",
          backgroundColor: "#e3f2fd",
          borderRadius: "8px",
          textAlign: "center"
        }}>
          <h3 style={{ margin: "0 0 0.5rem 0", color: "#1976d2" }}>
            {selectedMonth ? "Monthly Net" : "Total Net"}
          </h3>
          <p style={{ 
            margin: 0, 
            fontSize: "1.5rem", 
            fontWeight: "bold", 
            color: getTotalIncome() - getTotalExpenses() >= 0 ? "#2e7d32" : "#c62828"
          }}>
            {formatCurrency(getTotalIncome() - getTotalExpenses())}
          </p>
        </div>
      </div>

      {/* Monthly Bar Chart */}
      <div style={{
        marginBottom: "2rem",
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "1.5rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        border: "1px solid #dee2e6"
      }}>
        <h2 style={{ 
          margin: "0 0 1rem 0", 
          color: "#333", 
          textAlign: "center",
          fontSize: "1.5rem"
        }}>
          Monthly Transaction Overview - {selectedYear}
        </h2>
        <div style={{ height: "400px", position: "relative" }}>
          <Bar data={monthlyBarChartData} options={barChartOptions} />
        </div>
      </div>

      {/* Charts Container */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
        gap: "2rem",
        marginBottom: "2rem"
      }}>
        {/* Income Chart */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "1.5rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          border: "1px solid #dee2e6"
        }}>
          <h2 style={{ 
            margin: "0 0 1rem 0", 
            color: "#2e7d32", 
            textAlign: "center",
            fontSize: "1.5rem"
          }}>
            {selectedMonth ? "Monthly Income by Category" : "Total Income by Category"}
          </h2>
          {incomeChartData.labels.length > 0 ? (
            <div style={{ height: "400px", position: "relative" }}>
              <Doughnut data={incomeChartData} options={chartOptions} />
            </div>
          ) : (
            <div style={{
              height: "400px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#666",
              fontSize: "1.1rem"
            }}>
              No income data available for this period
            </div>
          )}
        </div>

        {/* Expense Chart */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "1.5rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          border: "1px solid #dee2e6"
        }}>
          <h2 style={{ 
            margin: "0 0 1rem 0", 
            color: "#c62828", 
            textAlign: "center",
            fontSize: "1.5rem"
          }}>
            {selectedMonth ? "Monthly Expenses by Category" : "Total Expenses by Category"}
          </h2>
          {expenseChartData.labels.length > 0 ? (
            <div style={{ height: "400px", position: "relative" }}>
              <Doughnut data={expenseChartData} options={chartOptions} />
            </div>
          ) : (
            <div style={{
              height: "400px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#666",
              fontSize: "1.1rem"
            }}>
              No expense data available for this period
            </div>
          )}
        </div>
      </div>

      {/* Category Breakdown Tables */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
        gap: "2rem"
      }}>
        {/* Income Categories Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "1.5rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          border: "1px solid #dee2e6"
        }}>
          <h3 style={{ margin: "0 0 1rem 0", color: "#2e7d32" }}>Income Breakdown</h3>
          {incomeChartData.labels.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #dee2e6" }}>
                    <th style={{ padding: "0.75rem", textAlign: "left", color: "#333" }}>Category</th>
                    <th style={{ padding: "0.75rem", textAlign: "right", color: "#333" }}>Amount</th>
                    <th style={{ padding: "0.75rem", textAlign: "right", color: "#333" }}>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {incomeChartData.labels.map((label, index) => {
                    const amount = incomeChartData.datasets[0].data[index];
                    const total = getTotalIncome();
                    const percentage = total > 0 ? ((amount / total) * 100).toFixed(1) : 0;
                    return (
                      <tr key={label} style={{ borderBottom: "1px solid #f1f3f4" }}>
                        <td style={{ padding: "0.75rem", color: "#333" }}>{label}</td>
                        <td style={{ padding: "0.75rem", textAlign: "right", color: "#2e7d32", fontWeight: "500" }}>
                          {formatCurrency(amount)}
                        </td>
                        <td style={{ padding: "0.75rem", textAlign: "right", color: "#666" }}>
                          {percentage}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: "#666", textAlign: "center", fontStyle: "italic" }}>
              No income data available
            </p>
          )}
        </div>

        {/* Expense Categories Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "1.5rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          border: "1px solid #dee2e6"
        }}>
          <h3 style={{ margin: "0 0 1rem 0", color: "#c62828" }}>Expense Breakdown</h3>
          {expenseChartData.labels.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #dee2e6" }}>
                    <th style={{ padding: "0.75rem", textAlign: "left", color: "#333" }}>Category</th>
                    <th style={{ padding: "0.75rem", textAlign: "right", color: "#333" }}>Amount</th>
                    <th style={{ padding: "0.75rem", textAlign: "right", color: "#333" }}>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {expenseChartData.labels.map((label, index) => {
                    const amount = expenseChartData.datasets[0].data[index];
                    const total = getTotalExpenses();
                    const percentage = total > 0 ? ((amount / total) * 100).toFixed(1) : 0;
                    return (
                      <tr key={label} style={{ borderBottom: "1px solid #f1f3f4" }}>
                        <td style={{ padding: "0.75rem", color: "#333" }}>{label}</td>
                        <td style={{ padding: "0.75rem", textAlign: "right", color: "#c62828", fontWeight: "500" }}>
                          {formatCurrency(amount)}
                        </td>
                        <td style={{ padding: "0.75rem", textAlign: "right", color: "#666" }}>
                          {percentage}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: "#666", textAlign: "center", fontStyle: "italic" }}>
              No expense data available
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
