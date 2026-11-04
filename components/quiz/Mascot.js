// components/quiz/Mascot.js
// "Chamak", the Apprec8 star buddy (owner-approved mockup, 2026-11-04). Original character.
// mood: "happy" (default) | "thinking" (after a wrong answer) | "cheer" (right answer, results).
// Gently bobs up and down; "cheer" jumps. Uses only react-native-svg + Animated (no new native code).

import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import Svg, { Path, Ellipse, Circle } from "react-native-svg";
import useReduceMotion from "../../hooks/useReduceMotion";

const BODY = "M38 4l9.5 19.3 21.3 3.1-15.4 15 3.6 21.2L38 52.6 19 62.6l3.6-21.2-15.4-15 21.3-3.1z";
const INK = "#3b0940";

function Face({ mood }) {
  if (mood === "cheer") {
    return (
      <>
        <Path d="M8 30L1 20M68 30l7-10" stroke="#C99A12" strokeWidth={3.4} strokeLinecap="round" />
        <Path d="M27.5 34.5q3.5-4 7 0M41.5 34.5q3.5-4 7 0" stroke={INK} strokeWidth={2.6} fill="none" strokeLinecap="round" />
        <Path d="M30 40q8 9 16 0z" fill={INK} />
        <Path d="M34 44q4 2.6 8 0" fill="#F27C9C" />
      </>
    );
  }
  if (mood === "thinking") {
    return (
      <>
        {/* Kind "oops" face (QA 2026-11-04: the old slanted brows read as angry). Raised, curved brows
            + a small wobbly smile say "that's ok, let's see why". */}
        <Ellipse cx={31} cy={35} rx={3.6} ry={4.4} fill={INK} />
        <Ellipse cx={45} cy={35} rx={3.6} ry={4.4} fill={INK} />
        <Circle cx={32.2} cy={33.4} r={1.2} fill="#FFFFFF" />
        <Circle cx={46.2} cy={33.4} r={1.2} fill="#FFFFFF" />
        <Path d="M27 27.5q4-3 8 -0.5M41 27q4-2.5 8 0.5" stroke={INK} strokeWidth={2.2} fill="none" strokeLinecap="round" />
        <Path d="M32 44.5q2-1.6 4 0t4 0t4 0" stroke={INK} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </>
    );
  }
  return (
    <>
      <Ellipse cx={31} cy={34} rx={3.6} ry={4.6} fill={INK} />
      <Ellipse cx={45} cy={34} rx={3.6} ry={4.6} fill={INK} />
      <Circle cx={32.2} cy={32.4} r={1.2} fill="#FFFFFF" />
      <Circle cx={46.2} cy={32.4} r={1.2} fill="#FFFFFF" />
      <Path d="M31.5 42c3.8 4 9.2 4 13 0" stroke={INK} strokeWidth={2.6} fill="none" strokeLinecap="round" />
    </>
  );
}

export default function Mascot({ mood = "happy", size = 72, style }) {
  const move = useRef(new Animated.Value(0)).current;
  const reduceMotion = useReduceMotion();

  useEffect(() => {
    if (reduceMotion) {
      move.setValue(0);
      return undefined;
    }
    const jump = mood === "cheer";
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(move, { toValue: 1, duration: jump ? 450 : 1200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(move, { toValue: 0, duration: jump ? 450 : 1200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [mood, move, reduceMotion]);

  const lift = mood === "cheer" ? -size * 0.14 : -size * 0.06;
  const translateY = move.interpolate({ inputRange: [0, 1], outputRange: [0, lift] });

  return (
    <Animated.View
      style={[{ width: size, height: size * 1.1, transform: [{ translateY }] }, style]}
      accessible
      accessibilityLabel={mood === "cheer" ? "Chamak is cheering" : mood === "thinking" ? "Chamak says: oops, let's see why" : "Chamak, your star buddy"}
    >
      <Svg width="100%" height="100%" viewBox="0 0 76 84">
        <Path d={BODY} fill="#F5C842" stroke="#C99A12" strokeWidth={3} strokeLinejoin="round" />
        <Face mood={mood} />
        {mood !== "thinking" ? (
          <>
            <Circle cx={25} cy={41} r={3} fill="#F29BB8" opacity={0.8} />
            <Circle cx={51} cy={41} r={3} fill="#F29BB8" opacity={0.8} />
          </>
        ) : null}
      </Svg>
    </Animated.View>
  );
}
