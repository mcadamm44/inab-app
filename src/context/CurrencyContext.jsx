import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};

// Supported currencies with their symbols and formatting options
export const SUPPORTED_CURRENCIES = {
  EUR: {
    symbol: "€",
    name: "Euro",
    code: "EUR",
    locale: "de-DE",
    position: "before"
  },
  USD: {
    symbol: "$",
    name: "US Dollar",
    code: "USD",
    locale: "en-US",
    position: "before"
  },
  GBP: {
    symbol: "£",
    name: "British Pound",
    code: "GBP",
    locale: "en-GB",
    position: "before"
  },
  JPY: {
    symbol: "¥",
    name: "Japanese Yen",
    code: "JPY",
    locale: "ja-JP",
    position: "before"
  },
  CAD: {
    symbol: "C$",
    name: "Canadian Dollar",
    code: "CAD",
    locale: "en-CA",
    position: "before"
  },
  AUD: {
    symbol: "A$",
    name: "Australian Dollar",
    code: "AUD",
    locale: "en-AU",
    position: "before"
  },
  CHF: {
    symbol: "CHF",
    name: "Swiss Franc",
    code: "CHF",
    locale: "de-CH",
    position: "after"
  },
  CNY: {
    symbol: "¥",
    name: "Chinese Yuan",
    code: "CNY",
    locale: "zh-CN",
    position: "before"
  }
};

export const CurrencyProvider = ({ children }) => {
  const [currentCurrency, setCurrentCurrency] = useState("EUR");

  // Format currency amount
  const formatCurrency = (amount, currency = currentCurrency) => {
    const currencyInfo = SUPPORTED_CURRENCIES[currency];
    if (!currencyInfo) return `${amount}`;

    try {
      return new Intl.NumberFormat(currencyInfo.locale, {
        style: 'currency',
        currency: currencyInfo.code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } catch {
      // Fallback formatting
      return `${currencyInfo.symbol}${amount.toFixed(2)}`;
    }
  };

  // Get currency symbol
  const getCurrencySymbol = (currency = currentCurrency) => {
    return SUPPORTED_CURRENCIES[currency]?.symbol || "€";
  };

  // Get currency name
  const getCurrencyName = (currency = currentCurrency) => {
    return SUPPORTED_CURRENCIES[currency]?.name || "Euro";
  };

  // Get all supported currencies
  const getSupportedCurrencies = () => {
    return Object.entries(SUPPORTED_CURRENCIES).map(([code, info]) => ({
      code,
      name: info.name,
      symbol: info.symbol
    }));
  };

  const value = {
    currentCurrency,
    setCurrentCurrency,
    formatCurrency,
    getCurrencySymbol,
    getCurrencyName,
    getSupportedCurrencies,
    SUPPORTED_CURRENCIES
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

CurrencyProvider.propTypes = {
  children: PropTypes.node.isRequired,
}; 