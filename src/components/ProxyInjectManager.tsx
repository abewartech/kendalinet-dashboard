import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap, Plus, Trash2, Copy, Check, Settings2 } from 'lucide-react';
import { toast } from 'sonner';

interface InjectConfig {
  id: string;
  name: string;
  type: 'http' | 'ssl' | 'websocket';
  host: string;
  port: number;
  payload: string;
  isActive: boolean;
}

const ProxyInjectManager = () => {
  const [configs, setConfigs] = useState<InjectConfig[]>([
    {
      id: '1',
      name: 'Inject XL Combo',
      type: 'http',
      host: 'bug.xl.co.id',
      port: 80,
      payload: 'GET / HTTP/1.1[crlf]Host: [host][crlf]Upgrade: websocket[crlf][crlf]',
      isActive: true
    },
    {
      id: '2',
      name: 'SSL Telkomsel',
      type: 'ssl',
      host: 'video.iflix.com',
      port: 443,
      payload: '',
      isActive: false
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newConfig, setNewConfig] = useState({
    name: '',
    type: 'http' as InjectConfig['type'],
    host: '',
    port: 80,
    payload: ''
  });

  const payloadTemplates = [
    { name: 'HTTP Inject', payload: 'GET / HTTP/1.1[crlf]Host: [host][crlf]Upgrade: websocket[crlf][crlf]' },
    { name: 'Direct Payload', payload: 'CONNECT [host_port] HTTP/1.1[crlf]Host: [host_port][crlf][crlf]' },
    { name: 'Split Payload', payload: 'GET [split]/ HTTP/1.1[crlf]Host: [host][crlf][crlf]' }
  ];

  const handleToggleActive = (id: string) => {
    setConfigs(prev => prev.map(c => 
      c.id === id ? { ...c, isActive: !c.isActive } : c
    ));
    toast.success('Status inject diubah');
  };

  const handleAddConfig = () => {
    if (!newConfig.name || !newConfig.host) {
      toast.error('Nama dan host harus diisi');
      return;
    }

    const config: InjectConfig = {
      id: Date.now().toString(),
      ...newConfig,
      isActive: false
    };

    setConfigs(prev => [...prev, config]);
    setNewConfig({ name: '', type: 'http', host: '', port: 80, payload: '' });
    setShowAddForm(false);
    toast.success('Konfigurasi inject ditambahkan');
  };

  const handleDeleteConfig = (id: string) => {
    setConfigs(prev => prev.filter(c => c.id !== id));
    toast.success('Konfigurasi inject dihapus');
  };

  const handleCopyPayload = (id: string, payload: string) => {
    navigator.clipboard.writeText(payload);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success('Payload disalin');
  };

  const handleApplyTemplate = (template: string) => {
    setNewConfig(prev => ({ ...prev, payload: template }));
  };

  const getTypeColor = (type: InjectConfig['type']) => {
    switch (type) {
      case 'http': return 'bg-blue-500/20 text-blue-400';
      case 'ssl': return 'bg-green-500/20 text-green-400';
      case 'websocket': return 'bg-purple-500/20 text-purple-400';
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Proxy Inject Manager
            </CardTitle>
            <Button size="sm" onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="w-4 h-4 mr-1" />
              Tambah
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Form */}
          {showAddForm && (
            <Card className="bg-background/50 border-border/30">
              <CardContent className="pt-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Nama Config</Label>
                    <Input
                      value={newConfig.name}
                      onChange={(e) => setNewConfig(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Inject XL"
                      className="h-9"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Tipe</Label>
                    <Select
                      value={newConfig.type}
                      onValueChange={(v) => setNewConfig(prev => ({ ...prev, type: v as InjectConfig['type'] }))}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="http">HTTP Inject</SelectItem>
                        <SelectItem value="ssl">SSL/TLS</SelectItem>
                        <SelectItem value="websocket">WebSocket</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <Label className="text-xs">Bug Host</Label>
                    <Input
                      value={newConfig.host}
                      onChange={(e) => setNewConfig(prev => ({ ...prev, host: e.target.value }))}
                      placeholder="bug.operator.co.id"
                      className="h-9"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Port</Label>
                    <Input
                      type="number"
                      value={newConfig.port}
                      onChange={(e) => setNewConfig(prev => ({ ...prev, port: parseInt(e.target.value) || 80 }))}
                      className="h-9"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-xs">Payload</Label>
                    <div className="flex gap-1">
                      {payloadTemplates.map((t, i) => (
                        <Button
                          key={i}
                          size="sm"
                          variant="ghost"
                          className="h-6 text-xs px-2"
                          onClick={() => handleApplyTemplate(t.payload)}
                        >
                          {t.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <Textarea
                    value={newConfig.payload}
                    onChange={(e) => setNewConfig(prev => ({ ...prev, payload: e.target.value }))}
                    placeholder="GET / HTTP/1.1[crlf]Host: [host][crlf]..."
                    className="font-mono text-xs h-24"
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddConfig}>Simpan</Button>
                  <Button size="sm" variant="outline" onClick={() => setShowAddForm(false)}>Batal</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Config List */}
          <div className="space-y-2">
            {configs.map((config) => (
              <div
                key={config.id}
                className="p-3 rounded-lg bg-background/30 border border-border/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={config.isActive}
                      onCheckedChange={() => handleToggleActive(config.id)}
                    />
                    <span className="font-medium text-sm">{config.name}</span>
                    <Badge className={`text-xs ${getTypeColor(config.type)}`}>
                      {config.type.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    {config.payload && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => handleCopyPayload(config.id, config.payload)}
                      >
                        {copiedId === config.id ? (
                          <Check className="w-3 h-3 text-green-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => handleDeleteConfig(config.id)}
                    >
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {config.host}:{config.port}
                </div>
                {config.payload && (
                  <div className="mt-2 p-2 rounded bg-background/50 font-mono text-xs text-muted-foreground truncate">
                    {config.payload.substring(0, 60)}...
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProxyInjectManager;
