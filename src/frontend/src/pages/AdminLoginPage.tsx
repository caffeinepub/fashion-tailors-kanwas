import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Scissors, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { NavLink, useNavigate } from "../lib/router";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (username === "admin" && password === "kanwas123") {
        sessionStorage.setItem("kanwas_admin_auth", "true");
        toast.success("लॉगिन सफल! स्वागत है। ✓");
        navigate("/admin/dashboard");
      } else {
        toast.error("गलत उपयोगकर्ता नाम या पासवर्ड।");
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 animate-fade-in"
      style={{
        background: "linear-gradient(135deg, #0b0b0b 0%, #141008 100%)",
      }}
    >
      <NavLink to="/" className="flex items-center gap-2 mb-8">
        <Scissors className="w-5 h-5 text-gold" />
        <span className="text-sm font-bold text-gold">फैशन टेलर्स कनवास</span>
      </NavLink>

      <div
        className="w-full max-w-sm rounded-2xl p-8"
        data-ocid="admin.panel"
        style={{
          background: "oklch(var(--card))",
          border: "1px solid oklch(var(--gold-border))",
          boxShadow: "0 0 40px oklch(var(--gold) / 0.1)",
        }}
      >
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
            style={{
              background: "oklch(var(--gold) / 0.15)",
              border: "1px solid oklch(var(--gold-border))",
            }}
          >
            <Lock className="w-5 h-5 text-gold" />
          </div>
          <h1 className="text-xl font-black text-foreground">एडमिन लॉगिन</h1>
          <p className="text-xs text-muted-foreground mt-1">
            प्रबंधन पैनल में प्रवेश करें
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <Label
              htmlFor="uname"
              className="text-sm font-medium text-foreground"
            >
              उपयोगकर्ता नाम
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="uname"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                data-ocid="admin.input"
                className="pl-10"
                style={{
                  background: "oklch(var(--input))",
                  borderColor: "oklch(var(--border))",
                  color: "oklch(var(--foreground))",
                }}
                autoComplete="username"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pw" className="text-sm font-medium text-foreground">
              पासवर्ड
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="pw"
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-ocid="admin.input"
                className="pl-10 pr-10"
                style={{
                  background: "oklch(var(--input))",
                  borderColor: "oklch(var(--border))",
                  color: "oklch(var(--foreground))",
                }}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gold transition-colors"
                aria-label={showPass ? "पासवर्ड छिपाएं" : "पासवर्ड दिखाएं"}
              >
                {showPass ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          <Button
            type="submit"
            size="lg"
            className="w-full font-bold"
            disabled={loading}
            data-ocid="admin.submit_button"
            style={{
              background: "oklch(var(--gold))",
              color: "oklch(var(--primary-foreground))",
            }}
          >
            {loading ? "लॉगिन हो रहा है..." : "लॉगिन करें"}
          </Button>
        </form>
      </div>

      <NavLink
        to="/"
        className="mt-6 text-xs text-muted-foreground hover:text-gold transition-colors"
      >
        ← होम पर वापस जाएं
      </NavLink>
    </div>
  );
}
