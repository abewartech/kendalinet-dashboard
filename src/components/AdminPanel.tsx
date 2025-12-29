import { useState } from "react";
import {
  RotateCcw,
  Power,
  Shield,
  Server,
  HardDrive,
  Cpu,
  Thermometer,
  Clock,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

interface AdminPanelProps {
  simulationMode: boolean;
  onSimulationToggle: (enabled: boolean) => void;
  systemData?: any;
}

const AdminPanel = ({ simulationMode, onSimulationToggle, systemData }: AdminPanelProps) => {
  const [restarting, setRestarting] = useState(false);

  const systemStats = {
    cpu: systemData?.cpu_load ? Math.min(100, Math.floor(parseFloat(systemData.cpu_load) * 20)) : 23, // Simple mapping for demo
    memory: systemData?.memory_percent || 45,
    temperature: 52, // Temperature might need another ubus call or isn't always available
    uptime: systemData?.uptime ? `${Math.floor(systemData.uptime / 3600)} Jam ${Math.floor((systemData.uptime % 3600) / 60)} Menit` : "12 Jam 34 Menit",
    firmware: systemData?.firmware || "OpenWrt 23.05.2",
    model: systemData?.model || "TP-Link Archer C7 v5",
  };

  const handleRestart = async () => {
    setRestarting(true);
    toast({
      title: "Memulai Ulang Router",
      description: "Router akan restart dalam beberapa detik...",
    });
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setRestarting(false);
  };

  return (
    <div className="space-y-6 px-4 pb-24">
      {/* System Info */}
      <div className="glass-card p-5 fade-in">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Server className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Informasi Sistem</h3>
            <p className="text-xs text-muted-foreground">{systemStats.model}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-xl bg-secondary/50">
            <div className="flex items-center gap-2 mb-1">
              <Cpu className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">CPU</span>
            </div>
            <p className="text-xl font-bold text-foreground">{systemStats.cpu}%</p>
          </div>
          <div className="p-3 rounded-xl bg-secondary/50">
            <div className="flex items-center gap-2 mb-1">
              <HardDrive className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Memory</span>
            </div>
            <p className="text-xl font-bold text-foreground">{systemStats.memory}%</p>
          </div>
          <div className="p-3 rounded-xl bg-secondary/50">
            <div className="flex items-center gap-2 mb-1">
              <Thermometer className="w-4 h-4 text-warning" />
              <span className="text-xs text-muted-foreground">Suhu</span>
            </div>
            <p className="text-xl font-bold text-foreground">{systemStats.temperature}°C</p>
          </div>
          <div className="p-3 rounded-xl bg-secondary/50">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-success" />
              <span className="text-xs text-muted-foreground">Uptime</span>
            </div>
            <p className="text-sm font-bold text-foreground">{systemStats.uptime}</p>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-xl bg-secondary/50">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Firmware</span>
          </div>
          <p className="font-medium text-foreground">{systemStats.firmware}</p>
        </div>
      </div>

      {/* Simulation Mode */}
      <div
        className="glass-card-elevated p-5 fade-in"
        style={{ animationDelay: "0.1s" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <Power className="w-5 h-5 text-warning" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Mode Simulasi</h3>
              <p className="text-xs text-muted-foreground">
                Data kecepatan bergerak otomatis untuk demo
              </p>
            </div>
          </div>
          <Switch
            checked={simulationMode}
            onCheckedChange={onSimulationToggle}
            className="data-[state=checked]:bg-warning"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-5 fade-in" style={{ animationDelay: "0.2s" }}>
        <h3 className="font-semibold text-foreground mb-4">Aksi Cepat</h3>
        <div className="space-y-3">
          <button
            onClick={handleRestart}
            disabled={restarting}
            className="w-full flex items-center gap-3 p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <RotateCcw
              className={`w-5 h-5 text-warning ${restarting ? "animate-spin" : ""}`}
            />
            <div className="text-left">
              <p className="font-medium text-foreground">
                {restarting ? "Memulai Ulang..." : "Restart Router"}
              </p>
              <p className="text-xs text-muted-foreground">
                Memulai ulang sistem router
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
