import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Globe, 
  Layout, 
  Palette, 
  Image, 
  Type, 
  Settings2, 
  Eye,
  Save,
  RotateCcw,
  Wifi,
  Clock,
  Users,
  Facebook,
  Mail
} from "lucide-react";
import { toast } from "sonner";

interface PortalSettings {
  enabled: boolean;
  title: string;
  subtitle: string;
  welcomeMessage: string;
  logoUrl: string;
  backgroundColor: string;
  primaryColor: string;
  textColor: string;
  requireTerms: boolean;
  termsText: string;
  sessionTimeout: number;
  redirectUrl: string;
  authMethods: {
    password: boolean;
    voucher: boolean;
    social: boolean;
    email: boolean;
  };
}

const CaptivePortal = () => {
  const [settings, setSettings] = useState<PortalSettings>({
    enabled: true,
    title: "Selamat Datang",
    subtitle: "Silakan login untuk mengakses WiFi",
    welcomeMessage: "Nikmati koneksi internet gratis dengan kecepatan tinggi.",
    logoUrl: "",
    backgroundColor: "#1a1a2e",
    primaryColor: "#6366f1",
    textColor: "#ffffff",
    requireTerms: true,
    termsText: "Dengan menggunakan layanan ini, Anda menyetujui syarat dan ketentuan yang berlaku.",
    sessionTimeout: 60,
    redirectUrl: "https://google.com",
    authMethods: {
      password: true,
      voucher: true,
      social: false,
      email: false
    }
  });

  const [showPreview, setShowPreview] = useState(false);

  const handleSave = () => {
    localStorage.setItem("captivePortalSettings", JSON.stringify(settings));
    toast.success("Pengaturan Captive Portal disimpan!");
  };

  const handleReset = () => {
    setSettings({
      enabled: true,
      title: "Selamat Datang",
      subtitle: "Silakan login untuk mengakses WiFi",
      welcomeMessage: "Nikmati koneksi internet gratis dengan kecepatan tinggi.",
      logoUrl: "",
      backgroundColor: "#1a1a2e",
      primaryColor: "#6366f1",
      textColor: "#ffffff",
      requireTerms: true,
      termsText: "Dengan menggunakan layanan ini, Anda menyetujui syarat dan ketentuan yang berlaku.",
      sessionTimeout: 60,
      redirectUrl: "https://google.com",
      authMethods: {
        password: true,
        voucher: true,
        social: false,
        email: false
      }
    });
    toast.info("Pengaturan direset ke default");
  };

  const updateAuthMethod = (method: keyof typeof settings.authMethods, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      authMethods: { ...prev.authMethods, [method]: value }
    }));
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto glass-card rounded-2xl flex items-center justify-center mb-4">
          <Globe className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Captive Portal</h1>
        <p className="text-muted-foreground text-sm">
          Kustomisasi halaman login untuk Guest WiFi
        </p>
      </div>

      {/* Enable Toggle */}
      <Card className="glass-card border-border/50">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${settings.enabled ? "bg-primary/20" : "bg-muted"}`}>
                <Layout className={`w-5 h-5 ${settings.enabled ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div>
                <p className="font-medium">Aktifkan Captive Portal</p>
                <p className="text-sm text-muted-foreground">Tampilkan halaman login untuk guest</p>
              </div>
            </div>
            <Switch 
              checked={settings.enabled} 
              onCheckedChange={(v) => setSettings(prev => ({ ...prev, enabled: v }))} 
            />
          </div>
        </CardContent>
      </Card>

      {settings.enabled && (
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-4 glass-card">
            <TabsTrigger value="content" className="data-[state=active]:bg-primary/20 text-xs">
              <Type className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="design" className="data-[state=active]:bg-primary/20 text-xs">
              <Palette className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="auth" className="data-[state=active]:bg-primary/20 text-xs">
              <Users className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary/20 text-xs">
              <Settings2 className="w-4 h-4" />
            </TabsTrigger>
          </TabsList>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-4 mt-4">
            <Card className="glass-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Type className="w-5 h-5 text-primary" />
                  Konten Halaman
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Judul</Label>
                  <Input 
                    value={settings.title}
                    onChange={(e) => setSettings(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Selamat Datang"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Subjudul</Label>
                  <Input 
                    value={settings.subtitle}
                    onChange={(e) => setSettings(prev => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="Silakan login untuk mengakses WiFi"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Pesan Selamat Datang</Label>
                  <Textarea 
                    value={settings.welcomeMessage}
                    onChange={(e) => setSettings(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                    placeholder="Deskripsi atau instruksi..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>URL Logo (opsional)</Label>
                  <Input 
                    value={settings.logoUrl}
                    onChange={(e) => setSettings(prev => ({ ...prev, logoUrl: e.target.value }))}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Terms */}
            <Card className="glass-card border-border/50">
              <CardContent className="pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Syarat & Ketentuan</p>
                    <p className="text-sm text-muted-foreground">Wajib setuju sebelum login</p>
                  </div>
                  <Switch 
                    checked={settings.requireTerms}
                    onCheckedChange={(v) => setSettings(prev => ({ ...prev, requireTerms: v }))}
                  />
                </div>

                {settings.requireTerms && (
                  <Textarea 
                    value={settings.termsText}
                    onChange={(e) => setSettings(prev => ({ ...prev, termsText: e.target.value }))}
                    placeholder="Teks syarat dan ketentuan..."
                    rows={3}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Design Tab */}
          <TabsContent value="design" className="space-y-4 mt-4">
            <Card className="glass-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary" />
                  Warna & Tema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs">Background</Label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={settings.backgroundColor}
                        onChange={(e) => setSettings(prev => ({ ...prev, backgroundColor: e.target.value }))}
                        className="w-10 h-10 rounded-lg cursor-pointer"
                      />
                      <span className="text-xs text-muted-foreground">{settings.backgroundColor}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Primary</Label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={settings.primaryColor}
                        onChange={(e) => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="w-10 h-10 rounded-lg cursor-pointer"
                      />
                      <span className="text-xs text-muted-foreground">{settings.primaryColor}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Teks</Label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={settings.textColor}
                        onChange={(e) => setSettings(prev => ({ ...prev, textColor: e.target.value }))}
                        className="w-10 h-10 rounded-lg cursor-pointer"
                      />
                      <span className="text-xs text-muted-foreground">{settings.textColor}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card className="glass-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-primary" />
                    Preview
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    {showPreview ? "Sembunyikan" : "Tampilkan"}
                  </Button>
                </CardTitle>
              </CardHeader>
              {showPreview && (
                <CardContent>
                  <div 
                    className="rounded-xl p-6 text-center space-y-4 min-h-[300px] flex flex-col items-center justify-center"
                    style={{ 
                      backgroundColor: settings.backgroundColor,
                      color: settings.textColor
                    }}
                  >
                    {settings.logoUrl ? (
                      <img src={settings.logoUrl} alt="Logo" className="w-16 h-16 object-contain" />
                    ) : (
                      <Wifi className="w-12 h-12" style={{ color: settings.primaryColor }} />
                    )}
                    <h2 className="text-xl font-bold">{settings.title}</h2>
                    <p className="text-sm opacity-80">{settings.subtitle}</p>
                    <p className="text-xs opacity-60">{settings.welcomeMessage}</p>
                    <button 
                      className="px-6 py-2 rounded-lg font-medium mt-4"
                      style={{ backgroundColor: settings.primaryColor, color: "#fff" }}
                    >
                      Login
                    </button>
                  </div>
                </CardContent>
              )}
            </Card>
          </TabsContent>

          {/* Auth Tab */}
          <TabsContent value="auth" className="space-y-4 mt-4">
            <Card className="glass-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Metode Autentikasi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-card/50 border border-border/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <Wifi className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">Password WiFi</p>
                      <p className="text-xs text-muted-foreground">Login dengan password guest</p>
                    </div>
                  </div>
                  <Switch 
                    checked={settings.authMethods.password}
                    onCheckedChange={(v) => updateAuthMethod("password", v)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-card/50 border border-border/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                      <Type className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium">Kode Voucher</p>
                      <p className="text-xs text-muted-foreground">Login dengan voucher WiFi</p>
                    </div>
                  </div>
                  <Switch 
                    checked={settings.authMethods.voucher}
                    onCheckedChange={(v) => updateAuthMethod("voucher", v)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-card/50 border border-border/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                      <Facebook className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <p className="font-medium">Social Login</p>
                      <p className="text-xs text-muted-foreground">Facebook, Google</p>
                    </div>
                  </div>
                  <Switch 
                    checked={settings.authMethods.social}
                    onCheckedChange={(v) => updateAuthMethod("social", v)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-card/50 border border-border/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <p className="font-medium">Email Registration</p>
                      <p className="text-xs text-muted-foreground">Daftar dengan email</p>
                    </div>
                  </div>
                  <Switch 
                    checked={settings.authMethods.email}
                    onCheckedChange={(v) => updateAuthMethod("email", v)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4 mt-4">
            <Card className="glass-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-primary" />
                  Pengaturan Sesi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Session Timeout (menit)
                  </Label>
                  <Input 
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) || 60 }))}
                    min={5}
                    max={1440}
                  />
                  <p className="text-xs text-muted-foreground">Durasi sesi sebelum harus login ulang</p>
                </div>

                <div className="space-y-2">
                  <Label>Redirect URL Setelah Login</Label>
                  <Input 
                    value={settings.redirectUrl}
                    onChange={(e) => setSettings(prev => ({ ...prev, redirectUrl: e.target.value }))}
                    placeholder="https://google.com"
                  />
                  <p className="text-xs text-muted-foreground">Halaman yang dibuka setelah berhasil login</p>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="glass-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Statistik Portal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 rounded-xl bg-card/50 border border-border/30">
                    <p className="text-2xl font-bold text-primary">156</p>
                    <p className="text-xs text-muted-foreground">Login Hari Ini</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-card/50 border border-border/30">
                    <p className="text-2xl font-bold text-green-400">42</p>
                    <p className="text-xs text-muted-foreground">Aktif Sekarang</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-card/50 border border-border/30">
                    <p className="text-2xl font-bold text-blue-400">1.2K</p>
                    <p className="text-xs text-muted-foreground">Total Minggu Ini</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={handleReset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
        <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Simpan
        </Button>
      </div>
    </div>
  );
};

export default CaptivePortal;
