import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Terminal, 
  Key, 
  Shield, 
  Users, 
  Plus, 
  Trash2, 
  Copy, 
  Eye, 
  EyeOff,
  RefreshCw,
  Clock,
  Wifi,
  AlertTriangle,
  CheckCircle,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SSHKey {
  id: string;
  name: string;
  publicKey: string;
  fingerprint: string;
  addedDate: string;
  lastUsed: string | null;
}

interface SSHSession {
  id: string;
  user: string;
  ip: string;
  connectedAt: string;
  duration: string;
}

const SSHManager: React.FC = () => {
  const { toast } = useToast();
  const [sshEnabled, setSSHEnabled] = useState(true);
  const [sshPort, setSSHPort] = useState('22');
  const [passwordAuth, setPasswordAuth] = useState(true);
  const [keyAuth, setKeyAuth] = useState(true);
  const [rootLogin, setRootLogin] = useState(true);
  const [maxRetries, setMaxRetries] = useState('3');
  const [timeout, setTimeout] = useState('300');
  const [showNewKeyForm, setShowNewKeyForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newPublicKey, setNewPublicKey] = useState('');

  const [sshKeys, setSSHKeys] = useState<SSHKey[]>([
    {
      id: '1',
      name: 'Laptop Admin',
      publicKey: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQ...',
      fingerprint: 'SHA256:nThbg6kXUpJWGl7E1IGOCspRomTx...',
      addedDate: '2024-01-15',
      lastUsed: '2024-12-29'
    },
    {
      id: '2',
      name: 'Server Monitoring',
      publicKey: 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAA...',
      fingerprint: 'SHA256:pXUpJWGl7E1IGOCspRomTxdCArL...',
      addedDate: '2024-02-20',
      lastUsed: null
    }
  ]);

  const [activeSessions, setActiveSessions] = useState<SSHSession[]>([
    {
      id: '1',
      user: 'root',
      ip: '192.168.2.100',
      connectedAt: '14:30:25',
      duration: '00:15:32'
    }
  ]);

  const handleSaveSettings = () => {
    toast({
      title: "Pengaturan Disimpan",
      description: "Konfigurasi SSH berhasil diperbarui",
    });
  };

  const handleAddKey = () => {
    if (!newKeyName.trim() || !newPublicKey.trim()) {
      toast({
        title: "Error",
        description: "Nama dan public key harus diisi",
        variant: "destructive"
      });
      return;
    }

    const newKey: SSHKey = {
      id: Date.now().toString(),
      name: newKeyName,
      publicKey: newPublicKey.substring(0, 50) + '...',
      fingerprint: 'SHA256:' + Math.random().toString(36).substring(2, 15) + '...',
      addedDate: new Date().toISOString().split('T')[0],
      lastUsed: null
    };

    setSSHKeys([...sshKeys, newKey]);
    setNewKeyName('');
    setNewPublicKey('');
    setShowNewKeyForm(false);

    toast({
      title: "Kunci Ditambahkan",
      description: `SSH key "${newKeyName}" berhasil ditambahkan`,
    });
  };

  const handleDeleteKey = (id: string, name: string) => {
    setSSHKeys(sshKeys.filter(k => k.id !== id));
    toast({
      title: "Kunci Dihapus",
      description: `SSH key "${name}" berhasil dihapus`,
    });
  };

  const handleTerminateSession = (id: string) => {
    setActiveSessions(activeSessions.filter(s => s.id !== id));
    toast({
      title: "Sesi Diputus",
      description: "Koneksi SSH berhasil diputus",
    });
  };

  const handleCopyFingerprint = (fingerprint: string) => {
    navigator.clipboard.writeText(fingerprint);
    toast({
      title: "Disalin",
      description: "Fingerprint disalin ke clipboard",
    });
  };

  const handleRestartSSH = () => {
    toast({
      title: "Memulai Ulang SSH",
      description: "Layanan SSH sedang dimuat ulang...",
    });
  };

  return (
    <div className="space-y-4">
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Terminal className="h-5 w-5 text-primary" />
              SSH Manager
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={sshEnabled ? "default" : "secondary"} className="text-xs">
                {sshEnabled ? 'Aktif' : 'Nonaktif'}
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRestartSSH}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Restart
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="settings" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 bg-muted/50">
              <TabsTrigger value="settings" className="text-xs">
                <Settings className="h-3 w-3 mr-1" />
                Pengaturan
              </TabsTrigger>
              <TabsTrigger value="keys" className="text-xs">
                <Key className="h-3 w-3 mr-1" />
                Kunci SSH
              </TabsTrigger>
              <TabsTrigger value="sessions" className="text-xs">
                <Users className="h-3 w-3 mr-1" />
                Sesi Aktif
              </TabsTrigger>
            </TabsList>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Aktifkan SSH</span>
                  </div>
                  <Switch 
                    checked={sshEnabled} 
                    onCheckedChange={setSSHEnabled}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Port SSH</Label>
                  <Input 
                    value={sshPort}
                    onChange={(e) => setSSHPort(e.target.value)}
                    placeholder="22"
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Max Retry</Label>
                  <Select value={maxRetries} onValueChange={setMaxRetries}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 kali</SelectItem>
                      <SelectItem value="5">5 kali</SelectItem>
                      <SelectItem value="10">10 kali</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Timeout (detik)</Label>
                  <Input 
                    value={timeout}
                    onChange={(e) => setTimeout(e.target.value)}
                    placeholder="300"
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Protokol</Label>
                  <Select defaultValue="2">
                    <SelectTrigger className="bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">SSH-2 Only</SelectItem>
                      <SelectItem value="1,2">SSH-1 & SSH-2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Autentikasi
                </h4>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-muted/20 rounded">
                    <span className="text-sm">Login Password</span>
                    <Switch 
                      checked={passwordAuth} 
                      onCheckedChange={setPasswordAuth}
                    />
                  </div>

                  <div className="flex items-center justify-between p-2 bg-muted/20 rounded">
                    <span className="text-sm">Login Key SSH</span>
                    <Switch 
                      checked={keyAuth} 
                      onCheckedChange={setKeyAuth}
                    />
                  </div>

                  <div className="flex items-center justify-between p-2 bg-muted/20 rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Izinkan Root Login</span>
                      <AlertTriangle className="h-3 w-3 text-yellow-500" />
                    </div>
                    <Switch 
                      checked={rootLogin} 
                      onCheckedChange={setRootLogin}
                    />
                  </div>
                </div>
              </div>

              <Button 
                className="w-full" 
                onClick={handleSaveSettings}
              >
                Simpan Pengaturan
              </Button>
            </TabsContent>

            {/* SSH Keys Tab */}
            <TabsContent value="keys" className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {sshKeys.length} kunci terdaftar
                </p>
                <Button 
                  size="sm" 
                  onClick={() => setShowNewKeyForm(!showNewKeyForm)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Tambah Kunci
                </Button>
              </div>

              {showNewKeyForm && (
                <Card className="bg-muted/30 border-dashed">
                  <CardContent className="pt-4 space-y-3">
                    <div className="space-y-2">
                      <Label className="text-xs">Nama Kunci</Label>
                      <Input 
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        placeholder="Contoh: Laptop Kantor"
                        className="bg-background/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Public Key</Label>
                      <Textarea 
                        value={newPublicKey}
                        onChange={(e) => setNewPublicKey(e.target.value)}
                        placeholder="ssh-rsa AAAAB3Nza... atau ssh-ed25519 AAAAC3..."
                        className="bg-background/50 min-h-[80px] text-xs font-mono"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleAddKey} className="flex-1">
                        Simpan
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setShowNewKeyForm(false)}
                      >
                        Batal
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-2">
                {sshKeys.map((key) => (
                  <Card key={key.id} className="bg-muted/20">
                    <CardContent className="pt-3 pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <Key className="h-4 w-4 text-primary" />
                            <span className="font-medium text-sm">{key.name}</span>
                          </div>
                          <p className="text-xs font-mono text-muted-foreground truncate max-w-[200px]">
                            {key.fingerprint}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Ditambahkan: {key.addedDate}
                            </span>
                            {key.lastUsed && (
                              <span className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                Terakhir: {key.lastUsed}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleCopyFingerprint(key.fingerprint)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteKey(key.id, key.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Active Sessions Tab */}
            <TabsContent value="sessions" className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {activeSessions.length} sesi aktif
                </p>
                <Badge variant="outline" className="text-xs">
                  <Wifi className="h-3 w-3 mr-1" />
                  Port {sshPort}
                </Badge>
              </div>

              {activeSessions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Tidak ada sesi SSH aktif</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {activeSessions.map((session) => (
                    <Card key={session.id} className="bg-muted/20">
                      <CardContent className="pt-3 pb-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                              <span className="font-medium text-sm">{session.user}@{session.ip}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Terhubung: {session.connectedAt}
                              </span>
                              <span>
                                Durasi: {session.duration}
                              </span>
                            </div>
                          </div>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleTerminateSession(session.id)}
                          >
                            Putus
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-medium text-yellow-500">Perhatian</p>
                    <p className="text-muted-foreground">
                      Memutus sesi SSH aktif dapat mengganggu proses yang sedang berjalan.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SSHManager;
