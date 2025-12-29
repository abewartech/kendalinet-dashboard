import { useState, useEffect } from "react";
import { Globe, Shield, Zap, Server, Check, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";

interface DNSProvider {
  id: string;
  name: string;
  description: string;
  primary: string;
  secondary: string;
  icon: React.ReactNode;
  benefits: string[];
}

const dnsProviders: DNSProvider[] = [
  {
    id: "cloudflare",
    name: "Cloudflare",
    description: "Cepat & privasi terjaga",
    primary: "1.1.1.1",
    secondary: "1.0.0.1",
    icon: <Zap className="w-5 h-5 text-orange-400" />,
    benefits: ["Tercepat di dunia", "Privasi terjamin", "Blokir malware (1.1.1.2)"],
  },
  {
    id: "google",
    name: "Google DNS",
    description: "Stabil & andal",
    primary: "8.8.8.8",
    secondary: "8.8.4.4",
    icon: <Globe className="w-5 h-5 text-blue-400" />,
    benefits: ["Sangat stabil", "Uptime tinggi", "Didukung Google"],
  },
  {
    id: "adguard",
    name: "AdGuard DNS",
    description: "Blokir iklan & tracker",
    primary: "94.140.14.14",
    secondary: "94.140.15.15",
    icon: <Shield className="w-5 h-5 text-green-400" />,
    benefits: ["Blokir iklan", "Anti-tracker", "Aman untuk keluarga"],
  },
  {
    id: "quad9",
    name: "Quad9",
    description: "Keamanan tinggi",
    primary: "9.9.9.9",
    secondary: "149.112.112.112",
    icon: <Shield className="w-5 h-5 text-purple-400" />,
    benefits: ["Blokir malware", "Privasi tinggi", "Non-profit"],
  },
  {
    id: "custom",
    name: "Custom DNS",
    description: "Atur sendiri",
    primary: "",
    secondary: "",
    icon: <Server className="w-5 h-5 text-muted-foreground" />,
    benefits: ["Kustomisasi penuh", "Gunakan DNS lokal"],
  },
];

export const DNSSettings = () => {
  const [selectedProvider, setSelectedProvider] = useState<string>("cloudflare");
  const [customPrimary, setCustomPrimary] = useState("");
  const [customSecondary, setCustomSecondary] = useState("");
  const [currentDNS, setCurrentDNS] = useState({ primary: "1.1.1.1", secondary: "1.0.0.1" });

  useEffect(() => {
    const saved = localStorage.getItem("kendalinet_dns_settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      setSelectedProvider(parsed.provider);
      setCurrentDNS({ primary: parsed.primary, secondary: parsed.secondary });
      if (parsed.provider === "custom") {
        setCustomPrimary(parsed.primary);
        setCustomSecondary(parsed.secondary);
      }
    }
  }, []);

  const handleSave = () => {
    const provider = dnsProviders.find((p) => p.id === selectedProvider);
    const primary = selectedProvider === "custom" ? customPrimary : provider?.primary || "";
    const secondary = selectedProvider === "custom" ? customSecondary : provider?.secondary || "";

    if (!primary) {
      toast({
        title: "DNS Tidak Valid",
        description: "Masukkan alamat DNS primer.",
        variant: "destructive",
      });
      return;
    }

    const settings = {
      provider: selectedProvider,
      primary,
      secondary,
    };

    localStorage.setItem("kendalinet_dns_settings", JSON.stringify(settings));
    setCurrentDNS({ primary, secondary });

    toast({
      title: "DNS Berhasil Disimpan",
      description: `Menggunakan ${provider?.name || "Custom"} DNS (${primary})`,
    });
  };

  const selectedProviderData = dnsProviders.find((p) => p.id === selectedProvider);

  return (
    <div className="space-y-4">
      <Card className="glass-card border-border/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            DNS Custom
          </CardTitle>
          <CardDescription>
            Pilih DNS untuk kecepatan, keamanan, atau blokir iklan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current DNS Display */}
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-xs text-muted-foreground mb-1">DNS Aktif Saat Ini</p>
            <p className="font-mono text-sm text-primary">
              {currentDNS.primary} / {currentDNS.secondary || "-"}
            </p>
          </div>

          {/* DNS Provider Selection */}
          <RadioGroup value={selectedProvider} onValueChange={setSelectedProvider} className="space-y-2">
            {dnsProviders.map((provider) => (
              <div
                key={provider.id}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedProvider === provider.id
                    ? "border-primary bg-primary/5"
                    : "border-border/30 hover:border-border/50"
                }`}
                onClick={() => setSelectedProvider(provider.id)}
              >
                <RadioGroupItem value={provider.id} id={provider.id} className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {provider.icon}
                    <Label htmlFor={provider.id} className="font-semibold cursor-pointer">
                      {provider.name}
                    </Label>
                    {provider.id !== "custom" && (
                      <span className="text-xs text-muted-foreground font-mono">
                        {provider.primary}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{provider.description}</p>
                  {selectedProvider === provider.id && provider.benefits.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {provider.benefits.map((benefit, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {selectedProvider === provider.id && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </div>
            ))}
          </RadioGroup>

          {/* Custom DNS Input */}
          {selectedProvider === "custom" && (
            <div className="space-y-3 p-3 rounded-lg bg-secondary/30 border border-border/30">
              <div className="space-y-2">
                <Label htmlFor="custom-primary" className="text-xs">
                  DNS Primer *
                </Label>
                <Input
                  id="custom-primary"
                  placeholder="contoh: 192.168.1.1"
                  value={customPrimary}
                  onChange={(e) => setCustomPrimary(e.target.value)}
                  className="font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-secondary" className="text-xs">
                  DNS Sekunder (opsional)
                </Label>
                <Input
                  id="custom-secondary"
                  placeholder="contoh: 192.168.1.2"
                  value={customSecondary}
                  onChange={(e) => setCustomSecondary(e.target.value)}
                  className="font-mono text-sm"
                />
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30 border border-border/20">
            <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              DNS yang lebih cepat dapat meningkatkan kecepatan browsing. AdGuard DNS juga dapat memblokir iklan di seluruh jaringan.
            </p>
          </div>

          <Button onClick={handleSave} className="w-full">
            Simpan Pengaturan DNS
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
