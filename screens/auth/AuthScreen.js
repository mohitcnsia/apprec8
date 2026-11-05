// screens/auth/AuthScreen.js: log in / create account (mockups T1, T1b, T2, T3; owner OK 2026-11-05).
// Bottom-heavy (DESIGN_RULES): everything sits low near the thumb, the empty top holds a friendly animation (HeroScene).
// Google is the big bottom button (most people use it); email, the parent's code and "look around" fold behind links.
// Note: the small builders below are plain functions, not components, so the text fields never remount while typing.

import React, { useEffect, useMemo, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../../components/quiz/quizPalette";
import HeroScene from "../../components/auth/HeroScene";
import Sheet from "../../components/common/Sheet";
import { signInWithChildCode } from "../../services/familyApi";
import { looksLikeEmail, MIN_PASSWORD } from "../../utils/authErrors";

export default function AuthScreen({
  externalError,
  externalNotice,
  isAuthLoading,
  onGuestLogin,
  onGoogleLogin,
  onEmailSignIn,
  onEmailSignUp,
  onPasswordReset,
}) {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const insets = useSafeAreaInsets();
  const s = useMemo(() => makeStyles(P, insets), [P, insets]);

  const [mode, setMode] = useState("choose"); // choose (T1) | email (T1b) | register (T2)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [forgotOpen, setForgotOpen] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);
  const [childCode, setChildCode] = useState("");
  const [childBusy, setChildBusy] = useState(false);
  const [childError, setChildError] = useState("");
  const [keyboard, setKeyboard] = useState(false);

  useEffect(() => {
    if (externalError) setError(externalError);
  }, [externalError]);
  useEffect(() => {
    const a = Keyboard.addListener("keyboardDidShow", () => setKeyboard(true));
    const b = Keyboard.addListener("keyboardDidHide", () => setKeyboard(false));
    return () => {
      a.remove();
      b.remove();
    };
  }, []);

  const register = mode === "register";
  const isValid = looksLikeEmail(email) && password.length >= MIN_PASSWORD;
  const hint =
    email.length > 0 && !looksLikeEmail(email)
      ? "Type a full email address, like name@gmail.com"
      : password.length > 0 && password.length < MIN_PASSWORD
      ? `Password: at least ${MIN_PASSWORD} characters (${password.length} so far)`
      : register && password.length >= MIN_PASSWORD
      ? "✓ Long enough"
      : null;
  const go = (m) => {
    setError("");
    setMode(m);
  };
  const submit = () => {
    if (!isValid || isAuthLoading) return;
    setError("");
    Keyboard.dismiss();
    if (register) onEmailSignUp(email, password);
    else onEmailSignIn(email, password);
  };

  const primary = (label, onPress, disabled, icon = null, busy = isAuthLoading) => (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[s.primary, disabled && s.primaryOff]}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled, busy: !!busy }}
    >
      {icon}
      <Text style={[s.primaryText, disabled && { color: P.disabledText }]}>{busy ? "Please wait…" : label}</Text>
    </Pressable>
  );
  const link = (label, onPress) => (
    <Pressable onPress={onPress} hitSlop={8} disabled={isAuthLoading} accessibilityRole="button">
      <Text style={s.link}>{label}</Text>
    </Pressable>
  );
  const messages = (
    <>
      {error ? <Text style={s.error}>{error}</Text> : null}
      {!error && externalNotice && !forgotOpen ? <Text style={s.notice}>{externalNotice}</Text> : null}
    </>
  );
  const G = (
    <View style={s.gBadge}>
      <Text style={s.gText}>G</Text>
    </View>
  );

  const content =
    mode === "choose" ? (
      <>
        <View>
          <Text style={s.title}>Welcome!</Text>
          <Text style={s.sub}>Log in to keep your stars and streak.</Text>
        </View>
        {messages}
        {primary("CONTINUE WITH GOOGLE", onGoogleLogin, isAuthLoading, G)}
        <View style={s.row}>
          {link("✉️ Use email instead", () => go("email"))}
          {link("🔑 Code from my parent", () => setCodeOpen(true))}
        </View>
        <View style={{ alignItems: "center" }}>{link("Just look around first ›", onGuestLogin)}</View>
      </>
    ) : (
      <>
        <View>
          <Text style={s.title}>{register ? "Create an account" : "Log in with email"}</Text>
          {register ? <Text style={s.sub}>A grown-up should do this part. (With Google there's nothing to fill in.)</Text> : null}
        </View>
        {messages}
        <View style={{ gap: 6 }}>
          <Text style={s.fieldLabel}>EMAIL</Text>
          <TextInput
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              setError("");
            }}
            style={s.input}
            placeholder="name@gmail.com"
            placeholderTextColor={P.dimText}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            keyboardType="email-address"
            editable={!isAuthLoading}
            returnKeyType="next"
          />
        </View>
        <View style={{ gap: 6 }}>
          <Text style={s.fieldLabel}>PASSWORD</Text>
          <View>
            <TextInput
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                setError("");
              }}
              style={[s.input, { paddingRight: 56 }]}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete={register ? "new-password" : "password"}
              textContentType={register ? "newPassword" : "password"}
              editable={!isAuthLoading}
              returnKeyType="go"
              onSubmitEditing={submit}
            />
            <Pressable onPress={() => setShowPassword((v) => !v)} style={s.eye} hitSlop={8} accessibilityLabel={showPassword ? "Hide password" : "Show password"}>
              <Text style={{ fontSize: 18, color: P.textSoft }}>{showPassword ? "🙈" : "👁"}</Text>
            </Pressable>
          </View>
        </View>
        {hint ? <Text style={[s.hint, hint.startsWith("✓") && { color: P.correctBorder }]}>{hint}</Text> : null}
        {register ? (
          <Text style={s.small}>By creating an account you agree to our privacy notice (what we keep, who sees it).</Text>
        ) : (
          <View style={s.row}>
            {link("Forgot password?", () => setForgotOpen(true))}
            {link("New? Create account ›", () => go("register"))}
          </View>
        )}
        {primary(register ? "CREATE ACCOUNT" : "LOG IN", submit, !isValid || isAuthLoading)}
        <View style={{ alignItems: "center" }}>
          {register ? link("Already have an account? Log in ›", () => go("email")) : link("‹ Use Google instead", () => go("choose"))}
        </View>
      </>
    );

  return (
    <KeyboardAvoidingView style={s.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" bounces={false}>
        {/* Empty top space: the friendly animation. Hidden while typing, so the form stays in view. */}
        <View style={s.hero}>{keyboard ? null : <HeroScene variant={register ? "grow" : "sky"} isDark={isDark} />}</View>
        <View style={s.block}>{content}</View>
      </ScrollView>

      {/* T3: forgot password */}
      <Sheet visible={forgotOpen} onClose={() => setForgotOpen(false)} title="Forgot your password?" subtitle="We'll email a link to make a new one." P={P}>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={s.input}
          placeholder="name@gmail.com"
          placeholderTextColor={P.dimText}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
        />
        {externalNotice ? <Text style={s.notice}>📬 {externalNotice}</Text> : null}
        {error ? <Text style={s.error}>{error}</Text> : null}
        {primary("SEND LINK", () => onPasswordReset(email), !looksLikeEmail(email) || isAuthLoading)}
      </Sheet>

      {/* The parent's one-time code (child accounts) */}
      <Sheet visible={codeOpen} onClose={() => setCodeOpen(false)} title="Code from my parent" subtitle="Your parent finds it in their app: Me → Play as." P={P}>
        <TextInput
          value={childCode}
          onChangeText={(v) => {
            setChildCode(v.toUpperCase());
            setChildError("");
          }}
          style={[s.input, { letterSpacing: 4, fontSize: 22, textAlign: "center" }]}
          placeholder="ABC123"
          placeholderTextColor={P.dimText}
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={8}
        />
        {childError ? <Text style={s.error}>{childError}</Text> : null}
        {primary(
          "SIGN IN",
          async () => {
            setChildBusy(true);
            setChildError("");
            try {
              await signInWithChildCode(childCode);
            } catch (e) {
              setChildError(e?.message || "That code doesn't work. Ask your parent for a new one.");
            }
            setChildBusy(false);
          },
          childBusy || childCode.trim().length < 6,
          null,
          childBusy
        )}
      </Sheet>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (P, insets) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: P.bg },
    scroll: { flexGrow: 1, paddingTop: insets.top },
    hero: { flexGrow: 1, minHeight: 24, justifyContent: "center", paddingVertical: 12 },
    block: { paddingHorizontal: 22, paddingBottom: Math.max(16, insets.bottom + 10), gap: 14 },
    title: { fontSize: 27, fontWeight: "900", color: P.text },
    sub: { fontSize: 15, lineHeight: 21, fontWeight: "700", color: P.textSoft, marginTop: 2 },
    fieldLabel: { fontSize: 13, fontWeight: "800", letterSpacing: 0.5, color: P.textSoft },
    input: { height: 56, borderRadius: 16, borderWidth: 2, borderColor: P.border, backgroundColor: P.card, paddingHorizontal: 16, fontSize: 18, fontWeight: "700", color: P.text },
    eye: { position: "absolute", right: 8, top: 6, width: 44, height: 44, alignItems: "center", justifyContent: "center" },
    hint: { fontSize: 13, fontWeight: "700", color: P.textSoft, marginTop: -4 },
    small: { fontSize: 13, lineHeight: 19, fontWeight: "700", color: P.textSoft },
    row: { flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap", gap: 8 },
    link: { fontSize: 15, fontWeight: "800", color: P.textSoft, paddingVertical: 6 },
    error: { fontSize: 15, lineHeight: 21, fontWeight: "700", color: P.wrongText, backgroundColor: P.wrongBg, borderRadius: 12, padding: 10, overflow: "hidden" },
    notice: { fontSize: 15, lineHeight: 21, fontWeight: "700", color: P.text, backgroundColor: P.borderDeep, borderRadius: 12, padding: 10, overflow: "hidden" },
    primary: { height: 60, borderRadius: 18, backgroundColor: P.primary, borderBottomWidth: 5, borderBottomColor: P.primaryShadow, flexDirection: "row", gap: 12, alignItems: "center", justifyContent: "center", paddingHorizontal: 12 },
    primaryOff: { backgroundColor: P.disabledBg, borderBottomColor: P.disabledShadow },
    primaryText: { color: P.onPrimary, fontSize: 18, fontWeight: "800", letterSpacing: 0.5 },
    gBadge: { width: 26, height: 26, borderRadius: 13, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
    gText: { color: "#3b0940", fontSize: 15, fontWeight: "900" },
  });
