import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Gauge, Smartphone, Laptop, Tv, Gamepad2, Video, Globe, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useLuciApi } from '@/hooks/useLuciApi';

interface Device {
  mac: string;
  name: string;
  ip: string;
  online: boolean;
  limit?: number;
  usage?: number;
}

const presets = [
  { name: 'Basic', icon: Globe, speed: 2, color: 'bg-muted text-muted-foreground' },
  { name: 'Streaming', icon: Video, speed: 10, color: 'bg-blue-500/20 text-blue-400' },
  { name: 'Gaming', icon: Gamepad2, speed: 25, color: 'bg-green-500/20 text-green-400' },
];

const getDeviceIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('iphone') || lowerName.includes('hp') || lowerName.includes('phone')) return Smartphone;
  if (lowerName.includes('laptop') || lowerName.includes('pc') || lowerName.includes('komputer')) return Laptop;
  if (lowerName.includes('tv') || lowerName.includes('television')) return Tv;
  return Globe;
};

export const BandwidthLimiter = () => {
  const { devices: apiDevices, fetchDevices, applyBandwidthLimit, loading } = useLuciApi();
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [speedLimit, setSpeedLimit] = useState<number>(10);

  const handleSelectDevice = (device: Device) => {
    setSelectedDevice(device);
    setSpeedLimit(device.limit && device.limit > 0 ? device.limit : 10);
  };

  const handleApplyLimit = async () => {
    if (!selectedDevice) return;

    try {
      const result = await applyBandwidthLimit(selectedDevice.mac, speedLimit);
      if (result.success) {
        toast.success(`Limit ${speedLimit} Mbps diterapkan ke ${selectedDevice.name || selectedDevice.ip}`);
        setSelectedDevice(null);
        fetchDevices();
      } else {
        toast.error(`Gagal: ${result.error || 'Terjadi kesalahan'}`);
      }
    } catch (err) {
      toast.error('Gagal menghubungi router');
    }
  };

  const handleRemoveLimit = async (mac: string) => {
    try {
      const result = await applyBandwidthLimit(mac, 0);
      if (result.success) {
        toast.success('Limit bandwidth dihapus');
        fetchDevices();
      } else {
        toast.error(`Gagal: ${result.error || 'Terjadi kesalahan'}`);
      }
    } catch (err) {
      toast.error('Gagal menghubungi router');
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Gauge className="w-5 h-5 text-primary" />
              Bandwidth Limiter
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => fetchDevices()} disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Device List */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Pilih perangkat ({apiDevices.length}):</p>
            <div className="grid gap-2">
              {apiDevices.length === 0 && !loading && (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  Tidak ada perangkat terdeteksi
                </div>
              )}
              {apiDevices.map(device => {
                const DeviceIcon = getDeviceIcon(device.name || '');
                const isSelected = selectedDevice?.mac === device.mac;
                const hasLimit = device.limit && device.limit > 0;

                return (
                  <div
                    key={device.mac}
                    onClick={() => handleSelectDevice(device)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${isSelected
                        ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(var(--primary),0.1)]'
                        : 'border-border/40 bg-background/40 hover:border-primary/40'
                      } ${!device.online ? 'opacity-60' : ''}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-lg ${device.online ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        <DeviceIcon className="w-5 h-5" />
                      </div>
                      <div className="truncate">
                        <p className="font-bold text-sm truncate">{device.name !== 'unknown' ? device.name : device.ip}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground font-mono">{device.ip}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasLimit && (
                        <Badge
                          className="bg-orange-500/20 text-orange-400 border-orange-500/30 font-bold px-2 py-0.5"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveLimit(device.mac);
                          }}
                        >
                          {device.limit} Mbps <span className="ml-1 opacity-60">✕</span>
                        </Badge>
                      )}
                      {!device.online && <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Offline</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Speed Limit Control */}
          {selectedDevice && (
            <div className="space-y-4 pt-4 border-t border-border/50 animate-in fade-in slide-in-from-top-2">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-widest font-bold">Atur Limit Untuk</p>
                <p className="text-sm font-bold text-foreground mb-2 truncate">{selectedDevice.name || selectedDevice.ip}</p>
                <div className="flex items-center justify-center gap-2">
                  <p className="text-4xl font-extrabold text-primary tracking-tight">{speedLimit}</p>
                  <span className="text-sm font-bold text-muted-foreground uppercase">Mbps</span>
                </div>
              </div>

              {/* Slider */}
              <div className="px-2">
                <Slider
                  value={[speedLimit]}
                  onValueChange={(val) => setSpeedLimit(val[0])}
                  min={1}
                  max={100}
                  step={1}
                  className="py-6"
                />
                <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  <span>1 Mbps</span>
                  <span>100 Mbps</span>
                </div>
              </div>

              {/* Presets */}
              <div className="grid grid-cols-3 gap-2">
                {presets.map(preset => {
                  const PresetIcon = preset.icon;
                  return (
                    <Button
                      key={preset.name}
                      variant="outline"
                      size="sm"
                      onClick={() => setSpeedLimit(preset.speed)}
                      className={`flex flex-col h-auto py-3 gap-1 transition-all ${speedLimit === preset.speed
                          ? preset.color + ' border-current shadow-lg ring-1 ring-primary'
                          : 'border-border/50 hover:border-primary/30'
                        }`}
                    >
                      <PresetIcon className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">{preset.name}</span>
                      <span className="text-[10px] opacity-70">{preset.speed}M</span>
                    </Button>
                  );
                })}
              </div>

              {/* Apply Button */}
              <Button
                className="w-full h-11 btn-primary-gradient shadow-lg"
                onClick={handleApplyLimit}
                disabled={loading}
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
                Terapkan Limit Bandwidth
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <p className="text-[10px] text-center text-muted-foreground/60 px-4">
        * Limit bandwidth menggunakan TC HTB pada OpenWrt. Pastikan kmod-sched-core terinstal.
      </p>
    </div>
  );
};
