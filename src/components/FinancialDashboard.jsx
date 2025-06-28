import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useCurrency } from '../context/CurrencyContext';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  Plus,
  Edit3,
  Trash2,
  Database
} from 'lucide-react';
import ExpensesByCategory from './ExpensesByCategory';
import AccountForm from './AccountForm';
import DebtForm from './DebtForm';
import styles from '../styles/ExpenseTracker.module.css';
import { populateSampleData } from '../firebase/firebaseService';
import { useAuth } from '../context/AuthContext';

const FinancialDashboard = ({
  total,
  expenses,
  accounts,
  debts,
  categoryNames,
  categoryColors,
  onAddExpense,
  onDeleteExpense,
  onAddCategory,
  onDeleteCategory,
  onAddAccount,
  onEditAccount,
  onDeleteAccount,
  onAddDebt,
  onEditDebt,
  onDeleteDebt,
  getRemainingBalance,
  setTotal
}) => {
  const { currentUser } = useAuth();
  const { formatCurrency } = useCurrency();
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [showDebtForm, setShowDebtForm] = useState(false);
  const [editingDebt, setEditingDebt] = useState(null);
  const [isPopulating, setIsPopulating] = useState(false);

  // Debug logging
  useEffect(() => {
    if (expenses.length > 0) {
      const sampleExpense = expenses[0];
      console.log('FinancialDashboard: Sample expense:', {
        id: sampleExpense.id,
        name: sampleExpense.name,
        date: sampleExpense.date,
        dateType: typeof sampleExpense.date,
        hasToDate: sampleExpense.date && typeof sampleExpense.date === 'object' && sampleExpense.date.toDate,
        isDate: sampleExpense.date instanceof Date
      });
      
      // Test date conversion
      if (sampleExpense.date && typeof sampleExpense.date === 'object' && sampleExpense.date.toDate) {
        const convertedDate = sampleExpense.date.toDate();
        console.log('FinancialDashboard: Converted date:', convertedDate, typeof convertedDate);
      }
    }
  }, [expenses]);

  // Calculate financial metrics
  const totalAssets = accounts.reduce((sum, account) => sum + account.balance, 0);
  const totalDebts = debts.filter(debt => debt.isDebt).reduce((sum, debt) => sum + debt.amount, 0);
  const totalLoans = debts.filter(debt => !debt.isDebt).reduce((sum, debt) => sum + debt.amount, 0);
  const netWorth = totalAssets - totalDebts + totalLoans;
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remainingBalance = getRemainingBalance();

  // Calculate monthly expenses for the last 6 months
  const getMonthlyExpenses = () => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = month.toISOString().slice(0, 7);
      const monthExpenses = expenses.filter(exp => {
        try {
          // Handle Firebase Timestamp objects
          let expDate;
          if (exp.date && typeof exp.date === 'object' && exp.date.toDate) {
            // This is a Firebase Timestamp
            expDate = exp.date.toDate();
          } else if (exp.date instanceof Date) {
            // This is already a Date object
            expDate = exp.date;
          } else {
            // Try to create a Date from string or timestamp
            expDate = new Date(exp.date || Date.now());
          }
          
          if (isNaN(expDate.getTime())) {
            console.warn('Invalid date for expense:', exp);
            return false;
          }
          return expDate.toISOString().slice(0, 7) === monthKey;
        } catch (error) {
          console.error('Error processing expense date:', exp, error);
          return false;
        }
      });
      
      months.push({
        month: month.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        expenses: monthExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0),
        count: monthExpenses.length
      });
    }
    
    return months;
  };

  // Calculate expenses by category for current month
  const getCurrentMonthExpensesByCategory = () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const currentMonthExpenses = expenses.filter(exp => {
      try {
        // Handle Firebase Timestamp objects
        let expDate;
        if (exp.date && typeof exp.date === 'object' && exp.date.toDate) {
          // This is a Firebase Timestamp
          expDate = exp.date.toDate();
        } else if (exp.date instanceof Date) {
          // This is already a Date object
          expDate = exp.date;
        } else {
          // Try to create a Date from string or timestamp
          expDate = new Date(exp.date || Date.now());
        }
        
        if (isNaN(expDate.getTime())) {
          console.warn('Invalid date for expense:', exp);
          return false;
        }
        return expDate.toISOString().slice(0, 7) === currentMonth;
      } catch (error) {
        console.error('Error processing expense date:', exp, error);
        return false;
      }
    });
    
    const categoryData = {};
    currentMonthExpenses.forEach(expense => {
      if (!categoryData[expense.category]) {
        categoryData[expense.category] = 0;
      }
      categoryData[expense.category] += expense.amount || 0;
    });
    
    return Object.entries(categoryData).map(([category, amount], index) => ({
      category,
      amount,
      color: categoryColors[category] || `hsl(${index * 60}, 70%, 60%)`
    }));
  };

  // Account distribution data for pie chart
  const getAccountDistribution = () => {
    return accounts.map((account, index) => ({
      name: account.name,
      value: account.balance,
      color: `hsl(${index * 60}, 70%, 60%)`
    }));
  };

  const formatTooltip = (value, name) => {
    return [formatCurrency(value), name];
  };

  const handlePopulateSampleData = async () => {
    console.log('Button clicked!');
    console.log('User:', currentUser);
    
    if (!currentUser) {
      console.log('No user found, returning early');
      alert('Please log in to use this feature');
      return;
    }
    
    console.log('Starting to populate sample data for user:', currentUser.uid);
    setIsPopulating(true);
    try {
      const result = await populateSampleData(currentUser.uid);
      console.log('Sample data populated successfully:', result);
      alert(`Sample data added successfully!\n- ${result.categories} categories\n- ${result.accounts} accounts\n- ${result.debts} debts\n- ${result.expenses} expenses`);
      // Refresh the page to show new data
      window.location.reload();
    } catch (error) {
      console.error('Error populating sample data:', error);
      alert('Error adding sample data. Please try again.');
    } finally {
      setIsPopulating(false);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Top Full-Width Container - Financial Planning & Charts */}
      <div className={styles.topFullWidthContainer}>
        <div className={styles.floatingCard}>
          {/* Header with Budget Input */}
          <div className={styles.dashboardHeader}>
            <div className={styles.budgetSection}>
              <label className={styles.label}>Total Budget</label>
              <input
                type="number"
                value={total}
                onChange={(e) => setTotal(parseFloat(e.target.value) || 0)}
                className={`${styles.input} ${styles.nameInput}`}
                placeholder="Enter your total budget"
                min="0"
                step="0.01"
              />
            </div>
            
            <div className={styles.balanceCard}>
              <div className={styles.balanceLabel}>Unallocated Amount</div>
              <div className={`${styles.balanceAmount} ${remainingBalance < 0 ? styles.negativeBalance : ''}`}>
                {formatCurrency(remainingBalance)}
              </div>
            </div>

            <button
              onClick={handlePopulateSampleData}
              className={styles.populateButton}
              disabled={isPopulating}
            >
              <Database size={16} />
              {isPopulating ? 'Adding Sample Data...' : 'Populate Sample Data'}
            </button>
          </div>

          {/* Financial Overview Cards */}
          <div className={styles.overviewCards}>
            <div className={styles.overviewCard}>
              <div className={styles.overviewCardHeader}>
                <DollarSign size={20} />
                <span>Net Worth</span>
              </div>
              <div className={styles.overviewCardValue}>
                {formatCurrency(netWorth)}
              </div>
            </div>

            <div className={styles.overviewCard}>
              <div className={styles.overviewCardHeader}>
                <TrendingUp size={20} />
                <span>Total Assets</span>
              </div>
              <div className={styles.overviewCardValue}>
                {formatCurrency(totalAssets)}
              </div>
            </div>

            <div className={styles.overviewCard}>
              <div className={styles.overviewCardHeader}>
                <TrendingDown size={20} />
                <span>Total Debts</span>
              </div>
              <div className={styles.overviewCardValue}>
                {formatCurrency(totalDebts)}
              </div>
            </div>

            <div className={styles.overviewCard}>
              <div className={styles.overviewCardHeader}>
                <BarChart3 size={20} />
                <span>Total Expenses</span>
              </div>
              <div className={styles.overviewCardValue}>
                {formatCurrency(totalExpenses)}
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className={styles.chartsSection}>
            <div className={styles.chartGrid}>
              {/* Monthly Expenses Trend */}
              <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}>Monthly Expenses Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={getMonthlyExpenses()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={formatTooltip} />
                    <Area 
                      type="monotone" 
                      dataKey="expenses" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Account Distribution */}
              <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}>Account Balance Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={getAccountDistribution()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {getAccountDistribution().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={formatTooltip} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Current Month Expenses by Category */}
              <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}>Current Month Expenses by Category</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={getCurrentMonthExpensesByCategory()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={formatTooltip} />
                    <Bar dataKey="amount" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Net Worth Components */}
              <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}>Net Worth Breakdown</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { component: 'Assets', value: totalAssets, color: '#82ca9d' },
                    { component: 'Loans', value: totalLoans, color: '#ffc658' },
                    { component: 'Debts', value: -totalDebts, color: '#ff7300' }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="component" />
                    <YAxis tickFormatter={(value) => formatCurrency(Math.abs(value))} />
                    <Tooltip formatter={formatTooltip} />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Two-Column Layout */}
      <div className={styles.bottomTwoColumnContainer}>
        {/* Left Container - Accounts & Debts */}
        <div className={styles.leftFloatingContainer}>
          <div className={styles.floatingCard}>
            {/* Accounts Management */}
            <div className={styles.overviewCard}>
              <div className={styles.overviewCardHeader}>
                <h3>Accounts</h3>
                <button
                  onClick={() => setShowAccountForm(true)}
                  className={styles.addButton}
                >
                  <Plus size={16} />
                  Add Account
                </button>
              </div>

              {showAccountForm && (
                <AccountForm
                  onAddAccount={(data) => {
                    onAddAccount(data);
                    setShowAccountForm(false);
                    setEditingAccount(null);
                  }}
                  onCancel={() => {
                    setShowAccountForm(false);
                    setEditingAccount(null);
                  }}
                  editingAccount={editingAccount}
                />
              )}

              <div className={styles.accountsList}>
                {accounts.map((account) => (
                  <div key={account.id} className={styles.accountItem}>
                    <div className={styles.accountInfo}>
                      <div className={styles.accountDetails}>
                        <span className={styles.accountName}>{account.name}</span>
                        <span className={styles.accountType}>{account.type}</span>
                      </div>
                      <div className={styles.accountBalance}>
                        {formatCurrency(account.balance)}
                      </div>
                    </div>
                    <div className={styles.accountActions}>
                      <button
                        onClick={() => onEditAccount(account)}
                        className={styles.editButton}
                        title="Edit account"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => onDeleteAccount(account.id)}
                        className={styles.deleteButton}
                        title="Delete account"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Debts & Loans */}
            <div className={styles.overviewCard}>
              <div className={styles.overviewCardHeader}>
                <h3>Debts & Loans</h3>
                <button
                  onClick={() => setShowDebtForm(true)}
                  className={styles.addButton}
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>

              {showDebtForm && (
                <DebtForm
                  onAddDebt={(data) => {
                    onAddDebt(data);
                    setShowDebtForm(false);
                    setEditingDebt(null);
                  }}
                  onCancel={() => {
                    setShowDebtForm(false);
                    setEditingDebt(null);
                  }}
                  editingDebt={editingDebt}
                />
              )}

              <div className={styles.debtsList}>
                {debts.map((debt) => (
                  <div key={debt.id} className={styles.debtItem}>
                    <div className={styles.debtInfo}>
                      <div className={styles.debtDetails}>
                        <span className={styles.debtName}>{debt.name}</span>
                        <span className={styles.debtType}>{debt.type}</span>
                      </div>
                      <div className={styles.debtAmount}>
                        {formatCurrency(debt.amount)}
                      </div>
                    </div>
                    <div className={styles.debtActions}>
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
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Container - Monthly Allocations */}
        <div className={styles.rightFloatingContainer}>
          <div className={styles.floatingCard}>
            <h2 className={styles.allocationTitle}>Monthly Allocations</h2>
            
            {/* Expenses by Category */}
            <div className={styles.sectionCard}>
              <ExpensesByCategory
                expenses={expenses}
                categoryColors={categoryColors}
                onDeleteExpense={onDeleteExpense}
                onAddExpense={onAddExpense}
                categories={categoryNames}
                onAddCategory={onAddCategory}
                onDeleteCategory={onDeleteCategory}
                accounts={accounts}
                debts={debts}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

FinancialDashboard.propTypes = {
  total: PropTypes.number.isRequired,
  expenses: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    date: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]).isRequired,
    createdAt: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]).isRequired,
  })).isRequired,
  accounts: PropTypes.array.isRequired,
  debts: PropTypes.array.isRequired,
  categoryNames: PropTypes.array.isRequired,
  categoryColors: PropTypes.object.isRequired,
  onAddExpense: PropTypes.func.isRequired,
  onDeleteExpense: PropTypes.func.isRequired,
  onAddCategory: PropTypes.func.isRequired,
  onDeleteCategory: PropTypes.func.isRequired,
  onAddAccount: PropTypes.func.isRequired,
  onEditAccount: PropTypes.func.isRequired,
  onDeleteAccount: PropTypes.func.isRequired,
  onAddDebt: PropTypes.func.isRequired,
  onEditDebt: PropTypes.func.isRequired,
  onDeleteDebt: PropTypes.func.isRequired,
  getRemainingBalance: PropTypes.func.isRequired,
  setTotal: PropTypes.func.isRequired
};

export default FinancialDashboard; 