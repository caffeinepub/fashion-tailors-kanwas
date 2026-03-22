import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Scissors } from "lucide-react";
import { useState } from "react";
import {
  type Service,
  type ShopSettings,
  defaultServices,
  defaultSettings,
} from "../data/defaults";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function BookingPage() {
  const [services] = useLocalStorage<Service[]>(
    "kanwas_services",
    defaultServices,
  );
  const [settings] = useLocalStorage<ShopSettings>(
    "kanwas_settings",
    defaultSettings,
  );

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [message, setMessage] = useState("");
  const [nameError, setNameError] = useState("");
  const [mobileError, setMobileError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNameError("");
    setMobileError("");
    let valid = true;
    if (!name.trim()) {
      setNameError("नाम आवश्यक है");
      valid = false;
    }
    if (!mobile.trim()) {
      setMobileError("मोबाइल नंबर आवश्यक है");
      valid = false;
    }
    if (!valid) return;
    const text = encodeURIComponent(
      `नमस्ते! मैं बुकिंग करना चाहता/चाहती हूं।\nनाम: ${name}\nमोबाइल: ${mobile}\nसेवा: ${selectedService || "(अभी तय नहीं)"}\nसंदेश: ${message || "(कोई संदेश नहीं)"}`,
    );
    window.open(`https://wa.me/${settings.whatsapp}?text=${text}`, "_blank");
  };

  return (
    <div className="min-h-screen py-12 px-4 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3 text-gold">
            अपॉइंटमेंट लें
          </p>
          <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-4">
            बुकिंग करें
          </h1>
          <p className="text-muted-foreground">
            नीचे फ़ॉर्म भरें और WhatsApp के ज़रिए हमसे सीधे जुड़ें।
          </p>
        </div>

        <div
          className="rounded-2xl p-8"
          data-ocid="booking.panel"
          style={{
            background: "oklch(var(--card))",
            border: "1px solid oklch(var(--gold-border))",
            boxShadow: "0 0 40px oklch(var(--gold) / 0.08)",
          }}
        >
          <div className="flex items-center gap-2 mb-8">
            <Scissors className="w-5 h-5 text-gold" />
            <h2 className="text-lg font-bold text-foreground">बुकिंग फ़ॉर्म</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-1.5">
              <Label
                htmlFor="bname"
                className="text-sm font-medium text-foreground"
              >
                आपका नाम *
              </Label>
              <Input
                id="bname"
                placeholder="जैसे: राम कुमार"
                value={name}
                onChange={(e) => setName(e.target.value)}
                data-ocid="booking.input"
                style={{
                  background: "oklch(var(--input))",
                  borderColor: nameError
                    ? "oklch(var(--destructive))"
                    : "oklch(var(--border))",
                  color: "oklch(var(--foreground))",
                }}
              />
              {nameError && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="booking.error_state"
                >
                  {nameError}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="bmobile"
                className="text-sm font-medium text-foreground"
              >
                मोबाइल नंबर *
              </Label>
              <Input
                id="bmobile"
                type="tel"
                placeholder="जैसे: +91 98765 43210"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                data-ocid="booking.input"
                style={{
                  background: "oklch(var(--input))",
                  borderColor: mobileError
                    ? "oklch(var(--destructive))"
                    : "oklch(var(--border))",
                  color: "oklch(var(--foreground))",
                }}
              />
              {mobileError && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="booking.error_state"
                >
                  {mobileError}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">
                सेवा चुनें
              </Label>
              <Select
                value={selectedService}
                onValueChange={setSelectedService}
              >
                <SelectTrigger
                  data-ocid="booking.select"
                  style={{
                    background: "oklch(var(--input))",
                    borderColor: "oklch(var(--border))",
                    color: "oklch(var(--foreground))",
                  }}
                >
                  <SelectValue placeholder="सेवा चुनें (वैकल्पिक)" />
                </SelectTrigger>
                <SelectContent
                  style={{
                    background: "oklch(var(--popover))",
                    borderColor: "oklch(var(--border))",
                  }}
                >
                  {services.map((s) => (
                    <SelectItem key={s.id} value={s.name}>
                      {s.icon} {s.name} — ₹{s.price.toLocaleString("hi-IN")}+
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="bmsg"
                className="text-sm font-medium text-foreground"
              >
                संदेश (वैकल्पिक)
              </Label>
              <Textarea
                id="bmsg"
                placeholder="अपनी ज़रूरत या कोई विशेष बात लिखें..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                data-ocid="booking.textarea"
                style={{
                  background: "oklch(var(--input))",
                  borderColor: "oklch(var(--border))",
                  color: "oklch(var(--foreground))",
                }}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full font-bold text-base gap-2"
              data-ocid="booking.submit_button"
              style={{
                background: "oklch(var(--gold))",
                color: "oklch(var(--primary-foreground))",
              }}
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp पर बुकिंग भेजें 💬
            </Button>
          </form>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: "⏰", title: "समय", desc: "सुबह 9 – शाम 8" },
            { icon: "📍", title: "पता", desc: "मुख्य बाजार, कनवास" },
            { icon: "⚡", title: "जवाब", desc: "1 घंटे में उत्तर" },
          ].map((item) => (
            <div
              key={item.title}
              className="text-center p-4 rounded-xl"
              style={{
                background: "oklch(var(--card))",
                border: "1px solid oklch(var(--border))",
              }}
            >
              <p className="text-2xl mb-1">{item.icon}</p>
              <p className="text-sm font-semibold text-gold">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
