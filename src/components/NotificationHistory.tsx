import { useState } from "react";
import { 
  History, 
  Trash2, 
  Filter, 
  Smartphone, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  Calendar
} from "lucide-react";
import { useNotificationHistory, NotificationHistoryItem } from "@/hooks/useNotificationHistory";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type FilterType = 'all' | 'allowed' | 'blocked' | 'pending';

const NotificationHistory = () => {
  const { history, clearHistory, getStats } = useNotificationHistory();
  const [filter, setFilter] = useState<FilterType>('all');
  const stats = getStats();

  const filteredHistory = filter === 'all' 
    ? history 
    : history.filter(h => h.action === filter);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 7) return `${diffDays} hari lalu`;
    
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const getActionBadge = (action?: string) => {
    switch (action) {
      case 'allowed':
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-success/20 text-success">
            <CheckCircle className="w-3 h-3" />
            Diizinkan
          </span>
        );
      case 'blocked':
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-destructive/20 text-destructive">
            <XCircle className="w-3 h-3" />
            Diblokir
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-warning/20 text-warning">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
    }
  };

  const handleClearHistory = () => {
    clearHistory();
    toast({
      title: "Riwayat Dihapus",
      description: "Semua riwayat notifikasi telah dihapus"
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="glass-card-elevated p-4 slide-up">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <History className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">Riwayat Deteksi</h3>
            <p className="text-xs text-muted-foreground">
              Log perangkat baru yang terdeteksi
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button 
                className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                disabled={history.length === 0}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus Semua Riwayat?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tindakan ini akan menghapus semua {history.length} riwayat notifikasi. 
                  Data yang sudah dihapus tidak dapat dikembalikan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearHistory} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Hapus Semua
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-2">
          <div className="p-2 rounded-xl bg-secondary/50 text-center">
            <p className="text-lg font-bold text-foreground">{stats.todayCount}</p>
            <p className="text-[10px] text-muted-foreground">Hari Ini</p>
          </div>
          <div className="p-2 rounded-xl bg-secondary/50 text-center">
            <p className="text-lg font-bold text-foreground">{stats.weekCount}</p>
            <p className="text-[10px] text-muted-foreground">Minggu Ini</p>
          </div>
          <div className="p-2 rounded-xl bg-success/10 text-center">
            <p className="text-lg font-bold text-success">{stats.allowedCount}</p>
            <p className="text-[10px] text-muted-foreground">Diizinkan</p>
          </div>
          <div className="p-2 rounded-xl bg-destructive/10 text-center">
            <p className="text-lg font-bold text-destructive">{stats.blockedCount}</p>
            <p className="text-[10px] text-muted-foreground">Diblokir</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { key: 'all', label: 'Semua', count: history.length },
          { key: 'pending', label: 'Pending', count: stats.pendingCount },
          { key: 'allowed', label: 'Diizinkan', count: stats.allowedCount },
          { key: 'blocked', label: 'Diblokir', count: stats.blockedCount }
        ].map(item => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key as FilterType)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filter === item.key
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
            }`}
          >
            {item.label} ({item.count})
          </button>
        ))}
      </div>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
            <History className="w-8 h-8 text-muted-foreground" />
          </div>
          <h4 className="font-medium text-foreground mb-1">Belum Ada Riwayat</h4>
          <p className="text-sm text-muted-foreground">
            {filter === 'all' 
              ? 'Riwayat deteksi perangkat baru akan muncul di sini'
              : `Tidak ada riwayat dengan status "${filter}"`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredHistory.map((item, index) => (
            <div
              key={item.id}
              className="glass-card p-3 slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-warning/20 flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-4 h-4 text-warning" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-foreground text-sm truncate">
                        {item.deviceName}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {item.deviceMac}
                      </p>
                    </div>
                    {getActionBadge(item.action)}
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                    <span>IP: {item.deviceIp}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(item.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Indicator */}
      {filteredHistory.length >= 20 && (
        <p className="text-center text-xs text-muted-foreground py-2">
          Menampilkan {filteredHistory.length} dari maksimal 100 riwayat
        </p>
      )}
    </div>
  );
};

export default NotificationHistory;
