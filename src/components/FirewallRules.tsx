import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Shield, Plus, Trash2, Edit2, Check, X, AlertTriangle, Ban, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface FirewallRule {
  id: string;
  name: string;
  action: "accept" | "drop" | "reject";
  protocol: "tcp" | "udp" | "icmp" | "all";
  direction: "input" | "output" | "forward";
  sourceIP: string;
  sourcePort: string;
  destIP: string;
  destPort: string;
  enabled: boolean;
}

const FirewallRules = () => {
  const [rules, setRules] = useState<FirewallRule[]>([
    {
      id: "1",
      name: "Block SSH Brute Force",
      action: "drop",
      protocol: "tcp",
      direction: "input",
      sourceIP: "0.0.0.0/0",
      sourcePort: "*",
      destIP: "*",
      destPort: "22",
      enabled: true,
    },
    {
      id: "2",
      name: "Allow HTTP Traffic",
      action: "accept",
      protocol: "tcp",
      direction: "input",
      sourceIP: "0.0.0.0/0",
      sourcePort: "*",
      destIP: "*",
      destPort: "80",
      enabled: true,
    },
    {
      id: "3",
      name: "Block Telnet",
      action: "reject",
      protocol: "tcp",
      direction: "input",
      sourceIP: "0.0.0.0/0",
      sourcePort: "*",
      destIP: "*",
      destPort: "23",
      enabled: true,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<FirewallRule, "id" | "enabled">>({
    name: "",
    action: "drop",
    protocol: "tcp",
    direction: "input",
    sourceIP: "0.0.0.0/0",
    sourcePort: "*",
    destIP: "*",
    destPort: "",
  });

  const ruleTemplates = [
    { name: "Block All Incoming", action: "drop" as const, protocol: "all" as const, direction: "input" as const, destPort: "*" },
    { name: "Allow HTTPS", action: "accept" as const, protocol: "tcp" as const, direction: "input" as const, destPort: "443" },
    { name: "Block Ping", action: "drop" as const, protocol: "icmp" as const, direction: "input" as const, destPort: "*" },
    { name: "Allow DNS", action: "accept" as const, protocol: "udp" as const, direction: "input" as const, destPort: "53" },
  ];

  const handleAddRule = () => {
    if (!formData.name || (!formData.destPort && formData.protocol !== "icmp")) {
      toast.error("Nama dan port tujuan wajib diisi");
      return;
    }

    if (editingId) {
      setRules(rules.map(rule => 
        rule.id === editingId 
          ? { ...rule, ...formData }
          : rule
      ));
      toast.success("Aturan firewall berhasil diperbarui");
      setEditingId(null);
    } else {
      const newRule: FirewallRule = {
        id: Date.now().toString(),
        ...formData,
        enabled: true,
      };
      setRules([...rules, newRule]);
      toast.success("Aturan firewall berhasil ditambahkan");
    }

    setFormData({
      name: "",
      action: "drop",
      protocol: "tcp",
      direction: "input",
      sourceIP: "0.0.0.0/0",
      sourcePort: "*",
      destIP: "*",
      destPort: "",
    });
    setShowForm(false);
  };

  const handleEdit = (rule: FirewallRule) => {
    setFormData({
      name: rule.name,
      action: rule.action,
      protocol: rule.protocol,
      direction: rule.direction,
      sourceIP: rule.sourceIP,
      sourcePort: rule.sourcePort,
      destIP: rule.destIP,
      destPort: rule.destPort,
    });
    setEditingId(rule.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
    toast.success("Aturan firewall berhasil dihapus");
  };

  const toggleRule = (id: string) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const applyTemplate = (template: typeof ruleTemplates[0]) => {
    setFormData({
      ...formData,
      name: template.name,
      action: template.action,
      protocol: template.protocol,
      direction: template.direction,
      destPort: template.destPort,
    });
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case "accept":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><Check className="w-3 h-3 mr-1" />Accept</Badge>;
      case "drop":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30"><X className="w-3 h-3 mr-1" />Drop</Badge>;
      case "reject":
        return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30"><Ban className="w-3 h-3 mr-1" />Reject</Badge>;
      default:
        return null;
    }
  };

  const getDirectionBadge = (direction: string) => {
    switch (direction) {
      case "input":
        return <Badge variant="outline" className="text-blue-400 border-blue-500/30">INPUT</Badge>;
      case "output":
        return <Badge variant="outline" className="text-purple-400 border-purple-500/30">OUTPUT</Badge>;
      case "forward":
        return <Badge variant="outline" className="text-cyan-400 border-cyan-500/30">FORWARD</Badge>;
      default:
        return null;
    }
  };

  const acceptCount = rules.filter(r => r.action === "accept" && r.enabled).length;
  const dropCount = rules.filter(r => r.action === "drop" && r.enabled).length;
  const rejectCount = rules.filter(r => r.action === "reject" && r.enabled).length;

  return (
    <div className="space-y-6">
      <Card className="glass-card border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="w-5 h-5 text-primary" />
            Firewall Rules
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
              <Check className="w-5 h-5 mx-auto mb-1 text-green-400" />
              <p className="text-lg font-bold text-green-400">{acceptCount}</p>
              <p className="text-xs text-muted-foreground">Accept</p>
            </div>
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
              <X className="w-5 h-5 mx-auto mb-1 text-red-400" />
              <p className="text-lg font-bold text-red-400">{dropCount}</p>
              <p className="text-xs text-muted-foreground">Drop</p>
            </div>
            <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-center">
              <Ban className="w-5 h-5 mx-auto mb-1 text-orange-400" />
              <p className="text-lg font-bold text-orange-400">{rejectCount}</p>
              <p className="text-xs text-muted-foreground">Reject</p>
            </div>
          </div>

          {/* Add/Edit Form */}
          {showForm && (
            <div className="p-4 rounded-xl bg-secondary/50 border border-border space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{editingId ? "Edit Aturan" : "Tambah Aturan Baru"}</h3>
                <Button variant="ghost" size="sm" onClick={() => { setShowForm(false); setEditingId(null); }}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Templates */}
              <div className="flex flex-wrap gap-2">
                {ruleTemplates.map((template, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => applyTemplate(template)}
                  >
                    {template.name}
                  </Button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label className="text-xs">Nama Aturan</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Block SSH Attack"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-xs">Aksi</Label>
                  <Select value={formData.action} onValueChange={(v: "accept" | "drop" | "reject") => setFormData({ ...formData, action: v })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accept">Accept</SelectItem>
                      <SelectItem value="drop">Drop</SelectItem>
                      <SelectItem value="reject">Reject</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Protokol</Label>
                  <Select value={formData.protocol} onValueChange={(v: "tcp" | "udp" | "icmp" | "all") => setFormData({ ...formData, protocol: v })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tcp">TCP</SelectItem>
                      <SelectItem value="udp">UDP</SelectItem>
                      <SelectItem value="icmp">ICMP</SelectItem>
                      <SelectItem value="all">All</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Arah</Label>
                  <Select value={formData.direction} onValueChange={(v: "input" | "output" | "forward") => setFormData({ ...formData, direction: v })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="input">Input</SelectItem>
                      <SelectItem value="output">Output</SelectItem>
                      <SelectItem value="forward">Forward</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Source IP</Label>
                  <Input
                    value={formData.sourceIP}
                    onChange={(e) => setFormData({ ...formData, sourceIP: e.target.value })}
                    placeholder="0.0.0.0/0"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-xs">Source Port</Label>
                  <Input
                    value={formData.sourcePort}
                    onChange={(e) => setFormData({ ...formData, sourcePort: e.target.value })}
                    placeholder="*"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-xs">Dest IP</Label>
                  <Input
                    value={formData.destIP}
                    onChange={(e) => setFormData({ ...formData, destIP: e.target.value })}
                    placeholder="*"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-xs">Dest Port</Label>
                  <Input
                    value={formData.destPort}
                    onChange={(e) => setFormData({ ...formData, destPort: e.target.value })}
                    placeholder="22"
                    className="mt-1"
                  />
                </div>
              </div>

              <Button onClick={handleAddRule} className="w-full">
                {editingId ? "Simpan Perubahan" : "Tambah Aturan"}
              </Button>
            </div>
          )}

          {!showForm && (
            <Button onClick={() => setShowForm(true)} className="w-full" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Aturan Firewall
            </Button>
          )}

          {/* Rules List */}
          <div className="space-y-3">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className={`p-4 rounded-xl border transition-all ${
                  rule.enabled 
                    ? "bg-secondary/30 border-border" 
                    : "bg-secondary/10 border-border/50 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="font-medium truncate">{rule.name}</span>
                      {getActionBadge(rule.action)}
                      {getDirectionBadge(rule.direction)}
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="secondary" className="text-xs">
                        {rule.protocol.toUpperCase()}
                      </Badge>
                      <span className="truncate">
                        {rule.sourceIP}:{rule.sourcePort}
                      </span>
                      <ArrowRight className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">
                        {rule.destIP}:{rule.destPort}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={() => toggleRule(rule.id)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEdit(rule)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDelete(rule.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Info Card */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-400 mb-1">Perhatian</p>
                <p className="text-muted-foreground text-xs">
                  Aturan firewall diproses dari atas ke bawah. Pastikan urutan aturan sudah benar untuk menghindari blocking traffic yang tidak diinginkan.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FirewallRules;
