import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  Gauge,
  Plus,
  Trash2,
  Gamepad2,
  Video,
  Phone,
  Globe,
  Download,
  Smartphone,
  Laptop,
  Router,
  ArrowUp,
  ArrowDown,
  Settings2,
  Zap
} from "lucide-react";

interface TrafficRule {
  id: string;
  name: string;
  type: "application" | "device";
  category: string;
  priority: "highest" | "high" | "medium" | "low";
  bandwidthLimit?: number;
  enabled: boolean;
}

const QoSManagement = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadBandwidth, setUploadBandwidth] = useState([80]);
  const [downloadBandwidth, setDownloadBandwidth] = useState([100]);

  const [rules, setRules] = useState<TrafficRule[]>([
    { id: "1", name: "Gaming Traffic", type: "application", category: "gaming", priority: "highest", enabled: true },
    { id: "2", name: "Video Call", type: "application", category: "voip", priority: "high", enabled: true },
    { id: "3", name: "Streaming Video", type: "application", category: "streaming", priority: "medium", enabled: true },
    { id: "4", name: "iPhone Anak", type: "device", category: "phone", priority: "low", bandwidthLimit: 5, enabled: true },
  ]);

  const [newRule, setNewRule] = useState<Partial<TrafficRule>>({
    name: "",
    type: "application",
    category: "gaming",
    priority: "medium",
    enabled: true
  });

  const applicationCategories = [
    { value: "gaming", label: "Gaming", icon: Gamepad2, description: "Game online, Steam, PlayStation" },
    { value: "streaming", label: "Streaming", icon: Video, description: "YouTube, Netflix, Disney+" },
    { value: "voip", label: "Video Call", icon: Phone, description: "Zoom, Meet, WhatsApp Call" },
    { value: "browsing", label: "Browsing", icon: Globe, description: "Web browsing umum" },
    { value: "download", label: "Download", icon: Download, description: "Torrent, file besar" },
  ];

  const deviceCategories = [
    { value: "phone", label: "Smartphone", icon: Smartphone },
    { value: "laptop", label: "Laptop/PC", icon: Laptop },
    { value: "iot", label: "IoT Device", icon: Router },
  ];

  const priorityLevels = [
    { value: "highest", label: "Tertinggi", color: "bg-red-500", description: "Prioritas maksimal" },
    { value: "high", label: "Tinggi", color: "bg-orange-500", description: "Prioritas tinggi" },
    { value: "medium", label: "Sedang", color: "bg-yellow-500", description: "Prioritas normal" },
    { value: "low", label: "Rendah", color: "bg-green-500", description: "Best effort" },
  ];

  const presetProfiles = [
    { name: "Gaming Mode", description: "Prioritaskan game & voice chat", rules: ["gaming", "voip"] },
    { name: "Work From Home", description: "Prioritaskan video call & browsing", rules: ["voip", "browsing"] },
    { name: "Streaming Mode", description: "Prioritaskan video streaming", rules: ["streaming"] },
  ];

  const handleToggleQoS = (enabled: boolean) => {
    setIsEnabled(enabled);
    toast({
      title: enabled ? "QoS Diaktifkan" : "QoS Dinonaktifkan",
      description: enabled
        ? "Prioritas bandwidth sekarang aktif"
        : "Semua traffic diperlakukan sama",
    });
  };

  const handleToggleRule = (id: string) => {
    setRules(rules.map(rule =>
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const handleAddRule = () => {
    if (!newRule.name) {
      toast({ title: "Error", description: "Nama rule harus diisi", variant: "destructive" });
      return;
    }

    const rule: TrafficRule = {
      id: Date.now().toString(),
      name: newRule.name,
      type: newRule.type || "application",
      category: newRule.category || "gaming",
      priority: newRule.priority as TrafficRule["priority"] || "medium",
      bandwidthLimit: newRule.bandwidthLimit,
      enabled: true
    };

    setRules([...rules, rule]);
    setNewRule({ name: "", type: "application", category: "gaming", priority: "medium", enabled: true });
    setIsDialogOpen(false);
    toast({ title: "Rule Ditambahkan", description: `${rule.name} berhasil ditambahkan` });
  };

  const handleDeleteRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
    toast({ title: "Rule Dihapus", description: "Rule QoS berhasil dihapus" });
  };

  const applyPreset = (preset: typeof presetProfiles[0]) => {
    // Reset all to low, then set preset categories to high
    const updatedRules = rules.map(rule => ({
      ...rule,
      priority: preset.rules.includes(rule.category) ? "high" as const : "low" as const
    }));
    setRules(updatedRules);
    toast({ title: "Preset Diterapkan", description: `${preset.name} berhasil diterapkan` });
  };

  const getPriorityBadge = (priority: string) => {
    const level = priorityLevels.find(p => p.value === priority);
    return level ? (
      <Badge className={`${level.color} text-white`}>{level.label}</Badge>
    ) : null;
  };

  const getCategoryIcon = (category: string, type: string) => {
    if (type === "application") {
      const cat = applicationCategories.find(c => c.value === category);
      return cat ? <cat.icon className="h-5 w-5" /> : <Globe className="h-5 w-5" />;
    } else {
      const cat = deviceCategories.find(c => c.value === category);
      return cat ? <cat.icon className="h-5 w-5" /> : <Smartphone className="h-5 w-5" />;
    }
  };

  const activeRules = rules.filter(r => r.enabled).length;

  return (
    <div className="space-y-4">
      {/* Header dengan Toggle */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Gauge className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Quality of Service</CardTitle>
                <p className="text-sm text-muted-foreground">Prioritas bandwidth otomatis</p>
              </div>
            </div>
            <Switch checked={isEnabled} onCheckedChange={handleToggleQoS} />
          </div>
        </CardHeader>
      </Card>

      {isEnabled && (
        <>
          {/* Bandwidth Allocation */}
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Settings2 className="h-4 w-4" />
                Alokasi Bandwidth
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <ArrowDown className="h-4 w-4 text-green-400" />
                    Download
                  </span>
                  <span className="font-mono">{downloadBandwidth[0]}%</span>
                </div>
                <Slider
                  value={downloadBandwidth}
                  onValueChange={setDownloadBandwidth}
                  max={100}
                  min={50}
                  step={5}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <ArrowUp className="h-4 w-4 text-blue-400" />
                    Upload
                  </span>
                  <span className="font-mono">{uploadBandwidth[0]}%</span>
                </div>
                <Slider
                  value={uploadBandwidth}
                  onValueChange={setUploadBandwidth}
                  max={100}
                  min={50}
                  step={5}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Preset Profiles */}
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Preset Cepat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {presetProfiles.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    size="sm"
                    className="h-auto py-2.5 flex-col gap-1 border-primary/10 hover:border-primary/30 hover:bg-primary/5"
                    onClick={() => applyPreset(preset)}
                  >
                    <span className="text-[10px] sm:text-xs font-bold whitespace-nowrap">{preset.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Rules Management */}
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="pb-3 px-4 sm:px-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Rules Prioritas</CardTitle>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-1 h-8 px-2 sm:px-3">
                      <Plus className="h-3.5 w-3.5" />
                      Tambah
                    </Button>
                  </DialogTrigger>
                  {/* ... Dialog components ... */}
                  <DialogContent className="bg-card border-border">
                    <DialogHeader>
                      <DialogTitle>Tambah Rule QoS</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>Nama Rule</Label>
                        <Input
                          placeholder="Contoh: Laptop Kerja"
                          value={newRule.name}
                          onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Tipe</Label>
                        <Select
                          value={newRule.type}
                          onValueChange={(value) => setNewRule({
                            ...newRule,
                            type: value as "application" | "device",
                            category: value === "application" ? "gaming" : "phone"
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="application">Aplikasi/Traffic</SelectItem>
                            <SelectItem value="device">Perangkat</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Kategori</Label>
                        <Select
                          value={newRule.category}
                          onValueChange={(value) => setNewRule({ ...newRule, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {newRule.type === "application"
                              ? applicationCategories.map((cat) => (
                                <SelectItem key={cat.value} value={cat.value}>
                                  <div className="flex items-center gap-2">
                                    <cat.icon className="h-4 w-4" />
                                    {cat.label}
                                  </div>
                                </SelectItem>
                              ))
                              : deviceCategories.map((cat) => (
                                <SelectItem key={cat.value} value={cat.value}>
                                  <div className="flex items-center gap-2">
                                    <cat.icon className="h-4 w-4" />
                                    {cat.label}
                                  </div>
                                </SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Prioritas</Label>
                        <Select
                          value={newRule.priority}
                          onValueChange={(value) => setNewRule({ ...newRule, priority: value as TrafficRule["priority"] })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {priorityLevels.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                <div className="flex items-center gap-2">
                                  <div className={`w-3 h-3 rounded-full ${level.color}`} />
                                  {level.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {newRule.type === "device" && (
                        <div className="space-y-2">
                          <Label>Batas Bandwidth (Mbps)</Label>
                          <Input
                            type="number"
                            placeholder="Contoh: 10"
                            value={newRule.bandwidthLimit || ""}
                            onChange={(e) => setNewRule({ ...newRule, bandwidthLimit: parseInt(e.target.value) || undefined })}
                          />
                        </div>
                      )}

                      <Button onClick={handleAddRule} className="w-full">
                        Simpan Rule
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-muted/30 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-primary">{rules.length}</p>
                  <p className="text-xs text-muted-foreground">Total Rules</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-green-400">{activeRules}</p>
                  <p className="text-xs text-muted-foreground">Aktif</p>
                </div>
              </div>

              {/* Rules List */}
              {rules.map((rule) => (
                <Card key={rule.id} className={`bg-muted/20 border-border/30 ${!rule.enabled ? 'opacity-50' : ''} overflow-hidden`}>
                  <CardContent className="p-3">
                    <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <div className="p-2 sm:p-2.5 bg-muted/50 rounded-lg flex-shrink-0">
                          {getCategoryIcon(rule.category, rule.type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-sm truncate">{rule.name}</p>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-secondary text-secondary-foreground font-medium">
                              {rule.type === "application" ? "Aplikasi" : "Perangkat"}
                            </span>
                            {rule.bandwidthLimit && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-primary/10 text-primary font-bold">
                                {rule.bandwidthLimit}Mbps
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between xs:justify-end gap-2 sm:gap-4 pl-10 xs:pl-0">
                        <div className="flex items-center gap-2">
                          {getPriorityBadge(rule.priority)}
                          <Switch
                            checked={rule.enabled}
                            onCheckedChange={() => handleToggleRule(rule.id)}
                            className="scale-90"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteRule(rule.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Tentang QoS:</span> Quality of Service
                memungkinkan Anda memprioritaskan traffic tertentu agar mendapat bandwidth lebih
                saat jaringan sibuk. Gaming dan video call biasanya butuh prioritas tinggi untuk
                menghindari lag.
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default QoSManagement;
