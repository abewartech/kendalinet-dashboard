import { useState, useEffect } from "react";
import { Users, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import StatusHeader from "@/components/StatusHeader";
import SpeedometerGauge from "@/components/SpeedometerGauge";
import WaveAnimation from "@/components/WaveAnimation";
import QuotaCard from "@/components/QuotaCard";
import DeviceCard from "@/components/DeviceCard";
import WiFiSettings from "@/components/WiFiSettings";
import AdminPanel from "@/components/AdminPanel";
import BottomNavigation from "@/components/BottomNavigation";
import { toast } from "@/hooks/use-toast";

// Mock data for devices
const initialDevices = [
  {
    id: "1",
    name: "iPhone 14 Pro",
    type: "phone" as const,
    ip: "192.168.1.101",
    mac: "AA:BB:CC:DD:EE:01",
    connected: true,
    downloadSpeed: 45.2,
    uploadSpeed: 12.8,
  },
  {
    id: "2",
    name: "MacBook Pro",
    type: "laptop" as const,
    ip: "192.168.1.102",
    mac: "AA:BB:CC:DD:EE:02",
    connected: true,
    downloadSpeed: 78.5,
    uploadSpeed: 25.3,
  },
  {
    id: "3",
    name: "Samsung TV",
    type: "desktop" as const,
    ip: "192.168.1.103",
    mac: "AA:BB:CC:DD:EE:03",
    connected: true,
    downloadSpeed: 32.1,
    uploadSpeed: 5.4,
  },
  {
    id: "4",
    name: "iPad Mini",
    type: "tablet" as const,
    ip: "192.168.1.104",
    mac: "AA:BB:CC:DD:EE:04",
    connected: false,
    downloadSpeed: 0,
    uploadSpeed: 0,
  },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("beranda");
  const [downloadSpeed, setDownloadSpeed] = useState(87.4);
  const [uploadSpeed, setUploadSpeed] = useState(34.2);
  const [usedQuota, setUsedQuota] = useState(45.8);
  const [simulationMode, setSimulationMode] = useState(true);
  const [devices, setDevices] = useState(initialDevices);

  // Simulation effect for demo mode
  useEffect(() => {
    if (!simulationMode) return;

    const interval = setInterval(() => {
      setDownloadSpeed((prev) => {
        const change = (Math.random() - 0.5) * 20;
        return Math.max(10, Math.min(100, prev + change));
      });
      setUploadSpeed((prev) => {
        const change = (Math.random() - 0.5) * 10;
        return Math.max(5, Math.min(50, prev + change));
      });
      setUsedQuota((prev) => {
        const change = Math.random() * 0.05;
        return Math.min(99, prev + change);
      });

      // Update device speeds randomly
      setDevices((prev) =>
        prev.map((device) =>
          device.connected
            ? {
                ...device,
                downloadSpeed: Math.max(
                  0,
                  device.downloadSpeed + (Math.random() - 0.5) * 10
                ),
                uploadSpeed: Math.max(
                  0,
                  device.uploadSpeed + (Math.random() - 0.5) * 5
                ),
              }
            : device
        )
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [simulationMode]);

  const handleBlockDevice = (id: string) => {
    setDevices((prev) =>
      prev.map((device) =>
        device.id === id ? { ...device, connected: false } : device
      )
    );
    toast({
      title: "Perangkat Diblokir",
      description: "Perangkat telah diputus dari jaringan.",
      variant: "destructive",
    });
  };

  const handleLimitDevice = (id: string, limit: number) => {
    toast({
      title: "Limit Diterapkan",
      description: `Kecepatan dibatasi menjadi ${limit} Mbps.`,
    });
  };

  const connectedDevicesCount = devices.filter((d) => d.connected).length;

  return (
    <div className="min-h-screen pb-24">
      <StatusHeader isOnline={true} uptime="12 Jam 34 Menit" />

      {activeTab === "beranda" && (
        <div className="px-4 space-y-6">
          {/* Speed Section */}
          <div className="glass-card-elevated p-6 slide-up">
            <h2 className="text-lg font-semibold text-foreground mb-6 text-center">
              Kecepatan Internet
            </h2>
            <div className="flex justify-around items-center mb-4">
              <div className="flex flex-col items-center">
                <ArrowDownCircle className="w-5 h-5 text-success mb-2" />
                <SpeedometerGauge
                  value={downloadSpeed}
                  maxValue={100}
                  label="Download"
                  unit="Mbps"
                />
              </div>
              <div className="flex flex-col items-center">
                <ArrowUpCircle className="w-5 h-5 text-primary mb-2" />
                <SpeedometerGauge
                  value={uploadSpeed}
                  maxValue={50}
                  label="Upload"
                  unit="Mbps"
                />
              </div>
            </div>
            <WaveAnimation speed={(downloadSpeed / 100) * 100} />
          </div>

          {/* Quota Card */}
          <QuotaCard
            usedGB={usedQuota}
            totalGB={100}
            lastUpdate="1 menit yang lalu"
          />

          {/* Quick Stats */}
          <div className="glass-card p-4 slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Perangkat Terhubung</p>
                  <p className="text-2xl font-bold text-foreground">
                    {connectedDevicesCount}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("perangkat")}
                className="px-4 py-2 rounded-xl bg-secondary text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors"
              >
                Lihat Semua
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "perangkat" && (
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

      {activeTab === "wifi" && (
        <WiFiSettings
          initialSSID="KendaliNet_5G"
          initialPassword="password123"
          initialHidden={false}
        />
      )}

      {activeTab === "admin" && (
        <AdminPanel
          simulationMode={simulationMode}
          onSimulationToggle={setSimulationMode}
        />
      )}

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
