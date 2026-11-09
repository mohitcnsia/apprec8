// screens/paper/PracticePaperScreen.js: practice paper, exam-style and timed (mockup Q1–Q4, owner OK 2026-11-05).
// One screen, five phases (utils/paperSession.js): start → paper ⇄ check → result → answers.
// No hints, hearts or read-aloud while the paper runs (it's a test). The paper in progress is saved on the phone after
// every tap, so closing the app resumes it; the clock keeps running meanwhile, like a real test.
// Opened from Home's "Practice paper" tile. Route params: { grade } (the child's class).

import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../../components/quiz/quizPalette";
import { authInstance } from "../../config/firebaseConfig";
import { isTesterView } from "../../services/ownerView";
import { SUBJECTS, papersFor, paperById, topicTitle, nextMixId, MIX_GRADES, nextCheckupId } from "../../data/papers";
import { paperQuestions, timeLeftMs, clockLabel, checkSummary } from "../../utils/paperScore";
import { optionOrder, fitsTwoByTwo, initialPaperState, paperReducer, resumable, paperOutcome, paperMedal, paperWrongsByQuest } from "../../utils/paperSession";
import { splitInstruction } from "../../utils/quizText";
import { getWhyNotFeedback } from "../../utils/whyNot";
import { SvgXml } from "react-native-svg";
import { themeFigure } from "../../utils/figures";
import { loadPaperSession, savePaperSession, loadPaperHistory, savePaperResult } from "../../services/paperApi";
import { showAlert } from "../../services/dialog";

const reducer = (state, action) => {
  if (action.type === "select") return initialPaperState(action.paperId);
  const paper = paperById(state.paperId);
  return paper ? paperReducer(paper, state, action) : state;
};

const dateLabel = (ms) => new Date(ms).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
const minutesLabel = (ms) => `${Math.max(1, Math.round((ms || 0) / 60000))} minutes`;

