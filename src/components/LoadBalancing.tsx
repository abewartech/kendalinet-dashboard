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

import { useEffect } from "react";
import { useLuciApi } from "@/hooks/useLuciApi";

const LoadBalancing = () => {
  const {
    mwan3Status,
    mwan3Interfaces,
    fetchMwan3Status,
    fetchMwan3Interfaces,
    toggleMwan3,
    setMwan3Mode,
    addMwan3Wan,
    deleteMwan3Wan,
    setMwan3Weight
  } = useLuciApi();

  const [balanceMode, setBalanceMode] = useState<BalanceMode>("weighted");
  const [healthCheckInterval, setHealthCheckInterval] = useState(30);
  const [failoverThreshold, setFailoverThreshold] = useState(3);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newInterface, setNewInterface] = useState({
    name: "",
    type: "ethernet" as WANInterface["type"],
    iface: "",
    ip: "",
    gateway: "",
    weight: 1,
    metric: 1
  });

  useEffect(() => {
    fetchMwan3Status();
    fetchMwan3Interfaces();
  }, []);

  const enabled = mwan3Status?.enabled || false;
  const interfaces = (mwan3Interfaces || []) as any[];

  const onlineCount = mwan3Status?.online || 0;
  const totalWeight = interfaces.filter(i => i.enabled).reduce((sum, i) => sum + (i.weight || 0), 0);
  const totalDownload = 0;
  const totalUpload = 0;

  const handleToggleLB = async (val: boolean) => {
    const res = await toggleMwan3(val);
    if (res.success) {
      toast.success(val ? "Load Balancing diaktifkan" : "Load Balancing dinonaktifkan");
      setTimeout(fetchMwan3Status, 1500);
    } else {
      toast.error("Gagal mengubah status Load Balancing");
    }
  };

  const handleAddInterface = async () => {
    if (!newInterface.iface) {
      toast.error("Lengkapi Interface (contoh: wan2)");
      return;
    }

    const res = await addMwan3Wan({
      name: newInterface.name || newInterface.iface,
      iface: newInterface.iface,
      weight: newInterface.weight,
      metric: newInterface.metric
    });

    if (res.success) {
      setNewInterface({ name: "", type: "ethernet", iface: "", ip: "", gateway: "", weight: 1, metric: 1 });
      setShowAddForm(false);
      toast.success("Interface WAN ditambahkan");
      fetchMwan3Interfaces();
    } else {
      toast.error("Gagal menambah WAN");
    }
  };

  const handleDeleteInterface = async (iface: string) => {
    const res = await deleteMwan3Wan(iface);
    if (res.success) {
      toast.success("Interface WAN dihapus");
      fetchMwan3Interfaces();
    } else {
      toast.error("Gagal menghapus WAN");
    }
  };

  const handleWeightChange = async (iface: string, weight: number) => {
    const res = await setMwan3Weight(iface, weight);
    if (res.success) {
      toast.success(`Bobot ${iface} diperbarui`);
      fetchMwan3Interfaces();
    }
  };

  const handleModeChange = async (mode: BalanceMode) => {
    setBalanceMode(mode);
    const res = await setMwan3Mode(mode);
    if (res.success) {
      toast.success(`Mode ganti ke ${mode}`);
    }
  };

  const handleTestConnection = (iface: string) => {
    toast.info(`Checking status ${iface}...`);
    fetchMwan3Status();
    fetchMwan3Interfaces();
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
                <p className="font-medium">Load Balancing (mwan3)</p>
                <p className="text-sm text-muted-foreground">{enabled ? "Multi-WAN aktif" : "Layanan berhenti"}</p>
              </div>
            </div>
            <Switch checked={enabled} onCheckedChange={handleToggleLB} />
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
              <Select value={balanceMode} onValueChange={handleModeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weighted">Weighted Balance</SelectItem>
                  <SelectItem value="failover">Failover</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">{getModeDescription(balanceMode)}</p>
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
                      <Label className="text-xs">Label/Nama</Label>
                      <Input
                        value={newInterface.name}
                        onChange={(e) => setNewInterface({ ...newInterface, name: e.target.value })}
                        placeholder="WAN - ISP"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Interface (UCI)</Label>
                      <Input
                        value={newInterface.iface}
                        onChange={(e) => setNewInterface({ ...newInterface, iface: e.target.value })}
                        placeholder="wan2"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Bobot (1-100)</Label>
                      <Input
                        type="number"
                        value={newInterface.weight}
                        onChange={(e) => setNewInterface({ ...newInterface, weight: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Metric</Label>
                      <Input
                        type="number"
                        value={newInterface.metric}
                        onChange={(e) => setNewInterface({ ...newInterface, metric: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                  <Button className="w-full" onClick={handleAddInterface}>
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah WAN ke mwan3
                  </Button>
                </div>
              )}

              {/* Interface List */}
              {interfaces.map((iface) => (
                <div
                  key={iface.iface}
                  className={`p-4 rounded-xl border space-y-3 ${iface.enabled ? "bg-card/50 border-border/30" : "bg-muted/20 border-muted/30 opacity-60"}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center border border-border/50">
                        {getTypeIcon(iface.type || "ethernet")}
                      </div>
                      <div>
                        <p className="font-medium capitalize">{iface.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{iface.iface} | Metric: {iface.metric}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(iface.status)}>
                        {iface.status}
                      </Badge>
                      <Switch
                        checked={iface.enabled}
                        onCheckedChange={() => toast.info("Gunakan hapus/tambah untuk saat ini")}
                      />
                    </div>
                  </div>

                  {/* Removed download/upload/latency/usage display */}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Bobot (mwan3 weight)</span>
                      <span className="font-medium">{iface.weight} ({totalWeight > 0 ? ((iface.weight / totalWeight) * 100).toFixed(0) : 0}% aktual)</span>
                    </div>
                    <Input
                      type="range"
                      value={iface.weight}
                      onChange={(e) => handleWeightChange(iface.iface, parseInt(e.target.value))}
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
                      onClick={() => handleTestConnection(iface.iface)}
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Check
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteInterface(iface.iface)}
                    >
                      <Trash2 className="w-3 h-3 text-red-400" />
                    </Button>
                  </div>
                </div>
              ))}

              {interfaces.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Network className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Belum ada interface WAN di mwan3</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Traffic Distribution */}
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Distribusi Traffic Teoritis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {interfaces.filter(i => i.enabled && i.status === "online").map((iface) => {
                const percentage = totalWeight > 0 ? (iface.weight / totalWeight) * 100 : 0;
                return (
                  <div key={iface.iface} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 capitalize">
                        {getTypeIcon(iface.type || "ethernet")}
                        {iface.iface}
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
                  <span>Tidak ada WAN online di mwan3</span>
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
