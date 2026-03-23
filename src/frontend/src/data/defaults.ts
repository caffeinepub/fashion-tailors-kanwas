export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  icon: string;
  priceNote?: string;
  image?: string;
}

export interface GalleryImage {
  id: number;
  url: string;
  caption: string;
}

export interface ShopSettings {
  phone: string;
  whatsapp: string;
  address: string;
  mapLat: number;
  mapLng: number;
}

export const defaultServices: Service[] = [
  {
    id: 1,
    name: "बच्चों के कपड़े",
    description: "लड़कों के लिए कस्टम सिलाई, सभी प्रकार के कपड़े",
    price: 500,
    icon: "👦",
    priceNote: "सिलाई",
    image: "/assets/generated/gents-bachon-kapde.dim_400x400.jpg",
  },
  {
    id: 2,
    name: "बड़ों के कपड़े",
    description: "सभी प्रकार के गेंट्स कपड़ों की सिलाई",
    price: 700,
    icon: "🧵",
    priceNote: "सिलाई",
    image: "/assets/generated/gents-coat-pant.dim_400x400.jpg",
  },
  {
    id: 3,
    name: "कोट पेंट",
    description: "प्रीमियम कपड़े सहित, बेहतरीन फिटिंग",
    price: 4000,
    icon: "🧥",
    priceNote: "कपड़े सहित",
    image: "/assets/generated/gents-coat-pant.dim_400x400.jpg",
  },
  {
    id: 4,
    name: "3 पीस कोट पेंट",
    description: "कोट, पेंट और वेस्टकोट, उच्च गुणवत्ता कपड़े सहित",
    price: 5000,
    icon: "👔",
    priceNote: "कपड़े सहित",
    image: "/assets/generated/gents-3piece-suit.dim_400x400.jpg",
  },
  {
    id: 5,
    name: "डबल ब्रेस्टेड",
    description: "क्लासिक डबल ब्रेस्टेड सूट, प्रीमियम कपड़े सहित",
    price: 5000,
    icon: "🎩",
    priceNote: "कपड़े सहित",
    image: "/assets/generated/gents-double-breasted.dim_400x400.jpg",
  },
  {
    id: 6,
    name: "हंटिंग कोट पेंट",
    description: "स्टाइलिश हंटिंग स्टाइल, बेहतरीन कपड़े सहित",
    price: 6000,
    icon: "🏇",
    priceNote: "कपड़े सहित",
    image: "/assets/generated/gents-hunting-coat.dim_400x400.jpg",
  },
  {
    id: 7,
    name: "हंटिंग जैकेट",
    description: "हंटिंग स्टाइल जैकेट, उच्च गुणवत्ता कपड़े सहित",
    price: 1700,
    icon: "🧤",
    priceNote: "कपड़े सहित",
    image: "/assets/generated/gents-hunting-coat.dim_400x400.jpg",
  },
  {
    id: 8,
    name: "सादा कोठी",
    description: "सादा और सुंदर कोठी, कस्टम सिलाई",
    price: 1200,
    icon: "👘",
    priceNote: "सिलाई",
    image: "/assets/generated/gents-sada-kothi.dim_400x400.jpg",
  },
  {
    id: 9,
    name: "जोधपुरी सूट",
    description: "राजस्थानी परंपरागत जोधपुरी सूट, प्रीमियम कपड़े सहित",
    price: 3000,
    icon: "👑",
    priceNote: "कपड़े सहित",
    image: "/assets/generated/gents-jodhpuri-suit.dim_400x400.jpg",
  },
  {
    id: 10,
    name: "कुर्ता पायजामा",
    description: "आरामदायक और स्टाइलिश, उच्च गुणवत्ता कपड़े सहित",
    price: 1200,
    icon: "🥻",
    priceNote: "कपड़े सहित",
    image: "/assets/generated/gents-kurta-pajama.dim_400x400.jpg",
  },
];

export const defaultGallery: GalleryImage[] = [
  {
    id: 1,
    url: "/assets/generated/gents-coat-pant.dim_400x400.jpg",
    caption: "कोट पेंट",
  },
  {
    id: 2,
    url: "/assets/generated/gents-3piece-suit.dim_400x400.jpg",
    caption: "3 पीस सूट",
  },
  {
    id: 3,
    url: "/assets/generated/gents-jodhpuri-suit.dim_400x400.jpg",
    caption: "जोधपुरी सूट",
  },
  {
    id: 4,
    url: "/assets/generated/gents-kurta-pajama.dim_400x400.jpg",
    caption: "कुर्ता पायजामा",
  },
  {
    id: 5,
    url: "/assets/generated/gents-hunting-coat.dim_400x400.jpg",
    caption: "हंटिंग कोट",
  },
  {
    id: 6,
    url: "/assets/generated/gents-double-breasted.dim_400x400.jpg",
    caption: "डबल ब्रेस्टेड",
  },
  {
    id: 7,
    url: "/assets/generated/gents-sada-kothi.dim_400x400.jpg",
    caption: "सादा कोठी",
  },
  {
    id: 8,
    url: "/assets/generated/gents-bachon-kapde.dim_400x400.jpg",
    caption: "बच्चों के कपड़े",
  },
];

export const defaultSettings: ShopSettings = {
  phone: "+91 97856 68531",
  whatsapp: "919785668531",
  address: "फैशन टेलर्स कनवास, मुख्य बाजार, कनवास, राजस्थान 465661",
  mapLat: 24.867629,
  mapLng: 76.125418,
};
