import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { 
  createFinancialReport, 
  getFinancialReports, 
  deleteFinancialReport 
} from '../firebase/firebaseService';
import { Calendar, TrendingUp, TrendingDown, DollarSign, BarChart3, Save, Trash2 } from 'lucide-react';
import styles from '../styles/ExpenseTracker.module.css';

const FinancialPlanning = () => {
  const { currentUser } = useAuth();
  const { formatCurrency } = useCurrency();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (currentUser) {
      loadReports();
    }
  }, [currentUser, selectedTimeframe]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const filters = {};
      const now = new Date();
      
      switch (selectedTimeframe) {
        case '3months':
          filters.startMonth = new Date(now.getFullYear(), now.getMonth() - 3, 1).toISOString().slice(0, 7);
          break;
        case '6months':
          filters.startMonth = new Date(now.getFullYear(), now.getMonth() - 6, 1).toISOString().slice(0, 7);
          break;
        case '1year':
          filters.startMonth = new Date(now.getFullYear() - 1, now.getMonth(), 1).toISOString().slice(0, 7);
          break;
        case 'all':
        default:
          break;
      }
      
      console.log('Loading financial reports with filters:', filters);
      const data = await getFinancialReports(currentUser.uid, filters);
      console.log('Loaded financial reports:', data.length);
      setReports(data.sort((a, b) => new Date(a.month) - new Date(b.month)));
    } catch (error) {
      console.error('Error loading reports:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        userId: currentUser.uid
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReport = async (type = 'monthly') => {
    setLoading(true);
    try {
      await createFinancialReport(currentUser.uid, type);
      await loadReports();
    } catch (error) {
      console.error('Error creating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await deleteFinancialReport(currentUser.uid, reportId);
        await loadReports();
      } catch (error) {
        console.error('Error deleting report:', error);
      }
    }
  };

  const formatMonth = (monthString) => {
    const [year, month] = monthString.split('-');
    return new Date(year, month - 1).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  const getNetWorthChange = (current, previous) => {
    if (!previous) return { change: 0, percentage: 0 };
    const change = current - previous;
    const percentage = previous !== 0 ? (change / previous) * 100 : 0;
    return { change, percentage };
  };

  const renderOverviewTab = () => (
    <div className={styles.financialOverview}>
      <div className={styles.overviewGrid}>
        <div className={styles.overviewCard}>
          <div className={styles.overviewCardHeader}>
            <DollarSign size={20} />
            <span>Net Worth</span>
          </div>
          <div className={styles.overviewCardValue}>
            {reports.length > 0 ? formatCurrency(reports[reports.length - 1].totals.netWorth) : formatCurrency(0)}
          </div>
          {reports.length > 1 && (
            <div className={styles.overviewCardChange}>
              {(() => {
                const { change, percentage } = getNetWorthChange(
                  reports[reports.length - 1].totals.netWorth,
                  reports[reports.length - 2].totals.netWorth
                );
                const isPositive = change >= 0;
                return (
                  <>
                    <span className={`${styles.changeValue} ${isPositive ? styles.positive : styles.negative}`}>
                      {isPositive ? '+' : ''}{formatCurrency(change)}
                    </span>
                    <span className={`${styles.changePercentage} ${isPositive ? styles.positive : styles.negative}`}>
                      {isPositive ? '+' : ''}{percentage.toFixed(1)}%
                    </span>
                  </>
                );
              })()}
            </div>
          )}
        </div>

        <div className={styles.overviewCard}>
          <div className={styles.overviewCardHeader}>
            <TrendingUp size={20} />
            <span>Total Assets</span>
          </div>
          <div className={styles.overviewCardValue}>
            {reports.length > 0 ? formatCurrency(reports[reports.length - 1].totals.totalAssets) : formatCurrency(0)}
          </div>
        </div>

        <div className={styles.overviewCard}>
          <div className={styles.overviewCardHeader}>
            <TrendingDown size={20} />
            <span>Total Debts</span>
          </div>
          <div className={styles.overviewCardValue}>
            {reports.length > 0 ? formatCurrency(reports[reports.length - 1].totals.totalDebts) : formatCurrency(0)}
          </div>
        </div>

        <div className={styles.overviewCard}>
          <div className={styles.overviewCardHeader}>
            <BarChart3 size={20} />
            <span>Monthly Expenses</span>
          </div>
          <div className={styles.overviewCardValue}>
            {reports.length > 0 ? formatCurrency(reports[reports.length - 1].totals.monthlyExpenses) : formatCurrency(0)}
          </div>
        </div>
      </div>

      <div className={styles.reportActions}>
        <button 
          onClick={() => handleCreateReport('monthly')} 
          disabled={loading}
          className={styles.createReportButton}
        >
          <Save size={16} />
          Create Monthly Report
        </button>
        <button 
          onClick={() => handleCreateReport('quarterly')} 
          disabled={loading}
          className={styles.createReportButton}
        >
          <Save size={16} />
          Create Quarterly Report
        </button>
      </div>
    </div>
  );

  const renderHistoryTab = () => (
    <div className={styles.financialHistory}>
      <div className={styles.timeframeSelector}>
        <select 
          value={selectedTimeframe} 
          onChange={(e) => setSelectedTimeframe(e.target.value)}
          className={styles.timeframeSelect}
        >
          <option value="3months">Last 3 Months</option>
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last Year</option>
          <option value="all">All Time</option>
        </select>
      </div>

      <div className={styles.reportsList}>
        {loading ? (
          <div className={styles.loading}>Loading reports...</div>
        ) : reports.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateText}>No financial reports yet</div>
            <div className={styles.emptyStateSubtext}>Create your first monthly report to start tracking your financial progress</div>
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className={styles.reportItem}>
              <div className={styles.reportHeader}>
                <div className={styles.reportMonth}>
                  <Calendar size={16} />
                  {formatMonth(report.month)} - {report.name}
                </div>
                <div className={styles.reportType}>
                  <span className={styles.reportTypeBadge}>{report.type}</span>
                </div>
                <div className={styles.reportActions}>
                  <button
                    onClick={() => handleDeleteReport(report.id)}
                    className={styles.deleteReportButton}
                    title="Delete report"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              
              <div className={styles.reportDetails}>
                <div className={styles.reportMetric}>
                  <span className={styles.metricLabel}>Net Worth:</span>
                  <span className={styles.metricValue}>{formatCurrency(report.totals.netWorth)}</span>
                </div>
                <div className={styles.reportMetric}>
                  <span className={styles.metricLabel}>Assets:</span>
                  <span className={styles.metricValue}>{formatCurrency(report.totals.totalAssets)}</span>
                </div>
                <div className={styles.reportMetric}>
                  <span className={styles.metricLabel}>Debts:</span>
                  <span className={styles.metricValue}>{formatCurrency(report.totals.totalDebts)}</span>
                </div>
                <div className={styles.reportMetric}>
                  <span className={styles.metricLabel}>Monthly Expenses:</span>
                  <span className={styles.metricValue}>{formatCurrency(report.totals.monthlyExpenses)}</span>
                </div>
              </div>

              <div className={styles.reportAccounts}>
                <div className={styles.reportSectionTitle}>Accounts ({report.accounts.length})</div>
                <div className={styles.reportAccountsList}>
                  {report.accounts.map((account) => (
                    <div key={account.id} className={styles.reportAccountItem}>
                      <span className={styles.accountName}>{account.name}</span>
                      <span className={styles.accountBalance}>{formatCurrency(account.balance)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.reportExpenses}>
                <div className={styles.reportSectionTitle}>Expenses by Category</div>
                <div className={styles.reportExpensesList}>
                  {Object.entries(report.expensesByCategory || {}).map(([category, amount]) => (
                    <div key={category} className={styles.reportExpenseItem}>
                      <span className={styles.expenseCategory}>{category}</span>
                      <span className={styles.expenseAmount}>{formatCurrency(amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className={styles.financialPlanning}>
      <div className={styles.planningHeader}>
        <h1 className={styles.planningTitle}>Financial Planning & Reports</h1>
        <p className={styles.planningSubtitle}>
          Track your financial progress over time with comprehensive reports
        </p>
      </div>

      <div className={styles.planningTabs}>
        <button
          className={`${styles.planningTab} ${activeTab === 'overview' ? styles.active : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`${styles.planningTab} ${activeTab === 'history' ? styles.active : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Report History
        </button>
      </div>

      <div className={styles.planningContent}>
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'history' && renderHistoryTab()}
      </div>
    </div>
  );
};

export default FinancialPlanning; 