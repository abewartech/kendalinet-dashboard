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

const ZeroTierManager = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [nodeId, setNodeId] = useState("a1b2c3d4e5");
  const [newNetworkId, setNewNetworkId] = useState("");
  const [networks, setNetworks] = useState<ZeroTierNetwork[]>([
    {
      id: "1",
      name: "Home Network",
      networkId: "8056c2e21c000001",
      status: "connected",
      assignedIp: "10.147.17.23",
      gateway: "10.147.17.1",
      allowDefault: false,
      allowGlobal: false,
      allowManaged: true,
      bridging: false,
      peers: 5,
      lastActivity: "2 menit lalu"
    },
    {
      id: "2",
      name: "Office VPN",
      networkId: "93afae5963000002",
      status: "connected",
      assignedIp: "10.243.0.15",
      gateway: "10.243.0.1",
      allowDefault: true,
      allowGlobal: true,
      allowManaged: true,
      bridging: true,
      peers: 12,
      lastActivity: "5 menit lalu"
    }
  ]);

  const [peers, setPeers] = useState<ZeroTierPeer[]>([
    { id: "1", name: "planet.zerotier.com", address: "62f865ae71", latency: 45, role: "planet", status: "online", paths: 2 },
    { id: "2", name: "moon-sg.zerotier.com", address: "778cde7190", latency: 23, role: "moon", status: "online", paths: 1 },
    { id: "3", name: "Laptop-Work", address: "a1b2c3d4e5", latency: 5, role: "leaf", status: "online", paths: 1 },
    { id: "4", name: "Server-Home", address: "f5e4d3c2b1", latency: 12, role: "leaf", status: "online", paths: 2 },
    { id: "5", name: "Phone-Android", address: "1a2b3c4d5e", latency: 0, role: "leaf", status: "offline", paths: 0 }
  ]);

  const handleToggleService = (enabled: boolean) => {
    setIsEnabled(enabled);
    toast.success(enabled ? "ZeroTier diaktifkan" : "ZeroTier dinonaktifkan");
  };

  const handleJoinNetwork = () => {
    if (!newNetworkId || newNetworkId.length !== 16) {
      toast.error("Network ID harus 16 karakter");
      return;
    }

    const newNetwork: ZeroTierNetwork = {
      id: Date.now().toString(),
      name: "New Network",
      networkId: newNetworkId,
      status: "pending",
      assignedIp: "-",
      gateway: "-",
      allowDefault: false,
      allowGlobal: false,
      allowManaged: true,
      bridging: false,
      peers: 0,
      lastActivity: "Baru saja"
    };

    setNetworks([...networks, newNetwork]);
    setNewNetworkId("");
    toast.success("Bergabung ke jaringan...", {
      description: `Menunggu otorisasi untuk ${newNetworkId}`
    });
  };

  const handleLeaveNetwork = (id: string) => {
    setNetworks(networks.filter(n => n.id !== id));
    toast.success("Keluar dari jaringan");
  };

  const handleToggleNetworkSetting = (id: string, setting: keyof ZeroTierNetwork, value: boolean) => {
    setNetworks(networks.map(n => 
      n.id === id ? { ...n, [setting]: value } : n
    ));
    toast.success("Pengaturan jaringan diperbarui");
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

  const connectedNetworks = networks.filter(n => n.status === "connected").length;
  const onlinePeers = peers.filter(p => p.status === "online").length;

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
              <p className="text-2xl font-bold text-cyan-400">{peers.length}</p>
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
          {networks.map((network) => (
            <Card key={network.id} className="glass-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(network.status)}
                    <div>
                      <CardTitle className="text-base">{network.name}</CardTitle>
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
                        <p className="font-mono font-semibold text-sm">{network.assignedIp}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30">
                        <p className="text-xs text-muted-foreground">Gateway</p>
                        <p className="font-mono font-semibold text-sm">{network.gateway}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-muted/30">
                        <p className="text-xs text-muted-foreground">Peers</p>
                        <p className="font-semibold">{network.peers} perangkat</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30">
                        <p className="text-xs text-muted-foreground">Aktivitas</p>
                        <p className="font-semibold text-sm">{network.lastActivity}</p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Allow Default Route</Label>
                        <Switch
                          checked={network.allowDefault}
                          onCheckedChange={(v) => handleToggleNetworkSetting(network.id, "allowDefault", v)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Allow Global IP</Label>
                        <Switch
                          checked={network.allowGlobal}
                          onCheckedChange={(v) => handleToggleNetworkSetting(network.id, "allowGlobal", v)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Allow Managed</Label>
                        <Switch
                          checked={network.allowManaged}
                          onCheckedChange={(v) => handleToggleNetworkSetting(network.id, "allowManaged", v)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Bridging</Label>
                        <Switch
                          checked={network.bridging}
                          onCheckedChange={(v) => handleToggleNetworkSetting(network.id, "bridging", v)}
                        />
                      </div>
                    </div>
                  </>
                )}

                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => handleLeaveNetwork(network.id)}
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
                  Daftar Peer ({peers.length})
                </CardTitle>
                <Button variant="ghost" size="sm">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {peers.map((peer) => (
                <div
                  key={peer.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    {getRoleIcon(peer.role)}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{peer.name}</p>
                        {getStatusIcon(peer.status)}
                      </div>
                      <p className="text-xs font-mono text-muted-foreground">
                        {peer.address}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {peer.status === "online" ? (
                      <>
                        <p className="text-sm font-semibold text-green-400">
                          {peer.latency}ms
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {peer.paths} path
                        </p>
                      </>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
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
