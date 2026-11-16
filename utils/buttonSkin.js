// utils/buttonSkin.js: the three button styles from the owner-approved mockup "Apprec8 buttons" (16 Nov 2026).
// A · Soft (default): light tinted fills, round. B · Bold: solid with a pressable 3D edge. C · Clean: outlines, flat.
// Pure (no React Native imports) so it can be tested; components/common/AppButton.js turns it into a button.
// Dark mode: no bright colours (owner 2026-11-05: "nothing bright may jump out of the dark theme").

export const SKINS = ["A", "B", "C"];
export const SKIN_NAMES = { A: "Soft", B: "Bold", C: "Clean" };
export const HANDS = ["right", "left"];

const LIGHT = {
  primary: "#3b0940", onPrimary: "#FFFFFF",
  soft: "#F3E6F4", onSoft: "#3b0940",
  danger: "#FCE8E6", onDanger: "#B3261E", dangerLine: "#E7A39C",
  line: "#CDB5D0", plain: "#FFFFFF",
  boldPrimary: "#85508A", boldPrimaryEdge: "#4E1A53",
  boldSoft: "#E9D6EB", boldSoftEdge: "#C9AECD",
  boldDanger: "#F6D3CF", boldDangerEdge: "#DFA59F", onBoldDanger: "#8C1D16",
  shadow: "rgba(59,9,64,0.25)",
};
const DARK = {
  primary: "#8A5A90", onPrimary: "#FFFFFF",
  soft: "#3A2340", onSoft: "#F5D2F8",
  danger: "#4A2523", onDanger: "#F2B8B3", dangerLine: "#7A3B37",
  line: "#5A4560", plain: "transparent",
  boldPrimary: "#7A4A80", boldPrimaryEdge: "#4A2A4E",
  boldSoft: "#3A2340", boldSoftEdge: "#24142A",
  boldDanger: "#4A2523", boldDangerEdge: "#2E1513", onBoldDanger: "#F2B8B3",
  shadow: "rgba(0,0,0,0.4)",
};

const SIZES = {
  lg: { h: 56, pad: 22, font: 17, icon: 22, round: 60 }, // the screen's one main button
  md: { h: 44, pad: 16, font: 15, icon: 18, round: 48 },
  sm: { h: 36, pad: 14, font: 14, icon: 16, round: 44 }, // chips; the tap area stays ≥ 44 (hitSlop in the component)
};

/**
 * → { box, text, iconColor, iconSize, edge, pressedBox } plain style objects.
 * variant: "primary" | "soft" | "danger" | "chip"; iconOnly: a round (A, C) or rounded-square (B) icon button.
 */
export function buttonLook({ skin = "A", variant = "primary", size = "md", isDark = false, iconOnly = false, selected = false }) {
  const c = isDark ? DARK : LIGHT;
  const s = SIZES[size] || SIZES.md;
  const k = SKINS.includes(skin) ? skin : "A";
  const v = variant === "chip" ? (selected ? "primary" : "soft") : variant;

  // Owner 16 Nov: A and C looked the same. A = round with a soft ring; B = rounded square with a 3D edge; C = flat
  // rounded square (no ring, no edge).
  const radius = iconOnly
    ? k === "A" ? s.round / 2 : Math.round(s.round / 3.2)
    : k === "A" ? s.h / 2 : k === "B" ? (size === "sm" ? 12 : 16) : size === "sm" ? 10 : 12;
  const dims = iconOnly ? { width: s.round, height: s.round } : { height: s.h, paddingHorizontal: s.pad };

  let bg, fg, border = null, edge = null;
  if (k === "B") {
    bg = v === "primary" ? c.boldPrimary : v === "danger" ? c.boldDanger : c.boldSoft;
    fg = v === "primary" ? c.onPrimary : v === "danger" ? c.onBoldDanger : c.onSoft;
    edge = v === "primary" ? c.boldPrimaryEdge : v === "danger" ? c.boldDangerEdge : c.boldSoftEdge;
  } else if (k === "C") {
    bg = v === "primary" ? c.primary : c.plain;
    fg = v === "primary" ? c.onPrimary : v === "danger" ? c.onDanger : c.onSoft;
    border = v === "primary" ? null : v === "danger" ? c.dangerLine : c.line;
  } else {
    bg = v === "primary" ? c.primary : v === "danger" ? c.danger : c.soft;
    fg = v === "primary" ? c.onPrimary : v === "danger" ? c.onDanger : c.onSoft;
  }

  const box = {
    ...dims,
    borderRadius: radius,
    backgroundColor: bg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...(border ? { borderWidth: 1.5, borderColor: border } : {}),
    ...(edge ? { borderBottomWidth: size === "sm" ? 3 : 4, borderBottomColor: edge } : {}),
    // A: a soft ring + lift around the main action.
    ...(k === "A" && v === "primary" ? { borderWidth: 3, borderColor: isDark ? c.soft : c.soft } : {}),
    ...(k === "A" && v === "primary" && (size === "lg" || iconOnly) ? { shadowColor: "#000", shadowOpacity: 0.18, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 4 } : {}),
  };
  const pressedBox = k === "B" ? { borderBottomWidth: 1, transform: [{ translateY: 3 }] } : { opacity: 0.85, transform: [{ scale: 0.97 }] };
  const text = { color: fg, fontSize: s.font, fontFamily: "nunitoBold" };
  return { box, text, iconColor: fg, iconSize: iconOnly ? s.icon + 4 : s.icon, edge, pressedBox };
}

/** Where the main action sits: on the side of the thumb (owner: left-handed children exist). */
export const thumbAlign = (hand) => (hand === "left" ? "flex-start" : "flex-end");
