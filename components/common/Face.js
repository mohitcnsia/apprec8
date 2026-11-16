// components/common/Face.js: a person's face in the app. Your own photo (only on your phone) → your character →
// the first letter of your name. Used on Home (top left), the Me panel and the face picker.
import React from "react";
import { Image, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "../../context/ThemeContext";
import Mascot from "../quiz/Mascot";
import { faceById } from "../../utils/faces";
import { useLocalPhoto } from "../../services/face";

export default function Face({ size = 44, name = "", avatar = null, uid = null, ring = null }) {
  const { isDark } = useTheme();
  const photo = useLocalPhoto(uid);
  const f = faceById(avatar);
  const box = { width: size, height: size, borderRadius: size / 2, alignItems: "center", justifyContent: "center", overflow: "hidden", ...(ring ? { borderWidth: 2, borderColor: ring } : {}) };
  if (photo) return <Image source={{ uri: photo }} style={box} accessibilityIgnoresInvertColors />;
  const bg = f ? (isDark ? f.darkBg : f.bg) : isDark ? "#3A2E12" : "#FFF4D6";
  const fg = f ? (isDark ? f.darkFg : f.fg) : isDark ? "#F2D48A" : "#9A6B00";
  return (
    <View style={[box, { backgroundColor: bg }]}>
      {f?.mascot ? (
        <Mascot size={Math.round(size * 0.78)} still />
      ) : f ? (
        <Ionicons name={f.icon} size={Math.round(size * 0.52)} color={fg} />
      ) : (
        <Text style={{ fontSize: Math.round(size * 0.42), fontFamily: "nunitoBold", color: fg }}>{(name || "?").trim().charAt(0).toUpperCase()}</Text>
      )}
    </View>
  );
}
