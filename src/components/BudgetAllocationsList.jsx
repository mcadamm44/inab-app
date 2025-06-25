import styles from "../styles/ExpenseTracker.module.css";

const BudgetAllocationsList = ({ allocations, accounts, onEditAllocation, onDeleteAllocation }) => {
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

  const formatMonth = (monthString) => {
    const [year, month] = monthString.split('-');
    return new Date(year, month - 1).toLocaleDateString('en-IE', {
      year: 'numeric',
      month: 'long'
    });
  };

  // Group allocations by month
  const groupedAllocations = allocations.reduce((groups, allocation) => {
    const month = allocation.month;
    if (!groups[month]) {
      groups[month] = [];
    }
    groups[month].push(allocation);
    return groups;
  }, {});

  // Sort months in descending order
  const sortedMonths = Object.keys(groupedAllocations).sort((a, b) => b.localeCompare(a));

  return (
    <div className={styles.allocationsSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Budget Allocations</h2>
      </div>

      {allocations.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No budget allocations yet. Set monthly budget goals for your accounts!</p>
        </div>
      ) : (
        <div className={styles.allocationsList}>
          {sortedMonths.map((month) => (
            <div key={month} className={styles.monthGroup}>
              <h3 className={styles.monthTitle}>{formatMonth(month)}</h3>
              <div className={styles.monthAllocations}>
                {groupedAllocations[month].map((allocation) => (
                  <div key={allocation.id} className={styles.allocationItem}>
                    <div className={styles.allocationHeader}>
                      <div className={styles.allocationAccount}>
                        <span 
                          className={styles.accountDot}
                          style={{ backgroundColor: getAccountColor(allocation.accountId) }}
                        ></span>
                        <span className={styles.accountName}>
                          {getAccountName(allocation.accountId)}
                        </span>
                      </div>
                      <div className={styles.allocationActions}>
                        <button
                          onClick={() => onEditAllocation(allocation)}
                          className={styles.actionButton}
                          title="Edit allocation"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => onDeleteAllocation(allocation.id)}
                          className={styles.actionButton}
                          title="Delete allocation"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <div className={styles.allocationDetails}>
                      <div className={styles.allocationAmount}>
                        {formatCurrency(allocation.amount)}
                      </div>
                    </div>

                    {allocation.description && (
                      <div className={styles.allocationDescription}>
                        <p>{allocation.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BudgetAllocationsList; 