import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wifi, Users, Clock, Shield, Copy, RefreshCw, Eye, EyeOff, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { QRCodeSVG } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface GuestNetwork {
  enabled: boolean;
  ssid: string;
  password: string;
  timeLimit: string; // in hours, "unlimited" for no limit
  maxDevices: number;
  isolation: boolean; // client isolation
  bandwidthLimit: number; // in Mbps, 0 for unlimited
  connectedDevices: number;
  createdAt: string;
}

const TIME_LIMITS = [
  { value: "1", label: "1 Jam" },
  { value: "2", label: "2 Jam" },
  { value: "4", label: "4 Jam" },
  { value: "8", label: "8 Jam" },
  { value: "12", label: "12 Jam" },
  { value: "24", label: "24 Jam" },
  { value: "48", label: "48 Jam" },
  { value: "168", label: "1 Minggu" },
  { value: "unlimited", label: "Tanpa Batas" },
];

const MAX_DEVICES_OPTIONS = [1, 2, 3, 5, 10, 15, 20, 50];

const BANDWIDTH_OPTIONS = [
  { value: 0, label: "Tanpa Batas" },
  { value: 1, label: "1 Mbps" },
  { value: 2, label: "2 Mbps" },
  { value: 5, label: "5 Mbps" },
  { value: 10, label: "10 Mbps" },
  { value: 20, label: "20 Mbps" },
  { value: 50, label: "50 Mbps" },
];

