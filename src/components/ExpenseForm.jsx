// src/components/ExpenseForm.jsx
import { useState } from "react";
import { Plus, DollarSign, Tag, FileText } from "lucide-react";
import styles from "../styles/ExpenseTracker.module.css";

const ExpenseForm = ({ onAddExpense, categories }) => {
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState(categories[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!expenseName.trim() || !expenseAmount || parseFloat(expenseAmount) <= 0) return;

    setIsSubmitting(true);
    
    try {
      await onAddExpense({
        name: expenseName.trim(),
        amount: expenseAmount,
        category: expenseCategory,
      });

      // Reset form
      setExpenseName("");
      setExpenseAmount("");
      setExpenseCategory(categories[0]);
    } catch (error) {
      console.error("Error adding expense:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValidForm = expenseName.trim() && expenseAmount && parseFloat(expenseAmount) > 0;

  return (
    <div className={styles.formSection}>
      <h3 className={styles.formTitle}>Add New Expense</h3>
      <form onSubmit={handleSubmit} className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="expense-name" className={styles.label}>
            <FileText size={16} />
            Expense Name
          </label>
          <input
            id="expense-name"
            type="text"
            value={expenseName}
            onChange={(e) => setExpenseName(e.target.value)}
            className={styles.input}
            placeholder="e.g., Groceries, Gas, Netflix"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="expense-amount" className={styles.label}>
            <DollarSign size={16} />
            Amount
          </label>
          <input
            id="expense-amount"
            type="number"
            value={expenseAmount}
            onChange={(e) => setExpenseAmount(e.target.value)}
            className={styles.input}
            placeholder="0.00"
            required
            min="0"
            step="0.01"
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="expense-category" className={styles.label}>
            <Tag size={16} />
            Category
          </label>
          <select
            id="expense-category"
            value={expenseCategory}
            onChange={(e) => setExpenseCategory(e.target.value)}
            className={styles.input}
            disabled={isSubmitting}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <button 
          type="submit" 
          className={styles.addButton}
          disabled={!isValidForm || isSubmitting}
        >
          {isSubmitting ? (
            "Adding..."
          ) : (
            <>
              <Plus size={16} />
              Add Expense
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;
