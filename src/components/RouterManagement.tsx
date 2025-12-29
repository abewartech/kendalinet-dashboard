import { useState, useEffect } from 'react';
import { Router, Plus, Trash2, Edit2, Save, X, Eye, EyeOff } from 'lucide-react';
import { RouterProfile } from '@/lib/routerTypes';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import RouterBackupRestore from './RouterBackupRestore';

interface RouterManagementProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  routers: RouterProfile[];
  onAddRouter: (router: Omit<RouterProfile, 'id' | 'isActive' | 'status'>) => void;
  onUpdateRouter: (id: string, updates: Partial<RouterProfile>) => void;
  onDeleteRouter: (id: string) => void;
  onRestoreRouters: (routers: RouterProfile[]) => void;
}

interface RouterFormData {
  name: string;
  ipAddress: string;
  username: string;
  password: string;
}

const initialFormData: RouterFormData = {
  name: '',
  ipAddress: '192.168.1.1',
  username: 'root',
  password: ''
};

const RouterManagement = ({
  open,
  onOpenChange,
  routers,
  onAddRouter,
  onUpdateRouter,
  onDeleteRouter,
  onRestoreRouters
}: RouterManagementProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<RouterFormData>(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setIsAdding(false);
      setEditingId(null);
      setFormData(initialFormData);
      setShowPassword(false);
    }
  }, [open]);

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Nama router wajib diisi',
        variant: 'destructive'
      });
      return;
    }

    if (!formData.ipAddress.trim()) {
      toast({
        title: 'Alamat IP wajib diisi',
        variant: 'destructive'
      });
      return;
    }

    if (editingId) {
      onUpdateRouter(editingId, formData);
      toast({
        title: 'Router Diperbarui',
        description: `${formData.name} berhasil diperbarui.`
      });
      setEditingId(null);
    } else {
      onAddRouter(formData);
      toast({
        title: 'Router Ditambahkan',
        description: `${formData.name} berhasil ditambahkan.`
      });
      setIsAdding(false);
    }

    setFormData(initialFormData);
    setShowPassword(false);
  };

  const handleEdit = (router: RouterProfile) => {
    setEditingId(router.id);
    setFormData({
      name: router.name,
      ipAddress: router.ipAddress,
      username: router.username,
      password: router.password
    });
    setIsAdding(false);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData(initialFormData);
    setShowPassword(false);
  };

  const handleDelete = (id: string) => {
    onDeleteRouter(id);
    toast({
      title: 'Router Dihapus',
      description: 'Router berhasil dihapus dari daftar.',
      variant: 'destructive'
    });
    setDeleteConfirmId(null);
  };

  const renderForm = () => (
    <Card className="p-4 space-y-4 bg-secondary/30 border-primary/20">
      <div className="space-y-2">
        <Label htmlFor="name">Nama Router</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Contoh: Router Rumah"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ip">Alamat IP</Label>
        <Input
          id="ip"
          value={formData.ipAddress}
          onChange={(e) => setFormData(prev => ({ ...prev, ipAddress: e.target.value }))}
          placeholder="192.168.1.1"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={formData.username}
          onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
          placeholder="root"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            placeholder="Password router"
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button onClick={handleSubmit} className="flex-1">
          <Save className="w-4 h-4 mr-2" />
          {editingId ? 'Simpan' : 'Tambah'}
        </Button>
        <Button variant="outline" onClick={handleCancelEdit}>
          <X className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Router className="w-5 h-5" />
              Kelola Router
            </DialogTitle>
            <DialogDescription>
              Tambah, edit, atau hapus profil router Anda
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Router List */}
            {routers.map((router) => (
              <Card
                key={router.id}
                className={`p-4 transition-all ${
                  editingId === router.id ? 'ring-2 ring-primary' : ''
                } ${router.isActive ? 'border-success/30 bg-success/5' : ''}`}
              >
                {editingId === router.id ? (
                  renderForm()
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        router.status === 'online' 
                          ? 'bg-success/10' 
                          : router.status === 'offline'
                            ? 'bg-destructive/10'
                            : 'bg-secondary'
                      }`}>
                        <Router className={`w-5 h-5 ${
                          router.status === 'online'
                            ? 'text-success'
                            : router.status === 'offline'
                              ? 'text-destructive'
                              : 'text-muted-foreground'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground flex items-center gap-2">
                          {router.name}
                          {router.isActive && (
                            <span className="text-xs bg-success/20 text-success px-2 py-0.5 rounded-full">
                              Aktif
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">{router.ipAddress}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(router)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      {routers.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteConfirmId(router.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            ))}

            {/* Add New Router Form */}
            {isAdding && !editingId && renderForm()}

            {/* Backup & Restore Section */}
            <RouterBackupRestore 
              routers={routers} 
              onRestoreRouters={onRestoreRouters} 
            />

            {/* Add Router Button */}
            {!isAdding && !editingId && (
              <Button
                variant="outline"
                className="w-full border-dashed"
                onClick={() => setIsAdding(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Router Baru
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Router?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus router ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RouterManagement;
