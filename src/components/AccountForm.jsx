import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Plus, X, Palette } from "lucide-react";
import styles from "../styles/ExpenseTracker.module.css";

const ACCOUNT_TYPES = [
  "Checking",
  "Savings",
  "Investment",
  "Crypto",
  "Credit Card",
  "Cash",
  "Other"
];

const AccountForm = ({ onAddAccount, onCancel, editingAccount }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "Checking",
    balance: "",
    description: "",
    color: "#3B82F6",
  });

  useEffect(() => {
    if (editingAccount) {
      setFormData({
        name: editingAccount.name || "",
        type: editingAccount.type || "Checking",
        balance: editingAccount.balance?.toString() || "",
        description: editingAccount.description || "",
        color: editingAccount.color || "#3B82F6",
      });
    }
  }, [editingAccount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.balance) return;

    try {
      await onAddAccount({
        name: formData.name.trim(),
        type: formData.type,
        balance: parseFloat(formData.balance) || 0,
        description: formData.description.trim(),
        color: formData.color,
      });

      // Reset form
      setFormData({
        name: "",
        type: "Checking",
        balance: "",
        description: "",
        color: "#3B82F6",
      });
    } catch (error) {
      console.error("Error adding account:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={styles.formSection}>
      <h3 className={styles.formTitle}>
        {editingAccount ? "Edit Account" : "Add New Account"}
      </h3>
      <form onSubmit={handleSubmit} className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="account-name" className={styles.label}>
            Account Name *
          </label>
          <input
            id="account-name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={styles.input}
            placeholder="e.g., Main Checking, Savings Account"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="account-type" className={styles.label}>
            Account Type *
          </label>
          <select
            id="account-type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={styles.input}
            required
          >
            {ACCOUNT_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="account-balance" className={styles.label}>
            Current Balance *
          </label>
          <input
            id="account-balance"
            name="balance"
            type="number"
            value={formData.balance}
            onChange={handleChange}
            className={styles.input}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="account-description" className={styles.label}>
            Description (Optional)
          </label>
          <textarea
            id="account-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={styles.input}
            placeholder="Brief description of this account"
            rows="2"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="account-color" className={styles.label}>
            <Palette size={16} />
            Account Color
          </label>
          <input
            id="account-color"
            name="color"
            type="color"
            value={formData.color}
            onChange={handleChange}
            className={styles.colorInput}
          />
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.addButton}>
            <Plus size={16} />
            {editingAccount ? "Update Account" : "Add Account"}
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

AccountForm.propTypes = {
  onAddAccount: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  editingAccount: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    balance: PropTypes.number,
    description: PropTypes.string,
    color: PropTypes.string,
  }),
};

export default AccountForm; 