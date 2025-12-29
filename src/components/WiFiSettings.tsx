import { useState } from "react";
import { Wifi, Eye, EyeOff, Lock, Save, Loader2, CheckCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

interface WiFiSettingsProps {
  initialSSID: string;
  initialPassword: string;
  initialHidden: boolean;
}

const WiFiSettings = ({
  initialSSID,
  initialPassword,
  initialHidden,
  onSave,
}: WiFiSettingsProps & { onSave?: (ssid: string, hidden: boolean, password?: string) => Promise<any> }) => {
  const [ssid, setSSID] = useState(initialSSID);
  const [password, setPassword] = useState(initialPassword);
  const [hideSSID, setHideSSID] = useState(initialHidden);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!onSave) {
      toast({
        title: "Gagal",
        description: "API tidak tersedia. Pastikan router terhubung.",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      const result = await onSave(ssid, hideSSID, password);
      if (result && result.success) {
        setSaved(true);
        toast({
          title: "Berhasil!",
          description: "Pengaturan WiFi telah diperbarui.",
        });
      } else {
        toast({
          title: "Gagal",
          description: result?.error || "Terjadi kesalahan saat menyimpan.",
          variant: "destructive"
        });
      }
    } catch (err: any) {
      toast({
        title: "Gagal",
        description: err.message || "Terjadi kesalahan saat menyimpan.",
        variant: "destructive"
      });
    }
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 px-4 pb-24">
      <div className="glass-card p-5 fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Wifi className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Pengaturan WiFi</h3>
            <p className="text-xs text-muted-foreground">Ubah nama dan keamanan jaringan</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* SSID Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Nama WiFi (SSID)
            </label>
            <input
              type="text"
              value={ssid}
              onChange={(e) => setSSID(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="Masukkan nama WiFi"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Password WiFi
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pl-11 pr-12 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="Masukkan password baru"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Minimal 8 karakter untuk keamanan
            </p>
          </div>

          {/* Hide SSID Toggle */}
          <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-secondary/50">
            <div>
              <p className="font-medium text-foreground">Sembunyikan WiFi</p>
              <p className="text-xs text-muted-foreground">
                WiFi tidak akan terlihat di daftar jaringan
              </p>
            </div>
            <Switch
              checked={hideSSID}
              onCheckedChange={setHideSSID}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>
      </div>

      {/* Preview Card */}
      <div className="glass-card p-5 fade-in" style={{ animationDelay: "0.1s" }}>
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Preview</h4>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
          <Wifi className="w-5 h-5 text-primary" />
          <div>
            <p className="font-medium text-foreground">{ssid || "Nama WiFi"}</p>
            <p className="text-xs text-muted-foreground">
              {hideSSID ? "Tersembunyi" : "Terlihat"} • WPA2-PSK
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${saved
            ? "bg-success text-success-foreground"
            : "btn-primary-gradient hover:scale-[1.02] active:scale-[0.98]"
          } ${saving ? "opacity-80" : ""}`}
      >
        {saving ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Menyimpan...
          </>
        ) : saved ? (
          <>
            <CheckCircle className="w-5 h-5" />
            Tersimpan!
          </>
        ) : (
          <>
            <Save className="w-5 h-5" />
            Terapkan Perubahan
          </>
        )}
      </button>
    </div>
  );
};

export default WiFiSettings;
