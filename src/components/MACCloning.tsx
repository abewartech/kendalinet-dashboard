import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Fingerprint, 
  Copy, 
  RefreshCw, 
  Save,
  RotateCcw,
  Wifi,
  Cable,
  Info,
  CheckCircle2,
  Shuffle
} from "lucide-react";
import { toast } from "sonner";

interface MACConfig {
  interface: string;
  originalMAC: string;
  clonedMAC: string;
  enabled: boolean;
}

const MACCloning = () => {
  const [configs, setConfigs] = useState<MACConfig[]>([
    {
      interface: "WAN",
      originalMAC: "AA:BB:CC:DD:EE:01",
      clonedMAC: "",
      enabled: false
    },
    {
      interface: "WAN6",
      originalMAC: "AA:BB:CC:DD:EE:02",
      clonedMAC: "",
      enabled: false
    },
    {
      interface: "LAN",
      originalMAC: "AA:BB:CC:DD:EE:03",
      clonedMAC: "",
      enabled: false
    }
  ]);

  const [customMAC, setCustomMAC] = useState("");
  const [selectedInterface, setSelectedInterface] = useState("WAN");

  const generateRandomMAC = () => {
    const hexDigits = "0123456789ABCDEF";
    let mac = "";
    for (let i = 0; i < 6; i++) {
      if (i === 0) {
        // First byte should be even (unicast) and locally administered
        mac += hexDigits[Math.floor(Math.random() * 4) * 4 + 2];
        mac += hexDigits[Math.floor(Math.random() * 16)];
      } else {
        mac += hexDigits[Math.floor(Math.random() * 16)];
        mac += hexDigits[Math.floor(Math.random() * 16)];
      }
      if (i < 5) mac += ":";
    }
    return mac;
  };

  const handleGenerateMAC = () => {
    const newMAC = generateRandomMAC();
    setCustomMAC(newMAC);
    toast.success("MAC Address baru di-generate");
  };

  const handleApplyMAC = () => {
    if (!customMAC || !isValidMAC(customMAC)) {
      toast.error("Format MAC Address tidak valid");
      return;
    }

    setConfigs(configs.map(c => 
      c.interface === selectedInterface 
        ? { ...c, clonedMAC: customMAC.toUpperCase(), enabled: true }
        : c
    ));
    toast.success(`MAC Address diterapkan ke ${selectedInterface}`);
  };

  const handleToggleCloning = (iface: string) => {
    setConfigs(configs.map(c => 
      c.interface === iface 
        ? { ...c, enabled: !c.enabled }
        : c
    ));
  };

  const handleResetMAC = (iface: string) => {
    setConfigs(configs.map(c => 
      c.interface === iface 
        ? { ...c, clonedMAC: "", enabled: false }
        : c
    ));
    toast.info(`MAC Address ${iface} direset ke original`);
  };

  const handleCopyMAC = (mac: string) => {
    navigator.clipboard.writeText(mac);
    toast.success("MAC Address disalin");
  };

  const isValidMAC = (mac: string) => {
    const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    return macRegex.test(mac);
  };

  const handleSaveAll = () => {
    localStorage.setItem("macCloningConfigs", JSON.stringify(configs));
    toast.success("Pengaturan MAC Cloning disimpan!");
  };

  const getInterfaceIcon = (iface: string) => {
    if (iface.includes("WAN")) return <Cable className="w-4 h-4 text-blue-400" />;
    return <Wifi className="w-4 h-4 text-green-400" />;
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto glass-card rounded-2xl flex items-center justify-center mb-4">
          <Fingerprint className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">MAC Cloning</h1>
        <p className="text-muted-foreground text-sm">
          Clone MAC Address untuk interface jaringan
        </p>
      </div>

      {/* Quick Clone */}
      <Card className="glass-card border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Shuffle className="w-5 h-5 text-primary" />
            Clone MAC Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Pilih Interface</Label>
            <Select value={selectedInterface} onValueChange={setSelectedInterface}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {configs.map(c => (
                  <SelectItem key={c.interface} value={c.interface}>
                    {c.interface}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>MAC Address Baru</Label>
            <div className="flex gap-2">
              <Input 
                value={customMAC}
                onChange={(e) => setCustomMAC(e.target.value.toUpperCase())}
                placeholder="AA:BB:CC:DD:EE:FF"
                className="font-mono"
              />
              <Button variant="outline" size="icon" onClick={handleGenerateMAC}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Format: XX:XX:XX:XX:XX:XX</p>
          </div>

          <Button className="w-full" onClick={handleApplyMAC}>
            <Copy className="w-4 h-4 mr-2" />
            Terapkan MAC
          </Button>
        </CardContent>
      </Card>

      {/* Interface List */}
      <Card className="glass-card border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Cable className="w-5 h-5 text-primary" />
            Status Interface
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {configs.map((config) => (
            <div 
              key={config.interface}
              className="p-4 rounded-xl bg-card/50 border border-border/30 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center border border-border/50">
                    {getInterfaceIcon(config.interface)}
                  </div>
                  <div>
                    <p className="font-medium">{config.interface}</p>
                    <p className="text-xs text-muted-foreground">Interface Jaringan</p>
                  </div>
                </div>
                <Badge className={config.enabled ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}>
                  {config.enabled ? "Cloned" : "Original"}
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex items-center justify-between p-2 rounded-lg bg-background/50">
                  <span className="text-muted-foreground">Original:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs">{config.originalMAC}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => handleCopyMAC(config.originalMAC)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {config.enabled && config.clonedMAC && (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-primary/10">
                    <span className="text-primary">Cloned:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-primary">{config.clonedMAC}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => handleCopyMAC(config.clonedMAC)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/30">
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={config.enabled}
                    onCheckedChange={() => handleToggleCloning(config.interface)}
                    disabled={!config.clonedMAC}
                  />
                  <span className="text-sm text-muted-foreground">Aktif</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleResetMAC(config.interface)}
                  disabled={!config.enabled}
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Reset
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Info */}
      <Card className="glass-card border-blue-500/30 bg-blue-500/5">
        <CardContent className="pt-4">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-400">Kapan Menggunakan MAC Cloning?</p>
              <ul className="text-muted-foreground mt-2 space-y-1 text-xs">
                <li>• ISP membatasi koneksi berdasarkan MAC address</li>
                <li>• Mengganti router tanpa perlu menghubungi ISP</li>
                <li>• Bypass MAC filtering pada jaringan tertentu</li>
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

export default MACCloning;
