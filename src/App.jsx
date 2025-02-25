import { useState, useMemo, useEffect } from "react";
import { Trash2, Save, Menu, X } from "lucide-react";
import styles from "./styles/ExpenseTracker.module.css";

const CATEGORIES = [
  "Food",
  "Transport",
  "Bills",
  "Entertainment",
  "Shopping",
  "Investments",
  "Savings",
  "Crytpo",
  "Wants",
  "Hobbies",
  "Other",
];

const generatePastelColor = () => {
  // Generate random RGB values with a minimum brightness
  const min = 150; // Minimum brightness value
  const max = 230; // Maximum brightness value

  const r = Math.floor(Math.random() * (max - min) + min);
  const g = Math.floor(Math.random() * (max - min) + min);
  const b = Math.floor(Math.random() * (max - min) + min);

  // Add some randomness to one channel to increase variation
  const randomChannel = Math.floor(Math.random() * 3);
  const channels = [r, g, b];
  channels[randomChannel] = Math.floor(Math.random() * (min - 100) + 100); // Allow one channel to be darker

  return `rgb(${channels[0]}, ${channels[1]}, ${channels[2]})`;
};

const App = () => {
  const [total, setTotal] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState(CATEGORIES[0]);
  const [savedReports, setSavedReports] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Generate and memoize colors for categories
  const categoryColors = useMemo(() => {
    return CATEGORIES.reduce((acc, category) => {
      acc[category] = generatePastelColor();
      return acc;
    }, {});
  }, []); // Empty dependency array means this only runs once

  useEffect(() => {
    const storedReports = localStorage.getItem("inab-reports");
    if (storedReports) {
      setSavedReports(JSON.parse(storedReports));
    }
  }, []);

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!expenseName || !expenseAmount) return;

    const newExpense = {
      id: Date.now(),
      name: expenseName,
      amount: parseFloat(expenseAmount),
      category: expenseCategory,
    };

    setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
    setExpenseName("");
    setExpenseAmount("");
  };

  const deleteExpense = (id) => {
    setExpenses((prevExpenses) => prevExpenses.filter((e) => e.id !== id));
  };

  const getRemainingBalance = () => {
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    return total - totalExpenses;
  };

  const getCategoryTotal = (category) => {
    return expenses
      .filter((exp) => exp.category === category)
      .reduce((sum, exp) => sum + exp.amount, 0);
  };

  const handleSave = () => {
    const reportName = prompt(
      "Enter a name for this report:",
      `Budget Report ${new Date().toLocaleDateString()}`
    );
    if (!reportName) return;

    const data = {
      name: reportName,
      total,
      expenses,
      exportDate: new Date().toISOString(),
    };

    // Save to localStorage
    const updatedReports = [...savedReports, data];
    setSavedReports(updatedReports);
    localStorage.setItem("inab-reports", JSON.stringify(updatedReports));

    // Open sidebar to show the saved report
    setIsSidebarOpen(true);
  };

  // Load a report from the sidebar
  const loadReport = (report) => {
    setTotal(report.total);
    setExpenses(report.expenses);
    setIsSidebarOpen(false);
  };

  // Delete a report from the sidebar
  const deleteReport = (index) => {
    const confirmed = confirm("Are you sure you want to delete this report?");
    if (!confirmed) return;

    const updatedReports = [...savedReports];
    updatedReports.splice(index, 1);
    setSavedReports(updatedReports);
    localStorage.setItem("inab-reports", JSON.stringify(updatedReports));
  };

  return (
    <div className={styles.appContainer}>
      {/* Sidebar */}
      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ""}`}>
        <div className={styles.sidebarHeader}>
          <h2>Reports</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className={styles.closeButton}
          >
            <X size={20} />
          </button>
        </div>

        {savedReports.length === 0 ? (
          <p className={styles.emptyReports}>No saved reports yet</p>
        ) : (
          <ul className={styles.reportsList}>
            {savedReports.map((report, index) => (
              <li key={index} className={styles.reportItem}>
                <div className={styles.reportInfo}>
                  <p className={styles.reportName}>{report.name}</p>
                  <p className={styles.reportDate}>
                    {new Date(report.exportDate).toLocaleDateString()}
                  </p>
                </div>
                <div className={styles.reportActions}>
                  <button
                    onClick={() => loadReport(report)}
                    className={styles.reportButton}
                    title="Load Report"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => deleteReport(index)}
                    className={styles.reportButton}
                    title="Delete Report"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Main content */}
      <div className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.header}>
              <div className={styles.titleContainer}>
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className={styles.menuButton}
                >
                  <Menu size={20} />
                </button>
                <h1 className={styles.title}>Expense Tracker (€)</h1>
              </div>
              <div className={styles.actions}>
                <button
                  onClick={handleSave}
                  className={styles.actionButton}
                  title="Save Budget Report"
                >
                  <span>
                    <Save size={16} />
                  </span>
                </button>
              </div>
            </div>

            <div>
              <label className={styles.label}>Starting Amount</label>
              <input
                type="number"
                value={total}
                onChange={(e) => setTotal(parseFloat(e.target.value) || 0)}
                className={`${styles.input} ${styles.nameInput}`}
                placeholder="Enter your total amount"
              />
            </div>

            <div className={styles.balanceCard}>
              <div className={styles.balanceLabel}>Remaining Balance</div>
              <div className={styles.balanceAmount}>
                €{getRemainingBalance().toFixed(2)}
              </div>
            </div>

            <form onSubmit={handleAddExpense} className={styles.form}>
              <input
                type="text"
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
                className={`${styles.input} ${styles.nameInput}`}
                placeholder="Expense name"
                required
              />
              <input
                type="number"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                className={`${styles.input} ${styles.amountInput}`}
                placeholder="Amount"
                required
                min="0"
                step="0.01"
              />
              <select
                value={expenseCategory}
                onChange={(e) => setExpenseCategory(e.target.value)}
                className={`${styles.input} ${styles.categoryInput}`}
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <button type="submit" className={styles.button}>
                Add
              </button>
            </form>

            <div className={styles.categoryTotals}>
              <h2 className={styles.categoryTitle}>Category Totals</h2>
              <div className={styles.categoryGrid}>
                {CATEGORIES.map((category) => (
                  <div
                    key={category}
                    className={styles.categoryCard}
                    style={{ backgroundColor: categoryColors[category] }}
                  >
                    <div className={styles.categoryName}>{category}</div>
                    <div className={styles.categoryAmount}>
                      €{getCategoryTotal(category).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.expensesList}>
              <h2 className={styles.expensesTitle}>All Expenses</h2>
              {expenses.length === 0 ? (
                <div className={styles.emptyState}>No expenses added yet</div>
              ) : (
                expenses.map((expense) => (
                  <div key={expense.id} className={styles.expenseItem}>
                    <div>
                      <span className={styles.expenseName}>{expense.name}</span>
                      <span
                        className={styles.expenseCategory}
                        style={{
                          backgroundColor: categoryColors[expense.category],
                        }}
                      >
                        {expense.category}
                      </span>
                    </div>
                    <div className={styles.expenseActions}>
                      <span className={styles.expenseAmount}>
                        €{expense.amount.toFixed(2)}
                      </span>
                      <button
                        onClick={() => deleteExpense(expense.id)}
                        className={styles.deleteButton}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
