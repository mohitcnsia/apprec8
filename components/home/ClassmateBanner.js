// components/home/ClassmateBanner.js: lightweight classmate cheer banner (G112 Home tidy-up).
// Shows "Tripti earned 20 ⭐ in Tenses 🎉", fades after 10 s.
// Rules (owner 14 Nov):
// - Classmates only (not self), first names only.
// - Only for kids whose parent linked (parentUids set).
// - Max one per app open (session flag in memory).
// - Cheering only, never comparisons.
// - Reads from the existing class summary (classSummaries/{classId}, no new per-kid reads).
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { getFirestore, doc, getDoc } from "@react-native-firebase/firestore";

import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../quiz/quizPalette";
import useReduceMotion from "../../hooks/useReduceMotion";
import { bundledQuest } from "../../data/quests";
import { topicNamer } from "../../utils/progressView";
import { pickClassmateCheer } from "../../utils/homeTidy";

const db = getFirestore();
let sessionBannerShown = false; // in-memory: max one per app open

export function _resetSessionBannerForTests() {
  sessionBannerShown = false;
}

export default function ClassmateBanner({ myUid, classIds = [], parentUids = [] }) {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const styles = useMemo(() => makeStyles(P), [P]);
  const [message, setMessage] = useState(null);
  const fade = useRef(new Animated.Value(0)).current;
  const reduceMotion = useReduceMotion();

  const isEligible = parentUids && parentUids.length > 0 && classIds && classIds.length > 0 && !sessionBannerShown;

  useEffect(() => {
    if (!isEligible) return;

    let alive = true;
    const classId = classIds[0];

    getDoc(doc(db, "classSummaries", classId))
      .then((snap) => {
        if (!alive || !snap.exists()) return;
        const data = snap.data() || {};
        const namers = {
          "english-quest": topicNamer(bundledQuest("english-quest")?.nodes || []),
          "science-quest": topicNamer(bundledQuest("science-quest")?.nodes || []),
        };
        const cheer = pickClassmateCheer(data.kids || {}, myUid, namers);
        if (cheer && alive) {
          sessionBannerShown = true;
          setMessage(cheer);
        }
      })
      .catch(() => {});

    return () => {
      alive = false;
    };
  }, [isEligible, classIds, myUid]);

  useEffect(() => {
    if (!message) return;

    if (reduceMotion) {
      fade.setValue(1);
    } else {
      Animated.timing(fade, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    }

    // Fades out after 10 s
    const timer = setTimeout(() => {
      if (reduceMotion) {
        setMessage(null);
      } else {
        Animated.timing(fade, { toValue: 0, duration: 500, useNativeDriver: true }).start(() => setMessage(null));
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [message, reduceMotion, fade]);

  if (!message) return null;

  return (
    <Animated.View style={[styles.banner, { opacity: fade }]} accessibilityLabel={message}>
      <Text style={styles.text}>{message}</Text>
      <Pressable onPress={() => setMessage(null)} hitSlop={8} accessibilityRole="button" accessibilityLabel="Dismiss banner">
        <Text style={styles.close}>✕</Text>
      </Pressable>
    </Animated.View>
  );
}

const makeStyles = (P) =>
  StyleSheet.create({
    banner: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 16,
      backgroundColor: P.selectedBg,
      borderWidth: 1.5,
      borderColor: P.selectedBorder,
      marginVertical: 4,
      gap: 8,
    },
    text: { flex: 1, fontSize: 14, fontFamily: "nunitoBold", color: P.selectedText },
    close: { fontSize: 14, fontFamily: "nunitoBold", color: P.textSoft, paddingHorizontal: 4 },
  });
