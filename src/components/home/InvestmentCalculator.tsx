import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calculator,
  Home,
  TrendingUp,
  BarChart3,
  Download
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

const InvestmentCalculator = () => {
  const [calculatorType, setCalculatorType] = useState("mortgage");
  
  // Mortgage calculator state
  const [loanAmount, setLoanAmount] = useState(25000000); // ₦25M
  const [interestRate, setInterestRate] = useState(15); // 15%
  const [loanTerm, setLoanTerm] = useState(20); // 20 years
  const [downPayment, setDownPayment] = useState(5000000); // ₦5M
  
  // ROI calculator state
  const [propertyValue, setPropertyValue] = useState(40000000); // ₦40M
  const [annualRent, setAnnualRent] = useState(2400000); // ₦2.4M
  const [annualExpenses, setAnnualExpenses] = useState(600000); // ₦600K
  const [appreciationRate, setAppreciationRate] = useState(7); // 7%
  const [investmentPeriod, setInvestmentPeriod] = useState(10); // 10 years
  
  // Calculated results
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [cashOnCash, setCashOnCash] = useState(0);
  const [totalROI, setTotalROI] = useState(0);
  const [projectedValue, setProjectedValue] = useState(0);
  
  // Chart data
  interface ChartDataPoint {
    year: string;
    [key: string]: string | number;
  }
  
  const [mortgageChartData, setMortgageChartData] = useState<ChartDataPoint[]>([]);
  const [roiChartData, setRoiChartData] = useState<ChartDataPoint[]>([]);

  // Calculate mortgage results
  useEffect(() => {
    if (calculatorType === "mortgage") {
      const principal = loanAmount - downPayment;
      const monthlyRate = interestRate / 100 / 12;
      const numberOfPayments = loanTerm * 12;
      
      // Calculate monthly payment
      const x = Math.pow(1 + monthlyRate, numberOfPayments);
      const monthly = (principal * x * monthlyRate) / (x - 1);
      
      setMonthlyPayment(monthly);
      setTotalPayment(monthly * numberOfPayments);
      setTotalInterest((monthly * numberOfPayments) - principal);
      
      // Generate chart data
      const chartData = [];
      let remainingPrincipal = principal;
      let totalPrincipalPaid = 0;
      let totalInterestPaid = 0;
      
      for (let year = 1; year <= Math.min(loanTerm, 30); year++) {
        for (let month = 1; month <= 12; month++) {
          const interestPayment = remainingPrincipal * monthlyRate;
          const principalPayment = monthly - interestPayment;
          
          remainingPrincipal -= principalPayment;
          totalPrincipalPaid += principalPayment;
          totalInterestPaid += interestPayment;
          
          if (month === 12 || year === loanTerm) {
            chartData.push({
              year: `Year ${year}`,
              "Principal Paid": Math.round(totalPrincipalPaid),
              "Interest Paid": Math.round(totalInterestPaid),
              "Remaining Balance": Math.max(0, Math.round(remainingPrincipal))
            });
          }
        }
      }
      
      setMortgageChartData(chartData);
    }
  }, [calculatorType, loanAmount, downPayment, interestRate, loanTerm]);

  // Calculate ROI results
  useEffect(() => {
    if (calculatorType === "roi") {
      const initialInvestment = propertyValue;
      const netAnnualIncome = annualRent - annualExpenses;
      const annualCashROI = (netAnnualIncome / initialInvestment) * 100;
      
      setCashOnCash(annualCashROI);
      
      // Calculate future value with appreciation
      let futureValue = propertyValue;
      const chartData = [];
      
      for (let year = 1; year <= investmentPeriod; year++) {
        futureValue *= (1 + appreciationRate / 100);
        const cumulativeRentalIncome = netAnnualIncome * year;
        const totalValue = futureValue + cumulativeRentalIncome;
        const totalROIPercent = ((totalValue - initialInvestment) / initialInvestment) * 100;
        
        chartData.push({
          year: `Year ${year}`,
          "Property Value": Math.round(futureValue),
          "Cumulative Rental Income": Math.round(cumulativeRentalIncome),
          "Total Return": Math.round(totalValue - initialInvestment)
        });
      }
      
      setProjectedValue(futureValue);
      setTotalROI(((futureValue - propertyValue) / propertyValue) * 100);
      setRoiChartData(chartData);
    }
  }, [calculatorType, propertyValue, annualRent, annualExpenses, appreciationRate, investmentPeriod]);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="container-custom">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-realty-900 dark:text-white mb-4">
          Investment <span className="text-realty-gold">Calculator</span>
        </h2>
        <p className="text-realty-600 dark:text-realty-300 max-w-2xl mx-auto">
          Plan your real estate investment with our advanced calculators. Estimate mortgage payments or analyze potential returns.
        </p>
      </div>

      <div className="bg-white dark:bg-realty-800/30 rounded-xl shadow-lg p-6 backdrop-blur-sm">
        <Tabs value={calculatorType} onValueChange={setCalculatorType} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger value="mortgage" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span>Mortgage</span>
              </TabsTrigger>
              <TabsTrigger value="roi" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>ROI Analysis</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Mortgage Calculator */}
          <TabsContent value="mortgage" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium text-realty-700 dark:text-realty-300">
                      Property Price
                    </label>
                    <span className="text-sm text-realty-600 dark:text-realty-400">
                      {formatCurrency(loanAmount)}
                    </span>
                  </div>
                  <Slider
                    value={[loanAmount]}
                    min={5000000}
                    max={100000000}
                    step={1000000}
                    onValueChange={(value) => setLoanAmount(value[0])}
                    className="my-4"
                  />
                  <div className="flex justify-between text-xs text-realty-500 dark:text-realty-400">
                    <span>₦5M</span>
                    <span>₦100M</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium text-realty-700 dark:text-realty-300">
                      Down Payment
                    </label>
                    <span className="text-sm text-realty-600 dark:text-realty-400">
                      {formatCurrency(downPayment)}
                    </span>
                  </div>
                  <Slider
                    value={[downPayment]}
                    min={0}
                    max={loanAmount * 0.5}
                    step={500000}
                    onValueChange={(value) => setDownPayment(value[0])}
                    className="my-4"
                  />
                  <div className="flex justify-between text-xs text-realty-500 dark:text-realty-400">
                    <span>₦0</span>
                    <span>{formatCurrency(loanAmount * 0.5)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium text-realty-700 dark:text-realty-300">
                      Interest Rate
                    </label>
                    <span className="text-sm text-realty-600 dark:text-realty-400">
                      {interestRate}%
                    </span>
                  </div>
                  <Slider
                    value={[interestRate]}
                    min={5}
                    max={25}
                    step={0.1}
                    onValueChange={(value) => setInterestRate(value[0])}
                    className="my-4"
                  />
                  <div className="flex justify-between text-xs text-realty-500 dark:text-realty-400">
                    <span>5%</span>
                    <span>25%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium text-realty-700 dark:text-realty-300">
                      Loan Term
                    </label>
                    <span className="text-sm text-realty-600 dark:text-realty-400">
                      {loanTerm} years
                    </span>
                  </div>
                  <Select value={loanTerm.toString()} onValueChange={(value) => setLoanTerm(parseInt(value))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select term" />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 10, 15, 20, 25, 30].map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year} years
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="text-sm font-medium text-realty-500 dark:text-realty-400 mb-1">Monthly Payment</h4>
                      <p className="text-xl font-semibold text-realty-900 dark:text-white">
                        {formatCurrency(monthlyPayment)}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="text-sm font-medium text-realty-500 dark:text-realty-400 mb-1">Total Payment</h4>
                      <p className="text-xl font-semibold text-realty-900 dark:text-white">
                        {formatCurrency(totalPayment)}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="text-sm font-medium text-realty-500 dark:text-realty-400 mb-1">Total Interest</h4>
                      <p className="text-xl font-semibold text-realty-900 dark:text-white">
                        {formatCurrency(totalInterest)}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="bg-realty-50 dark:bg-realty-900/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-realty-900 dark:text-white mb-4 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-realty-600 dark:text-realty-400" />
                  Payment Breakdown
                </h3>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={mortgageChartData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#ccc" opacity={0.1} />
                      <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                      <YAxis 
                        tickFormatter={(value) => `₦${(value / 1000000).toFixed(0)}M`} 
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip 
                        formatter={(value) => formatCurrency(Number(value))}
                        labelStyle={{ color: '#333' }}
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="Principal Paid" 
                        stackId="1"
                        stroke="#4f46e5" 
                        fill="#4f46e5" 
                        fillOpacity={0.6}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="Interest Paid" 
                        stackId="1"
                        stroke="#D4AF37" 
                        fill="#D4AF37" 
                        fillOpacity={0.6}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="Remaining Balance" 
                        stroke="#334E68" 
                        fill="#334E68" 
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <span>Export Report</span>
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ROI Calculator */}
          <TabsContent value="roi" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium text-realty-700 dark:text-realty-300">
                      Property Value
                    </label>
                    <span className="text-sm text-realty-600 dark:text-realty-400">
                      {formatCurrency(propertyValue)}
                    </span>
                  </div>
                  <Slider
                    value={[propertyValue]}
                    min={10000000}
                    max={200000000}
                    step={5000000}
                    onValueChange={(value) => setPropertyValue(value[0])}
                    className="my-4"
                  />
                  <div className="flex justify-between text-xs text-realty-500 dark:text-realty-400">
                    <span>₦10M</span>
                    <span>₦200M</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium text-realty-700 dark:text-realty-300">
                      Annual Rental Income
                    </label>
                    <span className="text-sm text-realty-600 dark:text-realty-400">
                      {formatCurrency(annualRent)}
                    </span>
                  </div>
                  <Slider
                    value={[annualRent]}
                    min={0}
                    max={propertyValue * 0.2}
                    step={100000}
                    onValueChange={(value) => setAnnualRent(value[0])}
                    className="my-4"
                  />
                  <div className="flex justify-between text-xs text-realty-500 dark:text-realty-400">
                    <span>₦0</span>
                    <span>{formatCurrency(propertyValue * 0.2)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium text-realty-700 dark:text-realty-300">
                      Annual Expenses
                    </label>
                    <span className="text-sm text-realty-600 dark:text-realty-400">
                      {formatCurrency(annualExpenses)}
                    </span>
                  </div>
                  <Slider
                    value={[annualExpenses]}
                    min={0}
                    max={annualRent * 0.5}
                    step={50000}
                    onValueChange={(value) => setAnnualExpenses(value[0])}
                    className="my-4"
                  />
                  <div className="flex justify-between text-xs text-realty-500 dark:text-realty-400">
                    <span>₦0</span>
                    <span>{formatCurrency(annualRent * 0.5)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium text-realty-700 dark:text-realty-300">
                        Appreciation Rate
                      </label>
                      <span className="text-sm text-realty-600 dark:text-realty-400">
                        {appreciationRate}%
                      </span>
                    </div>
                    <Select value={appreciationRate.toString()} onValueChange={(value) => setAppreciationRate(parseFloat(value))}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select rate" />
                      </SelectTrigger>
                      <SelectContent>
                        {[3, 5, 7, 10, 12, 15].map((rate) => (
                          <SelectItem key={rate} value={rate.toString()}>
                            {rate}%
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium text-realty-700 dark:text-realty-300">
                        Investment Period
                      </label>
                      <span className="text-sm text-realty-600 dark:text-realty-400">
                        {investmentPeriod} years
                      </span>
                    </div>
                    <Select value={investmentPeriod.toString()} onValueChange={(value) => setInvestmentPeriod(parseInt(value))}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        {[5, 10, 15, 20, 25, 30].map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year} years
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="text-sm font-medium text-realty-500 dark:text-realty-400 mb-1">Cash on Cash ROI</h4>
                      <p className="text-xl font-semibold text-realty-900 dark:text-white">
                        {cashOnCash.toFixed(2)}%
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="text-sm font-medium text-realty-500 dark:text-realty-400 mb-1">Total ROI</h4>
                      <p className="text-xl font-semibold text-realty-900 dark:text-white">
                        {totalROI.toFixed(2)}%
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="text-sm font-medium text-realty-500 dark:text-realty-400 mb-1">Future Value</h4>
                      <p className="text-xl font-semibold text-realty-900 dark:text-white">
                        {formatCurrency(projectedValue)}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="bg-realty-50 dark:bg-realty-900/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-realty-900 dark:text-white mb-4 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-realty-600 dark:text-realty-400" />
                  Investment Growth
                </h3>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={roiChartData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#ccc" opacity={0.1} />
                      <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                      <YAxis 
                        tickFormatter={(value) => `₦${(value / 1000000).toFixed(0)}M`} 
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip 
                        formatter={(value) => formatCurrency(Number(value))}
                        labelStyle={{ color: '#333' }}
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="Property Value" 
                        stroke="#4f46e5" 
                        fill="#4f46e5" 
                        fillOpacity={0.6}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="Cumulative Rental Income" 
                        stroke="#D4AF37" 
                        fill="#D4AF37" 
                        fillOpacity={0.6}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="Total Return" 
                        stroke="#334E68" 
                        fill="#334E68" 
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <span>Export Report</span>
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InvestmentCalculator;
