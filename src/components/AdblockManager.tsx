import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Plus, Trash2, RefreshCw, Filter, Ban } from 'lucide-react';
import { toast } from 'sonner';

interface BlockList {
  id: string;
  name: string;
  url: string;
  enabled: boolean;
  domainsCount: number;
  lastUpdated: string;
}

const AdblockManager = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [stats, setStats] = useState({
    totalBlocked: 12847,
    todayBlocked: 342,
    activeRules: 98432
  });

  const [blockLists, setBlockLists] = useState<BlockList[]>([
    {
      id: '1',
      name: 'AdGuard DNS Filter',
      url: 'https://adguardteam.github.io/AdGuardSDNSFilter/Filters/filter.txt',
      enabled: true,
      domainsCount: 45000,
      lastUpdated: '2024-01-15'
    },
    {
      id: '2',
      name: 'EasyList',
      url: 'https://easylist.to/easylist/easylist.txt',
      enabled: true,
      domainsCount: 32000,
      lastUpdated: '2024-01-14'
    },
    {
      id: '3',
      name: 'Fanboy Annoyances',
      url: 'https://easylist.to/easylist/fanboy-annoyance.txt',
      enabled: false,
      domainsCount: 18000,
      lastUpdated: '2024-01-13'
    }
  ]);

  const [customBlocks, setCustomBlocks] = useState<string[]>([
    'ads.google.com',
    'tracking.facebook.com',
    'analytics.tiktok.com'
  ]);

  const [newListUrl, setNewListUrl] = useState('');
  const [newCustomBlock, setNewCustomBlock] = useState('');

  const handleToggleMain = () => {
    setIsEnabled(!isEnabled);
    toast.success(isEnabled ? 'Adblock dinonaktifkan' : 'Adblock diaktifkan');
  };

  const handleToggleList = (id: string) => {
    setBlockLists(prev => prev.map(l => 
      l.id === id ? { ...l, enabled: !l.enabled } : l
    ));
  };

  const handleAddList = () => {
    if (!newListUrl) {
      toast.error('URL daftar blokir harus diisi');
      return;
    }

    const newList: BlockList = {
      id: Date.now().toString(),
      name: 'Custom List',
      url: newListUrl,
      enabled: true,
      domainsCount: 0,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    setBlockLists(prev => [...prev, newList]);
    setNewListUrl('');
    toast.success('Daftar blokir ditambahkan');
  };

  const handleDeleteList = (id: string) => {
    setBlockLists(prev => prev.filter(l => l.id !== id));
    toast.success('Daftar blokir dihapus');
  };

  const handleAddCustomBlock = () => {
    if (!newCustomBlock) return;
    if (customBlocks.includes(newCustomBlock)) {
      toast.error('Domain sudah ada dalam daftar');
      return;
    }
    setCustomBlocks(prev => [...prev, newCustomBlock]);
    setNewCustomBlock('');
    toast.success('Domain ditambahkan ke blokir');
  };

  const handleRemoveCustomBlock = (domain: string) => {
    setCustomBlocks(prev => prev.filter(d => d !== domain));
    toast.success('Domain dihapus dari blokir');
  };

  const handleUpdateLists = () => {
    toast.success('Memperbarui daftar blokir...', {
      description: 'Ini mungkin memerlukan beberapa saat'
    });
    setTimeout(() => {
      setBlockLists(prev => prev.map(l => ({
        ...l,
        lastUpdated: new Date().toISOString().split('T')[0]
      })));
      toast.success('Daftar blokir diperbarui');
    }, 2000);
  };

  return (
    <div className="space-y-4">
      {/* Main Toggle & Stats */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Adblock DNS
            </CardTitle>
            <Switch checked={isEnabled} onCheckedChange={handleToggleMain} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg bg-background/30">
              <div className="text-2xl font-bold text-primary">
                {stats.totalBlocked.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Total Diblokir</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/30">
              <div className="text-2xl font-bold text-green-400">
                {stats.todayBlocked}
              </div>
              <div className="text-xs text-muted-foreground">Hari Ini</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/30">
              <div className="text-2xl font-bold text-muted-foreground">
                {(stats.activeRules / 1000).toFixed(0)}K
              </div>
              <div className="text-xs text-muted-foreground">Rules Aktif</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Block Lists */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Daftar Filter
            </CardTitle>
            <Button size="sm" variant="outline" onClick={handleUpdateLists}>
              <RefreshCw className="w-3 h-3 mr-1" />
              Update
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Add List */}
          <div className="flex gap-2">
            <Input
              value={newListUrl}
              onChange={(e) => setNewListUrl(e.target.value)}
              placeholder="https://example.com/blocklist.txt"
              className="h-9 text-sm"
            />
            <Button size="sm" onClick={handleAddList}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* List Items */}
          <div className="space-y-2">
            {blockLists.map((list) => (
              <div
                key={list.id}
                className="flex items-center justify-between p-3 rounded-lg bg-background/30 border border-border/30"
              >
                <div className="flex items-center gap-3">
                  <Switch
                    checked={list.enabled}
                    onCheckedChange={() => handleToggleList(list.id)}
                  />
                  <div>
                    <div className="font-medium text-sm">{list.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {list.domainsCount.toLocaleString()} domains • Updated {list.lastUpdated}
                    </div>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => handleDeleteList(list.id)}
                >
                  <Trash2 className="w-3 h-3 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Blocks */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Ban className="w-4 h-4" />
            Blokir Manual
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={newCustomBlock}
              onChange={(e) => setNewCustomBlock(e.target.value)}
              placeholder="domain.com"
              className="h-9 text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleAddCustomBlock()}
            />
            <Button size="sm" onClick={handleAddCustomBlock}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {customBlocks.map((domain) => (
              <Badge
                key={domain}
                variant="secondary"
                className="cursor-pointer hover:bg-destructive/20"
                onClick={() => handleRemoveCustomBlock(domain)}
              >
                {domain}
                <Trash2 className="w-3 h-3 ml-1" />
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdblockManager;
