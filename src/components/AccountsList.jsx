import styles from "../styles/ExpenseTracker.module.css";

const AccountsList = ({ accounts, onEditAccount, onDeleteAccount }) => {
  const getTotalBalance = () => {
    return accounts.reduce((sum, account) => sum + account.balance, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className={styles.accountsSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Accounts</h2>
        <div className={styles.totalBalance}>
          <span className={styles.totalLabel}>Total Balance:</span>
          <span className={styles.totalAmount}>
            {formatCurrency(getTotalBalance())}
          </span>
        </div>
      </div>

      {accounts.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No accounts yet. Add your first account to get started!</p>
        </div>
      ) : (
        <div className={styles.accountsGrid}>
          {accounts.map((account) => (
            <div
              key={account.id}
              className={styles.accountCard}
              style={{ borderLeftColor: account.color }}
            >
              <div className={styles.accountHeader}>
                <div className={styles.accountInfo}>
                  <h3 className={styles.accountName}>{account.name}</h3>
                  <span className={styles.accountType}>{account.type}</span>
                </div>
                <div className={styles.accountActions}>
                  <button
                    onClick={() => onEditAccount(account)}
                    className={styles.actionButton}
                    title="Edit account"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDeleteAccount(account.id)}
                    className={styles.actionButton}
                    title="Delete account"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className={styles.accountBalance}>
                <span className={styles.balanceLabel}>Balance:</span>
                <span className={`${styles.balanceAmount} ${account.balance < 0 ? styles.negativeBalance : ''}`}>
                  {formatCurrency(account.balance)}
                </span>
              </div>

              {account.description && (
                <div className={styles.accountDescription}>
                  <p>{account.description}</p>
                </div>
              )}

              <div className={styles.accountMeta}>
                <span className={styles.accountDate}>
                  Created: {new Date(account.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountsList; 