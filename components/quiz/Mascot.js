// components/quiz/Mascot.js
// "Chamak", the Apprec8 star buddy (owner-approved mockup, 2026-11-04). Original character.
// mood: "happy" (default) | "thinking" (after a wrong answer) | "cheer" (right answer, results)
//       | mood check faces (2026-11-12, owner: "our own icons"): "excited" | "okay" | "tired" | "sad".
// still: no bobbing (a row of faces, small icons).
// Gently bobs up and down; "cheer" jumps. Uses only react-native-svg + Animated (no new native code).

import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import Svg, { Path, Ellipse, Circle } from "react-native-svg";
import useReduceMotion from "../../hooks/useReduceMotion";

const BODY = "M38 4l9.5 19.3 21.3 3.1-15.4 15 3.6 21.2L38 52.6 19 62.6l3.6-21.2-15.4-15 21.3-3.1z";
const INK = "#3b0940";

const SPARKLE = (x, y) => `M${x} ${y - 5}l1.6 3.4 3.4 1.6-3.4 1.6-1.6 3.4-1.6-3.4-3.4-1.6 3.4-1.6z`;

function Face({ mood }) {
  if (mood === "excited") {
    return (
      <>
        <Path d={SPARKLE(31, 34)} fill={INK} />
        <Path d={SPARKLE(45, 34)} fill={INK} />
        <Path d="M29.5 40q8.5 10 17 0z" fill={INK} />
        <Path d="M34 45.4q4 2.4 8 0" fill="#F27C9C" />
      </>
    );
  }
  if (mood === "okay") {
    return (
      <>
        <Ellipse cx={31} cy={34.5} rx={3.2} ry={3.8} fill={INK} />
        <Ellipse cx={45} cy={34.5} rx={3.2} ry={3.8} fill={INK} />
        <Circle cx={32} cy={33.2} r={1} fill="#FFFFFF" />
        <Circle cx={46} cy={33.2} r={1} fill="#FFFFFF" />
        <Path d="M32.5 43.5q5.5 1.6 11 0" stroke={INK} strokeWidth={2.6} fill="none" strokeLinecap="round" />
      </>
    );
  }
  if (mood === "tired") {
    return (
      <>
        <Path d="M27.5 34.5q3.5 3 7 0M41.5 34.5q3.5 3 7 0" stroke={INK} strokeWidth={2.6} fill="none" strokeLinecap="round" />
        <Ellipse cx={38} cy={44} rx={2.4} ry={2.8} fill={INK} />
        <Path d="M52 18h5l-5 5h5" stroke={INK} strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </>
    );
  }
  if (mood === "sad") {
    return (
      <>
        <Ellipse cx={31} cy={35} rx={3.4} ry={4.2} fill={INK} />
        <Ellipse cx={45} cy={35} rx={3.4} ry={4.2} fill={INK} />
        <Circle cx={32.1} cy={33.6} r={1.1} fill="#FFFFFF" />
        <Circle cx={46.1} cy={33.6} r={1.1} fill="#FFFFFF" />
        <Path d="M27 30.2L34 27.6M49 30.2L42 27.6" stroke={INK} strokeWidth={2.2} strokeLinecap="round" />
        <Path d="M31.5 46c3.8-4 9.2-4 13 0" stroke={INK} strokeWidth={2.6} fill="none" strokeLinecap="round" />
        <Path d="M27.6 40.5q-2.2 3.2 0 4.8q2.2-1.6 0-4.8z" fill="#7FB8F0" />
      </>
    );
  }
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

const LABEL = {
  cheer: "Chamak is cheering",
  thinking: "Chamak says: oops, let's see why",
  excited: "Chamak looks excited",
  okay: "Chamak looks okay",
  tired: "Chamak looks tired",
  sad: "Chamak looks sad",
};

export default function Mascot({ mood = "happy", size = 72, style, still = false }) {
  const move = useRef(new Animated.Value(0)).current;
  const reduceMotion = useReduceMotion();

  useEffect(() => {
    if (reduceMotion || still) {
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
  }, [mood, move, reduceMotion, still]);

  const lift = mood === "cheer" ? -size * 0.14 : -size * 0.06;
  const translateY = move.interpolate({ inputRange: [0, 1], outputRange: [0, lift] });

  return (
    <Animated.View
      style={[{ width: size, height: size * 1.1, transform: [{ translateY }] }, style]}
      accessible
      accessibilityLabel={LABEL[mood] || "Chamak, your star buddy"}
    >
      <Svg width="100%" height="100%" viewBox="0 0 76 84">
        <Path d={BODY} fill="#F5C842" stroke="#C99A12" strokeWidth={3} strokeLinejoin="round" />
        <Face mood={mood} />
        {!["thinking", "tired", "sad"].includes(mood) ? (
          <>
            <Circle cx={25} cy={41} r={3} fill="#F29BB8" opacity={0.8} />
            <Circle cx={51} cy={41} r={3} fill="#F29BB8" opacity={0.8} />
          </>
        ) : null}
      </Svg>
    </Animated.View>
  );
}
