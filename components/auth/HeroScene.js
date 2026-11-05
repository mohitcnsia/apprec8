// components/auth/HeroScene.js: the friendly animation in the empty top space of the login screens (owner 2026-11-05:
// "leave blank space at the top… some nice animation that makes kids smile").
//   variant "sky"   (log in):        Chamak floats in a night sky; stars twinkle, a little planet circles, a shooting star
//                                     crosses now and then. Tap Chamak: it jumps and sparkles.
//   variant "grow"  (create account): a seed sprouts, two leaves open, and Chamak pops out as the flower.
//   variant "hello" (first run):      Chamak waves; the speech bubble says what the child types ("Hi Pratha! 👋").
// Calm colours (no bright colour jumping out of the dark theme). Still picture when the phone asks for less motion.
// Only Animated + react-native-svg (already in the app): no new library, ships by OTA.

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Ellipse, Path } from "react-native-svg";
import Mascot from "../quiz/Mascot";
import useReduceMotion from "../../hooks/useReduceMotion";

const loop = (value, { from = 0, to = 1, duration = 1600, delay = 0, easing = Easing.inOut(Easing.quad), back = true }) =>
  Animated.loop(
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(value, { toValue: to, duration, easing, useNativeDriver: true }),
      ...(back ? [Animated.timing(value, { toValue: from, duration, easing, useNativeDriver: true })] : []),
    ])
  );

// Stars placed by hand so the sky looks the same every time (x, y in a 260 × 220 box, size, delay ms).
const STARS = [
  [22, 30, 6, 0], [70, 12, 4, 600], [118, 40, 5, 1200], [200, 20, 7, 300], [240, 64, 4, 900],
  [30, 120, 4, 1500], [226, 150, 6, 450], [180, 196, 4, 1100], [58, 186, 5, 750], [150, 6, 3, 1800],
];

function Star({ x, y, size, delay, color, still }) {
  const v = useRef(new Animated.Value(still ? 1 : 0.25)).current;
  useEffect(() => {
    if (still) return undefined;
    const a = loop(v, { from: 0.25, to: 1, duration: 1400 + (delay % 700), delay });
    a.start();
    return () => a.stop();
  }, [still]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Animated.View style={{ position: "absolute", left: x, top: y, opacity: v, transform: [{ scale: v }] }}>
      <Svg width={size * 2} height={size * 2} viewBox="0 0 20 20">
        <Path d="M10 0l2.4 7.6L20 10l-7.6 2.4L10 20l-2.4-7.6L0 10l7.6-2.4z" fill={color} />
      </Svg>
    </Animated.View>
  );
}

function Sparkles({ burst, color }) {
  // Little stars flying out of Chamak when tapped.
  const dirs = [[-1, -1], [1, -1], [-1.3, 0.2], [1.3, 0.2], [0, -1.4], [-0.6, 1], [0.6, 1]];
  return dirs.map(([dx, dy], i) => (
    <Animated.View
      key={i}
      pointerEvents="none"
      style={{
        position: "absolute",
        left: 122,
        top: 98,
        opacity: burst.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 1, 0] }),
        transform: [
          { translateX: burst.interpolate({ inputRange: [0, 1], outputRange: [0, dx * 70] }) },
          { translateY: burst.interpolate({ inputRange: [0, 1], outputRange: [0, dy * 70] }) },
          { scale: burst.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1.2] }) },
        ],
      }}
    >
      <Svg width={16} height={16} viewBox="0 0 20 20">
        <Path d="M10 0l2.4 7.6L20 10l-7.6 2.4L10 20l-2.4-7.6L0 10l7.6-2.4z" fill={color} />
      </Svg>
    </Animated.View>
  ));
}

