import { useState, useEffect, useCallback } from "react";
import { Play, Loader2, Wifi, ArrowDown, ArrowUp, Clock, RotateCcw, Share2, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

interface SpeedTestResult {
  ping: number;
  download: number;
  upload: number;
  timestamp: string;
  server: string;
}

type TestPhase = "idle" | "ping" | "download" | "upload" | "complete";

export const SpeedTest = () => {
  const [phase, setPhase] = useState<TestPhase>("idle");
  const [progress, setProgress] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [results, setResults] = useState<SpeedTestResult | null>(null);
  const [history, setHistory] = useState<SpeedTestResult[]>([]);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("kendalinet_speedtest_history");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const saveResult = (result: SpeedTestResult) => {
    const newHistory = [result, ...history].slice(0, 10); // Keep last 10 results
    setHistory(newHistory);
    localStorage.setItem("kendalinet_speedtest_history", JSON.stringify(newHistory));
  };

  const simulateSpeedTest = useCallback(async () => {
    setPhase("ping");
    setProgress(0);
    setResults(null);

    // Simulate ping test
    const pingResult = await new Promise<number>((resolve) => {
      let p = 0;
      const interval = setInterval(() => {
        p += 10;
        setProgress(p);
        if (p >= 100) {
          clearInterval(interval);
          resolve(Math.floor(Math.random() * 20) + 5); // 5-25ms
        }
      }, 100);
    });

    // Simulate download test
    setPhase("download");
    setProgress(0);
    const downloadResult = await new Promise<number>((resolve) => {
      let p = 0;
      const targetSpeed = Math.random() * 80 + 20; // 20-100 Mbps
      const interval = setInterval(() => {
        p += 2;
        setProgress(p);
        // Simulate fluctuating speed
        const fluctuation = (Math.random() - 0.5) * 20;
        setCurrentSpeed(Math.max(0, targetSpeed + fluctuation * (1 - p / 100)));
        if (p >= 100) {
          clearInterval(interval);
          resolve(parseFloat(targetSpeed.toFixed(2)));
        }
      }, 80);
    });

    // Simulate upload test
    setPhase("upload");
    setProgress(0);
    const uploadResult = await new Promise<number>((resolve) => {
      let p = 0;
      const targetSpeed = Math.random() * 30 + 10; // 10-40 Mbps
      const interval = setInterval(() => {
        p += 2;
        setProgress(p);
        const fluctuation = (Math.random() - 0.5) * 10;
        setCurrentSpeed(Math.max(0, targetSpeed + fluctuation * (1 - p / 100)));
        if (p >= 100) {
          clearInterval(interval);
          resolve(parseFloat(targetSpeed.toFixed(2)));
        }
      }, 80);
    });

    // Complete
    const result: SpeedTestResult = {
      ping: pingResult,
      download: downloadResult,
      upload: uploadResult,
      timestamp: new Date().toISOString(),
      server: "Jakarta, Indonesia",
    };

    setResults(result);
    setPhase("complete");
    setCurrentSpeed(0);
    saveResult(result);

    toast({
      title: "Speed Test Selesai",
      description: `Download: ${downloadResult} Mbps | Upload: ${uploadResult} Mbps`,
    });
  }, [history]);

  const handleShare = () => {
    if (!results) return;
    const text = `🚀 Speed Test KendaliNet\n\n📶 Ping: ${results.ping}ms\n⬇️ Download: ${results.download} Mbps\n⬆️ Upload: ${results.upload} Mbps\n📍 Server: ${results.server}\n\nTested via KendaliNet Dashboard`;
    
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      toast({
        title: "Disalin ke Clipboard",
        description: "Hasil speed test siap dibagikan.",
      });
    }
  };

  const getPhaseLabel = () => {
    switch (phase) {
      case "ping": return "Mengukur Ping...";
      case "download": return "Mengukur Download...";
      case "upload": return "Mengukur Upload...";
      case "complete": return "Selesai!";
      default: return "Siap untuk Test";
    }
  };

  const getSpeedRating = (speed: number) => {
    if (speed >= 100) return { label: "Sangat Cepat", color: "text-success" };
    if (speed >= 50) return { label: "Cepat", color: "text-primary" };
    if (speed >= 20) return { label: "Cukup", color: "text-yellow-500" };
    return { label: "Lambat", color: "text-destructive" };
  };

  return (
    <div className="space-y-4">
      {/* Main Speed Test Card */}
      <Card className="glass-card border-border/30 overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Wifi className="w-5 h-5 text-primary" />
            Speed Test
          </CardTitle>
          <CardDescription>
            Ukur kecepatan internet Anda secara real-time
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Speedometer Display */}
          <div className="relative flex flex-col items-center justify-center py-8">
            {/* Circular Progress Background */}
            <div className="relative w-48 h-48">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-secondary"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={264}
                  strokeDashoffset={264 - (264 * progress) / 100}
                  className={`transition-all duration-300 ${
                    phase === "ping" ? "text-yellow-500" :
                    phase === "download" ? "text-success" :
                    phase === "upload" ? "text-primary" :
                    phase === "complete" ? "text-success" : "text-muted-foreground"
                  }`}
                />
              </svg>
              
              {/* Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {phase === "idle" ? (
                  <Button
                    size="lg"
                    onClick={simulateSpeedTest}
                    className="rounded-full w-24 h-24 text-lg font-bold shadow-lg hover:shadow-xl transition-all"
                  >
                    <Play className="w-8 h-8" />
                  </Button>
                ) : phase === "complete" ? (
                  <div className="text-center">
                    <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Selesai</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-3xl font-bold text-foreground">
                      {phase === "ping" ? `${Math.floor(progress / 10)}ms` : `${currentSpeed.toFixed(1)}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {phase === "ping" ? "Ping" : "Mbps"}
                    </p>
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mt-2 text-primary" />
                  </div>
                )}
              </div>
            </div>

            {/* Phase Label */}
            <p className="mt-4 text-sm font-medium text-muted-foreground">
              {getPhaseLabel()}
            </p>

            {/* Progress Bar */}
            {phase !== "idle" && phase !== "complete" && (
              <div className="w-full max-w-xs mt-4">
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </div>

          {/* Results Display */}
          {results && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                {/* Ping */}
                <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-center">
                  <Clock className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-foreground">{results.ping}</p>
                  <p className="text-xs text-muted-foreground">ms Ping</p>
                </div>

                {/* Download */}
                <div className="p-3 rounded-xl bg-success/10 border border-success/20 text-center">
                  <ArrowDown className="w-5 h-5 text-success mx-auto mb-1" />
                  <p className="text-2xl font-bold text-foreground">{results.download}</p>
                  <p className="text-xs text-muted-foreground">Mbps Down</p>
                </div>

                {/* Upload */}
                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-center">
                  <ArrowUp className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-2xl font-bold text-foreground">{results.upload}</p>
                  <p className="text-xs text-muted-foreground">Mbps Up</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/30">
                <div>
                  <p className="text-xs text-muted-foreground">Rating Kecepatan</p>
                  <p className={`font-semibold ${getSpeedRating(results.download).color}`}>
                    {getSpeedRating(results.download).label}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Server</p>
                  <p className="text-sm font-medium">{results.server}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={simulateSpeedTest}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Test Ulang
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Bagikan
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* History Card */}
      {history.length > 0 && (
        <Card className="glass-card border-border/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Riwayat Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg bg-secondary/20 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.timestamp).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-yellow-500">{item.ping}ms</span>
                    <span className="text-success">↓{item.download}</span>
                    <span className="text-primary">↑{item.upload}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
