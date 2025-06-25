import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Plus, X } from "lucide-react";
import styles from "../styles/ExpenseTracker.module.css";

const BudgetAllocationForm = ({ onAddAllocation, onCancel, editingAllocation, accounts }) => {
  const [formData, setFormData] = useState({
    accountId: "",
    amount: "",
    month: "",
    description: "",
  });

  useEffect(() => {
    if (editingAllocation) {
      setFormData({
        accountId: editingAllocation.accountId || "",
        amount: editingAllocation.amount?.toString() || "",
        month: editingAllocation.month || "",
        description: editingAllocation.description || "",
      });
    } else {
      // Set default month to current month
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      setFormData({
        accountId: "",
        amount: "",
        month: currentMonth,
        description: "",
      });
    }
  }, [editingAllocation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.accountId || !formData.amount || !formData.month) return;

    try {
      await onAddAllocation({
        accountId: formData.accountId,
        amount: parseFloat(formData.amount) || 0,
        month: formData.month,
        description: formData.description.trim(),
      });

      // Reset form
      setFormData({
        accountId: "",
        amount: "",
        month: new Date().toISOString().slice(0, 7),
        description: "",
      });
    } catch (error) {
      console.error("Error adding budget allocation:", error);
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
    <div className={styles.formSection}>
      <h3 className={styles.formTitle}>
        {editingAllocation ? "Edit Budget Allocation" : "Add Budget Allocation"}
      </h3>
      <form onSubmit={handleSubmit} className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="allocation-account" className={styles.label}>
            Account *
          </label>
          <select
            id="allocation-account"
            name="accountId"
            value={formData.accountId}
            onChange={handleChange}
            className={styles.input}
            required
          >
            <option value="">Select an account</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name} (€{account.balance?.toFixed(2) || "0.00"})
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="allocation-amount" className={styles.label}>
            Amount *
          </label>
          <input
            id="allocation-amount"
            name="amount"
            type="number"
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
          <label htmlFor="allocation-month" className={styles.label}>
            Month *
          </label>
          <input
            id="allocation-month"
            name="month"
            type="month"
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
          <label htmlFor="allocation-description" className={styles.label}>
            Description (Optional)
          </label>
          <textarea
            id="allocation-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={styles.input}
            placeholder="e.g., Monthly savings goal, Emergency fund contribution"
            rows="2"
          />
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.addButton}>
            <Plus size={16} />
            {editingAllocation ? "Update Allocation" : "Add Allocation"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
          >
            <X size={16} />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

BudgetAllocationForm.propTypes = {
  onAddAllocation: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  editingAllocation: PropTypes.shape({
    id: PropTypes.string,
    accountId: PropTypes.string,
    amount: PropTypes.number,
    month: PropTypes.string,
    description: PropTypes.string,
  }),
  accounts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      balance: PropTypes.number,
    })
  ).isRequired,
};

export default BudgetAllocationForm; 