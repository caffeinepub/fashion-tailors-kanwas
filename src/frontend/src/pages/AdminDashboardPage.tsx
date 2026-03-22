import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Edit2,
  Image,
  LogOut,
  Plus,
  Save,
  Scissors,
  Settings,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  type GalleryImage,
  type Service,
  type ShopSettings,
  defaultGallery,
  defaultServices,
  defaultSettings,
} from "../data/defaults";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { NavLink, useNavigate } from "../lib/router";

const EMPTY_SERVICE: Omit<Service, "id"> = {
  name: "",
  description: "",
  price: 0,
  icon: "✂️",
};

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [services, setServices] = useLocalStorage<Service[]>(
    "kanwas_services",
    defaultServices,
  );
  const [gallery, setGallery] = useLocalStorage<GalleryImage[]>(
    "kanwas_gallery",
    defaultGallery,
  );
  const [settings, setSettings] = useLocalStorage<ShopSettings>(
    "kanwas_settings",
    defaultSettings,
  );

  const [form, setForm] = useState<Omit<Service, "id">>(EMPTY_SERVICE);
  const [editId, setEditId] = useState<number | null>(null);
  const [galleryCaption, setGalleryCaption] = useState("");
  const [settingsForm, setSettingsForm] = useState<ShopSettings>(settings);
  const [editImgId, setEditImgId] = useState<number | null>(null);
  const [editCaption, setEditCaption] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("kanwas_admin_auth");
    navigate("/admin");
  };

  const handleSaveService = () => {
    if (!form.name.trim()) {
      toast.error("सेवा का नाम आवश्यक है");
      return;
    }
    if (form.price <= 0) {
      toast.error("मूल्य सही दर्ज करें");
      return;
    }
    if (editId !== null) {
      setServices((prev) =>
        prev.map((s) => (s.id === editId ? { ...s, ...form } : s)),
      );
      setEditId(null);
      toast.success("सेवा अपडेट की गई ✓");
    } else {
      setServices((prev) => [...prev, { id: Date.now(), ...form }]);
      toast.success("सेवा सहेजी गई ✓");
    }
    setForm(EMPTY_SERVICE);
  };

  const startEdit = (s: Service) => {
    setEditId(s.id);
    setForm({
      name: s.name,
      description: s.description,
      price: s.price,
      icon: s.icon,
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm(EMPTY_SERVICE);
  };

  const handleDeleteService = (id: number) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    toast.success("सेवा हटाई गई ✓");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        setGallery((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            url,
            caption: galleryCaption.trim() || file.name.replace(/\.[^.]+$/, ""),
          },
        ]);
        toast.success("फ़ोटो अपलोड हुई ✓");
        setUploading(false);
      };
      reader.readAsDataURL(file);
    }
    setGalleryCaption("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDeleteImage = (id: number) => {
    setGallery((prev) => prev.filter((g) => g.id !== id));
    toast.success("फ़ोटो हटाई गई ✓");
  };

  const startEditImg = (img: GalleryImage) => {
    setEditImgId(img.id);
    setEditCaption(img.caption);
  };

  const saveEditImg = () => {
    setGallery((prev) =>
      prev.map((g) =>
        g.id === editImgId ? { ...g, caption: editCaption } : g,
      ),
    );
    setEditImgId(null);
    setEditCaption("");
    toast.success("कैप्शन अपडेट हुआ ✓");
  };

  const handleSaveSettings = () => {
    setSettings(settingsForm);
    toast.success("सेटिंग्स सहेजी गई ✓");
  };

  const cardStyle = {
    background: "oklch(var(--card))",
    border: "1px solid oklch(var(--gold-border))",
  };

  return (
    <div
      className="min-h-screen animate-fade-in"
      style={{
        background: "linear-gradient(135deg, #0b0b0b 0%, #0e0c07 100%)",
      }}
    >
      {/* Dashboard header */}
      <div
        className="sticky top-0 z-40 px-4 py-4"
        style={{
          background: "#0b0b0b",
          borderBottom: "1px solid oklch(var(--gold-border))",
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scissors className="w-5 h-5 text-gold" />
            <div>
              <p className="text-sm font-bold text-gold">एडमिन पैनल</p>
              <p className="text-xs text-muted-foreground">फैशन टेलर्स कनवास</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-gold"
            >
              <NavLink to="/">वेबसाइट देखें</NavLink>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              data-ocid="admin.button"
              className="gap-2 text-gold"
              style={{ borderColor: "oklch(var(--gold-border))" }}
            >
              <LogOut className="w-4 h-4" /> लॉगआउट
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="services">
          <TabsList
            className="mb-8 w-full sm:w-auto"
            data-ocid="admin.tab"
            style={{
              background: "oklch(var(--card))",
              border: "1px solid oklch(var(--border))",
            }}
          >
            <TabsTrigger
              value="services"
              className="gap-2 data-[state=active]:text-gold"
            >
              <Scissors className="w-4 h-4" /> सेवाएं
            </TabsTrigger>
            <TabsTrigger
              value="gallery"
              className="gap-2 data-[state=active]:text-gold"
            >
              <Image className="w-4 h-4" /> गैलरी
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="gap-2 data-[state=active]:text-gold"
            >
              <Settings className="w-4 h-4" /> सेटिंग्स
            </TabsTrigger>
          </TabsList>

          {/* SERVICES TAB */}
          <TabsContent value="services">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="rounded-2xl p-6" style={cardStyle}>
                <h2 className="text-base font-bold text-gold mb-5">
                  {editId !== null ? "सेवा संपादित करें" : "नई सेवा / रेट जोड़ें"}
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-3">
                    <div className="col-span-1 space-y-1.5">
                      <Label className="text-xs text-foreground">आइकन</Label>
                      <Input
                        placeholder="👘"
                        value={form.icon}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, icon: e.target.value }))
                        }
                        data-ocid="admin.input"
                        className="text-center text-xl"
                        style={{
                          background: "oklch(var(--input))",
                          borderColor: "oklch(var(--border))",
                          color: "oklch(var(--foreground))",
                        }}
                      />
                    </div>
                    <div className="col-span-3 space-y-1.5">
                      <Label className="text-xs text-foreground">
                        सेवा का नाम *
                      </Label>
                      <Input
                        placeholder="जैसे: कोट पेंट"
                        value={form.name}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, name: e.target.value }))
                        }
                        data-ocid="admin.input"
                        style={{
                          background: "oklch(var(--input))",
                          borderColor: "oklch(var(--border))",
                          color: "oklch(var(--foreground))",
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-foreground">विवरण</Label>
                    <Textarea
                      placeholder="सेवा का विवरण..."
                      value={form.description}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, description: e.target.value }))
                      }
                      rows={3}
                      data-ocid="admin.textarea"
                      style={{
                        background: "oklch(var(--input))",
                        borderColor: "oklch(var(--border))",
                        color: "oklch(var(--foreground))",
                      }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-foreground">मूल्य (₹) *</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={form.price || ""}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          price: Number(e.target.value),
                        }))
                      }
                      data-ocid="admin.input"
                      style={{
                        background: "oklch(var(--input))",
                        borderColor: "oklch(var(--border))",
                        color: "oklch(var(--foreground))",
                      }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveService}
                      className="flex-1 gap-2 font-semibold"
                      data-ocid="admin.save_button"
                      style={{
                        background: "oklch(var(--gold))",
                        color: "oklch(var(--primary-foreground))",
                      }}
                    >
                      <Save className="w-4 h-4" />
                      {editId !== null ? "अपडेट करें" : "सहेजें"}
                    </Button>
                    {editId !== null && (
                      <Button
                        variant="outline"
                        onClick={cancelEdit}
                        data-ocid="admin.cancel_button"
                        className="text-gold"
                        style={{ borderColor: "oklch(var(--border))" }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3" data-ocid="admin.list">
                <h2 className="text-base font-bold text-gold">
                  रेट लिस्ट ({services.length})
                </h2>
                {services.length === 0 ? (
                  <div
                    data-ocid="admin.empty_state"
                    className="text-center py-12 text-muted-foreground"
                  >
                    कोई सेवा नहीं
                  </div>
                ) : (
                  services.map((s, i) => (
                    <div
                      key={s.id}
                      data-ocid={`admin.item.${i + 1}`}
                      className="flex items-center gap-3 rounded-xl p-4"
                      style={{
                        background: "oklch(0.10 0.005 180)",
                        border: "1px solid oklch(var(--border))",
                      }}
                    >
                      <span className="text-2xl flex-shrink-0">{s.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {s.name}
                        </p>
                        <p className="text-xs text-gold">
                          ₹ {s.price.toLocaleString("hi-IN")}
                          {s.priceNote ? ` (${s.priceNote})` : ""}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => startEdit(s)}
                          data-ocid={`admin.edit_button.${i + 1}`}
                          className="w-8 h-8 text-muted-foreground hover:text-gold"
                          aria-label="संपादित करें"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              data-ocid={`admin.delete_button.${i + 1}`}
                              className="w-8 h-8 text-muted-foreground hover:text-destructive"
                              aria-label="हटाएं"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent
                            data-ocid="admin.dialog"
                            style={{
                              background: "oklch(var(--popover))",
                              border: "1px solid oklch(var(--gold-border))",
                              color: "oklch(var(--foreground))",
                            }}
                          >
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-foreground">
                                सेवा हटाएं?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-muted-foreground">
                                क्या आप "{s.name}" को हटाना चाहते हैं?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel
                                data-ocid="admin.cancel_button"
                                style={{
                                  background: "oklch(var(--secondary))",
                                  color: "oklch(var(--foreground))",
                                }}
                              >
                                रद्द करें
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteService(s.id)}
                                data-ocid="admin.confirm_button"
                                style={{
                                  background: "oklch(var(--destructive))",
                                  color: "#fff",
                                }}
                              >
                                हाँ, हटाएं
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          {/* GALLERY TAB */}
          <TabsContent value="gallery">
            <div className="space-y-8">
              <div className="rounded-2xl p-6" style={cardStyle}>
                <h2 className="text-base font-bold text-gold mb-5">
                  फ़ोटो अपलोड करें
                </h2>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-foreground">
                      कैप्शन (वैकल्पिक)
                    </Label>
                    <Input
                      placeholder="फ़ोटो का नाम / कैप्शन..."
                      value={galleryCaption}
                      onChange={(e) => setGalleryCaption(e.target.value)}
                      data-ocid="admin.input"
                      style={{
                        background: "oklch(var(--input))",
                        borderColor: "oklch(var(--border))",
                        color: "oklch(var(--foreground))",
                      }}
                    />
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    data-ocid="admin.upload_button"
                    className="w-full gap-2 font-semibold"
                    style={{
                      background: "oklch(var(--gold))",
                      color: "oklch(var(--primary-foreground))",
                    }}
                  >
                    <Upload className="w-4 h-4" />
                    {uploading ? "अपलोड हो रहा है..." : "फ़ोटो चुनें और अपलोड करें"}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    एक साथ कई फ़ोटो चुन सकते हैं
                  </p>
                </div>
              </div>

              {gallery.length === 0 ? (
                <div
                  data-ocid="admin.empty_state"
                  className="text-center py-16"
                >
                  <p className="text-4xl mb-3">🖼️</p>
                  <p className="text-muted-foreground">कोई फ़ोटो नहीं है।</p>
                </div>
              ) : (
                <div
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                  data-ocid="admin.list"
                >
                  {gallery.map((img, i) => (
                    <div
                      key={img.id}
                      data-ocid={`admin.item.${i + 1}`}
                      className="rounded-xl overflow-hidden"
                      style={{ border: "1px solid oklch(var(--border))" }}
                    >
                      <div className="relative aspect-square group">
                        <img
                          src={img.url}
                          alt={img.caption}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
                          style={{
                            background: "oklch(var(--background) / 0.7)",
                          }}
                        >
                          <Button
                            size="sm"
                            onClick={() => startEditImg(img)}
                            data-ocid={`admin.edit_button.${i + 1}`}
                            className="gap-1 text-xs"
                            style={{
                              background: "oklch(var(--gold))",
                              color: "oklch(var(--primary-foreground))",
                            }}
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                data-ocid={`admin.delete_button.${i + 1}`}
                                className="gap-1 text-xs"
                                style={{
                                  background: "oklch(var(--destructive))",
                                  color: "#fff",
                                }}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent
                              data-ocid="admin.dialog"
                              style={{
                                background: "oklch(var(--popover))",
                                border: "1px solid oklch(var(--gold-border))",
                                color: "oklch(var(--foreground))",
                              }}
                            >
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-foreground">
                                  फ़ोटो हटाएं?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-muted-foreground">
                                  क्या आप इस फ़ोटो को हटाना चाहते हैं?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel
                                  data-ocid="admin.cancel_button"
                                  style={{
                                    background: "oklch(var(--secondary))",
                                    color: "oklch(var(--foreground))",
                                  }}
                                >
                                  रद्द करें
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteImage(img.id)}
                                  data-ocid="admin.confirm_button"
                                  style={{
                                    background: "oklch(var(--destructive))",
                                    color: "#fff",
                                  }}
                                >
                                  हाँ, हटाएं
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                      {editImgId === img.id ? (
                        <div className="p-2 flex gap-2">
                          <Input
                            value={editCaption}
                            onChange={(e) => setEditCaption(e.target.value)}
                            className="text-xs h-7 flex-1"
                            style={{
                              background: "oklch(var(--input))",
                              borderColor: "oklch(var(--border))",
                              color: "oklch(var(--foreground))",
                            }}
                          />
                          <Button
                            size="icon"
                            onClick={saveEditImg}
                            className="w-7 h-7 flex-shrink-0"
                            style={{
                              background: "oklch(var(--gold))",
                              color: "oklch(var(--primary-foreground))",
                            }}
                          >
                            <Save className="w-3 h-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setEditImgId(null)}
                            className="w-7 h-7 flex-shrink-0 text-muted-foreground"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <p className="px-2 py-1.5 text-xs text-muted-foreground truncate">
                          {img.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* SETTINGS TAB */}
          <TabsContent value="settings">
            <div className="max-w-lg">
              <div className="rounded-2xl p-6 space-y-5" style={cardStyle}>
                <h2 className="text-base font-bold text-gold">दुकान की सेटिंग्स</h2>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-foreground">
                    फ़ोन नंबर
                  </Label>
                  <Input
                    value={settingsForm.phone}
                    onChange={(e) =>
                      setSettingsForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    data-ocid="admin.input"
                    style={{
                      background: "oklch(var(--input))",
                      borderColor: "oklch(var(--border))",
                      color: "oklch(var(--foreground))",
                    }}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-foreground">
                    WhatsApp नंबर
                  </Label>
                  <Input
                    value={settingsForm.whatsapp}
                    onChange={(e) =>
                      setSettingsForm((f) => ({
                        ...f,
                        whatsapp: e.target.value,
                      }))
                    }
                    data-ocid="admin.input"
                    style={{
                      background: "oklch(var(--input))",
                      borderColor: "oklch(var(--border))",
                      color: "oklch(var(--foreground))",
                    }}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-foreground">
                    पता
                  </Label>
                  <Textarea
                    value={settingsForm.address}
                    onChange={(e) =>
                      setSettingsForm((f) => ({
                        ...f,
                        address: e.target.value,
                      }))
                    }
                    rows={3}
                    data-ocid="admin.textarea"
                    style={{
                      background: "oklch(var(--input))",
                      borderColor: "oklch(var(--border))",
                      color: "oklch(var(--foreground))",
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-foreground">
                      अक्षांश (Lat)
                    </Label>
                    <Input
                      type="number"
                      step="any"
                      value={settingsForm.mapLat}
                      onChange={(e) =>
                        setSettingsForm((f) => ({
                          ...f,
                          mapLat: Number(e.target.value),
                        }))
                      }
                      data-ocid="admin.input"
                      style={{
                        background: "oklch(var(--input))",
                        borderColor: "oklch(var(--border))",
                        color: "oklch(var(--foreground))",
                      }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-foreground">
                      देशांतर (Lng)
                    </Label>
                    <Input
                      type="number"
                      step="any"
                      value={settingsForm.mapLng}
                      onChange={(e) =>
                        setSettingsForm((f) => ({
                          ...f,
                          mapLng: Number(e.target.value),
                        }))
                      }
                      data-ocid="admin.input"
                      style={{
                        background: "oklch(var(--input))",
                        borderColor: "oklch(var(--border))",
                        color: "oklch(var(--foreground))",
                      }}
                    />
                  </div>
                </div>
                <Button
                  onClick={handleSaveSettings}
                  size="lg"
                  className="w-full font-bold gap-2"
                  data-ocid="admin.save_button"
                  style={{
                    background: "oklch(var(--gold))",
                    color: "oklch(var(--primary-foreground))",
                  }}
                >
                  <Save className="w-4 h-4" /> सेटिंग्स सहेजें
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
