import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Network, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Activity,
  Wifi,
  Signal,
  ArrowDownCircle,
  ArrowUpCircle,
  Settings2,
  Zap,
  Cable,
  Router,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

interface WANInterface {
  id: string;
  name: string;
  type: "ethernet" | "4g" | "fiber" | "dsl";
  ip: string;
  gateway: string;
  weight: number;
  enabled: boolean;
  status: "online" | "offline" | "standby";
  downloadSpeed: number;
  uploadSpeed: number;
  latency: number;
  usage: number;
}

type BalanceMode = "weighted" | "failover" | "round-robin" | "least-connections";

const LoadBalancing = () => {
  const [enabled, setEnabled] = useState(true);
  const [balanceMode, setBalanceMode] = useState<BalanceMode>("weighted");
  const [healthCheckInterval, setHealthCheckInterval] = useState(30);
  const [failoverThreshold, setFailoverThreshold] = useState(3);

  const [interfaces, setInterfaces] = useState<WANInterface[]>([
    {
      id: "1",
      name: "WAN1 - Indihome",
      type: "fiber",
      ip: "192.168.1.1",
      gateway: "192.168.1.254",
      weight: 50,
      enabled: true,
      status: "online",
      downloadSpeed: 45.2,
      uploadSpeed: 12.8,
      latency: 15,
      usage: 65
    },
    {
      id: "2",
      name: "WAN2 - Biznet",
      type: "fiber",
      ip: "192.168.2.1",
      gateway: "192.168.2.254",
      weight: 30,
      enabled: true,
      status: "online",
      downloadSpeed: 32.5,
      uploadSpeed: 8.4,
      latency: 22,
      usage: 40
    },
    {
      id: "3",
      name: "WAN3 - 4G Backup",
      type: "4g",
      ip: "10.0.0.1",
      gateway: "10.0.0.254",
      weight: 20,
      enabled: true,
      status: "standby",
      downloadSpeed: 0,
      uploadSpeed: 0,
      latency: 0,
      usage: 0
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newInterface, setNewInterface] = useState({
    name: "",
    type: "ethernet" as WANInterface["type"],
    ip: "",
    gateway: "",
    weight: 10
  });

  const totalWeight = interfaces.filter(i => i.enabled).reduce((sum, i) => sum + i.weight, 0);
  const onlineCount = interfaces.filter(i => i.status === "online").length;
  const totalDownload = interfaces.filter(i => i.status === "online").reduce((sum, i) => sum + i.downloadSpeed, 0);
  const totalUpload = interfaces.filter(i => i.status === "online").reduce((sum, i) => sum + i.uploadSpeed, 0);

  const handleAddInterface = () => {
    if (!newInterface.name || !newInterface.ip || !newInterface.gateway) {
      toast.error("Lengkapi semua field yang diperlukan");
      return;
    }

    const newWan: WANInterface = {
      id: Date.now().toString(),
      ...newInterface,
      enabled: true,
      status: "offline",
      downloadSpeed: 0,
      uploadSpeed: 0,
      latency: 0,
      usage: 0
    };

    setInterfaces([...interfaces, newWan]);
    setNewInterface({ name: "", type: "ethernet", ip: "", gateway: "", weight: 10 });
    setShowAddForm(false);
    toast.success("Interface WAN ditambahkan");
  };

  const handleDeleteInterface = (id: string) => {
    setInterfaces(interfaces.filter(i => i.id !== id));
    toast.success("Interface WAN dihapus");
  };

  const handleToggleInterface = (id: string) => {
    setInterfaces(interfaces.map(i => 
      i.id === id ? { ...i, enabled: !i.enabled } : i
    ));
  };

  const handleWeightChange = (id: string, weight: number) => {
    setInterfaces(interfaces.map(i => 
      i.id === id ? { ...i, weight: Math.max(1, Math.min(100, weight)) } : i
    ));
  };

  const handleTestConnection = (id: string) => {
    const iface = interfaces.find(i => i.id === id);
    toast.info(`Testing koneksi ${iface?.name}...`);
    
    setTimeout(() => {
      setInterfaces(interfaces.map(i => 
        i.id === id ? { ...i, status: "online", latency: Math.floor(Math.random() * 30) + 10 } : i
      ));
      toast.success(`${iface?.name} online!`);
    }, 2000);
  };

  const getTypeIcon = (type: WANInterface["type"]) => {
    switch (type) {
      case "fiber": return <Zap className="w-4 h-4 text-blue-400" />;
      case "4g": return <Signal className="w-4 h-4 text-green-400" />;
      case "ethernet": return <Cable className="w-4 h-4 text-orange-400" />;
      case "dsl": return <Router className="w-4 h-4 text-purple-400" />;
    }
  };

  const getStatusColor = (status: WANInterface["status"]) => {
    switch (status) {
      case "online": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "offline": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "standby": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    }
  };

  const getModeDescription = (mode: BalanceMode) => {
    switch (mode) {
      case "weighted": return "Distribusi traffic berdasarkan bobot setiap WAN";
      case "failover": return "WAN utama aktif, backup jika gagal";
      case "round-robin": return "Traffic didistribusikan secara bergantian";
      case "least-connections": return "Traffic ke WAN dengan koneksi paling sedikit";
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto glass-card rounded-2xl flex items-center justify-center mb-4">
          <Network className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Load Balancing</h1>
        <p className="text-muted-foreground text-sm">
          Kelola Multi-WAN dan distribusi traffic
        </p>
      </div>

      {/* Enable Toggle & Stats */}
      <Card className="glass-card border-border/50">
        <CardContent className="pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${enabled ? "bg-primary/20" : "bg-muted"}`}>
                <Activity className={`w-5 h-5 ${enabled ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div>
                <p className="font-medium">Load Balancing</p>
                <p className="text-sm text-muted-foreground">Multi-WAN aktif</p>
              </div>
            </div>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>

          {enabled && (
            <div className="grid grid-cols-4 gap-2 pt-2">
              <div className="text-center p-2 rounded-lg bg-card/50 border border-border/30">
                <p className="text-lg font-bold text-primary">{interfaces.length}</p>
                <p className="text-[10px] text-muted-foreground">WAN</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-card/50 border border-border/30">
                <p className="text-lg font-bold text-green-400">{onlineCount}</p>
                <p className="text-[10px] text-muted-foreground">Online</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-card/50 border border-border/30">
                <p className="text-lg font-bold text-blue-400">{totalDownload.toFixed(0)}</p>
                <p className="text-[10px] text-muted-foreground">Mbps ↓</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-card/50 border border-border/30">
                <p className="text-lg font-bold text-orange-400">{totalUpload.toFixed(0)}</p>
                <p className="text-[10px] text-muted-foreground">Mbps ↑</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {enabled && (
        <>
          {/* Balance Mode */}
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-primary" />
                Mode Load Balancing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={balanceMode} onValueChange={(v) => setBalanceMode(v as BalanceMode)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weighted">Weighted Balance</SelectItem>
                  <SelectItem value="failover">Failover</SelectItem>
                  <SelectItem value="round-robin">Round Robin</SelectItem>
                  <SelectItem value="least-connections">Least Connections</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">{getModeDescription(balanceMode)}</p>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs">Health Check (detik)</Label>
                  <Input 
                    type="number"
                    value={healthCheckInterval}
                    onChange={(e) => setHealthCheckInterval(parseInt(e.target.value) || 30)}
                    min={5}
                    max={300}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Failover Threshold</Label>
                  <Input 
                    type="number"
                    value={failoverThreshold}
                    onChange={(e) => setFailoverThreshold(parseInt(e.target.value) || 3)}
                    min={1}
                    max={10}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* WAN Interfaces */}
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Wifi className="w-5 h-5 text-primary" />
                  Interface WAN
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowAddForm(!showAddForm)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Add Form */}
              {showAddForm && (
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Nama</Label>
                      <Input 
                        value={newInterface.name}
                        onChange={(e) => setNewInterface({...newInterface, name: e.target.value})}
                        placeholder="WAN - ISP"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Tipe</Label>
                      <Select 
                        value={newInterface.type} 
                        onValueChange={(v) => setNewInterface({...newInterface, type: v as WANInterface["type"]})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fiber">Fiber</SelectItem>
                          <SelectItem value="ethernet">Ethernet</SelectItem>
                          <SelectItem value="4g">4G/LTE</SelectItem>
                          <SelectItem value="dsl">DSL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">IP Address</Label>
                      <Input 
                        value={newInterface.ip}
                        onChange={(e) => setNewInterface({...newInterface, ip: e.target.value})}
                        placeholder="192.168.1.1"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Gateway</Label>
                      <Input 
                        value={newInterface.gateway}
                        onChange={(e) => setNewInterface({...newInterface, gateway: e.target.value})}
                        placeholder="192.168.1.254"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Bobot ({newInterface.weight}%)</Label>
                    <Input 
                      type="range"
                      value={newInterface.weight}
                      onChange={(e) => setNewInterface({...newInterface, weight: parseInt(e.target.value)})}
                      min={1}
                      max={100}
                      className="w-full"
                    />
                  </div>
                  <Button className="w-full" onClick={handleAddInterface}>
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah WAN
                  </Button>
                </div>
              )}

              {/* Interface List */}
              {interfaces.map((iface) => (
                <div 
                  key={iface.id}
                  className={`p-4 rounded-xl border space-y-3 ${iface.enabled ? "bg-card/50 border-border/30" : "bg-muted/20 border-muted/30 opacity-60"}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center border border-border/50">
                        {getTypeIcon(iface.type)}
                      </div>
                      <div>
                        <p className="font-medium">{iface.name}</p>
                        <p className="text-xs text-muted-foreground">{iface.ip} → {iface.gateway}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(iface.status)}>
                        {iface.status}
                      </Badge>
                      <Switch 
                        checked={iface.enabled}
                        onCheckedChange={() => handleToggleInterface(iface.id)}
                      />
                    </div>
                  </div>

                  {iface.enabled && iface.status === "online" && (
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="p-2 rounded-lg bg-background/50">
                        <div className="flex items-center justify-center gap-1">
                          <ArrowDownCircle className="w-3 h-3 text-green-400" />
                          <span className="text-sm font-medium">{iface.downloadSpeed}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">Mbps</p>
                      </div>
                      <div className="p-2 rounded-lg bg-background/50">
                        <div className="flex items-center justify-center gap-1">
                          <ArrowUpCircle className="w-3 h-3 text-blue-400" />
                          <span className="text-sm font-medium">{iface.uploadSpeed}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">Mbps</p>
                      </div>
                      <div className="p-2 rounded-lg bg-background/50">
                        <span className="text-sm font-medium">{iface.latency}</span>
                        <p className="text-[10px] text-muted-foreground">ms</p>
                      </div>
                      <div className="p-2 rounded-lg bg-background/50">
                        <span className="text-sm font-medium">{iface.usage}%</span>
                        <p className="text-[10px] text-muted-foreground">usage</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Bobot</span>
                      <span className="font-medium">{iface.weight}% ({((iface.weight / totalWeight) * 100).toFixed(0)}% aktual)</span>
                    </div>
                    <Input 
                      type="range"
                      value={iface.weight}
                      onChange={(e) => handleWeightChange(iface.id, parseInt(e.target.value))}
                      min={1}
                      max={100}
                      className="w-full h-2"
                      disabled={!iface.enabled}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleTestConnection(iface.id)}
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Test
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteInterface(iface.id)}
                    >
                      <Trash2 className="w-3 h-3 text-red-400" />
                    </Button>
                  </div>
                </div>
              ))}

              {interfaces.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Network className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Belum ada interface WAN</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Traffic Distribution */}
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Distribusi Traffic
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {interfaces.filter(i => i.enabled && i.status === "online").map((iface) => {
                const percentage = totalWeight > 0 ? (iface.weight / totalWeight) * 100 : 0;
                return (
                  <div key={iface.id} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        {getTypeIcon(iface.type)}
                        {iface.name}
                      </span>
                      <span className="font-medium">{percentage.toFixed(0)}%</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}

              {interfaces.filter(i => i.enabled && i.status === "online").length === 0 && (
                <div className="flex items-center gap-2 text-yellow-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>Tidak ada WAN online</span>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default LoadBalancing;
