import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  RefreshCw, 
  Clock, 
  Trash2, 
  Wifi, 
  HardDrive,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NetworkCleanerProps {
  simulationMode: boolean;
}

interface CleanupTask {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'pending' | 'running' | 'completed';
}

const NetworkCleaner: React.FC<NetworkCleanerProps> = ({ simulationMode }) => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRebootEnabled, setAutoRebootEnabled] = useState(false);
  const [rebootTime, setRebootTime] = useState('03:00');
  const [lastCleanup, setLastCleanup] = useState<Date | null>(null);
  const [nextReboot, setNextReboot] = useState<Date | null>(null);
  const [cleanupTasks, setCleanupTasks] = useState<CleanupTask[]>([
    { id: 'cache', name: 'Bersihkan Cache', description: 'Menghapus cache jaringan', icon: <Trash2 className="h-4 w-4" />, status: 'pending' },
    { id: 'logs', name: 'Hapus Log Lama', description: 'Membersihkan log sistem', icon: <HardDrive className="h-4 w-4" />, status: 'pending' },
    { id: 'channel', name: 'Optimasi Channel WiFi', description: 'Memilih channel terbaik', icon: <Wifi className="h-4 w-4" />, status: 'pending' },
  ]);

  // Calculate next reboot time
  useEffect(() => {
    if (autoRebootEnabled) {
      const [hours, minutes] = rebootTime.split(':').map(Number);
      const now = new Date();
      const next = new Date();
      next.setHours(hours, minutes, 0, 0);
      
      if (next <= now) {
        next.setDate(next.getDate() + 1);
      }
      
      setNextReboot(next);
    } else {
      setNextReboot(null);
    }
  }, [autoRebootEnabled, rebootTime]);

  const runCleanupTask = async (taskId: string): Promise<void> => {
    return new Promise((resolve) => {
      setCleanupTasks(prev => 
        prev.map(t => t.id === taskId ? { ...t, status: 'running' } : t)
      );
      
      setTimeout(() => {
        setCleanupTasks(prev => 
          prev.map(t => t.id === taskId ? { ...t, status: 'completed' } : t)
        );
        resolve();
      }, 1000 + Math.random() * 1500);
    });
  };

  const handleRefreshNetwork = async () => {
    if (!simulationMode) {
      toast({
        title: "Mode Simulasi Diperlukan",
        description: "Aktifkan mode simulasi untuk menjalankan fitur ini",
        variant: "destructive"
      });
      return;
    }

    setIsRefreshing(true);
    
    // Reset all tasks to pending
    setCleanupTasks(prev => prev.map(t => ({ ...t, status: 'pending' })));

    toast({
      title: "🔄 Memulai Pembersihan",
      description: "Menyegarkan jaringan Anda...",
    });

    // Run tasks sequentially for visual effect
    for (const task of cleanupTasks) {
      await runCleanupTask(task.id);
    }

    setLastCleanup(new Date());
    setIsRefreshing(false);

    toast({
      title: "✨ Pembersihan Selesai",
      description: "Jaringan Anda sekarang lebih segar dan optimal!",
    });
  };

  const handleAutoRebootToggle = (enabled: boolean) => {
    setAutoRebootEnabled(enabled);
    
    if (enabled) {
      toast({
        title: "🕐 Auto-Reboot Aktif",
        description: `Router akan restart otomatis setiap hari jam ${rebootTime}`,
      });
    } else {
      toast({
        title: "Auto-Reboot Dinonaktifkan",
        description: "Router tidak akan restart otomatis",
      });
    }
  };

  const formatTimeRemaining = (targetDate: Date): string => {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}j ${minutes}m`;
  };

  const getTaskIcon = (task: CleanupTask) => {
    if (task.status === 'running') {
      return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
    }
    if (task.status === 'completed') {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
    return task.icon;
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Pembersih Jaringan</h2>
        <p className="text-sm text-muted-foreground">
          Optimasi otomatis untuk performa terbaik
        </p>
      </div>

      {/* Segarkan Network Section */}
      <Card className="p-5 space-y-4 bg-card/50 backdrop-blur border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <RefreshCw className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Segarkan Network</h3>
              <p className="text-xs text-muted-foreground">Optimasi jaringan satu klik</p>
            </div>
          </div>
        </div>

        {/* Cleanup Tasks */}
        <div className="space-y-2">
          {cleanupTasks.map((task) => (
            <div 
              key={task.id}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                task.status === 'running' 
                  ? 'bg-primary/10 border border-primary/20' 
                  : task.status === 'completed'
                  ? 'bg-green-500/10 border border-green-500/20'
                  : 'bg-muted/30'
              }`}
            >
              {getTaskIcon(task)}
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{task.name}</p>
                <p className="text-xs text-muted-foreground">{task.description}</p>
              </div>
              {task.status === 'completed' && (
                <Badge variant="secondary" className="bg-green-500/20 text-green-600 text-xs">
                  Selesai
                </Badge>
              )}
            </div>
          ))}
        </div>

        <Button 
          onClick={handleRefreshNetwork}
          disabled={isRefreshing || !simulationMode}
          className="w-full gap-2"
          size="lg"
        >
          {isRefreshing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Menyegarkan...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Segarkan Sekarang
            </>
          )}
        </Button>

        {lastCleanup && (
          <p className="text-xs text-center text-muted-foreground">
            Terakhir disegarkan: {lastCleanup.toLocaleTimeString('id-ID', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        )}

        {!simulationMode && (
          <p className="text-xs text-center text-amber-500">
            ⚠️ Aktifkan mode simulasi di Admin Panel
          </p>
        )}
      </Card>

      {/* Auto-Reboot Section */}
      <Card className="p-5 space-y-4 bg-card/50 backdrop-blur border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Auto-Reboot Terjadwal</h3>
              <p className="text-xs text-muted-foreground">Restart otomatis untuk performa optimal</p>
            </div>
          </div>
          <Switch 
            checked={autoRebootEnabled}
            onCheckedChange={handleAutoRebootToggle}
          />
        </div>

        {autoRebootEnabled && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <span className="text-sm text-muted-foreground">Waktu Reboot</span>
              <select
                value={rebootTime}
                onChange={(e) => setRebootTime(e.target.value)}
                className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="01:00">01:00</option>
                <option value="02:00">02:00</option>
                <option value="03:00">03:00</option>
                <option value="04:00">04:00</option>
                <option value="05:00">05:00</option>
              </select>
            </div>

            {nextReboot && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-foreground">Reboot berikutnya</span>
                </div>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-600">
                  {formatTimeRemaining(nextReboot)}
                </Badge>
              </div>
            )}

            <p className="text-xs text-muted-foreground text-center">
              Router akan restart otomatis setiap hari untuk menjaga performa tetap optimal
            </p>
          </div>
        )}
      </Card>

      {/* Info Card */}
      <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <div className="flex gap-3">
          <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">Tips Performa</p>
            <p className="text-xs text-muted-foreground">
              Jalankan "Segarkan Network" seminggu sekali dan aktifkan Auto-Reboot untuk menjaga 
              jaringan WiFi Anda tetap cepat dan stabil.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NetworkCleaner;
