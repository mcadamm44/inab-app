import PropTypes from "prop-types";
import { Trash2, Edit3, Calendar, User, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";
import styles from "../styles/ExpenseTracker.module.css";

const DebtsList = ({ debts, onEditDebt, onDeleteDebt }) => {
  const { formatCurrency } = useCurrency();

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Paid Off":
        return <CheckCircle size={16} className={styles.statusIconPaid} />;
      case "Overdue":
        return <AlertTriangle size={16} className={styles.statusIconOverdue} />;
      case "In Collections":
        return <AlertTriangle size={16} className={styles.statusIconCollections} />;
      default:
        return <Clock size={16} className={styles.statusIconActive} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid Off":
        return "#10b981";
      case "Overdue":
        return "#ef4444";
      case "In Collections":
        return "#dc2626";
      default:
        return "#3b82f6";
    }
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    const today = new Date();
    const due = new Date(dueDate);
    return due < today;
  };

  // Calculate totals
  const totalDebts = debts
    .filter(debt => debt.isDebt)
    .reduce((sum, debt) => sum + debt.amount, 0);
  
  const totalLoans = debts
    .filter(debt => !debt.isDebt)
    .reduce((sum, debt) => sum + debt.amount, 0);

  const netDebt = totalDebts - totalLoans;

  return (
    <div className={styles.debtsSection}>
      <div className={styles.debtsSummary}>
        <div className={styles.debtSummaryItem}>
          <span className={styles.debtSummaryLabel}>You Owe:</span>
          <span className={styles.debtSummaryAmount} style={{ color: "#ef4444" }}>
            {formatCurrency(totalDebts)}
          </span>
        </div>
        <div className={styles.debtSummaryItem}>
          <span className={styles.debtSummaryLabel}>Owed to You:</span>
          <span className={styles.debtSummaryAmount} style={{ color: "#10b981" }}>
            {formatCurrency(totalLoans)}
          </span>
        </div>
        <div className={styles.debtSummaryItem}>
          <span className={styles.debtSummaryLabel}>Net:</span>
          <span 
            className={styles.debtSummaryAmount} 
            style={{ color: netDebt >= 0 ? "#ef4444" : "#10b981" }}
          >
            {formatCurrency(Math.abs(netDebt))} {netDebt >= 0 ? "owed" : "owed to you"}
          </span>
        </div>
      </div>

      {debts.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateText}>No debts or loans</div>
        </div>
      ) : (
        <div className={styles.debtsList}>
          {debts.map((debt) => (
            <div key={debt.id} className={styles.debtItem}>
              <div className={styles.debtInfo}>
                <div className={styles.debtHeader}>
                  <div className={styles.debtName}>{debt.name}</div>
                  <div className={styles.debtType}>{debt.type}</div>
                </div>
                <div className={styles.debtMeta}>
                  <div className={styles.debtPerson}>
                    <User size={12} />
                    {debt.person}
                  </div>
                  {debt.dueDate && (
                    <div className={`${styles.debtDueDate} ${isOverdue(debt.dueDate) ? styles.overdue : ''}`}>
                      <Calendar size={12} />
                      {formatDate(debt.dueDate)}
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.debtActions}>
                <div className={styles.debtStatus}>
                  {getStatusIcon(debt.status)}
                  <span 
                    className={styles.debtStatusText}
                    style={{ color: getStatusColor(debt.status) }}
                  >
                    {debt.status}
                  </span>
                </div>
                <div className={styles.debtAmount}>
                  <span 
                    className={styles.debtAmountValue}
                    style={{ color: debt.isDebt ? "#ef4444" : "#10b981" }}
                  >
                    {formatCurrency(debt.amount)}
                  </span>
                </div>
                <div className={styles.debtButtons}>
                  <button
                    onClick={() => onEditDebt(debt)}
                    className={styles.editButton}
                    title="Edit debt/loan"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => onDeleteDebt(debt.id)}
                    className={styles.deleteButton}
                    title="Delete debt/loan"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

DebtsList.propTypes = {
  debts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      person: PropTypes.string.isRequired,
      description: PropTypes.string,
      dueDate: PropTypes.string,
      status: PropTypes.string.isRequired,
      isDebt: PropTypes.bool.isRequired,
      createdAt: PropTypes.object,
    })
  ).isRequired,
  onEditDebt: PropTypes.func.isRequired,
  onDeleteDebt: PropTypes.func.isRequired,
};

export default DebtsList; 