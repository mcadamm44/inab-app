// src/components/ExpensesList.jsx
import { Trash2 } from "lucide-react";
import styles from "../styles/ExpenseTracker.module.css";

const ExpensesList = ({ expenses, categoryColors, onDeleteExpense }) => {
  return (
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
              {expense.isFromReport && (
                <span className={styles.reportLabel}>From Report</span>
              )}
            </div>
            <div className={styles.expenseActions}>
              <span className={styles.expenseAmount}>
                €{expense.amount.toFixed(2)}
              </span>
              {!expense.isFromReport && (
                <button
                  onClick={() => onDeleteExpense(expense.id)}
                  className={styles.deleteButton}
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ExpensesList;
