import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number; // Exchange rate relative to USD
  position: 'before' | 'after'; // Symbol position
  decimals: number;
  country?: string;
  flag?: string;
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    rate: 1,
    position: 'before',
    decimals: 2,
    country: 'United States',
    flag: '🇺🇸'
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    rate: 0.85,
    position: 'before',
    decimals: 2,
    country: 'Eurozone',
    flag: '🇪🇺'
  },
  {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    rate: 0.73,
    position: 'before',
    decimals: 2,
    country: 'United Kingdom',
    flag: '🇬🇧'
  },
  {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    rate: 110,
    position: 'before',
    decimals: 0,
    country: 'Japan',
    flag: '🇯🇵'
  },
  {
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: 'C$',
    rate: 1.25,
    position: 'before',
    decimals: 2,
    country: 'Canada',
    flag: '🇨🇦'
  },
  {
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: 'A$',
    rate: 1.35,
    position: 'before',
    decimals: 2,
    country: 'Australia',
    flag: '🇦🇺'
  },
  {
    code: 'CHF',
    name: 'Swiss Franc',
    symbol: 'CHF',
    rate: 0.92,
    position: 'before',
    decimals: 2,
    country: 'Switzerland',
    flag: '🇨🇭'
  },
  {
    code: 'CNY',
    name: 'Chinese Yuan',
    symbol: '¥',
    rate: 6.4,
    position: 'before',
    decimals: 2,
    country: 'China',
    flag: '🇨🇳'
  },
  {
    code: 'NGN',
    name: 'Nigerian Naira',
    symbol: '₦',
    rate: 411,
    position: 'before',
    decimals: 2,
    country: 'Nigeria',
    flag: '🇳🇬'
  },
  {
    code: 'ZAR',
    name: 'South African Rand',
    symbol: 'R',
    rate: 14.5,
    position: 'before',
    decimals: 2,
    country: 'South Africa',
    flag: '🇿🇦'
  },
  {
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
    rate: 74,
    position: 'before',
    decimals: 2,
    country: 'India',
    flag: '🇮🇳'
  },
  {
    code: 'BRL',
    name: 'Brazilian Real',
    symbol: 'R$',
    rate: 5.2,
    position: 'before',
    decimals: 2,
    country: 'Brazil',
    flag: '🇧🇷'
  }
];