function useTapCheer(still) {
  const [mood, setMood] = useState("happy");
  const burst = useRef(new Animated.Value(0)).current;
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const tap = () => {
    setMood("cheer");
    burst.setValue(0);
    if (!still) Animated.timing(burst, { toValue: 1, duration: 900, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMood("happy"), 1400);
  };
  return { mood, burst, tap };
}

function SkyScene({ isDark, still }) {
  const starColor = isDark ? "#CFC3D1" : "#B48BBA";
  const orbit = useRef(new Animated.Value(0)).current;
  const shoot = useRef(new Animated.Value(0)).current;
  const { mood, burst, tap } = useTapCheer(still);
  useEffect(() => {
    if (still) return undefined;
    const o = Animated.loop(Animated.timing(orbit, { toValue: 1, duration: 9000, easing: Easing.linear, useNativeDriver: true }));
    const sh = Animated.loop(
      Animated.sequence([
        Animated.delay(3500),
        Animated.timing(shoot, { toValue: 1, duration: 900, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(shoot, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    );
    o.start();
    sh.start();
    return () => {
      o.stop();
      sh.stop();
    };
  }, [still]); // eslint-disable-line react-hooks/exhaustive-deps
  const spin = orbit.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });
  return (
    <View style={styles.box}>
      {STARS.map(([x, y, size, delay]) => (
        <Star key={`${x}-${y}`} x={x} y={y} size={size} delay={delay} color={starColor} still={still} />
      ))}
      {/* shooting star */}
      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: 10,
          top: 30,
          opacity: shoot.interpolate({ inputRange: [0, 0.1, 0.8, 1], outputRange: [0, 1, 1, 0] }),
          transform: [
            { translateX: shoot.interpolate({ inputRange: [0, 1], outputRange: [0, 180] }) },
            { translateY: shoot.interpolate({ inputRange: [0, 1], outputRange: [0, 70] }) },
            { rotate: "21deg" },
          ],
        }}
      >
        <View style={{ width: 46, height: 3, borderRadius: 2, backgroundColor: starColor }} />
      </Animated.View>
      {/* a little planet circling Chamak */}
      <Animated.View pointerEvents="none" style={[styles.orbit, { transform: [{ rotate: spin }] }]}>
        <View style={styles.planetSpot}>
          <Svg width={34} height={34} viewBox="0 0 40 40">
            <Circle cx={20} cy={20} r={11} fill={isDark ? "#5E4F7E" : "#C7B6E8"} />
            <Ellipse cx={20} cy={21} rx={19} ry={5} fill="none" stroke={isDark ? "#8C7BAE" : "#9C86C8"} strokeWidth={2} />
          </Svg>
        </View>
      </Animated.View>
      <Sparkles burst={burst} color={starColor} />
      <Pressable onPress={tap} style={styles.center} accessibilityRole="button" accessibilityLabel="Chamak the star. Tap to say hi">
        <Mascot size={96} mood={mood} />
      </Pressable>
    </View>
  );
}

function GrowScene({ isDark, still }) {
  const grow = useRef(new Animated.Value(still ? 1 : 0)).current;
  const sway = useRef(new Animated.Value(0)).current;
  const { mood, burst, tap } = useTapCheer(still);
  useEffect(() => {
    if (still) return undefined;
    const g = Animated.timing(grow, { toValue: 1, duration: 2600, easing: Easing.out(Easing.cubic), useNativeDriver: true });
    const s = loop(sway, { from: -1, to: 1, duration: 1800 });
    g.start(() => s.start());
    return () => {
      g.stop();
      s.stop();
    };
  }, [still]); // eslint-disable-line react-hooks/exhaustive-deps
  const leaf = isDark ? "#4F7A5C" : "#7FB98F";
  const stemH = grow.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0.02, 1, 1] });
  const leaves = grow.interpolate({ inputRange: [0, 0.45, 0.8, 1], outputRange: [0, 0, 1, 1] });
  const flower = grow.interpolate({ inputRange: [0, 0.75, 1], outputRange: [0, 0, 1] });
  const tilt = sway.interpolate({ inputRange: [-1, 1], outputRange: ["-3deg", "3deg"] });
  return (
    <View style={styles.box}>
      <Animated.View style={{ position: "absolute", left: 0, right: 0, bottom: 0, top: 0, alignItems: "center", transform: [{ rotate: tilt }] }}>
        {/* stem grows up from the pot */}
        <Animated.View style={{ position: "absolute", bottom: 46, width: 6, height: 110, borderRadius: 3, backgroundColor: leaf, transform: [{ translateY: 55 }, { scaleY: stemH }, { translateY: -55 }] }} />
        {/* leaves open */}
        <Animated.View style={{ position: "absolute", bottom: 92, flexDirection: "row", gap: 6, opacity: leaves, transform: [{ scale: leaves }] }}>
          <Svg width={44} height={26} viewBox="0 0 44 26"><Path d="M44 22C30 26 6 22 0 4c14-6 36 0 44 18z" fill={leaf} /></Svg>
          <Svg width={44} height={26} viewBox="0 0 44 26"><Path d="M0 22C14 26 38 22 44 4 30-2 8 4 0 22z" fill={leaf} /></Svg>
        </Animated.View>
        {/* Chamak is the flower */}
        <Animated.View style={{ position: "absolute", bottom: 128, opacity: flower, transform: [{ scale: flower }] }}>
          <Pressable onPress={tap} accessibilityRole="button" accessibilityLabel="Chamak. Tap to say hi">
            <Mascot size={78} mood={mood} />
          </Pressable>
        </Animated.View>
      </Animated.View>
      {/* pot */}
      <View style={{ position: "absolute", bottom: 8, alignSelf: "center" }}>
        <Svg width={92} height={46} viewBox="0 0 92 46">
          <Path d="M4 2h84l-10 42H14z" fill={isDark ? "#5A4636" : "#C9A38A"} />
          <Path d="M0 0h92v10H0z" fill={isDark ? "#6B5443" : "#D8B59D"} />
        </Svg>
      </View>
      <Sparkles burst={burst} color={isDark ? "#CFC3D1" : "#B48BBA"} />
    </View>
  );
}

