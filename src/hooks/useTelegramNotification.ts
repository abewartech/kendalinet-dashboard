import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

const TELEGRAM_BOT_TOKEN_KEY = 'kendalinet_telegram_bot_token';
const TELEGRAM_CHAT_ID_KEY = 'kendalinet_telegram_chat_id';
const TELEGRAM_ENABLED_KEY = 'kendalinet_telegram_enabled';

interface TelegramSettings {
  botToken: string;
  chatId: string;
  enabled: boolean;
}

export const useTelegramNotification = () => {
  const [settings, setSettings] = useState<TelegramSettings>({
    botToken: '',
    chatId: '',
    enabled: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load settings from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem(TELEGRAM_BOT_TOKEN_KEY) || '';
    const savedChatId = localStorage.getItem(TELEGRAM_CHAT_ID_KEY) || '';
    const savedEnabled = localStorage.getItem(TELEGRAM_ENABLED_KEY) === 'true';
    
    setSettings({
      botToken: savedToken,
      chatId: savedChatId,
      enabled: savedEnabled
    });
  }, []);

  // Save settings to localStorage
  const saveSettings = useCallback((newSettings: Partial<TelegramSettings>) => {
    const updated = { ...settings, ...newSettings };
    
    if (newSettings.botToken !== undefined) {
      localStorage.setItem(TELEGRAM_BOT_TOKEN_KEY, newSettings.botToken);
    }
    if (newSettings.chatId !== undefined) {
      localStorage.setItem(TELEGRAM_CHAT_ID_KEY, newSettings.chatId);
    }
    if (newSettings.enabled !== undefined) {
      localStorage.setItem(TELEGRAM_ENABLED_KEY, String(newSettings.enabled));
    }
    
    setSettings(updated);
    
    toast({
      title: "Pengaturan Tersimpan",
      description: "Konfigurasi Telegram telah diperbarui"
    });
  }, [settings, toast]);

  // Send notification via Telegram Bot API
  const sendTelegramNotification = useCallback(async (
    deviceName: string, 
    deviceMac: string,
    deviceIp?: string
  ) => {
    if (!settings.enabled || !settings.botToken || !settings.chatId) {
      console.log('Telegram notification skipped: not enabled or missing config');
      return false;
    }

    setIsLoading(true);
    console.log('Sending Telegram notification:', { deviceName, deviceMac, deviceIp });

    try {
      const message = `🚨 *Perangkat Baru Terdeteksi\\!*

📱 *Nama:* ${escapeMarkdown(deviceName)}
🔗 *MAC:* \`${escapeMarkdown(deviceMac)}\`
🌐 *IP:* ${escapeMarkdown(deviceIp || 'Unknown')}
⏰ *Waktu:* ${escapeMarkdown(new Date().toLocaleString('id-ID'))}

_Perangkat ini mencoba terhubung ke WiFi Anda\\._`;

      const url = `https://api.telegram.org/bot${settings.botToken}/sendMessage`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: settings.chatId,
          text: message,
          parse_mode: 'MarkdownV2'
        }),
      });

      const data = await response.json();

      if (!data.ok) {
        throw new Error(data.description || 'Telegram API error');
      }

      console.log('Telegram notification sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending Telegram notification:', error);
      toast({
        title: "Gagal Mengirim Notifikasi",
        description: error instanceof Error ? error.message : "Periksa konfigurasi Telegram Anda",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [settings, toast]);

  // Test Telegram connection
  const testTelegram = useCallback(async () => {
    if (!settings.botToken || !settings.chatId) {
      toast({
        title: "Konfigurasi Tidak Lengkap",
        description: "Masukkan Bot Token dan Chat ID terlebih dahulu",
        variant: "destructive"
      });
      return false;
    }

    setIsLoading(true);

    try {
      const url = `https://api.telegram.org/bot${settings.botToken}/sendMessage`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: settings.chatId,
          text: '✅ *Test Notifikasi KendaliNet*\n\nKoneksi Telegram berhasil\\! Anda akan menerima notifikasi saat perangkat baru terdeteksi\\.',
          parse_mode: 'MarkdownV2'
        }),
      });

      const data = await response.json();

      if (!data.ok) {
        throw new Error(data.description || 'Telegram API error');
      }

      toast({
        title: "Test Berhasil!",
        description: "Periksa chat Telegram Anda untuk melihat pesan test"
      });

      return true;
    } catch (error) {
      console.error('Telegram test failed:', error);
      toast({
        title: "Test Gagal",
        description: error instanceof Error ? error.message : "Periksa Bot Token dan Chat ID",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [settings, toast]);

  return {
    settings,
    isLoading,
    saveSettings,
    sendTelegramNotification,
    testTelegram
  };
};

// Helper to escape special characters for MarkdownV2
function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, '\\$&');
}
