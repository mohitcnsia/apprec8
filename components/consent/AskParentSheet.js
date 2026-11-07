// components/consent/AskParentSheet.js
// "Ask a parent" sheet (mockup X7, owner-approved 2026-11-06).
// Shown when a student in learn-first mode taps the calm banner on Home.
// Options: Send WhatsApp message to parent, type parent's 6-digit code, join class, or Not now.

import React, { useMemo, useState } from "react";
import { Pressable, Share, StyleSheet, Text, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Sheet from "../common/Sheet";
import { parentAskMessage } from "../../utils/consent";
import { redeemParentLinkCode } from "../../services/familyApi";
import { showAlert } from "../../services/dialog";

export default function AskParentSheet({ visible, onClose, firstName, navigation, P }) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);

  const tidy = code.toUpperCase().replace(/[\s-]/g, "");

  const onShareWhatsApp = async () => {
    try {
      const msg = parentAskMessage(firstName);
      await Share.share({ message: msg });
    } catch (e) {
      // User cancelled share
    }
  };

  const onLinkParentCode = async () => {
    if (tidy.length < 4) {
      showAlert("Code too short", "Please enter the 6-character code from your parent.");
      return;
    }
    setBusy(true);
    try {
      const res = await redeemParentLinkCode(tidy);
      showAlert("Linked! 🎉", `${res.parentName || "Your parent"} is connected. Your stars and progress are now safely saved on the server!`);
      onClose();
    } catch (e) {
      showAlert("Couldn't link", e?.message || String(e));
    }
    setBusy(false);
  };

  const onGoToJoinClass = () => {
    onClose();
    navigation?.navigate("Me", { screen: "JoinClass" });
  };

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      title="Ask a parent or guardian"
      subtitle="A parent's yes saves your stars and keeps your streak safe."
      P={P}
    >
      <View style={styles.container}>
        {/* Option 1: WhatsApp Share */}
        <Pressable
          style={[styles.actionCard, { backgroundColor: P.cardSubtle || "#2A1838", borderColor: P.border }]}
          onPress={onShareWhatsApp}
          accessibilityRole="button"
          accessibilityLabel="Send link to parent on WhatsApp"
        >
          <View style={[styles.iconWrap, { backgroundColor: "#25D366" }]}>
            <Ionicons name="logo-whatsapp" size={22} color="#FFFFFF" />
          </View>
          <View style={styles.cardTexts}>
            <Text style={[styles.cardTitle, { color: P.text }]}>Send to parent on WhatsApp</Text>
            <Text style={[styles.cardSub, { color: P.textSoft }]}>
              They get a simple link to say yes on the web (no app needed).
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={P.textSoft} />
        </Pressable>

        {/* Option 2: 6-number Code from Parent */}
        <View style={[styles.actionCard, { backgroundColor: P.cardSubtle || "#2A1838", borderColor: P.border }]}>
          <View style={[styles.iconWrap, { backgroundColor: P.primary || "#9333EA" }]}>
            <Ionicons name="key-outline" size={20} color="#FFFFFF" />
          </View>
          <View style={styles.cardTexts}>
            <Text style={[styles.cardTitle, { color: P.text }]}>Type code from your parent</Text>
            <Text style={[styles.cardSub, { color: P.textSoft }]}>
              If your parent installed Apprec8, ask them for their 6-number code.
            </Text>
            {showCodeInput ? (
              <View style={styles.inputRow}>
                <TextInput
                  value={code}
                  onChangeText={setCode}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  maxLength={8}
                  placeholder="K7P42M"
                  placeholderTextColor={P.dimText}
                  style={[styles.input, { borderColor: P.primary, color: P.text, backgroundColor: P.background }]}
                />
                <Pressable
                  style={[styles.btnSmall, { backgroundColor: P.primary }]}
                  onPress={onLinkParentCode}
                  disabled={busy}
                >
                  <Text style={styles.btnSmallText}>{busy ? "..." : "Link"}</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable onPress={() => setShowCodeInput(true)} style={{ marginTop: 4 }}>
                <Text style={{ fontSize: 13, fontWeight: "700", color: P.primary }}>
                  Enter code ›
                </Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Option 3: School Class Code */}
        <Pressable
          style={[styles.actionCard, { backgroundColor: P.cardSubtle || "#2A1838", borderColor: P.border }]}
          onPress={onGoToJoinClass}
          accessibilityRole="button"
          accessibilityLabel="Join a school class"
        >
          <View style={[styles.iconWrap, { backgroundColor: "#3B82F6" }]}>
            <Ionicons name="school-outline" size={20} color="#FFFFFF" />
          </View>
          <View style={styles.cardTexts}>
            <Text style={[styles.cardTitle, { color: P.text }]}>Join with a class code</Text>
            <Text style={[styles.cardSub, { color: P.textSoft }]}>
              If your school gave you a class code, join with your parent's permission.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={P.textSoft} />
        </Pressable>

        {/* Secondary: Not Now */}
        <Pressable
          style={[styles.notNowBtn, { borderColor: P.border }]}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Not now"
        >
          <Text style={[styles.notNowText, { color: P.textSoft }]}>Not now, keep learning on this phone</Text>
        </Pressable>
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingBottom: 8,
  },
  actionCard: {
    borderWidth: 1.5,
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTexts: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontSize: 14.5,
    fontFamily: "nunitoBold",
  },
  cardSub: {
    fontSize: 12,
    lineHeight: 16,
  },
  inputRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 2,
  },
  btnSmall: {
    paddingHorizontal: 16,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  btnSmallText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  notNowBtn: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  notNowText: {
    fontSize: 13,
    fontWeight: "700",
  },
});
