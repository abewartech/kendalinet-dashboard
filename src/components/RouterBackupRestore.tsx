import { useRef } from 'react';
import { Download, Upload, FileJson, AlertCircle } from 'lucide-react';
import { RouterProfile } from '@/lib/routerTypes';
import { Button } from '@/components/ui/button';
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
import { useState } from 'react';

interface RouterBackupRestoreProps {
  routers: RouterProfile[];
  onRestoreRouters: (routers: RouterProfile[]) => void;
}

interface BackupData {
  version: string;
  exportedAt: string;
  routers: RouterProfile[];
}

const RouterBackupRestore = ({ routers, onRestoreRouters }: RouterBackupRestoreProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [pendingRestore, setPendingRestore] = useState<RouterProfile[] | null>(null);

  const handleBackup = () => {
    const backupData: BackupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      routers: routers.map(router => ({
        ...router,
        // Don't include sensitive data in plain backup - mask password
        password: router.password ? '***ENCRYPTED***' : ''
      }))
    };

    // Create full backup with passwords (for local use)
    const fullBackupData: BackupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      routers: routers
    };

    const blob = new Blob([JSON.stringify(fullBackupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kendalinet-routers-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Backup Berhasil',
      description: `${routers.length} konfigurasi router berhasil diekspor.`
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data: BackupData = JSON.parse(content);

        // Validate backup structure
        if (!data.version || !data.routers || !Array.isArray(data.routers)) {
          throw new Error('Format file backup tidak valid');
        }

        // Validate each router
        const validRouters = data.routers.filter(router => 
          router.name && router.ipAddress && router.username
        );

        if (validRouters.length === 0) {
          throw new Error('Tidak ada data router valid ditemukan');
        }

        // Generate new IDs to avoid conflicts
        const restoredRouters: RouterProfile[] = validRouters.map((router, index) => ({
          ...router,
          id: `restored_${Date.now()}_${index}`,
          isActive: index === 0,
          status: 'unknown' as const,
          password: router.password === '***ENCRYPTED***' ? '' : router.password
        }));

        setPendingRestore(restoredRouters);
        setShowRestoreConfirm(true);

      } catch (error) {
        toast({
          title: 'Gagal Membaca File',
          description: error instanceof Error ? error.message : 'File backup tidak valid atau rusak.',
          variant: 'destructive'
        });
      }
    };

    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const confirmRestore = () => {
    if (pendingRestore) {
      onRestoreRouters(pendingRestore);
      toast({
        title: 'Restore Berhasil',
        description: `${pendingRestore.length} konfigurasi router berhasil dipulihkan.`
      });
    }
    setPendingRestore(null);
    setShowRestoreConfirm(false);
  };

  return (
    <>
      <Card className="p-4 bg-secondary/20 border-border/50">
        <div className="flex items-center gap-2 mb-3">
          <FileJson className="w-4 h-4 text-primary" />
          <span className="font-medium text-sm text-foreground">Backup & Restore</span>
        </div>
        
        <p className="text-xs text-muted-foreground mb-4">
          Ekspor atau impor konfigurasi semua router untuk backup atau migrasi ke perangkat lain.
        </p>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackup}
            className="flex-1"
            disabled={routers.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Backup
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1"
          >
            <Upload className="w-4 h-4 mr-2" />
            Restore
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileSelect}
          className="hidden"
        />
      </Card>

      {/* Restore Confirmation Dialog */}
      <AlertDialog open={showRestoreConfirm} onOpenChange={setShowRestoreConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-warning" />
              Konfirmasi Restore
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Anda akan mengganti semua konfigurasi router yang ada dengan data dari file backup.
              </p>
              {pendingRestore && (
                <div className="mt-3 p-3 bg-secondary rounded-lg">
                  <p className="text-sm font-medium text-foreground mb-2">
                    {pendingRestore.length} Router akan dipulihkan:
                  </p>
                  <ul className="text-xs space-y-1">
                    {pendingRestore.map((router, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                        <span>{router.name}</span>
                        <span className="text-muted-foreground">({router.ipAddress})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="text-warning text-sm mt-2">
                ⚠️ Konfigurasi router saat ini akan dihapus dan diganti.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingRestore(null)}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmRestore}>
              Ya, Pulihkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RouterBackupRestore;
