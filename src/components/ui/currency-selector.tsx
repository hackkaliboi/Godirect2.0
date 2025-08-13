import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Check, Globe, TrendingUp, RefreshCw } from 'lucide-react';
import { useCurrency, Currency } from '@/contexts/CurrencyContext';
import { cn } from '@/lib/utils';

interface CurrencySelectorProps {
  variant?: 'select' | 'popover' | 'button';
  showFlag?: boolean;
  showName?: boolean;
  showRate?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onCurrencyChange?: (currency: Currency) => void;
}

export function CurrencySelector({
  variant = 'select',
  showFlag = true,
  showName = false,
  showRate = false,
  size = 'md',
  className,
  onCurrencyChange
}: CurrencySelectorProps) {
  const { 
    currentCurrency, 
    currencies, 
    setCurrency, 
    updateExchangeRates,
    loading 
  } = useCurrency();

  const handleCurrencyChange = async (currencyCode: string) => {
    await setCurrency(currencyCode);
    const currency = currencies.find(c => c.code === currencyCode);
    if (currency && onCurrencyChange) {
      onCurrencyChange(currency);
    }
  };

  const sizeClasses = {
    sm: 'text-xs h-8',
    md: 'text-sm h-9',
    lg: 'text-base h-10'
  };

  if (variant === 'select') {
    return (
      <Select 
        value={currentCurrency.code} 
        onValueChange={handleCurrencyChange}
        disabled={loading}
      >
        <SelectTrigger className={cn(sizeClasses[size], className)}>
          <SelectValue>
            <div className="flex items-center gap-2">
              {showFlag && (
                <span className="text-lg">{currentCurrency.flag}</span>
              )}
              <span className="font-medium">{currentCurrency.code}</span>
              {showName && (
                <span className="text-muted-foreground hidden sm:inline">
                  {currentCurrency.name}
                </span>
              )}
              {showRate && (
                <Badge variant="secondary" className="text-xs">
                  {currentCurrency.rate.toFixed(2)}
                </Badge>
              )}
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <div className="p-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Select Currency</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={updateExchangeRates}
                className="h-6 w-6 p-0"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
          </div>
          {currencies.map((currency) => (
            <SelectItem key={currency.code} value={currency.code}>
              <div className="flex items-center gap-3 w-full">
                <span className="text-lg">{currency.flag}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{currency.code}</span>
                    <span className="text-muted-foreground text-sm">
                      {currency.name}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    1 USD = {currency.rate.toFixed(currency.decimals)} {currency.symbol}
                  </div>
                </div>
                {currentCurrency.code === currency.code && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (variant === 'popover') {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className={cn(
              "justify-start gap-2",
              sizeClasses[size],
              className
            )}
            disabled={loading}
          >
            <Globe className="h-4 w-4" />
            {showFlag && (
              <span className="text-lg">{currentCurrency.flag}</span>
            )}
            <span className="font-medium">{currentCurrency.code}</span>
            {showName && (
              <span className="text-muted-foreground hidden sm:inline">
                {currentCurrency.name}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <div className="p-3 border-b">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Currency Settings</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={updateExchangeRates}
                className="h-6 w-6 p-0"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Choose your preferred currency for prices
            </p>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {currencies.map((currency) => (
              <button
                key={currency.code}
                onClick={() => handleCurrencyChange(currency.code)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-accent",
                  currentCurrency.code === currency.code && "bg-accent"
                )}
              >
                <span className="text-lg">{currency.flag}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{currency.code}</span>
                    <span className="text-muted-foreground text-sm">
                      {currency.name}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="h-3 w-3" />
                    1 USD = {currency.rate.toFixed(currency.decimals)} {currency.symbol}
                  </div>
                </div>
                {currentCurrency.code === currency.code && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </button>
            ))}
          </div>
          <div className="p-3 border-t bg-muted/50">
            <p className="text-xs text-muted-foreground">
              Exchange rates are updated regularly. Last update: Now
            </p>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  // Button variant
  return (
    <Button
      variant="outline"
      className={cn(
        "justify-start gap-2",
        sizeClasses[size],
        className
      )}
      onClick={() => {
        // For button variant, you might want to open a modal or navigate
        console.log('Currency button clicked');
      }}
      disabled={loading}
    >
      {showFlag && (
        <span className="text-lg">{currentCurrency.flag}</span>
      )}
      <span className="font-medium">{currentCurrency.code}</span>
      {showName && (
        <span className="text-muted-foreground hidden sm:inline">
          {currentCurrency.name}
        </span>
      )}
      {showRate && (
        <Badge variant="secondary" className="text-xs ml-auto">
          {currentCurrency.rate.toFixed(2)}
        </Badge>
      )}
    </Button>
  );
}

// Price display component with currency formatting
interface PriceDisplayProps {
  amount: number;
  fromCurrency?: string;
  className?: string;
  compact?: boolean;
  showDecimals?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function PriceDisplay({
  amount,
  fromCurrency = 'USD',
  className,
  compact = false,
  showDecimals = true,
  size = 'md'
}: PriceDisplayProps) {
  const { formatPrice, getConvertedPrice } = useCurrency();

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const formattedPrice = formatPrice(amount, {
    showCurrency: true,
    showDecimals,
    compact
  });

  return (
    <span className={cn(
      "font-semibold text-foreground",
      sizeClasses[size],
      className
    )}>
      {formattedPrice}
    </span>
  );
}
