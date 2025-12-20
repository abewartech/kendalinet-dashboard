import { Wifi, WifiOff, Clock, Activity } from "lucide-react";

interface StatusHeaderProps {
  isOnline: boolean;
  uptime: string;
}

const StatusHeader = ({ isOnline, uptime }: StatusHeaderProps) => {
  return (
    <header className="px-4 pt-6 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold gradient-text">KendaliNet</h1>
          <p className="text-sm text-muted-foreground mt-1">PantauWrt Dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-full glass-card ${
              isOnline ? "border-success/30" : "border-destructive/30"
            }`}
          >
            {isOnline ? (
              <>
                <div className="relative">
                  <Wifi className="w-4 h-4 text-success" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-success rounded-full animate-ping" />
                </div>
                <span className="text-xs font-medium text-success">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-destructive" />
                <span className="text-xs font-medium text-destructive">Offline</span>
              </>
            )}
          </div>
        </div>
      </div>

      {isOnline && (
        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>Aktif {uptime}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-success" />
            <span>Stabil</span>
          </div>
        </div>
      )}
    </header>
  );
};

export default StatusHeader;
