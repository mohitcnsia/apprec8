// components/parent/ParentTipCard.js: "For you today" on a parent's Home (owner-approved mockup, 16 Nov 2026). A calm
// picture card with one short tip; Listen reads it aloud. Tips: data/parentTips.js (draft until Seema reviews).
import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Speech from "expo-speech";
import { useTheme } from "../../context/ThemeContext";
import { dayNumber } from "../../utils/dailyCard";
import { tipForDay } from "../../data/parentTips";

export default function ParentTipCard() {
  const { isDark } = useTheme();
  const tip = tipForDay(dayNumber());
  useEffect(() => () => Speech.stop(), []);
  const C = isDark
    ? { sky: "#1E1626", hill1: "#2B2135", hill2: "#352840", ink: "#F4EDF5", label: "#D7A9DC", glass: "rgba(255,255,255,0.10)" }
    : { sky: "#E9DDF1", hill1: "#D8C4E4", hill2: "#C8AFD9", ink: "#241027", label: "#5E3A63", glass: "rgba(255,255,255,0.8)" };
  return (
    <View style={[s.card, { backgroundColor: C.sky }]} accessibilityLabel={`For you today: ${tip}`}>
      <Svg pointerEvents="none" width="100%" height={60} viewBox="0 0 340 60" preserveAspectRatio="none" style={s.hills}>
        <Path d="M0 24 C80 6 160 18 220 30 S310 34 340 22 V60 H0Z" fill={C.hill1} />
        <Path d="M0 44 C100 34 200 48 340 40 V60 H0Z" fill={C.hill2} />
      </Svg>
      <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
        <View style={{ flex: 1, gap: 8 }}>
          <Text style={[s.label, { color: C.label }]}>FOR YOU TODAY</Text>
          <Text style={[s.tip, { color: C.ink }]}>{tip}</Text>
        </View>
        <Pressable
          onPress={() => {
            Speech.stop();
            Speech.speak(tip, { language: "en-IN", rate: 0.9 });
          }}
          accessibilityRole="button"
          accessibilityLabel="Listen"
          style={[s.listen, { backgroundColor: C.glass }]}
        >
          <Ionicons name="volume-high-outline" size={20} color={C.ink} />
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: { borderRadius: 22, padding: 16, paddingBottom: 46, overflow: "hidden" },
  hills: { position: "absolute", left: 0, right: 0, bottom: 0 },
  label: { fontSize: 11, fontFamily: "nunitoBold", letterSpacing: 1.4 },
  tip: { fontSize: 19, lineHeight: 26, fontFamily: "serif", fontStyle: "italic" },
  listen: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
});
