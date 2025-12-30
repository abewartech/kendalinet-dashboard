import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Ticket, Copy, Trash2, Plus, Clock, Wifi, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface Voucher {
  id: string;
  code: string;
  duration: number; // in hours
  quota: number; // in GB
  speedLimit: number; // in Mbps
  status: 'active' | 'used' | 'expired';
  createdAt: Date;
  usedAt?: Date;
  usedBy?: string;
}

const STORAGE_KEY = 'kendali-net-vouchers';

const generateVoucherCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    if (i === 4) code += '-';
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const VoucherSystem = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [duration, setDuration] = useState('24');
  const [quota, setQuota] = useState('5');
  const [speedLimit, setSpeedLimit] = useState('10');
  const [quantity, setQuantity] = useState('1');

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setVouchers(parsed.map((v: Voucher) => ({
        ...v,
        createdAt: new Date(v.createdAt),
        usedAt: v.usedAt ? new Date(v.usedAt) : undefined
      })));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vouchers));
  }, [vouchers]);

  const handleCreateVouchers = () => {
    const qty = parseInt(quantity);
    const newVouchers: Voucher[] = [];

    for (let i = 0; i < qty; i++) {
      newVouchers.push({
        id: crypto.randomUUID(),
        code: generateVoucherCode(),
        duration: parseInt(duration),
        quota: parseInt(quota),
        speedLimit: parseInt(speedLimit),
        status: 'active',
        createdAt: new Date()
      });
    }

    setVouchers(prev => [...newVouchers, ...prev]);
    toast.success(`${qty} voucher berhasil dibuat`);
    setShowCreate(false);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Kode disalin!');
  };

  const handleDeleteVoucher = (id: string) => {
    setVouchers(prev => prev.filter(v => v.id !== id));
    toast.success('Voucher dihapus');
  };

  const handleMarkAsUsed = (id: string) => {
    setVouchers(prev => prev.map(v =>
      v.id === id ? { ...v, status: 'used' as const, usedAt: new Date() } : v
    ));
    toast.success('Voucher ditandai terpakai');
  };

  const activeVouchers = vouchers.filter(v => v.status === 'active');
  const usedVouchers = vouchers.filter(v => v.status === 'used' || v.status === 'expired');

  return (
    <div className="space-y-4">
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Ticket className="w-5 h-5 text-primary" />
              Voucher WiFi
            </CardTitle>
            <Button
              size="sm"
              onClick={() => setShowCreate(!showCreate)}
              variant={showCreate ? "secondary" : "default"}
            >
              <Plus className="w-4 h-4 mr-1" />
              Buat Voucher
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Create Form */}
          {showCreate && (
            <div className="p-4 rounded-lg border border-primary/30 bg-primary/5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Durasi</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Jam</SelectItem>
                      <SelectItem value="3">3 Jam</SelectItem>
                      <SelectItem value="6">6 Jam</SelectItem>
                      <SelectItem value="12">12 Jam</SelectItem>
                      <SelectItem value="24">1 Hari</SelectItem>
                      <SelectItem value="72">3 Hari</SelectItem>
                      <SelectItem value="168">7 Hari</SelectItem>
                      <SelectItem value="720">30 Hari</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Kuota</Label>
                  <Select value={quota} onValueChange={setQuota}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 GB</SelectItem>
                      <SelectItem value="2">2 GB</SelectItem>
                      <SelectItem value="5">5 GB</SelectItem>
                      <SelectItem value="10">10 GB</SelectItem>
                      <SelectItem value="20">20 GB</SelectItem>
                      <SelectItem value="50">50 GB</SelectItem>
                      <SelectItem value="999">Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Speed Limit</Label>
                  <Select value={speedLimit} onValueChange={setSpeedLimit}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 Mbps</SelectItem>
                      <SelectItem value="5">5 Mbps</SelectItem>
                      <SelectItem value="10">10 Mbps</SelectItem>
                      <SelectItem value="20">20 Mbps</SelectItem>
                      <SelectItem value="50">50 Mbps</SelectItem>
                      <SelectItem value="100">100 Mbps</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Jumlah</Label>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                    max="50"
                    className="mt-1"
                  />
                </div>
              </div>
              <Button className="w-full" onClick={handleCreateVouchers}>
                Generate {quantity} Voucher
              </Button>
            </div>
          )}

          {/* Active Vouchers */}
          <div>
            <p className="text-sm font-medium mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Voucher Aktif ({activeVouchers.length})
            </p>
            {activeVouchers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Belum ada voucher aktif
              </p>
            ) : (
              <div className="space-y-2">
                {activeVouchers.map(voucher => (
                  <div
                    key={voucher.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-border/30 bg-secondary/10 hover:bg-secondary/20 transition-all gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <code className="text-xl font-mono font-black text-primary tracking-wider truncate">
                          {voucher.code}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                          onClick={() => handleCopyCode(voucher.code)}
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded-md">
                          <Clock className="w-3.5 h-3.5 text-primary/70" />
                          <span className="font-medium">{voucher.duration >= 24
                            ? `${Math.floor(voucher.duration / 24)} H`
                            : `${voucher.duration} J`
                          }</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded-md">
                          <Wifi className="w-3.5 h-3.5 text-primary/70" />
                          <span className="font-medium">{voucher.quota >= 999 ? '∞' : `${voucher.quota} GB`}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded-md">
                          <Zap className="w-3.5 h-3.5 text-primary/70" />
                          <span className="font-medium">{voucher.speedLimit} M</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/10 justify-between sm:justify-end">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-9 font-semibold text-xs rounded-full px-4 grow sm:grow-0"
                        onClick={() => handleMarkAsUsed(voucher.id)}
                      >
                        Tandai Terpakai
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full shrink-0"
                        onClick={() => handleDeleteVoucher(voucher.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Used Vouchers */}
          {usedVouchers.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-muted-foreground"></span>
                Riwayat ({usedVouchers.length})
              </p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {usedVouchers.map(voucher => (
                  <div
                    key={voucher.id}
                    className="flex items-center justify-between p-2 rounded-lg border border-border/30 bg-muted/30 opacity-60"
                  >
                    <div>
                      <code className="text-sm font-mono line-through">
                        {voucher.code}
                      </code>
                      <p className="text-xs text-muted-foreground">
                        Digunakan {voucher.usedAt?.toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <Badge variant="secondary">Terpakai</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
