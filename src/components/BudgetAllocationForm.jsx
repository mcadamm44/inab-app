import { useState } from "react";
import styles from "../styles/ExpenseTracker.module.css";

const BudgetAllocationForm = ({ accounts, onAddAllocation, onCancel, editingAllocation = null }) => {
  const [formData, setFormData] = useState({
    accountId: editingAllocation?.accountId || "",
    amount: editingAllocation?.amount || "",
    month: editingAllocation?.month || new Date().toISOString().slice(0, 7), // YYYY-MM format
    description: editingAllocation?.description || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.accountId || !formData.amount) return;

    onAddAllocation({
      ...formData,
      amount: parseFloat(formData.amount),
    });

    if (!editingAllocation) {
      // Reset form only if adding new allocation
      setFormData({
        accountId: "",
        amount: "",
        month: new Date().toISOString().slice(0, 7),
        description: "",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatMonth = (monthString) => {
    const [year, month] = monthString.split('-');
    return new Date(year, month - 1).toLocaleDateString('en-IE', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.formTitle}>
        {editingAllocation ? "Edit Budget Allocation" : "Add Budget Allocation"}
      </h3>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Account</label>
          <select
            name="accountId"
            value={formData.accountId}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="">Select account</option>
            {accounts.map(account => (
              <option key={account.id} value={account.id}>
                {account.name} ({account.type})
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
            min="0"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Month</label>
          <input
            type="month"
            name="month"
            value={formData.month}
            onChange={handleChange}
            className={styles.input}
            required
          />
          {formData.month && (
            <small className={styles.helperText}>
              {formatMonth(formData.month)}
            </small>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Description (Optional)</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={styles.input}
            placeholder="e.g., Monthly savings goal"
          />
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.button}>
            {editingAllocation ? "Update Allocation" : "Add Allocation"}
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

export default BudgetAllocationForm; 