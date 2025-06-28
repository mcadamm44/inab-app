// src/components/Sidebar.jsx
import PropTypes from "prop-types";
import { X, FileText, Trash2 } from "lucide-react";
import styles from "../styles/ExpenseTracker.module.css";

const Sidebar = ({
  isOpen,
  onClose,
  reports,
  onLoadReport,
  onDeleteReport,
}) => {
  const formatDate = (date) => {
    if (!date) return "Unknown date";
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString();
  };

  const formatReportName = (report) => {
    if (report.name) return report.name;
    if (report.month) {
      const [year, month] = report.month.split('-');
      return `${new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Report`;
    }
    return "Unnamed Report";
  };

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      <div className={styles.sidebarHeader}>
        <h2>Financial Reports</h2>
        <button onClick={onClose} className={styles.closeButton}>
          <X size={20} />
        </button>
      </div>

      <div className={styles.sidebarContent}>
        {reports.length === 0 ? (
          <p className={styles.emptyReports}>No saved reports yet</p>
        ) : (
          <ul className={styles.reportsList}>
            {reports.map((report) => (
              <li key={report.id} className={styles.reportItem}>
                <div className={styles.reportInfo}>
                  <div className={styles.reportName}>
                    <FileText size={16} />
                    {formatReportName(report)}
                  </div>
                  <div className={styles.reportMeta}>
                    <span className={styles.reportType}>{report.type || 'monthly'}</span>
                    <span className={styles.reportDate}>
                      {formatDate(report.createdAt)}
                    </span>
                  </div>
                  {report.totals && (
                    <div className={styles.reportSummary}>
                      <span>Net Worth: €{report.totals.netWorth?.toFixed(2) || '0.00'}</span>
                    </div>
                  )}
                </div>
                <div className={styles.reportActions}>
                  <button
                    onClick={() => onLoadReport(report)}
                    className={styles.loadReportButton}
                    title="Load report"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => onDeleteReport(report.id)}
                    className={styles.deleteReportButton}
                    title="Delete report"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  reports: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string,
      month: PropTypes.string,
      type: PropTypes.string,
      createdAt: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
      totals: PropTypes.shape({
        netWorth: PropTypes.number,
      }),
    })
  ).isRequired,
  onLoadReport: PropTypes.func.isRequired,
  onDeleteReport: PropTypes.func.isRequired,
};

export default Sidebar;
