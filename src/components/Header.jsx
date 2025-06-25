// src/components/Header.jsx
import PropTypes from "prop-types";
import { Menu, Save, LogOut, User } from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";
import CurrencySelector from "./CurrencySelector";
import styles from "../styles/ExpenseTracker.module.css";

const Header = ({ currentUser, onToggleSidebar, onSave, onLogout }) => {
  const { getCurrencySymbol } = useCurrency();

  return (
    <div className={styles.header}>
      <div className={styles.titleContainer}>
        <button onClick={onToggleSidebar} className={styles.menuButton}>
          <Menu size={20} />
        </button>
        <h1 className={styles.title}>
          Expense Tracker ({getCurrencySymbol()})
        </h1>
      </div>
      <div className={styles.actions}>
        <CurrencySelector className={styles.headerCurrencySelector} />
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

Header.propTypes = {
  currentUser: PropTypes.object,
  onToggleSidebar: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Header;
