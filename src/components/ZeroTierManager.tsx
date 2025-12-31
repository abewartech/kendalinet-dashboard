import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Globe2,
  Network,
  Plus,
  Trash2,
  Copy,
  RefreshCw,
  Shield,
  Users,
  Activity,
  Settings,
  Link,
  Unlink,
  CheckCircle2,
  XCircle,
  Clock,
  Laptop,
  Server
} from "lucide-react";

interface ZeroTierNetwork {
  id: string;
  name: string;
  networkId: string;
  status: "connected" | "disconnected" | "pending";
  assignedIp: string;
  gateway: string;
  allowDefault: boolean;
  allowGlobal: boolean;
  allowManaged: boolean;
  bridging: boolean;
  peers: number;
  lastActivity: string;
}

interface ZeroTierPeer {
  id: string;
  name: string;
  address: string;
  latency: number;
  role: "leaf" | "moon" | "planet";
  status: "online" | "offline";
  paths: number;
}

import { useEffect } from "react";
import { useLuciApi } from "@/hooks/useLuciApi";

const ZeroTierManager = () => {
  const {
    ztStatus,
    ztNetworks,
    ztPeers,
    fetchZtStatus,
    fetchZtNetworks,
    fetchZtPeers,
    toggleZt,
    joinZt,
    leaveZt,
    setZtFlags,
    toggleZtBridge
  } = useLuciApi();

  const [newNetworkId, setNewNetworkId] = useState("");

  const isEnabled = ztStatus?.enabled || false;
  const nodeId = ztStatus?.nodeId || "Menghubungkan...";

  useEffect(() => {
    const load = async () => {
      await Promise.all([
        fetchZtStatus(),
        fetchZtNetworks(),
        fetchZtPeers()
      ]);
    };
    load();
  }, []);

  const handleToggleService = async (enabled: boolean) => {
    const res = await toggleZt(enabled);
    if (res.success) {
      toast.success(enabled ? "ZeroTier diaktifkan" : "ZeroTier dinonaktifkan");
      setTimeout(fetchZtStatus, 1500);
    } else {
      toast.error("Gagal mengubah status ZeroTier");
    }
  };

  const handleJoinNetwork = async () => {
    if (!newNetworkId || newNetworkId.length !== 16) {
      toast.error("Network ID harus 16 karakter");
      return;
    }

    const res = await joinZt(newNetworkId);
    if (res.success) {
      setNewNetworkId("");
      toast.success("Bergabung ke jaringan...", {
        description: `Menunggu otorisasi untuk ${newNetworkId}`
      });
      setTimeout(fetchZtNetworks, 2000);
    } else {
      toast.error("Gagal bergabung ke jaringan");
    }
  };

  const handleLeaveNetwork = async (networkId: string) => {
    const res = await leaveZt(networkId);
    if (res.success) {
      toast.success("Keluar dari jaringan");
      fetchZtNetworks();
    } else {
      toast.error("Gagal keluar dari jaringan");
    }
  };

  const handleToggleNetworkSetting = async (networkId: string, setting: string, value: boolean) => {
    if (setting === "bridging") {
      const res = await toggleZtBridge(networkId, value);
      if (res.success) {
        toast.success(`Broadcasting/Bridging ${value ? 'diaktifkan' : 'dinonaktifkan'}`);
        fetchZtNetworks();
      } else {
        toast.error("Gagal mengubah pengaturan bridging");
      }
      return;
    }

    // For route flags (allowDefault, allowGlobal, allowManaged)
    const currentNetwork = (ztNetworks || []).find((n: any) => n.networkId === networkId);
    const flags = {
      networkId,
      allowDefault: currentNetwork?.allowDefault || false,
      allowGlobal: currentNetwork?.allowGlobal || false,
      allowManaged: currentNetwork?.allowManaged || true,
      [setting]: value
    };

    const res = await setZtFlags(flags);
    if (res.success) {
      toast.success("Pengaturan rute diperbarui");
      // Restarting zerotier takes a bit, so we wait before refresh
      setTimeout(fetchZtNetworks, 2000);
    } else {
      toast.error("Gagal memperbarui pengaturan rute");
    }
  };

  const handleRefresh = async () => {
    toast.promise(Promise.all([fetchZtStatus(), fetchZtNetworks(), fetchZtPeers()]), {
      loading: 'Menyegarkan data...',
      success: 'Data diperbarui',
      error: 'Gagal menyegarkan data'
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} disalin ke clipboard`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
      case "online":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "disconnected":
      case "offline":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Terhubung</Badge>;
      case "disconnected":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Terputus</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Menunggu</Badge>;
      default:
        return null;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "planet":
        return <Globe2 className="w-4 h-4 text-blue-400" />;
      case "moon":
        return <Server className="w-4 h-4 text-purple-400" />;
      case "leaf":
        return <Laptop className="w-4 h-4 text-cyan-400" />;
      default:
        return null;
    }
  };

  const connectedNetworks = (ztNetworks || []).filter((n: any) => n.status === "connected").length;
  const onlinePeers = (ztPeers || []).filter((p: any) => p.status === "online").length;

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <Card className="glass-card border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                <Globe2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">ZeroTier Manager</h2>
                <p className="text-muted-foreground text-sm">
                  Kelola jaringan virtual SD-WAN
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {isEnabled ? "Aktif" : "Nonaktif"}
              </span>
              <Switch
                checked={isEnabled}
                onCheckedChange={handleToggleService}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Node Info */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Network className="w-4 h-4 text-primary" />
            Informasi Node
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <div>
              <p className="text-xs text-muted-foreground">Node ID</p>
              <p className="font-mono font-semibold">{nodeId}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(nodeId, "Node ID")}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg bg-muted/30">
              <p className="text-2xl font-bold text-primary">{connectedNetworks}</p>
              <p className="text-xs text-muted-foreground">Jaringan</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/30">
              <p className="text-2xl font-bold text-green-400">{onlinePeers}</p>
              <p className="text-xs text-muted-foreground">Peer Online</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/30">
              <p className="text-2xl font-bold text-cyan-400">{ztPeers?.length || 0}</p>
              <p className="text-xs text-muted-foreground">Total Peer</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="networks" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="networks" className="gap-2">
            <Link className="w-4 h-4" />
            Jaringan
          </TabsTrigger>
          <TabsTrigger value="peers" className="gap-2">
            <Users className="w-4 h-4" />
            Peers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="networks" className="space-y-4">
          {/* Join Network */}
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" />
                Gabung Jaringan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Network ID (16 karakter)"
                  value={newNetworkId}
                  onChange={(e) => setNewNetworkId(e.target.value)}
                  maxLength={16}
                  className="font-mono"
                />
                <Button onClick={handleJoinNetwork} disabled={!isEnabled}>
                  <Plus className="w-4 h-4 mr-2" />
                  Gabung
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Network List */}
          {(ztNetworks || []).map((network: any) => (
            <Card key={network.networkId} className="glass-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(network.status)}
                    <div>
                      <CardTitle className="text-base">{network.name || 'Jaringan ZeroTier'}</CardTitle>
                      <p className="text-xs font-mono text-muted-foreground">
                        {network.networkId}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(network.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {network.status === "connected" && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-muted/30">
                        <p className="text-xs text-muted-foreground">IP Address</p>
                        <p className="font-mono font-semibold text-sm truncate">{network.assignedIp}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30">
                        <p className="text-xs text-muted-foreground">Device</p>
                        <p className="font-mono font-semibold text-sm truncate">{network.dev || '-'}</p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-sm">Allow Default Route</Label>
                          <p className="text-xs text-muted-foreground">Gunakan rute default ZeroTier</p>
                        </div>
                        <Switch
                          checked={network.allowDefault === "1" || network.allowDefault === true}
                          onCheckedChange={(v) => handleToggleNetworkSetting(network.networkId, "allowDefault", v)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-sm">Allow Global IP</Label>
                          <p className="text-xs text-muted-foreground">Izinkan IP global ZeroTier</p>
                        </div>
                        <Switch
                          checked={network.allowGlobal === "1" || network.allowGlobal === true}
                          onCheckedChange={(v) => handleToggleNetworkSetting(network.networkId, "allowGlobal", v)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-sm">Allow Managed</Label>
                          <p className="text-xs text-muted-foreground">Terima konfigurasi IP otomatis</p>
                        </div>
                        <Switch
                          checked={network.allowManaged === "1" || network.allowManaged === true || network.allowManaged === undefined}
                          onCheckedChange={(v) => handleToggleNetworkSetting(network.networkId, "allowManaged", v)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-sm">Bridging / Broadcast</Label>
                          <p className="text-xs text-muted-foreground">Bridge ke interface br-lan</p>
                        </div>
                        <Switch
                          checked={network.bridging === "1" || network.bridging === true}
                          onCheckedChange={(v) => handleToggleNetworkSetting(network.networkId, "bridging", v)}
                        />
                      </div>
                    </div>
                  </>
                )}

                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => handleLeaveNetwork(network.networkId)}
                >
                  <Unlink className="w-4 h-4 mr-2" />
                  Keluar dari Jaringan
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="peers" className="space-y-4">
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Daftar Peer ({ztPeers?.length || 0})
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={handleRefresh}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {(ztPeers || []).map((peer: any) => (
                <div
                  key={peer.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {getRoleIcon(peer.role)}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm truncate">{peer.name || 'Peer'}</p>
                        {getStatusIcon(peer.status)}
                      </div>
                      <p className="text-xs font-mono text-muted-foreground">
                        {peer.address}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    {peer.status === "online" ? (
                      <>
                        <p className="text-sm font-semibold text-green-400">
                          {peer.latency}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {peer.path || 'no path'}
                        </p>
                      </>
                    ) : (
                      <Badge variant="secondary" className="text-[10px] h-5">
                        Offline
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Legend */}
          <Card className="glass-card">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-3">Keterangan:</p>
              <div className="flex flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-blue-400" />
                  <span>Planet (Root)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-purple-400" />
                  <span>Moon (Relay)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-cyan-400" />
                  <span>Leaf (Device)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ZeroTierManager;
