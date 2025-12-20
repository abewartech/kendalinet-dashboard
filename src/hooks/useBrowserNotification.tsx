import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useBrowserNotification = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const { toast } = useToast();

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      toast({
        title: "Browser tidak mendukung",
        description: "Browser Anda tidak mendukung notifikasi push",
        variant: "destructive"
      });
      return false;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    
    if (result === 'granted') {
      toast({
        title: "Notifikasi Aktif",
        description: "Anda akan menerima notifikasi saat ada penyusup terdeteksi"
      });
      return true;
    } else {
      toast({
        title: "Izin Ditolak",
        description: "Aktifkan notifikasi di pengaturan browser untuk menerima peringatan",
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);

  const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (permission !== 'granted') return;

    const notification = new Notification(title, {
      icon: '/favicon.ico',
      ...options
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return notification;
  }, [permission]);

  const notifyIntruder = useCallback((deviceName: string, deviceMac: string) => {
    sendNotification('🚨 Penyusup Terdeteksi!', {
      body: `Perangkat baru "${deviceName}" (${deviceMac}) mencoba terhubung ke WiFi Anda`,
      tag: 'intruder-alert',
    });
  }, [sendNotification]);

  return {
    permission,
    isSupported: 'Notification' in window,
    requestPermission,
    sendNotification,
    notifyIntruder
  };
};
