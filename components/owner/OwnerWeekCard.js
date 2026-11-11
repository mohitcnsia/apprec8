// components/owner/OwnerWeekCard.js: the owner's weekly "Is it working?" (redesign doc; owner, 2026-11-12: "critical").
// Progress → This week (owner only). Numbers from functions/callable/ownerActions.js ownerWeekly (worked out at most once
// an hour). Small numbers show as counts, not percentages. Totals only: no child's mood by name. What isn't collected yet
// says so, never a made-up number.
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import functions from "@react-native-firebase/functions";
import { updatedText } from "../../utils/refreshSlots";
import Mascot from "../quiz/Mascot";


export default function OwnerWeekCard({ P, refreshTrigger = 0 }) {
  const s = useMemo(() => makeStyles(P), [P]);
  const [d, setD] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async (force = false) => {
    setBusy(true);
    setError("");
    try {
      const r = await functions().httpsCallable("ownerWeekly")({ force });
      setD(r.data);
    } catch (e) {
      setError(e?.code === "functions/not-found" ? "Deploy ownerWeekly first (see the card)." : "Couldn't load. Pull down to try again.");
    }
    setBusy(false);
  }, []);
  useEffect(() => {
    load(refreshTrigger > 0);
  }, [load, refreshTrigger]);

  if (!d && !error) return <ActivityIndicator color={P.label} />;
  if (!d) return <Text style={s.soft}>{error}</Text>;

  const k = d.kids;
  const kidsLine = k.practisedLast ? `${k.practised} kids practised, ${k.practised >= k.practisedLast ? "up" : "down"} from ${k.practisedLast} last week` : `${k.practised} kids practised this week`;

  return (
    <View style={{ gap: 12 }}>
      <View style={s.row}>
        <Text style={s.soft}>Since Monday · {updatedText(d.at)}</Text>
        <Pressable onPress={() => load(true)} disabled={busy} accessibilityRole="button" style={s.refresh}>
          <Text style={s.link}>{busy ? "…" : "Refresh"}</Text>
        </Pressable>
      </View>

      <View style={s.card}>
        <Text style={s.label}>KIDS</Text>
        <Text style={s.big}>{kidsLine}</Text>
        <Text style={s.soft}>{k.twoPlusDays} came back on 2 or more days · {k.total} kids have played so far</Text>
      </View>

      <View style={s.card}>
        <Text style={s.label}>LEARNING</Text>
        <Text style={s.big}>
          {d.topics.learnedThisWeek} {d.topics.learnedThisWeek === 1 ? "topic" : "topics"} learned this week
        </Text>
        <Text style={s.soft}>
          {d.topics.remembersNow} still remembered a week later · {d.topics.slippingNow} slipping
        </Text>
        <Text style={s.soft}>
          {d.answers.answered} answers{d.answers.accuracy !== null ? ` · ${d.answers.accuracy}% accuracy` : ""}
        </Text>
      </View>

      <View style={s.card}>
        <Text style={s.label}>QUESTIONS TO CHECK · {d.problems.length}</Text>
        {d.problems.length ? (
          d.problems.map((p) => (
            <View key={`${p.quizId}|${p.questionId}`} style={s.problem}>
              <Text style={s.q}>{p.text || `${p.quizId} · ${p.questionId}`}</Text>
              <Text style={s.soft}>
                The app says: {p.answer || "?"}
                {p.topWrong ? ` · most picked: ${p.topWrong}` : ""}
              </Text>
              <Text style={s.warn}>
                {p.strongWrong} of {p.strongTotal} strong kids got it wrong: check the answer key
              </Text>
            </View>
          ))
        ) : (
          <Text style={s.soft}>None this week: no question that strong kids keep getting wrong.</Text>
        )}
      </View>

      <View style={s.card}>
        <Text style={s.label}>WELL-BEING · TOTALS ONLY</Text>
        <Text style={s.body}>{d.mood.answered ? `${d.mood.answered} mood taps` : "No mood taps yet this week."}</Text>
        {d.mood.answered ? (
          <View style={s.moods}>
            {Object.entries(d.mood.counts || {}).map(([m, n]) => (
              <View key={m} style={s.moodItem} accessibilityLabel={`${m}: ${n}`}>
                <Mascot mood={m} size={26} still />
                <Text style={s.body}>{n}</Text>
              </View>
            ))}
          </View>
        ) : null}
        {d.mood.flagged ? <Text style={s.soft}>{d.mood.flagged} on the counsellor's list (she sees the names)</Text> : null}
        <Text style={s.soft}>{d.appreciated} appreciations from teachers</Text>
      </View>

      <View style={s.card}>
        <Text style={s.label}>NOT COLLECTED YET</Text>
        <Text style={s.soft}>Talks at home (parents' taps stay on their phones) · teachers' "saved me time" (monthly tap, not built)</Text>
        <Pressable onPress={() => Linking.openURL("https://console.firebase.google.com/project/apprec8-ca229/usage").catch(() => {})} accessibilityRole="link" style={s.refresh}>
          <Text style={s.link}>Cost: Firebase usage and billing ›</Text>
        </Pressable>
      </View>
    </View>
  );
}

const makeStyles = (P) =>
  StyleSheet.create({
    card: { padding: 16, borderRadius: 20, backgroundColor: P.card, borderWidth: 1, borderColor: P.border, gap: 6 },
    row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    label: { fontSize: 12, fontFamily: "nunitoBold", letterSpacing: 1, color: P.label },
    big: { fontSize: 18, fontFamily: "nunitoBold", color: P.text, lineHeight: 24 },
    body: { fontSize: 15, fontFamily: "nunito", color: P.text },
    soft: { fontSize: 13, fontFamily: "nunito", color: P.textSoft, lineHeight: 18 },
    warn: { fontSize: 13, fontFamily: "nunitoBold", color: P.wrongText },
    q: { fontSize: 15, fontFamily: "nunitoBold", color: P.text },
    problem: { gap: 2, paddingVertical: 6, borderTopWidth: 1, borderTopColor: P.border },
    refresh: { minHeight: 40, justifyContent: "center" },
    moods: { flexDirection: "row", flexWrap: "wrap", gap: 14, alignItems: "center" },
    moodItem: { flexDirection: "row", alignItems: "center", gap: 4 },
    link: { fontSize: 14, fontFamily: "nunitoBold", color: P.label },
  });
