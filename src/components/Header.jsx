// src/components/Header.jsx
import PropTypes from "prop-types";
import { useState } from "react";
import { Save, LogOut, User, AlertTriangle, MoreVertical, FileText, DollarSign } from "lucide-react";
import { useCurrency } from "../context/CurrencyContext.jsx";
import CurrencySelector from "./CurrencySelector";
import ThemeSelector from "./ThemeSelector";
import styles from "../styles/ExpenseTracker.module.css";

const Header = ({ currentUser, onToggleSidebar, onSave, onLogout }) => {
  const { getCurrencySymbol } = useCurrency();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setShowMenu(false);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    onLogout();
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleMenuClick = (action) => {
    setShowMenu(false);
    if (action === 'reports') {
      onToggleSidebar();
    } else if (action === 'save') {
      onSave();
    } else if (action === 'logout') {
      handleLogoutClick();
    }
  };

  return (
    <>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>
            iNab ({getCurrencySymbol()})
          </h1>
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
          <ThemeSelector />
          
          {/* Menu Button */}
          <div className={styles.menuContainer}>
            <button
              onClick={handleMenuToggle}
              className={styles.menuButton}
              title="Menu"
            >
              <MoreVertical size={20} />
            </button>
            
            {showMenu && (
              <>
                <div className={styles.menuBackdrop} onClick={() => setShowMenu(false)} />
                <div className={styles.menuDropdown}>
                  <button
                    onClick={() => handleMenuClick('reports')}
                    className={styles.menuItem}
                  >
                    <FileText size={16} />
                    <span>Financial Reports</span>
                  </button>
                  <button
                    onClick={() => handleMenuClick('save')}
                    className={styles.menuItem}
                  >
                    <Save size={16} />
                    <span>Save Report</span>
                  </button>
                  <div className={styles.menuDivider} />
                  <div className={styles.menuItem}>
                    <DollarSign size={16} />
                    <span>Currency</span>
                    <div className={styles.currencySelectorWrapper}>
                      <CurrencySelector />
                    </div>
                  </div>
                  <div className={styles.menuDivider} />
                  <button
                    onClick={() => handleMenuClick('logout')}
                    className={`${styles.menuItem} ${styles.menuItemDanger}`}
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <AlertTriangle size={24} className={styles.modalIcon} />
              <h3 className={styles.modalTitle}>Confirm Logout</h3>
            </div>
            <div className={styles.modalContent}>
              <p>Are you sure you want to log out? Any unsaved changes will be lost.</p>
            </div>
            <div className={styles.modalActions}>
              <button
                onClick={handleCancelLogout}
                className={styles.modalButtonSecondary}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className={styles.modalButtonPrimary}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

Header.propTypes = {
  currentUser: PropTypes.object,
  onToggleSidebar: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Header;
