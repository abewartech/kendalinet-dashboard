import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Plus, Trash2, Play, Square, Settings, Globe } from 'lucide-react';
import { toast } from 'sonner';

interface VPNProfile {
  id: string;
  name: string;
  type: 'openvpn' | 'wireguard' | 'l2tp' | 'pptp';
  server: string;
  port: number;
  isActive: boolean;
  status: 'connected' | 'disconnected' | 'connecting';
}

const VPNManagement = () => {
  const [profiles, setProfiles] = useState<VPNProfile[]>([
    {
      id: '1',
      name: 'Server SG-1',
      type: 'openvpn',
      server: 'sg1.vpn.example.com',
      port: 443,
      isActive: false,
      status: 'disconnected'
    },
    {
      id: '2',
      name: 'WireGuard ID',
      type: 'wireguard',
      server: 'id.wg.example.com',
      port: 51820,
      isActive: true,
      status: 'connected'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newProfile, setNewProfile] = useState({
    name: '',
    type: 'openvpn' as VPNProfile['type'],
    server: '',
    port: 443
  });

  const handleConnect = (id: string) => {
    setProfiles(prev => prev.map(p => {
      if (p.id === id) {
        const newStatus = p.status === 'connected' ? 'disconnected' : 'connecting';
        if (newStatus === 'connecting') {
          setTimeout(() => {
            setProfiles(current => current.map(cp => 
              cp.id === id ? { ...cp, status: 'connected', isActive: true } : { ...cp, status: 'disconnected', isActive: false }
            ));
            toast.success(`Terhubung ke ${p.name}`);
          }, 2000);
        }
        return { ...p, status: newStatus, isActive: newStatus === 'connecting' };
      }
      return { ...p, status: 'disconnected', isActive: false };
    }));
    
    if (profiles.find(p => p.id === id)?.status === 'connected') {
      toast.info('VPN diputus');
    }
  };

  const handleAddProfile = () => {
    if (!newProfile.name || !newProfile.server) {
      toast.error('Nama dan server harus diisi');
      return;
    }

    const profile: VPNProfile = {
      id: Date.now().toString(),
      ...newProfile,
      isActive: false,
      status: 'disconnected'
    };

    setProfiles(prev => [...prev, profile]);
    setNewProfile({ name: '', type: 'openvpn', server: '', port: 443 });
    setShowAddForm(false);
    toast.success('Profil VPN ditambahkan');
  };

  const handleDeleteProfile = (id: string) => {
    setProfiles(prev => prev.filter(p => p.id !== id));
    toast.success('Profil VPN dihapus');
  };

  const getStatusColor = (status: VPNProfile['status']) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500 animate-pulse';
      default: return 'bg-muted';
    }
  };

  const getTypeLabel = (type: VPNProfile['type']) => {
    switch (type) {
      case 'openvpn': return 'OpenVPN';
      case 'wireguard': return 'WireGuard';
      case 'l2tp': return 'L2TP';
      case 'pptp': return 'PPTP';
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              VPN Management
            </CardTitle>
            <Button size="sm" onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="w-4 h-4 mr-1" />
              Tambah
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Active Connection Status */}
          {profiles.find(p => p.status === 'connected') && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-400">
                  Terhubung ke {profiles.find(p => p.status === 'connected')?.name}
                </span>
              </div>
            </div>
          )}

          {/* Add Form */}
          {showAddForm && (
            <Card className="bg-background/50 border-border/30">
              <CardContent className="pt-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Nama Profil</Label>
                    <Input
                      value={newProfile.name}
                      onChange={(e) => setNewProfile(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Server SG"
                      className="h-9"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Tipe VPN</Label>
                    <Select
                      value={newProfile.type}
                      onValueChange={(v) => setNewProfile(prev => ({ ...prev, type: v as VPNProfile['type'] }))}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openvpn">OpenVPN</SelectItem>
                        <SelectItem value="wireguard">WireGuard</SelectItem>
                        <SelectItem value="l2tp">L2TP</SelectItem>
                        <SelectItem value="pptp">PPTP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <Label className="text-xs">Server</Label>
                    <Input
                      value={newProfile.server}
                      onChange={(e) => setNewProfile(prev => ({ ...prev, server: e.target.value }))}
                      placeholder="vpn.example.com"
                      className="h-9"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Port</Label>
                    <Input
                      type="number"
                      value={newProfile.port}
                      onChange={(e) => setNewProfile(prev => ({ ...prev, port: parseInt(e.target.value) || 443 }))}
                      className="h-9"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddProfile}>Simpan</Button>
                  <Button size="sm" variant="outline" onClick={() => setShowAddForm(false)}>Batal</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Profile List */}
          <div className="space-y-2">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="flex items-center justify-between p-3 rounded-lg bg-background/30 border border-border/30"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(profile.status)}`} />
                  <div>
                    <div className="font-medium text-sm">{profile.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {profile.server}:{profile.port}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {getTypeLabel(profile.type)}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={profile.status === 'connected' ? 'destructive' : 'default'}
                    onClick={() => handleConnect(profile.id)}
                    disabled={profile.status === 'connecting'}
                  >
                    {profile.status === 'connected' ? (
                      <><Square className="w-3 h-3 mr-1" /> Putus</>
                    ) : profile.status === 'connecting' ? (
                      'Menghubungkan...'
                    ) : (
                      <><Play className="w-3 h-3 mr-1" /> Hubungkan</>
                    )}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => handleDeleteProfile(profile.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VPNManagement;
