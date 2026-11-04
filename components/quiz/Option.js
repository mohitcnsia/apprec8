// components/quiz/Option.js
// One answer option (quiz redesign, mockups approved 2026-11-04).
// - variant "card": full-width card with a letter badge (A–D), at least 70px tall, big bold text.
// - variant "tile": big square-ish tile for short answers (used in a 2×2 grid).
// Chunky "pressable" look (thicker bottom border). After Check: the right answer pops,
// a wrong pick shakes. Colours come from quizPalette, so light and dark mode both read well.
// Same props as before (option, onPress, isSelected, showFeedback, isCorrect) + index, variant.

import React, { useEffect, useMemo, useRef } from "react";
import { Text, TouchableOpacity, StyleSheet, Image, View, Animated } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "./quizPalette";

const LETTERS = "ABCDEFGH";

const Option = ({ option, onPress, isSelected, showFeedback, isCorrect, index = 0, variant = "card" }) => {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const styles = useMemo(() => makeStyles(P), [P]);

  const scale = useRef(new Animated.Value(1)).current;
  const shakeX = useRef(new Animated.Value(0)).current;

  const state = showFeedback
    ? isCorrect
      ? "correct"
      : isSelected
      ? "wrong"
      : "dim"
    : isSelected
    ? "selected"
    : "idle";

  useEffect(() => {
    if (state === "correct" && isSelected) {
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.06, duration: 140, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }),
      ]).start();
    } else if (state === "wrong") {
      Animated.sequence(
        [8, -8, 6, -6, 0].map((x) => Animated.timing(shakeX, { toValue: x, duration: 55, useNativeDriver: true }))
      ).start();
    }
  }, [state, isSelected, scale, shakeX]);

  const look = {
    idle: { box: styles.idle, text: styles.textIdle, badge: styles.badgeIdle, badgeText: styles.badgeTextIdle },
    selected: { box: styles.selected, text: styles.textSelected, badge: styles.badgeSelected, badgeText: styles.badgeTextSelected },
    correct: { box: styles.correct, text: styles.textCorrect, badge: styles.badgeCorrect, badgeText: styles.badgeTextFilled },
    wrong: { box: styles.wrong, text: styles.textWrong, badge: styles.badgeWrong, badgeText: styles.badgeTextFilled },
    dim: { box: styles.idle, text: styles.textDim, badge: styles.badgeIdle, badgeText: styles.badgeTextDim },
  }[state];

  const content = option?.content || "";
  const isImage = option?.type === "image" && option?.mediaUrl;
  const isTile = variant === "tile" && !isImage;

  return (
    <Animated.View style={[isTile ? styles.tileWrap : styles.cardWrap, { transform: [{ scale }, { translateX: shakeX }] }]}>
      <TouchableOpacity
        onPress={onPress}
        disabled={showFeedback}
        activeOpacity={0.75}
        accessibilityRole="button"
        accessibilityLabel={`Answer ${LETTERS[index] || ""}: ${content}`}
        accessibilityState={{ selected: !!isSelected, disabled: !!showFeedback }}
        style={[isTile ? styles.tile : styles.card, look.box]}
      >
        {/* Tiles: one line that shrinks to fit, so a word is never split ("Exclamati-on", owner 2026-11-04) */}
        {isTile ? (
          <Text style={[styles.tileText, look.text]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.45}>
            {content}
          </Text>
        ) : (
          <>
            <View style={[styles.badge, look.badge]}>
              <Text style={[styles.badgeText, look.badgeText]}>{LETTERS[index] || "•"}</Text>
            </View>
            <View style={{ flex: 1 }}>
              {isImage ? <Image source={{ uri: option.mediaUrl }} style={styles.image} resizeMode="contain" /> : null}
              <Text style={[styles.cardText, look.text]}>{content}</Text>
            </View>
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const makeStyles = (P) =>
  StyleSheet.create({
    cardWrap: { marginBottom: 12 },
    tileWrap: { width: "48%", marginBottom: 14 },
    card: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      minHeight: 70,
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 18,
      borderWidth: 2,
      borderBottomWidth: 5,
    },
    tile: {
      height: 112,
      borderRadius: 22,
      borderWidth: 2,
      borderBottomWidth: 6,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 10,
    },
    idle: { backgroundColor: P.card, borderColor: P.border, borderBottomColor: P.borderDeep },
    selected: { backgroundColor: P.selectedBg, borderColor: P.selectedBorder },
    correct: { backgroundColor: P.correctBg, borderColor: P.correctBorder },
    wrong: { backgroundColor: P.wrongBg, borderColor: P.wrongBorder },
    cardText: { fontSize: 19, lineHeight: 25, fontFamily: "nunitoBold" },
    tileText: { fontSize: 32, fontFamily: "nunitoBold", textAlign: "center" },
    textIdle: { color: P.text },
    textSelected: { color: P.selectedText },
    textCorrect: { color: P.correctText },
    textWrong: { color: P.wrongText },
    textDim: { color: P.dimText },
    badge: { width: 34, height: 34, borderRadius: 10, borderWidth: 2, alignItems: "center", justifyContent: "center" },
    badgeText: { fontSize: 15, fontFamily: "nunitoBold" },
    badgeIdle: { borderColor: P.border },
    badgeSelected: { borderColor: P.selectedBorder, backgroundColor: P.card },
    badgeCorrect: { borderColor: P.correctBorder, backgroundColor: P.correctBorder },
    badgeWrong: { borderColor: P.wrongBorder, backgroundColor: P.wrongBorder },
    badgeTextIdle: { color: P.textSoft },
    badgeTextSelected: { color: P.selectedText },
    badgeTextFilled: { color: "#FFFFFF" },
    badgeTextDim: { color: P.dimText },
    image: { width: "100%", height: 100, borderRadius: 12, marginBottom: 8 },
  });

export default Option;
