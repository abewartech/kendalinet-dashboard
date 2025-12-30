import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AppWindow, Facebook, Youtube, Music2, MessageCircle,
  Instagram, Twitter, Gamepad2, ShoppingBag, Plus, Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface BlockedApp {
  id: string;
  name: string;
  icon: React.ReactNode;
  domains: string[];
  isBlocked: boolean;
  scheduleEnabled: boolean;
  scheduleStart: string;
  scheduleEnd: string;
}

const AppBlocker = () => {
  const [apps, setApps] = useState<BlockedApp[]>([
    {
      id: 'facebook',
      name: 'Facebook',
      icon: <Facebook className="w-5 h-5 text-blue-500" />,
      domains: ['facebook.com', 'fb.com', 'fbcdn.net', 'facebook.net'],
      isBlocked: false,
      scheduleEnabled: false,
      scheduleStart: '08:00',
      scheduleEnd: '17:00'
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: <Music2 className="w-5 h-5 text-pink-500" />,
      domains: ['tiktok.com', 'tiktokcdn.com', 'musical.ly'],
      isBlocked: true,
      scheduleEnabled: true,
      scheduleStart: '08:00',
      scheduleEnd: '17:00'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: <Youtube className="w-5 h-5 text-red-500" />,
      domains: ['youtube.com', 'youtu.be', 'ytimg.com', 'googlevideo.com'],
      isBlocked: false,
      scheduleEnabled: false,
      scheduleStart: '08:00',
      scheduleEnd: '17:00'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: <Instagram className="w-5 h-5 text-purple-500" />,
      domains: ['instagram.com', 'cdninstagram.com'],
      isBlocked: false,
      scheduleEnabled: false,
      scheduleStart: '08:00',
      scheduleEnd: '17:00'
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      icon: <Twitter className="w-5 h-5" />,
      domains: ['twitter.com', 'x.com', 'twimg.com'],
      isBlocked: false,
      scheduleEnabled: false,
      scheduleStart: '08:00',
      scheduleEnd: '17:00'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: <MessageCircle className="w-5 h-5 text-green-500" />,
      domains: ['whatsapp.com', 'whatsapp.net'],
      isBlocked: false,
      scheduleEnabled: false,
      scheduleStart: '08:00',
      scheduleEnd: '17:00'
    },
    {
      id: 'games',
      name: 'Game Online',
      icon: <Gamepad2 className="w-5 h-5 text-yellow-500" />,
      domains: ['steampowered.com', 'epicgames.com', 'riotgames.com', 'garena.com'],
      isBlocked: false,
      scheduleEnabled: false,
      scheduleStart: '08:00',
      scheduleEnd: '17:00'
    },
    {
      id: 'shopping',
      name: 'E-Commerce',
      icon: <ShoppingBag className="w-5 h-5 text-orange-500" />,
      domains: ['shopee.co.id', 'tokopedia.com', 'lazada.co.id', 'bukalapak.com'],
      isBlocked: false,
      scheduleEnabled: false,
      scheduleStart: '08:00',
      scheduleEnd: '17:00'
    }
  ]);

  const [showSchedule, setShowSchedule] = useState<string | null>(null);

  const handleToggleBlock = (id: string) => {
    setApps(prev => prev.map(app =>
      app.id === id ? { ...app, isBlocked: !app.isBlocked } : app
    ));
    const app = apps.find(a => a.id === id);
    toast.success(app?.isBlocked ? `${app.name} diizinkan` : `${app?.name} diblokir`);
  };

  const handleToggleSchedule = (id: string) => {
    setApps(prev => prev.map(app =>
      app.id === id ? { ...app, scheduleEnabled: !app.scheduleEnabled } : app
    ));
  };

  const handleUpdateSchedule = (id: string, start: string, end: string) => {
    setApps(prev => prev.map(app =>
      app.id === id ? { ...app, scheduleStart: start, scheduleEnd: end } : app
    ));
    toast.success('Jadwal blokir diperbarui');
  };

  const blockedCount = apps.filter(a => a.isBlocked).length;
  const scheduledCount = apps.filter(a => a.scheduleEnabled).length;

  return (
    <div className="space-y-4">
      {/* Stats */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <AppWindow className="w-5 h-5 text-primary" />
            Blokir Aplikasi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 rounded-lg bg-destructive/10 border border-destructive/30">
              <div className="text-2xl font-bold text-destructive">{blockedCount}</div>
              <div className="text-xs text-muted-foreground">App Diblokir</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-primary/10 border border-primary/30">
              <div className="text-2xl font-bold text-primary">{scheduledCount}</div>
              <div className="text-xs text-muted-foreground">Dengan Jadwal</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => {
            setApps(prev => prev.map(app => ({ ...app, isBlocked: true })));
            toast.success('Semua aplikasi diblokir');
          }}
        >
          Blokir Semua
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => {
            setApps(prev => prev.map(app => ({ ...app, isBlocked: false })));
            toast.success('Semua blokir dihapus');
          }}
        >
          Izinkan Semua
        </Button>
      </div>

      {/* App List */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardContent className="pt-4 space-y-2">
          {apps.map((app) => (
            <div key={app.id}>
              <div
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all duration-300 gap-3 ${app.isBlocked
                    ? 'bg-destructive/10 border-destructive/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                    : 'bg-secondary/20 border-border/30 hover:bg-secondary/30'
                  }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${app.isBlocked ? 'bg-destructive/20' : 'bg-background/50'}`}>
                    {app.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 overflow-hidden">
                      <span className="font-semibold text-sm truncate">{app.name}</span>
                      {app.scheduleEnabled && (
                        <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 bg-primary/10 text-primary border-primary/20 shrink-0">
                          <Clock className="w-2.5 h-2.5 mr-1" />
                          {app.scheduleStart}-{app.scheduleEnd}
                        </Badge>
                      )}
                    </div>
                    <div className="text-[10px] text-muted-foreground truncate opacity-70 mt-0.5">
                      {app.domains.slice(0, 2).join(', ')}
                      {app.domains.length > 2 && ` +${app.domains.length - 2}`}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 shrink-0 ml-auto sm:ml-0 border-t sm:border-t-0 border-border/10 pt-2 sm:pt-0 mt-1 sm:mt-0">
                  <Button
                    size="icon"
                    variant="ghost"
                    className={`h-9 w-9 rounded-full transition-colors ${showSchedule === app.id ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}
                    onClick={() => setShowSchedule(showSchedule === app.id ? null : app.id)}
                  >
                    <Clock className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center gap-2 pl-2 border-l border-border/20">
                    <Switch
                      checked={app.isBlocked}
                      onCheckedChange={() => handleToggleBlock(app.id)}
                      className="scale-110"
                    />
                  </div>
                </div>
              </div>

              {/* Schedule Panel */}
              {showSchedule === app.id && (
                <div className="mt-1 p-3 rounded-lg bg-background/50 border border-border/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Aktifkan Jadwal</Label>
                    <Switch
                      checked={app.scheduleEnabled}
                      onCheckedChange={() => handleToggleSchedule(app.id)}
                    />
                  </div>
                  {app.scheduleEnabled && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Mulai Blokir</Label>
                        <Input
                          type="time"
                          value={app.scheduleStart}
                          onChange={(e) => handleUpdateSchedule(app.id, e.target.value, app.scheduleEnd)}
                          className="h-9"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Selesai Blokir</Label>
                        <Input
                          type="time"
                          value={app.scheduleEnd}
                          onChange={(e) => handleUpdateSchedule(app.id, app.scheduleStart, e.target.value)}
                          className="h-9"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppBlocker;
