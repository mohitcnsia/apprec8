/**
 * @file ResultsScreen.js
 * @description A generic, app-wide screen to display the results of any activity.
 * It uses a hybrid approach: it can automatically determine which result asset
 * to show based on score, but also allows for a manual asset override.
 * (This version is simplified and removes all FeedbackFAB functionality).
 */
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import LottieView from "lottie-react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "../../context/ThemeContext";
import Mascot from "../../components/quiz/Mascot";
import { quizPalette } from "../../components/quiz/quizPalette";
import { authInstance } from "../../config/firebaseConfig";
import functions from "@react-native-firebase/functions";

// --- Constants ---
const screenWidth = Dimensions.get("window").width;
const assetDiameter = screenWidth * 0.7; // <-- Controls asset size

// --- Helper function to determine which asset to show ---
const getResultAsset = (params) => {
  // 1. Manual Override: If an asset is explicitly passed, use it.
  if (params.asset) {
    return params.asset;
  }

  // 2. Automatic Logic: If score data is available, determine the asset.
  if (
    typeof params.finalScore === "number" &&
    typeof params.maxPossibleScore === "number"
  ) {
    const { finalScore, maxPossibleScore } = params;
    if (maxPossibleScore > 0 && finalScore === maxPossibleScore) {
      return {
        type: "image",
        source: require("../../assets/images/success.png"),
      };
      // return {
      //   type: "lottie",
      //   source: require("../../assets/animations/celebration.json"),
      //   loop: false,
      // };
    }
    if (finalScore === 0) {
      return {
        type: "image",
        source: require("../../assets/images/success.png"),
      };
      // return {
      //   type: "lottie",
      //   source: require("../../assets/animations/encouragement.json"),
      //   loop: true,
      // };
    }
  }

  // 3. Fallback: If no override or score data, use the default success image.
  return { type: "image", source: require("../../assets/images/success.png") };
};

