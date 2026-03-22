import { Button } from "@/components/ui/button";
import { Menu, Scissors, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "../lib/router";

const navLinks = [
  { to: "/", label: "होम" },
  { to: "/services", label: "सेवाएं" },
  { to: "/gallery", label: "गैलरी" },
  { to: "/booking", label: "बुकिंग" },
  { to: "/location", label: "लोकेशन" },
  { to: "/admin", label: "एडमिन" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: "linear-gradient(to right, #0b0b0b, #14110a)",
        borderBottom: "1px solid oklch(0.58 0.10 73)",
      }}
    >
      <div className="container flex h-16 items-center justify-between max-w-7xl mx-auto px-4">
        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-2 group"
          data-ocid="nav.link"
        >
          <div
            className="flex items-center justify-center w-9 h-9 rounded-full"
            style={{
              background: "oklch(var(--gold) / 0.15)",
              border: "1px solid oklch(var(--gold-border))",
            }}
          >
            <Scissors
              className="w-4 h-4"
              style={{ color: "oklch(var(--gold))" }}
            />
          </div>
          <div className="leading-tight">
            <p
              className="text-sm font-bold"
              style={{ color: "oklch(var(--gold))" }}
            >
              फैशन टेलर्स कनवास
            </p>
            <p
              className="text-[10px]"
              style={{ color: "oklch(var(--muted-foreground))" }}
            >
              प्रीमियम टेलरिंग
            </p>
          </div>
        </NavLink>

        {/* Desktop nav */}
        <nav
          className="hidden md:flex items-center gap-6"
          aria-label="मुख्य नेविगेशन"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              data-ocid="nav.link"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-gold font-semibold"
                    : "text-gold-light hover:text-gold"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:block">
          <Button
            asChild
            data-ocid="nav.primary_button"
            className="font-semibold text-sm"
            style={{
              background: "oklch(var(--gold))",
              color: "oklch(var(--primary-foreground))",
            }}
          >
            <NavLink to="/booking">बुक करें</NavLink>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden p-2 rounded-md"
          style={{ color: "oklch(var(--gold))" }}
          onClick={() => setOpen(!open)}
          aria-label={open ? "मेनू बंद करें" : "मेनू खोलें"}
          data-ocid="nav.toggle"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden px-4 pb-4 animate-fade-in"
          style={{
            background: "#0d0d0d",
            borderTop: "1px solid oklch(var(--border))",
          }}
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              data-ocid="nav.link"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block py-3 text-base font-medium border-b transition-colors duration-200 ${
                  isActive ? "text-gold" : "text-gold-light hover:text-gold"
                }`
              }
              style={{ borderColor: "oklch(var(--border))" }}
            >
              {link.label}
            </NavLink>
          ))}
          <Button
            asChild
            className="mt-4 w-full font-semibold"
            style={{
              background: "oklch(var(--gold))",
              color: "oklch(var(--primary-foreground))",
            }}
          >
            <NavLink
              to="/booking"
              onClick={() => setOpen(false)}
              data-ocid="nav.primary_button"
            >
              बुक करें
            </NavLink>
          </Button>
        </div>
      )}
    </header>
  );
}
