import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowRightLeft, Plus, Trash2, Network, Globe, Server, Edit2 } from "lucide-react";
import { toast } from "sonner";

interface PortRule {
  id: string;
  name: string;
  protocol: "tcp" | "udp" | "tcp+udp";
  externalPort: string;
  internalIP: string;
  internalPort: string;
  enabled: boolean;
}

const PortForwarding = () => {
  const [rules, setRules] = useState<PortRule[]>([
    {
      id: "1",
      name: "Web Server",
      protocol: "tcp",
      externalPort: "80",
      internalIP: "192.168.1.100",
      internalPort: "80",
      enabled: true,
    },
    {
      id: "2",
      name: "SSH Access",
      protocol: "tcp",
      externalPort: "2222",
      internalIP: "192.168.1.100",
      internalPort: "22",
      enabled: true,
    },
    {
      id: "3",
      name: "Game Server",
      protocol: "udp",
      externalPort: "27015",
      internalIP: "192.168.1.50",
      internalPort: "27015",
      enabled: false,
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<PortRule | null>(null);
  const [newRule, setNewRule] = useState<Omit<PortRule, "id" | "enabled">>({
    name: "",
    protocol: "tcp",
    externalPort: "",
    internalIP: "",
    internalPort: "",
  });

  const presetTemplates = [
    { name: "HTTP Server", protocol: "tcp" as const, externalPort: "80", internalPort: "80" },
    { name: "HTTPS Server", protocol: "tcp" as const, externalPort: "443", internalPort: "443" },
    { name: "SSH", protocol: "tcp" as const, externalPort: "22", internalPort: "22" },
    { name: "FTP", protocol: "tcp" as const, externalPort: "21", internalPort: "21" },
    { name: "Minecraft", protocol: "tcp+udp" as const, externalPort: "25565", internalPort: "25565" },
    { name: "Remote Desktop", protocol: "tcp" as const, externalPort: "3389", internalPort: "3389" },
  ];

  const handleToggleRule = (id: string) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
    const rule = rules.find(r => r.id === id);
    toast.success(`Rule "${rule?.name}" ${rule?.enabled ? "dinonaktifkan" : "diaktifkan"}`);
  };

  const handleAddRule = () => {
    if (!newRule.name || !newRule.externalPort || !newRule.internalIP || !newRule.internalPort) {
      toast.error("Semua field harus diisi");
      return;
    }

    if (editingRule) {
      setRules(rules.map(rule => 
        rule.id === editingRule.id 
          ? { ...rule, ...newRule }
          : rule
      ));
      toast.success(`Rule "${newRule.name}" berhasil diperbarui`);
    } else {
      const rule: PortRule = {
        id: Date.now().toString(),
        ...newRule,
        enabled: true,
      };
      setRules([...rules, rule]);
      toast.success(`Rule "${newRule.name}" berhasil ditambahkan`);
    }

    setNewRule({
      name: "",
      protocol: "tcp",
      externalPort: "",
      internalIP: "",
      internalPort: "",
    });
    setEditingRule(null);
    setIsDialogOpen(false);
  };

  const handleDeleteRule = (id: string) => {
    const rule = rules.find(r => r.id === id);
    setRules(rules.filter(r => r.id !== id));
    toast.success(`Rule "${rule?.name}" berhasil dihapus`);
  };

  const handleEditRule = (rule: PortRule) => {
    setEditingRule(rule);
    setNewRule({
      name: rule.name,
      protocol: rule.protocol,
      externalPort: rule.externalPort,
      internalIP: rule.internalIP,
      internalPort: rule.internalPort,
    });
    setIsDialogOpen(true);
  };

  const applyTemplate = (template: typeof presetTemplates[0]) => {
    setNewRule({
      ...newRule,
      name: template.name,
      protocol: template.protocol,
      externalPort: template.externalPort,
      internalPort: template.internalPort,
    });
  };

  const getProtocolBadgeClass = (protocol: string) => {
    switch (protocol) {
      case "tcp":
        return "bg-blue-500/20 text-blue-400";
      case "udp":
        return "bg-green-500/20 text-green-400";
      case "tcp+udp":
        return "bg-purple-500/20 text-purple-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-4">
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-primary" />
              Port Forwarding
            </CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                setEditingRule(null);
                setNewRule({
                  name: "",
                  protocol: "tcp",
                  externalPort: "",
                  internalIP: "",
                  internalPort: "",
                });
              }
            }}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <Plus className="w-4 h-4" />
                  Tambah Rule
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingRule ? "Edit Port Forward" : "Tambah Port Forward"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {/* Preset Templates */}
                  {!editingRule && (
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Template Cepat</Label>
                      <div className="flex flex-wrap gap-2">
                        {presetTemplates.map((template) => (
                          <Button
                            key={template.name}
                            variant="outline"
                            size="sm"
                            onClick={() => applyTemplate(template)}
                            className="text-xs"
                          >
                            {template.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Rule</Label>
                    <Input
                      id="name"
                      value={newRule.name}
                      onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                      placeholder="Web Server"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="protocol">Protokol</Label>
                    <Select
                      value={newRule.protocol}
                      onValueChange={(value: "tcp" | "udp" | "tcp+udp") => 
                        setNewRule({ ...newRule, protocol: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tcp">TCP</SelectItem>
                        <SelectItem value="udp">UDP</SelectItem>
                        <SelectItem value="tcp+udp">TCP + UDP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="externalPort" className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        Port Eksternal
                      </Label>
                      <Input
                        id="externalPort"
                        value={newRule.externalPort}
                        onChange={(e) => setNewRule({ ...newRule, externalPort: e.target.value })}
                        placeholder="80"
                        type="number"
                        min="1"
                        max="65535"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="internalPort" className="flex items-center gap-1">
                        <Server className="w-3 h-3" />
                        Port Internal
                      </Label>
                      <Input
                        id="internalPort"
                        value={newRule.internalPort}
                        onChange={(e) => setNewRule({ ...newRule, internalPort: e.target.value })}
                        placeholder="80"
                        type="number"
                        min="1"
                        max="65535"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="internalIP" className="flex items-center gap-1">
                      <Network className="w-3 h-3" />
                      IP Internal (Tujuan)
                    </Label>
                    <Input
                      id="internalIP"
                      value={newRule.internalIP}
                      onChange={(e) => setNewRule({ ...newRule, internalIP: e.target.value })}
                      placeholder="192.168.1.100"
                    />
                  </div>

                  <Button onClick={handleAddRule} className="w-full">
                    {editingRule ? "Simpan Perubahan" : "Tambah Rule"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Kelola port forwarding untuk mengakses layanan internal dari internet.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="glass-card rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-primary">{rules.length}</div>
              <div className="text-xs text-muted-foreground">Total Rules</div>
            </div>
            <div className="glass-card rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-green-400">
                {rules.filter(r => r.enabled).length}
              </div>
              <div className="text-xs text-muted-foreground">Aktif</div>
            </div>
            <div className="glass-card rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-muted-foreground">
                {rules.filter(r => !r.enabled).length}
              </div>
              <div className="text-xs text-muted-foreground">Nonaktif</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rules List */}
      <div className="space-y-3">
        {rules.map((rule) => (
          <Card key={rule.id} className={`glass-card transition-all ${!rule.enabled ? "opacity-60" : ""}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium truncate">{rule.name}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full uppercase font-medium ${getProtocolBadgeClass(rule.protocol)}`}>
                      {rule.protocol}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Globe className="w-3 h-3" />
                      <span>:{rule.externalPort}</span>
                    </div>
                    <ArrowRightLeft className="w-4 h-4 text-primary" />
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Server className="w-3 h-3" />
                      <span>{rule.internalIP}:{rule.internalPort}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEditRule(rule)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDeleteRule(rule.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={() => handleToggleRule(rule.id)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {rules.length === 0 && (
          <Card className="glass-card">
            <CardContent className="p-8 text-center">
              <ArrowRightLeft className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-muted-foreground">Belum ada port forwarding rule</p>
              <p className="text-sm text-muted-foreground/70">Klik "Tambah Rule" untuk membuat rule baru</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Info Card */}
      <Card className="glass-card border-primary/20">
        <CardContent className="p-4">
          <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
            <Network className="w-4 h-4 text-primary" />
            Tentang Port Forwarding
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Port forwarding memungkinkan akses ke layanan di jaringan lokal dari internet. 
            Contoh: menjalankan web server, game server, atau remote desktop. 
            Pastikan firewall mengizinkan koneksi ke port yang dikonfigurasi.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortForwarding;
