import { Home, Smartphone, Wifi, Settings, Shield, Clock, Sparkles, Receipt, Gauge, Ticket, QrCode, Globe, Users, Activity, Zap, UserPlus } from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "beranda", label: "Beranda", icon: Home },
  { id: "speedtest", label: "Speed Test", icon: Zap },
  { id: "perangkat", label: "Perangkat", icon: Smartphone },
  { id: "grupdevice", label: "Grup", icon: Users },
  { id: "monitor", label: "Monitor", icon: Activity },
  { id: "keamanan", label: "Keamanan", icon: Shield },
  { id: "jadwal", label: "Jadwal", icon: Clock },
  { id: "bandwidth", label: "Bandwidth", icon: Gauge },
  { id: "voucher", label: "Voucher", icon: Ticket },
  { id: "dns", label: "DNS", icon: Globe },
  { id: "optimasi", label: "Optimasi", icon: Sparkles },
  { id: "tagihan", label: "Tagihan", icon: Receipt },
  { id: "wifi", label: "WiFi", icon: Wifi },
  { id: "guestwifi", label: "Guest", icon: UserPlus },
  { id: "qrcode", label: "QR Code", icon: QrCode },
  { id: "admin", label: "Admin", icon: Settings },
];

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-card rounded-t-3xl border-t border-x-0 border-b-0 pb-safe z-50">
      <div className="relative group">
        {/* Scroll indicator gradient - Left */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background/40 to-transparent z-10 pointer-events-none sm:hidden" />

        <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory">
          <div className="flex items-center justify-start sm:justify-around gap-1 px-4 py-2 min-w-max sm:min-w-0 max-w-4xl mx-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => onTabChange(item.id)}
                  className={`flex flex-col items-center gap-0.5 sm:gap-1 px-3 py-1.5 rounded-xl transition-all duration-300 flex-shrink-0 min-w-[72px] snap-center ${isActive
                      ? "nav-active scale-105"
                      : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <Icon
                    className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ${isActive ? "text-primary stroke-[2.5px]" : "stroke-[1.5px]"
                      }`}
                  />
                  <span className={`text-[10px] sm:text-xs font-semibold whitespace-nowrap transition-all duration-300 ${isActive ? "text-primary" : ""
                    }`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scroll indicator gradient - Right */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background/40 to-transparent z-10 pointer-events-none sm:hidden" />
      </div>
    </nav>
  );
};

export default BottomNavigation;
