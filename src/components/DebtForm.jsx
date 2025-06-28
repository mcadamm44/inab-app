import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Plus, X, Calendar, User } from "lucide-react";
import styles from "../styles/ExpenseTracker.module.css";

const DEBT_TYPES = [
  "Personal Loan",
  "Credit Card",
  "Student Loan",
  "Car Loan",
  "Mortgage",
  "Business Loan",
  "Medical Debt",
  "Other"
];

const DEBT_STATUS = [
  "Active",
  "Paid Off",
  "Overdue",
  "In Collections"
];

const DebtForm = ({ onAddDebt, onCancel, editingDebt }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "Personal Loan",
    amount: "",
    person: "",
    description: "",
    dueDate: "",
    status: "Active",
    isDebt: true, // true = you owe money, false = someone owes you
  });

  useEffect(() => {
    if (editingDebt) {
      setFormData({
        name: editingDebt.name || "",
        type: editingDebt.type || "Personal Loan",
        amount: editingDebt.amount?.toString() || "",
        person: editingDebt.person || "",
        description: editingDebt.description || "",
        dueDate: editingDebt.dueDate || "",
        status: editingDebt.status || "Active",
        isDebt: editingDebt.isDebt !== false, // default to true if not specified
      });
    }
  }, [editingDebt]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.amount || !formData.person.trim()) return;

    try {
      await onAddDebt({
        name: formData.name.trim(),
        type: formData.type,
        amount: parseFloat(formData.amount) || 0,
        person: formData.person.trim(),
        description: formData.description.trim(),
        dueDate: formData.dueDate,
        status: formData.status,
        isDebt: formData.isDebt,
      });

      // Reset form
      setFormData({
        name: "",
        type: "Personal Loan",
        amount: "",
        person: "",
        description: "",
        dueDate: "",
        status: "Active",
        isDebt: true,
      });
      
      // Close the form after successful submission
      onCancel();
    } catch (error) {
      console.error("Error adding debt:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className={styles.formSection}>
      <h3 className={styles.formTitle}>
        {editingDebt ? "Edit Debt/Loan" : "Add New Debt/Loan"}
      </h3>
      <form onSubmit={handleSubmit} className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="debt-name" className={styles.label}>
            Debt/Loan Name *
          </label>
          <input
            id="debt-name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={styles.input}
            placeholder="e.g., Car Loan, Credit Card Debt"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="debt-type" className={styles.label}>
            Type *
          </label>
          <select
            id="debt-type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={styles.input}
            required
          >
            {DEBT_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="debt-amount" className={styles.label}>
            Amount *
          </label>
          <input
            id="debt-amount"
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
          <label htmlFor="debt-person" className={styles.label}>
            <User size={16} />
            Person/Institution *
          </label>
          <input
            id="debt-person"
            name="person"
            type="text"
            value={formData.person}
            onChange={handleChange}
            className={styles.input}
            placeholder="e.g., Bank of America, John Smith"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="debt-due-date" className={styles.label}>
            <Calendar size={16} />
            Due Date
          </label>
          <input
            id="debt-due-date"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="debt-status" className={styles.label}>
            Status
          </label>
          <select
            id="debt-status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={styles.input}
          >
            {DEBT_STATUS.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="debt-description" className={styles.label}>
            Description (Optional)
          </label>
          <textarea
            id="debt-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={styles.input}
            placeholder="Additional details about this debt/loan"
            rows="2"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            <input
              type="checkbox"
              name="isDebt"
              checked={formData.isDebt}
              onChange={handleChange}
              className={styles.checkbox}
            />
            I owe this money (uncheck if someone owes you)
          </label>
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.addButton}>
            <Plus size={16} />
            {editingDebt ? "Update Debt/Loan" : "Add Debt/Loan"}
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

DebtForm.propTypes = {
  onAddDebt: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  editingDebt: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    amount: PropTypes.number,
    person: PropTypes.string,
    description: PropTypes.string,
    dueDate: PropTypes.string,
    status: PropTypes.string,
    isDebt: PropTypes.bool,
  }),
};

export default DebtForm; 