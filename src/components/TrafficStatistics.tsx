import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Legend 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Activity, Calendar,
  Download, Upload, RefreshCw, Wifi
} from 'lucide-react';

interface DailyData {
  date: string;
  day: string;
  download: number;
  upload: number;
}

interface HourlyData {
  hour: string;
  download: number;
  upload: number;
}

const generateDailyData = (): DailyData[] => {
  const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const data: DailyData[] = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
      day: days[date.getDay()],
      download: Math.random() * 15 + 5,
      upload: Math.random() * 5 + 1,
    });
  }
  return data;
};

const generateHourlyData = (): HourlyData[] => {
  const data: HourlyData[] = [];
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, '0') + ':00';
    const isPeakHour = (i >= 19 && i <= 23) || (i >= 7 && i <= 9);
    data.push({
      hour,
      download: isPeakHour ? Math.random() * 800 + 400 : Math.random() * 300 + 50,
      upload: isPeakHour ? Math.random() * 200 + 100 : Math.random() * 100 + 20,
    });
  }
  return data;
};

const formatBytes = (gb: number): string => {
  if (gb >= 1) return `${gb.toFixed(2)} GB`;
  return `${(gb * 1024).toFixed(0)} MB`;
};

const TrafficStatistics = () => {
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('weekly');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setDailyData(generateDailyData());
      setHourlyData(generateHourlyData());
      setIsLoading(false);
    }, 500);
  };

  const totalDownload = dailyData.reduce((sum, d) => sum + d.download, 0);
  const totalUpload = dailyData.reduce((sum, d) => sum + d.upload, 0);
  const avgDownload = dailyData.length ? totalDownload / dailyData.length : 0;
  const avgUpload = dailyData.length ? totalUpload / dailyData.length : 0;

  const peakHour = hourlyData.reduce((max, h) => 
    (h.download + h.upload) > (max.download + max.upload) ? h : max, 
    { hour: '00:00', download: 0, upload: 0 }
  );

  const todayDownload = dailyData[dailyData.length - 1]?.download || 0;
  const yesterdayDownload = dailyData[dailyData.length - 2]?.download || 0;
  const trend = todayDownload > yesterdayDownload ? 'up' : 'down';
  const trendPercent = yesterdayDownload ? 
    Math.abs(((todayDownload - yesterdayDownload) / yesterdayDownload) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-4 pb-24">
      {/* Header Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Download className="h-4 w-4 text-blue-400" />
              <span className="text-xs text-muted-foreground">Total Download</span>
            </div>
            <p className="text-xl font-bold text-blue-400">{formatBytes(totalDownload)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Rata-rata: {formatBytes(avgDownload)}/hari
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border-emerald-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Upload className="h-4 w-4 text-emerald-400" />
              <span className="text-xs text-muted-foreground">Total Upload</span>
            </div>
            <p className="text-xl font-bold text-emerald-400">{formatBytes(totalUpload)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Rata-rata: {formatBytes(avgUpload)}/hari
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Trend & Peak Info */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${trend === 'up' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                {trend === 'up' ? (
                  <TrendingUp className="h-5 w-5 text-green-400" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">Tren Penggunaan</p>
                <p className="text-xs text-muted-foreground">
                  {trend === 'up' ? 'Naik' : 'Turun'} {trendPercent}% dari kemarin
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Activity className="h-3 w-3" />
                <span>Jam Puncak</span>
              </div>
              <Badge variant="secondary" className="mt-1">{peakHour.hour}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Wifi className="h-4 w-4 text-primary" />
              Statistik Traffic
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={loadData}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="weekly" className="text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                Mingguan
              </TabsTrigger>
              <TabsTrigger value="daily" className="text-xs">
                <Activity className="h-3 w-3 mr-1" />
                Hari Ini
              </TabsTrigger>
            </TabsList>

            <TabsContent value="weekly" className="mt-0">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="downloadGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="uploadGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey="day" 
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                      tickFormatter={(v) => `${v.toFixed(0)}G`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      formatter={(value: number, name: string) => [
                        formatBytes(value),
                        name === 'download' ? 'Download' : 'Upload'
                      ]}
                      labelFormatter={(label) => `Hari: ${label}`}
                    />
                    <Legend 
                      formatter={(value) => value === 'download' ? 'Download' : 'Upload'}
                      wrapperStyle={{ fontSize: '12px' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="download"
                      stroke="hsl(217, 91%, 60%)"
                      strokeWidth={2}
                      fill="url(#downloadGradient)"
                    />
                    <Area
                      type="monotone"
                      dataKey="upload"
                      stroke="hsl(160, 84%, 39%)"
                      strokeWidth={2}
                      fill="url(#uploadGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="daily" className="mt-0">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey="hour" 
                      tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                      interval={3}
                    />
                    <YAxis 
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                      tickFormatter={(v) => `${v}MB`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      formatter={(value: number, name: string) => [
                        `${value.toFixed(0)} MB`,
                        name === 'download' ? 'Download' : 'Upload'
                      ]}
                      labelFormatter={(label) => `Jam: ${label}`}
                    />
                    <Legend 
                      formatter={(value) => value === 'download' ? 'Download' : 'Upload'}
                      wrapperStyle={{ fontSize: '12px' }}
                    />
                    <Bar dataKey="download" fill="hsl(217, 91%, 60%)" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="upload" fill="hsl(160, 84%, 39%)" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Daily Breakdown */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Rincian 7 Hari Terakhir</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {dailyData.map((day, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 text-center">
                  <p className="text-xs font-medium">{day.day}</p>
                  <p className="text-[10px] text-muted-foreground">{day.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-blue-400 flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {formatBytes(day.download)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <Upload className="h-3 w-3" />
                    {formatBytes(day.upload)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrafficStatistics;