function HelloScene({ isDark, still, bubble }) {
  const wave = useRef(new Animated.Value(0)).current;
  const pop = useRef(new Animated.Value(1)).current;
  const { mood, burst, tap } = useTapCheer(still);
  useEffect(() => {
    if (still) return undefined;
    const w = loop(wave, { from: -1, to: 1, duration: 500 });
    w.start();
    return () => w.stop();
  }, [still]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (still) return;
    pop.setValue(0.85);
    Animated.spring(pop, { toValue: 1, friction: 4, useNativeDriver: true }).start();
  }, [bubble]); // eslint-disable-line react-hooks/exhaustive-deps
  const rotate = wave.interpolate({ inputRange: [-1, 1], outputRange: ["-6deg", "6deg"] });
  return (
    <View style={styles.box}>
      <Animated.View style={[styles.bubble, { backgroundColor: isDark ? "#2C2640" : "#EFE7FF", transform: [{ scale: pop }] }]}>
        <Text style={[styles.bubbleText, { color: isDark ? "#E9DDEB" : "#3b0940" }]} numberOfLines={2}>{bubble}</Text>
        <View style={[styles.bubbleTail, { borderTopColor: isDark ? "#2C2640" : "#EFE7FF" }]} />
      </Animated.View>
      <Animated.View style={{ position: "absolute", bottom: 14, alignSelf: "center", transform: [{ rotate }] }}>
        <Pressable onPress={tap} accessibilityRole="button" accessibilityLabel="Chamak. Tap to say hi">
          <Mascot size={104} mood={mood} />
        </Pressable>
      </Animated.View>
      <Sparkles burst={burst} color={isDark ? "#CFC3D1" : "#B48BBA"} />
    </View>
  );
}

/**
 * @param {"sky"|"grow"|"hello"} variant
 * @param {boolean} isDark
 * @param {string} [bubble] - "hello" only: what Chamak says
 */
export default function HeroScene({ variant = "sky", isDark, bubble = "" }) {
  const still = useReduceMotion();
  const scene = useMemo(() => variant, [variant]);
  if (scene === "grow") return <GrowScene isDark={isDark} still={still} />;
  if (scene === "hello") return <HelloScene isDark={isDark} still={still} bubble={bubble} />;
  return <SkyScene isDark={isDark} still={still} />;
}

const styles = StyleSheet.create({
  box: { width: 260, height: 220, alignSelf: "center" },
  center: { position: "absolute", left: 82, top: 62 },
  orbit: { position: "absolute", left: 30, top: 10, width: 200, height: 200 },
  planetSpot: { position: "absolute", left: -6, top: 83 },
  bubble: { position: "absolute", top: 4, alignSelf: "center", maxWidth: 240, borderRadius: 18, paddingHorizontal: 16, paddingVertical: 10 },
  bubbleText: { fontSize: 17, fontWeight: "800", textAlign: "center" },
  bubbleTail: { position: "absolute", bottom: -10, alignSelf: "center", width: 0, height: 0, borderLeftWidth: 10, borderRightWidth: 10, borderTopWidth: 10, borderLeftColor: "transparent", borderRightColor: "transparent" },
});
