import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  AlertCircle,
  Download,
  FileText,
  FileSpreadsheet
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  
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

  const currentDate = new Date();
  const monthYear = currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  const reportDate = currentDate.toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  const exportToCSV = () => {
    const csvContent = [
      ['LAPORAN TAGIHAN INTERNET'],
      ['Periode', monthYear],
      ['Tanggal Export', reportDate],
      [''],
      ['RINGKASAN PEMAKAIAN'],
      ['Total Pemakaian', `${totalUsageThisMonth.toFixed(2)} GB`],
      ['Rata-rata Harian', `${averageDaily.toFixed(2)} GB`],
      ['Harga per GB', `Rp ${pricePerGB.toLocaleString('id-ID')}`],
      [''],
      ['ESTIMASI BIAYA'],
      ['Total Estimasi', `Rp ${estimatedCost.toLocaleString('id-ID')}`],
      ['Proyeksi Akhir Bulan', `Rp ${(averageDaily * 30 * pricePerGB).toLocaleString('id-ID')}`],
      [''],
      ['DETAIL PEMAKAIAN HARIAN'],
      ['Tanggal', 'Pemakaian (GB)'],
      ...usageData.map(item => [item.date, item.usage.toFixed(2)])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `laporan-tagihan-${monthYear.replace(' ', '-')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Berhasil",
      description: "Laporan CSV berhasil diunduh",
    });
  };

  const exportToPDF = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Laporan Tagihan Internet - ${monthYear}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #0066cc; padding-bottom: 20px; }
          .header h1 { color: #0066cc; margin: 0; font-size: 24px; }
          .header p { margin: 5px 0; color: #666; }
          .section { margin-bottom: 25px; }
          .section-title { font-size: 16px; font-weight: bold; color: #0066cc; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
          .summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
          .summary-item { background: #f5f5f5; padding: 15px; border-radius: 8px; }
          .summary-item label { font-size: 12px; color: #666; display: block; }
          .summary-item value { font-size: 20px; font-weight: bold; color: #333; }
          .cost-box { background: #e6f3ff; padding: 20px; border-radius: 8px; text-align: center; }
          .cost-box .label { font-size: 14px; color: #666; }
          .cost-box .amount { font-size: 28px; font-weight: bold; color: #0066cc; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          th { background: #0066cc; color: white; }
          tr:nth-child(even) { background: #f9f9f9; }
          .footer { margin-top: 30px; text-align: center; color: #999; font-size: 12px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📶 LAPORAN TAGIHAN INTERNET</h1>
          <p>Periode: ${monthYear}</p>
          <p>Tanggal Export: ${reportDate}</p>
        </div>

        <div class="section">
          <div class="section-title">RINGKASAN PEMAKAIAN</div>
          <div class="summary-grid">
            <div class="summary-item">
              <label>Total Pemakaian Bulan Ini</label>
              <value>${totalUsageThisMonth.toFixed(2)} GB</value>
            </div>
            <div class="summary-item">
              <label>Rata-rata Harian</label>
              <value>${averageDaily.toFixed(2)} GB/hari</value>
            </div>
            <div class="summary-item">
              <label>Harga per GB</label>
              <value>Rp ${pricePerGB.toLocaleString('id-ID')}</value>
            </div>
            <div class="summary-item">
              <label>Proyeksi Akhir Bulan</label>
              <value>${(averageDaily * 30).toFixed(1)} GB</value>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">ESTIMASI BIAYA</div>
          <div class="cost-box">
            <div class="label">Total Tagihan Bulan Ini</div>
            <div class="amount">Rp ${estimatedCost.toLocaleString('id-ID')}</div>
          </div>
          <div style="margin-top: 15px; padding: 15px; background: #fff8e6; border-radius: 8px;">
            <strong>Proyeksi Akhir Bulan:</strong> Rp ${(averageDaily * 30 * pricePerGB).toLocaleString('id-ID')}
            <br><small style="color: #666;">*Berdasarkan rata-rata pemakaian harian</small>
          </div>
        </div>

        ${usageData.length > 0 ? `
        <div class="section">
          <div class="section-title">DETAIL PEMAKAIAN HARIAN</div>
          <table>
            <thead>
              <tr><th>Tanggal</th><th>Pemakaian (GB)</th></tr>
            </thead>
            <tbody>
              ${usageData.map(item => `<tr><td>${item.date}</td><td>${item.usage.toFixed(2)} GB</td></tr>`).join('')}
            </tbody>
          </table>
        </div>
        ` : ''}

        <div class="footer">
          <p>Dokumen ini digenerate secara otomatis oleh KendaliNet</p>
          <p>© ${currentDate.getFullYear()} - RT/RW Net Management System</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }

    toast({
      title: "Export PDF",
      description: "Dialog cetak PDF telah dibuka",
    });
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
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Pantau pemakaian data dan estimasi biaya internet Anda
          </p>
          
          {/* Export Buttons */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportToPDF}
              className="flex-1"
            >
              <FileText className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportToCSV}
              className="flex-1"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
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
