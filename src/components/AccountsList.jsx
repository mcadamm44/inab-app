import PropTypes from "prop-types";
import { Edit, Trash2, DollarSign } from "lucide-react";
import styles from "../styles/ExpenseTracker.module.css";

const AccountsList = ({ accounts, onEditAccount, onDeleteAccount }) => {
  const totalBalance = accounts.reduce((sum, account) => sum + (account.balance || 0), 0);

  if (accounts.length === 0) {
    return (
      <div className={styles.emptyState}>
        <DollarSign size={48} className={styles.emptyIcon} />
        <h3>No Accounts Yet</h3>
        <p>Add your first account to start tracking your finances.</p>
      </div>
    );
  }

  return (
    <div className={styles.listSection}>
      <div className={styles.listHeader}>
        <h3>Your Accounts</h3>
        <div className={styles.totalBalance}>
          <span>Total Balance:</span>
          <span className={styles.balanceAmount}>
            €{totalBalance.toFixed(2)}
          </span>
        </div>
      </div>

      <div className={styles.accountsGrid}>
        {accounts.map((account) => (
          <div
            key={account.id}
            className={styles.accountCard}
            style={{ borderLeftColor: account.color || "#3B82F6" }}
          >
            <div className={styles.accountHeader}>
              <div className={styles.accountInfo}>
                <h4 className={styles.accountName}>{account.name}</h4>
                <span className={styles.accountType}>{account.type}</span>
              </div>
              <div className={styles.accountBalance}>
                €{account.balance?.toFixed(2) || "0.00"}
              </div>
            </div>

            {account.description && (
              <p className={styles.accountDescription}>{account.description}</p>
            )}

            <div className={styles.accountActions}>
              <button
                onClick={() => onEditAccount(account)}
                className={styles.actionButton}
                title="Edit Account"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => onDeleteAccount(account.id)}
                className={`${styles.actionButton} ${styles.deleteButton}`}
                title="Delete Account"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

AccountsList.propTypes = {
  accounts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      balance: PropTypes.number,
      description: PropTypes.string,
      color: PropTypes.string,
    })
  ).isRequired,
  onEditAccount: PropTypes.func.isRequired,
  onDeleteAccount: PropTypes.func.isRequired,
};

export default AccountsList; 