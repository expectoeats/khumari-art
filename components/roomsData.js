// Room visualizer presets for Kala Samputah atelier
export const ROOM_CATEGORIES = [
  { id: "all", label: "All Rooms" },
  { id: "living", label: "Living Room" },
  { id: "bedroom", label: "Bedroom" },
  { id: "dining", label: "Dining" },
  { id: "foyer", label: "Entry & Daybed" },
];

export const ROOMS_DATA = [
  // Living Room
  {
    id: "minimalist-beige-living",
    title: "Minimalist Beige Living",
    category: "living",
    src: "/rooms/Minimalist%20Beige%20Living%20Room.png",
    defaultPos: { x: 50, y: 38 },
    lighting: "warm-neutral",
  },
  {
    id: "sage-green-scandinavian",
    title: "Sage Green Scandinavian",
    category: "living",
    src: "/rooms/Sage%20Green%20Scandinavian%20Living%20Room.png",
    defaultPos: { x: 50, y: 38 },
    lighting: "soft-daylight",
  },
  {
    id: "serene-living-palm",
    title: "Serene Living with Palm",
    category: "living",
    src: "/rooms/Serene%20Minimalist%20Living%20Room%20with%20Palm.png",
    defaultPos: { x: 50, y: 38 },
    lighting: "warm-neutral",
  },
  {
    id: "scandinavian-living-study",
    title: "Living & Study Nook",
    category: "living",
    src: "/rooms/Scandinavian%20Living%20Study%20Nook.png",
    defaultPos: { x: 50, y: 38 },
    lighting: "soft-daylight",
  },
  {
    id: "warm-minimalist-living-oasis",
    title: "Warm Living Oasis",
    category: "living",
    src: "/rooms/Warm%20Minimalist%20Living%20Room%20Oasis.png",
    defaultPos: { x: 50, y: 38 },
    lighting: "warm-sunlight",
  },

  // Bedroom
  {
    id: "calm-modern-bedroom",
    title: "Warm Neutrals Bedroom",
    category: "bedroom",
    src: "/rooms/Calm%20Modern%20Bedroom%20in%20Warm%20Neutrals.png",
    defaultPos: { x: 50, y: 36 },
    lighting: "warm-neutral",
  },
  {
    id: "calm-scandinavian-blue-bedroom",
    title: "Scandinavian Blue Bedroom",
    category: "bedroom",
    src: "/rooms/Calm%20Scandinavian%20Bedroom%20in%20Blue%20Tones.png",
    defaultPos: { x: 50, y: 36 },
    lighting: "cool-daylight",
  },
  {
    id: "serene-minimalist-bedroom",
    title: "Serene Bedroom Retreat",
    category: "bedroom",
    src: "/rooms/Serene%20Minimalist%20Bedroom%20Retreat.png",
    defaultPos: { x: 50, y: 36 },
    lighting: "warm-neutral",
  },
  {
    id: "serene-bedroom-palm",
    title: "Bedroom with Palm Plant",
    category: "bedroom",
    src: "/rooms/Serene%20Minimalist%20Bedroom%20with%20Palm%20Plant.png",
    defaultPos: { x: 50, y: 36 },
    lighting: "soft-daylight",
  },
  {
    id: "warm-blush-bedroom",
    title: "Warm Blush Bedroom",
    category: "bedroom",
    src: "/rooms/Warm%20Blush%20Minimalist%20Bedroom.png",
    defaultPos: { x: 50, y: 36 },
    lighting: "warm-sunlight",
  },
  {
    id: "warm-minimalist-bedroom-retreat",
    title: "Warm Minimalist Retreat",
    category: "bedroom",
    src: "/rooms/Warm%20Minimalist%20Bedroom%20Retreat.png",
    defaultPos: { x: 50, y: 36 },
    lighting: "warm-neutral",
  },

  // Dining
  {
    id: "minimalist-dining-warm-wood",
    title: "Warm Wood Dining Room",
    category: "dining",
    src: "/rooms/Minimalist%20Dining%20Room%20with%20Warm%20Wood%20Accents.png",
    defaultPos: { x: 50, y: 37 },
    lighting: "warm-sunlight",
  },
  {
    id: "scandinavian-dining-greenery",
    title: "Dining with Greenery",
    category: "dining",
    src: "/rooms/Scandinavian%20Dining%20Room%20with%20Greenery.png",
    defaultPos: { x: 50, y: 37 },
    lighting: "soft-daylight",
  },

  // Foyer & Daybed
  {
    id: "minimalist-warm-wood-entryway",
    title: "Warm Wood Entryway Foyer",
    category: "foyer",
    src: "/rooms/Minimalist%20Warm%20Wood%20Entryway.png",
    defaultPos: { x: 50, y: 36 },
    lighting: "warm-neutral",
  },
  {
    id: "serene-sage-daybed",
    title: "Serene Sage Daybed",
    category: "foyer",
    src: "/rooms/Serene%20Sage%20Daybed%20Interior.png",
    defaultPos: { x: 50, y: 37 },
    lighting: "soft-daylight",
  },
];

