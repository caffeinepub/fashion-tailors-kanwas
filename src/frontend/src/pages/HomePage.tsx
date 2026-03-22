import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  MapPin,
  MessageCircle,
  Phone,
  Scissors,
  Star,
} from "lucide-react";
import {
  type Service,
  type ShopSettings,
  defaultServices,
  defaultSettings,
} from "../data/defaults";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { NavLink } from "../lib/router";

const previewImages = [
  "/assets/generated/kanwas-gallery-1.dim_600x600.jpg",
  "/assets/generated/kanwas-gallery-2.dim_600x600.jpg",
  "/assets/generated/kanwas-gallery-3.dim_600x600.jpg",
  "/assets/generated/kanwas-gallery-4.dim_600x600.jpg",
];

export default function HomePage() {
  const [services] = useLocalStorage<Service[]>(
    "kanwas_services",
    defaultServices,
  );
  const [settings] = useLocalStorage<ShopSettings>(
    "kanwas_settings",
    defaultSettings,
  );
  const featured = services.slice(0, 3);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section
        className="relative min-h-[90vh] flex items-center overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0b0b0b 0%, #141008 50%, #0b0b0b 100%)",
        }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/assets/generated/kanwas-hero.dim_1200x700.jpg"
            alt="टेलरिंग शॉप"
            className="w-full h-full object-cover opacity-25"
            loading="eager"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(11,11,11,0.95) 40%, rgba(11,11,11,0.5) 100%)",
            }}
          />
        </div>
        <div
          className="absolute top-0 left-0 w-1 h-full"
          style={{
            background:
              "linear-gradient(to bottom, transparent, oklch(var(--gold)), transparent)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-in">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
              style={{
                background: "oklch(var(--gold) / 0.12)",
                border: "1px solid oklch(var(--gold-border))",
                color: "oklch(var(--gold))",
              }}
            >
              <Scissors className="w-3 h-3" />
              कनवास, राजस्थान
            </div>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6"
              style={{ color: "oklch(var(--foreground))" }}
            >
              फैशन टेलर्स{" "}
              <span style={{ color: "oklch(var(--gold))" }}>कनवास</span> में आपका{" "}
              <span className="italic">स्वागत है</span>
            </h1>
            <p
              className="text-lg leading-relaxed mb-8"
              style={{ color: "oklch(var(--muted-foreground))" }}
            >
              परंपरागत शैली और आधुनिक फैशन का अनोखा संगम। हर कपड़ा बनाया जाता है खास
              आपके लिए, आपकी पसंद और माप के अनुसार।
            </p>
            <div className="flex flex-wrap gap-4 mb-10">
              <Button
                asChild
                size="lg"
                data-ocid="home.primary_button"
                className="font-bold text-base px-8"
                style={{
                  background: "oklch(var(--gold))",
                  color: "oklch(var(--primary-foreground))",
                }}
              >
                <NavLink to="/booking">📅 बुकिंग करें</NavLink>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                data-ocid="home.secondary_button"
                className="font-semibold text-base px-8"
                style={{
                  borderColor: "oklch(var(--gold-border))",
                  color: "oklch(var(--gold))",
                  background: "transparent",
                }}
              >
                <NavLink to="/services">सेवाएं देखें</NavLink>
              </Button>
            </div>
            <div className="flex flex-wrap gap-8">
              {[
                { num: "15+", label: "वर्षों का अनुभव" },
                { num: "5000+", label: "खुश ग्राहक" },
                { num: "100%", label: "संतुष्टि गारंटी" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-black text-gold">{s.num}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block animate-fade-in">
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                border: "1px solid oklch(var(--gold-border))",
                boxShadow: "0 0 40px oklch(var(--gold) / 0.15)",
              }}
            >
              <img
                src="/assets/generated/kanwas-hero.dim_1200x700.jpg"
                alt="फैशन टेलर्स कनवास"
                className="w-full h-[420px] object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(11,11,11,0.8) 0%, transparent 50%)",
                }}
              />
              <div className="absolute bottom-4 left-4 right-4">
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-lg"
                  style={{
                    background: "oklch(var(--card) / 0.9)",
                    border: "1px solid oklch(var(--gold-border))",
                  }}
                >
                  <Star className="w-4 h-4 fill-gold text-gold" />
                  <span className="text-sm font-medium text-foreground">
                    राजस्थान की नं. 1 टेलरिंग शॉप
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick contact bar */}
      <section
        className="py-4 px-4"
        style={{
          background: "oklch(var(--card))",
          borderBottom: "1px solid oklch(var(--border))",
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-4">
          <a
            href={`tel:${settings.phone}`}
            data-ocid="home.button"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105"
            style={{
              background: "oklch(var(--gold) / 0.15)",
              color: "oklch(var(--gold))",
              border: "1px solid oklch(var(--gold-border))",
            }}
          >
            <Phone className="w-4 h-4" /> कॉल करें
          </a>
          <a
            href={`https://wa.me/${settings.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            data-ocid="home.secondary_button"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105"
            style={{
              background: "#25D36620",
              color: "#25D366",
              border: "1px solid #25D36650",
            }}
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </a>
          <NavLink
            to="/location"
            data-ocid="home.link"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105"
            style={{
              background: "oklch(0.15 0.006 180)",
              color: "oklch(var(--foreground))",
              border: "1px solid oklch(var(--border))",
            }}
          >
            <MapPin className="w-4 h-4 text-gold" /> लोकेशन देखें
          </NavLink>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3 text-gold">
            हमारी विशेष सेवाएं
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-4">
            प्रीमियम टेलरिंग सेवाएं
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            हर पोशाक बनाई जाती है खास आपके लिए, बेहतरीन कपड़े और उत्कृष्ट कारीगरी के साथ।
          </p>
        </div>
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          data-ocid="home.list"
        >
          {featured.map((service, i) => (
            <div
              key={service.id}
              data-ocid={`home.item.${i + 1}`}
              className="card-glow rounded-xl p-6 flex flex-col gap-4"
              style={{
                background: "oklch(var(--card))",
                border: "1px solid oklch(var(--gold-border))",
              }}
            >
              <span className="text-4xl">{service.icon}</span>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1">
                  {service.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
              <div
                className="flex items-center justify-between mt-auto pt-4"
                style={{ borderTop: "1px solid oklch(var(--border))" }}
              >
                <span className="text-xl font-black text-gold">
                  ₹ {service.price.toLocaleString("hi-IN")}+
                </span>
                <Button
                  asChild
                  size="sm"
                  data-ocid={`home.secondary_button.${i + 1}`}
                  style={{
                    background: "oklch(var(--gold))",
                    color: "oklch(var(--primary-foreground))",
                  }}
                >
                  <NavLink to="/booking">बुक करें</NavLink>
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Button
            asChild
            variant="outline"
            size="lg"
            data-ocid="home.link"
            className="font-semibold"
            style={{
              borderColor: "oklch(var(--gold-border))",
              color: "oklch(var(--gold))",
            }}
          >
            <NavLink to="/services">
              सभी सेवाएं देखें <ChevronRight className="w-4 h-4 ml-1" />
            </NavLink>
          </Button>
        </div>
      </section>

      {/* Gallery preview */}
      <section
        className="py-16 px-4"
        style={{ background: "oklch(var(--card))" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">
              हमारा काम
            </h2>
            <Button
              asChild
              variant="ghost"
              data-ocid="home.link"
              className="text-gold hover:text-gold-light"
            >
              <NavLink to="/gallery">
                सब देखें <ChevronRight className="w-4 h-4 ml-1" />
              </NavLink>
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {previewImages.map((src) => (
              <NavLink
                key={src}
                to="/gallery"
                data-ocid="home.item.1"
                className="block aspect-square rounded-xl overflow-hidden transition-transform duration-300 hover:scale-105"
                style={{ border: "1px solid oklch(var(--gold-border))" }}
              >
                <img
                  src={src}
                  alt="गैलरी"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </NavLink>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section
        className="py-16 px-4 text-center"
        style={{
          background:
            "linear-gradient(135deg, #14100a 0%, #1c1508 50%, #14100a 100%)",
          borderTop: "1px solid oklch(var(--gold-border))",
          borderBottom: "1px solid oklch(var(--gold-border))",
        }}
      >
        <div className="max-w-2xl mx-auto">
          <p className="text-xs tracking-widest uppercase text-gold mb-3">
            अभी संपर्क करें
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-4">
            अपनी पोशाक बनवाएं, <span className="text-gold">अपने सपनों की</span>
          </h2>
          <p className="text-muted-foreground mb-8">
            आज ही बुकिंग करें और अपनी पसंद की पोशाक के लिए हमसे मिलें।
          </p>
          <Button
            asChild
            size="lg"
            data-ocid="home.primary_button"
            className="font-bold text-base"
            style={{
              background: "oklch(var(--gold))",
              color: "oklch(var(--primary-foreground))",
            }}
          >
            <NavLink to="/booking">💬 WhatsApp पर बुकिंग करें</NavLink>
          </Button>
        </div>
      </section>
    </div>
  );
}
