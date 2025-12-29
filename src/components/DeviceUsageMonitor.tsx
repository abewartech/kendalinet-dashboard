import { useState, useEffect } from "react";
import { Activity, ArrowDown, ArrowUp, BarChart3, TrendingUp, Smartphone, Laptop, Tv, Gamepad2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Device {
  id: string;
  name: string;
  mac: string;
  ip: string;
  connected: boolean;
  type?: string;
  downloadSpeed?: number;
  uploadSpeed?: number;
}

interface DeviceUsage {
  mac: string;
  downloadMB: number;
  uploadMB: number;
  lastUpdated: string;
}

interface DeviceUsageMonitorProps {
  devices: Device[];
}

const deviceIcons: Record<string, React.ReactNode> = {
  phone: <Smartphone className="w-4 h-4" />,
  laptop: <Laptop className="w-4 h-4" />,
  tv: <Tv className="w-4 h-4" />,
  gaming: <Gamepad2 className="w-4 h-4" />,
};

const formatBytes = (mb: number): string => {
  if (mb >= 1024) {
    return `${(mb / 1024).toFixed(2)} GB`;
  }
  return `${mb.toFixed(2)} MB`;
};

export const DeviceUsageMonitor = ({ devices }: DeviceUsageMonitorProps) => {
  const [usageData, setUsageData] = useState<Record<string, DeviceUsage>>({});
  const [activeTab, setActiveTab] = useState<"realtime" | "daily">("realtime");

  // Simulate real-time usage data
  useEffect(() => {
    const generateUsageData = () => {
      const newUsage: Record<string, DeviceUsage> = {};
      devices.forEach((device) => {
        const existing = usageData[device.mac];
        if (device.connected) {
          newUsage[device.mac] = {
            mac: device.mac,
            downloadMB: (existing?.downloadMB || 0) + Math.random() * 5,
            uploadMB: (existing?.uploadMB || 0) + Math.random() * 1,
            lastUpdated: new Date().toISOString(),
          };
        } else if (existing) {
          newUsage[device.mac] = existing;
        }
      });
      setUsageData(newUsage);
    };

    // Load saved data
    const saved = localStorage.getItem("kendalinet_device_usage");
    if (saved) {
      setUsageData(JSON.parse(saved));
    } else {
      generateUsageData();
    }

    // Update every 5 seconds
    const interval = setInterval(() => {
      generateUsageData();
    }, 5000);

    return () => clearInterval(interval);
  }, [devices]);

  // Save usage data periodically
  useEffect(() => {
    if (Object.keys(usageData).length > 0) {
      localStorage.setItem("kendalinet_device_usage", JSON.stringify(usageData));
    }
  }, [usageData]);

  const totalDownload = Object.values(usageData).reduce((sum, u) => sum + u.downloadMB, 0);
  const totalUpload = Object.values(usageData).reduce((sum, u) => sum + u.uploadMB, 0);
  const maxUsage = Math.max(...Object.values(usageData).map((u) => u.downloadMB + u.uploadMB), 1);

  const sortedDevices = [...devices].sort((a, b) => {
    const usageA = (usageData[a.mac]?.downloadMB || 0) + (usageData[a.mac]?.uploadMB || 0);
    const usageB = (usageData[b.mac]?.downloadMB || 0) + (usageData[b.mac]?.uploadMB || 0);
    return usageB - usageA;
  });

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <Card className="glass-card border-border/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Monitor Penggunaan
          </CardTitle>
          <CardDescription>
            Pantau bandwidth yang digunakan setiap perangkat
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Total Usage Summary */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-xl bg-success/10 border border-success/20">
              <div className="flex items-center gap-2 mb-1">
                <ArrowDown className="w-4 h-4 text-success" />
                <span className="text-xs text-muted-foreground">Total Download</span>
              </div>
              <p className="text-lg font-bold text-success">{formatBytes(totalDownload)}</p>
            </div>
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-2 mb-1">
                <ArrowUp className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">Total Upload</span>
              </div>
              <p className="text-lg font-bold text-primary">{formatBytes(totalUpload)}</p>
            </div>
          </div>

          {/* Top User Badge */}
          {sortedDevices.length > 0 && sortedDevices[0].mac && usageData[sortedDevices[0].mac] && (
            <div className="p-3 rounded-xl bg-warning/10 border border-warning/20 mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-warning" />
                <span className="text-xs text-muted-foreground">Pengguna Terbanyak</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="font-semibold text-sm">{sortedDevices[0].name}</span>
                <Badge variant="secondary" className="text-xs">
                  {formatBytes(
                    (usageData[sortedDevices[0].mac]?.downloadMB || 0) +
                    (usageData[sortedDevices[0].mac]?.uploadMB || 0)
                  )}
                </Badge>
              </div>
            </div>
          )}

          {/* Tab View */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "realtime" | "daily")}>
            <TabsList className="w-full mb-4">
              <TabsTrigger value="realtime" className="flex-1">Real-time</TabsTrigger>
              <TabsTrigger value="daily" className="flex-1">Harian</TabsTrigger>
            </TabsList>

            <TabsContent value="realtime" className="space-y-2">
              {devices.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Tidak ada perangkat terhubung</p>
                </div>
              ) : (
                sortedDevices.map((device) => {
                  const usage = usageData[device.mac];
                  const deviceTotal = (usage?.downloadMB || 0) + (usage?.uploadMB || 0);
                  const percentage = (deviceTotal / maxUsage) * 100;

                  return (
                    <div
                      key={device.mac}
                      className="p-3 rounded-xl border border-border/30 hover:bg-secondary/20 transition-colors"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          device.connected ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                        }`}>
                          {deviceIcons[device.type || "phone"] || <Smartphone className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium truncate">{device.name}</span>
                            <Badge variant={device.connected ? "default" : "secondary"} className="text-[10px]">
                              {device.connected ? "Online" : "Offline"}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground font-mono">{device.ip}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Progress value={percentage} className="h-2" />
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 text-success">
                              <ArrowDown className="w-3 h-3" />
                              {formatBytes(usage?.downloadMB || 0)}
                            </span>
                            <span className="flex items-center gap-1 text-primary">
                              <ArrowUp className="w-3 h-3" />
                              {formatBytes(usage?.uploadMB || 0)}
                            </span>
                          </div>
                          <span className="text-muted-foreground font-semibold">
                            {formatBytes(deviceTotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </TabsContent>

            <TabsContent value="daily" className="space-y-2">
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Data harian akan tersedia</p>
                <p className="text-xs">setelah 24 jam monitoring</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
