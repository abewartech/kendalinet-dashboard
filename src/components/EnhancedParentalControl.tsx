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
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { 
  Baby, 
  Clock, 
  Shield, 
  Smartphone, 
  Ban, 
  Plus,
  Trash2,
  Edit,
  Calendar,
  Moon,
  Sun,
  Utensils,
  BookOpen,
  Gamepad2,
  Youtube,
  Instagram,
  Music,
  AlertTriangle,
  CheckCircle2,
  Timer,
  Pause,
  Play
} from "lucide-react";

interface ChildProfile {
  id: string;
  name: string;
  avatar: string;
  devices: string[];
  dailyLimit: number;
  usedToday: number;
  bedtime: string;
  wakeTime: string;
  blockedCategories: string[];
  isPaused: boolean;
}

interface ScheduleRule {
  id: string;
  name: string;
  days: string[];
  startTime: string;
  endTime: string;
  action: "block" | "allow";
  devices: string[];
}

const EnhancedParentalControl = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [showAddProfile, setShowAddProfile] = useState(false);
  const [showAddSchedule, setShowAddSchedule] = useState(false);
  const [mealtimeActive, setMealtimeActive] = useState(false);
  const [mealtimeRemaining, setMealtimeRemaining] = useState(0);

  const [profiles, setProfiles] = useState<ChildProfile[]>([
    {
      id: "1",
      name: "Anak 1",
      avatar: "👦",
      devices: ["Tablet Anak", "HP Anak 1"],
      dailyLimit: 120,
      usedToday: 85,
      bedtime: "21:00",
      wakeTime: "06:00",
      blockedCategories: ["social_media", "gaming"],
      isPaused: false
    },
    {
      id: "2",
      name: "Anak 2",
      avatar: "👧",
      devices: ["HP Anak 2"],
      dailyLimit: 90,
      usedToday: 45,
      bedtime: "20:30",
      wakeTime: "06:30",
      blockedCategories: ["social_media"],
      isPaused: false
    }
  ]);

  const [schedules, setSchedules] = useState<ScheduleRule[]>([
    {
      id: "1",
      name: "Waktu Belajar",
      days: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"],
      startTime: "14:00",
      endTime: "16:00",
      action: "block",
      devices: ["Tablet Anak", "HP Anak 1", "HP Anak 2"]
    },
    {
      id: "2",
      name: "Waktu Tidur",
      days: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"],
      startTime: "21:00",
      endTime: "06:00",
      action: "block",
      devices: ["Tablet Anak", "HP Anak 1", "HP Anak 2"]
    }
  ]);

  const [newProfile, setNewProfile] = useState({
    name: "",
    avatar: "👦",
    dailyLimit: 120
  });

  const categories = [
    { id: "social_media", label: "Media Sosial", icon: Instagram },
    { id: "gaming", label: "Gaming", icon: Gamepad2 },
    { id: "video", label: "Video Streaming", icon: Youtube },
    { id: "music", label: "Musik Streaming", icon: Music },
    { id: "adult", label: "Konten Dewasa", icon: Ban }
  ];

  const avatars = ["👦", "👧", "🧒", "👶", "🧒🏻", "👦🏻", "👧🏻"];

  const handleToggleEnabled = (enabled: boolean) => {
    setIsEnabled(enabled);
    toast.success(enabled ? "Kontrol orangtua diaktifkan" : "Kontrol orangtua dinonaktifkan");
  };

  const handleMealtime = () => {
    if (mealtimeActive) {
      setMealtimeActive(false);
      setMealtimeRemaining(0);
      toast.success("Waktu makan selesai, internet kembali aktif");
    } else {
      setMealtimeActive(true);
      setMealtimeRemaining(30);
      toast.success("Waktu makan dimulai! Internet diblokir 30 menit");
      
      const interval = setInterval(() => {
        setMealtimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setMealtimeActive(false);
            toast.success("Waktu makan selesai!");
            return 0;
          }
          return prev - 1;
        });
      }, 60000);
    }
  };

  const handlePauseProfile = (id: string) => {
    setProfiles(profiles.map(p => 
      p.id === id ? { ...p, isPaused: !p.isPaused } : p
    ));
    const profile = profiles.find(p => p.id === id);
    toast.success(profile?.isPaused 
      ? `Internet untuk ${profile.name} dilanjutkan`
      : `Internet untuk ${profile?.name} dijeda`
    );
  };

  const handleAddProfile = () => {
    if (!newProfile.name) {
      toast.error("Nama profil wajib diisi");
      return;
    }

    const profile: ChildProfile = {
      id: Date.now().toString(),
      name: newProfile.name,
      avatar: newProfile.avatar,
      devices: [],
      dailyLimit: newProfile.dailyLimit,
      usedToday: 0,
      bedtime: "21:00",
      wakeTime: "06:00",
      blockedCategories: [],
      isPaused: false
    };

    setProfiles([...profiles, profile]);
    setNewProfile({ name: "", avatar: "👦", dailyLimit: 120 });
    setShowAddProfile(false);
    toast.success(`Profil "${profile.name}" berhasil ditambahkan`);
  };

  const handleDeleteProfile = (id: string) => {
    const profile = profiles.find(p => p.id === id);
    setProfiles(profiles.filter(p => p.id !== id));
    toast.success(`Profil "${profile?.name}" dihapus`);
  };

  const handleDeleteSchedule = (id: string) => {
    const schedule = schedules.find(s => s.id === id);
    setSchedules(schedules.filter(s => s.id !== id));
    toast.success(`Jadwal "${schedule?.name}" dihapus`);
  };

  const getUsagePercentage = (used: number, limit: number) => (used / limit) * 100;
  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "text-destructive";
    if (percentage >= 70) return "text-yellow-400";
    return "text-green-400";
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <Card className="glass-card border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                isEnabled ? "bg-primary/20" : "bg-muted"
              }`}>
                <Baby className={`w-7 h-7 ${isEnabled ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Kontrol Orangtua</h3>
                <p className="text-sm text-muted-foreground">
                  Kelola akses internet anak
                </p>
              </div>
            </div>
            <Switch checked={isEnabled} onCheckedChange={handleToggleEnabled} />
          </div>

          {isEnabled && (
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-background/50 text-center">
                <p className="text-lg font-bold">{profiles.length}</p>
                <p className="text-xs text-muted-foreground">Profil Anak</p>
              </div>
              <div className="p-3 rounded-xl bg-background/50 text-center">
                <p className="text-lg font-bold">{schedules.length}</p>
                <p className="text-xs text-muted-foreground">Jadwal Aktif</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isEnabled && (
        <>
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={mealtimeActive ? "destructive" : "outline"}
              className="h-auto py-4 flex-col gap-2"
              onClick={handleMealtime}
            >
              <Utensils className="w-6 h-6" />
              <span className="text-xs">
                {mealtimeActive ? `Makan (${mealtimeRemaining}m)` : "Waktu Makan"}
              </span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex-col gap-2"
              onClick={() => {
                profiles.forEach(p => {
                  if (!p.isPaused) handlePauseProfile(p.id);
                });
              }}
            >
              <BookOpen className="w-6 h-6" />
              <span className="text-xs">Waktu Belajar</span>
            </Button>
          </div>

          <Tabs defaultValue="profiles" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="profiles" className="text-xs">
                <Baby className="w-4 h-4 mr-1" />
                Profil
              </TabsTrigger>
              <TabsTrigger value="schedules" className="text-xs">
                <Calendar className="w-4 h-4 mr-1" />
                Jadwal
              </TabsTrigger>
              <TabsTrigger value="categories" className="text-xs">
                <Shield className="w-4 h-4 mr-1" />
                Filter
              </TabsTrigger>
            </TabsList>

            {/* Profiles Tab */}
            <TabsContent value="profiles" className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Profil Anak</h4>
                <Dialog open={showAddProfile} onOpenChange={setShowAddProfile}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Tambah
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tambah Profil Anak</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Avatar</Label>
                        <div className="flex gap-2 flex-wrap">
                          {avatars.map((av) => (
                            <button
                              key={av}
                              onClick={() => setNewProfile({ ...newProfile, avatar: av })}
                              className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all ${
                                newProfile.avatar === av 
                                  ? "bg-primary/20 ring-2 ring-primary" 
                                  : "bg-muted hover:bg-muted/80"
                              }`}
                            >
                              {av}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Nama</Label>
                        <Input
                          placeholder="Nama anak"
                          value={newProfile.name}
                          onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Batas Harian: {newProfile.dailyLimit} menit</Label>
                        <Slider
                          value={[newProfile.dailyLimit]}
                          onValueChange={(v) => setNewProfile({ ...newProfile, dailyLimit: v[0] })}
                          min={30}
                          max={300}
                          step={15}
                        />
                      </div>
                      <Button onClick={handleAddProfile} className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Profil
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-3">
                {profiles.map((profile) => {
                  const usagePercent = getUsagePercentage(profile.usedToday, profile.dailyLimit);
                  return (
                    <Card key={profile.id} className={`glass-card border-0 ${profile.isPaused ? "opacity-60" : ""}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-3xl">
                            {profile.avatar}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold">{profile.name}</h4>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handlePauseProfile(profile.id)}
                                >
                                  {profile.isPaused ? (
                                    <Play className="w-4 h-4 text-green-400" />
                                  ) : (
                                    <Pause className="w-4 h-4 text-yellow-400" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
                                  onClick={() => handleDeleteProfile(profile.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            {/* Usage Bar */}
                            <div className="mt-2">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-muted-foreground">Penggunaan hari ini</span>
                                <span className={getUsageColor(usagePercent)}>
                                  {profile.usedToday}/{profile.dailyLimit} menit
                                </span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className={`h-full transition-all ${
                                    usagePercent >= 90 ? "bg-destructive" :
                                    usagePercent >= 70 ? "bg-yellow-400" : "bg-green-400"
                                  }`}
                                  style={{ width: `${Math.min(usagePercent, 100)}%` }}
                                />
                              </div>
                            </div>

                            {/* Info */}
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Moon className="w-3 h-3" />
                                {profile.bedtime}
                              </div>
                              <div className="flex items-center gap-1">
                                <Smartphone className="w-3 h-3" />
                                {profile.devices.length} perangkat
                              </div>
                              {profile.isPaused && (
                                <Badge variant="secondary" className="text-xs">Dijeda</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Schedules Tab */}
            <TabsContent value="schedules" className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Jadwal Internet</h4>
                <Button size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Tambah
                </Button>
              </div>

              <div className="space-y-3">
                {schedules.map((schedule) => (
                  <Card key={schedule.id} className="glass-card border-0">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{schedule.name}</h4>
                            <Badge variant={schedule.action === "block" ? "destructive" : "default"}>
                              {schedule.action === "block" ? "Blokir" : "Izinkan"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {schedule.startTime} - {schedule.endTime}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {schedule.days.map((day) => (
                              <Badge key={day} variant="outline" className="text-xs">
                                {day.slice(0, 3)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDeleteSchedule(schedule.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Categories Tab */}
            <TabsContent value="categories" className="space-y-4">
              <h4 className="font-semibold">Filter Kategori Konten</h4>
              <p className="text-sm text-muted-foreground">
                Blokir akses ke kategori konten tertentu untuk semua profil anak
              </p>

              <div className="space-y-3">
                {categories.map((cat) => (
                  <div 
                    key={cat.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-background/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                        <cat.icon className="w-5 h-5" />
                      </div>
                      <span className="font-medium">{cat.label}</span>
                    </div>
                    <Switch defaultChecked={cat.id === "adult"} />
                  </div>
                ))}
              </div>

              <Card className="glass-card border-0 bg-yellow-500/10 border-yellow-500/20">
                <CardContent className="p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Tips Keamanan</p>
                    <p className="text-xs text-muted-foreground">
                      Selalu diskusikan dengan anak tentang penggunaan internet yang sehat dan bertanggung jawab.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default EnhancedParentalControl;
