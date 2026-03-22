import { Button } from "@/components/ui/button";
import {
  Clock,
  ExternalLink,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { type ShopSettings, defaultSettings } from "../data/defaults";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function LocationPage() {
  const [settings] = useLocalStorage<ShopSettings>(
    "kanwas_settings",
    defaultSettings,
  );
  const mapSrc = `https://maps.google.com/maps?q=${settings.mapLat},${settings.mapLng}&z=15&output=embed`;
  const mapsUrl = `https://maps.google.com/?q=${settings.mapLat},${settings.mapLng}`;

  return (
    <div className="min-h-screen py-12 px-4 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3 text-gold">
            हमारा पता
          </p>
          <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-4">
            हमें ढूंढें
          </h1>
          <p className="text-muted-foreground">हम कनवास, राजस्थान में स्थित हैं।</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                border: "1px solid oklch(var(--gold-border))",
                height: "420px",
              }}
            >
              <iframe
                title="फैशन टेलर्स कनवास लोकेशन"
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                aria-label="Google Maps पर दुकान का स्थान"
              />
            </div>
            <div className="mt-4 text-center">
              <Button
                asChild
                size="lg"
                data-ocid="location.primary_button"
                className="font-bold gap-2"
                style={{
                  background: "oklch(var(--gold))",
                  color: "oklch(var(--primary-foreground))",
                }}
              >
                <a href={mapsUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="w-4 h-4" />
                  Google Maps में खोलें
                </a>
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div
              className="rounded-2xl p-6"
              style={{
                background: "oklch(var(--card))",
                border: "1px solid oklch(var(--gold-border))",
              }}
            >
              <h3 className="text-base font-bold text-gold mb-5">संपर्क विवरण</h3>
              <ul className="space-y-5">
                <li className="flex gap-3">
                  <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">पता</p>
                    <p className="text-sm text-foreground leading-snug">
                      {settings.address}
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Phone className="w-5 h-5 text-gold flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">फ़ोन</p>
                    <a
                      href={`tel:${settings.phone}`}
                      className="text-sm text-foreground hover:text-gold transition-colors"
                      data-ocid="location.link"
                    >
                      {settings.phone}
                    </a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <MessageCircle className="w-5 h-5 text-gold flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      WhatsApp
                    </p>
                    <a
                      href={`https://wa.me/${settings.whatsapp}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-foreground hover:text-gold transition-colors"
                      data-ocid="location.link"
                    >
                      +{settings.whatsapp}
                    </a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Clock className="w-5 h-5 text-gold flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      खुलने का समय
                    </p>
                    <p className="text-sm text-foreground">
                      सोम–शनि: सुबह 9 – शाम 8
                    </p>
                    <p className="text-sm text-muted-foreground">रविवार: बंद</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
