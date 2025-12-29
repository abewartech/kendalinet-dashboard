import { useEffect } from 'react';
import { Router, Wifi, WifiOff, RefreshCw, Clock, Users, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { RouterProfile, RouterStatus } from '@/lib/routerTypes';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface MultiRouterDashboardProps {
  routers: RouterProfile[];
  routerStatuses: RouterStatus[];
  isLoading: boolean;
  onRefresh: () => void;
  onSwitchRouter: (id: string) => void;
}

const MultiRouterDashboard = ({
  routers,
  routerStatuses,
  isLoading,
  onRefresh,
  onSwitchRouter
}: MultiRouterDashboardProps) => {
  // Refresh on mount
  useEffect(() => {
    onRefresh();
  }, []);

  const getStatusForRouter = (routerId: string) => {
    return routerStatuses.find(s => s.routerId === routerId);
  };

  const formatUptime = (seconds?: number) => {
    if (!seconds) return '--';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}j ${minutes}m`;
  };

  const onlineCount = routers.filter(r => r.status === 'online').length;
  const offlineCount = routers.filter(r => r.status === 'offline').length;

  return (
    <div className="space-y-4 px-4">
      {/* Summary Header */}
      <div className="glass-card-elevated p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Semua Router</h2>
            <p className="text-sm text-muted-foreground">
              {routers.length} router terdaftar
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-success/10 rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
              <Wifi className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-success">{onlineCount}</p>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
          <div className="bg-destructive/10 rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
              <WifiOff className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-destructive">{offlineCount}</p>
              <p className="text-xs text-muted-foreground">Offline</p>
            </div>
          </div>
        </div>
      </div>

      {/* Router Cards */}
      {routers.map((router) => {
        const status = getStatusForRouter(router.id);
        const isOnline = router.status === 'online';
        
        return (
          <Card
            key={router.id}
            className={`p-4 cursor-pointer transition-all hover:scale-[1.02] ${
              router.isActive 
                ? 'ring-2 ring-primary border-primary/50' 
                : ''
            } ${
              isOnline 
                ? 'border-success/30' 
                : router.status === 'offline'
                  ? 'border-destructive/30 opacity-75'
                  : ''
            }`}
            onClick={() => onSwitchRouter(router.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isOnline 
                    ? 'bg-success/10' 
                    : router.status === 'offline'
                      ? 'bg-destructive/10'
                      : 'bg-secondary'
                }`}>
                  <Router className={`w-6 h-6 ${
                    isOnline
                      ? 'text-success'
                      : router.status === 'offline'
                        ? 'text-destructive'
                        : 'text-muted-foreground'
                  }`} />
                </div>
                <div>
                  <p className="font-semibold text-foreground flex items-center gap-2">
                    {router.name}
                    {router.isActive && (
                      <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">
                        AKTIF
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">{router.ipAddress}</p>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                isOnline 
                  ? 'bg-success/20 text-success' 
                  : router.status === 'offline'
                    ? 'bg-destructive/20 text-destructive'
                    : 'bg-secondary text-muted-foreground'
              }`}>
                {isOnline ? 'Online' : router.status === 'offline' ? 'Offline' : 'Unknown'}
              </div>
            </div>

            {/* Stats Row */}
            {isLoading ? (
              <div className="grid grid-cols-3 gap-2">
                <Skeleton className="h-12 rounded-lg" />
                <Skeleton className="h-12 rounded-lg" />
                <Skeleton className="h-12 rounded-lg" />
              </div>
            ) : isOnline && status ? (
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-secondary/50 rounded-lg p-2 text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                    <Clock className="w-3 h-3" />
                    <span className="text-[10px]">Uptime</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {formatUptime(status.uptime)}
                  </p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-2 text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                    <ArrowDownCircle className="w-3 h-3 text-success" />
                    <span className="text-[10px]">Download</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {status.downloadSpeed?.toFixed(1) || '0'} Mbps
                  </p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-2 text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                    <Users className="w-3 h-3" />
                    <span className="text-[10px]">Perangkat</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {status.connectedDevices || 0}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-2 text-sm text-muted-foreground">
                {router.status === 'offline' 
                  ? 'Router tidak dapat dijangkau' 
                  : 'Klik untuk mengaktifkan'}
              </div>
            )}
          </Card>
        );
      })}

      {routers.length === 0 && (
        <Card className="p-8 text-center">
          <Router className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">Belum ada router terdaftar</p>
        </Card>
      )}
    </div>
  );
};

export default MultiRouterDashboard;
