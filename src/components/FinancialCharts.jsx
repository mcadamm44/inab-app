import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { getFinancialReports } from '../firebase/firebaseService';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import styles from '../styles/ExpenseTracker.module.css';

const FinancialCharts = () => {
  const { currentUser } = useAuth();
  const { formatCurrency } = useCurrency();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months');
  const [activeChart, setActiveChart] = useState('netWorth');

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
      
      const data = await getFinancialReports(currentUser.uid, filters);
      setReports(data.sort((a, b) => new Date(a.month) - new Date(b.month)));
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatMonth = (monthString) => {
    const [year, month] = monthString.split('-');
    return new Date(year, month - 1).toLocaleDateString('en-US', { 
      year: '2-digit', 
      month: 'short' 
    });
  };

  const formatTooltip = (value, name) => {
    return [formatCurrency(value), name];
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const renderNetWorthChart = () => {
    const data = reports.map(report => ({
      month: formatMonth(report.month),
      'Net Worth': report.totals.netWorth,
      'Total Assets': report.totals.totalAssets,
      'Total Debts': report.totals.totalDebts,
    }));

    return (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(value) => formatCurrency(value)} />
          <Tooltip formatter={formatTooltip} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="Net Worth" 
            stroke="#8884d8" 
            strokeWidth={3}
            dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="Total Assets" 
            stroke="#82ca9d" 
            strokeWidth={2}
            dot={{ fill: '#82ca9d', strokeWidth: 2, r: 3 }}
          />
          <Line 
            type="monotone" 
            dataKey="Total Debts" 
            stroke="#ff7300" 
            strokeWidth={2}
            dot={{ fill: '#ff7300', strokeWidth: 2, r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const renderMonthlyExpensesChart = () => {
    const data = reports.map(report => ({
      month: formatMonth(report.month),
      'Monthly Expenses': report.totals.monthlyExpenses,
    }));

    return (
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(value) => formatCurrency(value)} />
          <Tooltip formatter={formatTooltip} />
          <Area 
            type="monotone" 
            dataKey="Monthly Expenses" 
            stroke="#8884d8" 
            fill="#8884d8" 
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  const renderAccountBreakdownChart = () => {
    if (reports.length === 0) return null;
    
    const latestReport = reports[reports.length - 1];
    const data = latestReport.accounts.map((account, index) => ({
      name: account.name,
      value: account.balance,
      color: COLORS[index % COLORS.length],
    }));

    return (
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={formatTooltip} />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderExpenseCategoryChart = () => {
    if (reports.length === 0) return null;
    
    const latestReport = reports[reports.length - 1];
    const data = Object.entries(latestReport.expensesByCategory || {}).map(([category, amount], index) => ({
      category,
      amount,
      color: COLORS[index % COLORS.length],
    }));

    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis tickFormatter={(value) => formatCurrency(value)} />
          <Tooltip formatter={formatTooltip} />
          <Bar dataKey="amount" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderAccountHistoryChart = () => {
    if (reports.length === 0) return null;
    
    const accountNames = [...new Set(reports.flatMap(r => r.accounts.map(a => a.name)))];
    const data = reports.map(report => {
      const point = { month: formatMonth(report.month) };
      accountNames.forEach(name => {
        const account = report.accounts.find(a => a.name === name);
        point[name] = account ? account.balance : 0;
      });
      return point;
    });

    return (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(value) => formatCurrency(value)} />
          <Tooltip formatter={formatTooltip} />
          <Legend />
          {accountNames.map((name, index) => (
            <Line
              key={name}
              type="monotone"
              dataKey={name}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              dot={{ fill: COLORS[index % COLORS.length], strokeWidth: 2, r: 3 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className={styles.financialCharts}>
      <div className={styles.chartsHeader}>
        <h2 className={styles.chartsTitle}>Financial Analytics</h2>
        <div className={styles.chartsControls}>
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
      </div>

      <div className={styles.chartTabs}>
        <button
          className={`${styles.chartTab} ${activeChart === 'netWorth' ? styles.active : ''}`}
          onClick={() => setActiveChart('netWorth')}
        >
          <TrendingUp size={16} />
          Net Worth
        </button>
        <button
          className={`${styles.chartTab} ${activeChart === 'expenses' ? styles.active : ''}`}
          onClick={() => setActiveChart('expenses')}
        >
          <BarChart3 size={16} />
          Expenses
        </button>
        <button
          className={`${styles.chartTab} ${activeChart === 'accounts' ? styles.active : ''}`}
          onClick={() => setActiveChart('accounts')}
        >
          <PieChartIcon size={16} />
          Accounts
        </button>
      </div>

      <div className={styles.chartContainer}>
        {loading ? (
          <div className={styles.loading}>Loading charts...</div>
        ) : reports.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateText}>No data available for charts</div>
            <div className={styles.emptyStateSubtext}>Create some financial reports to see your progress visualized</div>
          </div>
        ) : (
          <div className={styles.chartContent}>
            {activeChart === 'netWorth' && renderNetWorthChart()}
            {activeChart === 'expenses' && (
              <div className={styles.chartGrid}>
                <div className={styles.chartItem}>
                  <h3>Monthly Expenses Trend</h3>
                  {renderMonthlyExpensesChart()}
                </div>
                <div className={styles.chartItem}>
                  <h3>Expense Categories</h3>
                  {renderExpenseCategoryChart()}
                </div>
              </div>
            )}
            {activeChart === 'accounts' && (
              <div className={styles.chartGrid}>
                <div className={styles.chartItem}>
                  <h3>Account Balance Distribution</h3>
                  {renderAccountBreakdownChart()}
                </div>
                <div className={styles.chartItem}>
                  <h3>Account Balance History</h3>
                  {renderAccountHistoryChart()}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialCharts; 