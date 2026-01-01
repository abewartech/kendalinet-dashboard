import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { 
  HardDrive, 
  FolderOpen, 
  Users, 
  Settings, 
  Plus, 
  Trash2, 
  Edit, 
  Share2,
  Lock,
  Unlock,
  RefreshCw,
  Monitor,
  Clock,
  Copy,
  Power,
  Shield
} from "lucide-react";

interface SambaShare {
  id: string;
  name: string;
  path: string;
  comment: string;
  browseable: boolean;
  readOnly: boolean;
  guestOk: boolean;
  validUsers: string[];
  createMask: string;
  directoryMask: string;
}

interface SambaUser {
  id: string;
  username: string;
  enabled: boolean;
  createdAt: string;
}

interface ConnectedClient {
  id: string;
  ip: string;
  username: string;
  share: string;
  connectedAt: string;
  openFiles: number;
}

const SambaNASManager = () => {
  const [sambaEnabled, setSambaEnabled] = useState(true);
  const [workgroup, setWorkgroup] = useState("WORKGROUP");
  const [serverString, setServerString] = useState("KendaliNet NAS");
  const [netbiosName, setNetbiosName] = useState("KENDALI-NAS");
  const [interfaces, setInterfaces] = useState("lan");
  
  const [shares, setShares] = useState<SambaShare[]>([
    {
      id: "1",
      name: "Public",
      path: "/mnt/sda1/public",
      comment: "Folder publik untuk semua",
      browseable: true,
      readOnly: false,
      guestOk: true,
      validUsers: [],
      createMask: "0664",
      directoryMask: "0775"
    },
    {
      id: "2",
      name: "Private",
      path: "/mnt/sda1/private",
      comment: "Folder privat dengan autentikasi",
      browseable: true,
      readOnly: false,
      guestOk: false,
      validUsers: ["admin", "user1"],
      createMask: "0660",
      directoryMask: "0770"
    },
    {
      id: "3",
      name: "Media",
      path: "/mnt/sda1/media",
      comment: "Koleksi media (read-only)",
      browseable: true,
      readOnly: true,
      guestOk: true,
      validUsers: [],
      createMask: "0644",
      directoryMask: "0755"
    }
  ]);

  const [sambaUsers, setSambaUsers] = useState<SambaUser[]>([
    { id: "1", username: "admin", enabled: true, createdAt: "2024-01-15" },
    { id: "2", username: "user1", enabled: true, createdAt: "2024-02-20" },
    { id: "3", username: "guest", enabled: false, createdAt: "2024-03-10" }
  ]);

  const [connectedClients, setConnectedClients] = useState<ConnectedClient[]>([
    { id: "1", ip: "192.168.1.100", username: "admin", share: "Private", connectedAt: "14:30", openFiles: 3 },
    { id: "2", ip: "192.168.1.105", username: "guest", share: "Public", connectedAt: "15:45", openFiles: 1 }
  ]);

  const [showAddShare, setShowAddShare] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingShare, setEditingShare] = useState<SambaShare | null>(null);

  const [newShare, setNewShare] = useState<Partial<SambaShare>>({
    name: "",
    path: "",
    comment: "",
    browseable: true,
    readOnly: false,
    guestOk: false,
    createMask: "0664",
    directoryMask: "0775"
  });

  const [newUser, setNewUser] = useState({ username: "", password: "", confirmPassword: "" });

  const handleToggleSamba = (enabled: boolean) => {
    setSambaEnabled(enabled);
    toast.success(enabled ? "Samba NAS diaktifkan" : "Samba NAS dinonaktifkan");
  };

  const handleSaveGlobalConfig = () => {
    toast.success("Konfigurasi global berhasil disimpan");
  };

  const handleAddShare = () => {
    if (!newShare.name || !newShare.path) {
      toast.error("Nama dan path folder wajib diisi");
      return;
    }

    const share: SambaShare = {
      id: Date.now().toString(),
      name: newShare.name!,
      path: newShare.path!,
      comment: newShare.comment || "",
      browseable: newShare.browseable ?? true,
      readOnly: newShare.readOnly ?? false,
      guestOk: newShare.guestOk ?? false,
      validUsers: [],
      createMask: newShare.createMask || "0664",
      directoryMask: newShare.directoryMask || "0775"
    };

    setShares([...shares, share]);
    setNewShare({
      name: "",
      path: "",
      comment: "",
      browseable: true,
      readOnly: false,
      guestOk: false,
      createMask: "0664",
      directoryMask: "0775"
    });
    setShowAddShare(false);
    toast.success(`Share "${share.name}" berhasil ditambahkan`);
  };

  const handleDeleteShare = (id: string) => {
    const share = shares.find(s => s.id === id);
    setShares(shares.filter(s => s.id !== id));
    toast.success(`Share "${share?.name}" berhasil dihapus`);
  };

  const handleAddUser = () => {
    if (!newUser.username || !newUser.password) {
      toast.error("Username dan password wajib diisi");
      return;
    }
    if (newUser.password !== newUser.confirmPassword) {
      toast.error("Password tidak cocok");
      return;
    }

    const user: SambaUser = {
      id: Date.now().toString(),
      username: newUser.username,
      enabled: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setSambaUsers([...sambaUsers, user]);
    setNewUser({ username: "", password: "", confirmPassword: "" });
    setShowAddUser(false);
    toast.success(`User "${user.username}" berhasil ditambahkan`);
  };

  const handleToggleUser = (id: string) => {
    setSambaUsers(sambaUsers.map(u => 
      u.id === id ? { ...u, enabled: !u.enabled } : u
    ));
    const user = sambaUsers.find(u => u.id === id);
    toast.success(`User "${user?.username}" ${user?.enabled ? "dinonaktifkan" : "diaktifkan"}`);
  };

  const handleDeleteUser = (id: string) => {
    const user = sambaUsers.find(u => u.id === id);
    setSambaUsers(sambaUsers.filter(u => u.id !== id));
    toast.success(`User "${user?.username}" berhasil dihapus`);
  };

  const handleDisconnectClient = (id: string) => {
    const client = connectedClients.find(c => c.id === id);
    setConnectedClients(connectedClients.filter(c => c.id !== id));
    toast.success(`Koneksi dari ${client?.ip} berhasil diputus`);
  };

  const handleRestartSamba = () => {
    toast.success("Layanan Samba sedang di-restart...");
    setTimeout(() => {
      toast.success("Layanan Samba berhasil di-restart");
    }, 2000);
  };

  const copyNetworkPath = (shareName: string) => {
    const path = `\\\\${netbiosName}\\${shareName}`;
    navigator.clipboard.writeText(path);
    toast.success(`Path "${path}" disalin ke clipboard`);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header Status */}
      <Card className="glass-card border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                sambaEnabled ? "bg-primary/20" : "bg-muted"
              }`}>
                <HardDrive className={`w-7 h-7 ${sambaEnabled ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Samba NAS</h3>
                <p className="text-sm text-muted-foreground">
                  File sharing untuk jaringan lokal
                </p>
              </div>
            </div>
            <Switch
              checked={sambaEnabled}
              onCheckedChange={handleToggleSamba}
            />
          </div>

          {sambaEnabled && (
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 rounded-xl bg-background/50">
                <FolderOpen className="w-5 h-5 mx-auto mb-1 text-primary" />
                <p className="text-lg font-bold">{shares.length}</p>
                <p className="text-xs text-muted-foreground">Shares</p>
              </div>
              <div className="p-3 rounded-xl bg-background/50">
                <Users className="w-5 h-5 mx-auto mb-1 text-green-400" />
                <p className="text-lg font-bold">{sambaUsers.filter(u => u.enabled).length}</p>
                <p className="text-xs text-muted-foreground">Users Aktif</p>
              </div>
              <div className="p-3 rounded-xl bg-background/50">
                <Monitor className="w-5 h-5 mx-auto mb-1 text-blue-400" />
                <p className="text-lg font-bold">{connectedClients.length}</p>
                <p className="text-xs text-muted-foreground">Terhubung</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {sambaEnabled && (
        <Tabs defaultValue="shares" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="shares" className="text-xs">
              <FolderOpen className="w-4 h-4 mr-1" />
              Shares
            </TabsTrigger>
            <TabsTrigger value="users" className="text-xs">
              <Users className="w-4 h-4 mr-1" />
              Users
            </TabsTrigger>
            <TabsTrigger value="clients" className="text-xs">
              <Monitor className="w-4 h-4 mr-1" />
              Clients
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs">
              <Settings className="w-4 h-4 mr-1" />
              Config
            </TabsTrigger>
          </TabsList>

          {/* Shares Tab */}
          <TabsContent value="shares" className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">Folder Tersharing</h4>
              <Dialog open={showAddShare} onOpenChange={setShowAddShare}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Tambah Share
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tambah Share Baru</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Nama Share</Label>
                      <Input
                        placeholder="Documents"
                        value={newShare.name}
                        onChange={(e) => setNewShare({ ...newShare, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Path Folder</Label>
                      <Input
                        placeholder="/mnt/sda1/documents"
                        value={newShare.path}
                        onChange={(e) => setNewShare({ ...newShare, path: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Deskripsi</Label>
                      <Input
                        placeholder="Folder untuk dokumen"
                        value={newShare.comment}
                        onChange={(e) => setNewShare({ ...newShare, comment: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <Label>Browseable</Label>
                        <Switch
                          checked={newShare.browseable}
                          onCheckedChange={(v) => setNewShare({ ...newShare, browseable: v })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Read Only</Label>
                        <Switch
                          checked={newShare.readOnly}
                          onCheckedChange={(v) => setNewShare({ ...newShare, readOnly: v })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Guest OK</Label>
                        <Switch
                          checked={newShare.guestOk}
                          onCheckedChange={(v) => setNewShare({ ...newShare, guestOk: v })}
                        />
                      </div>
                    </div>
                    <Button onClick={handleAddShare} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Share
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-3">
              {shares.map((share) => (
                <Card key={share.id} className="glass-card border-0">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          share.guestOk ? "bg-green-500/20" : "bg-yellow-500/20"
                        }`}>
                          {share.guestOk ? (
                            <Unlock className="w-5 h-5 text-green-400" />
                          ) : (
                            <Lock className="w-5 h-5 text-yellow-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{share.name}</h4>
                            {share.readOnly && (
                              <Badge variant="secondary" className="text-xs">Read-Only</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">{share.path}</p>
                          <p className="text-xs text-muted-foreground mt-1">{share.comment}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs gap-1"
                              onClick={() => copyNetworkPath(share.name)}
                            >
                              <Copy className="w-3 h-3" />
                              Copy Path
                            </Button>
                            {!share.guestOk && share.validUsers.length > 0 && (
                              <span className="text-xs text-muted-foreground">
                                Users: {share.validUsers.join(", ")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setEditingShare(share)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDeleteShare(share.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">Samba Users</h4>
              <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Tambah User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tambah User Samba</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Username</Label>
                      <Input
                        placeholder="username"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Konfirmasi Password</Label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={newUser.confirmPassword}
                        onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                      />
                    </div>
                    <Button onClick={handleAddUser} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah User
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="glass-card border-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Dibuat</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sambaUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>
                        <Badge variant={user.enabled ? "default" : "secondary"}>
                          {user.enabled ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.createdAt}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleToggleUser(user.id)}
                          >
                            <Power className={`w-4 h-4 ${user.enabled ? "text-green-400" : "text-muted-foreground"}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Connected Clients Tab */}
          <TabsContent value="clients" className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">Koneksi Aktif</h4>
              <Button variant="outline" size="sm" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>

            <Card className="glass-card border-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>IP Address</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Share</TableHead>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Files</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {connectedClients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        Tidak ada koneksi aktif
                      </TableCell>
                    </TableRow>
                  ) : (
                    connectedClients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-mono text-sm">{client.ip}</TableCell>
                        <TableCell>{client.username}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{client.share}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {client.connectedAt}
                          </div>
                        </TableCell>
                        <TableCell>{client.openFiles}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => handleDisconnectClient(client.id)}
                          >
                            Disconnect
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Global Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Konfigurasi Global
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Workgroup</Label>
                    <Input
                      value={workgroup}
                      onChange={(e) => setWorkgroup(e.target.value.toUpperCase())}
                      placeholder="WORKGROUP"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>NetBIOS Name</Label>
                    <Input
                      value={netbiosName}
                      onChange={(e) => setNetbiosName(e.target.value.toUpperCase())}
                      placeholder="KENDALI-NAS"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Server Description</Label>
                  <Input
                    value={serverString}
                    onChange={(e) => setServerString(e.target.value)}
                    placeholder="KendaliNet NAS Server"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Interface</Label>
                  <Select value={interfaces} onValueChange={setInterfaces}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lan">LAN Only</SelectItem>
                      <SelectItem value="lan wan">LAN + WAN</SelectItem>
                      <SelectItem value="all">Semua Interface</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Interface jaringan yang menerima koneksi Samba
                  </p>
                </div>

                <div className="pt-2 flex gap-2">
                  <Button onClick={handleSaveGlobalConfig} className="flex-1">
                    Simpan Konfigurasi
                  </Button>
                  <Button variant="outline" onClick={handleRestartSamba}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Restart Samba
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Keamanan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMB1 (CIFS)</p>
                    <p className="text-xs text-muted-foreground">Tidak disarankan, rentan keamanan</p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMB2</p>
                    <p className="text-xs text-muted-foreground">Kompatibilitas Windows 7+</p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMB3</p>
                    <p className="text-xs text-muted-foreground">Keamanan terbaik, Windows 8+</p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
              </CardContent>
            </Card>

            {/* Quick Access Info */}
            <Card className="glass-card border-0 bg-primary/5">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Cara Akses
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-background/50">
                    <span className="text-muted-foreground">Windows:</span>
                    <code className="font-mono text-xs">\\{netbiosName}\</code>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-background/50">
                    <span className="text-muted-foreground">macOS:</span>
                    <code className="font-mono text-xs">smb://{netbiosName}/</code>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-background/50">
                    <span className="text-muted-foreground">Linux:</span>
                    <code className="font-mono text-xs">smb://{netbiosName}/</code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default SambaNASManager;
