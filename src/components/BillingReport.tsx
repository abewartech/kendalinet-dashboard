import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  ResponsiveContainer 
} from "recharts";
import { 
  Receipt, 
  TrendingUp, 
  Calendar, 
  Wallet,
  BarChart3,
  AlertCircle
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface BillingReportProps {
  usedGB: number;
  totalGB: number;
}

// Note: Billing data would need to come from API
// For now, showing empty state when no data available

const chartConfig = {
  usage: {
    label: "Pemakaian",
    color: "hsl(var(--primary))",
  },
};

export default function BillingReport({ usedGB, totalGB }: BillingReportProps) {
  const [pricePerGB, setPricePerGB] = useState<number>(10000);
  // Note: Real billing data should come from API
  // For now, we'll show a message that this feature requires API data
  const hasBillingData = false; // This should be set based on API availability
  
  const usageData: any[] = []; // Empty array - would be populated from API
  
  const totalUsageThisMonth = usedGB || 0;
  
  const estimatedCost = useMemo(() => {
    return totalUsageThisMonth * pricePerGB;
  }, [totalUsageThisMonth, pricePerGB]);
  
  const averageDaily = useMemo(() => {
    return totalUsageThisMonth / 30;
  }, [totalUsageThisMonth]);
  
  const peakUsage = 0; // Would come from API data

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Header */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Receipt className="h-5 w-5 text-primary" />
            Laporan Tagihan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Pantau pemakaian data dan estimasi biaya internet Anda
          </p>
        </CardContent>
      </Card>

      {/* Error message when no billing data available */}
      {!hasBillingData && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Data Tidak Tersedia</AlertTitle>
          <AlertDescription>
            Data tagihan tidak tersedia. Pastikan router terhubung dan API menyediakan data billing.
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Total Bulan Ini</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {totalUsageThisMonth.toFixed(1)} GB
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-xs text-muted-foreground">Rata-rata/Hari</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {averageDaily.toFixed(2)} GB
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Usage Chart */}
      {hasBillingData && usageData.length > 0 ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-base">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Pemakaian 30 Hari Terakhir
              </span>
              <Badge variant="secondary" className="text-xs">
                Puncak: {peakUsage.toFixed(1)} GB
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={usageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    interval={6}
                    className="text-muted-foreground"
                  />
                  <YAxis 
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}GB`}
                    className="text-muted-foreground"
                  />
                  <ChartTooltip 
                    content={
                      <ChartTooltipContent 
                        formatter={(value) => [`${value} GB`, "Pemakaian"]}
                      />
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="usage"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#usageGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-sm text-muted-foreground">
              Data pemakaian harian tidak tersedia
            </p>
          </CardContent>
        </Card>
      )}

      {/* Cost Estimation */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Wallet className="h-4 w-4 text-primary" />
            Estimasi Biaya
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pricePerGB" className="text-sm">
              Harga per GB (Rupiah)
            </Label>
            <Input
              id="pricePerGB"
              type="number"
              value={pricePerGB}
              onChange={(e) => setPricePerGB(Number(e.target.value) || 0)}
              placeholder="Masukkan harga per GB"
              className="bg-background"
            />
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Pemakaian bulan ini</span>
              <span className="font-medium">{totalUsageThisMonth.toFixed(2)} GB</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Harga per GB</span>
              <span className="font-medium">{formatCurrency(pricePerGB)}</span>
            </div>
            <div className="border-t border-border pt-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Estimasi</span>
                <span className="text-xl font-bold text-primary">
                  {formatCurrency(estimatedCost)}
                </span>
              </div>
            </div>
          </div>

          {/* Projection */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Proyeksi Akhir Bulan</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Berdasarkan rata-rata harian ({averageDaily.toFixed(2)} GB/hari), 
                  estimasi total pemakaian bulan ini sekitar{" "}
                  <span className="font-medium text-foreground">
                    {(averageDaily * 30).toFixed(1)} GB
                  </span>{" "}
                  atau sekitar{" "}
                  <span className="font-medium text-primary">
                    {formatCurrency(averageDaily * 30 * pricePerGB)}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
