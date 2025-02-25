// src/components/Header.jsx
import { Menu, Save, LogOut, User } from "lucide-react";
import styles from "../styles/ExpenseTracker.module.css";

const Header = ({ currentUser, onToggleSidebar, onSave, onLogout }) => {
  return (
    <div className={styles.header}>
      <div className={styles.titleContainer}>
        <button onClick={onToggleSidebar} className={styles.menuButton}>
          <Menu size={20} />
        </button>
        <h1 className={styles.title}>Expense Tracker (€)</h1>
      </div>
      <div className={styles.actions}>
        <div className={styles.userInfo}>
          {currentUser && (
            <div className={styles.userEmail}>
              <User size={16} />
              <span>{currentUser.email}</span>
            </div>
          )}
        </div>
        <button
          onClick={onSave}
          className={styles.actionButton}
          title="Save Budget Report"
        >
          <span>
            <Save size={16} />
          </span>
        </button>
        <button
          onClick={onLogout}
          className={styles.actionButton}
          title="Logout"
        >
          <span>
            <LogOut size={16} />
          </span>
        </button>
      </div>
    </div>
  );
};

export default Header;
