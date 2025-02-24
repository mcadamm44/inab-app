import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import styles from './styles/ExpenseTracker.module.css';

const App = () => {
  const [total, setTotal] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!expenseName || !expenseAmount) return;

    const newExpense = {
      id: Date.now(),
      name: expenseName,
      amount: parseFloat(expenseAmount)
    };

    setExpenses(prevExpenses => [...prevExpenses, newExpense]);
    setExpenseName('');
    setExpenseAmount('');
  };

  const deleteExpense = (id) => {
    setExpenses(prevExpenses => prevExpenses.filter(e => e.id !== id));
  };

  const getRemainingBalance = () => {
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    return total - totalExpenses;
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Expense Tracker (€)</h1>
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
          <div className={styles.balanceAmount}>€{getRemainingBalance().toFixed(2)}</div>
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
          <button type="submit" className={styles.button}>
            Add
          </button>
        </form>

        <div className={styles.expensesList}>
          {expenses.length === 0 ? (
            <div className={styles.emptyState}>No expenses added yet</div>
          ) : (
            expenses.map(expense => (
              <div key={expense.id} className={styles.expenseItem}>
                <span className={styles.expenseName}>{expense.name}</span>
                <div className="flex items-center gap-4">
                  <span className={styles.expenseAmount}>€{expense.amount.toFixed(2)}</span>
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
  );
};

export default App;