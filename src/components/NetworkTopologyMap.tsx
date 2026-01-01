import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Globe, 
  Router, 
  Smartphone, 
  Laptop, 
  Tv, 
  Gamepad2,
  Printer,
  HardDrive,
  Wifi,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  LayoutGrid,
  List,
  Signal,
  ArrowDown,
  ArrowUp
} from "lucide-react";

interface NetworkDevice {
  id: string;
  name: string;
  type: "router" | "phone" | "laptop" | "tv" | "gaming" | "printer" | "nas" | "iot" | "unknown";
  ip: string;
  mac: string;
  connected: boolean;
  signal: number;
  download: number;
  upload: number;
  connectedTo: string;
  band?: "2.4GHz" | "5GHz";
}

const NetworkTopologyMap = () => {
  const [viewMode, setViewMode] = useState<"topology" | "list">("topology");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [devices, setDevices] = useState<NetworkDevice[]>([
    { id: "router", name: "KendaliNet Router", type: "router", ip: "192.168.1.1", mac: "AA:BB:CC:DD:EE:00", connected: true, signal: 100, download: 0, upload: 0, connectedTo: "internet" },
    { id: "1", name: "iPhone Ayah", type: "phone", ip: "192.168.1.101", mac: "AA:BB:CC:DD:EE:01", connected: true, signal: 92, download: 12.5, upload: 2.1, connectedTo: "router", band: "5GHz" },
    { id: "2", name: "MacBook Pro", type: "laptop", ip: "192.168.1.102", mac: "AA:BB:CC:DD:EE:02", connected: true, signal: 88, download: 45.2, upload: 8.5, connectedTo: "router", band: "5GHz" },
    { id: "3", name: "Smart TV Samsung", type: "tv", ip: "192.168.1.103", mac: "AA:BB:CC:DD:EE:03", connected: true, signal: 75, download: 25.0, upload: 0.5, connectedTo: "router", band: "5GHz" },
    { id: "4", name: "PlayStation 5", type: "gaming", ip: "192.168.1.104", mac: "AA:BB:CC:DD:EE:04", connected: true, signal: 80, download: 65.3, upload: 12.1, connectedTo: "router", band: "5GHz" },
    { id: "5", name: "HP Printer", type: "printer", ip: "192.168.1.105", mac: "AA:BB:CC:DD:EE:05", connected: true, signal: 65, download: 0.1, upload: 0.0, connectedTo: "router", band: "2.4GHz" },
    { id: "6", name: "Synology NAS", type: "nas", ip: "192.168.1.106", mac: "AA:BB:CC:DD:EE:06", connected: true, signal: 100, download: 0, upload: 85.4, connectedTo: "router" },
    { id: "7", name: "iPhone Ibu", type: "phone", ip: "192.168.1.107", mac: "AA:BB:CC:DD:EE:07", connected: true, signal: 70, download: 5.2, upload: 1.0, connectedTo: "router", band: "2.4GHz" },
    { id: "8", name: "Tablet Anak", type: "phone", ip: "192.168.1.108", mac: "AA:BB:CC:DD:EE:08", connected: false, signal: 0, download: 0, upload: 0, connectedTo: "router", band: "5GHz" },
  ]);

  const getDeviceIcon = (type: string, size = "w-6 h-6") => {
    const iconClass = size;
    switch (type) {
      case "router": return <Router className={iconClass} />;
      case "phone": return <Smartphone className={iconClass} />;
      case "laptop": return <Laptop className={iconClass} />;
      case "tv": return <Tv className={iconClass} />;
      case "gaming": return <Gamepad2 className={iconClass} />;
      case "printer": return <Printer className={iconClass} />;
      case "nas": return <HardDrive className={iconClass} />;
      default: return <Wifi className={iconClass} />;
    }
  };

  const getSignalColor = (signal: number) => {
    if (signal >= 80) return "text-green-400";
    if (signal >= 50) return "text-yellow-400";
    if (signal > 0) return "text-orange-400";
    return "text-muted-foreground";
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    toast.success("Memindai jaringan...");
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Peta jaringan diperbarui");
    }, 2000);
  };

  const connectedDevices = devices.filter(d => d.connected && d.type !== "router");
  const router = devices.find(d => d.type === "router");
  const totalDownload = devices.reduce((sum, d) => sum + d.download, 0);
  const totalUpload = devices.reduce((sum, d) => sum + d.upload, 0);

  return (
    <div className="space-y-6 pb-24">
      {/* Header Stats */}
      <Card className="glass-card border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Peta Jaringan</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 rounded-xl bg-background/50">
              <Wifi className="w-5 h-5 mx-auto mb-1 text-primary" />
              <p className="text-lg font-bold">{connectedDevices.length}</p>
              <p className="text-xs text-muted-foreground">Perangkat</p>
            </div>
            <div className="p-3 rounded-xl bg-background/50">
              <ArrowDown className="w-5 h-5 mx-auto mb-1 text-green-400" />
              <p className="text-lg font-bold">{totalDownload.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">Mbps ↓</p>
            </div>
            <div className="p-3 rounded-xl bg-background/50">
              <ArrowUp className="w-5 h-5 mx-auto mb-1 text-blue-400" />
              <p className="text-lg font-bold">{totalUpload.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">Mbps ↑</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Toggle */}
      <div className="flex gap-2">
        <Button
          variant={viewMode === "topology" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("topology")}
          className="flex-1"
        >
          <LayoutGrid className="w-4 h-4 mr-2" />
          Topology
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("list")}
          className="flex-1"
        >
          <List className="w-4 h-4 mr-2" />
          Daftar
        </Button>
      </div>

      {viewMode === "topology" ? (
        /* Topology View */
        <Card className="glass-card border-0">
          <CardContent className="p-6">
            {/* Internet */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-2">
                <Globe className="w-8 h-8 text-blue-400" />
              </div>
              <span className="text-sm font-medium">Internet</span>
              <span className="text-xs text-muted-foreground">WAN</span>
            </div>

            {/* Connection Line */}
            <div className="flex justify-center mb-4">
              <div className="w-0.5 h-8 bg-gradient-to-b from-blue-400 to-primary" />
            </div>

            {/* Router */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mb-2 border-2 border-primary/50">
                <Router className="w-10 h-10 text-primary" />
              </div>
              <span className="text-sm font-bold">{router?.name}</span>
              <span className="text-xs text-muted-foreground">{router?.ip}</span>
            </div>

            {/* Connection Lines to Devices */}
            <div className="flex justify-center mb-4">
              <div className="flex items-end gap-1">
                {connectedDevices.map((_, i) => (
                  <div 
                    key={i}
                    className="w-0.5 bg-gradient-to-b from-primary to-muted-foreground/30"
                    style={{ 
                      height: `${20 + (i % 2) * 10}px`,
                      transform: `rotate(${(i - Math.floor(connectedDevices.length / 2)) * 8}deg)`
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Connected Devices Grid */}
            <div className="grid grid-cols-4 gap-3">
              {connectedDevices.map((device) => (
                <div 
                  key={device.id}
                  className="flex flex-col items-center p-2 rounded-xl bg-background/50 hover:bg-background/80 transition-colors cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1 ${
                    device.connected ? "bg-green-500/20" : "bg-muted"
                  }`}>
                    {getDeviceIcon(device.type, "w-5 h-5")}
                  </div>
                  <span className="text-[10px] font-medium text-center line-clamp-1">{device.name}</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Signal className={`w-3 h-3 ${getSignalColor(device.signal)}`} />
                    <span className={`text-[9px] ${getSignalColor(device.signal)}`}>{device.signal}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Offline Devices */}
            {devices.filter(d => !d.connected && d.type !== "router").length > 0 && (
              <div className="mt-6 pt-4 border-t border-border/50">
                <p className="text-xs text-muted-foreground mb-3">Offline</p>
                <div className="grid grid-cols-4 gap-3">
                  {devices.filter(d => !d.connected && d.type !== "router").map((device) => (
                    <div 
                      key={device.id}
                      className="flex flex-col items-center p-2 rounded-xl bg-muted/30 opacity-50"
                    >
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-1">
                        {getDeviceIcon(device.type, "w-5 h-5")}
                      </div>
                      <span className="text-[10px] text-center line-clamp-1">{device.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        /* List View */
        <div className="space-y-3">
          {devices.filter(d => d.type !== "router").map((device) => (
            <Card key={device.id} className={`glass-card border-0 ${!device.connected ? "opacity-50" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    device.connected ? "bg-green-500/20" : "bg-muted"
                  }`}>
                    {getDeviceIcon(device.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold truncate">{device.name}</h4>
                      {device.band && (
                        <Badge variant="outline" className="text-xs">{device.band}</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{device.ip}</p>
                    <p className="text-[10px] font-mono text-muted-foreground/70">{device.mac}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1 mb-1">
                      <Signal className={`w-4 h-4 ${getSignalColor(device.signal)}`} />
                      <span className={`text-sm font-medium ${getSignalColor(device.signal)}`}>
                        {device.signal}%
                      </span>
                    </div>
                    {device.connected && (
                      <div className="text-xs text-muted-foreground">
                        <span className="text-green-400">↓{device.download}</span>
                        {" / "}
                        <span className="text-blue-400">↑{device.upload}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Legend */}
      <Card className="glass-card border-0 bg-primary/5">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-3">Legenda</h4>
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span>Excellent</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <span>Good</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-orange-400" />
              <span>Fair</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-muted-foreground" />
              <span>Offline</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkTopologyMap;
