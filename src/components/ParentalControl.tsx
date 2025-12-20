import { useState, useEffect } from "react";
import { Clock, Utensils, Moon, Sun, Play, Pause, Timer, Smartphone } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Device {
  id: string;
  name: string;
  type: "phone" | "laptop" | "desktop" | "tablet";
  connected: boolean;
}

interface DeviceSchedule {
  deviceId: string;
  startTime: string; // Format: "HH:MM"
  endTime: string;
  enabled: boolean;
}

interface ParentalControlProps {
  devices: Device[];
  onBlockDevice: (id: string) => void;
  onUnblockDevice: (id: string) => void;
}

const ParentalControl = ({ devices, onBlockDevice, onUnblockDevice }: ParentalControlProps) => {
  const [mealTimeActive, setMealTimeActive] = useState(false);
  const [mealTimeRemaining, setMealTimeRemaining] = useState(0);
  const [schedules, setSchedules] = useState<DeviceSchedule[]>([]);

  // Meal time countdown
  useEffect(() => {
    if (!mealTimeActive || mealTimeRemaining <= 0) return;

    const interval = setInterval(() => {
      setMealTimeRemaining((prev) => {
        if (prev <= 1) {
          setMealTimeActive(false);
          devices.forEach((d) => onUnblockDevice(d.id));
          toast({
            title: "Waktu Makan Selesai",
            description: "Internet kembali aktif untuk semua perangkat.",
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [mealTimeActive, mealTimeRemaining, devices, onUnblockDevice]);

  // Check schedules every minute
  useEffect(() => {
    const checkSchedules = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

      schedules.forEach((schedule) => {
        if (!schedule.enabled) return;

        const isInRestPeriod = isTimeInRange(currentTime, schedule.startTime, schedule.endTime);
        const device = devices.find((d) => d.id === schedule.deviceId);

        if (device) {
          if (isInRestPeriod && device.connected) {
            onBlockDevice(schedule.deviceId);
          }
        }
      });
    };

    checkSchedules();
    const interval = setInterval(checkSchedules, 60000);
    return () => clearInterval(interval);
  }, [schedules, devices, onBlockDevice]);

  const isTimeInRange = (current: string, start: string, end: string) => {
    const [currentH, currentM] = current.split(":").map(Number);
    const [startH, startM] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);

    const currentMinutes = currentH * 60 + currentM;
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    if (startMinutes <= endMinutes) {
      return currentMinutes >= startMinutes && currentMinutes < endMinutes;
    } else {
      // Overnight schedule (e.g., 21:00 to 06:00)
      return currentMinutes >= startMinutes || currentMinutes < endMinutes;
    }
  };

  const handleMealTime = () => {
    if (mealTimeActive) {
      setMealTimeActive(false);
      setMealTimeRemaining(0);
      devices.forEach((d) => onUnblockDevice(d.id));
      toast({
        title: "Waktu Makan Dibatalkan",
        description: "Internet kembali aktif.",
      });
    } else {
      setMealTimeActive(true);
      setMealTimeRemaining(30 * 60); // 30 minutes in seconds
      devices.forEach((d) => onBlockDevice(d.id));
      toast({
        title: "🍽️ Waktunya Makan!",
        description: "Internet dimatikan selama 30 menit untuk semua perangkat.",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const addSchedule = (deviceId: string) => {
    if (schedules.find((s) => s.deviceId === deviceId)) return;

    setSchedules([
      ...schedules,
      {
        deviceId,
        startTime: "21:00",
        endTime: "06:00",
        enabled: true,
      },
    ]);
    toast({
      title: "Jadwal Ditambahkan",
      description: "Atur waktu istirahat untuk perangkat ini.",
    });
  };

  const updateSchedule = (deviceId: string, field: keyof DeviceSchedule, value: string | boolean) => {
    setSchedules((prev) =>
      prev.map((s) => (s.deviceId === deviceId ? { ...s, [field]: value } : s))
    );
  };

  const removeSchedule = (deviceId: string) => {
    setSchedules((prev) => prev.filter((s) => s.deviceId !== deviceId));
  };

  const connectedDevices = devices.filter((d) => d.connected);

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    return [`${hour}:00`, `${hour}:30`];
  }).flat();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="glass-card-elevated p-6 slide-up">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Clock className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Jadwal Istirahat</h2>
            <p className="text-sm text-muted-foreground">Kontrol waktu internet anak</p>
          </div>
        </div>
      </div>

      {/* Meal Time Button */}
      <button
        onClick={handleMealTime}
        className={`w-full glass-card p-6 slide-up transition-all duration-300 ${
          mealTimeActive
            ? "bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30"
            : "hover:bg-secondary/50"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
                mealTimeActive
                  ? "bg-orange-500/30 animate-pulse"
                  : "bg-orange-500/10"
              }`}
            >
              <Utensils className={`w-7 h-7 text-orange-500 ${mealTimeActive ? "animate-bounce" : ""}`} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-foreground text-lg">
                {mealTimeActive ? "Waktu Makan Aktif" : "Waktunya Makan!"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {mealTimeActive
                  ? `Sisa waktu: ${formatTime(mealTimeRemaining)}`
                  : "Matikan internet 30 menit untuk keluarga"}
              </p>
            </div>
          </div>
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              mealTimeActive ? "bg-orange-500" : "bg-secondary"
            }`}
          >
            {mealTimeActive ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-foreground" />
            )}
          </div>
        </div>
      </button>

      {/* Device Schedules */}
      <div className="glass-card p-4 slide-up">
        <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
          <Moon className="w-4 h-4 text-primary" />
          Jadwal Tidur Perangkat
        </h3>

        {/* Devices without schedule */}
        {connectedDevices.filter((d) => !schedules.find((s) => s.deviceId === d.id)).length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2">Tambah jadwal untuk:</p>
            <div className="flex flex-wrap gap-2">
              {connectedDevices
                .filter((d) => !schedules.find((s) => s.deviceId === d.id))
                .map((device) => (
                  <button
                    key={device.id}
                    onClick={() => addSchedule(device.id)}
                    className="px-3 py-2 rounded-lg bg-secondary/50 text-sm font-medium text-foreground hover:bg-secondary transition-colors flex items-center gap-2"
                  >
                    <Smartphone className="w-4 h-4" />
                    {device.name}
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Scheduled Devices */}
        {schedules.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Belum ada jadwal istirahat yang diatur
          </p>
        ) : (
          <div className="space-y-3">
            {schedules.map((schedule) => {
              const device = devices.find((d) => d.id === schedule.deviceId);
              if (!device) return null;

              return (
                <div
                  key={schedule.deviceId}
                  className={`p-4 rounded-xl transition-all ${
                    schedule.enabled ? "bg-primary/10" : "bg-secondary/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-primary" />
                      <span className="font-medium text-foreground">{device.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={schedule.enabled}
                        onCheckedChange={(checked) =>
                          updateSchedule(schedule.deviceId, "enabled", checked)
                        }
                      />
                      <button
                        onClick={() => removeSchedule(schedule.deviceId)}
                        className="text-xs text-destructive hover:underline"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground mb-1">Mulai Istirahat</p>
                      <Select
                        value={schedule.startTime}
                        onValueChange={(value) =>
                          updateSchedule(schedule.deviceId, "startTime", value)
                        }
                      >
                        <SelectTrigger className="bg-background/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={`start-${time}`} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Timer className="w-4 h-4 text-muted-foreground mt-5" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground mb-1">Selesai</p>
                      <Select
                        value={schedule.endTime}
                        onValueChange={(value) =>
                          updateSchedule(schedule.deviceId, "endTime", value)
                        }
                      >
                        <SelectTrigger className="bg-background/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={`end-${time}`} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <Moon className="w-3 h-3" />
                    <span>
                      Internet mati dari {schedule.startTime} sampai {schedule.endTime}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="glass-card p-4 slide-up border-l-4 border-primary">
        <div className="flex items-start gap-3">
          <Sun className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground text-sm">Tips Penggunaan</h4>
            <ul className="text-xs text-muted-foreground mt-1 space-y-1">
              <li>• Atur jadwal tidur untuk HP anak agar istirahat tepat waktu</li>
              <li>• Gunakan "Waktunya Makan" saat berkumpul bersama keluarga</li>
              <li>• Jadwal bisa berbeda untuk setiap perangkat</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentalControl;