export default function PracticePaperScreen({ navigation, route }) {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const insets = useSafeAreaInsets();
  const s = useMemo(() => makeStyles(P, insets), [P, insets]);

  const grade = Number.isInteger(route?.params?.grade) ? route.params.grade : null;
  const isTester = isTesterView(authInstance.currentUser);
  const fixedPapers = useMemo(() => papersFor({ grade, isTester }), [grade, isTester]);
  const [history, setHistory] = useState([]);
  // Mix papers (data/papers/mix.js): a new one per subject after each finished one, built from quest questions.
  const mixGrade = MIX_GRADES.includes(grade) ? grade : isTester ? 5 : null;
  const papers = useMemo(() => {
    const mix = mixGrade ? SUBJECTS.map((sub) => paperById(nextMixId(sub.id, mixGrade, history))).filter(Boolean) : [];
    const checkup = nextCheckupId(grade, history); // G91: Classes 9–10, the check-up comes first
    return [...(checkup ? [paperById(checkup)].filter(Boolean) : []), ...fixedPapers, ...mix];
  }, [fixedPapers, mixGrade, history]);
  const subjects = SUBJECTS.filter((sub) => papers.some((p) => p.subject === sub.id));

  const [state, dispatch] = useReducer(reducer, papers[0]?.id || null, initialPaperState);
  const paper = paperById(state.paperId);
  const questions = useMemo(() => (paper ? paperQuestions(paper) : []), [paper]);

  const [saved, setSaved] = useState(null); // a paper in progress on this phone
  const [now, setNow] = useState(Date.now());
  const [showClockChoice, setShowClockChoice] = useState(true);
  const [onlyMistakes, setOnlyMistakes] = useState(true);
  const [stars, setStars] = useState(null); // stars from the server (null = still asking)
  const [offline, setOffline] = useState(false); // G91: the result was saved on the phone only (no internet)
  const resultSaved = useRef(false);
  const previous = useRef(null); // last result of this paper before today's

  useEffect(() => {
    loadPaperHistory().then(setHistory);
  }, []);

  // On the start screen: is this paper already in progress?
  useEffect(() => {
    if (state.phase !== "start" || !state.paperId) return;
    let alive = true;
    loadPaperSession(state.paperId).then((x) => alive && setSaved(resumable(x, state.paperId)));
    return () => {
      alive = false;
    };
  }, [state.paperId, state.phase]);

  // Keep the paper on the phone after every change.
  useEffect(() => {
    if (state.phase !== "start") savePaperSession(state);
  }, [state]);

  // The clock: every second while the paper runs; at 0:00 the reducer submits.
  const live = state.phase === "paper" || state.phase === "check";
  useEffect(() => {
    if (!live) return;
    const tick = () => {
      const t = Date.now();
      setNow(t);
      dispatch({ type: "tick", now: t });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [live]);

  const outcome = useMemo(
    () => (paper && (state.phase === "result" || state.phase === "answers") ? paperOutcome(paper, state) : null),
    [paper, state]
  );

  // Save once when the paper is submitted.
  useEffect(() => {
    if (!outcome || resultSaved.current) return;
    resultSaved.current = true;
    previous.current = history.find((h) => h.paperId === paper.id) || null;
    setStars(null);
    savePaperResult(paper, outcome, { startedAt: state.startedAt, submittedAt: state.submittedAt, wrongsByQuest: paperWrongsByQuest(paper, state) }).then((r) => {
      setStars(r?.stars || 0);
      setOffline(!!r?.offline);
      loadPaperHistory().then(setHistory);
    });
  }, [outcome]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!paper) {
    return (
      <View style={[s.screen, s.center]}>
        <Text style={s.title}>Practice papers are coming soon for your class.</Text>
      </View>
    );
  }

  const left = state.startedAt != null ? timeLeftMs({ startedAt: state.startedAt, minutes: paper.minutes, now }) : paper.minutes * 60000;
  const clock = state.showClock ? (
    <Text style={[s.clock, left < 5 * 60000 && { borderColor: P.gold }]} accessibilityLabel={`Time left ${clockLabel(left)}`}>
      ⏱ {clockLabel(left)}
    </Text>
  ) : null;
  const subjectTitle = SUBJECTS.find((x) => x.id === paper.subject)?.title || "";

  // ---------- Q1 Start ----------
  if (state.phase === "start") {
    const last = history.find((h) => h.paperId === paper.id);
    const done = (id) => history.some((h) => h.paperId === id);
    const subjectPapers = papers.filter((p) => p.subject === paper.subject);
    const start = () => {
      resultSaved.current = false;
      if (saved) dispatch({ type: "restore", state: saved });
      else dispatch({ type: "start", now: Date.now(), showClock: showClockChoice });
    };
    return (
      <View style={s.screen}>
        <ScrollView contentContainerStyle={s.body}>
          <Text style={s.label}>PRACTICE PAPER</Text>
          {subjects.length > 1 ? (
            <View style={s.segment}>
              {subjects.map((sub) => {
                const on = sub.id === paper.subject;
                return (
                  <Pressable
                    key={sub.id}
                    style={[s.segmentButton, on && s.segmentOn]}
                    onPress={() => !on && dispatch({ type: "select", paperId: papers.find((p) => p.subject === sub.id).id })}
                    accessibilityRole="button"
                    accessibilityState={{ selected: on }}
                  >
                    <Text style={[s.segmentText, on && { color: P.selectedText }]}>{sub.title}</Text>
                  </Pressable>
                );
              })}
            </View>
          ) : null}
          {subjectPapers.map((p) => {
            const on = p.id === paper.id;
            const count = p.parts.reduce((n, part) => n + part.questions.length, 0);
            return (
              <Pressable key={p.id} onPress={() => !on && dispatch({ type: "select", paperId: p.id })} accessibilityRole="button" accessibilityState={{ selected: on }}>
                <View style={[s.card, on && { borderColor: P.selectedBorder }]}>
                  <Text style={s.cardTitle}>{p.title}{p.draft ? "  ·  Draft (testers)" : ""}{done(p.id) ? "  ✓" : ""}</Text>
                  <Text style={s.soft}>
                    {count} questions · {p.minutes} min
                    {p.mix ? " · a new mix of quest questions every time" : ""}
                  </Text>
                  {on ? (
                    <View style={{ marginTop: 10, gap: 6 }}>
                      {p.parts.map((part, i) => (
                        <View key={part.id} style={s.partRow}>
                          <Text style={s.partText}>
                            {i + 1} · {part.title}
                            {part.marks > 1 ? <Text style={{ color: P.gold }}>{`  ★ ${part.marks} marks each`}</Text> : null}
                          </Text>
                          <Text style={s.partCount}>{part.questions.length}</Text>
                        </View>
                      ))}
                    </View>
                  ) : null}
                </View>
              </Pressable>
            );
          })}
          <Text style={s.note}>
            Just like a real test: no hints, no hearts. Answer everything, check your answers, then submit. If you leave, the
            clock keeps going.{"\n\n"}✏️ Keep a pencil and a rough sheet next to you.
          </Text>
          {saved ? null : (
            <View style={s.switchRow}>
              <View style={{ flex: 1 }}>
                <Text style={s.partText}>Show the clock</Text>
                <Text style={s.soft}>Turn off if a clock makes you nervous</Text>
              </View>
              <Switch value={showClockChoice} onValueChange={setShowClockChoice} accessibilityLabel="Show the clock" />
            </View>
          )}
          {last ? <Text style={s.soft}>Last time: {last.score} / {last.max} · {dateLabel(last.at)}</Text> : null}
        </ScrollView>
        <View style={s.footer}>
          <Pressable style={s.primary} onPress={start} accessibilityRole="button">
            <Text style={s.primaryText}>
              {saved ? `CONTINUE (${Object.keys(saved.answers || {}).length} / ${questions.length} done)` : "START PAPER"}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ---------- Q2 In the paper ----------
  if (state.phase === "paper") {
    const item = questions[state.index];
    const { question } = item;
    const part = paper.parts.find((x) => x.id === item.partId);
    const passage = question.passage ? paper.passages?.[question.passage] : null;
    // Picture questions keep their A–D order (spec U); other options are shuffled once per question.
    const options = question.fixedOrder ? question.options : optionOrder(item.id, question.options);
    const pictures = options.some((o) => o.figure);
    const grid = pictures || fitsTwoByTwo(options);
    const chosen = state.answers[item.id];
    const marked = !!state.marked[item.id];
    const isLast = state.index === questions.length - 1;
    const instruction = splitInstruction(question.question?.content || "");
    return (
      <View style={s.screen}>
        <View style={s.topRow}>
          <Text style={[s.soft, { flex: 1, fontWeight: "800" }]} numberOfLines={1}>
            {part?.title}
            {part?.marks > 1 ? ` · ★ ${part.marks} marks` : ""}
          </Text>
          <Text style={[s.soft, { fontWeight: "800" }]}>{item.number} / {questions.length}</Text>
          {clock}
        </View>
        <View style={s.track}>
          <View style={[s.fill, { width: `${Math.round(((state.index + 1) / questions.length) * 100)}%` }]} />
        </View>
        <ScrollView contentContainerStyle={[s.body, { flexGrow: 1 }]}>
          {passage ? <Passage passage={passage} s={s} key={question.passage} /> : null}
          {passage ? <Text style={s.qLabel}>QUESTION</Text> : null}
          {instruction.label && instruction.body ? <Text style={s.qLabel}>{instruction.label}</Text> : null}
          <Text style={s.question}>{instruction.body || question.question?.content}</Text>
          {question.figure ? (
            <View style={s.figureBox} accessibilityLabel="Picture for this question">
              <SvgXml xml={themeFigure(question.figure, P)} width="100%" height={figureHeight(question.figure)} />
            </View>
          ) : null}
          {question.hint ? <Text style={s.soft}>{question.hint}</Text> : null}
          {/* Options sit low, near the thumb (owner 2026-11-05: "tiles are way above the top"). */}
          <View style={{ flexGrow: 1, minHeight: 12 }} />
          <View style={grid ? s.grid : s.stack}>
            {options.map((o) => {
              const on = chosen === o.content;
              return (
                <Pressable
                  key={o.content}
                  style={[s.option, grid && s.optionGrid, on && s.optionOn]}
                  onPress={() => dispatch({ type: "choose", id: item.id, text: o.content })}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on }}
                >
                  {o.figure ? (
                    <>
                      <Text style={[s.figLabel, on && { color: P.selectedText }]}>{o.content.replace(/^Figure /, "")}</Text>
                      <SvgXml xml={themeFigure(o.figure, P)} width={64} height={64} />
                    </>
                  ) : (
                    <Text style={[s.optionText, grid && { textAlign: "center" }, on && { color: P.selectedText }]}>{o.content}</Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
        <View style={[s.footer, s.footerRow]}>
          <Pressable style={s.square} onPress={() => dispatch({ type: "back" })} disabled={state.index === 0} accessibilityLabel="Previous question">
            <Text style={[s.squareText, state.index === 0 && { color: P.dimText }]}>‹</Text>
          </Pressable>
          <Pressable
            style={[s.square, marked && { borderColor: P.gold }]}
            onPress={() => dispatch({ type: "toggleMark", id: item.id })}
            accessibilityLabel={marked ? "Marked to check later. Tap to unmark" : "Mark to check later"}
            accessibilityState={{ selected: marked }}
          >
            <Text style={[s.squareText, { color: marked ? P.gold : P.textSoft }]}>⚑</Text>
          </Pressable>
          <Pressable style={[s.primary, { flex: 1 }]} onPress={() => dispatch({ type: "next" })} accessibilityRole="button">
            <Text style={s.primaryText}>{isLast ? "CHECK" : "NEXT"}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ---------- Q3 Check ----------
  if (state.phase === "check") {
    const sum = checkSummary(paper, state.answers, state.marked);
    const submit = () => {
      const go = () => dispatch({ type: "submit", now: Date.now() });
      if (sum.blank.length === 0) return go();
      showAlert(
        `${sum.blank.length} left blank`,
        "Blank answers get no marks. Submit anyway?",
        [
          { text: "Go back", style: "cancel" },
          { text: "Submit", onPress: go },
        ]
      );
    };
    return (
      <View style={s.screen}>
        <View style={s.topRow}>
          <Text style={[s.title, { flex: 1 }]}>Check your answers</Text>
          {clock}
        </View>
        <ScrollView contentContainerStyle={s.body}>
          <Text style={s.soft}>
            {sum.blank.length} left blank · {sum.marked.length} marked ⚑ · tap a number to go back
          </Text>
          <View style={s.numbers}>
            {questions.map((q, i) => {
              const answered = state.answers[q.id] != null;
              const flagged = !!state.marked[q.id];
              return (
                <Pressable
                  key={q.id}
                  style={[s.num, answered ? s.numAnswered : s.numBlank, flagged && { borderColor: P.gold, borderStyle: "solid" }]}
                  onPress={() => dispatch({ type: "goto", index: i })}
                  accessibilityLabel={`Question ${q.number}, ${answered ? "answered" : "blank"}${flagged ? ", marked" : ""}`}
                >
                  <Text style={[s.numText, answered && { color: P.selectedText }]}>{q.number}</Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={s.soft}>■ answered   ⚑ gold = marked to check   ┄ blank</Text>
        </ScrollView>
        <View style={s.footer}>
          <Text style={[s.soft, { textAlign: "center", marginBottom: 8 }]}>When the clock reaches 0:00, the paper is submitted for you.</Text>
          <View style={s.footerRow}>
            <Pressable style={s.square} onPress={() => dispatch({ type: "back" })} accessibilityLabel="Back to the last question">
              <Text style={s.squareText}>‹</Text>
            </Pressable>
            <Pressable style={[s.primary, { flex: 1 }]} onPress={submit} accessibilityRole="button">
              <Text style={s.primaryText}>SUBMIT PAPER</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  if (!outcome) return null;

  // ---------- Q4 Result ----------
  if (state.phase === "result") {
    const prev = previous.current;
    const medal = paperMedal(outcome.score, outcome.max);
    const topics = outcome.topics || [];
    const mistakesAdded = Object.values(paperWrongsByQuest(paper, state)).flat().filter((w) => !w.question.passage).length;
    const diff = prev ? outcome.score - prev.score : null;
    const line = [
      outcome.timedOut ? "Time was up" : minutesLabel(outcome.usedMs),
      diff == null ? null : diff > 0 ? `${diff} more marks than last time 🎉` : diff === 0 ? "same as last time" : `${-diff} fewer than last time: keep going!`,
    ]
      .filter(Boolean)
      .join(" · ");
    return (
      <View style={s.screen}>
        <ScrollView contentContainerStyle={s.body}>
          <Text style={s.label}>{subjectTitle.toUpperCase()} · {paper.title.toUpperCase()}</Text>
          <Text style={s.score}>
            {outcome.score} <Text style={s.scoreMax}>/ {outcome.max}</Text>
          </Text>
          <Text style={s.soft}>{line}</Text>
          {offline ? (
            <View style={[s.card, { borderColor: P.gold }]} accessibilityLiveRegion="polite">
              <Text style={s.cardTitle}>No internet</Text>
              <Text style={s.soft}>Your answers are safe on this phone. We'll send them when you're back online.</Text>
            </View>
          ) : null}
          <View style={s.medal}>
            <Text style={{ fontSize: 44 }}>{medal.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.cardTitle}>{medal.title}</Text>
              <Text style={s.soft}>
                {stars == null ? "Adding up your stars…" : stars > 0 ? `+${stars} ⭐ for a whole paper` : offline ? "Stars need the internet" : "Stars for this paper: once a week"}
              </Text>
              {mistakesAdded > 0 ? <Text style={s.soft}>{mistakesAdded} questions added to My mistakes 🔧</Text> : null}
            </View>
          </View>
          <View style={[s.card, { gap: 12 }]}>
            {outcome.parts.map((p) => (
              <View key={p.id}>
                <View style={s.partRow}>
                  <Text style={s.partText}>{p.title}</Text>
                  <Text style={s.partCount}>{p.score} / {p.max}</Text>
                </View>
                <View style={[s.track, { marginHorizontal: 0, marginTop: 6 }]}>
                  <View style={[s.fill, { width: `${p.max ? Math.round((p.score / p.max) * 100) : 0}%` }]} />
                </View>
              </View>
            ))}
          </View>
          {/* G91: Accuracy per topic, weakest first; under 60% = "Practise this" (opens that topic). */}
          {topics.length ? (
            <View style={[s.card, { gap: 10 }]}>
              <Text style={s.cardTitle}>Accuracy by topic</Text>
              {topics.map((t) => (
                <Pressable
                  key={`${t.quest}/${t.node}`}
                  onPress={() => navigation.navigate("EnglishQuestMap", { questId: t.quest, openTopic: t.node })}
                  accessibilityRole="button"
                  accessibilityLabel={`${topicTitle(t)}: Accuracy ${t.accuracy}%, ${t.right} of ${t.total} right${t.weak ? ". Practise this" : ""}`}
                >
                  <View style={s.partRow}>
                    <Text style={[s.partText, { flex: 1 }]} numberOfLines={1}>{topicTitle(t)}</Text>
                    <Text style={s.partCount}>{t.right}/{t.total} · {t.accuracy}%</Text>
                  </View>
                  <View style={[s.track, { marginHorizontal: 0, marginTop: 6 }]}>
                    <View style={[s.fill, { width: `${t.accuracy}%` }]} />
                  </View>
                  {t.weak ? <Text style={[s.soft, { marginTop: 4 }]}>Practise this ›</Text> : null}
                </Pressable>
              ))}
            </View>
          ) : null}
          {outcome.score === outcome.max ? <Text style={s.note}>Every answer right. Brilliant! 🌟</Text> : null}
        </ScrollView>
        <View style={s.footer}>
          <Pressable style={s.primary} onPress={() => dispatch({ type: "showAnswers" })} accessibilityRole="button">
            <Text style={s.primaryText}>SEE ANSWERS</Text>
          </Pressable>
          <Pressable style={s.secondary} onPress={() => navigation.goBack()} accessibilityRole="button">
            <Text style={s.secondaryText}>Done</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ---------- Answers ----------
  const rows = outcome.rows.filter((r) => !onlyMistakes || !r.correct);
  return (
    <View style={s.screen}>
      <View style={s.topRow}>
        <Text style={[s.title, { flex: 1 }]}>Answers</Text>
        <Text style={s.soft}>Only mistakes</Text>
        <Switch value={onlyMistakes} onValueChange={setOnlyMistakes} accessibilityLabel="Show only mistakes" />
      </View>
      <ScrollView contentContainerStyle={s.body}>
        {rows.length === 0 ? <Text style={s.note}>No mistakes to show. 🌟</Text> : null}
        {rows.map((r) => {
          const q = questions[r.number - 1].question;
          return (
            <View key={r.questionId} style={s.card}>
              <Text style={s.soft}>Question {r.number}</Text>
              <Text style={[s.partText, { marginTop: 4 }]}>{q.question?.content}</Text>
              {q.figure ? <SvgXml xml={themeFigure(q.figure, P)} width="100%" height={Math.min(120, figureHeight(q.figure))} /> : null}
              {q.options?.find((o) => o.isCorrect)?.figure ? (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 }}>
                  <Text style={s.soft}>Right answer:</Text>
                  <SvgXml xml={themeFigure(q.options.find((o) => o.isCorrect).figure, P)} width={48} height={48} />
                </View>
              ) : null}
              {r.correct ? (
                <Text style={[s.answer, { color: P.correctText, backgroundColor: P.correctBg }]}>✓ {q.answer}</Text>
              ) : (
                <>
                  <Text style={[s.answer, { color: P.wrongText, backgroundColor: P.wrongBg }]}>
                    {r.chosen == null ? "You left it blank" : `Your answer: ${r.chosen}`}
                  </Text>
                  <Text style={[s.answer, { color: P.correctText, backgroundColor: P.correctBg }]}>Right answer: {q.answer}</Text>
                </>
              )}
              {q.explanation?.text ? <Text style={[s.soft, { marginTop: 6 }]}>{q.explanation.text}</Text> : null}
              {(() => {
                const fb = getWhyNotFeedback({
                  question: q,
                  chosen: r.chosen,
                  isCorrect: r.correct,
                });
                if (!r.correct && fb.wrongWhy) {
                  return (
                    <View style={{ marginTop: 6, gap: 2 }}>
                      <Text style={[s.soft, { color: P.wrongText, fontFamily: "nunitoBold", textDecorationLine: "underline" }]}>
                        {fb.wrongWhy.heading}
                      </Text>
                      <Text style={[s.soft, { color: P.wrongText }]}>{fb.wrongWhy.why}</Text>
                    </View>
                  );
                }
                if (r.correct && fb.otherWhys.length > 0) {
                  return (
                    <View style={{ marginTop: 6, gap: 4 }}>
                      <Text style={[s.soft, { color: P.label, fontFamily: "nunitoBold" }]}>Why not the others?</Text>
                      {fb.otherWhys.map((w, idx) => (
                        <Text key={idx} style={[s.soft, { fontSize: 13, lineHeight: 18 }]}>
                          • <Text style={{ fontFamily: "nunitoBold" }}>'{w.option}'</Text>: {w.why}
                        </Text>
                      ))}
                    </View>
                  );
                }
                return null;
              })()}
            </View>
          );
        })}
      </ScrollView>
      <View style={s.footer}>
        <Pressable style={s.primary} onPress={() => navigation.goBack()} accessibilityRole="button">
          <Text style={s.primaryText}>DONE</Text>
        </Pressable>
      </View>
    </View>
  );
}

/** Height for a question picture: from its own viewBox (wide rows stay short), capped for small phones. */
function figureHeight(svg) {
  const m = /viewBox="[-\d.]+ [-\d.]+ ([\d.]+) ([\d.]+)"/.exec(svg || "");
  if (!m) return 120;
  const ratio = Number(m[2]) / Number(m[1]);
  return Math.max(70, Math.min(200, Math.round(340 * ratio)));
}

/** Reading passage above its questions; open at first, can be folded to see the options. */
function Passage({ passage, s }) {
  const [open, setOpen] = useState(true);
  return (
    <View style={s.passage}>
      <Pressable onPress={() => setOpen((o) => !o)} accessibilityRole="button" accessibilityState={{ expanded: open }}>
        <Text style={s.passageTitle}>📖 READ: {passage.title.toUpperCase()}  {open ? "▴ hide" : "▾ show"}</Text>
      </Pressable>
      {open ? (
        <ScrollView style={{ maxHeight: 300 }} nestedScrollEnabled>
          {(passage.paragraphs || []).map((p, i) => (
            <Text key={i} style={s.passageText}>{p}</Text>
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
}

const makeStyles = (P, insets) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: P.bg, paddingTop: insets.top },
    center: { alignItems: "center", justifyContent: "center", padding: 24 },
    body: { padding: 18, gap: 14, paddingBottom: 24 },
    label: { fontSize: 14, fontWeight: "800", letterSpacing: 1, color: P.label },
    title: { fontSize: 22, fontWeight: "800", color: P.text },
    soft: { fontSize: 14, lineHeight: 20, fontWeight: "700", color: P.textSoft },
    note: { fontSize: 15, lineHeight: 22, fontWeight: "700", color: P.text, backgroundColor: P.borderDeep, borderRadius: 16, padding: 14 },
    segment: { flexDirection: "row", gap: 8 },
    segmentButton: { flex: 1, height: 48, borderRadius: 14, borderWidth: 2, borderColor: P.border, alignItems: "center", justifyContent: "center" },
    segmentOn: { borderColor: P.selectedBorder, backgroundColor: P.selectedBg },
    segmentText: { fontSize: 16, fontWeight: "800", color: P.textSoft },
    card: { borderRadius: 18, borderWidth: 2, borderColor: P.border, backgroundColor: P.card, padding: 16 },
    cardTitle: { fontSize: 18, fontWeight: "800", color: P.text },
    partRow: { flexDirection: "row", alignItems: "center", gap: 10 },
    partText: { flex: 1, fontSize: 16, lineHeight: 22, fontWeight: "800", color: P.text },
    partCount: { fontSize: 15, fontWeight: "800", color: P.textSoft },
    switchRow: { flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 16, borderWidth: 2, borderColor: P.border, padding: 14 },
    topRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 18, paddingTop: 14 },
    clock: { fontSize: 14, fontWeight: "800", color: P.text, borderWidth: 1, borderColor: P.border, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, overflow: "hidden" },
    track: { height: 6, borderRadius: 3, backgroundColor: P.track, marginHorizontal: 18, marginTop: 10, overflow: "hidden" },
    fill: { height: 6, borderRadius: 3, backgroundColor: P.primary },
    question: { fontSize: 22, lineHeight: 30, fontWeight: "800", color: P.text },
    figureBox: { borderRadius: 16, backgroundColor: P.borderDeep, padding: 12, alignItems: "center" },
    figLabel: { fontSize: 13, fontWeight: "900", color: P.textSoft },
    qLabel: { fontSize: 13, fontWeight: "800", letterSpacing: 1, color: P.label, marginBottom: -6 },
    medal: { flexDirection: "row", alignItems: "center", gap: 14, borderRadius: 18, borderWidth: 2, borderColor: P.gold, backgroundColor: P.streakBg, padding: 14 },
    stack: { gap: 10 },
    grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    option: { minHeight: 62, borderRadius: 18, borderWidth: 2, borderColor: P.border, backgroundColor: P.card, justifyContent: "center", paddingHorizontal: 16, paddingVertical: 12 },
    optionGrid: { width: "47%", flexGrow: 1, minHeight: 84, alignItems: "center" },
    optionOn: { borderColor: P.selectedBorder, backgroundColor: P.selectedBg },
    optionText: { fontSize: 19, lineHeight: 25, fontWeight: "800", color: P.text },
    // The story looks like a page of a book (serif, softer, a margin line), so it never looks like the question.
    passage: { borderRadius: 14, borderLeftWidth: 4, borderLeftColor: P.label, backgroundColor: P.borderDeep, paddingVertical: 12, paddingHorizontal: 14, gap: 8 },
    passageTitle: { fontSize: 14, fontWeight: "800", letterSpacing: 0.5, color: P.label },
    passageText: { fontFamily: Platform.OS === "android" ? "serif" : "Georgia", fontSize: 16, lineHeight: 25, color: P.textSoft, marginBottom: 10 },
    numbers: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    num: { width: 44, height: 44, borderRadius: 12, borderWidth: 2, alignItems: "center", justifyContent: "center" },
    numAnswered: { borderColor: P.selectedBorder, backgroundColor: P.selectedBg },
    numBlank: { borderColor: P.border, borderStyle: "dashed" },
    numText: { fontSize: 15, fontWeight: "800", color: P.textSoft },
    score: { fontSize: 56, fontWeight: "900", color: P.text },
    scoreMax: { fontSize: 28, fontWeight: "800", color: P.textSoft },
    practiseRow: { flexDirection: "row", alignItems: "center", gap: 10, minHeight: 48 },
    answer: { marginTop: 8, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, fontSize: 15, fontWeight: "800", overflow: "hidden" },
    footer: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: Math.max(14, insets.bottom + 8), gap: 10 },
    footerRow: { flexDirection: "row", gap: 10 },
    primary: { height: 58, borderRadius: 18, backgroundColor: P.primary, borderBottomWidth: 5, borderBottomColor: P.primaryShadow, alignItems: "center", justifyContent: "center", paddingHorizontal: 12 },
    primaryText: { color: P.onPrimary, fontSize: 18, fontWeight: "800", letterSpacing: 1 },
    secondary: { height: 52, borderRadius: 16, borderWidth: 2, borderColor: P.border, alignItems: "center", justifyContent: "center" },
    secondaryText: { color: P.textSoft, fontSize: 16, fontWeight: "800" },
    square: { width: 58, height: 58, borderRadius: 18, borderWidth: 2, borderColor: P.border, alignItems: "center", justifyContent: "center" },
    squareText: { fontSize: 22, fontWeight: "800", color: P.textSoft },
  });
