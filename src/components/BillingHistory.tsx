import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  History, 
  Trash2, 
  Eye, 
  Calendar,
  Wallet,
  User,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface BillingRecord {
  id: string;
  month: string;
  year: number;
  monthYear: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  totalUsageGB: number;
  pricePerGB: number;
  totalCost: number;
  savedAt: string;
}

interface BillingHistoryProps {
  records: BillingRecord[];
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
}

export default function BillingHistory({ 
  records, 
  onDeleteRecord, 
  onClearAll 
}: BillingHistoryProps) {
  const [selectedRecord, setSelectedRecord] = useState<BillingRecord | null>(null);
  const { toast } = useToast();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleDelete = (id: string) => {
    onDeleteRecord(id);
    toast({
      title: "Riwayat Dihapus",
      description: "Data tagihan berhasil dihapus",
    });
  };

  if (records.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <History className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-sm text-muted-foreground">
            Belum ada riwayat tagihan tersimpan
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Klik "Simpan Tagihan" untuk menyimpan data bulan ini
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center gap-2">
            <History className="h-4 w-4 text-primary" />
            Riwayat Tagihan
          </span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus Semua Riwayat?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tindakan ini akan menghapus semua riwayat tagihan yang tersimpan. 
                  Data yang sudah dihapus tidak dapat dikembalikan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={onClearAll} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Hapus Semua
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-3">
            {records.map((record) => (
              <div 
                key={record.id}
                className="bg-muted/50 rounded-lg p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-medium">{record.monthYear}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {record.totalUsageGB.toFixed(1)} GB
                  </Badge>
                </div>
                
                {record.customerName && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span>{record.customerName}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-green-500" />
                    <span className="font-bold text-primary">
                      {formatCurrency(record.totalCost)}
                    </span>
                  </div>
                  
                  <div className="flex gap-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedRecord(record)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            Detail Tagihan - {record.monthYear}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          {/* Customer Info */}
                          {(record.customerName || record.customerAddress || record.customerPhone) && (
                            <div className="bg-primary/5 rounded-lg p-4 space-y-2">
                              <p className="text-sm font-medium text-primary">Data Pelanggan</p>
                              {record.customerName && (
                                <p className="text-sm">👤 {record.customerName}</p>
                              )}
                              {record.customerAddress && (
                                <p className="text-sm">📍 {record.customerAddress}</p>
                              )}
                              {record.customerPhone && (
                                <p className="text-sm">📞 {record.customerPhone}</p>
                              )}
                            </div>
                          )}
                          
                          {/* Usage Details */}
                          <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-border">
                              <span className="text-sm text-muted-foreground">Periode</span>
                              <span className="font-medium">{record.monthYear}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-border">
                              <span className="text-sm text-muted-foreground">Total Pemakaian</span>
                              <span className="font-medium">{record.totalUsageGB.toFixed(2)} GB</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-border">
                              <span className="text-sm text-muted-foreground">Harga per GB</span>
                              <span className="font-medium">{formatCurrency(record.pricePerGB)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 bg-primary/10 rounded-lg px-3">
                              <span className="font-medium">Total Tagihan</span>
                              <span className="text-xl font-bold text-primary">
                                {formatCurrency(record.totalCost)}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-xs text-muted-foreground text-center">
                            Disimpan pada: {new Date(record.savedAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus Riwayat?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Hapus data tagihan {record.monthYear}? 
                            Tindakan ini tidak dapat dibatalkan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(record.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}