const ResultsScreen = ({ route, navigation }) => {
  const { theme, isDark } = useTheme();
  const C = theme.appColors || theme;
  const P = quizPalette(isDark);
  const insets = useSafeAreaInsets();

  // --- Destructure all props from the generic "Data Contract" ---
  const {
    title = "Activity Complete!",
    message = "Well done, {username}!",
    metrics = [],
    actions = [
      {
        label: "Done",
        onPress: () => navigation.popToTop(),
        mode: "contained",
      },
    ],
    effects = {},
    submissionContext = null,
    missedQuestions = [],
    closeAction = null, // optional: shows an X (top right) that runs this (e.g. exit the quest)
    savedNote = null, // optional: shown instead of "Result not submitted." when the caller saved results itself
  } = route.params || {};

  const asset = getResultAsset(route.params);

  // --- State Management ---
  const [username, setUsername] = useState("User");
  const [starsAwarded, setStarsAwarded] = useState(0); // from recordQuizResult
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [submitError, setSubmitError] = useState(null);
  const [isConfettiVisible, setConfettiVisible] = useState(false);
  // All state related to FeedbackFAB has been removed

  // --- Side Effects ---
  useEffect(() => {
    const currentUser = authInstance.currentUser;
    if (currentUser?.displayName) setUsername(currentUser.displayName);
    else if (currentUser?.email) setUsername(currentUser.email.split("@")[0]);
    if (effects.confetti) setConfettiVisible(true);
  }, [effects]);

  // --- Backend Submission Logic ---
  const submitResult = useCallback(async () => {
    if (!submissionContext?.cloudFunctionName || !submissionContext?.payload) {
      setSubmitStatus("skipped");
      return;
    }
    setSubmitStatus("submitting");
    setSubmitError(null);
    try {
      const cloudFunction = functions().httpsCallable(
        submissionContext.cloudFunctionName
      );
      const result = await cloudFunction(submissionContext.payload);
      if (result?.data?.status === "success") {
        setStarsAwarded(Number(result.data.starsAwarded) || 0);
        setSubmitStatus("success");
      } else {
        setSubmitError(
          result?.data?.message || "An unexpected server response."
        );
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitError(error.message || "Failed to save results.");
      setSubmitStatus("error");
    }
  }, [submissionContext]);

  useEffect(() => {
    if (submitStatus === "idle") {
      submitResult();
    }
  }, [submitResult, submitStatus]);

  // --- STYLES ---
  // ---------- Look (quiz redesign mockup D, owner-approved 2026-11-04) ----------
  const styles = useMemo(() => makeStyles(P, insets), [P, insets]);

  // Stars only when the caller passed a score: 3 = 90%+, 2 = 60%+, 1 = any right.
  const percent =
    typeof route.params?.finalScore === "number" && route.params?.maxPossibleScore > 0
      ? route.params.finalScore / route.params.maxPossibleScore
      : null;
  const starCount = percent === null ? null : percent >= 0.9 ? 3 : percent >= 0.6 ? 2 : percent > 0 ? 1 : 0;
  const starAnims = useRef([0, 1, 2].map(() => new Animated.Value(0))).current;
  useEffect(() => {
    if (starCount === null) return;
    Animated.stagger(
      260,
      starAnims.map((a) => Animated.spring(a, { toValue: 1, friction: 4, tension: 90, useNativeDriver: true }))
    ).start();
  }, [starCount, starAnims]);

  const plainMetrics = metrics.filter((m) => !m.status);
  const statusMetrics = metrics.filter((m) => m.status);
  const asTiles = plainMetrics.length > 0 && plainMetrics.length <= 3;
  const TILE_COLORS = [
    { head: P.gold, border: P.gold, value: P.streakText },
    { head: P.label, border: P.label, value: P.selectedText },
    { head: "#E9772A", border: "#E9772A", value: P.text },
  ];

  const buttonFor = (action, index) => {
    const look =
      action.mode === "contained"
        ? { bg: P.primary, shadow: P.primaryShadow, fg: P.onPrimary, border: P.primary }
        : action.mode === "outlined"
        ? { bg: P.card, shadow: P.borderDeep, fg: P.selectedText, border: P.border }
        : { bg: "transparent", shadow: "transparent", fg: P.label, border: "transparent" };
    return (
      <TouchableOpacity
        key={index}
        onPress={action.onPress}
        disabled={submitStatus === "submitting"}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={action.label}
        style={[
          styles.button,
          { backgroundColor: look.bg, borderColor: look.border, borderBottomColor: look.shadow },
          action.mode === "text" && styles.textButton,
        ]}
      >
        <Text style={[styles.buttonLabel, { color: look.fg }]}>{action.label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.rootContainer, { backgroundColor: P.bg }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.assetContainer}>
          {route.params?.asset ? (
            asset.type === "lottie" ? (
              <LottieView source={asset.source} autoPlay loop={asset.loop ?? false} style={styles.lottie} />
            ) : (
              <Image source={asset.source} style={styles.image} resizeMode="cover" />
            )
          ) : (
            <Mascot mood="cheer" size={130} />
          )}
        </View>

        {starCount !== null ? (
          <View style={styles.starsRow} accessibilityLabel={`${starCount} of 3 stars`}>
            {starAnims.map((a, i) => (
              <Animated.View key={i} style={{ transform: [{ scale: a }] }}>
                <Ionicons
                  name={i < starCount ? "star" : "star-outline"}
                  size={i === 1 ? 60 : 48}
                  color={i < starCount ? "#F5C842" : P.border}
                />
              </Animated.View>
            ))}
          </View>
        ) : null}

        <Text style={styles.header}>{title}</Text>
        <Text style={styles.messageText}>{message.replace("{username}", username)}</Text>

        {asTiles ? (
          <View style={styles.tilesRow}>
            {plainMetrics.map((m, i) => {
              const c = TILE_COLORS[i % TILE_COLORS.length];
              return (
                <View key={i} style={[styles.tile, { borderColor: c.border }]}>
                  <Text style={[styles.tileHead, { backgroundColor: c.head }]} numberOfLines={1} adjustsFontSizeToFit>
                    {String(m.label).toUpperCase()}
                  </Text>
                  <Text style={[styles.tileValue, { color: c.value }]} numberOfLines={1} adjustsFontSizeToFit>
                    {m.value}
                  </Text>
                </View>
              );
            })}
          </View>
        ) : plainMetrics.length ? (
          <View style={styles.card}>
            {plainMetrics.map((m, i) => (
              <Text key={i} style={styles.metricText}>
                {m.label}: <Text style={styles.metricValue}>{m.value}</Text>
              </Text>
            ))}
          </View>
        ) : null}

        {statusMetrics.length ? (
          <View style={styles.card}>
            {statusMetrics.map((m, i) => (
              <View key={i} style={styles.metricRow}>
                <Ionicons
                  name={m.status === "weak" ? "alert-circle-outline" : "checkmark-circle"}
                  size={22}
                  color={m.status === "weak" ? P.wrongBorder : P.correctBorder}
                />
                <Text style={styles.metricText}>
                  {m.label}: <Text style={styles.metricValue}>{m.value}</Text>
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {missedQuestions && missedQuestions.length > 0 ? (
          <View style={styles.card}>
            <View style={styles.metricRow}>
              <Ionicons name="construct-outline" size={22} color={P.label} />
              <Text style={styles.cardTitle}>
                {missedQuestions.length === 1 ? "1 question to practise" : `${missedQuestions.length} questions to practise`}
              </Text>
            </View>
            {missedQuestions.map((qText, idx) => (
              <Text key={idx} style={styles.practiceItem}>
                • {qText}
              </Text>
            ))}
          </View>
        ) : null}

        <View style={styles.statusContainer}>
          {submitStatus === "submitting" ? <ActivityIndicator size="small" color={P.label} /> : null}
          {submitStatus === "error" ? <Text style={styles.errorText}>{submitError}</Text> : null}
          {submitStatus === "success" ? (
            <Text style={styles.successText}>{starsAwarded > 0 ? `+${starsAwarded} ⭐ earned!` : "Progress saved!"}</Text>
          ) : null}
          {submitStatus === "skipped" ? <Text style={styles.infoText}>{savedNote || "Result not submitted."}</Text> : null}
        </View>

        <View style={styles.buttonContainer}>{actions.map(buttonFor)}</View>
      </ScrollView>

      {closeAction ? (
        <TouchableOpacity
          onPress={closeAction}
          hitSlop={12}
          accessibilityLabel="Close"
          style={[styles.closeButton, { top: insets.top + 10 }]}
        >
          <Ionicons name="close" size={28} color={P.textSoft} />
        </TouchableOpacity>
      ) : null}

      {isConfettiVisible && (
        <LottieView
          source={require("../../assets/animations/confetti.json")}
          autoPlay
          loop={false}
          style={styles.confettiOverlay}
          onAnimationFinish={() => setConfettiVisible(false)}
        />
      )}
    </View>
  );
};

const makeStyles = (P, insets) =>
  StyleSheet.create({
    rootContainer: { flex: 1 },
    scrollContent: { flexGrow: 1, alignItems: "stretch", paddingHorizontal: 20, paddingTop: insets.top + 30, paddingBottom: insets.bottom + 26, gap: 12 },
    assetContainer: { alignItems: "center", marginTop: 6 },
    image: { width: assetDiameter * 0.6, height: assetDiameter * 0.6, borderRadius: assetDiameter * 0.3 },
    lottie: { width: assetDiameter * 0.7, height: assetDiameter * 0.7 },
    starsRow: { flexDirection: "row", justifyContent: "center", alignItems: "flex-end", gap: 6 },
    header: { fontSize: 30, fontFamily: "nunitoBold", color: P.selectedText, textAlign: "center" },
    messageText: { fontSize: 17, fontFamily: "nunitoBold", color: P.textSoft, textAlign: "center", lineHeight: 24 },
    tilesRow: { flexDirection: "row", gap: 10, marginTop: 6 },
    tile: { flex: 1, borderWidth: 2, borderRadius: 18, overflow: "hidden", alignItems: "stretch" },
    tileHead: { color: "#FFFFFF", fontSize: 12, fontFamily: "nunitoBold", letterSpacing: 1, textAlign: "center", paddingVertical: 5, paddingHorizontal: 4 },
    tileValue: { fontSize: 22, fontFamily: "nunitoBold", textAlign: "center", paddingVertical: 10, paddingHorizontal: 6 },
    card: { borderWidth: 2, borderColor: P.border, backgroundColor: P.card, borderRadius: 18, padding: 14, gap: 8 },
    cardTitle: { flex: 1, fontSize: 16, fontFamily: "nunitoBold", color: P.text },
    metricRow: { flexDirection: "row", alignItems: "center", gap: 10 },
    metricText: { flex: 1, fontSize: 16, fontFamily: "nunito", color: P.text, lineHeight: 22 },
    metricValue: { fontFamily: "nunitoBold", color: P.text },
    practiceItem: { fontSize: 15, fontFamily: "nunito", color: P.textSoft, lineHeight: 21 },
    statusContainer: { minHeight: 26, alignItems: "center", justifyContent: "center" },
    successText: { fontSize: 16, fontFamily: "nunitoBold", color: P.correctBorder },
    infoText: { fontSize: 14, fontFamily: "nunitoBold", color: P.textSoft },
    errorText: { fontSize: 14, fontFamily: "nunitoBold", color: P.wrongBorder, textAlign: "center" },
    buttonContainer: { gap: 10, marginTop: 4 },
    button: { height: 56, borderRadius: 18, borderWidth: 2, borderBottomWidth: 5, alignItems: "center", justifyContent: "center" },
    textButton: { borderWidth: 0, borderBottomWidth: 0, height: 48 },
    buttonLabel: { fontSize: 17, fontFamily: "nunitoBold", letterSpacing: 0.5 },
    closeButton: { position: "absolute", right: 16, width: 44, height: 44, alignItems: "center", justifyContent: "center" },
    confettiOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none" },
  });

export default ResultsScreen;
