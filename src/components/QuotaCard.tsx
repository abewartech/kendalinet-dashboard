import { Database, RefreshCw } from "lucide-react";

interface QuotaCardProps {
  usedGB: number;
  totalGB: number;
  lastUpdate: string;
}

const QuotaCard = ({ usedGB, totalGB, lastUpdate }: QuotaCardProps) => {
  const formatValue = (gb: number) => {
    if (Math.abs(gb) >= 1024) {
      return { value: (gb / 1024).toFixed(2), unit: "TB" };
    }
    return { value: gb.toFixed(1), unit: "GB" };
  };

  const percentage = Math.min((usedGB / totalGB) * 100, 100);
  const rawPercentage = (usedGB / totalGB) * 100;
  const remainingGB = totalGB - usedGB;

  const displayRemaining = formatValue(remainingGB);
  const displayTotal = formatValue(totalGB);
  const displayUsed = formatValue(usedGB);

  return (
    <div className="glass-card p-5 slide-up" style={{ animationDelay: "0.2s" }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Database className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm sm:text-base text-foreground">Kuota Internet</h3>
            <p className="text-[10px] sm:text-xs text-muted-foreground opacity-70">Paket Bulanan</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-muted-foreground bg-secondary/30 px-2 py-1 rounded-md shrink-0">
          <RefreshCw className="w-3 h-3 animate-spin-slow" />
          <span>{lastUpdate}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1 mb-4">
        <div className="flex items-baseline gap-1 min-w-0 overflow-hidden">
          <span className={`font-bold gradient-text tracking-tighter transition-all duration-300 ${displayRemaining.value.length > 5 ? 'text-2xl sm:text-4xl' : 'text-3xl sm:text-5xl'
            }`}>
            {displayRemaining.value}
          </span>
          <span className="text-sm sm:text-lg font-medium text-muted-foreground">
            {displayRemaining.unit}
          </span>
        </div>
        <div className="text-[11px] sm:text-sm text-muted-foreground/80 shrink-0">
          {remainingGB < 0 ? (
            <span className="text-destructive font-medium">Melebihi Kapasitas</span>
          ) : (
            <>Tersisa dari <span className="font-medium text-foreground/80">{displayTotal.value} {displayTotal.unit}</span></>
          )}
        </div>
      </div>

      <div className="relative h-2.5 bg-secondary/50 rounded-full overflow-hidden mb-3">
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out z-10 ${rawPercentage > 90 ? 'bg-destructive' : 'progress-bar'
            }`}
          style={{ width: `${percentage}%` }}
        />
        <div
          className={`absolute inset-y-0 left-0 rounded-full blur-sm opacity-40 transition-all duration-1000 ease-out ${rawPercentage > 90 ? 'bg-destructive' : 'progress-bar'
            }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span>Terpakai: <span className="text-foreground/70 font-medium">{displayUsed.value} {displayUsed.unit}</span></span>
        </div>
        <div className="font-semibold text-primary/90">
          {rawPercentage.toFixed(0)}% digunakan
        </div>
      </div>
    </div>
  );
};

export default QuotaCard;
