import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Wifi, Printer, Share2, Copy, CheckCircle, Download, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface WiFiQRCodeProps {
  ssid: string;
  password: string;
  hidden?: boolean;
}

export const WiFiQRCode = ({ ssid, password, hidden = false }: WiFiQRCodeProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // Generate WiFi QR code string (standard format)
  const wifiString = `WIFI:T:WPA;S:${ssid};P:${password};H:${hidden ? 'true' : 'false'};;`;

  const handleCopyPassword = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      toast({
        title: "Berhasil!",
        description: "Password WiFi disalin ke clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Gagal",
        description: "Tidak dapat menyalin password.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `WiFi: ${ssid}`,
      text: `Nama WiFi: ${ssid}\nPassword: ${password}\n\nScan QR Code untuk terhubung otomatis!`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast({
          title: "Berhasil!",
          description: "Info WiFi dibagikan.",
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          toast({
            title: "Gagal",
            description: "Tidak dapat membagikan info WiFi.",
            variant: "destructive",
          });
        }
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareData.text);
        toast({
          title: "Berhasil!",
          description: "Info WiFi disalin ke clipboard untuk dibagikan.",
        });
      } catch {
        toast({
          title: "Tidak Didukung",
          description: "Fitur share tidak tersedia di browser ini.",
          variant: "destructive",
        });
      }
    }
  };

  const handlePrint = () => {
    setShowPrintDialog(true);
  };

  const executePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Gagal",
        description: "Tidak dapat membuka jendela print. Periksa popup blocker.",
        variant: "destructive",
      });
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>WiFi QR Code - ${ssid}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background: #f5f5f5;
              padding: 20px;
            }
            .card {
              background: white;
              border-radius: 20px;
              padding: 40px;
              text-align: center;
              box-shadow: 0 4px 20px rgba(0,0,0,0.1);
              max-width: 400px;
              width: 100%;
            }
            .wifi-icon {
              width: 48px;
              height: 48px;
              margin: 0 auto 16px;
              color: #3b82f6;
            }
            h1 {
              font-size: 24px;
              color: #1f2937;
              margin-bottom: 8px;
            }
            .subtitle {
              color: #6b7280;
              font-size: 14px;
              margin-bottom: 24px;
            }
            .qr-container {
              background: white;
              padding: 20px;
              border-radius: 16px;
              display: inline-block;
              margin-bottom: 24px;
              border: 2px solid #e5e7eb;
            }
            .info-box {
              background: #f3f4f6;
              border-radius: 12px;
              padding: 16px;
              text-align: left;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px solid #e5e7eb;
            }
            .info-row:last-child {
              border-bottom: none;
            }
            .info-label {
              color: #6b7280;
              font-size: 14px;
            }
            .info-value {
              color: #1f2937;
              font-weight: 600;
              font-size: 14px;
            }
            .footer {
              margin-top: 24px;
              color: #9ca3af;
              font-size: 12px;
            }
            @media print {
              body { background: white; }
              .card { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="card">
            <svg class="wifi-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12.55a11 11 0 0 1 14.08 0" stroke-linecap="round"/>
              <path d="M1.42 9a16 16 0 0 1 21.16 0" stroke-linecap="round"/>
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0" stroke-linecap="round"/>
              <circle cx="12" cy="20" r="1"/>
            </svg>
            <h1>${ssid}</h1>
            <p class="subtitle">Scan QR Code untuk terhubung ke WiFi</p>
            <div class="qr-container">
              ${printContent.querySelector('svg')?.outerHTML || ''}
            </div>
            <div class="info-box">
              <div class="info-row">
                <span class="info-label">Nama WiFi</span>
                <span class="info-value">${ssid}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Password</span>
                <span class="info-value">${password}</span>
              </div>
            </div>
            <p class="footer">Dibuat dengan KendaliNet</p>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);

    setShowPrintDialog(false);
    toast({
      title: "Berhasil!",
      description: "QR Code siap dicetak.",
    });
  };

  const handleDownload = () => {
    const svg = printRef.current?.querySelector('svg');
    if (!svg) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    
    img.onload = () => {
      canvas.width = 300;
      canvas.height = 300;
      ctx?.drawImage(img, 0, 0, 300, 300);
      
      const link = document.createElement('a');
      link.download = `wifi-qr-${ssid}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast({
        title: "Berhasil!",
        description: "QR Code berhasil diunduh.",
      });
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  if (!ssid || !password) {
    return (
      <div className="glass-card p-5 fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center">
            <Wifi className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">QR Code WiFi</h3>
            <p className="text-xs text-muted-foreground">Data WiFi tidak tersedia</p>
          </div>
        </div>
        <div className="text-center py-8 text-muted-foreground text-sm">
          Pastikan router terhubung untuk membuat QR Code
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* QR Code Card */}
      <div className="glass-card p-5 fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Wifi className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">QR Code WiFi</h3>
            <p className="text-xs text-muted-foreground">Scan untuk terhubung otomatis</p>
          </div>
        </div>

        {/* QR Code Display */}
        <div className="flex justify-center mb-6" ref={printRef}>
          <div className="bg-white p-4 rounded-2xl shadow-lg">
            <QRCodeSVG
              value={wifiString}
              size={180}
              level="H"
              includeMargin={false}
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>
        </div>

        {/* WiFi Info */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
            <span className="text-sm text-muted-foreground">Nama WiFi</span>
            <span className="font-medium text-foreground">{ssid}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
            <span className="text-sm text-muted-foreground">Password</span>
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground font-mono">
                {showPassword ? password : '•'.repeat(Math.min(password.length, 12))}
              </span>
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 hover:bg-secondary rounded-lg transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Eye className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              <button
                onClick={handleCopyPassword}
                className="p-1 hover:bg-secondary rounded-lg transition-colors"
              >
                {copied ? (
                  <CheckCircle className="w-4 h-4 text-success" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={handleShare}
            className="flex flex-col items-center gap-2 p-3 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors"
          >
            <Share2 className="w-5 h-5 text-primary" />
            <span className="text-xs font-medium text-primary">Bagikan</span>
          </button>
          
          <button
            onClick={handlePrint}
            className="flex flex-col items-center gap-2 p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <Printer className="w-5 h-5 text-foreground" />
            <span className="text-xs font-medium text-foreground">Cetak</span>
          </button>
          
          <button
            onClick={handleDownload}
            className="flex flex-col items-center gap-2 p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <Download className="w-5 h-5 text-foreground" />
            <span className="text-xs font-medium text-foreground">Unduh</span>
          </button>
        </div>
      </div>

      {/* Print Confirmation Dialog */}
      <Dialog open={showPrintDialog} onOpenChange={setShowPrintDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cetak QR Code WiFi</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              QR Code akan dicetak dengan informasi WiFi lengkap termasuk password. 
              Pastikan hanya orang yang dipercaya yang dapat melihatnya.
            </p>
            <div className="p-4 rounded-xl bg-secondary/50 text-center">
              <div className="bg-white p-3 rounded-xl inline-block mb-3">
                <QRCodeSVG
                  value={wifiString}
                  size={120}
                  level="H"
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
              </div>
              <p className="font-medium text-foreground">{ssid}</p>
              <p className="text-xs text-muted-foreground">Password: {password}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPrintDialog(false)}
                className="flex-1 py-3 rounded-xl bg-secondary hover:bg-secondary/80 font-medium transition-colors"
              >
                Batal
              </button>
              <button
                onClick={executePrint}
                className="flex-1 py-3 rounded-xl btn-primary-gradient font-medium flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Cetak
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Instructions Card */}
      <div className="glass-card p-5 fade-in" style={{ animationDelay: "0.1s" }}>
        <h4 className="font-medium text-foreground mb-3">Cara Menggunakan</h4>
        <ol className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0">1</span>
            <span>Buka kamera HP atau aplikasi QR scanner</span>
          </li>
          <li className="flex gap-2">
            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0">2</span>
            <span>Arahkan kamera ke QR Code di atas</span>
          </li>
          <li className="flex gap-2">
            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0">3</span>
            <span>Ketuk notifikasi untuk terhubung otomatis</span>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default WiFiQRCode;
