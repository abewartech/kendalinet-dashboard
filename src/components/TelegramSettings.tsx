import { useState, useEffect } from "react";
import { Send as SendIcon, ExternalLink, Info, CheckCircle, Loader2, Bot, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useTelegramNotification } from "@/hooks/useTelegramNotification";

const TelegramSettings = () => {
  const { settings, isLoading, saveSettings, testTelegram } = useTelegramNotification();
  const [localBotToken, setLocalBotToken] = useState(settings.botToken);
  const [localChatId, setLocalChatId] = useState(settings.chatId);
  const [showToken, setShowToken] = useState(false);

  useEffect(() => {
    setLocalBotToken(settings.botToken);
    setLocalChatId(settings.chatId);
  }, [settings]);

  const handleSave = () => {
    saveSettings({
      botToken: localBotToken,
      chatId: localChatId
    });
  };

  const handleToggle = (enabled: boolean) => {
    saveSettings({ enabled });
  };

  const maskedToken = localBotToken 
    ? `${localBotToken.slice(0, 8)}...${localBotToken.slice(-4)}`
    : '';

  return (
    <div className="glass-card p-4 slide-up">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#0088cc]/20 flex items-center justify-center">
          <SendIcon className="w-5 h-5 text-[#0088cc]" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-foreground">Notifikasi Telegram</h3>
          <p className="text-xs text-muted-foreground">
            Langsung via Bot API
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
          <div className="p-3 rounded-xl bg-[#0088cc]/10 border border-[#0088cc]/20">
            <div className="flex gap-2">
              <Info className="w-4 h-4 text-[#0088cc] flex-shrink-0 mt-0.5" />
              <div className="text-xs text-[#0088cc]">
                <p className="font-medium mb-1">Cara Setup:</p>
                <ol className="list-decimal ml-4 space-y-1 text-muted-foreground">
                  <li>Buka <strong>@BotFather</strong> di Telegram</li>
                  <li>Kirim <code>/newbot</code> dan ikuti instruksi</li>
                  <li>Salin Bot Token yang diberikan</li>
                  <li>Kirim pesan ke bot Anda, lalu dapatkan Chat ID</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Bot Token Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Bot className="w-4 h-4" />
              Bot Token
            </label>
            <div className="relative">
              <Input
                type={showToken ? "text" : "password"}
                placeholder="123456789:ABCdefGHI..."
                value={localBotToken}
                onChange={(e) => setLocalBotToken(e.target.value)}
                className="bg-secondary/50 pr-16"
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-primary hover:underline"
              >
                {showToken ? 'Sembunyikan' : 'Tampilkan'}
              </button>
            </div>
          </div>

          {/* Chat ID Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Chat ID
            </label>
            <Input
              type="text"
              placeholder="-1001234567890 atau 123456789"
              value={localChatId}
              onChange={(e) => setLocalChatId(e.target.value)}
              className="bg-secondary/50"
            />
            <p className="text-xs text-muted-foreground">
              Gunakan <a 
                href="https://t.me/userinfobot" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >@userinfobot</a> untuk mendapatkan Chat ID Anda
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 py-2.5 rounded-xl bg-[#0088cc] text-white font-medium text-sm hover:bg-[#0088cc]/90 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Simpan
            </button>
            <button
              onClick={testTelegram}
              disabled={isLoading || !localBotToken || !localChatId}
              className="flex-1 py-2.5 rounded-xl bg-secondary text-foreground font-medium text-sm hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <SendIcon className="w-4 h-4" />
              )}
              Test Kirim
            </button>
          </div>

          {/* Helper Links */}
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Link Berguna:</p>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://t.me/BotFather"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#0088cc] hover:underline"
              >
                @BotFather <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://t.me/userinfobot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#0088cc] hover:underline"
              >
                @userinfobot <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://core.telegram.org/bots/tutorial"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#0088cc] hover:underline"
              >
                Dokumentasi Bot <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {!settings.enabled && (
        <p className="text-xs text-muted-foreground mt-2">
          Aktifkan untuk menerima notifikasi langsung ke Telegram saat perangkat baru terdeteksi
        </p>
      )}
    </div>
  );
};

export default TelegramSettings;
