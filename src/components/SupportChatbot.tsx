import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
}

const FAQ_RESPONSES: Record<string, string> = {
  "internet lambat": "Coba restart router Anda. Jika masih lambat, periksa jumlah perangkat yang terhubung dan kurangi jika terlalu banyak.",
  "lupa password": "Untuk reset password WiFi, akses panel admin router (biasanya 192.168.1.1) atau hubungi customer service kami.",
  "tidak bisa connect": "Pastikan WiFi aktif di perangkat Anda, password benar, dan jarak tidak terlalu jauh dari router.",
  "kuota habis": "Anda bisa membeli paket tambahan melalui aplikasi atau menghubungi customer service.",
  "router mati": "Periksa kabel power dan pastikan terhubung dengan benar. Jika lampu tidak menyala, coba ganti colokan listrik.",
  "ping tinggi": "Aktifkan Game Mode untuk optimasi ping. Jika masih tinggi, pastikan tidak ada download besar di background.",
  "ganti password": "Masuk ke WiFi Settings, pilih jaringan, lalu klik 'Ubah Password' untuk menggantinya.",
};

const getResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  for (const [keyword, response] of Object.entries(FAQ_RESPONSES)) {
    if (lowerMessage.includes(keyword)) {
      return response;
    }
  }
  
  return "Terima kasih atas pertanyaan Anda. Untuk bantuan lebih lanjut, silakan hubungi customer service kami di 0800-123-4567 atau email support@wifimanager.id";
};

const SupportChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Halo! 👋 Saya asisten virtual WiFi Manager. Ada yang bisa saya bantu? Anda bisa bertanya tentang:\n• Internet lambat\n• Lupa password\n• Tidak bisa connect\n• Kuota habis\n• Ping tinggi",
      isBot: true,
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      isBot: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now() + 1,
        text: getResponse(input),
        isBot: true,
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 right-4 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-cyan-400 text-primary-foreground shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isOpen ? "hidden" : ""
        }`}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 z-50 w-80 h-96 bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-cyan-400 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Support Chat</h3>
                <p className="text-white/70 text-xs">Online • Siap membantu</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm whitespace-pre-line ${
                      msg.isBot
                        ? "bg-secondary text-foreground rounded-tl-sm"
                        : "bg-primary text-primary-foreground rounded-tr-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-3 border-t border-border bg-background">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ketik pesan..."
                className="flex-1 text-sm"
              />
              <Button
                onClick={handleSend}
                size="icon"
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SupportChatbot;
