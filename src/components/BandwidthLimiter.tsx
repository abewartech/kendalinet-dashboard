import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Gauge, Smartphone, Laptop, Tv, Gamepad2, Video, Globe } from 'lucide-react';
import { toast } from 'sonner';

interface Device {
  id: string;
  name: string;
  ip: string;
  type: 'phone' | 'laptop' | 'tv' | 'other';
  currentLimit?: number;
}

const mockDevices: Device[] = [
  { id: '1', name: 'iPhone Anak', ip: '192.168.1.101', type: 'phone', currentLimit: 5 },
  { id: '2', name: 'Laptop Kerja', ip: '192.168.1.102', type: 'laptop' },
  { id: '3', name: 'Smart TV', ip: '192.168.1.103', type: 'tv', currentLimit: 20 },
  { id: '4', name: 'HP Mama', ip: '192.168.1.104', type: 'phone' },
];

const presets = [
  { name: 'Basic', icon: Globe, speed: 2, color: 'bg-muted text-muted-foreground' },
  { name: 'Streaming', icon: Video, speed: 10, color: 'bg-blue-500/20 text-blue-400' },
  { name: 'Gaming', icon: Gamepad2, speed: 25, color: 'bg-green-500/20 text-green-400' },
];

const getDeviceIcon = (type: Device['type']) => {
  switch (type) {
    case 'phone': return Smartphone;
    case 'laptop': return Laptop;
    case 'tv': return Tv;
    default: return Globe;
  }
};

export const BandwidthLimiter = () => {
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [speedLimit, setSpeedLimit] = useState<number>(10);

  const handleSelectDevice = (device: Device) => {
    setSelectedDevice(device);
    setSpeedLimit(device.currentLimit || 10);
  };

  const handleApplyLimit = () => {
    if (!selectedDevice) return;

    setDevices(prev => prev.map(d => 
      d.id === selectedDevice.id ? { ...d, currentLimit: speedLimit } : d
    ));
    
    toast.success(`Limit ${speedLimit} Mbps diterapkan ke ${selectedDevice.name}`);
    setSelectedDevice(null);
  };

  const handleRemoveLimit = (deviceId: string) => {
    setDevices(prev => prev.map(d => 
      d.id === deviceId ? { ...d, currentLimit: undefined } : d
    ));
    toast.success('Limit bandwidth dihapus');
  };

  return (
    <div className="space-y-4">
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Gauge className="w-5 h-5 text-primary" />
            Bandwidth Limiter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Device List */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Pilih perangkat:</p>
            <div className="grid gap-2">
              {devices.map(device => {
                const DeviceIcon = getDeviceIcon(device.type);
                const isSelected = selectedDevice?.id === device.id;
                
                return (
                  <div
                    key={device.id}
                    onClick={() => handleSelectDevice(device)}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border/50 bg-background/50 hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <DeviceIcon className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{device.name}</p>
                        <p className="text-xs text-muted-foreground">{device.ip}</p>
                      </div>
                    </div>
                    {device.currentLimit && (
                      <Badge 
                        variant="secondary" 
                        className="bg-orange-500/20 text-orange-400 cursor-pointer hover:bg-orange-500/30"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveLimit(device.id);
                        }}
                      >
                        {device.currentLimit} Mbps ✕
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Speed Limit Control */}
          {selectedDevice && (
            <div className="space-y-4 pt-4 border-t border-border/50">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Limit untuk {selectedDevice.name}</p>
                <p className="text-4xl font-bold text-primary">{speedLimit} <span className="text-lg">Mbps</span></p>
              </div>

              {/* Slider */}
              <div className="px-2">
                <Slider
                  value={[speedLimit]}
                  onValueChange={(val) => setSpeedLimit(val[0])}
                  min={1}
                  max={50}
                  step={1}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 Mbps</span>
                  <span>50 Mbps</span>
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
                      className={`flex flex-col h-auto py-3 ${
                        speedLimit === preset.speed ? preset.color + ' border-current' : ''
                      }`}
                    >
                      <PresetIcon className="w-5 h-5 mb-1" />
                      <span className="text-xs">{preset.name}</span>
                      <span className="text-xs opacity-70">{preset.speed} Mbps</span>
                    </Button>
                  );
                })}
              </div>

              {/* Apply Button */}
              <Button 
                className="w-full" 
                onClick={handleApplyLimit}
              >
                Terapkan Limit
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
