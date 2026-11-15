// components/common/StarAwardOverlay.js: the flying-stars moment (owner 16 Nov: "stars flying up the screen and a
// text telling why the star is being given, then the text disappears like a bursting cloud").
// Listens to users/{uid}.lastAward (written by the server's star rules, functions/triggers/starTriggers.js) and plays
// once per award id (remembered on the phone), wherever the child is in the app. Never blocks a tap.
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, doc, onSnapshot } from "@react-native-firebase/firestore";
import useReduceMotion from "../../hooks/useReduceMotion";

const SEEN_KEY = "starAward:lastSeenId";
const STARS = [0, 1, 2, 3, 4];

/** "+12 ⭐ · new questions right +8 · streak kept +2 · …" → short lines for the cloud. */
export const awardLines = (a) => {
  if (!a) return [];
  if (a.id === "catch-up") return [`+${a.stars} ⭐`, "for all your practice so far!"];
  return [`+${a.stars} ⭐`, ...(a.reasons || []).slice(0, 3).map((r) => `${r.why} +${r.n}`)];
};

export default function StarAwardOverlay({ uid }) {
  const [award, setAward] = useState(null);
  const lift = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const pop = useRef(new Animated.Value(0.6)).current;
  const reduceMotion = useReduceMotion();

  useEffect(() => {
    if (!uid) return undefined;
    return onSnapshot(
      doc(getFirestore(), "users", uid),
      async (snap) => {
        const a = snap?.data()?.lastAward;
        if (!a?.id || !(a.stars > 0)) return;
        let seen = null;
        try { seen = await AsyncStorage.getItem(SEEN_KEY); } catch { /* play anyway */ }
        if (seen === String(a.id)) return;
        AsyncStorage.setItem(SEEN_KEY, String(a.id)).catch(() => {});
        setAward(a);
      },
      () => {}
    );
  }, [uid]);

  useEffect(() => {
    if (!award) return;
    lift.setValue(0);
    fade.setValue(0);
    pop.setValue(0.6);
    const hold = award.id === "catch-up" ? 3200 : 1800;
    const anim = reduceMotion
      ? Animated.sequence([
          Animated.timing(fade, { toValue: 1, duration: 150, useNativeDriver: true }),
          Animated.delay(hold),
          Animated.timing(fade, { toValue: 0, duration: 200, useNativeDriver: true }),
        ])
      : Animated.sequence([
          Animated.parallel([
            Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true }),
            Animated.spring(pop, { toValue: 1, friction: 5, useNativeDriver: true }),
            Animated.timing(lift, { toValue: 1, duration: 1100, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
          ]),
          Animated.delay(hold),
          // the "bursting cloud": swell and vanish
          Animated.parallel([
            Animated.timing(pop, { toValue: 1.35, duration: 260, useNativeDriver: true }),
            Animated.timing(fade, { toValue: 0, duration: 260, useNativeDriver: true }),
          ]),
        ]);
    anim.start(() => setAward(null));
    return () => anim.stop();
  }, [award, fade, lift, pop, reduceMotion]);

  if (!award) return null;
  const lines = awardLines(award);
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {!reduceMotion
        ? STARS.map((i) => (
            <Animated.Text
              key={i}
              style={[
                s.star,
                {
                  left: `${14 + i * 17}%`,
                  opacity: fade,
                  transform: [{ translateY: lift.interpolate({ inputRange: [0, 1], outputRange: [0, -(260 + (i % 3) * 70)] }) }],
                },
              ]}
            >
              ⭐
            </Animated.Text>
          ))
        : null}
      <Animated.View style={[s.cloud, { opacity: fade, transform: [{ scale: pop }] }]} accessibilityLiveRegion="polite" accessibilityLabel={lines.join(", ")}>
        <Text style={s.big}>{lines[0]}</Text>
        {lines.slice(1).map((l) => (
          <Text key={l} style={s.small}>{l}</Text>
        ))}
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  star: { position: "absolute", bottom: 120, fontSize: 34 },
  cloud: {
    position: "absolute",
    alignSelf: "center",
    top: "38%",
    paddingHorizontal: 26,
    paddingVertical: 16,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.96)",
    alignItems: "center",
    gap: 2,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  big: { fontSize: 34, fontFamily: "nunitoBold", color: "#4e1a53" },
  small: { fontSize: 15, fontFamily: "nunitoBold", color: "#6a4a6e" },
});
