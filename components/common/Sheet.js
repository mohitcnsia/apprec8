// components/common/Sheet.js
// A bottom sheet (mockup L2, owner-approved 2026-11-05): slides up over a dimmed screen, closes on the backdrop,
// Android back, or when the caller sets visible=false (e.g. after "Create"). Forms live here, not on the page.

import React from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Sheet({ visible, onClose, title, subtitle, children, P }) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.fill}>
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityRole="button" accessibilityLabel="Close" />
        <View style={[styles.sheet, { backgroundColor: P.card, borderColor: P.border, paddingBottom: Math.max(18, insets.bottom + 12) }]}>
          <View style={[styles.grip, { backgroundColor: P.border }]} />
          {title ? <Text style={[styles.title, { color: P.text }]}>{title}</Text> : null}
          {subtitle ? <Text style={[styles.subtitle, { color: P.textSoft }]}>{subtitle}</Text> : null}
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ gap: 14, paddingTop: 12 }}>
            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.55)" },
  sheet: { maxHeight: "88%", borderTopLeftRadius: 28, borderTopRightRadius: 28, borderWidth: 2, borderBottomWidth: 0, paddingHorizontal: 18, paddingTop: 12 },
  grip: { alignSelf: "center", width: 44, height: 5, borderRadius: 3, marginBottom: 12 },
  title: { fontSize: 22, fontFamily: "nunitoBold" },
  subtitle: { fontSize: 15, fontFamily: "nunitoBold" },
});
