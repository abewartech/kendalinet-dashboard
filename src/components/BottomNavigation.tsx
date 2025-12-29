import { Home, Smartphone, Wifi, Settings, Shield, Clock, Sparkles, Receipt } from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "beranda", label: "Beranda", icon: Home },
  { id: "perangkat", label: "Perangkat", icon: Smartphone },
  { id: "keamanan", label: "Keamanan", icon: Shield },
  { id: "jadwal", label: "Jadwal", icon: Clock },
  { id: "optimasi", label: "Optimasi", icon: Sparkles },
  { id: "tagihan", label: "Tagihan", icon: Receipt },
  { id: "wifi", label: "WiFi", icon: Wifi },
  { id: "admin", label: "Admin", icon: Settings },
];

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-card rounded-t-3xl border-t border-x-0 border-b-0 pb-safe z-50">
      {/* Safe area for iPhone notch */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex items-center justify-start sm:justify-around gap-1 px-2 py-2 min-w-max sm:min-w-0 max-w-4xl mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center gap-0.5 sm:gap-1 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl transition-all duration-300 flex-shrink-0 min-w-[60px] sm:min-w-[70px] ${isActive
                    ? "nav-active"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <Icon
                  className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 ${isActive ? "scale-110" : ""
                    }`}
                />
                <span className="text-[10px] sm:text-xs font-medium whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
