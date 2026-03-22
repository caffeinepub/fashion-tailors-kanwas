import { Heart, MapPin, MessageCircle, Phone, Scissors } from "lucide-react";
import { type ShopSettings, defaultSettings } from "../data/defaults";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { NavLink } from "../lib/router";

export default function Footer() {
  const [settings] = useLocalStorage<ShopSettings>(
    "kanwas_settings",
    defaultSettings,
  );
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`;

  return (
    <footer
      className="mt-16 border-t"
      style={{
        background: "linear-gradient(to bottom, #0e0c07, #0b0b0b)",
        borderColor: "oklch(var(--gold-border))",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Scissors className="w-5 h-5 text-gold" />
              <h3 className="text-lg font-bold text-gold">फैशन टेलर्स कनवास</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-2">
              राजस्थान के कनवास में स्थित हमारी प्रीमियम टेलरिंग शॉप। उच्च गुणवत्ता और
              बेहतरीन फिटिंग हमारी पहचान है।
            </p>
            <p
              className="text-sm font-semibold"
              style={{ color: "oklch(var(--gold))" }}
            >
              प्रोप्राइटर: सत्यनारायण वर्मा
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gold mb-4 uppercase tracking-wider">
              त्वरित लिंक
            </h4>
            <ul className="space-y-2">
              {[
                { to: "/", label: "होम" },
                { to: "/services", label: "हमारी सेवाएं" },
                { to: "/gallery", label: "गैलरी" },
                { to: "/booking", label: "बुकिंग करें" },
                { to: "/location", label: "हमारा पता" },
              ].map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gold mb-4 uppercase tracking-wider">
              संपर्क करें
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors"
                >
                  <Phone className="w-4 h-4 flex-shrink-0 text-gold" />
                  <span>{settings.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${settings.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors"
                >
                  <MessageCircle className="w-4 h-4 flex-shrink-0 text-gold" />
                  <span>WhatsApp पर संपर्क करें</span>
                </a>
              </li>
              <li>
                <a
                  href={`https://maps.google.com/?q=${settings.mapLat},${settings.mapLng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors"
                >
                  <MapPin className="w-4 h-4 flex-shrink-0 text-gold" />
                  <span className="line-clamp-2">{settings.address}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground"
          style={{ borderTop: "1px solid oklch(var(--border))" }}
        >
          <p>© {year} फैशन टेलर्स कनवास। सर्वाधिकार सुरक्षित।</p>
          <a
            href={utmLink}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 hover:text-gold transition-colors"
          >
            Built with <Heart className="w-3 h-3 text-gold fill-gold" /> using
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
