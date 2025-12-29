import { useState, useEffect, useCallback } from 'react';
import { RouterProfile, RouterStatus } from '@/lib/routerTypes';

const STORAGE_KEY = 'kendali-net-routers';

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useRouterManager = () => {
  const [routers, setRouters] = useState<RouterProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    // Default router if none exists
    return [{
      id: generateId(),
      name: 'Router Utama',
      ipAddress: '192.168.2.1',
      username: 'root',
      password: '',
      isActive: true,
      status: 'unknown'
    }];
  });

  const [routerStatuses, setRouterStatuses] = useState<RouterStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Save to localStorage whenever routers change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(routers));
  }, [routers]);

  // Get active router
  const activeRouter = routers.find(r => r.isActive) || routers[0];

  // Add new router
  const addRouter = useCallback((router: Omit<RouterProfile, 'id' | 'isActive' | 'status'>) => {
    const newRouter: RouterProfile = {
      ...router,
      id: generateId(),
      isActive: routers.length === 0,
      status: 'unknown'
    };
    setRouters(prev => [...prev, newRouter]);
    return newRouter;
  }, [routers.length]);

  // Update router
  const updateRouter = useCallback((id: string, updates: Partial<RouterProfile>) => {
    setRouters(prev => 
      prev.map(r => r.id === id ? { ...r, ...updates } : r)
    );
  }, []);

  // Delete router
  const deleteRouter = useCallback((id: string) => {
    setRouters(prev => {
      const filtered = prev.filter(r => r.id !== id);
      // If deleted router was active, make first remaining router active
      if (prev.find(r => r.id === id)?.isActive && filtered.length > 0) {
        filtered[0].isActive = true;
      }
      return filtered;
    });
  }, []);

  // Switch active router
  const switchRouter = useCallback((id: string) => {
    setRouters(prev => 
      prev.map(r => ({
        ...r,
        isActive: r.id === id,
        lastConnected: r.id === id ? new Date().toISOString() : r.lastConnected
      }))
    );
  }, []);

  // Check router status
  const checkRouterStatus = useCallback(async (router: RouterProfile): Promise<RouterStatus> => {
    const baseUrl = `http://${router.ipAddress}`;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const res = await fetch(`${baseUrl}/cgi-bin/kendalinet/status.sh`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (res.ok) {
        const data = await res.json();
        return {
          routerId: router.id,
          isOnline: true,
          uptime: data.uptime || 0,
          downloadSpeed: data.speed || 0,
          connectedDevices: 0,
          lastChecked: new Date().toISOString()
        };
      }
    } catch {
      // Router offline or unreachable
    }
    
    return {
      routerId: router.id,
      isOnline: false,
      lastChecked: new Date().toISOString()
    };
  }, []);

  // Check all routers status
  const checkAllRoutersStatus = useCallback(async () => {
    setIsLoading(true);
    const statuses = await Promise.all(
      routers.map(router => checkRouterStatus(router))
    );
    
    setRouterStatuses(statuses);
    
    // Update router status in profiles
    setRouters(prev => 
      prev.map(r => {
        const status = statuses.find(s => s.routerId === r.id);
        return {
          ...r,
          status: status?.isOnline ? 'online' : 'offline'
        };
      })
    );
    
    setIsLoading(false);
    return statuses;
  }, [routers, checkRouterStatus]);

  // Get base URL for active router
  const getActiveRouterBaseUrl = useCallback(() => {
    if (!activeRouter) return '';
    // In Capacitor/native mode, use full URL
    const IS_CAPACITOR =
      // @ts-ignore
      (window.Capacitor && window.Capacitor.isNative) ||
      (window.location.hostname === 'localhost' && !window.location.port.includes('80'));
    
    return IS_CAPACITOR ? `http://${activeRouter.ipAddress}` : '';
  }, [activeRouter]);

  return {
    routers,
    activeRouter,
    routerStatuses,
    isLoading,
    addRouter,
    updateRouter,
    deleteRouter,
    switchRouter,
    checkRouterStatus,
    checkAllRoutersStatus,
    getActiveRouterBaseUrl
  };
};
