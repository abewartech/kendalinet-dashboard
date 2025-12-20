import { Smartphone, Laptop, Monitor, Tablet, MoreVertical, Ban, Gauge } from "lucide-react";
import { useState } from "react";

interface Device {
  id: string;
  name: string;
  type: "phone" | "laptop" | "desktop" | "tablet";
  ip: string;
  mac: string;
  connected: boolean;
  downloadSpeed: number;
  uploadSpeed: number;
}

interface DeviceCardProps {
  device: Device;
  onBlock: (id: string) => void;
  onLimit: (id: string, limit: number) => void;
}

const deviceIcons = {
  phone: Smartphone,
  laptop: Laptop,
  desktop: Monitor,
  tablet: Tablet,
};

const DeviceCard = ({ device, onBlock, onLimit }: DeviceCardProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [speedLimit, setSpeedLimit] = useState(10);
  const Icon = deviceIcons[device.type];

  return (
    <>
      <div className="glass-card p-4 fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <span
                className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-card ${
                  device.connected ? "bg-success" : "bg-muted-foreground"
                }`}
              />
            </div>
            <div>
              <h4 className="font-medium text-foreground">{device.name}</h4>
              <p className="text-xs text-muted-foreground">{device.ip}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right mr-2">
              <p className="text-xs text-muted-foreground">
                ↓ {device.downloadSpeed.toFixed(1)} Mbps
              </p>
              <p className="text-xs text-muted-foreground">
                ↑ {device.uploadSpeed.toFixed(1)} Mbps
              </p>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <MoreVertical className="w-5 h-5 text-muted-foreground" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full mt-1 glass-card p-2 min-w-[140px] z-10">
                  <button
                    onClick={() => {
                      setShowLimitModal(true);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-foreground hover:bg-secondary transition-colors"
                  >
                    <Gauge className="w-4 h-4" />
                    Limit Speed
                  </button>
                  <button
                    onClick={() => {
                      onBlock(device.id);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Ban className="w-4 h-4" />
                    Blokir
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Speed Limit Modal */}
      {showLimitModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card-elevated p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Limit Kecepatan - {device.name}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">
                  Batas Kecepatan (Mbps)
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={speedLimit}
                  onChange={(e) => setSpeedLimit(Number(e.target.value))}
                  className="w-full mt-2 accent-primary"
                />
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-muted-foreground">1 Mbps</span>
                  <span className="font-medium text-primary">{speedLimit} Mbps</span>
                  <span className="text-muted-foreground">100 Mbps</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLimitModal(false)}
                  className="flex-1 py-3 rounded-xl bg-secondary text-foreground font-medium transition-colors hover:bg-secondary/80"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    onLimit(device.id, speedLimit);
                    setShowLimitModal(false);
                  }}
                  className="flex-1 py-3 rounded-xl btn-primary-gradient transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Terapkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeviceCard;
