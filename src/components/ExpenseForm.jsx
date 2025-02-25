// src/components/ExpenseForm.jsx
import { useState } from "react";
import styles from "../styles/ExpenseTracker.module.css";

const ExpenseForm = ({ onAddExpense, categories }) => {
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState(categories[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!expenseName || !expenseAmount) return;

    onAddExpense({
      name: expenseName,
      amount: expenseAmount,
      category: expenseCategory,
    });

    // Reset form
    setExpenseName("");
    setExpenseAmount("");
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
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
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <button type="submit" className={styles.button}>
        Add
      </button>
    </form>
  );
};

export default ExpenseForm;
