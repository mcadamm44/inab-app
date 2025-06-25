import { useState } from "react";
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

const AccountForm = ({ onAddAccount, onCancel, editingAccount = null }) => {
  const [formData, setFormData] = useState({
    name: editingAccount?.name || "",
    type: editingAccount?.type || "Checking",
    balance: editingAccount?.balance || 0,
    description: editingAccount?.description || "",
    color: editingAccount?.color || generateRandomColor(),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onAddAccount({
      ...formData,
      balance: parseFloat(formData.balance) || 0,
    });

    if (!editingAccount) {
      // Reset form only if adding new account
      setFormData({
        name: "",
        type: "Checking",
        balance: 0,
        description: "",
        color: generateRandomColor(),
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

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.formTitle}>
        {editingAccount ? "Edit Account" : "Add New Account"}
      </h3>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Account Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={styles.input}
            placeholder="e.g., Main Checking, Crypto Wallet"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Account Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={styles.select}
          >
            {ACCOUNT_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Current Balance</label>
          <input
            type="number"
            name="balance"
            value={formData.balance}
            onChange={handleChange}
            className={styles.input}
            placeholder="0.00"
            step="0.01"
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Description (Optional)</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={styles.textarea}
            placeholder="Brief description of this account"
            rows="3"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Account Color</label>
          <div className={styles.colorPickerContainer}>
            <input
              type="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className={styles.colorPicker}
            />
            <span className={styles.colorPreview} style={{ backgroundColor: formData.color }}>
              {formData.color}
            </span>
          </div>
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.button}>
            {editingAccount ? "Update Account" : "Add Account"}
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

// Helper function to generate random colors
const generateRandomColor = () => {
  const colors = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
    "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9",
    "#F8C471", "#82E0AA", "#F1948A", "#85C1E9", "#D7BDE2"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default AccountForm; 