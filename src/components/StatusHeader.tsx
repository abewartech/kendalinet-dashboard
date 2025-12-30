import { Wifi, WifiOff, Clock, Activity } from "lucide-react";
import { RouterProfile } from "@/lib/routerTypes";
import RouterSelector from "./RouterSelector";

interface StatusHeaderProps {
  isOnline: boolean;
  uptime: string;
  routers?: RouterProfile[];
  activeRouter?: RouterProfile;
  onSwitchRouter?: (id: string) => void;
  onManageRouters?: () => void;
  onShowDashboard?: () => void;
}

const StatusHeader = ({
  isOnline,
  uptime,
  routers = [],
  activeRouter,
  onSwitchRouter,
  onManageRouters,
  onShowDashboard
}: StatusHeaderProps) => {
  const hasMultiRouter = routers.length > 0 && onSwitchRouter && onManageRouters && onShowDashboard;

  return (
    <header className="px-4 pt-6 pb-2 sm:pb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center justify-between sm:block min-w-0">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold gradient-text leading-tight truncate">KendaliNet</h1>
            <p className="text-[10px] sm:text-xs text-muted-foreground opacity-80">PantauWrt Dashboard</p>
          </div>

          {/* Mobile status badge */}
          <div className="flex sm:hidden items-center gap-2 shrink-0">
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-card border ${isOnline ? "border-success/30 shadow-[0_0_12px_rgba(34,197,94,0.15)]" : "border-destructive/30"
                }`}
            >
              <div className="relative">
                {isOnline ? (
                  <Wifi className="w-3.5 h-3.5 text-success" />
                ) : (
                  <WifiOff className="w-3.5 h-3.5 text-destructive" />
                )}
                {isOnline && <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-success rounded-full animate-ping" />}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isOnline ? "text-success" : "text-destructive"}`}>
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar shrink-0">
          {hasMultiRouter && (
            <RouterSelector
              routers={routers}
              activeRouter={activeRouter}
              onSwitchRouter={onSwitchRouter}
              onManageRouters={onManageRouters}
              onShowDashboard={onShowDashboard}
            />
          )}

          <div
            className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-full glass-card border ${isOnline ? "border-success/30" : "border-destructive/30"
              }`}
          >
            {isOnline ? (
              <>
                <div className="relative">
                  <Wifi className="w-4 h-4 text-success" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-success rounded-full animate-ping" />
                </div>
                <span className="text-xs font-medium text-success">Online Status</span>
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
        <div className="flex items-center gap-4 mt-5 text-[11px] sm:text-sm text-muted-foreground/80">
          <div className="flex items-center gap-1.5 bg-secondary/30 px-2 py-1 rounded-lg">
            <Clock className="w-3.5 h-3.5" />
            <span>Aktif {uptime}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-secondary/30 px-2 py-1 rounded-lg">
            <Activity className="w-3.5 h-3.5 text-success" />
            <span className="text-success/90 font-medium">Stabil</span>
          </div>
        </div>
      )}
    </header>
  );
};

export default StatusHeader;
