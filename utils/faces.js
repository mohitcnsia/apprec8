// utils/faces.js: the character faces a child can pick (owner, 16 Nov 2026). Chamak (our star) plus friendly icon faces
// on their own soft colour; the real cast drawings (owl, bee, tortoise…) can replace the icons later with the same ids.
// Dark mode: muted backgrounds (no bright colours on dark).
export const FACES = [
  { id: "chamak", mascot: true, bg: "#FFF4D6", fg: "#9A6B00", darkBg: "#3A2E12", darkFg: "#F2D48A" },
  { id: "rocket", icon: "rocket", bg: "#E6EEFB", fg: "#1B4E72", darkBg: "#1B2640", darkFg: "#A9C8F0" },
  { id: "planet", icon: "planet", bg: "#F3E6F4", fg: "#3b0940", darkBg: "#3A2340", darkFg: "#E6C3EA" },
  { id: "fish", icon: "fish", bg: "#DCF1F2", fg: "#13606A", darkBg: "#16343A", darkFg: "#9ED8DE" },
  { id: "paw", icon: "paw", bg: "#FFE9D6", fg: "#8A4A00", darkBg: "#3A2414", darkFg: "#F2C08A" },
  { id: "leaf", icon: "leaf", bg: "#E6F6E4", fg: "#1E5E1B", darkBg: "#1F3322", darkFg: "#A8DCA5" },
  { id: "football", icon: "football", bg: "#FCE8E6", fg: "#8E2A22", darkBg: "#3A1E1C", darkFg: "#F0B2AC" },
  { id: "music", icon: "musical-notes", bg: "#EDE7FB", fg: "#4B2E83", darkBg: "#2A2340", darkFg: "#C9B8F2" },
  { id: "flower", icon: "flower", bg: "#FDE7F1", fg: "#8A1C4F", darkBg: "#3A1C2A", darkFg: "#F2B0CF" },
  { id: "bulb", icon: "bulb", bg: "#FFF6D1", fg: "#7A5A00", darkBg: "#3A3214", darkFg: "#F2DE8A" },
];
export const FACE_IDS = FACES.map((f) => f.id);
export const faceById = (id) => FACES.find((f) => f.id === id) || null;
