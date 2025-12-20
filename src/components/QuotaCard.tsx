import { Database, RefreshCw } from "lucide-react";

interface QuotaCardProps {
  usedGB: number;
  totalGB: number;
  lastUpdate: string;
}

const QuotaCard = ({ usedGB, totalGB, lastUpdate }: QuotaCardProps) => {
  const percentage = (usedGB / totalGB) * 100;
  const remainingGB = totalGB - usedGB;

  return (
    <div className="glass-card p-5 slide-up" style={{ animationDelay: "0.2s" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Database className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Kuota Internet</h3>
            <p className="text-xs text-muted-foreground">Paket Bulanan</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <RefreshCw className="w-3 h-3" />
          <span>{lastUpdate}</span>
        </div>
      </div>

      <div className="flex items-end justify-between mb-3">
        <div>
          <span className="text-4xl font-bold gradient-text">{remainingGB.toFixed(1)}</span>
          <span className="text-lg text-muted-foreground ml-1">GB</span>
        </div>
        <span className="text-sm text-muted-foreground">
          Tersisa dari {totalGB} GB
        </span>
      </div>

      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 progress-bar rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        />
        <div
          className="absolute inset-y-0 left-0 progress-bar rounded-full blur-sm opacity-50 transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span>Terpakai: {usedGB.toFixed(1)} GB</span>
        <span>{percentage.toFixed(0)}% digunakan</span>
      </div>
    </div>
  );
};

export default QuotaCard;
