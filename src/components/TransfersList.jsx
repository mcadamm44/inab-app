import styles from "../styles/ExpenseTracker.module.css";

const TransfersList = ({ transfers, accounts, onDeleteTransfer }) => {
  const getAccountName = (accountId) => {
    const account = accounts.find(acc => acc.id === accountId);
    return account ? account.name : 'Unknown Account';
  };

  const getAccountColor = (accountId) => {
    const account = accounts.find(acc => acc.id === accountId);
    return account ? account.color : '#ccc';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={styles.transfersSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Transfers</h2>
      </div>

      {transfers.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No transfers yet. Transfer money between your accounts to see them here!</p>
        </div>
      ) : (
        <div className={styles.transfersList}>
          {transfers.map((transfer) => (
            <div key={transfer.id} className={styles.transferItem}>
              <div className={styles.transferHeader}>
                <div className={styles.transferAccounts}>
                  <div className={styles.fromAccount}>
                    <span 
                      className={styles.accountDot}
                      style={{ backgroundColor: getAccountColor(transfer.fromAccount) }}
                    ></span>
                    <span className={styles.accountName}>
                      {getAccountName(transfer.fromAccount)}
                    </span>
                  </div>
                  <div className={styles.transferArrow}>→</div>
                  <div className={styles.toAccount}>
                    <span 
                      className={styles.accountDot}
                      style={{ backgroundColor: getAccountColor(transfer.toAccount) }}
                    ></span>
                    <span className={styles.accountName}>
                      {getAccountName(transfer.toAccount)}
                    </span>
                  </div>
                </div>
                <div className={styles.transferActions}>
                  <button
                    onClick={() => onDeleteTransfer(transfer.id)}
                    className={styles.actionButton}
                    title="Delete transfer"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className={styles.transferDetails}>
                <div className={styles.transferAmount}>
                  {formatCurrency(transfer.amount)}
                </div>
                <div className={styles.transferDate}>
                  {formatDate(transfer.date)}
                </div>
              </div>

              {transfer.description && (
                <div className={styles.transferDescription}>
                  <p>{transfer.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransfersList; 