import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Palette } from 'lucide-react';
import PropTypes from 'prop-types';
import styles from '../styles/ThemeSelector.module.css';

const ThemeSelector = ({ className }) => {
  const { currentTheme, changeTheme, themes, mounted } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeChange = (themeName) => {
    changeTheme(themeName);
    setIsOpen(false);
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  const currentThemeData = themes[currentTheme] || themes.light;

  return (
    <div className={`${styles.themeSelector} ${className || ''}`}>
      <button
        className={styles.themeButton}
        onClick={() => setIsOpen(!isOpen)}
        title="Change theme"
      >
        <Palette size={16} />
        <span className={styles.themeName}>{currentThemeData.name}</span>
      </button>

      {isOpen && (
        <>
          <div className={styles.backdrop} onClick={() => setIsOpen(false)} />
          <div className={styles.themeDropdown}>
            <div className={styles.themeDropdownHeader}>
              <h4>Choose Theme</h4>
            </div>
            <div className={styles.themeOptions}>
              {Object.entries(themes).map(([key, theme]) => (
                <button
                  key={key}
                  className={`${styles.themeOption} ${key === currentTheme ? styles.active : ''}`}
                  onClick={() => handleThemeChange(key)}
                >
                  <div className={styles.themePreview}>
                    <div 
                      className={styles.colorSwatch}
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <div 
                      className={styles.colorSwatch}
                      style={{ backgroundColor: theme.colors.secondary }}
                    />
                    <div 
                      className={styles.colorSwatch}
                      style={{ backgroundColor: theme.colors.success }}
                    />
                    <div 
                      className={styles.colorSwatch}
                      style={{ backgroundColor: theme.colors.danger }}
                    />
                  </div>
                  <span className={styles.themeOptionName}>{theme.name}</span>
                  {key === currentTheme && (
                    <div className={styles.activeIndicator}>✓</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

ThemeSelector.propTypes = {
  className: PropTypes.string,
};

export default ThemeSelector; 