const generatePassword = (length: number = 8): string => {
  const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const GuestWiFi = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showQR, setShowQR] = useState(false);
  
  const [network, setNetwork] = useState<GuestNetwork>(() => {
    const saved = localStorage.getItem("kendalinet_guest_wifi");
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      enabled: false,
      ssid: "KendaliNet-Guest",
      password: generatePassword(),
      timeLimit: "24",
      maxDevices: 10,
      isolation: true,
      bandwidthLimit: 10,
      connectedDevices: 0,
      createdAt: new Date().toISOString(),
    };
  });

  useEffect(() => {
    localStorage.setItem("kendalinet_guest_wifi", JSON.stringify(network));
  }, [network]);

  const handleToggleNetwork = () => {
    const newEnabled = !network.enabled;
    setNetwork({ ...network, enabled: newEnabled });
    toast({
      title: newEnabled ? "Guest WiFi Aktif" : "Guest WiFi Nonaktif",
      description: newEnabled 
        ? `Jaringan tamu "${network.ssid}" sekarang tersedia`
        : "Jaringan tamu telah dimatikan",
    });
  };

  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    setNetwork({ ...network, password: newPassword });
    toast({
      title: "Password Baru",
      description: "Password guest WiFi berhasil dibuat ulang",
    });
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(network.password);
    toast({
      title: "Tersalin",
      description: "Password berhasil disalin ke clipboard",
    });
  };

  const handleSave = async () => {
    setSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSaving(false);
    toast({
      title: "Tersimpan",
      description: "Pengaturan Guest WiFi berhasil disimpan",
    });
  };

  const getWiFiQRString = () => {
    const security = "WPA";
    return `WIFI:T:${security};S:${network.ssid};P:${network.password};;`;
  };

  const getRemainingTime = () => {
    if (network.timeLimit === "unlimited") return null;
    
    const createdAt = new Date(network.createdAt);
    const limitHours = parseInt(network.timeLimit);
    const expiresAt = new Date(createdAt.getTime() + limitHours * 60 * 60 * 1000);
    const now = new Date();
    
    if (now > expiresAt) return "Expired";
    
    const diffMs = expiresAt.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 24) {
      return `${Math.floor(diffHours / 24)} hari ${diffHours % 24} jam`;
    }
    return `${diffHours} jam ${diffMins} menit`;
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Header Card */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${network.enabled ? 'bg-primary/20' : 'bg-muted'}`}>
                <Wifi className={`w-6 h-6 ${network.enabled ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              <div>
                <h3 className="font-semibold">Guest WiFi</h3>
                <p className="text-sm text-muted-foreground">
                  {network.enabled ? network.ssid : "Jaringan tamu nonaktif"}
                </p>
              </div>
            </div>
            <Switch
              checked={network.enabled}
              onCheckedChange={handleToggleNetwork}
            />
          </div>

          {network.enabled && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="text-center p-2 bg-background/50 rounded-lg">
                <Users className="w-4 h-4 mx-auto text-primary mb-1" />
                <p className="text-xs text-muted-foreground">Terhubung</p>
                <p className="font-semibold">{network.connectedDevices}/{network.maxDevices}</p>
              </div>
              <div className="text-center p-2 bg-background/50 rounded-lg">
                <Clock className="w-4 h-4 mx-auto text-primary mb-1" />
                <p className="text-xs text-muted-foreground">Sisa Waktu</p>
                <p className="font-semibold text-xs">{getRemainingTime() || "∞"}</p>
              </div>
              <div className="text-center p-2 bg-background/50 rounded-lg">
                <Shield className="w-4 h-4 mx-auto text-primary mb-1" />
                <p className="text-xs text-muted-foreground">Isolasi</p>
                <p className="font-semibold">{network.isolation ? "Aktif" : "Mati"}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Network Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Pengaturan Jaringan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* SSID */}
          <div className="space-y-2">
            <Label htmlFor="guest-ssid">Nama Jaringan (SSID)</Label>
            <Input
              id="guest-ssid"
              value={network.ssid}
              onChange={(e) => setNetwork({ ...network, ssid: e.target.value })}
              placeholder="Nama WiFi tamu"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="guest-password">Password</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="guest-password"
                  type={showPassword ? "text" : "password"}
                  value={network.password}
                  onChange={(e) => setNetwork({ ...network, password: e.target.value })}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              <Button variant="outline" size="icon" onClick={handleCopyPassword}>
                <Copy className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleGeneratePassword}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* QR Code Button */}
          <Dialog open={showQR} onOpenChange={setShowQR}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <QrCode className="w-4 h-4 mr-2" />
                Tampilkan QR Code
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>QR Code Guest WiFi</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="p-4 bg-white rounded-xl">
                  <QRCodeSVG
                    value={getWiFiQRString()}
                    size={200}
                    level="H"
                  />
                </div>
                <div className="text-center">
                  <p className="font-semibold">{network.ssid}</p>
                  <p className="text-sm text-muted-foreground">
                    Scan untuk terhubung
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Time & Limits */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Batas Waktu & Perangkat</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Time Limit */}
          <div className="space-y-2">
            <Label>Batas Waktu Akses</Label>
            <Select
              value={network.timeLimit}
              onValueChange={(value) => setNetwork({ ...network, timeLimit: value, createdAt: new Date().toISOString() })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_LIMITS.map((limit) => (
                  <SelectItem key={limit.value} value={limit.value}>
                    {limit.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Waktu akses akan direset setiap kali batas waktu diubah
            </p>
          </div>

          {/* Max Devices */}
          <div className="space-y-2">
            <Label>Maksimal Perangkat</Label>
            <Select
              value={network.maxDevices.toString()}
              onValueChange={(value) => setNetwork({ ...network, maxDevices: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MAX_DEVICES_OPTIONS.map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} Perangkat
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bandwidth Limit */}
          <div className="space-y-2">
            <Label>Batas Kecepatan</Label>
            <Select
              value={network.bandwidthLimit.toString()}
              onValueChange={(value) => setNetwork({ ...network, bandwidthLimit: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BANDWIDTH_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value.toString()}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Keamanan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Isolasi Klien</Label>
              <p className="text-xs text-muted-foreground">
                Cegah perangkat tamu saling berkomunikasi
              </p>
            </div>
            <Switch
              checked={network.isolation}
              onCheckedChange={(checked) => setNetwork({ ...network, isolation: checked })}
            />
          </div>

          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-primary mt-0.5" />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Tips Keamanan:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Aktifkan isolasi klien untuk mencegah akses ke jaringan utama</li>
                  <li>Gunakan password yang kuat dan ganti secara berkala</li>
                  <li>Batasi waktu akses untuk tamu sementara</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button 
        className="w-full" 
        size="lg"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? (
          <>
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Menyimpan...
          </>
        ) : (
          "Simpan Pengaturan"
        )}
      </Button>
    </div>
  );
};

export default GuestWiFi;
