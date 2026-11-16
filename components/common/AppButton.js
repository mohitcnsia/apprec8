// components/common/AppButton.js: the one button for every screen (owner-approved mockup "Apprec8 buttons", 16 Nov 2026).
// Icons first, words only when needed; three styles the user picks in Me → Look (utils/buttonSkin.js); as wide as its
// words, never a full-width bar. Icon-only buttons always carry a spoken label (accessibilityLabel).
//
//   <AppButton label="Continue" icon="arrow-forward" iconSide="right" size="lg" onPress={…} />   main action
//   <AppButton icon="checkmark" size="lg" accessibilityLabel="Check" onPress={…} />                round icon button
//   <AppButton label="Again" icon="refresh" variant="soft" onPress={…} />
//   <AppButton label="Class 5" variant="chip" selected size="sm" onPress={…} />
//   <MainAction>…</MainAction>  puts the screen's main button on the side of the thumb (Me → Look → Hand).
import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "../../context/ThemeContext";
import { buttonLook } from "../../utils/buttonSkin";
import { useLook } from "../../services/lookSettings";

export default function AppButton({
  label,
  icon,
  iconSide = "left",
  variant = "primary",
  size = "md",
  selected = false,
  busy = false,
  disabled = false,
  onPress,
  accessibilityLabel,
  style,
  testID,
}) {
  const { isDark } = useTheme();
  const { skin } = useLook();
  const iconOnly = !label;
  const L = buttonLook({ skin, variant, size, isDark, iconOnly, selected });
  const iconEl = icon ? <Ionicons name={icon} size={L.iconSize} color={L.iconColor} /> : null;
  const small = size === "sm" || (!iconOnly && size === "md");
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || busy}
      hitSlop={small ? 6 : 0}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityState={{ disabled: disabled || busy, selected: variant === "chip" ? !!selected : undefined }}
      testID={testID}
      style={({ pressed }) => [L.box, pressed && !disabled ? L.pressedBox : null, disabled ? { opacity: 0.45 } : null, style]}
    >
      {busy ? (
        <ActivityIndicator color={L.iconColor} />
      ) : (
        <>
          {iconSide === "left" ? iconEl : null}
          {label ? <Text style={L.text} numberOfLines={1}>{label}</Text> : null}
          {iconSide === "right" ? iconEl : null}
        </>
      )}
    </Pressable>
  );
}

/** The screen's main button(s), on the thumb's side (right by default, left when Me → Look → Hand is Left). */
export function MainAction({ children, style }) {
  const { hand } = useLook();
  // Right hand: [hint, button] at the right edge. Left hand: mirrored, so the button is outermost on the left
  // (row-reverse's flex-end is the left edge).
  return <View style={[{ flexDirection: hand === "left" ? "row-reverse" : "row", alignItems: "center", justifyContent: "flex-end", gap: 10 }, style]}>{children}</View>;
}
