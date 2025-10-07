import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCurrency, Currency } from "@/contexts/CurrencyContext";
import {
  DollarSign,
  TrendingUp,
  RefreshCw,
  Globe2,
  Settings2,
  AlertCircle,
  CheckCircle,
  Loader2,
  Eye,
  EyeOff
} from "lucide-react";
import { toast } from "sonner";

interface ExchangeRateUpdateResult {
  success: boolean;
  updatedAt: string;
  errors?: string[];
}

export const CurrencyManagementComponent: React.FC = () => {
  const {
    currencies,
    currentCurrency,
    setCurrency,
    updateExchangeRates,
    updateCustomRates, // This is now available
    formatPrice,
    convertPrice
  } = useCurrency();

  const [defaultCurrency, setDefaultCurrency] = useState(currentCurrency.code);
  const [autoUpdateRates, setAutoUpdateRates] = useState(true);
  const [updateFrequency, setUpdateFrequency] = useState('daily');
  const [showMinorUnits, setShowMinorUnits] = useState(true);
  const [customRates, setCustomRates] = useState<Record<string, string>>({});
  const [isUpdatingRates, setIsUpdatingRates] = useState(false);
  const [lastRateUpdate, setLastRateUpdate] = useState<string>('');
  const [showAllRates, setShowAllRates] = useState(false);
  const [rateApiKey, setRateApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  // Initialize custom rates from currencies
  useEffect(() => {
    const rates: Record<string, string> = {};
    currencies.forEach((currency) => {
      rates[currency.code] = currency.rate.toString();
    });
    setCustomRates(rates);
  }, [currencies]);

  const handleDefaultCurrencyChange = async (currencyCode: string) => {
    const newCurrency = currencies.find(c => c.code === currencyCode);
    if (newCurrency) {
      setDefaultCurrency(currencyCode);
      await setCurrency(currencyCode);

      // Here you would typically save to your backend/database
      toast.success(`Default currency changed to ${newCurrency.name}`);
    }
  };

  const handleManualRateUpdate = async () => {
    setIsUpdatingRates(true);
    try {
      // Convert string rates back to numbers
      const numericRates: Record<string, number> = {};
      Object.entries(customRates).forEach(([code, rate]) => {
        const numRate = parseFloat(rate);
        if (!isNaN(numRate) && numRate > 0) {
          numericRates[code] = numRate;
        }
      });

      // Use the new updateCustomRates function from context
      await updateCustomRates(numericRates);

      setLastRateUpdate(new Date().toISOString());
      toast.success('Custom exchange rates applied successfully');
    } catch (error) {
      toast.error('Failed to apply custom exchange rates');
    } finally {
      setIsUpdatingRates(false);
    }
  };

  const handleAutoUpdateRatesFromAPI = async () => {
    setIsUpdatingRates(true);
    try {
      // Use the real updateExchangeRates function from context
      await updateExchangeRates();

      setLastRateUpdate(new Date().toISOString());
      toast.success('Exchange rates updated from API');
    } catch (error) {
      toast.error('Failed to fetch rates from API');
    } finally {
      setIsUpdatingRates(false);
    }
  };

  const handleCustomRateChange = (currencyCode: string, value: string) => {
    setCustomRates(prev => ({
      ...prev,
      [currencyCode]: value
    }));
  };

  const saveSettings = async () => {
    try {
      // Here you would save settings to your backend
      const settings = {
        defaultCurrency,
        autoUpdateRates,
        updateFrequency,
        showMinorUnits,
        rateApiKey,
        customRates: customRates
      };

      console.log('Saving currency settings:', settings);
      toast.success('Currency settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  const visibleCurrencies = showAllRates ? currencies : currencies.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Default Currency Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Default Currency Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Platform Default Currency</Label>
              <Select value={defaultCurrency} onValueChange={handleDefaultCurrencyChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{currency.flag}</span>
                        <span className="font-medium">{currency.code}</span>
                        <span className="text-muted-foreground">- {currency.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                This will be the default currency for all property listings and transactions
              </p>
            </div>

            <div className="space-y-2">
              <Label>Display Format</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm">Show decimal places</Label>
                    <p className="text-xs text-muted-foreground">
                      Display {showMinorUnits ? formatPrice(1234.56) : formatPrice(1235, { showDecimals: false })}
                    </p>
                  </div>
                  <Switch
                    checked={showMinorUnits}
                    onCheckedChange={setShowMinorUnits}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Currency Preview</h3>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Sample Property Price:</span>
                  <p className="font-semibold text-lg">{formatPrice(450000)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Monthly Rent:</span>
                  <p className="font-semibold text-lg">{formatPrice(2500)}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exchange Rate Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Exchange Rate Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-update Exchange Rates</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically fetch current rates from API
                  </p>
                </div>
                <Switch
                  checked={autoUpdateRates}
                  onCheckedChange={setAutoUpdateRates}
                />
              </div>

              {autoUpdateRates && (
                <div className="space-y-2">
                  <Label>Update Frequency</Label>
                  <Select value={updateFrequency} onValueChange={setUpdateFrequency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rate-api-key">Exchange Rate API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="rate-api-key"
                    type={showApiKey ? "text" : "password"}
                    value={rateApiKey}
                    onChange={(e) => setRateApiKey(e.target.value)}
                    placeholder="Enter your API key"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Required for automatic rate updates
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleAutoUpdateRatesFromAPI}
                  disabled={isUpdatingRates}
                  className="flex-1"
                >
                  {isUpdatingRates ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  Update from API
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Current Exchange Rates</h3>
              <div className="flex items-center gap-2">
                {lastRateUpdate && (
                  <Badge variant="secondary" className="text-xs">
                    Updated: {new Date(lastRateUpdate).toLocaleString()}
                  </Badge>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAllRates(!showAllRates)}
                >
                  {showAllRates ? 'Show Less' : 'Show All'}
                </Button>
              </div>
            </div>

            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {visibleCurrencies.map((currency) => (
                <div key={currency.code} className="p-3 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{currency.flag}</span>
                      <span className="font-medium">{currency.code}</span>
                    </div>
                    <Badge variant={currency.code === defaultCurrency ? "default" : "secondary"}>
                      {currency.code === defaultCurrency ? 'Base' : `1 ${defaultCurrency}`}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Exchange Rate</Label>
                    <Input
                      value={customRates[currency.code] || '1'}
                      onChange={(e) => handleCustomRateChange(currency.code, e.target.value)}
                      placeholder="Rate"
                      className="text-sm"
                      disabled={currency.code === defaultCurrency}
                    />
                  </div>

                  {currency.code !== defaultCurrency && (
                    <p className="text-xs text-muted-foreground">
                      {formatPrice(1)} = {currency.symbol}{(parseFloat(customRates[currency.code] || '1')).toFixed(2)}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleManualRateUpdate}
                disabled={isUpdatingRates}
                variant="outline"
              >
                {isUpdatingRates ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="mr-2 h-4 w-4" />
                )}
                Apply Manual Rates
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Currency Display Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe2 className="h-5 w-5" />
            Multi-Currency Display
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Show Currency Selector to Users</Label>
                <p className="text-sm text-muted-foreground">
                  Allow users to view prices in their preferred currency
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Show Exchange Rate Information</Label>
                <p className="text-sm text-muted-foreground">
                  Display conversion rates and last update time
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Remember User Currency Preference</Label>
                <p className="text-sm text-muted-foreground">
                  Store user's currency choice in browser
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Currency Conversion Notice</Label>
            <Textarea
              placeholder="Enter a notice to display with converted prices..."
              defaultValue="Prices shown in currencies other than USD are estimates based on current exchange rates and may vary."
              className="min-h-[80px]"
            />
            <p className="text-sm text-muted-foreground">
              This notice will be displayed when users view prices in non-default currencies
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Settings */}
      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button onClick={saveSettings}>
          <Settings2 className="mr-2 h-4 w-4" />
          Save Currency Settings
        </Button>
      </div>
    </div>
  );
};

export default CurrencyManagementComponent;
