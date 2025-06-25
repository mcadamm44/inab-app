// src/components/Sidebar.jsx
import { X, Trash2 } from "lucide-react";
import styles from "../styles/ExpenseTracker.module.css";

const Sidebar = ({
  isOpen,
  onClose,
  reports,
  onLoadReport,
  onDeleteReport,
}) => {
  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      <div className={styles.sidebarHeader}>
        <h2>Reports</h2>
        <button onClick={onClose} className={styles.closeButton}>
          <X size={20} />
        </button>
      </div>

      {reports.length === 0 ? (
        <p className={styles.emptyReports}>No saved reports yet</p>
      ) : (
        <ul className={styles.reportsList}>
          {reports.map((report) => (
            <li key={report.id} className={styles.reportItem}>
              <div className={styles.reportInfo}>
                <p className={styles.reportName}>{report.name}</p>
                <p className={styles.reportDate}>
                  {report.exportDate.toDate().toLocaleDateString()}
                </p>
              </div>
              <div className={styles.reportActions}>
                <button
                  onClick={() => onLoadReport(report)}
                  className={styles.reportButton}
                  title="Load Report"
                >
                  Load
                </button>
                <button
                  onClick={() => onDeleteReport(report.id)}
                  className={styles.reportButton}
                  title="Delete Report"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
