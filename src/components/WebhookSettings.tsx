import { useState, useEffect } from "react";
import { Webhook, Send, ExternalLink, Info, CheckCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useWebhookNotification } from "@/hooks/useWebhookNotification";

const WebhookSettings = () => {
  const { settings, isLoading, saveSettings, testWebhook } = useWebhookNotification();
  const [localUrl, setLocalUrl] = useState(settings.webhookUrl);
  const [localNumber, setLocalNumber] = useState(settings.whatsappNumber);

  useEffect(() => {
    setLocalUrl(settings.webhookUrl);
    setLocalNumber(settings.whatsappNumber);
  }, [settings]);

  const handleSave = () => {
    saveSettings({
      webhookUrl: localUrl,
      whatsappNumber: localNumber
    });
  };

  const handleToggle = (enabled: boolean) => {
    saveSettings({ enabled });
  };

  return (
    <div className="glass-card p-4 slide-up">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Webhook className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-foreground">Notifikasi WhatsApp</h3>
          <p className="text-xs text-muted-foreground">
            Via n8n, Zapier, atau webhook lainnya
          </p>
        </div>
        <Switch
          checked={settings.enabled}
          onCheckedChange={handleToggle}
        />
      </div>

      {settings.enabled && (
        <div className="space-y-4">
          {/* Info Box */}
          <div className="p-3 rounded-xl bg-info/10 border border-info/20">
            <div className="flex gap-2">
              <Info className="w-4 h-4 text-info flex-shrink-0 mt-0.5" />
              <div className="text-xs text-info">
                <p className="font-medium mb-1">Cara Setup:</p>
                <ol className="list-decimal ml-4 space-y-1 text-muted-foreground">
                  <li>Buat workflow di n8n atau Zapier</li>
                  <li>Tambahkan trigger Webhook</li>
                  <li>Hubungkan ke WhatsApp (via Fonnte/Twilio)</li>
                  <li>Salin URL webhook ke sini</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Webhook URL Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              URL Webhook
            </label>
            <Input
              type="url"
              placeholder="https://n8n.example.com/webhook/..."
              value={localUrl}
              onChange={(e) => setLocalUrl(e.target.value)}
              className="bg-secondary/50"
            />
          </div>

          {/* WhatsApp Number Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Nomor WhatsApp Tujuan
            </label>
            <Input
              type="tel"
              placeholder="628123456789"
              value={localNumber}
              onChange={(e) => setLocalNumber(e.target.value)}
              className="bg-secondary/50"
            />
            <p className="text-xs text-muted-foreground">
              Format: 628xxx (tanpa + atau 0)
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Simpan
            </button>
            <button
              onClick={testWebhook}
              disabled={isLoading || !localUrl}
              className="flex-1 py-2.5 rounded-xl bg-secondary text-foreground font-medium text-sm hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Test Webhook
            </button>
          </div>

          {/* Quick Links */}
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Platform yang didukung:</p>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://n8n.io"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                n8n <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://zapier.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                Zapier <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://make.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                Make <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {!settings.enabled && (
        <p className="text-xs text-muted-foreground mt-2">
          Aktifkan untuk menerima notifikasi WhatsApp saat perangkat baru terdeteksi
        </p>
      )}
    </div>
  );
};

export default WebhookSettings;
