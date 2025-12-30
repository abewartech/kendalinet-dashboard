import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Layers, 
  Plus, 
  Trash2, 
  Edit2,
  Save,
  Network,
  Wifi,
  Cable,
  Shield,
  Tag,
  Info,
  CheckCircle2,
  Settings2
} from "lucide-react";
import { toast } from "sonner";

interface VLAN {
  id: string;
  vlanId: number;
  name: string;
  description: string;
  interface: string;
  ipAddress: string;
  subnet: string;
  enabled: boolean;
  tagged: boolean;
  color: string;
}

const predefinedColors = [
  { name: "Biru", value: "#3B82F6" },
  { name: "Hijau", value: "#22C55E" },
  { name: "Kuning", value: "#EAB308" },
  { name: "Merah", value: "#EF4444" },
  { name: "Ungu", value: "#8B5CF6" },
  { name: "Pink", value: "#EC4899" },
  { name: "Cyan", value: "#06B6D4" },
  { name: "Orange", value: "#F97316" },
];

const VLANManagement = () => {
  const [vlans, setVlans] = useState<VLAN[]>([
    {
      id: "1",
      vlanId: 10,
      name: "Management",
      description: "VLAN untuk manajemen jaringan",
      interface: "eth0",
      ipAddress: "192.168.10.1",
      subnet: "255.255.255.0",
      enabled: true,
      tagged: true,
      color: "#3B82F6"
    },
    {
      id: "2",
      vlanId: 20,
      name: "Staff",
      description: "VLAN untuk karyawan",
      interface: "eth0",
      ipAddress: "192.168.20.1",
      subnet: "255.255.255.0",
      enabled: true,
      tagged: true,
      color: "#22C55E"
    },
    {
      id: "3",
      vlanId: 30,
      name: "Guest",
      description: "VLAN untuk tamu",
      interface: "eth0",
      ipAddress: "192.168.30.1",
      subnet: "255.255.255.0",
      enabled: true,
      tagged: true,
      color: "#EAB308"
    },
    {
      id: "4",
      vlanId: 100,
      name: "IoT Devices",
      description: "VLAN untuk perangkat IoT",
      interface: "eth1",
      ipAddress: "192.168.100.1",
      subnet: "255.255.255.0",
      enabled: false,
      tagged: false,
      color: "#8B5CF6"
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newVlan, setNewVlan] = useState({
    vlanId: 1,
    name: "",
    description: "",
    interface: "eth0",
    ipAddress: "",
    subnet: "255.255.255.0",
    tagged: true,
    color: "#3B82F6"
  });

  const activeVlans = vlans.filter(v => v.enabled).length;
  const totalVlans = vlans.length;

  const handleAddVlan = () => {
    if (!newVlan.name || !newVlan.ipAddress) {
      toast.error("Nama dan IP Address wajib diisi");
      return;
    }

    if (vlans.some(v => v.vlanId === newVlan.vlanId)) {
      toast.error("VLAN ID sudah digunakan");
      return;
    }

    const vlan: VLAN = {
      id: Date.now().toString(),
      ...newVlan,
      enabled: true
    };

    setVlans([...vlans, vlan]);
    setNewVlan({
      vlanId: Math.max(...vlans.map(v => v.vlanId)) + 10,
      name: "",
      description: "",
      interface: "eth0",
      ipAddress: "",
      subnet: "255.255.255.0",
      tagged: true,
      color: "#3B82F6"
    });
    setShowAddForm(false);
    toast.success("VLAN berhasil ditambahkan");
  };

  const handleDeleteVlan = (id: string) => {
    setVlans(vlans.filter(v => v.id !== id));
    toast.success("VLAN dihapus");
  };

  const handleToggleVlan = (id: string) => {
    setVlans(vlans.map(v => 
      v.id === id ? { ...v, enabled: !v.enabled } : v
    ));
  };

  const handleSaveAll = () => {
    localStorage.setItem("vlanConfigs", JSON.stringify(vlans));
    toast.success("Pengaturan VLAN disimpan!");
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto glass-card rounded-2xl flex items-center justify-center mb-4">
          <Layers className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">VLAN Management</h1>
        <p className="text-muted-foreground text-sm">
          Kelola Virtual LAN untuk segmentasi jaringan
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="glass-card border-border/50">
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-primary">{totalVlans}</p>
            <p className="text-xs text-muted-foreground">Total VLAN</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-green-400">{activeVlans}</p>
            <p className="text-xs text-muted-foreground">Aktif</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-yellow-400">{totalVlans - activeVlans}</p>
            <p className="text-xs text-muted-foreground">Nonaktif</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Button */}
      <Button 
        className="w-full" 
        variant="outline"
        onClick={() => setShowAddForm(!showAddForm)}
      >
        <Plus className="w-4 h-4 mr-2" />
        Tambah VLAN Baru
      </Button>

      {/* Add Form */}
      {showAddForm && (
        <Card className="glass-card border-primary/30 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Buat VLAN Baru
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs">VLAN ID</Label>
                <Input 
                  type="number"
                  value={newVlan.vlanId}
                  onChange={(e) => setNewVlan({...newVlan, vlanId: parseInt(e.target.value) || 1})}
                  min={1}
                  max={4094}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Nama</Label>
                <Input 
                  value={newVlan.name}
                  onChange={(e) => setNewVlan({...newVlan, name: e.target.value})}
                  placeholder="Management"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Deskripsi</Label>
              <Input 
                value={newVlan.description}
                onChange={(e) => setNewVlan({...newVlan, description: e.target.value})}
                placeholder="VLAN untuk..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs">Interface</Label>
                <Select 
                  value={newVlan.interface} 
                  onValueChange={(v) => setNewVlan({...newVlan, interface: v})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eth0">eth0 (LAN)</SelectItem>
                    <SelectItem value="eth1">eth1 (WAN)</SelectItem>
                    <SelectItem value="br-lan">br-lan (Bridge)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Warna Label</Label>
                <Select 
                  value={newVlan.color} 
                  onValueChange={(v) => setNewVlan({...newVlan, color: v})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {predefinedColors.map(c => (
                      <SelectItem key={c.value} value={c.value}>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.value }} />
                          {c.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs">IP Address</Label>
                <Input 
                  value={newVlan.ipAddress}
                  onChange={(e) => setNewVlan({...newVlan, ipAddress: e.target.value})}
                  placeholder="192.168.10.1"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Subnet Mask</Label>
                <Select 
                  value={newVlan.subnet} 
                  onValueChange={(v) => setNewVlan({...newVlan, subnet: v})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="255.255.255.0">/24 (255.255.255.0)</SelectItem>
                    <SelectItem value="255.255.0.0">/16 (255.255.0.0)</SelectItem>
                    <SelectItem value="255.255.255.128">/25 (255.255.255.128)</SelectItem>
                    <SelectItem value="255.255.255.192">/26 (255.255.255.192)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-card/50 border border-border/30">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Tagged VLAN</span>
              </div>
              <Switch 
                checked={newVlan.tagged}
                onCheckedChange={(v) => setNewVlan({...newVlan, tagged: v})}
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowAddForm(false)}>
                Batal
              </Button>
              <Button className="flex-1" onClick={handleAddVlan}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* VLAN List */}
      <Card className="glass-card border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Network className="w-5 h-5 text-primary" />
            Daftar VLAN
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {vlans.map((vlan) => (
            <div 
              key={vlan.id}
              className={`p-4 rounded-xl border space-y-3 ${vlan.enabled ? "bg-card/50 border-border/30" : "bg-muted/20 border-muted/30 opacity-60"}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${vlan.color}20` }}
                  >
                    <Layers className="w-5 h-5" style={{ color: vlan.color }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{vlan.name}</p>
                      <Badge 
                        variant="outline" 
                        className="text-[10px] px-1.5"
                        style={{ borderColor: vlan.color, color: vlan.color }}
                      >
                        VLAN {vlan.vlanId}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{vlan.description}</p>
                  </div>
                </div>
                <Switch 
                  checked={vlan.enabled}
                  onCheckedChange={() => handleToggleVlan(vlan.id)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50">
                  <Cable className="w-3 h-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Interface:</span>
                  <span className="font-mono">{vlan.interface}</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50">
                  <Wifi className="w-3 h-3 text-muted-foreground" />
                  <span className="text-muted-foreground">IP:</span>
                  <span className="font-mono">{vlan.ipAddress}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/30">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={vlan.tagged ? "bg-blue-500/20 text-blue-400 border-blue-500/30" : "bg-muted text-muted-foreground"}>
                    {vlan.tagged ? "Tagged" : "Untagged"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{vlan.subnet}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDeleteVlan(vlan.id)}
                >
                  <Trash2 className="w-3 h-3 text-red-400" />
                </Button>
              </div>
            </div>
          ))}

          {vlans.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Layers className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Belum ada VLAN dikonfigurasi</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info */}
      <Card className="glass-card border-blue-500/30 bg-blue-500/5">
        <CardContent className="pt-4">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-400">Keuntungan VLAN</p>
              <ul className="text-muted-foreground mt-2 space-y-1 text-xs">
                <li>• Segmentasi jaringan untuk keamanan lebih baik</li>
                <li>• Isolasi traffic antara departemen/grup</li>
                <li>• Manajemen bandwidth per segmen</li>
                <li>• Mengurangi broadcast domain</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button className="w-full" onClick={handleSaveAll}>
        <Save className="w-4 h-4 mr-2" />
        Simpan Pengaturan
      </Button>
    </div>
  );
};

export default VLANManagement;
