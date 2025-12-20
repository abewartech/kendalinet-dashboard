import { Home, Smartphone, Wifi, Settings, Shield } from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "beranda", label: "Beranda", icon: Home },
  { id: "perangkat", label: "Perangkat", icon: Smartphone },
  { id: "keamanan", label: "Keamanan", icon: Shield },
  { id: "wifi", label: "WiFi", icon: Wifi },
  { id: "admin", label: "Admin", icon: Settings },
];

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-card rounded-t-3xl border-t border-x-0 border-b-0 px-2 pb-2 pt-2 z-50">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300 ${
                isActive
                  ? "nav-active"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon
                className={`w-6 h-6 transition-transform duration-300 ${
                  isActive ? "scale-110" : ""
                }`}
              />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
