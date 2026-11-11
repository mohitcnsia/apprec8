// components/common/AlertBanner.js: an alert that arrives while the app is open shows here, at the top, for 8 seconds
// (owner, 2026-11-11: "we can't miss alerts ever"; Android shows nothing by itself while the app is open).
// Tap = open the same screen as tapping the phone's notification. Whatever it was also stays on Home → Needs you.
import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../quiz/quizPalette";
import { listenForOpenAlerts } from "../../services/push";

export default function AlertBanner({ onOpen }) {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const insets = useSafeAreaInsets();
  const [alert, setAlert] = useState(null);
  const timer = useRef(null);

  useEffect(() => {
    const off = listenForOpenAlerts((a) => {
      setAlert(a);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setAlert(null), 8000);
    });
    return () => {
      off && off();
      clearTimeout(timer.current);
    };
  }, []);

  if (!alert) return null;
  const close = () => setAlert(null);
  const open = () => {
    close();
    onOpen && onOpen(alert.view);
  };

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { top: insets.top + 8 }]}>
      <Pressable
        onPress={open}
        accessibilityRole="button"
        accessibilityLabel={`${alert.title}. ${alert.body}. Open`}
        style={[styles.card, { backgroundColor: P.card, borderColor: P.selectedBorder }]}
      >
        <View style={{ flex: 1 }}>
          {alert.title ? <Text style={[styles.title, { color: P.text }]} numberOfLines={1}>{alert.title}</Text> : null}
          {alert.body ? <Text style={[styles.body, { color: P.textSoft }]} numberOfLines={2}>{alert.body}</Text> : null}
        </View>
        <Text style={[styles.openText, { color: P.label }]}>Open ›</Text>
        <Pressable onPress={close} hitSlop={12} accessibilityRole="button" accessibilityLabel="Close alert">
          <Text style={[styles.close, { color: P.textSoft }]}>✕</Text>
        </Pressable>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "absolute", left: 12, right: 12, zIndex: 1000, elevation: 20 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 20,
  },
  title: { fontSize: 15, fontFamily: "nunitoBold" },
  body: { fontSize: 14, fontFamily: "nunito", marginTop: 2 },
  openText: { fontSize: 14, fontFamily: "nunitoBold" },
  close: { fontSize: 16, paddingHorizontal: 2 },
});
