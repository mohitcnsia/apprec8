// components/common/AppDialog.js: the app's popup (mockup T5, owner 2026-11-05: "multiple popups are raw Android ones").
// A bottom sheet in the app's colours: title, message, the safe/main choice big, others quiet (utils/dialogButtons.js).
// - <DialogSheet> draws one popup (used by ConfirmationModal / InfoModal too).
// - <AppDialogHost> is mounted once in AppContent; services/dialog.js showAlert() (same arguments as Alert.alert) uses it.

import React, { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../quiz/quizPalette";
import { dialogLayout, dismissButton } from "../../utils/dialogButtons";
import { setDialogHost } from "../../services/dialog";

export function DialogSheet({ visible, title, message, buttons, onClose, emoji = null }) {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const insets = useSafeAreaInsets();
  const items = dialogLayout(buttons);
  const press = (b) => {
    onClose?.();
    // Let the sheet close first, so a button that opens another popup doesn't clash with this one.
    if (typeof b?.onPress === "function") setTimeout(b.onPress, 0);
  };
  const back = () => {
    const d = dismissButton(buttons);
    if (d) press(d);
  };
  return (
    <Modal visible={!!visible} transparent animationType="slide" onRequestClose={back} statusBarTranslucent>
      <View style={s.fill}>
        <Pressable style={s.backdrop} onPress={back} accessibilityRole="button" accessibilityLabel="Close" />
        <View style={[s.sheet, { backgroundColor: P.card, borderColor: P.border, paddingBottom: Math.max(18, insets.bottom + 12) }]}>
          <View style={[s.grip, { backgroundColor: P.border }]} />
          <View style={s.head}>
            {emoji ? <Text style={s.emoji}>{emoji}</Text> : null}
            {title ? <Text style={[s.title, { color: P.text }]}>{title}</Text> : null}
          </View>
          {message ? <Text style={[s.message, { color: P.textSoft }]}>{message}</Text> : null}
          <View style={{ gap: 10, marginTop: 6 }}>
            {items.map((b) =>
              b.role === "primary" ? (
                <Pressable key={b.i} onPress={() => press(b)} style={[s.primary, { backgroundColor: P.primary, borderBottomColor: P.primaryShadow }]} accessibilityRole="button">
                  <Text style={[s.primaryText, { color: P.onPrimary }]}>{b.text}</Text>
                </Pressable>
              ) : (
                <Pressable
                  key={b.i}
                  onPress={() => press(b)}
                  style={[s.quiet, { borderColor: b.role === "danger" ? P.wrongBorder : P.border }]}
                  accessibilityRole="button"
                >
                  <Text style={[s.quietText, { color: b.role === "danger" ? P.wrongText : P.textSoft }]}>{b.text}</Text>
                </Pressable>
              )
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

/** Mounted once (AppContent). Shows showAlert() popups one after another. */
export function AppDialogHost() {
  const [queue, setQueue] = useState([]);
  useEffect(() => {
    setDialogHost({ show: (d) => setQueue((q) => [...q, d]) });
    return () => setDialogHost(null);
  }, []);
  const current = queue[0];
  if (!current) return null;
  return (
    <DialogSheet
      visible
      title={current.title}
      message={current.message}
      buttons={current.buttons}
      onClose={() => {
        setQueue((q) => q.slice(1));
        current.options?.onDismiss?.();
      }}
    />
  );
}

const s = StyleSheet.create({
  fill: { flex: 1, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.55)" },
  sheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, borderTopWidth: 2, paddingHorizontal: 22, paddingTop: 12, gap: 10 },
  grip: { alignSelf: "center", width: 44, height: 5, borderRadius: 3, marginBottom: 4 },
  head: { flexDirection: "row", alignItems: "center", gap: 12 },
  emoji: { fontSize: 30 },
  title: { flex: 1, fontSize: 21, lineHeight: 27, fontWeight: "900" },
  message: { fontSize: 16, lineHeight: 23, fontWeight: "700" },
  primary: { height: 56, borderRadius: 18, borderBottomWidth: 5, alignItems: "center", justifyContent: "center", paddingHorizontal: 12 },
  primaryText: { fontSize: 17, fontWeight: "800", letterSpacing: 0.5 },
  quiet: { minHeight: 50, borderRadius: 16, borderWidth: 2, alignItems: "center", justifyContent: "center", paddingHorizontal: 12 },
  quietText: { fontSize: 16, fontWeight: "800" },
});