export const FRAME_STYLES = [
  {
    id: "canvas",
    name: "Gallery Canvas Wrap",
    subtitle: "Frameless 3D wrap",
    borderCss: "none",
    paddingCss: "0px",
    frameColor: "transparent",
    shadowCss: "0 28px 70px rgba(0,0,0,0.4), 0 10px 28px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.18)",
  },
  {
    id: "black-oak",
    name: "Matte Black Floating",
    subtitle: "14mm slim black wood",
    borderCss: "10px solid #141414",
    paddingCss: "4px",
    frameColor: "#0D0D0D",
    shadowCss: "0 30px 75px rgba(0,0,0,0.5), 0 12px 30px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.08)",
  },
  {
    id: "teak-wood",
    name: "Natural Indian Teak",
    subtitle: "Warm organic wood",
    borderCss: "12px solid #8E623E",
    paddingCss: "4px",
    frameColor: "#784F2E",
    shadowCss: "0 30px 75px rgba(0,0,0,0.45), 0 12px 30px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.2)",
  },
  {
    id: "champagne-gold",
    name: "Champagne Gold Atelier",
    subtitle: "Luxury brushed gold",
    borderCss: "12px solid #C5A059",
    paddingCss: "4px",
    frameColor: "#AA8035",
    shadowCss: "0 32px 80px rgba(0,0,0,0.48), 0 12px 32px rgba(0,0,0,0.28), inset 0 0 0 1px rgba(255,255,255,0.35)",
  },
  {
    id: "gallery-white",
    name: "Studio Gallery White",
    subtitle: "Crisp architectural white",
    borderCss: "12px solid #F5F2EB",
    paddingCss: "4px",
    frameColor: "#EAE5DC",
    shadowCss: "0 28px 70px rgba(0,0,0,0.38), 0 10px 28px rgba(0,0,0,0.22), inset 0 0 0 1px rgba(0,0,0,0.06)",
  },
];

export const SCALE_PRESETS = [
  { id: "small", label: "Small (24×30 in)", percent: 20 },
  { id: "medium", label: "Medium (36×48 in)", percent: 28 },
  { id: "large", label: "Large (48×60 in)", percent: 38 },
  { id: "oversized", label: "Statement (60×72 in)", percent: 48 },
];

export const LIGHTING_MODES = [
  { id: "natural", label: "Natural Day", filter: "none", overlay: "transparent" },
  { id: "warm", label: "Warm Sunlight", filter: "sepia(0.12) saturate(1.08)", overlay: "rgba(255,220,160,0.06)" },
  { id: "evening", label: "Evening Glow", filter: "brightness(0.92) contrast(1.04)", overlay: "rgba(40,25,15,0.18)" },
];
