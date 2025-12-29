import { useState } from "react";
import { Shield, ShieldCheck, ShieldAlert, Bell, UserCheck, UserX, BellRing } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { useBrowserNotification } from "@/hooks/useBrowserNotification";
import WebhookSettings from "./WebhookSettings";

interface Device {
  id: string;
  name: string;
  type: "phone" | "laptop" | "desktop" | "tablet";
  ip: string;
  mac: string;
  connected: boolean;
  isWhitelisted?: boolean;
  isNew?: boolean;
}

interface AntiIntruderProps {
  devices: Device[];
  onWhitelistDevice: (id: string) => void;
  onBlockDevice: (id: string) => void;
  whitelistMode: boolean;
  onWhitelistModeToggle: (enabled: boolean) => void;
}

const AntiIntruder = ({
  devices,
  onWhitelistDevice,
  onBlockDevice,
  whitelistMode,
  onWhitelistModeToggle,
}: AntiIntruderProps) => {
  const [showNewDeviceAlert, setShowNewDeviceAlert] = useState(false);
  const { permission, isSupported, requestPermission } = useBrowserNotification();

  const newDevices = devices.filter((d) => d.isNew && d.connected);
  const whitelistedDevices = devices.filter((d) => d.isWhitelisted);
  const unknownDevices = devices.filter((d) => !d.isWhitelisted && d.connected);

  const handleWhitelistModeToggle = (enabled: boolean) => {
    onWhitelistModeToggle(enabled);
    if (enabled) {
      toast({
        title: "Mode Whitelist Aktif",
        description: "Hanya perangkat yang diizinkan dapat terhubung.",
      });
    } else {
      toast({
        title: "Mode Whitelist Nonaktif",
        description: "Semua perangkat dapat terhubung ke jaringan.",
      });
    }
  };

  const handleWhitelistAll = () => {
    devices.forEach((d) => {
      if (d.connected && !d.isWhitelisted) {
        onWhitelistDevice(d.id);
      }
    });
    toast({
      title: "Semua Perangkat Diizinkan",
      description: "Perangkat yang terhubung telah ditambahkan ke whitelist.",
    });
  };

  const handleBlockAllUnknown = () => {
    unknownDevices.forEach((d) => onBlockDevice(d.id));
    toast({
      title: "Perangkat Tidak Dikenal Diblokir",
      description: `${unknownDevices.length} perangkat telah diblokir.`,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <div className="glass-card-elevated p-6 slide-up">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            whitelistMode ? "bg-success/20" : "bg-warning/20"
          }`}>
            {whitelistMode ? (
              <ShieldCheck className="w-6 h-6 text-success" />
            ) : (
              <Shield className="w-6 h-6 text-warning" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-foreground">Anti-Maling WiFi</h2>
            <p className="text-sm text-muted-foreground">
              Lindungi jaringan dari penyusup
            </p>
          </div>
        </div>

        {/* Whitelist Mode Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium text-foreground">Mode Whitelist</p>
              <p className="text-xs text-muted-foreground">
                Blokir otomatis perangkat baru
              </p>
            </div>
          </div>
          <Switch
            checked={whitelistMode}
            onCheckedChange={handleWhitelistModeToggle}
          />
        </div>

        {/* Browser Notification Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 mt-3">
          <div className="flex items-center gap-3">
            <BellRing className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium text-foreground">Notifikasi Browser</p>
              <p className="text-xs text-muted-foreground">
                {!isSupported 
                  ? "Browser tidak mendukung" 
                  : permission === 'granted' 
                    ? "Notifikasi aktif" 
                    : "Aktifkan untuk peringatan penyusup"}
              </p>
            </div>
          </div>
          {isSupported && permission !== 'granted' ? (
            <button
              onClick={requestPermission}
              className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Aktifkan
            </button>
          ) : permission === 'granted' ? (
            <span className="text-xs px-2 py-1 rounded-full bg-success/20 text-success">
              Aktif
            </span>
          ) : null}
        </div>
      </div>

      {/* New Device Alert */}
      {newDevices.length > 0 && (
        <div className="glass-card p-4 border-l-4 border-warning slide-up">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5 text-warning animate-pulse" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground">Perangkat Baru Terdeteksi!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {newDevices.length} perangkat baru mencoba terhubung ke WiFi Anda.
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => newDevices.forEach((d) => onWhitelistDevice(d.id))}
                  className="px-3 py-1.5 rounded-lg bg-success/20 text-success text-sm font-medium hover:bg-success/30 transition-colors"
                >
                  Izinkan Semua
                </button>
                <button
                  onClick={() => newDevices.forEach((d) => onBlockDevice(d.id))}
                  className="px-3 py-1.5 rounded-lg bg-destructive/20 text-destructive text-sm font-medium hover:bg-destructive/30 transition-colors"
                >
                  Blokir Semua
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleWhitelistAll}
          className="glass-card p-4 flex flex-col items-center gap-2 hover:bg-secondary/50 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
            <UserCheck className="w-5 h-5 text-success" />
          </div>
          <span className="text-sm font-medium text-foreground">Izinkan Semua</span>
          <span className="text-xs text-muted-foreground">Perangkat saat ini</span>
        </button>
        <button
          onClick={handleBlockAllUnknown}
          className="glass-card p-4 flex flex-col items-center gap-2 hover:bg-secondary/50 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
            <UserX className="w-5 h-5 text-destructive" />
          </div>
          <span className="text-sm font-medium text-foreground">Blokir Tak Dikenal</span>
          <span className="text-xs text-muted-foreground">{unknownDevices.length} perangkat</span>
        </button>
      </div>

      {/* Whitelisted Devices */}
      <div className="glass-card p-4 slide-up">
        <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-success" />
          Perangkat Keluarga ({whitelistedDevices.length})
        </h3>
        {whitelistedDevices.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Belum ada perangkat yang diizinkan
          </p>
        ) : (
          <div className="space-y-2">
            {whitelistedDevices.map((device) => (
              <div
                key={device.id}
                className="flex items-center justify-between p-3 rounded-xl bg-secondary/30"
              >
                <div>
                  <p className="font-medium text-foreground text-sm">{device.name}</p>
                  <p className="text-xs text-muted-foreground">{device.mac}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-success/20 text-success">
                  Diizinkan
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Unknown Devices */}
      {unknownDevices.length > 0 && (
        <div className="glass-card p-4 slide-up">
          <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-warning" />
            Perangkat Tidak Dikenal ({unknownDevices.length})
          </h3>
          <div className="space-y-2">
            {unknownDevices.map((device) => (
              <div
                key={device.id}
                className="flex items-center justify-between p-3 rounded-xl bg-warning/10"
              >
                <div>
                  <p className="font-medium text-foreground text-sm">{device.name}</p>
                  <p className="text-xs text-muted-foreground">{device.mac}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onWhitelistDevice(device.id)}
                    className="p-2 rounded-lg bg-success/20 text-success hover:bg-success/30 transition-colors"
                  >
                    <UserCheck className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onBlockDevice(device.id)}
                    className="p-2 rounded-lg bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors"
                  >
                    <UserX className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Webhook Settings for WhatsApp Notifications */}
      <WebhookSettings />
    </div>
  );
};

export default AntiIntruder;
