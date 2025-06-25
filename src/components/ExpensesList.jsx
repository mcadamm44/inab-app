// src/components/ExpensesList.jsx
import { Trash2, Calendar, AlertCircle } from "lucide-react";
import styles from "../styles/ExpenseTracker.module.css";

const ExpensesList = ({ expenses, categoryColors, onDeleteExpense }) => {
  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className={styles.expensesSection}>
      <div className={styles.expensesHeader}>
        <h2 className={styles.expensesTitle}>All Expenses</h2>
        <div className={styles.expensesSummary}>
          <span className={styles.expensesCount}>
            {expenses.length} {expenses.length === 1 ? "expense" : "expenses"}
          </span>
          <span className={styles.expensesTotal}>
            Total: €{totalExpenses.toFixed(2)}
          </span>
        </div>
      </div>

      {expenses.length === 0 ? (
        <div className={styles.emptyState}>
          <AlertCircle className={styles.emptyStateIcon} />
          <div className={styles.emptyStateText}>No expenses added yet</div>
          <div className={styles.emptyStateSubtext}>
            Add your first expense using the form above
          </div>
        </div>
      ) : (
        <div className={styles.expensesList}>
          {expenses.map((expense) => (
            <div key={expense.id} className={styles.expenseItem}>
              <div className={styles.expenseInfo}>
                <div className={styles.expenseName}>{expense.name}</div>
                <div className={styles.expenseMeta}>
                  <span
                    className={styles.expenseCategory}
                    style={{
                      backgroundColor: categoryColors[expense.category],
                      color: "#1f2937",
                    }}
                  >
                    {expense.category}
                  </span>
                  {expense.createdAt && (
                    <span className={styles.expenseDate}>
                      <Calendar size={12} />
                      {formatDate(expense.createdAt)}
                    </span>
                  )}
                  {expense.isFromReport && (
                    <span className={styles.reportLabel}>From Report</span>
                  )}
                </div>
              </div>
              <div className={styles.expenseActions}>
                <span className={styles.expenseAmount}>
                  €{expense.amount.toFixed(2)}
                </span>
                {!expense.isFromReport && (
                  <button
                    onClick={() => onDeleteExpense(expense.id)}
                    className={styles.deleteButton}
                    title="Delete expense"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpensesList;
