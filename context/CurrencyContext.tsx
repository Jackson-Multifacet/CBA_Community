import React, { createContext, useContext, useState, useEffect } from 'react';

export type CurrencyCode = 'USD' | 'NGN' | 'EUR' | 'GBP' | 'CAD';

interface Currency {
  code: CurrencyCode;
  symbol: string;
  rate: number; // Exchange rate relative to USD (Base currency)
}

const CURRENCIES: Record<CurrencyCode, Currency> = {
  USD: { code: 'USD', symbol: '$', rate: 1 },
  NGN: { code: 'NGN', symbol: '₦', rate: 1500 }, // Example rate
  EUR: { code: 'EUR', symbol: '€', rate: 0.92 },
  GBP: { code: 'GBP', symbol: '£', rate: 0.79 },
  CAD: { code: 'CAD', symbol: 'C$', rate: 1.35 },
};

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (code: CurrencyCode) => void;
  formatAmount: (amountInUSD: number) => string;
  convertAmount: (amountInUSD: number) => number;
  availableCurrencies: Currency[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem('cba_currency');
    return (saved as CurrencyCode) || 'USD';
  });

  useEffect(() => {
    localStorage.setItem('cba_currency', currencyCode);
  }, [currencyCode]);

  const currency = CURRENCIES[currencyCode];

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyCode(code);
  };

  const convertAmount = (amountInUSD: number) => {
    return amountInUSD * currency.rate;
  };

  const formatAmount = (amountInUSD: number) => {
    const converted = convertAmount(amountInUSD);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 2,
    }).format(converted);
  };

  return (
    <CurrencyContext.Provider value={{ 
      currency, 
      setCurrency, 
      formatAmount, 
      convertAmount,
      availableCurrencies: Object.values(CURRENCIES) 
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
