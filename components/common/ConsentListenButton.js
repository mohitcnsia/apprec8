// components/common/ConsentListenButton.js
// 🔊 Listen button on parent consent notes. Tap to read aloud with expo-speech, tap again = stop.

import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import * as Speech from "expo-speech";
import { SPEECH_LANG, consentSpeechText, consentListenLabel } from "../../utils/consentListen";

export default function ConsentListenButton({ text, lang = "en", P, style }) {
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    try {
      Speech.stop();
    } catch (e) {}
    setSpeaking(false);
    return () => {
      try {
        Speech.stop();
      } catch (e) {}
      setSpeaking(false);
    };
  }, [lang, text]);

  const speechText = consentSpeechText(text, lang);

  const toggle = () => {
    if (speaking) {
      try {
        Speech.stop();
      } catch (e) {}
      setSpeaking(false);
      return;
    }
    if (!speechText) return;
    try {
      Speech.stop();
    } catch (e) {}
    setSpeaking(true);
    const speechLang = SPEECH_LANG[lang] || (lang === "hi" ? "hi-IN" : "en-IN");
    try {
      Speech.speak(speechText, {
        language: speechLang,
        rate: 0.9,
        onDone: () => setSpeaking(false),
        onStopped: () => setSpeaking(false),
        onError: () => setSpeaking(false),
      });
    } catch (e) {
      setSpeaking(false);
    }
  };

  const label = consentListenLabel(speaking, lang);

  return (
    <Pressable
      onPress={toggle}
      accessibilityRole="button"
      accessibilityLabel={speaking ? (lang === "hi" ? "पढ़ना रोकें" : "Stop reading aloud") : (lang === "hi" ? "नोट सुनें" : "Listen to consent note")}
      hitSlop={8}
      style={({ pressed }) => [
        styles.button,
        P && {
          backgroundColor: speaking ? (P.primary || "#3b0940") : (P.selectedBg || "#F7E8F8"),
          borderColor: speaking ? (P.primary || "#3b0940") : (P.selectedBorder || "#85508a"),
        },
        speaking && styles.buttonSpeaking,
        pressed && { opacity: 0.75 },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          P && { color: speaking ? (P.onPrimary || "#FFFFFF") : (P.selectedText || "#3b0940") },
          speaking && styles.textSpeaking,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#85508a",
    backgroundColor: "#F7E8F8",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonSpeaking: {
    borderColor: "#3b0940",
    backgroundColor: "#3b0940",
  },
  text: {
    fontSize: 13,
    fontFamily: "nunitoBold",
    color: "#3b0940",
  },
  textSpeaking: {
    color: "#FFFFFF",
  },
});
