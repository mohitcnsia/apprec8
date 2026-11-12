// components/admin/PersonaCard.js: Admin tools → View as (owner, 2026-11-12). Pick a kid of any class, a parent or a
// teacher: Home, quest maps, papers, Progress and Me show what that person sees. This phone only; the owner's account
// keeps its owner rights on the server, and nothing is saved to anyone (services/persona.js).
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { usePersona, setPersona } from "../../services/persona";

const GRADES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function PersonaCard({ P, teaches = 0, children = 0 }) {
  const persona = usePersona();
  const Choice = ({ role, label, detail }) => {
    const on = persona.role === role;
    return (
      <Pressable
        onPress={() => setPersona({ role, grade: role === "kid" ? persona.grade || 7 : null })}
        accessibilityRole="radio"
        accessibilityState={{ selected: on }}
        style={[s.choice, { borderColor: on ? P.selectedBorder : P.border, backgroundColor: on ? P.selectedBg : "transparent" }]}
      >
        <Text style={[s.label, { color: on ? P.selectedText : P.text }]}>{label}</Text>
        {detail ? <Text style={[s.detail, { color: P.textSoft }]}>{detail}</Text> : null}
      </Pressable>
    );
  };
  return (
    <View style={{ gap: 8 }}>
      <Choice role="owner" label="Owner (everything)" />
      <Choice role="kid" label="Kid" detail={persona.role === "kid" ? `Class ${persona.grade}: Home, quests, papers, Progress` : "Pick a class below"} />
      {persona.role === "kid" ? (
        <View style={s.grades} accessibilityRole="radiogroup">
          {GRADES.map((g) => {
            const on = persona.grade === g;
            return (
              <Pressable
                key={g}
                onPress={() => setPersona({ role: "kid", grade: g })}
                accessibilityRole="radio"
                accessibilityLabel={`Class ${g}`}
                accessibilityState={{ selected: on }}
                style={[s.grade, { borderColor: on ? P.primary : P.border, backgroundColor: on ? P.primary : "transparent" }]}
              >
                <Text style={[s.gradeText, { color: on ? P.onPrimary : P.text }]}>{g}</Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
      <Choice role="parent" label="Parent" detail={children ? `of your ${children === 1 ? "child" : `${children} children`}` : "you have no children linked yet"} />
      <Choice role="teacher" label="Teacher" detail={teaches ? `your ${teaches === 1 ? "class" : `${teaches} classes`}` : "you teach no class yet: make a test class in Schools"} />
      <Text style={[s.detail, { color: P.textSoft }]}>This phone only. Your account keeps owner rights; nothing is saved to anyone.</Text>
    </View>
  );
}

const s = StyleSheet.create({
  choice: { minHeight: 48, borderRadius: 14, borderWidth: 1.5, paddingHorizontal: 14, paddingVertical: 8, justifyContent: "center" },
  label: { fontSize: 15, fontFamily: "nunitoBold" },
  detail: { fontSize: 13, fontFamily: "nunito", lineHeight: 18 },
  grades: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  grade: { width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  gradeText: { fontSize: 15, fontFamily: "nunitoBold" },
});
