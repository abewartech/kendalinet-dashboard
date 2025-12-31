import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  HardDrive,
  Download,
  Upload,
  RefreshCw,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileArchive,
  RotateCcw,
  Trash2,
  Info,
  Cpu,
  Zap
} from "lucide-react";
import { toast } from "sonner";
import { useLuciApi } from "@/hooks/useLuciApi";

interface FirmwareInfo {
  currentVersion: string;
  latestVersion: string;
  releaseDate: string;
  size: string;
  changelog: string[];
  isUpdateAvailable: boolean;
}

interface BackupFile {
  name: string;
  date: string;
  size: string;
  type?: "full" | "config" | "network";
}

const SystemManagement = () => {
  const {
    firmwareInfo,
    backups,
    fetchFirmwareInfo,
    checkFirmwareUpdate,
    upgradeFirmware,
    toggleAutoUpdate: toggleAutoUpdateApi,
    fetchBackups,
    createBackup,
    restoreBackup,
    deleteBackup,
    getBackupDownloadUrl
  } = useLuciApi();

  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    fetchFirmwareInfo();
    fetchBackups();
  }, []);

  const handleCheckUpdate = async () => {
    toast.info("Memeriksa pembaruan firmware...");
    const res = await checkFirmwareUpdate();
    if (res.updateAvailable) {
      setUpdateAvailable(true);
      toast.success("Pembaruan firmware tersedia!");
    } else {
      setUpdateAvailable(false);
      toast.info("Firmware sudah dalam versi terbaru");
    }
  };

  const handleStartUpdate = async () => {
    setIsUpdating(true);
    setUpdateProgress(10);

    const res = await upgradeFirmware();
    if (res.success) {
      setUpdateProgress(100);
      toast.success(res.message || "Firmware sedang diperbarui...");
    } else {
      toast.error(res.message || "Gagal memulai pembaruan firmware");
      setIsUpdating(false);
    }
  };

  const handleToggleAutoUpdate = async (val: boolean) => {
    setAutoUpdate(val);
    const res = await toggleAutoUpdateApi(val);
    if (res.success) {
      toast.success(val ? "Auto update diaktifkan" : "Auto update dinonaktifkan");
    } else {
      toast.error("Gagal mengubah pengaturan auto update");
      setAutoUpdate(!val);
    }
  };

  const handleCreateBackup = async (type: "full" | "config" | "network") => {
    setIsBackingUp(true);
    const typeLabels = { full: "Lengkap", config: "Konfigurasi", network: "Jaringan" };

    toast.info(`Membuat backup ${typeLabels[type]}...`);
    const res = await createBackup(type);

    if (res.success) {
      toast.success(`Backup ${typeLabels[type]} berhasil dibuat!`);
      fetchBackups();
    } else {
      toast.error("Gagal membuat backup");
    }
    setIsBackingUp(false);
  };

  const handleDownloadBackup = (backup: BackupFile) => {
    const url = getBackupDownloadUrl(backup.name);
    window.open(url, '_blank');
  };

  const handleRestoreBackup = async (backup: BackupFile) => {
    if (!confirm(`Apakah Anda yakin ingin memulihkan sistem dari backup ${backup.name}? Router akan restart.`)) {
      return;
    }

    setIsRestoring(true);
    const res = await restoreBackup(backup.name);

    if (res.success) {
      toast.success("Konfigurasi berhasil dipulihkan! Router akan restart...");
    } else {
      toast.error("Gagal memulihkan backup");
      setIsRestoring(false);
    }
  };

  const handleDeleteBackup = async (name: string) => {
    if (!confirm(`Hapus file backup ${name}?`)) return;

    const res = await deleteBackup(name);
    if (res.success) {
      toast.success("Backup dihapus");
      fetchBackups();
    } else {
      toast.error("Gagal menghapus backup");
    }
  };

  const handleUploadFirmware = () => {
    toast.info("Fitur upload firmware manual akan tersedia di versi mendatang");
  };

  const handleUploadBackup = () => {
    toast.info("Fitur upload backup akan tersedia di versi mendatang");
  };

  const getTypeColor = (name: string) => {
    if (name.includes("full")) return "bg-primary/20 text-primary";
    if (name.includes("config")) return "bg-blue-500/20 text-blue-400";
    if (name.includes("network")) return "bg-green-500/20 text-green-400";
    return "bg-muted text-muted-foreground";
  };

  const getTypeLabel = (name: string) => {
    if (name.includes("full")) return "Lengkap";
    if (name.includes("config")) return "Config";
    if (name.includes("network")) return "Network";
    return "Backup";
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto glass-card rounded-2xl flex items-center justify-center mb-4">
          <HardDrive className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Sistem & Pemeliharaan</h1>
        <p className="text-muted-foreground text-sm">
          Kelola firmware dan backup konfigurasi router
        </p>
      </div>

      <Tabs defaultValue="firmware" className="w-full">
        <TabsList className="grid w-full grid-cols-2 glass-card">
          <TabsTrigger value="firmware" className="data-[state=active]:bg-primary/20">
            <Cpu className="w-4 h-4 mr-2" />
            Firmware
          </TabsTrigger>
          <TabsTrigger value="backup" className="data-[state=active]:bg-primary/20">
            <FileArchive className="w-4 h-4 mr-2" />
            Backup
          </TabsTrigger>
        </TabsList>

        {/* Firmware Tab */}
        <TabsContent value="firmware" className="space-y-4 mt-4">
          {/* Current Version */}
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Versi Firmware Saat Ini
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{firmwareInfo?.currentVersion || "Loading..."}</p>
                  <p className="text-sm text-muted-foreground">{firmwareInfo?.kernel || "Kernel info..."}</p>
                </div>
                <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Aktif
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleCheckUpdate}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Cek Pembaruan
                </Button>
                <Button
                  variant="outline"
                  onClick={handleUploadFirmware}
                >
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Update Available */}
          {updateAvailable && (
            <Card className="glass-card border-primary/30 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Pembaruan Tersedia
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold text-primary">Versi Terbaru Ditemukan</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Badge className="bg-primary/20 text-primary">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Baru
                  </Badge>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Catatan:</p>
                  <p className="text-sm text-muted-foreground">
                    Pembaruan sistem tersedia melalui repositori opkg. Klik tombol di bawah untuk memulai proses upgrade.
                  </p>
                </div>

                {isUpdating ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Memperbarui firmware...</span>
                      <span>{updateProgress}%</span>
                    </div>
                    <Progress value={updateProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground text-center">
                      Jangan matikan router selama proses pembaruan
                    </p>
                  </div>
                ) : (
                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={handleStartUpdate}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Perbarui Sekarang
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Auto Update */}
          <Card className="glass-card border-border/50">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium">Pembaruan Otomatis</p>
                    <p className="text-sm text-muted-foreground">Periksa & unduh otomatis harian</p>
                  </div>
                </div>
                <Switch checked={autoUpdate} onCheckedChange={handleToggleAutoUpdate} />
              </div>
            </CardContent>
          </Card>

          {/* Warning */}
          <Card className="glass-card border-yellow-500/30 bg-yellow-500/5">
            <CardContent className="pt-4">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-400">Peringatan</p>
                  <p className="text-muted-foreground">
                    Pastikan backup konfigurasi sebelum memperbarui firmware.
                    Proses update membutuhkan waktu 2-5 menit.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup Tab */}
        <TabsContent value="backup" className="space-y-4 mt-4">
          {/* Create Backup */}
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileArchive className="w-5 h-5 text-primary" />
                Buat Backup Baru
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  className="flex-col h-auto py-3"
                  onClick={() => handleCreateBackup("full")}
                  disabled={isBackingUp}
                >
                  <HardDrive className="w-5 h-5 mb-1 text-primary" />
                  <span className="text-xs">Lengkap</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex-col h-auto py-3"
                  onClick={() => handleCreateBackup("config")}
                  disabled={isBackingUp}
                >
                  <FileArchive className="w-5 h-5 mb-1 text-blue-400" />
                  <span className="text-xs">Config</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex-col h-auto py-3"
                  onClick={() => handleCreateBackup("network")}
                  disabled={isBackingUp}
                >
                  <Shield className="w-5 h-5 mb-1 text-green-400" />
                  <span className="text-xs">Network</span>
                </Button>
              </div>

              {isBackingUp && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Membuat backup...
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upload Backup */}
          <Card className="glass-card border-border/50">
            <CardContent className="pt-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleUploadBackup}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload File Backup
              </Button>
            </CardContent>
          </Card>

          {/* Backup List */}
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Riwayat Backup
                </span>
                <Badge variant="outline">{(backups || []).length} file</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(backups || []).map((backup, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-card/50 border border-border/30 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium truncate max-w-[200px]">{backup.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{backup.date}</span>
                        <span>•</span>
                        <span>{backup.size}</span>
                      </div>
                    </div>
                    <Badge className={getTypeColor(backup.name)}>
                      {getTypeLabel(backup.name)}
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDownloadBackup(backup)}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Unduh
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleRestoreBackup(backup)}
                      disabled={isRestoring}
                    >
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Pulihkan
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteBackup(backup.name)}
                    >
                      <Trash2 className="w-3 h-3 text-red-400" />
                    </Button>
                  </div>
                </div>
              ))}

              {(!backups || backups.length === 0) && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileArchive className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Belum ada backup tersimpan</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Restore Warning */}
          {isRestoring && (
            <Card className="glass-card border-yellow-500/30 bg-yellow-500/5">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 text-yellow-400 animate-spin" />
                  <div>
                    <p className="font-medium text-yellow-400">Memulihkan Konfigurasi...</p>
                    <p className="text-sm text-muted-foreground">
                      Jangan matikan router selama proses pemulihan
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemManagement;
