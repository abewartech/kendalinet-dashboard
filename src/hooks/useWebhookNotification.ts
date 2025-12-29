import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

const WEBHOOK_STORAGE_KEY = 'kendalinet_webhook_url';
const WEBHOOK_ENABLED_KEY = 'kendalinet_webhook_enabled';
const WHATSAPP_NUMBER_KEY = 'kendalinet_whatsapp_number';

interface WebhookSettings {
  webhookUrl: string;
  whatsappNumber: string;
  enabled: boolean;
}

export const useWebhookNotification = () => {
  const [settings, setSettings] = useState<WebhookSettings>({
    webhookUrl: '',
    whatsappNumber: '',
    enabled: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load settings from localStorage
  useEffect(() => {
    const savedUrl = localStorage.getItem(WEBHOOK_STORAGE_KEY) || '';
    const savedNumber = localStorage.getItem(WHATSAPP_NUMBER_KEY) || '';
    const savedEnabled = localStorage.getItem(WEBHOOK_ENABLED_KEY) === 'true';
    
    setSettings({
      webhookUrl: savedUrl,
      whatsappNumber: savedNumber,
      enabled: savedEnabled
    });
  }, []);

  // Save settings to localStorage
  const saveSettings = useCallback((newSettings: Partial<WebhookSettings>) => {
    const updated = { ...settings, ...newSettings };
    
    if (newSettings.webhookUrl !== undefined) {
      localStorage.setItem(WEBHOOK_STORAGE_KEY, newSettings.webhookUrl);
    }
    if (newSettings.whatsappNumber !== undefined) {
      localStorage.setItem(WHATSAPP_NUMBER_KEY, newSettings.whatsappNumber);
    }
    if (newSettings.enabled !== undefined) {
      localStorage.setItem(WEBHOOK_ENABLED_KEY, String(newSettings.enabled));
    }
    
    setSettings(updated);
    
    toast({
      title: "Pengaturan Tersimpan",
      description: "Konfigurasi webhook telah diperbarui"
    });
  }, [settings, toast]);

  // Send notification via webhook
  const sendWebhookNotification = useCallback(async (
    deviceName: string, 
    deviceMac: string,
    deviceIp?: string
  ) => {
    if (!settings.enabled || !settings.webhookUrl) {
      console.log('Webhook notification skipped: not enabled or no URL');
      return false;
    }

    setIsLoading(true);
    console.log('Sending webhook notification:', { deviceName, deviceMac, deviceIp });

    try {
      const payload = {
        event: 'new_device_detected',
        timestamp: new Date().toISOString(),
        device: {
          name: deviceName,
          mac: deviceMac,
          ip: deviceIp || 'Unknown'
        },
        whatsapp_number: settings.whatsappNumber,
        message: `🚨 *Perangkat Baru Terdeteksi!*\n\nNama: ${deviceName}\nMAC: ${deviceMac}\nIP: ${deviceIp || 'Unknown'}\nWaktu: ${new Date().toLocaleString('id-ID')}\n\n_Perangkat ini mencoba terhubung ke WiFi Anda._`
      };

      const response = await fetch(settings.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors', // Handle CORS for external webhooks
        body: JSON.stringify(payload),
      });

      // Since we use no-cors, we can't check response status
      console.log('Webhook notification sent');
      
      return true;
    } catch (error) {
      console.error('Error sending webhook notification:', error);
      toast({
        title: "Gagal Mengirim Notifikasi",
        description: "Periksa URL webhook Anda",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [settings, toast]);

  // Test webhook
  const testWebhook = useCallback(async () => {
    if (!settings.webhookUrl) {
      toast({
        title: "URL Webhook Kosong",
        description: "Masukkan URL webhook terlebih dahulu",
        variant: "destructive"
      });
      return false;
    }

    const result = await sendWebhookNotification(
      'Test Device',
      'AA:BB:CC:DD:EE:FF',
      '192.168.1.100'
    );

    if (result) {
      toast({
        title: "Test Berhasil",
        description: "Periksa n8n/Zapier Anda untuk memverifikasi webhook diterima"
      });
    }

    return result;
  }, [settings.webhookUrl, sendWebhookNotification, toast]);

  return {
    settings,
    isLoading,
    saveSettings,
    sendWebhookNotification,
    testWebhook
  };
};
