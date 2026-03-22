import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("pwa_install_dismissed");
    if (dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowBanner(true), 3000);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setShowBanner(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    sessionStorage.setItem("pwa_install_dismissed", "true");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto animate-fade-in"
      style={{
        background: "linear-gradient(135deg, #14100a, #1c1508)",
        border: "1px solid oklch(var(--gold-border))",
        borderRadius: "1rem",
        boxShadow: "0 8px 32px oklch(var(--gold) / 0.2)",
        padding: "1rem",
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: "oklch(var(--gold) / 0.15)",
            border: "1px solid oklch(var(--gold-border))",
          }}
        >
          <Download className="w-5 h-5 text-gold" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gold mb-0.5">ऐप इंस्टॉल करें</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            फैशन टेलर्स कनवास को अपने फ़ोन में इंस्टॉल करें और तुरंत एक्सेस पाएं।
          </p>
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              onClick={handleInstall}
              className="flex-1 text-xs font-semibold gap-1"
              style={{
                background: "oklch(var(--gold))",
                color: "oklch(var(--primary-foreground))",
              }}
            >
              <Download className="w-3 h-3" /> इंस्टॉल करें
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDismiss}
              className="text-xs text-muted-foreground"
              style={{ borderColor: "oklch(var(--border))" }}
            >
              बाद में
            </Button>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 rounded text-muted-foreground hover:text-gold transition-colors"
          aria-label="बंद करें"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
