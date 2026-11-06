// screens/auth/ConsentGateScreen.js
// "Ask a parent" (mockup X2, spec X in CODE_REVIEW.md 2026-11-06). A student who signed up alone sees only this until a
// parent says yes, in one of two ways that already exist: the parent links the child (code from the parent's own
// account, DR-17) or the child joins a class with the parent's form (the teacher approves). Nothing is saved before.
// AppContent swaps this for the app as soon as the user doc shows the link or the class.

import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, Share, Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../../components/quiz/quizPalette";
import { makeSchoolStyles, MainButton } from "../admin/schoolUi";
import HelpSheet from "../../components/safety/HelpSheet";
import ConfirmationModal from "../../components/common/ConfirmationModel";
import LinkParentScreen from "../profile/LinkParentScreen";
import JoinClassScreen from "../profile/JoinClassScreen";
import DeleteAccountConfirmationScreen from "../profile/DeleteAccountConfirmationScreen";
import { parentAskMessage } from "../../utils/consent";

function ConsentGateScreen({ navigation, firstName, signoutHandler }) {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeSchoolStyles(P, insets), [P, insets]);
  const name = String(firstName || "").trim().split(/\s+/)[0];
  const [helpOpen, setHelpOpen] = useState(false);
  const [confirmSignOut, setConfirmSignOut] = useState(false);

  const send = () => Share.share({ message: parentAskMessage(name) }).catch(() => {});

  const way = (icon, title, text, onPress, on) => (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={[styles.card, { flexDirection: "row", gap: 12 }, on && { borderColor: P.selectedBorder }]}
    >
      <Text style={{ fontSize: 28 }}>{icon}</Text>
      <View style={{ flex: 1, gap: 3 }}>
        <Text style={styles.text}>{title}</Text>
        <Text style={styles.small}>{text}</Text>
      </View>
    </Pressable>
  );
  const small = (label, onPress) => (
    <Pressable onPress={onPress} accessibilityRole="button" style={{ minHeight: 44, justifyContent: "center", paddingHorizontal: 6 }}>
      <Text style={[styles.small, { textDecorationLine: "underline" }]}>{label}</Text>
    </Pressable>
  );

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={[styles.content, { flexGrow: 1, justifyContent: "flex-end" }]}>
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>
            {`Hi${name ? ` ${name}` : ""}! One more step: a parent or the grown-up who looks after you says yes. Then your stars and progress are saved. ⭐`}
          </Text>
        </View>
        <Text style={styles.h1}>Ask a parent or guardian</Text>
        {way("👪", "My parent or guardian will link me", "They open Apprec8 on their own phone and get a 6-number code. You type it here.", send, true)}
        {way("🏫", "My teacher gave me a class code", "Your parent or guardian fills in the form with you, and your teacher lets you in.", () => navigation.navigate("JoinClass"))}
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
          {small("I have the code", () => navigation.navigate("LinkParent"))}
          {small("Need help?", () => setHelpOpen(true))}
          {typeof signoutHandler === "function" ? small("Sign out", () => setConfirmSignOut(true)) : null}
          {small("Delete my account", () => navigation.navigate("DeleteAccountConfirmation", {}))}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <MainButton label="SEND TO MY PARENT" onPress={send} styles={styles} P={P} />
      </View>
      <HelpSheet visible={helpOpen} onClose={() => setHelpOpen(false)} P={P} />
      <ConfirmationModal
        visible={confirmSignOut}
        title="Are you sure you want to sign out?"
        onCancel={() => setConfirmSignOut(false)}
        onConfirm={() => {
          setConfirmSignOut(false);
          signoutHandler();
        }}
      />
    </View>
  );
}

const Stack = createStackNavigator();

/** The whole app for a student without a parent's yes: the gate + the two ways through + delete. */
export default function ConsentNavigator({ firstName, signoutHandler }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ConsentGate">{(props) => <ConsentGateScreen {...props} firstName={firstName} signoutHandler={signoutHandler} />}</Stack.Screen>
      <Stack.Screen name="LinkParent" component={LinkParentScreen} />
      <Stack.Screen name="JoinClass" component={JoinClassScreen} />
      <Stack.Screen name="DeleteAccountConfirmation" component={DeleteAccountConfirmationScreen} />
    </Stack.Navigator>
  );
}
