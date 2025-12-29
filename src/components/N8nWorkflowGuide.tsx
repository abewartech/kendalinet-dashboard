import { useState } from "react";
import { Copy, CheckCircle, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const n8nWorkflowTemplate = {
  name: "KendaliNet - WhatsApp Alert",
  nodes: [
    {
      parameters: {
        httpMethod: "POST",
        path: "kendalinet-alert",
        responseMode: "responseNode",
        options: {}
      },
      id: "webhook-node",
      name: "Webhook",
      type: "n8n-nodes-base.webhook",
      typeVersion: 2,
      position: [250, 300]
    },
    {
      parameters: {
        method: "POST",
        url: "https://api.fonnte.com/send",
        sendHeaders: true,
        headerParameters: {
          parameters: [
            {
              name: "Authorization",
              value: "={{ $env.FONNTE_API_KEY }}"
            }
          ]
        },
        sendBody: true,
        bodyParameters: {
          parameters: [
            {
              name: "target",
              value: "={{ $json.whatsapp_number }}"
            },
            {
              name: "message",
              value: "={{ $json.message }}"
            }
          ]
        },
        options: {}
      },
      id: "fonnte-node",
      name: "Send WhatsApp",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 4.2,
      position: [500, 300]
    },
    {
      parameters: {
        respondWith: "json",
        responseBody: "={{ JSON.stringify({ success: true, message: 'Notification sent' }) }}",
        options: {}
      },
      id: "response-node",
      name: "Response",
      type: "n8n-nodes-base.respondToWebhook",
      typeVersion: 1.1,
      position: [750, 300]
    }
  ],
  connections: {
    "Webhook": {
      main: [[{ node: "Send WhatsApp", type: "main", index: 0 }]]
    },
    "Send WhatsApp": {
      main: [[{ node: "Response", type: "main", index: 0 }]]
    }
  },
  settings: {
    executionOrder: "v1"
  }
};

interface N8nWorkflowGuideProps {
  trigger: React.ReactNode;
}

const N8nWorkflowGuide = ({ trigger }: N8nWorkflowGuideProps) => {
  const [copied, setCopied] = useState(false);
  const [showJson, setShowJson] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Disalin!",
        description: "Template workflow telah disalin ke clipboard"
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Gagal menyalin",
        description: "Silakan salin secara manual",
        variant: "destructive"
      });
    }
  };

  const workflowJson = JSON.stringify(n8nWorkflowTemplate, null, 2);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <img src="https://n8n.io/favicon.ico" alt="n8n" className="w-5 h-5" />
            Template Workflow n8n
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          {/* Introduction */}
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
            <p className="text-foreground">
              Panduan ini akan membantu Anda membuat workflow n8n untuk mengirim 
              notifikasi WhatsApp via <strong>Fonnte</strong> saat perangkat baru terdeteksi.
            </p>
          </div>

          {/* Prerequisites */}
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">📋 Prasyarat</h3>
            <ul className="list-disc ml-5 space-y-1 text-muted-foreground">
              <li>Akun n8n (cloud atau self-hosted)</li>
              <li>
                Akun Fonnte -{" "}
                <a 
                  href="https://fonnte.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  Daftar di sini <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>Nomor WhatsApp yang sudah terdaftar di Fonnte</li>
            </ul>
          </div>

          {/* Step by Step */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">🔧 Langkah-langkah Setup</h3>
            
            {/* Step 1 */}
            <div className="p-3 rounded-xl bg-secondary/50">
              <p className="font-medium text-foreground mb-2">1. Buat Workflow Baru</p>
              <p className="text-muted-foreground text-xs">
                Login ke n8n → Klik "Add Workflow" → Beri nama "KendaliNet WhatsApp Alert"
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-3 rounded-xl bg-secondary/50">
              <p className="font-medium text-foreground mb-2">2. Tambah Node Webhook</p>
              <p className="text-muted-foreground text-xs mb-2">
                Klik "+" → Cari "Webhook" → Konfigurasi:
              </p>
              <div className="bg-background/50 p-2 rounded-lg text-xs font-mono">
                <p>HTTP Method: <span className="text-success">POST</span></p>
                <p>Path: <span className="text-primary">kendalinet-alert</span></p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-3 rounded-xl bg-secondary/50">
              <p className="font-medium text-foreground mb-2">3. Tambah Node HTTP Request (Fonnte)</p>
              <p className="text-muted-foreground text-xs mb-2">
                Klik "+" → Cari "HTTP Request" → Konfigurasi:
              </p>
              <div className="bg-background/50 p-2 rounded-lg text-xs font-mono space-y-1">
                <p>Method: <span className="text-success">POST</span></p>
                <p>URL: <span className="text-primary">https://api.fonnte.com/send</span></p>
                <p className="mt-2 text-muted-foreground">Headers:</p>
                <p>Authorization: <span className="text-warning">[API Key Fonnte Anda]</span></p>
                <p className="mt-2 text-muted-foreground">Body Parameters:</p>
                <p>target: <span className="text-primary">{'{{ $json.whatsapp_number }}'}</span></p>
                <p>message: <span className="text-primary">{'{{ $json.message }}'}</span></p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-3 rounded-xl bg-secondary/50">
              <p className="font-medium text-foreground mb-2">4. Aktifkan Workflow</p>
              <p className="text-muted-foreground text-xs">
                Klik toggle "Active" di pojok kanan atas → Salin URL Webhook yang muncul
              </p>
            </div>

            {/* Step 5 */}
            <div className="p-3 rounded-xl bg-secondary/50">
              <p className="font-medium text-foreground mb-2">5. Tempel di KendaliNet</p>
              <p className="text-muted-foreground text-xs">
                Paste URL webhook ke pengaturan "Notifikasi WhatsApp" di tab Keamanan
              </p>
            </div>
          </div>

          {/* JSON Template */}
          <div className="space-y-2">
            <button
              onClick={() => setShowJson(!showJson)}
              className="flex items-center gap-2 font-semibold text-foreground hover:text-primary transition-colors"
            >
              {showJson ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              📄 Template JSON (Import Langsung)
            </button>
            
            {showJson && (
              <div className="relative">
                <pre className="bg-background/80 border border-border rounded-xl p-3 text-xs overflow-x-auto max-h-48 overflow-y-auto">
                  {workflowJson}
                </pre>
                <button
                  onClick={() => copyToClipboard(workflowJson)}
                  className="absolute top-2 right-2 p-2 rounded-lg bg-primary/20 hover:bg-primary/30 transition-colors"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-success" />
                  ) : (
                    <Copy className="w-4 h-4 text-primary" />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Payload Example */}
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">📨 Contoh Payload dari KendaliNet</h3>
            <pre className="bg-background/80 border border-border rounded-xl p-3 text-xs overflow-x-auto">
{`{
  "event": "new_device_detected",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "device": {
    "name": "iPhone-Asing",
    "mac": "AA:BB:CC:DD:EE:FF",
    "ip": "192.168.1.105"
  },
  "whatsapp_number": "628123456789",
  "message": "🚨 *Perangkat Baru Terdeteksi!*..."
}`}
            </pre>
          </div>

          {/* Alternative Services */}
          <div className="p-3 rounded-xl bg-secondary/30 border border-border">
            <p className="font-medium text-foreground mb-2">💡 Alternatif Selain Fonnte</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• <strong>Twilio WhatsApp</strong> - Ubah URL ke Twilio API</li>
              <li>• <strong>WhatsApp Business API</strong> - Untuk skala enterprise</li>
              <li>• <strong>Telegram</strong> - Gunakan Telegram Bot API</li>
            </ul>
          </div>

          {/* Help Links */}
          <div className="flex gap-2 pt-2">
            <a
              href="https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 px-3 rounded-xl bg-secondary text-foreground text-xs font-medium hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
            >
              Docs Webhook <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://docs.fonnte.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 px-3 rounded-xl bg-secondary text-foreground text-xs font-medium hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
            >
              Docs Fonnte <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default N8nWorkflowGuide;
