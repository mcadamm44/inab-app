import { useState } from "react";
import PropTypes from "prop-types";
import { ChevronDown, Globe } from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";
import styles from "../styles/ExpenseTracker.module.css";

const CurrencySelector = ({ className = "" }) => {
  const { currentCurrency, setCurrentCurrency, getSupportedCurrencies, getCurrencySymbol } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  const currencies = getSupportedCurrencies();

  const handleCurrencyChange = (currencyCode) => {
    setCurrentCurrency(currencyCode);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`${styles.currencySelector} ${className}`}>
      <button
        onClick={toggleDropdown}
        className={styles.currencyButton}
        aria-label="Select currency"
      >
        <Globe size={16} />
        <span className={styles.currencyCode}>{currentCurrency}</span>
        <span className={styles.currencySymbol}>{getCurrencySymbol()}</span>
        <ChevronDown size={16} className={`${styles.chevron} ${isOpen ? styles.rotated : ""}`} />
      </button>

      {isOpen && (
        <div className={styles.currencyDropdown}>
          {currencies.map((currency) => (
            <button
              key={currency.code}
              onClick={() => handleCurrencyChange(currency.code)}
              className={`${styles.currencyOption} ${
                currentCurrency === currency.code ? styles.selected : ""
              }`}
            >
              <span className={styles.currencySymbol}>{currency.symbol}</span>
              <span className={styles.currencyName}>{currency.name}</span>
              <span className={styles.currencyCode}>{currency.code}</span>
            </button>
          ))}
        </div>
      )}

      {/* Backdrop to close dropdown when clicking outside */}
      {isOpen && (
        <div
          className={styles.backdrop}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

CurrencySelector.propTypes = {
  className: PropTypes.string,
};

export default CurrencySelector; 