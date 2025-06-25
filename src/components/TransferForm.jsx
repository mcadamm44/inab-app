import { useState } from "react";
import styles from "../styles/ExpenseTracker.module.css";

const TransferForm = ({ accounts, onAddTransfer, onCancel }) => {
  const [formData, setFormData] = useState({
    fromAccount: "",
    toAccount: "",
    amount: "",
    date: new Date().toISOString().split('T')[0],
    description: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fromAccount || !formData.toAccount || !formData.amount) return;
    if (formData.fromAccount === formData.toAccount) {
      alert("Cannot transfer to the same account");
      return;
    }

    onAddTransfer({
      ...formData,
      amount: parseFloat(formData.amount),
    });

    // Reset form
    setFormData({
      fromAccount: "",
      toAccount: "",
      amount: "",
      date: new Date().toISOString().split('T')[0],
      description: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.formTitle}>Transfer Between Accounts</h3>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>From Account</label>
          <select
            name="fromAccount"
            value={formData.fromAccount}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="">Select account</option>
            {accounts.map(account => (
              <option key={account.id} value={account.id}>
                {account.name} (€{account.balance.toFixed(2)})
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>To Account</label>
          <select
            name="toAccount"
            value={formData.toAccount}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="">Select account</option>
            {accounts.map(account => (
              <option key={account.id} value={account.id}>
                {account.name} (€{account.balance.toFixed(2)})
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className={styles.input}
            placeholder="0.00"
            step="0.01"
            min="0.01"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Description (Optional)</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={styles.input}
            placeholder="e.g., Monthly savings transfer"
          />
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.button}>
            Transfer
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className={`${styles.button} ${styles.buttonSecondary}`}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TransferForm; 