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
    rate: 0.92,
    position: 'before',
    decimals: 2,
    country: 'Eurozone',
    flag: '🇪🇺'
  },
  {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    rate: 0.79,
    position: 'before',
    decimals: 2,
    country: 'United Kingdom',
    flag: '🇬🇧'
  },
  {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    rate: 147,
    position: 'before',
    decimals: 0,
    country: 'Japan',
    flag: '🇯🇵'
  },
  {
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: 'C$',
    rate: 1.35,
    position: 'before',
    decimals: 2,
    country: 'Canada',
    flag: '🇨🇦'
  },
  {
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: 'A$',
    rate: 1.52,
    position: 'before',
    decimals: 2,
    country: 'Australia',
    flag: '🇦🇺'
  },
  {
    code: 'CHF',
    name: 'Swiss Franc',
    symbol: 'CHF',
    rate: 0.91,
    position: 'before',
    decimals: 2,
    country: 'Switzerland',
    flag: '🇨🇭'
  },
  {
    code: 'CNY',
    name: 'Chinese Yuan',
    symbol: '¥',
    rate: 7.25,
    position: 'before',
    decimals: 2,
    country: 'China',
    flag: '🇨🇳'
  },
  {
    code: 'NGN',
    name: 'Nigerian Naira',
    symbol: '₦',
    rate: 1486, // Updated to current rate
    position: 'before',
    decimals: 2,
    country: 'Nigeria',
    flag: '🇳🇬'
  },
  {
    code: 'ZAR',
    name: 'South African Rand',
    symbol: 'R',
    rate: 18.5,
    position: 'before',
    decimals: 2,
    country: 'South Africa',
    flag: '🇿🇦'
  },
  {
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
    rate: 83,
    position: 'before',
    decimals: 2,
    country: 'India',
    flag: '🇮🇳'
  },
  {
    code: 'BRL',
    name: 'Brazilian Real',
    symbol: 'R$',
    rate: 5.9,
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
    fromCurrency?: string; // Add fromCurrency parameter
  }) => string;
  convertPrice: (amount: number, fromCurrency?: string, toCurrency?: string) => number;
  setCurrency: (currencyCode: string) => Promise<void>;
  updateExchangeRates: () => Promise<void>;
  updateCustomRates: (customRates: Record<string, number>) => Promise<void>; // Add this function
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

  // Add effect to update exchange rates periodically
  useEffect(() => {
    // Update exchange rates on app load
    updateExchangeRates();

    // Set up interval to update exchange rates every 24 hours
    const interval = setInterval(() => {
      updateExchangeRates();
    }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds

    // Clean up interval on component unmount
    return () => clearInterval(interval);
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
      fromCurrency?: string; // Add fromCurrency parameter
    } = {}
  ): string => {
    const {
      showCurrency = true,
      showDecimals = true,
      compact = false,
      fromCurrency // Extract fromCurrency
    } = options;

    if (typeof amount !== 'number' || isNaN(amount)) {
      return showCurrency ? `${currentCurrency.symbol}0` : '0';
    }

    // If fromCurrency is specified, convert from that currency to current currency
    // Otherwise, if amount is likely already in the target currency, don't convert
    let convertedAmount = amount;
    if (fromCurrency && fromCurrency !== currentCurrency.code) {
      convertedAmount = convertPrice(amount, fromCurrency, currentCurrency.code);
    } else if (!fromCurrency) {
      // If no fromCurrency specified, assume the amount is in the current currency
      // This prevents double conversion of already converted amounts
      convertedAmount = amount;
    } else {
      // fromCurrency === currentCurrency.code, no conversion needed
      convertedAmount = amount;
    }

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
          const { data: existingSettings } = await supabase
            .from('admin_settings')
            .select('*')
            .eq('setting_key', 'default_currency')
            .single();

          if (existingSettings) {
            // Update existing setting
            await supabase
              .from('admin_settings')
              .update({
                setting_value: currencyCode,
                updated_at: new Date().toISOString()
              })
              .eq('setting_key', 'default_currency');
          } else {
            // Insert new setting
            await supabase
              .from('admin_settings')
              .insert({
                setting_key: 'default_currency',
                setting_value: currencyCode,
                updated_at: new Date().toISOString()
              });
          }
        }
      }
    } catch (error) {
      console.error('Error saving currency preference:', error);
    }
  };

  const updateExchangeRates = async () => {
    try {
      // Fetch real exchange rates from exchangerate-api.com
      // Using USD as base currency
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');

      if (!response.ok) {
        throw new Error(`Failed to fetch exchange rates: ${response.status}`);
      }

      const data = await response.json();
      const rates = data.rates;

      // Ensure we have rates for all supported currencies
      const supportedCurrencyCodes = SUPPORTED_CURRENCIES.map(c => c.code);
      const validRates: Record<string, number> = {};

      // Add USD rate (base currency)
      validRates['USD'] = 1;

      // Add rates for supported currencies
      supportedCurrencyCodes.forEach(code => {
        if (code !== 'USD' && rates[code]) {
          validRates[code] = rates[code];
        }
      });

      // Save to database
      await supabase
        .from('exchange_rates')
        .insert({
          rates: validRates,
          updated_at: new Date().toISOString()
        });

      // Update local state
      const updatedCurrencies = currencies.map(currency => ({
        ...currency,
        rate: validRates[currency.code] || currency.rate
      }));
      setCurrencies(updatedCurrencies);

      console.log('Exchange rates updated successfully');
    } catch (error) {
      console.error('Error updating exchange rates:', error);

      // Fallback to mock data if API fails
      const mockRates: Record<string, number> = {
        'USD': 1,
        'EUR': 0.85,
        'GBP': 0.73,
        'JPY': 110,
        'CAD': 1.25,
        'AUD': 1.35,
        'CHF': 0.92,
        'CNY': 6.4,
        'NGN': 1486, // Updated to current rate
        'ZAR': 14.5,
        'INR': 74,
        'BRL': 5.2
      };

      // Save mock data to database
      await supabase
        .from('exchange_rates')
        .insert({
          rates: mockRates,
          updated_at: new Date().toISOString()
        });

      // Update local state with mock data
      const updatedCurrencies = currencies.map(currency => ({
        ...currency,
        rate: mockRates[currency.code] || currency.rate
      }));
      setCurrencies(updatedCurrencies);
    }
  };

  const updateCustomRates = async (customRates: Record<string, number>) => {
    // Save custom rates to database
    const { error } = await supabase
      .from('exchange_rates')
      .insert({
        rates: customRates,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;

    // Update local state with custom rates
    const updatedCurrencies = currencies.map(currency => ({
      ...currency,
      rate: customRates[currency.code] || currency.rate
    }));
    setCurrencies(updatedCurrencies);
  };

  const value: CurrencyContextType = {
    currentCurrency,
    currencies,
    loading,
    formatPrice,
    convertPrice,
    setCurrency,
    updateExchangeRates,
    updateCustomRates, // Add this function
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
