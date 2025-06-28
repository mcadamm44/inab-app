import PropTypes from "prop-types";
import { Edit, Trash2 } from "lucide-react";
import { useCurrency } from "../context/CurrencyContext.jsx";
import styles from "../styles/ExpenseTracker.module.css";

const BudgetAllocationsList = ({ allocations, accounts, onEditAllocation, onDeleteAllocation }) => {
  const { formatCurrency } = useCurrency();

  const getAccountName = (accountId) => {
    const account = accounts.find(acc => acc.id === accountId);
    return account ? account.name : 'Unknown Account';
  };

  const getAccountColor = (accountId) => {
    const account = accounts.find(acc => acc.id === accountId);
    return account ? account.color : '#ccc';
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
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => onDeleteAllocation(allocation.id)}
                          className={styles.actionButton}
                          title="Delete allocation"
                        >
                          <Trash2 size={16} />
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

BudgetAllocationsList.propTypes = {
  allocations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      accountId: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      month: PropTypes.string.isRequired,
      description: PropTypes.string,
    })
  ).isRequired,
  accounts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      color: PropTypes.string,
    })
  ).isRequired,
  onEditAllocation: PropTypes.func.isRequired,
  onDeleteAllocation: PropTypes.func.isRequired,
};

export default BudgetAllocationsList; 