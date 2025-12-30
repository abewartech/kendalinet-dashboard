import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Globe, 
  Trash2, 
  RefreshCw, 
  Router, 
  Gamepad2, 
  Monitor, 
  Smartphone,
  Info,
  Shield,
  Clock
} from "lucide-react";

interface UPnPRule {
  id: string;
  description: string;
  protocol: "TCP" | "UDP" | "TCP+UDP";
  externalPort: number;
  internalPort: number;
  internalIP: string;
  clientName: string;
  duration: string;
  enabled: boolean;
}

const UPnPManagement = () => {
  const [upnpEnabled, setUpnpEnabled] = useState(true);
  const [secureMode, setSecureMode] = useState(false);
  const [rules, setRules] = useState<UPnPRule[]>([
    {
      id: "1",
      description: "PlayStation Network",
      protocol: "UDP",
      externalPort: 3478,
      internalPort: 3478,
      internalIP: "192.168.1.105",
      clientName: "PS5",
      duration: "2 jam",
      enabled: true
    },
    {
      id: "2",
      description: "Xbox Live",
      protocol: "TCP+UDP",
      externalPort: 3074,
      internalPort: 3074,
      internalIP: "192.168.1.110",
      clientName: "Xbox Series X",
      duration: "4 jam",
      enabled: true
    },
    {
      id: "3",
      description: "BitTorrent",
      protocol: "TCP",
      externalPort: 51413,
      internalPort: 51413,
      internalIP: "192.168.1.50",
      clientName: "PC-Gaming",
      duration: "1 jam",
      enabled: true
    },
    {
      id: "4",
      description: "Spotify Connect",
      protocol: "UDP",
      externalPort: 57621,
      internalPort: 57621,
      internalIP: "192.168.1.25",
      clientName: "iPhone-User",
      duration: "30 menit",
      enabled: false
    }
  ]);

  const handleToggleUPnP = (enabled: boolean) => {
    setUpnpEnabled(enabled);
    toast.success(enabled ? "UPnP diaktifkan" : "UPnP dinonaktifkan");
  };

  const handleToggleSecureMode = (enabled: boolean) => {
    setSecureMode(enabled);
    toast.success(enabled ? "Secure Mode aktif - hanya perangkat terpercaya" : "Secure Mode dinonaktifkan");
  };

  const handleDeleteRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
    toast.success("UPnP rule dihapus");
  };

  const handleToggleRule = (id: string) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const handleRefresh = () => {
    toast.success("Memperbarui daftar UPnP...");
  };

  const handleClearAll = () => {
    setRules([]);
    toast.success("Semua UPnP rules dihapus");
  };

  const getDeviceIcon = (clientName: string) => {
    const name = clientName.toLowerCase();
    if (name.includes("ps") || name.includes("xbox") || name.includes("game")) {
      return <Gamepad2 className="h-4 w-4" />;
    }
    if (name.includes("phone") || name.includes("iphone") || name.includes("android")) {
      return <Smartphone className="h-4 w-4" />;
    }
    return <Monitor className="h-4 w-4" />;
  };

  const getProtocolColor = (protocol: string) => {
    switch (protocol) {
      case "TCP": return "bg-blue-500/20 text-blue-400";
      case "UDP": return "bg-green-500/20 text-green-400";
      case "TCP+UDP": return "bg-purple-500/20 text-purple-400";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const activeRules = rules.filter(r => r.enabled).length;
  const totalRules = rules.length;

  return (
    <div className="space-y-4 pb-20">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardContent className="p-3 text-center">
            <Globe className="h-5 w-5 mx-auto mb-1 text-primary" />
            <div className="text-lg font-bold text-foreground">{totalRules}</div>
            <div className="text-xs text-muted-foreground">Total Rules</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardContent className="p-3 text-center">
            <Router className="h-5 w-5 mx-auto mb-1 text-green-400" />
            <div className="text-lg font-bold text-foreground">{activeRules}</div>
            <div className="text-xs text-muted-foreground">Aktif</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardContent className="p-3 text-center">
            <Shield className="h-5 w-5 mx-auto mb-1 text-yellow-400" />
            <div className="text-lg font-bold text-foreground">{totalRules - activeRules}</div>
            <div className="text-xs text-muted-foreground">Nonaktif</div>
          </CardContent>
        </Card>
      </div>

      {/* UPnP Control */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Pengaturan UPnP
          </CardTitle>
          <CardDescription>
            Universal Plug and Play untuk port forwarding otomatis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-foreground">Aktifkan UPnP</Label>
              <p className="text-xs text-muted-foreground">
                Izinkan aplikasi membuka port secara otomatis
              </p>
            </div>
            <Switch 
              checked={upnpEnabled} 
              onCheckedChange={handleToggleUPnP}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-foreground">Secure Mode</Label>
              <p className="text-xs text-muted-foreground">
                Hanya izinkan perangkat terpercaya
              </p>
            </div>
            <Switch 
              checked={secureMode} 
              onCheckedChange={handleToggleSecureMode}
              disabled={!upnpEnabled}
            />
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="flex-1"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleClearAll}
              className="flex-1"
              disabled={rules.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus Semua
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-blue-500/10 border-blue-500/30">
        <CardContent className="p-3">
          <div className="flex gap-2">
            <Info className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-300">
              <p className="font-medium mb-1">Apa itu UPnP?</p>
              <p className="text-blue-300/80">
                UPnP memungkinkan aplikasi seperti game console, streaming, dan torrent 
                untuk membuka port secara otomatis tanpa konfigurasi manual.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active UPnP Rules */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Port Mappings Aktif</CardTitle>
          <CardDescription>
            Daftar port yang dibuka otomatis oleh aplikasi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {rules.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Globe className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Tidak ada UPnP rules aktif</p>
            </div>
          ) : (
            rules.map((rule) => (
              <div 
                key={rule.id}
                className={`p-3 rounded-lg border transition-all ${
                  rule.enabled 
                    ? "bg-secondary/30 border-border/50" 
                    : "bg-muted/20 border-border/30 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getDeviceIcon(rule.clientName)}
                    <div>
                      <p className="font-medium text-sm text-foreground">
                        {rule.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {rule.clientName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={rule.enabled}
                      onCheckedChange={() => handleToggleRule(rule.id)}
                      disabled={!upnpEnabled}
                    />
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteRule(rule.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant="outline" className={getProtocolColor(rule.protocol)}>
                    {rule.protocol}
                  </Badge>
                  <Badge variant="outline" className="bg-secondary/50">
                    Ext: {rule.externalPort}
                  </Badge>
                  <Badge variant="outline" className="bg-secondary/50">
                    Int: {rule.internalPort}
                  </Badge>
                  <Badge variant="outline" className="bg-secondary/50">
                    {rule.internalIP}
                  </Badge>
                </div>

                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Aktif: {rule.duration}</span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Security Warning */}
      <Card className="bg-yellow-500/10 border-yellow-500/30">
        <CardContent className="p-3">
          <div className="flex gap-2">
            <Shield className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-yellow-300">
              <p className="font-medium mb-1">Peringatan Keamanan</p>
              <p className="text-yellow-300/80">
                UPnP dapat membuka port tanpa konfirmasi. Aktifkan Secure Mode 
                atau nonaktifkan UPnP jika tidak diperlukan untuk keamanan maksimal.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UPnPManagement;
