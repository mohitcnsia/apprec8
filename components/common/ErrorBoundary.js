// components/common/ErrorBoundary.js: the app's safety net (owner + Seema, 12 Nov: "the screen just became dark brown").
// Without it, one error while drawing any screen blanked the whole published app until it was closed. Now the person
// sees a calm "Something went wrong" with TRY AGAIN, and the error (message + where it happened, no child data) is sent
// to us: Crashlytics, and a userFeedback note (entryPoint "app_error") that scripts/admin/feedback.mjs and
// Admin tools → Ideas & reports pick up. At most one note per error text per app start.
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { getFirestore, collection, addDoc, serverTimestamp } from "@react-native-firebase/firestore";
import { getApp } from "@react-native-firebase/app";
import Constants from "expo-constants";
import * as Updates from "expo-updates";
import { authInstance } from "../../config/firebaseConfig";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../quiz/quizPalette";

const sent = new Set();

export function reportAppError(error, componentStack = "", where = "app") {
  const message = String(error?.message || error || "unknown error").slice(0, 300);
  if (sent.has(message)) return;
  sent.add(message);
  try {
    const crashlytics = require("@react-native-firebase/crashlytics").default;
    crashlytics().recordError(error instanceof Error ? error : new Error(message));
  } catch (e) {
    // builds without Crashlytics: the note below still goes
  }
  const user = authInstance.currentUser;
  if (!user) return;
  addDoc(collection(getFirestore(getApp()), "userFeedback"), {
    userId: user.uid,
    userName: null,
    contentContext: { type: "app_error", id: where, titlePreview: message },
    entryPoint: "app_error",
    reaction: null,
    feedbackType: "app_error",
    issueCategory: "app_error",
    feedbackText: [String(error?.stack || "").slice(0, 1500), String(componentStack || "").slice(0, 1500)].join("\n--- screen ---\n"),
    clientTimestamp: new Date().toISOString(),
    createdAt: serverTimestamp(),
    status: "new",
    appVersion: Constants.expoConfig?.version || null,
    updateId: Updates.updateId ? Updates.updateId.slice(0, 8) : "built-in",
  }).catch(() => {});
}

function Fallback({ onRetry }) {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  return (
    <View style={[s.screen, { backgroundColor: P.bg }]}>
      <Text style={s.emoji}>🌿</Text>
      <Text style={[s.title, { color: P.text }]}>Something went wrong</Text>
      <Text style={[s.body, { color: P.textSoft }]}>It's not your fault. We've been told, and your progress is safe.</Text>
      <Pressable onPress={onRetry} accessibilityRole="button" style={[s.button, { backgroundColor: P.primary }]}>
        <Text style={[s.buttonText, { color: P.onPrimary }]}>TRY AGAIN</Text>
      </Pressable>
    </View>
  );
}

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false, attempt: 0 };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error, info) {
    reportAppError(error, info?.componentStack, this.props.where || "app");
  }

  render() {
    if (this.state.failed) return <Fallback onRetry={() => this.setState((st) => ({ failed: false, attempt: st.attempt + 1 }))} />;
    // A new key on retry draws everything inside again from the start.
    return <React.Fragment key={this.state.attempt}>{this.props.children}</React.Fragment>;
  }
}

const s = StyleSheet.create({
  screen: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 },
  emoji: { fontSize: 44 },
  title: { fontSize: 20, fontFamily: "nunitoBold", textAlign: "center" },
  body: { fontSize: 15, fontFamily: "nunito", textAlign: "center", lineHeight: 21, maxWidth: 320 },
  button: { marginTop: 12, minHeight: 52, minWidth: 220, borderRadius: 16, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
  buttonText: { fontSize: 16, fontFamily: "nunitoBold", letterSpacing: 1 },
});
