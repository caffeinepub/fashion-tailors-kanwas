import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isInStandaloneMode() {
  return (
    ("standalone" in navigator &&
      (navigator as { standalone?: boolean }).standalone === true) ||
    window.matchMedia("(display-mode: standalone)").matches
  );
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showFab, setShowFab] = useState(false);
  const [installed, setInstalled] = useState(false);
  const promptReceivedRef = useRef(false);

  useEffect(() => {
    // Already installed as PWA — hide everything
    if (isInStandaloneMode()) {
      setInstalled(true);
      return;
    }

    const dismissed = sessionStorage.getItem("pwa_install_dismissed");

    const handler = (e: Event) => {
      e.preventDefault();
      promptReceivedRef.current = true;
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowFab(true);
      // Show install banner after 5–10 second delay
      if (!dismissed) {
        const delay = Math.floor(Math.random() * 5000) + 5000;
        setTimeout(() => setShowBanner(true), delay);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Always show FAB after 8 seconds even without beforeinstallprompt
    // so users can see install instructions
    if (!dismissed) {
      setTimeout(() => {
        if (!isInStandaloneMode()) {
          setShowFab(true);
          // Show banner after another 3 seconds
          setTimeout(() => setShowBanner(true), 3000);
        }
      }, 8000);
    }

    window.addEventListener("appinstalled", () => {
      setInstalled(true);
      setShowBanner(false);
      setShowFab(false);
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setShowBanner(false);
        setShowFab(false);
        setDeferredPrompt(null);
      }
    } else {
      // No native prompt — show manual instructions
      setShowBanner(true);
    }
  };

  const dismissBanner = () => {
    sessionStorage.setItem("pwa_install_dismissed", "true");
    setShowBanner(false);
  };

  if (installed) return null;

  return (
    <>
      {/* A. Floating FAB button — shows after delay */}
      {showFab && (
        <button
          type="button"
          onClick={handleInstall}
          data-ocid="install.button"
          aria-label="ऐप इंस्टॉल करें"
          className="fixed bottom-6 right-6 z-50 flex flex-col items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-transform hover:scale-110 active:scale-95"
          style={{
            background:
              "linear-gradient(135deg, oklch(var(--gold)), oklch(0.72 0.16 75))",
            boxShadow: "0 0 0 0 oklch(var(--gold) / 0.7)",
            animation: "fab-pulse 2s infinite",
          }}
        >
          <Download className="w-5 h-5" style={{ color: "#0b0b0b" }} />
          <span
            className="text-[9px] font-bold leading-none mt-0.5"
            style={{ color: "#0b0b0b" }}
          >
            इंस्टॉल
          </span>
          {/* Pulse ring */}
          <span
            className="absolute inset-0 rounded-full"
            style={{
              border: "2px solid oklch(var(--gold) / 0.5)",
              animation: "fab-ring 2s infinite",
            }}
          />
        </button>
      )}

      {/* B. Install Banner — slides up from bottom */}
      {showBanner && (
        <div
          data-ocid="install.panel"
          className="fixed bottom-24 left-4 right-4 z-50 max-w-sm mx-auto animate-fade-in"
          style={{
            background: "linear-gradient(135deg, #14100a, #1c1508)",
            border: "1px solid oklch(var(--gold-border))",
            borderRadius: "1rem",
            boxShadow:
              "0 8px 40px oklch(var(--gold) / 0.25), 0 2px 12px oklch(0 0 0 / 0.6)",
            padding: "1rem",
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
              style={{
                background: "oklch(var(--gold) / 0.15)",
                border: "1px solid oklch(var(--gold-border))",
              }}
            >
              ✂️
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gold mb-0.5">ऐप इंस्टॉल करें</p>
              {deferredPrompt ? (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  फैशन टेलर्स कनवास को अपने फ़ोन में इंस्टॉल करें और तुरंत एक्सेस पाएं।
                </p>
              ) : isIOS() ? (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Safari में{" "}
                  <span className="text-gold font-semibold">शेयर बटन (□↑)</span>{" "}
                  दबाएं →{" "}
                  <span className="text-gold font-semibold">
                    'Add to Home Screen'
                  </span>{" "}
                  चुनें
                </p>
              ) : (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  ब्राउज़र मेनू <span className="text-gold font-semibold">⋮</span> →{" "}
                  <span className="text-gold font-semibold">
                    'Add to Home Screen'
                  </span>{" "}
                  / 'Install App' दबाएं
                </p>
              )}
              <div className="flex gap-2 mt-3">
                {deferredPrompt && (
                  <Button
                    size="sm"
                    onClick={handleInstall}
                    data-ocid="install.primary_button"
                    className="flex-1 text-xs font-semibold gap-1"
                    style={{
                      background: "oklch(var(--gold))",
                      color: "#0b0b0b",
                    }}
                  >
                    <Download className="w-3 h-3" /> इंस्टॉल करें
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={dismissBanner}
                  data-ocid="install.cancel_button"
                  className="text-xs text-muted-foreground flex-1"
                  style={{ borderColor: "oklch(var(--border))" }}
                >
                  ठीक है
                </Button>
              </div>
            </div>
            <button
              type="button"
              onClick={dismissBanner}
              data-ocid="install.close_button"
              className="flex-shrink-0 p-1 rounded text-muted-foreground hover:text-gold transition-colors"
              aria-label="बंद करें"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* FAB pulse keyframes injected globally */}
      <style>{`
        @keyframes fab-ring {
          0% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes fab-pulse {
          0%, 100% { box-shadow: 0 0 0 0 oklch(0.78 0.17 85 / 0.5), 0 8px 24px oklch(0 0 0 / 0.6); }
          50% { box-shadow: 0 0 0 8px oklch(0.78 0.17 85 / 0), 0 8px 24px oklch(0 0 0 / 0.6); }
        }
      `}</style>
    </>
  );
}
