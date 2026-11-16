// components/me/MePanel.js: Me as a side panel from your face on Home (owner-approved mockup, 16 Nov 2026).
// Slides in from the left over Home. "Need help? Talk to someone" stays first (safeguarding). The everyday rows, the
// Look settings (theme, button style, hand), and "All settings" for everything else (today's full Me screen, unchanged,
// so parents', teachers' and the owner's tools keep working). Opened with openMePanel() (services/mePanel.js).
import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Easing, Modal, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../quiz/quizPalette";
import { navigateTo } from "../../navigation/navRef";
import { listenToUserDocument } from "../../services/firestoreContentApi";
import { authInstance } from "../../config/firebaseConfig";
import { useMePanel, closeMePanel } from "../../services/mePanel";
import { useLook, setLook } from "../../services/lookSettings";
import { SKINS, SKIN_NAMES, buttonLook } from "../../utils/buttonSkin";
import HelpSheet, { NeedHelpRow } from "../safety/HelpSheet";
import Face from "../common/Face";
import FacePickerSheet from "./FacePickerSheet";

const THEMES = [["system", "Phone"], ["light", "Light"], ["dark", "Dark"]];

export default function MePanel() {
  const open = useMePanel();
  const { isDark, themeChoice, setThemeChoice } = useTheme();
  const P = quizPalette(isDark);
  const insets = useSafeAreaInsets();
  const look = useLook();
  const width = Math.min(330, Math.round(Dimensions.get("window").width * 0.84));
  const x = useRef(new Animated.Value(-width)).current;
  const [shown, setShown] = useState(false);
  const [user, setUser] = useState(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [faceOpen, setFaceOpen] = useState(false);

  useEffect(() => {
    if (!authInstance.currentUser) return undefined;
    return listenToUserDocument((d) => setUser(d || null), () => {});
  }, [open]);

  useEffect(() => {
    if (open) {
      setShown(true);
      Animated.timing(x, { toValue: 0, duration: 220, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    } else if (shown) {
      Animated.timing(x, { toValue: -width, duration: 180, easing: Easing.in(Easing.cubic), useNativeDriver: true }).start(() => setShown(false));
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const go = (screen, params) => {
    closeMePanel();
    navigateTo("Profile", screen ? { screen, initial: false, params } : undefined);
  };
  const name = user?.firstName || authInstance.currentUser?.displayName?.split(" ")[0] || "You";
  const sub = Number.isInteger(user?.grade) ? `Class ${user.grade}` : user?.childUids?.length ? "Parent" : (user?.teachesClassIds || []).length ? "Teacher" : "";

  const rows = [
    ["person-outline", "Edit profile", () => go("EditProfile", { currentFirstName: user?.firstName || "", currentLastName: user?.lastName || "", currentPhotoURL: user?.photoURL || "" })],
    ["alarm-outline", "Reminders", () => go("Tasks")],
    ["mail-outline", "Messages", () => go("MessageCenter")],
    ["compass-outline", "Guides", () => go("Guides")],
    ["chatbubble-ellipses-outline", "Tell us what you think", () => go("cntct")],
    ["settings-outline", "All settings", () => go("ProfileScreen")],
  ];

  if (!shown) return null;
  return (
    <Modal visible transparent animationType="none" onRequestClose={closeMePanel} statusBarTranslucent>
      <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(20,12,24,0.45)" }]} onPress={closeMePanel} accessibilityLabel="Close Me" />
      <Animated.View style={[s.panel, { width, backgroundColor: P.card, paddingTop: Math.max(insets.top, StatusBar.currentHeight || 24) + 18, paddingBottom: insets.bottom + 12, transform: [{ translateX: x }] }]}>
        <ScrollView contentContainerStyle={{ gap: 14, paddingHorizontal: 16 }} showsVerticalScrollIndicator={false}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Pressable onPress={() => setFaceOpen(true)} accessibilityRole="button" accessibilityLabel="Change your face" hitSlop={6}>
              <Face size={52} name={name} avatar={user?.avatar} uid={authInstance.currentUser?.uid} />
              <View style={[s.editDot, { backgroundColor: P.card, borderColor: P.border }]}>
                <Ionicons name="pencil" size={11} color={P.label} />
              </View>
            </Pressable>
            <View style={{ flex: 1 }}>
              <Text style={[s.name, { color: P.text }]} numberOfLines={1}>{name}</Text>
              {sub ? <Text style={[s.sub, { color: P.textSoft }]}>{sub}</Text> : null}
            </View>
          </View>

          <NeedHelpRow onPress={() => setHelpOpen(true)} P={P} />

          <View>
            {rows.map(([icon, label, onPress]) => (
              <Pressable key={label} onPress={onPress} accessibilityRole="button" style={({ pressed }) => [s.row, pressed && { opacity: 0.7 }]}>
                <Ionicons name={icon} size={20} color={P.label} />
                <Text style={[s.rowText, { color: P.text }]}>{label}</Text>
                <Ionicons name="chevron-forward" size={16} color={P.dimText} />
              </Pressable>
            ))}
          </View>

          <Text style={[s.section, { color: P.label }]}>LOOK</Text>
          <View style={[s.segment, { backgroundColor: P.selectedBg }]} accessibilityRole="radiogroup">
            {THEMES.map(([id, label]) => (
              <Pressable key={id} onPress={() => setThemeChoice && setThemeChoice(id)} accessibilityRole="radio" accessibilityState={{ selected: themeChoice === id }} style={[s.segItem, themeChoice === id && { backgroundColor: P.card }]}>
                <Text style={[s.segText, { color: themeChoice === id ? P.text : P.textSoft }]}>{label}</Text>
              </Pressable>
            ))}
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {SKINS.map((k) => {
              const L = buttonLook({ skin: k, variant: "primary", size: "sm", isDark, iconOnly: true });
              return (
                <Pressable key={k} onPress={() => setLook({ skin: k })} accessibilityRole="radio" accessibilityState={{ selected: look.skin === k }} accessibilityLabel={`Button style ${SKIN_NAMES[k]}`} style={[s.skin, { borderColor: look.skin === k ? P.selectedBorder : P.border }]}>
                  <View style={[L.box, { width: 36, height: 36, borderRadius: k === "A" ? 18 : 11 }]}>
                    <Ionicons name="arrow-forward" size={16} color={L.iconColor} />
                  </View>
                  <Text style={[s.segText, { color: look.skin === k ? P.selectedText : P.textSoft }]}>{SKIN_NAMES[k]}</Text>
                </Pressable>
              );
            })}
          </View>
          <View style={[s.segment, { backgroundColor: P.selectedBg }]} accessibilityRole="radiogroup">
            {[["left", "Left hand"], ["right", "Right hand"]].map(([id, label]) => (
              <Pressable key={id} onPress={() => setLook({ hand: id })} accessibilityRole="radio" accessibilityState={{ selected: look.hand === id }} style={[s.segItem, look.hand === id && { backgroundColor: P.card }]}>
                <Text style={[s.segText, { color: look.hand === id ? P.text : P.textSoft }]}>{label}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </Animated.View>
      <HelpSheet visible={helpOpen} onClose={() => setHelpOpen(false)} P={P} />
      <FacePickerSheet visible={faceOpen} onClose={() => setFaceOpen(false)} uid={authInstance.currentUser?.uid} avatar={user?.avatar} name={name} P={P} />
    </Modal>
  );
}

const s = StyleSheet.create({
  panel: { position: "absolute", top: 0, bottom: 0, left: 0, borderTopRightRadius: 24, borderBottomRightRadius: 24, elevation: 16 },
  face: { width: 52, height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center" },
  faceText: { fontSize: 20, fontFamily: "nunitoBold" },
  editDot: { position: "absolute", right: -2, bottom: -2, width: 20, height: 20, borderRadius: 10, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  name: { fontSize: 19, fontFamily: "nunitoBold" },
  sub: { fontSize: 13, fontFamily: "nunito" },
  row: { minHeight: 48, flexDirection: "row", alignItems: "center", gap: 14, paddingHorizontal: 4 },
  rowText: { flex: 1, fontSize: 15, fontFamily: "nunitoBold" },
  section: { fontSize: 11, fontFamily: "nunitoBold", letterSpacing: 1.2, marginTop: 4 },
  segment: { flexDirection: "row", borderRadius: 12, padding: 3 },
  segItem: { flex: 1, minHeight: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  segText: { fontSize: 13, fontFamily: "nunitoBold" },
  skin: { flex: 1, alignItems: "center", gap: 4, paddingVertical: 8, borderRadius: 14, borderWidth: 2 },
});
