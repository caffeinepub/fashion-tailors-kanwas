import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { type Service, defaultServices } from "../data/defaults";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { NavLink } from "../lib/router";

export default function ServicesPage() {
  const [services] = useLocalStorage<Service[]>(
    "kanwas_services",
    defaultServices,
  );
  const [search, setSearch] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");

  const filtered = useMemo(() => {
    return services.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) return false;
      if (priceFilter === "under1000") return s.price < 1000;
      if (priceFilter === "1000-5000")
        return s.price >= 1000 && s.price <= 5000;
      if (priceFilter === "5000-15000")
        return s.price > 5000 && s.price <= 15000;
      if (priceFilter === "above15000") return s.price > 15000;
      return true;
    });
  }, [services, search, priceFilter]);

  return (
    <div className="min-h-screen py-12 px-4 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3 text-gold">
            हमारी सेवाएं
          </p>
          <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-4">
            प्रीमियम टेलरिंग
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            हर पोशाक बनाई जाती है बेहतरीन कारीगरी और उच्च गुणवत्ता वाले कपड़ों से।
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="सेवा खोजें..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-ocid="services.search_input"
              className="pl-10"
              style={{
                background: "oklch(var(--card))",
                borderColor: "oklch(var(--border))",
                color: "oklch(var(--foreground))",
              }}
            />
          </div>
          <Select value={priceFilter} onValueChange={setPriceFilter}>
            <SelectTrigger
              className="w-full sm:w-52"
              data-ocid="services.select"
              style={{
                background: "oklch(var(--card))",
                borderColor: "oklch(var(--border))",
                color: "oklch(var(--foreground))",
              }}
            >
              <SelectValue placeholder="मूल्य फ़िल्टर" />
            </SelectTrigger>
            <SelectContent
              style={{
                background: "oklch(var(--popover))",
                borderColor: "oklch(var(--border))",
              }}
            >
              <SelectItem value="all">सभी मूल्य</SelectItem>
              <SelectItem value="under1000">₹1,000 से कम</SelectItem>
              <SelectItem value="1000-5000">₹1,000 – ₹5,000</SelectItem>
              <SelectItem value="5000-15000">₹5,000 – ₹15,000</SelectItem>
              <SelectItem value="above15000">₹15,000 से अधिक</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <div data-ocid="services.empty_state" className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-muted-foreground">
              कोई सेवा नहीं मिली। अपनी खोज बदलें।
            </p>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            data-ocid="services.list"
          >
            {filtered.map((service, i) => (
              <div
                key={service.id}
                data-ocid={`services.item.${i + 1}`}
                className="card-glow rounded-xl p-6 flex flex-col gap-4"
                style={{
                  background: "oklch(var(--card))",
                  border: "1px solid oklch(var(--gold-border))",
                }}
              >
                <span className="text-5xl">{service.icon}</span>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-foreground mb-1">
                    {service.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>
                <div
                  className="flex items-center justify-between pt-4"
                  style={{ borderTop: "1px solid oklch(var(--border))" }}
                >
                  <span className="text-lg font-black text-gold">
                    ₹ {service.price.toLocaleString("hi-IN")}+
                  </span>
                  <Button
                    asChild
                    size="sm"
                    data-ocid={`services.primary_button.${i + 1}`}
                    style={{
                      background: "oklch(var(--gold))",
                      color: "oklch(var(--primary-foreground))",
                    }}
                  >
                    <NavLink to="/booking">बुकिंग करें</NavLink>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