interface CurrencyContextType {
  currentCurrency: Currency;
  currencies: Currency[];
  loading: boolean;
  formatPrice: (amount: number, options?: {
    showCurrency?: boolean;
    showDecimals?: boolean;
    compact?: boolean;
  }) => string;
  convertPrice: (amount: number, fromCurrency?: string, toCurrency?: string) => number;
  setCurrency: (currencyCode: string) => Promise<void>;
  updateExchangeRates: () => Promise<void>;
  getConvertedPrice: (amount: number, fromCurrency?: string) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  // Default to NGN (Nigerian Naira) instead of USD
  const ngnCurrency = SUPPORTED_CURRENCIES.find(c => c.code === 'NGN') || SUPPORTED_CURRENCIES[0];
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(ngnCurrency);
  const [currencies, setCurrencies] = useState<Currency[]>(SUPPORTED_CURRENCIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCurrencySettings();
  }, []);

  const loadCurrencySettings = async () => {
    try {
      setLoading(true);
      
      // Try to load admin settings for default currency
      const { data: settings, error } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', 'default_currency')
        .single();

      if (!error && settings) {
        const savedCurrencyCode = settings.setting_value;
        const savedCurrency = currencies.find(c => c.code === savedCurrencyCode);
        if (savedCurrency) {
          setCurrentCurrency(savedCurrency);
        }
      } else {
        // Fallback to localStorage for user preference
        const savedCurrency = localStorage.getItem('selectedCurrency');
        if (savedCurrency) {
          const currency = currencies.find(c => c.code === savedCurrency);
          if (currency) {
            setCurrentCurrency(currency);
          }
        }
      }

      // Load exchange rates if available
      const { data: rates } = await supabase
        .from('exchange_rates')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1);

      if (rates && rates.length > 0) {
        const rateData = rates[0].rates as Record<string, number>;
        const updatedCurrencies = currencies.map(currency => ({
          ...currency,
          rate: rateData[currency.code] || currency.rate
        }));
        setCurrencies(updatedCurrencies);
      }

    } catch (error) {
      console.error('Error loading currency settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (
    amount: number, 
    options: {
      showCurrency?: boolean;
      showDecimals?: boolean;
      compact?: boolean;
    } = {}
  ): string => {
    const {
      showCurrency = true,
      showDecimals = true,
      compact = false
    } = options;

    if (typeof amount !== 'number' || isNaN(amount)) {
      return showCurrency ? `${currentCurrency.symbol}0` : '0';
    }

    const convertedAmount = convertPrice(amount, 'USD', currentCurrency.code);
    
    // Handle compact notation for large numbers
    if (compact && convertedAmount >= 1000000) {
      const millions = convertedAmount / 1000000;
      const formatted = millions.toFixed(millions >= 10 ? 1 : 2);
      return showCurrency 
        ? `${currentCurrency.symbol}${formatted}M`
        : `${formatted}M`;
    } else if (compact && convertedAmount >= 1000) {
      const thousands = convertedAmount / 1000;
      const formatted = thousands.toFixed(thousands >= 10 ? 0 : 1);
      return showCurrency 
        ? `${currentCurrency.symbol}${formatted}K`
        : `${formatted}K`;
    }

    // Standard formatting
    const decimals = showDecimals ? currentCurrency.decimals : 0;
    const formattedAmount = convertedAmount.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });

    if (!showCurrency) {
      return formattedAmount;
    }

    return currentCurrency.position === 'before' 
      ? `${currentCurrency.symbol}${formattedAmount}`
      : `${formattedAmount}${currentCurrency.symbol}`;
  };

  const convertPrice = (
    amount: number, 
    fromCurrency: string = 'USD', 
    toCurrency: string = currentCurrency.code
  ): number => {
    if (fromCurrency === toCurrency) return amount;

    const fromRate = currencies.find(c => c.code === fromCurrency)?.rate || 1;
    const toRate = currencies.find(c => c.code === toCurrency)?.rate || 1;

    // Convert to USD first, then to target currency
    const usdAmount = amount / fromRate;
    return usdAmount * toRate;
  };

  const getConvertedPrice = (amount: number, fromCurrency: string = 'USD'): number => {
    return convertPrice(amount, fromCurrency, currentCurrency.code);
  };

  const setCurrency = async (currencyCode: string) => {
    const currency = currencies.find(c => c.code === currencyCode);
    if (!currency) return;

    setCurrentCurrency(currency);
    
    // Save to localStorage for user preference
    localStorage.setItem('selectedCurrency', currencyCode);
    
    // If user is admin, also update the system default
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', user.id)
          .single();

        if (profile?.user_type === 'admin') {
          await supabase
            .from('admin_settings')
            .upsert({
              setting_key: 'default_currency',
              setting_value: currencyCode,
              updated_at: new Date().toISOString()
            });
        }
      }
    } catch (error) {
      console.error('Error saving currency preference:', error);
    }
  };

  const updateExchangeRates = async () => {
    try {
      // In a real app, you'd fetch from a currency API like exchangerate-api.io
      // For demo purposes, we'll use mock data with some variation
      const mockRates: Record<string, number> = {
        'USD': 1,
        'EUR': 0.85 + (Math.random() - 0.5) * 0.1,
        'GBP': 0.73 + (Math.random() - 0.5) * 0.05,
        'JPY': 110 + (Math.random() - 0.5) * 10,
        'CAD': 1.25 + (Math.random() - 0.5) * 0.1,
        'AUD': 1.35 + (Math.random() - 0.5) * 0.1,
        'CHF': 0.92 + (Math.random() - 0.5) * 0.05,
        'CNY': 6.4 + (Math.random() - 0.5) * 0.5,
        'NGN': 411 + (Math.random() - 0.5) * 50,
        'ZAR': 14.5 + (Math.random() - 0.5) * 2,
        'INR': 74 + (Math.random() - 0.5) * 5,
        'BRL': 5.2 + (Math.random() - 0.5) * 0.5
      };

      // Save to database
      await supabase
        .from('exchange_rates')
        .insert({
          rates: mockRates,
          updated_at: new Date().toISOString()
        });

      // Update local state
      const updatedCurrencies = currencies.map(currency => ({
        ...currency,
        rate: mockRates[currency.code] || currency.rate
      }));
      setCurrencies(updatedCurrencies);

    } catch (error) {
      console.error('Error updating exchange rates:', error);
    }
  };

  const value: CurrencyContextType = {
    currentCurrency,
    currencies,
    loading,
    formatPrice,
    convertPrice,
    setCurrency,
    updateExchangeRates,
    getConvertedPrice
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
