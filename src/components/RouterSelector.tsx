import { useState } from 'react';
import { ChevronDown, Router, Plus, Settings, Wifi, WifiOff, Check } from 'lucide-react';
import { RouterProfile } from '@/lib/routerTypes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RouterSelectorProps {
  routers: RouterProfile[];
  activeRouter: RouterProfile | undefined;
  onSwitchRouter: (id: string) => void;
  onManageRouters: () => void;
  onShowDashboard: () => void;
}

const RouterSelector = ({
  routers,
  activeRouter,
  onSwitchRouter,
  onManageRouters,
  onShowDashboard
}: RouterSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const getStatusIcon = (status?: 'online' | 'offline' | 'unknown') => {
    switch (status) {
      case 'online':
        return <Wifi className="w-3 h-3 text-success" />;
      case 'offline':
        return <WifiOff className="w-3 h-3 text-destructive" />;
      default:
        return <Router className="w-3 h-3 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status?: 'online' | 'offline' | 'unknown') => {
    switch (status) {
      case 'online':
        return 'bg-success/20 border-success/30';
      case 'offline':
        return 'bg-destructive/20 border-destructive/30';
      default:
        return 'bg-secondary border-border';
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={cn(
            "gap-2 px-3 h-9 border",
            getStatusColor(activeRouter?.status)
          )}
        >
          {getStatusIcon(activeRouter?.status)}
          <span className="max-w-[100px] truncate text-xs font-medium">
            {activeRouter?.name || 'Pilih Router'}
          </span>
          <ChevronDown className="w-3 h-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {routers.length > 1 && (
          <>
            <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
              Pilih Router
            </div>
            {routers.map((router) => (
              <DropdownMenuItem
                key={router.id}
                onClick={() => {
                  onSwitchRouter(router.id);
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                {getStatusIcon(router.status)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{router.name}</p>
                  <p className="text-xs text-muted-foreground">{router.ipAddress}</p>
                </div>
                {router.isActive && (
                  <Check className="w-4 h-4 text-success" />
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </>
        )}
        
        {routers.length > 1 && (
          <DropdownMenuItem
            onClick={() => {
              onShowDashboard();
              setIsOpen(false);
            }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Router className="w-4 h-4" />
            <span>Lihat Semua Router</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem
          onClick={() => {
            onManageRouters();
            setIsOpen(false);
          }}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Settings className="w-4 h-4" />
          <span>Kelola Router</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => {
            onManageRouters();
            setIsOpen(false);
          }}
          className="flex items-center gap-2 cursor-pointer text-primary"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Router Baru</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RouterSelector;
