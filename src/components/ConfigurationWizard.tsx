import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { 
  Wand2, 
  Wifi, 
  Shield, 
  Users, 
  Clock, 
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Home,
  Building,
  Gamepad2,
  Baby,
  Sparkles
} from "lucide-react";

interface WizardData {
  // Step 1: Basic
  ssid: string;
  password: string;
  showPassword: boolean;
  
  // Step 2: Usage Profile
  usageProfile: "home" | "business" | "gaming" | "family";
  
  // Step 3: Security
  enableFirewall: boolean;
  enableAntiIntruder: boolean;
  enableAutoBlock: boolean;
  
  // Step 4: Parental
  enableParentalControl: boolean;
  bedtime: string;
  bedtimeEnd: string;
  
  // Step 5: Optimization
  enableGameMode: boolean;
  enableBandSteering: boolean;
  enableQoS: boolean;
}

const ConfigurationWizard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [isApplying, setIsApplying] = useState(false);
  const totalSteps = 5;
  
  const [data, setData] = useState<WizardData>({
    ssid: "",
    password: "",
    showPassword: false,
    usageProfile: "home",
    enableFirewall: true,
    enableAntiIntruder: true,
    enableAutoBlock: false,
    enableParentalControl: false,
    bedtime: "21:00",
    bedtimeEnd: "06:00",
    enableGameMode: false,
    enableBandSteering: true,
    enableQoS: true
  });

  const updateData = (updates: Partial<WizardData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep === 1 && (!data.ssid || !data.password)) {
      toast.error("Nama WiFi dan password wajib diisi");
      return;
    }
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const applyConfiguration = () => {
    setIsApplying(true);
    toast.success("Menerapkan konfigurasi...");
    
    setTimeout(() => {
      setIsApplying(false);
      setIsOpen(false);
      toast.success("Konfigurasi berhasil diterapkan! Router akan restart.");
    }, 3000);
  };

  const getProfileIcon = (profile: string) => {
    switch (profile) {
      case "home": return <Home className="w-6 h-6" />;
      case "business": return <Building className="w-6 h-6" />;
      case "gaming": return <Gamepad2 className="w-6 h-6" />;
      case "family": return <Baby className="w-6 h-6" />;
      default: return <Home className="w-6 h-6" />;
    }
  };

  const profiles = [
    { id: "home", label: "Rumah Biasa", desc: "Penggunaan sehari-hari" },
    { id: "business", label: "Bisnis/Kantor", desc: "Prioritas keamanan & stabilitas" },
    { id: "gaming", label: "Gaming", desc: "Prioritas low latency" },
    { id: "family", label: "Keluarga", desc: "Dengan kontrol orangtua" }
  ];

  if (!isOpen) {
    return (
      <Card className="glass-card border-0 cursor-pointer hover:bg-secondary/50 transition-colors" onClick={() => setIsOpen(true)}>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Wand2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold">Wizard Konfigurasi</h3>
              <p className="text-sm text-muted-foreground">Klik untuk menjalankan wizard pengaturan cepat</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Progress Header */}
      <Card className="glass-card border-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Wand2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Wizard Konfigurasi</h3>
              <p className="text-sm text-muted-foreground">Langkah {currentStep} dari {totalSteps}</p>
            </div>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
          
          {/* Step Indicators */}
          <div className="flex justify-between mt-4">
            {[
              { icon: Wifi, label: "WiFi" },
              { icon: Users, label: "Profil" },
              { icon: Shield, label: "Keamanan" },
              { icon: Clock, label: "Jadwal" },
              { icon: Sparkles, label: "Optimasi" }
            ].map((step, index) => (
              <div 
                key={index}
                className={`flex flex-col items-center gap-1 ${
                  currentStep > index + 1 ? "text-primary" : 
                  currentStep === index + 1 ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep > index + 1 ? "bg-primary text-primary-foreground" :
                  currentStep === index + 1 ? "bg-primary/20 text-primary" : "bg-muted"
                }`}>
                  {currentStep > index + 1 ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <step.icon className="w-4 h-4" />
                  )}
                </div>
                <span className="text-[10px]">{step.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card className="glass-card border-0">
        <CardContent className="p-6">
          {/* Step 1: WiFi Settings */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Wifi className="w-12 h-12 mx-auto text-primary mb-2" />
                <h4 className="text-xl font-bold">Pengaturan WiFi</h4>
                <p className="text-sm text-muted-foreground">Atur nama dan password jaringan WiFi Anda</p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Nama WiFi (SSID)</Label>
                  <Input
                    placeholder="Contoh: KendaliNet_Home"
                    value={data.ssid}
                    onChange={(e) => updateData({ ssid: e.target.value })}
                    className="text-lg"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Password WiFi</Label>
                  <div className="relative">
                    <Input
                      type={data.showPassword ? "text" : "password"}
                      placeholder="Minimal 8 karakter"
                      value={data.password}
                      onChange={(e) => updateData({ password: e.target.value })}
                      className="text-lg pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      onClick={() => updateData({ showPassword: !data.showPassword })}
                    >
                      {data.showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Gunakan kombinasi huruf, angka, dan simbol
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Usage Profile */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Users className="w-12 h-12 mx-auto text-primary mb-2" />
                <h4 className="text-xl font-bold">Profil Penggunaan</h4>
                <p className="text-sm text-muted-foreground">Pilih yang paling sesuai dengan kebutuhan Anda</p>
              </div>

              <RadioGroup 
                value={data.usageProfile} 
                onValueChange={(v) => updateData({ usageProfile: v as WizardData["usageProfile"] })}
                className="space-y-3"
              >
                {profiles.map((profile) => (
                  <label
                    key={profile.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      data.usageProfile === profile.id 
                        ? "border-primary bg-primary/10" 
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <RadioGroupItem value={profile.id} className="sr-only" />
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      data.usageProfile === profile.id ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}>
                      {getProfileIcon(profile.id)}
                    </div>
                    <div>
                      <p className="font-semibold">{profile.label}</p>
                      <p className="text-sm text-muted-foreground">{profile.desc}</p>
                    </div>
                    {data.usageProfile === profile.id && (
                      <CheckCircle2 className="w-6 h-6 text-primary ml-auto" />
                    )}
                  </label>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Step 3: Security */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Shield className="w-12 h-12 mx-auto text-primary mb-2" />
                <h4 className="text-xl font-bold">Keamanan Jaringan</h4>
                <p className="text-sm text-muted-foreground">Lindungi jaringan dari ancaman</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-background/50">
                  <div>
                    <p className="font-medium">Firewall</p>
                    <p className="text-sm text-muted-foreground">Blokir akses tidak sah</p>
                  </div>
                  <Switch 
                    checked={data.enableFirewall}
                    onCheckedChange={(v) => updateData({ enableFirewall: v })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-background/50">
                  <div>
                    <p className="font-medium">Anti-Maling WiFi</p>
                    <p className="text-sm text-muted-foreground">Notifikasi perangkat baru</p>
                  </div>
                  <Switch 
                    checked={data.enableAntiIntruder}
                    onCheckedChange={(v) => updateData({ enableAntiIntruder: v })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-background/50">
                  <div>
                    <p className="font-medium">Auto-Block Intruder</p>
                    <p className="text-sm text-muted-foreground">Otomatis blokir perangkat tak dikenal</p>
                  </div>
                  <Switch 
                    checked={data.enableAutoBlock}
                    onCheckedChange={(v) => updateData({ enableAutoBlock: v })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Parental Control */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Clock className="w-12 h-12 mx-auto text-primary mb-2" />
                <h4 className="text-xl font-bold">Kontrol Orangtua</h4>
                <p className="text-sm text-muted-foreground">Atur jadwal internet untuk keluarga</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-background/50">
                  <div>
                    <p className="font-medium">Aktifkan Kontrol Orangtua</p>
                    <p className="text-sm text-muted-foreground">Batasi internet berdasarkan waktu</p>
                  </div>
                  <Switch 
                    checked={data.enableParentalControl}
                    onCheckedChange={(v) => updateData({ enableParentalControl: v })}
                  />
                </div>

                {data.enableParentalControl && (
                  <div className="p-4 rounded-xl bg-primary/5 space-y-4">
                    <p className="font-medium">Jadwal Tidur (Internet Mati)</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs">Mulai</Label>
                        <Input
                          type="time"
                          value={data.bedtime}
                          onChange={(e) => updateData({ bedtime: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Selesai</Label>
                        <Input
                          type="time"
                          value={data.bedtimeEnd}
                          onChange={(e) => updateData({ bedtimeEnd: e.target.value })}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Internet akan dimatikan otomatis pada jam tidur
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Optimization */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Sparkles className="w-12 h-12 mx-auto text-primary mb-2" />
                <h4 className="text-xl font-bold">Optimasi Jaringan</h4>
                <p className="text-sm text-muted-foreground">Tingkatkan performa jaringan Anda</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-background/50">
                  <div>
                    <p className="font-medium">Game Mode</p>
                    <p className="text-sm text-muted-foreground">Prioritas untuk gaming</p>
                  </div>
                  <Switch 
                    checked={data.enableGameMode}
                    onCheckedChange={(v) => updateData({ enableGameMode: v })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-background/50">
                  <div>
                    <p className="font-medium">Band Steering</p>
                    <p className="text-sm text-muted-foreground">Otomatis pilih band terbaik</p>
                  </div>
                  <Switch 
                    checked={data.enableBandSteering}
                    onCheckedChange={(v) => updateData({ enableBandSteering: v })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-background/50">
                  <div>
                    <p className="font-medium">Smart QoS</p>
                    <p className="text-sm text-muted-foreground">Prioritas traffic otomatis</p>
                  </div>
                  <Switch 
                    checked={data.enableQoS}
                    onCheckedChange={(v) => updateData({ enableQoS: v })}
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                <h5 className="font-semibold mb-2">Ringkasan Konfigurasi</h5>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• WiFi: <span className="text-foreground">{data.ssid || "(belum diisi)"}</span></li>
                  <li>• Profil: <span className="text-foreground">{profiles.find(p => p.id === data.usageProfile)?.label}</span></li>
                  <li>• Firewall: <span className="text-foreground">{data.enableFirewall ? "Aktif" : "Nonaktif"}</span></li>
                  <li>• Parental Control: <span className="text-foreground">{data.enableParentalControl ? "Aktif" : "Nonaktif"}</span></li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        {currentStep > 1 && (
          <Button variant="outline" onClick={prevStep} className="flex-1">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        )}
        
        {currentStep < totalSteps ? (
          <Button onClick={nextStep} className="flex-1">
            Lanjut
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button 
            onClick={applyConfiguration} 
            className="flex-1"
            disabled={isApplying}
          >
            {isApplying ? (
              <>Menerapkan...</>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Terapkan Konfigurasi
              </>
            )}
          </Button>
        )}
      </div>

      {/* Skip Button */}
      <Button 
        variant="ghost" 
        className="w-full text-muted-foreground"
        onClick={() => setIsOpen(false)}
      >
        Lewati Wizard
      </Button>
    </div>
  );
};

export default ConfigurationWizard;
