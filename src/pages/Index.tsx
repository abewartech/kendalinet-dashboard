import { useState, useEffect } from "react";
import { Users, ArrowDownCircle, ArrowUpCircle, Gamepad2, Shield, Clock, AlertCircle } from "lucide-react";
import StatusHeader from "@/components/StatusHeader";
import SpeedometerGauge from "@/components/SpeedometerGauge";
import WaveAnimation from "@/components/WaveAnimation";
import QuotaCard from "@/components/QuotaCard";
import DeviceCard from "@/components/DeviceCard";
import WiFiSettings from "@/components/WiFiSettings";
import WiFiQRCode from "@/components/WiFiQRCode";
import AdminPanel from "@/components/AdminPanel";
import BottomNavigation from "@/components/BottomNavigation";
import SupportChatbot from "@/components/SupportChatbot";
import AntiIntruder from "@/components/AntiIntruder";
import ParentalControl from "@/components/ParentalControl";
import NetworkCleaner from "@/components/NetworkCleaner";
import BillingReport from "@/components/BillingReport";
import RouterManagement from "@/components/RouterManagement";
import MultiRouterDashboard from "@/components/MultiRouterDashboard";
import { BandwidthLimiter } from "@/components/BandwidthLimiter";
import { VoucherSystem } from "@/components/VoucherSystem";
import { DNSSettings } from "@/components/DNSSettings";
import { DeviceGrouping } from "@/components/DeviceGrouping";
import { DeviceUsageMonitor } from "@/components/DeviceUsageMonitor";
import { SpeedTest } from "@/components/SpeedTest";
import GuestWiFi from "@/components/GuestWiFi";
import TrafficStatistics from "@/components/TrafficStatistics";
import VPNManagement from "@/components/VPNManagement";
import ProxyInjectManager from "@/components/ProxyInjectManager";
import AdblockManager from "@/components/AdblockManager";
import AppBlocker from "@/components/AppBlocker";
import PortForwarding from "@/components/PortForwarding";
import FirewallRules from "@/components/FirewallRules";
import QoSManagement from "@/components/QoSManagement";
import UPnPManagement from "@/components/UPnPManagement";
import SystemManagement from "@/components/SystemManagement";
import CaptivePortal from "@/components/CaptivePortal";
import LoadBalancing from "@/components/LoadBalancing";
import MACCloning from "@/components/MACCloning";
import VLANManagement from "@/components/VLANManagement";
import SSHManager from "@/components/SSHManager";
import ZeroTierManager from "@/components/ZeroTierManager";
import SambaNASManager from "@/components/SambaNASManager";
import { toast } from "@/hooks/use-toast";
import { useBrowserNotification } from "@/hooks/useBrowserNotification";
import { useWebhookNotification } from "@/hooks/useWebhookNotification";
import { useTelegramNotification } from "@/hooks/useTelegramNotification";
import { useNotificationHistory } from "@/hooks/useNotificationHistory";
import { useLuciApi } from "@/hooks/useLuciApi";
import { useRouterManager } from "@/hooks/useRouterManager";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Index = () => {
  const [activeTab, setActiveTab] = useState("beranda");
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [usedQuota, setUsedQuota] = useState(0);
  const [devices, setDevices] = useState<any[]>([]);
  const [gameMode, setGameMode] = useState(false);
  const [whitelistMode, setWhitelistMode] = useState(false);
  const [showRouterManagement, setShowRouterManagement] = useState(false);
  const [showMultiRouterDashboard, setShowMultiRouterDashboard] = useState(false);

  // Multi-router management
  const {
    routers,
    activeRouter,
    routerStatuses,
    isLoading: routerLoading,
    addRouter,
    updateRouter,
    deleteRouter,
    switchRouter,
    restoreRouters,
    checkAllRoutersStatus
  } = useRouterManager();

  // Gunakan metode API dari environment, default ke 'cgi' (script status.sh/devices.sh/system.sh)
  const apiMethod =
    import.meta.env.VITE_API_METHOD === "luci"
      ? "luci"
      : import.meta.env.VITE_API_METHOD === "ubus"
        ? "ubus"
        : "cgi";

  const {
    status,
    devices: apiDevices,
    wifi: apiWifi,
    system,
    saveWifi,
    loading,
    error,
  } = useLuciApi(true, apiMethod);

  // Check if API is connected
  const isConnected = !error && !loading && (status !== null || apiDevices.length > 0);

  useEffect(() => {
    if (status) {
      setDownloadSpeed(status.speed || 0);
      setUploadSpeed(status.tx_mb ? (status.tx_mb / 1024) : 0); // Convert MB to approximate speed
      setUsedQuota(status.rx_mb || 0);
    }
  }, [status]);

  useEffect(() => {
    if (apiDevices.length > 0) {
      const mappedDevices = apiDevices.map((d, i) => ({
        id: (i + 1).toString(),
        name: d.name === "unknown" ? `Device ${d.mac.slice(-5)}` : d.name,
        type: "phone" as const, // Default for now
        ip: d.ip,
        mac: d.mac,
        connected: d.online,
        downloadSpeed: d.bandwidth || 0,
        uploadSpeed: (d.bandwidth || 0) * 0.2,
        isWhitelisted: true,
        isNew: false,
      }));
      setDevices(mappedDevices);
    } else {
      setDevices([]);
    }
  }, [apiDevices]);

  const { permission, isSupported, requestPermission, notifyIntruder } = useBrowserNotification();
  const { sendWebhookNotification } = useWebhookNotification();
  const { sendTelegramNotification } = useTelegramNotification();
  const { addNotification, updateAction } = useNotificationHistory();

  // New device connection notification
  useEffect(() => {
    const newDevices = devices.filter((d) => d.isNew && d.connected);
    if (newDevices.length > 0 && whitelistMode) {
      const device = newDevices[0];
      toast({
        title: "⚠️ Perangkat Baru Terdeteksi!",
        description: `${device.name} mencoba terhubung ke WiFi Anda.`,
        variant: "destructive",
      });
      // Send browser notification
      notifyIntruder(device.name, device.mac);
      // Send webhook notification (for WhatsApp via n8n/Zapier)
      sendWebhookNotification(device.name, device.mac, device.ip);
      // Send Telegram notification
      sendTelegramNotification(device.name, device.mac, device.ip);
      // Add to notification history
      addNotification(device.name, device.mac, device.ip);
    }
  }, [devices, whitelistMode, notifyIntruder, sendWebhookNotification, sendTelegramNotification, addNotification]);

  const handleWhitelistDevice = (id: string) => {
    setDevices((prev) =>
      prev.map((device) =>
        device.id === id ? { ...device, isWhitelisted: true, isNew: false } : device
      )
    );
    const device = devices.find((d) => d.id === id);
    toast({
      title: "Perangkat Diizinkan",
      description: `${device?.name} ditambahkan ke daftar perangkat keluarga.`,
    });
  };

  const handleWhitelistModeToggle = (enabled: boolean) => {
    setWhitelistMode(enabled);
    if (enabled) {
      // Block all non-whitelisted devices
      setDevices((prev) =>
        prev.map((device) =>
          !device.isWhitelisted ? { ...device, connected: false } : device
        )
      );
    }
  };

  const handleGameModeToggle = () => {
    setGameMode(!gameMode);
    toast({
      title: gameMode ? "Game Mode Dinonaktifkan" : "Game Mode Aktif",
      description: gameMode
        ? "Konfigurasi jaringan kembali normal."
        : "Prioritas gaming diaktifkan. Ping dioptimalkan!",
    });
  };

  const handleBlockDevice = (id: string, showToast = true) => {
    setDevices((prev) =>
      prev.map((device) =>
        device.id === id ? { ...device, connected: false } : device
      )
    );
    if (showToast) {
      toast({
        title: "Perangkat Diblokir",
        description: "Perangkat telah diputus dari jaringan.",
        variant: "destructive",
      });
    }
  };

  const handleUnblockDevice = (id: string) => {
    setDevices((prev) =>
      prev.map((device) =>
        device.id === id ? { ...device, connected: true } : device
      )
    );
  };

  const handleLimitDevice = (id: string, limit: number) => {
    toast({
      title: "Limit Diterapkan",
      description: `Kecepatan dibatasi menjadi ${limit} Mbps.`,
    });
  };

  const handleSwitchRouter = (id: string) => {
    switchRouter(id);
    setShowMultiRouterDashboard(false);
    toast({
      title: "Router Diubah",
      description: `Beralih ke ${routers.find(r => r.id === id)?.name || 'router baru'}.`,
    });
  };

  const connectedDevicesCount = devices.filter((d) => d.connected).length;

  return (
    <div className="min-h-screen pb-28 sm:pb-32 bg-background/50">
      <StatusHeader
        isOnline={status?.online ?? false}
        uptime={status?.uptime ? `${Math.floor(status.uptime / 3600)}j ${Math.floor((status.uptime % 3600) / 60)}m` : "---"}
        routers={routers}
        activeRouter={activeRouter}
        onSwitchRouter={handleSwitchRouter}
        onManageRouters={() => setShowRouterManagement(true)}
        onShowDashboard={() => setShowMultiRouterDashboard(true)}
      />

      {/* Router Management Dialog */}
      <RouterManagement
        open={showRouterManagement}
        onOpenChange={setShowRouterManagement}
        routers={routers}
        onAddRouter={addRouter}
        onUpdateRouter={updateRouter}
        onDeleteRouter={deleteRouter}
        onRestoreRouters={restoreRouters}
      />

      {/* Error Message when not connected */}
      {(error || (!loading && !isConnected)) && !showMultiRouterDashboard && (
        <div className="px-4 pt-4">
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Koneksi Gagal</AlertTitle>
            <AlertDescription>
              <p className="mb-2">{error?.split('\n')[0] || "Tidak dapat terhubung ke router."}</p>
              <div className="mt-3 p-3 bg-black/40 rounded-lg text-[10px] font-mono overflow-x-auto whitespace-pre border border-white/10 max-h-40 overflow-y-auto">
                <p className="text-white/50 mb-1">--- DEBUG INFO ---</p>
                {error || "No technical details available."}
                {loading && "\nStill loading..."}
                {!isConnected && "\nRouter status: DISCONNECTED"}
                {activeRouter && `\nActive Router: ${activeRouter.name} (${activeRouter.ipAddress})`}
              </div>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 text-xs underline opacity-70 hover:opacity-100"
              >
                Coba Muat Ulang Halaman
              </button>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Multi Router Dashboard View */}
      {showMultiRouterDashboard && (
        <div className="space-y-4">
          <div className="px-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Dashboard Multi Router</h2>
            <button
              onClick={() => setShowMultiRouterDashboard(false)}
              className="text-sm text-primary hover:underline"
            >
              Kembali
            </button>
          </div>
          <MultiRouterDashboard
            routers={routers}
            routerStatuses={routerStatuses}
            isLoading={routerLoading}
            onRefresh={checkAllRoutersStatus}
            onSwitchRouter={handleSwitchRouter}
          />
        </div>
      )}

      {!showMultiRouterDashboard && activeTab === "beranda" && (
        <div className="px-4 space-y-6">
          {/* Speed Section */}
          <div className="glass-card-elevated p-4 sm:p-6 slide-up">
            <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6 text-center">
              Kecepatan Internet
            </h2>
            <div className="flex justify-around items-end gap-2 mb-4">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 mb-2">
                  <ArrowDownCircle className="w-3.5 h-3.5 text-success" />
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-muted-foreground">Download</span>
                </div>
                <SpeedometerGauge
                  value={downloadSpeed}
                  maxValue={100}
                  label="Download"
                  unit="Mbps"
                />
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 mb-2">
                  <ArrowUpCircle className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-muted-foreground">Upload</span>
                </div>
                <SpeedometerGauge
                  value={uploadSpeed}
                  maxValue={50}
                  label="Upload"
                  unit="Mbps"
                />
              </div>
            </div>
            <WaveAnimation speed={(downloadSpeed / 100) * 100} />

            {/* Game Mode Button */}
            <button
              onClick={handleGameModeToggle}
              className={`w-full mt-4 py-3 px-4 rounded-xl flex items-center justify-center gap-3 font-semibold transition-all duration-300 ${gameMode
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_30px_hsl(280,80%,50%/0.4)] animate-pulse"
                : "bg-secondary hover:bg-secondary/80 text-foreground"
                }`}
            >
              <Gamepad2 className={`w-5 h-5 ${gameMode ? "animate-bounce" : ""}`} />
              <span>{gameMode ? "Game Mode Aktif" : "Aktifkan Game Mode"}</span>
              {gameMode && (
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  LOW PING
                </span>
              )}
            </button>
          </div>

          {/* Quota Card */}
          <QuotaCard
            usedGB={usedQuota}
            totalGB={100}
            lastUpdate="1 menit yang lalu"
          />

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3" style={{ animationDelay: "0.3s" }}>
            <div className="glass-card p-3 sm:p-4 slide-up">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Terhubung</p>
                  <p className="text-lg sm:text-xl font-bold text-foreground truncate">
                    {connectedDevicesCount}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setActiveTab("keamanan")}
              className="glass-card p-3 sm:p-4 slide-up flex items-center gap-2 sm:gap-3 hover:bg-secondary/50 transition-colors"
            >
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${whitelistMode ? "bg-success/10" : "bg-warning/10"
                }`}>
                <Shield className={`w-4 h-4 sm:w-5 sm:h-5 ${whitelistMode ? "text-success" : "text-warning"}`} />
              </div>
              <div className="text-left min-w-0">
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Anti-Maling</p>
                <p className="text-sm sm:text-base font-bold text-foreground truncate">
                  {whitelistMode ? "Aktif" : "Nonaktif"}
                </p>
              </div>
            </button>
          </div>
        </div>
      )}

      {!showMultiRouterDashboard && activeTab === "speedtest" && (
        <div className="px-4">
          <SpeedTest />
        </div>
      )}

      {!showMultiRouterDashboard && activeTab === "perangkat" && (
        <div className="px-4 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-foreground">
              Perangkat Terhubung
            </h2>
            <span className="text-sm text-muted-foreground">
              {connectedDevicesCount} aktif
            </span>
          </div>
          {devices.map((device, index) => (
            <div key={device.id} style={{ animationDelay: `${index * 0.1}s` }}>
              <DeviceCard
                device={device}
                onBlock={handleBlockDevice}
                onLimit={handleLimitDevice}
              />
            </div>
          ))}
        </div>
      )}

      {!showMultiRouterDashboard && activeTab === "wifi" && (
        <WiFiSettings
          initialSSID={apiWifi?.ssid || ""}
          initialPassword={apiWifi?.password || ""}
          initialHidden={apiWifi?.hidden || false}
          onSave={saveWifi}
        />
      )}

      {!showMultiRouterDashboard && activeTab === "qrcode" && (
        <div className="px-4">
          <WiFiQRCode
            ssid={apiWifi?.ssid || ""}
            password={apiWifi?.password || ""}
            hidden={apiWifi?.hidden || false}
          />
        </div>
      )}

      {!showMultiRouterDashboard && activeTab === "guestwifi" && (
        <div className="px-4">
          <GuestWiFi />
        </div>
      )}

      {!showMultiRouterDashboard && activeTab === "keamanan" && (
        <div className="px-4">
          <AntiIntruder
            devices={devices}
            onWhitelistDevice={handleWhitelistDevice}
            onBlockDevice={handleBlockDevice}
            whitelistMode={whitelistMode}
            onWhitelistModeToggle={handleWhitelistModeToggle}
          />
        </div>
      )}

      {!showMultiRouterDashboard && activeTab === "jadwal" && (
        <div className="px-4">
          <ParentalControl
            devices={devices}
            onBlockDevice={(id) => handleBlockDevice(id, false)}
            onUnblockDevice={handleUnblockDevice}
          />
        </div>
      )}

      {!showMultiRouterDashboard && activeTab === "bandwidth" && (
        <div className="px-4">
          <BandwidthLimiter />
        </div>
      )}

      {!showMultiRouterDashboard && activeTab === "voucher" && (
        <div className="px-4">
          <VoucherSystem />
        </div>
      )}

      {!showMultiRouterDashboard && activeTab === "dns" && (
        <div className="px-4">
          <DNSSettings />
        </div>
      )}

      {!showMultiRouterDashboard && activeTab === "grupdevice" && (
        <div className="px-4">
          <DeviceGrouping devices={devices} />
        </div>
      )}

      {!showMultiRouterDashboard && activeTab === "monitor" && (
        <div className="px-4">
          <DeviceUsageMonitor devices={devices} />
        </div>
      )}

      {!showMultiRouterDashboard && activeTab === "traffic" && (
        <div className="px-4">
          <TrafficStatistics />
        </div>
      )}

      {!showMultiRouterDashboard && activeTab === "kontrol" && (
        <div className="px-4 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Panel Kontrol</h2>
          <VPNManagement />
          <ProxyInjectManager />
          <AdblockManager />
          <AppBlocker />
        </div>
      )}

      {!showMultiRouterDashboard && activeTab === "portfwd" && (
        <div className="px-4">
          <PortForwarding />
        </div>
      )}

      {!showMultiRouterDashboard && activeTab === "firewall" && (
        <div className="px-4">
          <FirewallRules />
        </div>
      )}

      {!showMultiRouterDashboard && activeTab === "qos" && (
        <div className="px-4">
          <QoSManagement />
        </div>
      )}

      {!showMultiRouterDashboard && activeTab === "upnp" && (
        <div className="px-4">
          <UPnPManagement />
        </div>
      )}

      {!showMultiRouterDashboard && activeTab === "optimasi" && (
        <div className="px-4">
          <NetworkCleaner />
        </div>
      )}

      {!showMultiRouterDashboard && activeTab === "tagihan" && (
        <div className="px-4">
          <BillingReport usedGB={usedQuota} totalGB={100} />
        </div>
      )}

      {!showMultiRouterDashboard && activeTab === "sistem" && (
        <div className="px-4">
          <SystemManagement />
        </div>
      )}

      {!showMultiRouterDashboard && activeTab === "captive" && (
        <div className="px-4">
          <CaptivePortal />
        </div>
      )}

      {!showMultiRouterDashboard && activeTab === "loadbalance" && (
        <div className="px-4">
          <LoadBalancing />
        </div>
      )}

      {!showMultiRouterDashboard && activeTab === "macclone" && (
        <div className="px-4">
          <MACCloning />
        </div>
      )}

      {!showMultiRouterDashboard && activeTab === "vlan" && (
        <div className="px-4">
          <VLANManagement />
        </div>
      )}

      {!showMultiRouterDashboard && activeTab === "ssh" && (
        <div className="px-4">
          <SSHManager />
        </div>
      )}

      {!showMultiRouterDashboard && activeTab === "zerotier" && (
        <div className="px-4">
          <ZeroTierManager />
        </div>
      )}

      {!showMultiRouterDashboard && activeTab === "samba" && (
        <div className="px-4">
          <SambaNASManager />
        </div>
      )}

      {!showMultiRouterDashboard && activeTab === "admin" && (
        <AdminPanel
          systemData={system}
        />
      )}

      <SupportChatbot />
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;