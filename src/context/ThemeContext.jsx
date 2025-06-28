import { createContext, useContext, useEffect, useState } from 'react';
import { useTheme as useNextTheme } from 'next-themes';
import PropTypes from 'prop-types';

const ThemeContext = createContext();

// Pre-built themes from next-themes
export const themes = {
  light: {
    name: 'Light',
    colors: {
      primary: '#3b82f6',
      primaryHover: '#2563eb',
      secondary: '#8b5cf6',
      secondaryHover: '#7c3aed',
      success: '#10b981',
      successHover: '#059669',
      warning: '#f59e0b',
      warningHover: '#d97706',
      danger: '#ef4444',
      dangerHover: '#dc2626',
      info: '#06b6d4',
      infoHover: '#0891b2',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: '#e2e8f0',
      borderHover: '#d1d5db',
      shadow: 'rgba(0, 0, 0, 0.1)',
      shadowHover: 'rgba(0, 0, 0, 0.15)',
    }
  },
  dark: {
    name: 'Dark',
    colors: {
      primary: '#3b82f6',
      primaryHover: '#2563eb',
      secondary: '#8b5cf6',
      secondaryHover: '#7c3aed',
      success: '#10b981',
      successHover: '#059669',
      warning: '#f59e0b',
      warningHover: '#d97706',
      danger: '#ef4444',
      dangerHover: '#dc2626',
      info: '#06b6d4',
      infoHover: '#0891b2',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      border: '#334155',
      borderHover: '#475569',
      shadow: 'rgba(0, 0, 0, 0.3)',
      shadowHover: 'rgba(0, 0, 0, 0.4)',
    }
  },
  pastel: {
    name: 'Pastel',
    colors: {
      primary: '#A7C7E7',
      primaryHover: '#93C5FD',
      secondary: '#C8A2C8',
      secondaryHover: '#C084FC',
      success: '#A7F3D0',
      successHover: '#86EFAC',
      warning: '#FED7AA',
      warningHover: '#FDBA74',
      danger: '#FECACA',
      dangerHover: '#F87171',
      info: '#BFDBFE',
      infoHover: '#93C5FD',
      background: '#f8fafc',
      surface: '#ffffff',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: '#e2e8f0',
      borderHover: '#d1d5db',
      shadow: 'rgba(0, 0, 0, 0.1)',
      shadowHover: 'rgba(0, 0, 0, 0.15)',
    }
  },
  warm: {
    name: 'Warm',
    colors: {
      primary: '#f97316',
      primaryHover: '#ea580c',
      secondary: '#f59e0b',
      secondaryHover: '#d97706',
      success: '#22c55e',
      successHover: '#16a34a',
      warning: '#eab308',
      warningHover: '#ca8a04',
      danger: '#ef4444',
      dangerHover: '#dc2626',
      info: '#06b6d4',
      infoHover: '#0891b2',
      background: '#fef7ed',
      surface: '#ffffff',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: '#fed7aa',
      borderHover: '#fdba74',
      shadow: 'rgba(249, 115, 22, 0.1)',
      shadowHover: 'rgba(249, 115, 22, 0.15)',
    }
  },
  cool: {
    name: 'Cool',
    colors: {
      primary: '#06b6d4',
      primaryHover: '#0891b2',
      secondary: '#8b5cf6',
      secondaryHover: '#7c3aed',
      success: '#10b981',
      successHover: '#059669',
      warning: '#f59e0b',
      warningHover: '#d97706',
      danger: '#ef4444',
      dangerHover: '#dc2626',
      info: '#3b82f6',
      infoHover: '#2563eb',
      background: '#f0f9ff',
      surface: '#ffffff',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: '#bae6fd',
      borderHover: '#93c5fd',
      shadow: 'rgba(6, 182, 212, 0.1)',
      shadowHover: 'rgba(6, 182, 212, 0.15)',
    }
  },
  highContrast: {
    name: 'High Contrast',
    colors: {
      primary: '#000000',
      primaryHover: '#333333',
      secondary: '#666666',
      secondaryHover: '#999999',
      success: '#00ff00',
      successHover: '#00cc00',
      warning: '#ffff00',
      warningHover: '#cccc00',
      danger: '#ff0000',
      dangerHover: '#cc0000',
      info: '#0000ff',
      infoHover: '#0000cc',
      background: '#ffffff',
      surface: '#f0f0f0',
      text: '#000000',
      textSecondary: '#333333',
      border: '#000000',
      borderHover: '#666666',
      shadow: 'rgba(0, 0, 0, 0.3)',
      shadowHover: 'rgba(0, 0, 0, 0.5)',
    }
  },
  ocean: {
    name: 'Ocean',
    colors: {
      primary: '#0ea5e9',
      primaryHover: '#0284c7',
      secondary: '#6366f1',
      secondaryHover: '#4f46e5',
      success: '#10b981',
      successHover: '#059669',
      warning: '#f59e0b',
      warningHover: '#d97706',
      danger: '#ef4444',
      dangerHover: '#dc2626',
      info: '#06b6d4',
      infoHover: '#0891b2',
      background: '#f0f9ff',
      surface: '#ffffff',
      text: '#0f172a',
      textSecondary: '#475569',
      border: '#0ea5e9',
      borderHover: '#0284c7',
      shadow: 'rgba(14, 165, 233, 0.1)',
      shadowHover: 'rgba(14, 165, 233, 0.2)',
    }
  },
  forest: {
    name: 'Forest',
    colors: {
      primary: '#16a34a',
      primaryHover: '#15803d',
      secondary: '#84cc16',
      secondaryHover: '#65a30d',
      success: '#22c55e',
      successHover: '#16a34a',
      warning: '#eab308',
      warningHover: '#ca8a04',
      danger: '#ef4444',
      dangerHover: '#dc2626',
      info: '#06b6d4',
      infoHover: '#0891b2',
      background: '#f0fdf4',
      surface: '#ffffff',
      text: '#14532d',
      textSecondary: '#166534',
      border: '#16a34a',
      borderHover: '#15803d',
      shadow: 'rgba(22, 163, 74, 0.1)',
      shadowHover: 'rgba(22, 163, 74, 0.2)',
    }
  },
  sunset: {
    name: 'Sunset',
    colors: {
      primary: '#f97316',
      primaryHover: '#ea580c',
      secondary: '#ec4899',
      secondaryHover: '#db2777',
      success: '#10b981',
      successHover: '#059669',
      warning: '#f59e0b',
      warningHover: '#d97706',
      danger: '#ef4444',
      dangerHover: '#dc2626',
      info: '#06b6d4',
      infoHover: '#0891b2',
      background: '#fef7ed',
      surface: '#ffffff',
      text: '#7c2d12',
      textSecondary: '#92400e',
      border: '#fed7aa',
      borderHover: '#fdba74',
      shadow: 'rgba(249, 115, 22, 0.1)',
      shadowHover: 'rgba(249, 115, 22, 0.2)',
    }
  },
  system: {
    name: 'System',
    colors: {
      primary: '#3b82f6',
      primaryHover: '#2563eb',
      secondary: '#8b5cf6',
      secondaryHover: '#7c3aed',
      success: '#10b981',
      successHover: '#059669',
      warning: '#f59e0b',
      warningHover: '#d97706',
      danger: '#ef4444',
      dangerHover: '#dc2626',
      info: '#06b6d4',
      infoHover: '#0891b2',
      background: 'var(--next-themes-background)',
      surface: 'var(--next-themes-surface)',
      text: 'var(--next-themes-text)',
      textSecondary: 'var(--next-themes-text-secondary)',
      border: 'var(--next-themes-border)',
      borderHover: 'var(--next-themes-border-hover)',
      shadow: 'var(--next-themes-shadow)',
      shadowHover: 'var(--next-themes-shadow-hover)',
    }
  }
};

export const ThemeProvider = ({ children }) => {
  const { theme, setTheme, systemTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const currentTheme = theme === 'system' ? systemTheme : theme;
    const themeData = themes[currentTheme] || themes.light;
    
    Object.entries(themeData.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  }, [theme, systemTheme, mounted]);

  const changeTheme = (themeName) => {
    setTheme(themeName);
  };

  const value = {
    currentTheme: theme,
    theme: themes[theme === 'system' ? systemTheme : theme] || themes.light,
    changeTheme,
    themes: {
      light: themes.light,
      dark: themes.dark,
      pastel: themes.pastel,
      warm: themes.warm,
      cool: themes.cool,
      highContrast: themes.highContrast,
      ocean: themes.ocean,
      forest: themes.forest,
      sunset: themes.sunset,
      system: themes.system
    },
    mounted
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 