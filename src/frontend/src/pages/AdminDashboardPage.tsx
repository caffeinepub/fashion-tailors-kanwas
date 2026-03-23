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
  Camera,
  Edit2,
  Image,
  ImagePlus,
  Loader2,
  LogOut,
  Plus,
  RefreshCw,
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
  image: "",
};

// Auto-generate image URL from service name
const getAutoImage = (name: string): string => {
  const keywords: Record<string, string> = {
    जोधपुरी: "jodhpuri+suit+royal+men",
    कोट: "mens+coat+pant+formal",
    "3 पीस": "three+piece+suit+men+formal",
    कुर्ता: "mens+kurta+pajama+traditional",
    शेरवानी: "mens+sherwani+wedding",
    बच्चे: "boys+kids+suit+fashion",
    बच्चों: "boys+kids+suit",
    पेंट: "mens+formal+trousers",
    सूट: "mens+suit+formal",
    पायजामा: "mens+kurta+pajama",
    हंटिंग: "mens+hunting+jacket",
    कोठी: "mens+kurta+traditional",
  };
  for (const [key, val] of Object.entries(keywords)) {
    if (name.includes(key))
      return `https://source.unsplash.com/400x300/?${val}`;
  }
  return `https://source.unsplash.com/400x300/?mens+${encodeURIComponent(name)},fashion`;
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
  const [saving, setSaving] = useState(false);
  const [galleryCaption, setGalleryCaption] = useState("");
  const [settingsForm, setSettingsForm] = useState<ShopSettings>(settings);
  // For gallery photo editing
  const [editImgId, setEditImgId] = useState<number | null>(null);
  const [editCaption, setEditCaption] = useState("");
  const [editImgUrl, setEditImgUrl] = useState("");
  const [fullscreenImg, setFullscreenImg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryCameraRef = useRef<HTMLInputElement>(null);
  const galleryFileRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const editImgCameraRef = useRef<HTMLInputElement>(null);
  const editImgFileRef = useRef<HTMLInputElement>(null);
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

    setSaving(true);
    const finalImage = (form.image ?? "").trim() || getAutoImage(form.name);
    const finalForm = { ...form, image: finalImage };

    setTimeout(() => {
      if (editId !== null) {
        setServices((prev) =>
          prev.map((s) => (s.id === editId ? { ...s, ...finalForm } : s)),
        );
        setEditId(null);
        toast.success("✅ सेवा अपडेट हुई!");
      } else {
        setServices((prev) => [...prev, { id: Date.now(), ...finalForm }]);
        toast.success("✅ सेवा जोड़ी गई!");
      }
      setForm(EMPTY_SERVICE);
      setSaving(false);
    }, 600);
  };

  const editFormRef = useRef<HTMLDivElement>(null);

  const startEdit = (s: Service) => {
    setEditId(s.id);
    setForm({
      name: s.name,
      description: s.description,
      price: s.price,
      icon: s.icon,
      image: s.image || "",
    });
    setTimeout(() => {
      editFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm(EMPTY_SERVICE);
  };

  const handleDeleteService = (id: number) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    toast.success("🗑️ सेवा हटाई गई");
  };

  // Compress image to max 800px and 75% quality to avoid localStorage overflow
  const handleImageFile = (file: File, setter: (url: string) => void) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new window.Image();
      img.onload = () => {
        const MAX = 800;
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          if (width > height) {
            height = Math.round((height / width) * MAX);
            width = MAX;
          } else {
            width = Math.round((width / height) * MAX);
            height = MAX;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setter(ev.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL("image/jpeg", 0.75);
        setter(compressed);
      };
      img.onerror = () => setter(ev.target?.result as string);
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleImageFile(file, (url) => setForm((f) => ({ ...f, image: url })));
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleImageFile(file, (url) => setForm((f) => ({ ...f, image: url })));
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  };

  // Gallery upload handlers
  const handleGalleryUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    let count = 0;
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
        count++;
        if (count >= files.length) {
          toast.success(`${count} फ़ोटो अपलोड हुई ✓`);
          setUploading(false);
          setGalleryCaption("");
        }
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (galleryCameraRef.current) galleryCameraRef.current.value = "";
    if (galleryFileRef.current) galleryFileRef.current.value = "";
  };

  const handleDeleteImage = (id: number) => {
    setGallery((prev) => prev.filter((g) => g.id !== id));
    toast.success("🗑️ फ़ोटो हटाई गई");
  };

  // Gallery edit: open edit mode for caption + photo replacement
  const startEditImg = (img: GalleryImage) => {
    setEditImgId(img.id);
    setEditCaption(img.caption);
    setEditImgUrl(img.url);
  };

  const handleEditImgFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleImageFile(file, (url) => setEditImgUrl(url));
    if (editImgCameraRef.current) editImgCameraRef.current.value = "";
    if (editImgFileRef.current) editImgFileRef.current.value = "";
  };

  const saveEditImg = () => {
    setGallery((prev) =>
      prev.map((g) =>
        g.id === editImgId
          ? { ...g, caption: editCaption, url: editImgUrl }
          : g,
      ),
    );
    setEditImgId(null);
    setEditCaption("");
    setEditImgUrl("");
    toast.success("फ़ोटो अपडेट हुई ✓");
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
      {/* Fullscreen image preview overlay */}
      {fullscreenImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.95)" }}
          onClick={() => setFullscreenImg(null)}
          onKeyDown={(e) => e.key === "Escape" && setFullscreenImg(null)}
          data-ocid="admin.modal"
        >
          <img
            src={fullscreenImg}
            alt="पूर्ण आकार"
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            style={{ border: "2px solid oklch(var(--gold-border))" }}
          />
          <button
            type="button"
            className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-gold transition-colors"
            onClick={() => setFullscreenImg(null)}
            data-ocid="admin.close_button"
            aria-label="बंद करें"
          >
            ✕
          </button>
        </div>
      )}

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
              {/* Add/Edit Form */}
              <div
                className="rounded-2xl p-6"
                style={cardStyle}
                ref={editFormRef}
              >
                <h2 className="text-base font-bold text-gold mb-5">
                  {editId !== null ? "✏️ सेवा संपादित करें" : "➕ नई सेवा / रेट जोड़ें"}
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

                  {/* Image upload — camera + gallery */}
                  <div className="space-y-2">
                    <Label className="text-xs text-foreground">
                      सेवा की फ़ोटो (वैकल्पिक)
                    </Label>

                    <input
                      ref={cameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={handleCameraCapture}
                    />
                    <input
                      ref={galleryInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleGallerySelect}
                    />

                    {form.image ? (
                      <div
                        className="relative w-full rounded-xl overflow-hidden"
                        style={{
                          border: "2px solid oklch(var(--gold-border))",
                        }}
                      >
                        <img
                          src={form.image}
                          alt="सेवा की फ़ोटो"
                          className="w-full h-44 object-cover"
                        />
                        <div
                          className="absolute inset-0 flex items-center justify-center gap-2"
                          style={{ background: "rgba(0,0,0,0.45)" }}
                        >
                          <Button
                            size="sm"
                            onClick={() => cameraInputRef.current?.click()}
                            data-ocid="admin.upload_button"
                            className="gap-1 text-xs"
                            style={{
                              background: "oklch(var(--gold))",
                              color: "#0b0b0b",
                            }}
                          >
                            <Camera className="w-3.5 h-3.5" /> कैमरा
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => galleryInputRef.current?.click()}
                            data-ocid="admin.upload_button"
                            className="gap-1 text-xs"
                            style={{
                              background: "oklch(var(--gold))",
                              color: "#0b0b0b",
                            }}
                          >
                            <ImagePlus className="w-3.5 h-3.5" /> गैलरी
                          </Button>
                          <Button
                            size="sm"
                            onClick={() =>
                              setForm((f) => ({ ...f, image: "" }))
                            }
                            data-ocid="admin.delete_button"
                            className="gap-1 text-xs"
                            style={{
                              background: "oklch(var(--destructive))",
                              color: "#fff",
                            }}
                          >
                            <X className="w-3.5 h-3.5" /> हटाएं
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => cameraInputRef.current?.click()}
                            data-ocid="admin.upload_button"
                            className="h-20 rounded-xl flex flex-col items-center justify-center gap-2 transition-all hover:opacity-80 active:scale-95"
                            style={{
                              background: "oklch(var(--input))",
                              border: "2px dashed oklch(var(--gold-border))",
                              color: "oklch(var(--muted-foreground))",
                            }}
                          >
                            <Camera className="w-6 h-6 text-gold" />
                            <span className="text-xs font-medium">
                              📷 कैमरा से खींचें
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => galleryInputRef.current?.click()}
                            data-ocid="admin.upload_button"
                            className="h-20 rounded-xl flex flex-col items-center justify-center gap-2 transition-all hover:opacity-80 active:scale-95"
                            style={{
                              background: "oklch(var(--input))",
                              border: "2px dashed oklch(var(--gold-border))",
                              color: "oklch(var(--muted-foreground))",
                            }}
                          >
                            <ImagePlus className="w-6 h-6 text-gold" />
                            <span className="text-xs font-medium">
                              🖼️ गैलरी से चुनें
                            </span>
                          </button>
                        </div>
                        <p
                          className="text-xs text-center"
                          style={{ color: "oklch(var(--gold))" }}
                        >
                          🤖 फ़ोटो नहीं चुनी तो ऑटो इमेज लग जाएगी
                        </p>
                      </div>
                    )}
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
                      disabled={saving}
                      className="flex-1 gap-2 font-semibold"
                      data-ocid="admin.save_button"
                      style={{
                        background: saving
                          ? "oklch(var(--muted))"
                          : "oklch(var(--gold))",
                        color: "oklch(var(--primary-foreground))",
                      }}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          सहेज रहे हैं...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          {editId !== null ? "अपडेट करें" : "सहेजें"}
                        </>
                      )}
                    </Button>
                    {editId !== null && (
                      <Button
                        variant="outline"
                        onClick={cancelEdit}
                        disabled={saving}
                        data-ocid="admin.cancel_button"
                        className="text-gold"
                        style={{ borderColor: "oklch(var(--border))" }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {saving && (
                    <div
                      data-ocid="admin.loading_state"
                      className="flex items-center justify-center gap-2 py-1"
                      style={{ color: "oklch(var(--gold))" }}
                    >
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-xs">सहेजा जा रहा है...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Services List */}
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
                      className="flex items-center gap-3 rounded-xl p-3"
                      style={{
                        background: "oklch(0.10 0.005 180)",
                        border: "1px solid oklch(var(--border))",
                      }}
                    >
                      {s.image ? (
                        <img
                          src={s.image}
                          alt={s.name}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <span className="text-2xl flex-shrink-0">{s.icon}</span>
                      )}
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
                          className="w-8 h-8 text-gold hover:text-gold hover:bg-gold/10"
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
                                क्या आप &quot;{s.name}&quot; को हटाना चाहते हैं?
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
              {/* Upload section */}
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

                  {/* Hidden file inputs */}
                  <input
                    ref={galleryCameraRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => handleGalleryUpload(e.target.files)}
                  />
                  <input
                    ref={galleryFileRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleGalleryUpload(e.target.files)}
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleGalleryUpload(e.target.files)}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => galleryCameraRef.current?.click()}
                      disabled={uploading}
                      className="h-20 rounded-xl flex flex-col items-center justify-center gap-2 transition-all hover:opacity-80 active:scale-95"
                      style={{
                        background: "oklch(var(--input))",
                        border: "2px dashed oklch(var(--gold-border))",
                      }}
                    >
                      <Camera className="w-7 h-7 text-gold" />
                      <span className="text-xs font-semibold text-foreground">
                        📷 कैमरा से खींचें
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => galleryFileRef.current?.click()}
                      disabled={uploading}
                      className="h-20 rounded-xl flex flex-col items-center justify-center gap-2 transition-all hover:opacity-80 active:scale-95"
                      style={{
                        background: "oklch(var(--input))",
                        border: "2px dashed oklch(var(--gold-border))",
                      }}
                    >
                      <ImagePlus className="w-7 h-7 text-gold" />
                      <span className="text-xs font-semibold text-foreground">
                        🖼️ गैलरी से चुनें
                      </span>
                    </button>
                  </div>
                  {uploading && (
                    <div
                      className="flex items-center justify-center gap-2 py-1"
                      style={{ color: "oklch(var(--gold))" }}
                    >
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-xs">अपलोड हो रहा है...</span>
                    </div>
                  )}
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
                      style={{
                        border:
                          editImgId === img.id
                            ? "2px solid oklch(var(--gold-border))"
                            : "1px solid oklch(var(--border))",
                      }}
                    >
                      {/* Image */}
                      <div
                        className="aspect-square relative overflow-hidden cursor-pointer"
                        onClick={() =>
                          editImgId !== img.id && setFullscreenImg(img.url)
                        }
                        onKeyDown={(e) =>
                          e.key === "Enter" && setFullscreenImg(img.url)
                        }
                      >
                        <img
                          src={editImgId === img.id ? editImgUrl : img.url}
                          alt={img.caption}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>

                      {/* Edit mode */}
                      {editImgId === img.id ? (
                        <div
                          className="p-2 space-y-2"
                          style={{ background: "oklch(0.10 0.005 180)" }}
                        >
                          {/* Photo replacement buttons */}
                          <input
                            ref={editImgCameraRef}
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            onChange={handleEditImgFile}
                          />
                          <input
                            ref={editImgFileRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleEditImgFile}
                          />
                          <div className="grid grid-cols-2 gap-1">
                            <button
                              type="button"
                              onClick={() => editImgCameraRef.current?.click()}
                              className="h-8 rounded-lg flex items-center justify-center gap-1 text-xs font-semibold"
                              style={{
                                background: "oklch(0.15 0.01 90)",
                                border: "1px solid oklch(var(--gold-border))",
                                color: "oklch(var(--gold))",
                              }}
                            >
                              <Camera className="w-3 h-3" /> कैमरा
                            </button>
                            <button
                              type="button"
                              onClick={() => editImgFileRef.current?.click()}
                              className="h-8 rounded-lg flex items-center justify-center gap-1 text-xs font-semibold"
                              style={{
                                background: "oklch(0.15 0.01 90)",
                                border: "1px solid oklch(var(--gold-border))",
                                color: "oklch(var(--gold))",
                              }}
                            >
                              <ImagePlus className="w-3 h-3" /> गैलरी
                            </button>
                          </div>
                          {/* Caption edit */}
                          <Input
                            value={editCaption}
                            onChange={(e) => setEditCaption(e.target.value)}
                            placeholder="कैप्शन..."
                            className="text-xs h-7"
                            style={{
                              background: "oklch(var(--input))",
                              borderColor: "oklch(var(--border))",
                              color: "oklch(var(--foreground))",
                            }}
                          />
                          {/* Save/Cancel */}
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              onClick={saveEditImg}
                              className="flex-1 h-7 text-xs gap-1 font-semibold"
                              style={{
                                background: "oklch(var(--gold))",
                                color: "#0b0b0b",
                              }}
                            >
                              <Save className="w-3 h-3" /> सहेजें
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditImgId(null);
                                setEditImgUrl("");
                              }}
                              className="h-7 text-xs text-muted-foreground"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // Normal mode: always-visible action buttons
                        <div style={{ background: "oklch(0.10 0.005 180)" }}>
                          <div className="flex gap-1.5 px-2 pt-2">
                            <Button
                              size="sm"
                              onClick={() => startEditImg(img)}
                              data-ocid={`admin.edit_button.${i + 1}`}
                              className="flex-1 gap-1 text-xs h-7 font-semibold"
                              style={{
                                background: "oklch(var(--gold))",
                                color: "#0b0b0b",
                              }}
                            >
                              <Edit2 className="w-3 h-3" /> एडिट
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  data-ocid={`admin.delete_button.${i + 1}`}
                                  className="flex-1 gap-1 text-xs h-7 font-semibold"
                                  style={{
                                    background: "oklch(var(--destructive))",
                                    color: "#fff",
                                  }}
                                >
                                  <Trash2 className="w-3 h-3" /> हटाएं
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
                          <p className="px-2 py-1.5 text-xs text-muted-foreground truncate">
                            {img.caption}
                          </p>
                        </div>
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
