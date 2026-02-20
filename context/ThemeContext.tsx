import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'grace' | 'eden' | 'midnight' | 'vespers';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('cba-theme');
    return (saved as Theme) || 'grace';
  });

  useEffect(() => {
    const root = document.documentElement;
    // Remove all previous theme attributes
    root.removeAttribute('data-theme');
    
    // Set new theme if not default
    if (theme !== 'grace') {
      root.setAttribute('data-theme', theme);
    }
    
    localStorage.setItem('cba-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};