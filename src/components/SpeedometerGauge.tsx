import { useEffect, useState } from "react";

interface SpeedometerGaugeProps {
  value: number;
  maxValue: number;
  label: string;
  unit: string;
}

const SpeedometerGauge = ({ value, maxValue, label, unit }: SpeedometerGaugeProps) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const percentage = (animatedValue / maxValue) * 100;
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (percentage / 100) * circumference * 0.75;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="relative flex flex-col items-center">
      <svg className="w-40 h-40 -rotate-[135deg]" viewBox="0 0 160 160">
        {/* Background arc */}
        <circle
          cx="80"
          cy="80"
          r="70"
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.25}
          className="opacity-30"
        />
        {/* Progress arc */}
        <circle
          cx="80"
          cy="80"
          r="70"
          fill="none"
          stroke="url(#speedGradient)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
          style={{ filter: "drop-shadow(0 0 8px hsl(187 92% 50% / 0.5))" }}
        />
        <defs>
          <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(187, 92%, 50%)" />
            <stop offset="100%" stopColor="hsl(200, 92%, 40%)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
        <span className="text-3xl font-bold text-foreground transition-all duration-500">
          {animatedValue.toFixed(1)}
        </span>
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>
      <span className="mt-2 text-sm font-medium text-muted-foreground">{label}</span>
    </div>
  );
};

export default SpeedometerGauge;
