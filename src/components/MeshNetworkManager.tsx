import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  Radio, 
  Wifi, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Signal, 
  Zap,
  MapPin,
  Link2,
  Settings,
  AlertTriangle,
  CheckCircle2,
  Clock
} from "lucide-react";

interface MeshNode {
  id: string;
  name: string;
  mac: string;
  ip: string;
  role: "controller" | "satellite";
  status: "online" | "offline" | "connecting";
  signal: number;
  clients: number;
  uptime: string;
  location: string;
  band: "2.4GHz" | "5GHz" | "dual";
  backhaul: "wireless" | "wired";
  firmware: string;
}

const MeshNetworkManager = () => {
  const [meshEnabled, setMeshEnabled] = useState(true);
  const [seamlessRoaming, setSeamlessRoaming] = useState(true);
  const [bandSteering, setBandSteering] = useState(true);
  const [showAddNode, setShowAddNode] = useState(false);
  
  const [nodes, setNodes] = useState<MeshNode[]>([
    {
      id: "1",
      name: "Router Utama",
      mac: "AA:BB:CC:DD:EE:01",
      ip: "192.168.1.1",
      role: "controller",
      status: "online",
      signal: 100,
      clients: 8,
      uptime: "5d 12h",
      location: "Ruang Tamu",
      band: "dual",
      backhaul: "wired",
      firmware: "v2.1.0"
    },
    {
      id: "2",
      name: "Mesh Node 1",
      mac: "AA:BB:CC:DD:EE:02",
      ip: "192.168.1.2",
      role: "satellite",
      status: "online",
      signal: 85,
      clients: 4,
      uptime: "5d 10h",
      location: "Lantai 2",
      band: "dual",
      backhaul: "wireless",
      firmware: "v2.1.0"
    },
    {
      id: "3",
      name: "Mesh Node 2",
      mac: "AA:BB:CC:DD:EE:03",
      ip: "192.168.1.3",
      role: "satellite",
      status: "online",
      signal: 72,
      clients: 3,
      uptime: "3d 8h",
      location: "Kamar Belakang",
      band: "5GHz",
      backhaul: "wireless",
      firmware: "v2.0.5"
    },
    {
      id: "4",
      name: "Mesh Node 3",
      mac: "AA:BB:CC:DD:EE:04",
      ip: "192.168.1.4",
      role: "satellite",
      status: "offline",
      signal: 0,
      clients: 0,
      uptime: "-",
      location: "Garasi",
      band: "dual",
      backhaul: "wireless",
      firmware: "v2.0.5"
    }
  ]);

  const [newNode, setNewNode] = useState({ name: "", location: "" });

  const handleToggleMesh = (enabled: boolean) => {
    setMeshEnabled(enabled);
    toast.success(enabled ? "Mesh Network diaktifkan" : "Mesh Network dinonaktifkan");
  };

  const handleAddNode = () => {
    if (!newNode.name) {
      toast.error("Nama node wajib diisi");
      return;
    }

    toast.success("Memindai node baru...");
    setTimeout(() => {
      const node: MeshNode = {
        id: Date.now().toString(),
        name: newNode.name,
        mac: `AA:BB:CC:DD:EE:${Math.floor(Math.random() * 99).toString().padStart(2, '0')}`,
        ip: `192.168.1.${nodes.length + 1}`,
        role: "satellite",
        status: "connecting",
        signal: 0,
        clients: 0,
        uptime: "-",
        location: newNode.location || "Unknown",
        band: "dual",
        backhaul: "wireless",
        firmware: "v2.1.0"
      };

      setNodes([...nodes, node]);
      setNewNode({ name: "", location: "" });
      setShowAddNode(false);
      toast.success(`Node "${node.name}" sedang dipasangkan...`);

      // Simulate connection
      setTimeout(() => {
        setNodes(prev => prev.map(n => 
          n.id === node.id ? { ...n, status: "online", signal: Math.floor(Math.random() * 30) + 60 } : n
        ));
        toast.success(`Node "${node.name}" berhasil terhubung!`);
      }, 3000);
    }, 1500);
  };

  const handleRemoveNode = (id: string) => {
    const node = nodes.find(n => n.id === id);
    if (node?.role === "controller") {
      toast.error("Tidak dapat menghapus router utama");
      return;
    }
    setNodes(nodes.filter(n => n.id !== id));
    toast.success(`Node "${node?.name}" dihapus dari mesh`);
  };

  const handleRebootNode = (id: string) => {
    const node = nodes.find(n => n.id === id);
    setNodes(nodes.map(n => n.id === id ? { ...n, status: "connecting" } : n));
    toast.success(`Merestart "${node?.name}"...`);
    
    setTimeout(() => {
      setNodes(prev => prev.map(n => 
        n.id === id ? { ...n, status: "online" } : n
      ));
      toast.success(`"${node?.name}" kembali online`);
    }, 5000);
  };

  const getSignalColor = (signal: number) => {
    if (signal >= 80) return "text-green-400";
    if (signal >= 50) return "text-yellow-400";
    if (signal > 0) return "text-orange-400";
    return "text-muted-foreground";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online": return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case "offline": return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case "connecting": return <Clock className="w-4 h-4 text-yellow-400 animate-pulse" />;
      default: return null;
    }
  };

  const onlineNodes = nodes.filter(n => n.status === "online").length;
  const totalClients = nodes.reduce((sum, n) => sum + n.clients, 0);

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <Card className="glass-card border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                meshEnabled ? "bg-primary/20" : "bg-muted"
              }`}>
                <Radio className={`w-7 h-7 ${meshEnabled ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Mesh Network</h3>
                <p className="text-sm text-muted-foreground">
                  WiFi seamless di seluruh rumah
                </p>
              </div>
            </div>
            <Switch checked={meshEnabled} onCheckedChange={handleToggleMesh} />
          </div>

          {meshEnabled && (
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 rounded-xl bg-background/50">
                <Radio className="w-5 h-5 mx-auto mb-1 text-primary" />
                <p className="text-lg font-bold">{onlineNodes}/{nodes.length}</p>
                <p className="text-xs text-muted-foreground">Nodes Online</p>
              </div>
              <div className="p-3 rounded-xl bg-background/50">
                <Wifi className="w-5 h-5 mx-auto mb-1 text-green-400" />
                <p className="text-lg font-bold">{totalClients}</p>
                <p className="text-xs text-muted-foreground">Total Clients</p>
              </div>
              <div className="p-3 rounded-xl bg-background/50">
                <Zap className="w-5 h-5 mx-auto mb-1 text-yellow-400" />
                <p className="text-lg font-bold">{seamlessRoaming ? "ON" : "OFF"}</p>
                <p className="text-xs text-muted-foreground">Fast Roaming</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {meshEnabled && (
        <>
          {/* Quick Settings */}
          <Card className="glass-card border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Pengaturan Mesh
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Seamless Roaming (802.11r)</p>
                  <p className="text-xs text-muted-foreground">Perpindahan node tanpa putus</p>
                </div>
                <Switch checked={seamlessRoaming} onCheckedChange={setSeamlessRoaming} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Band Steering</p>
                  <p className="text-xs text-muted-foreground">Otomatis pilih band terbaik</p>
                </div>
                <Switch checked={bandSteering} onCheckedChange={setBandSteering} />
              </div>
            </CardContent>
          </Card>

          {/* Node List */}
          <div className="flex justify-between items-center">
            <h4 className="font-semibold">Mesh Nodes</h4>
            <Dialog open={showAddNode} onOpenChange={setShowAddNode}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Tambah Node
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Mesh Node</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Pastikan node baru dalam mode pairing dan berada dalam jangkauan.
                  </p>
                  <div className="space-y-2">
                    <Label>Nama Node</Label>
                    <Input
                      placeholder="Mesh Node Lantai 3"
                      value={newNode.name}
                      onChange={(e) => setNewNode({ ...newNode, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Lokasi</Label>
                    <Input
                      placeholder="Lantai 3, Kamar Tidur"
                      value={newNode.location}
                      onChange={(e) => setNewNode({ ...newNode, location: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleAddNode} className="w-full">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Scan & Tambah Node
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-3">
            {nodes.map((node) => (
              <Card key={node.id} className="glass-card border-0">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        node.role === "controller" ? "bg-primary/20" : "bg-secondary"
                      }`}>
                        {node.role === "controller" ? (
                          <Radio className="w-6 h-6 text-primary" />
                        ) : (
                          <Wifi className={`w-6 h-6 ${node.status === "online" ? "text-green-400" : "text-muted-foreground"}`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{node.name}</h4>
                          {getStatusIcon(node.status)}
                          {node.role === "controller" && (
                            <Badge variant="default" className="text-xs">Controller</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{node.location}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3 mt-3 text-xs">
                          <div>
                            <span className="text-muted-foreground">Signal</span>
                            <div className="flex items-center gap-1">
                              <Signal className={`w-3 h-3 ${getSignalColor(node.signal)}`} />
                              <span className={getSignalColor(node.signal)}>{node.signal}%</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Clients</span>
                            <p className="font-medium">{node.clients}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Uptime</span>
                            <p className="font-medium">{node.uptime}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">{node.band}</Badge>
                          <Badge variant="outline" className="text-xs flex items-center gap-1">
                            <Link2 className="w-3 h-3" />
                            {node.backhaul}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleRebootNode(node.id)}
                        disabled={node.status === "connecting"}
                      >
                        <RefreshCw className={`w-4 h-4 ${node.status === "connecting" ? "animate-spin" : ""}`} />
                      </Button>
                      {node.role !== "controller" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleRemoveNode(node.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Coverage Indicator */}
          <Card className="glass-card border-0 bg-primary/5">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Signal className="w-4 h-4" />
                Estimasi Coverage
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Area Tercakup</span>
                  <span className="font-medium">{onlineNodes * 50} m²</span>
                </div>
                <Progress value={(onlineNodes / nodes.length) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {nodes.length} node dapat mencakup area hingga {nodes.length * 50} m² dengan kualitas optimal
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default MeshNetworkManager;
