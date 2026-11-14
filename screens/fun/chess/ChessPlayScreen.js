// screens/fun/chess/ChessPlayScreen.js
// "Guess the Move" session (owner-only; spec + mockups approved 13 Nov 2026).
// Watch the opening, then guess the master's moves: green arrow = found it, red = engine says
// much worse (needs evals — not computed yet), blue = better than the master, neutral "book"
// when there is no engine data. Book comments appear under FROM THE BOOK; playable variations
// are tappable and replay on the board. Board at the bottom, one big button — thumb zone.
// All chess logic lives in utils/chessGame.js; this screen only walks the precomputed JSON.

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useTheme } from "../../../context/ThemeContext";
import { quizPalette } from "../../../components/quiz/quizPalette";
import ChessBoard, { BOARD_THEMES } from "../../../components/games/chess/ChessBoard";
import {
  START_FEN,
  flattenComment,
  isGuessPly,
  guessStartPly,
  legalDestinations,
  movableSquares,
  resolveGuess,
  guessVerdict,
  guessPlies,
  strengthReport,
} from "../../../utils/chessGame";

const PROGRESS_KEY = "chessProgress:v1";
const THEME_KEY = "chessBoardTheme:v1";
const ARROW = { green: "#2FA84F", red: "#E04836", blue: "#3E73C8", guess: "#85508a" };

const fenAt = (game, ply) => (ply <= 0 ? START_FEN : game.moves[ply - 1]?.fenAfter || START_FEN);
const lastName = (s) => String(s || "").split(",")[0].trim();
const sanOfUci = (u) => `${u.slice(0, 2)}–${u.slice(2, 4)}`;

export default function ChessPlayScreen({ navigation, route }) {
  const { game, gameId, theme: initialTheme } = route.params;
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const boardSize = Math.min(width - 24, 420);
  const styles = useMemo(() => makeStyles(P, insets), [P, insets]);

  const master = lastName(game.guessSide === "White" ? game.white : game.black);
  const flipped = game.guessSide === "Black";
  const totalGuesses = useMemo(() => guessPlies(game).length, [game]);

  // Mode: "guess" (interactive guessing) vs "watch" (replay & commentary)
  const [mode, setMode] = useState("guess");
  const [watchPly, setWatchPly] = useState(0);
  const [autoPlaying, setAutoPlaying] = useState(false);
  const [boardTheme, setBoardTheme] = useState(initialTheme || "wood");

  // ply = plies already on the board. reveal = result of the last guess. variation = replay mode.
  const [ply, setPly] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [guessed, setGuessed] = useState(0);
  const [guessLog, setGuessLog] = useState([]); // [{ ply, verdict, cpLoss }] for the end report
  const [selected, setSelected] = useState(null);
  const [reveal, setReveal] = useState(null); // { verdict, guessUci, cpLoss, cpDelta }
  const [variation, setVariation] = useState(null); // { line, vply, baseFen }
  const loaded = useRef(false);

  // Load board theme if not passed via route
  useEffect(() => {
    if (!initialTheme) {
      AsyncStorage.getItem(THEME_KEY)
        .then((t) => t && setBoardTheme(t))
        .catch(() => {});
    }
  }, [initialTheme]);

  // Resume where the owner left off in Guess mode.
  useEffect(() => {
    AsyncStorage.getItem(PROGRESS_KEY)
      .then((raw) => {
        const saved = raw ? JSON.parse(raw)[gameId] : null;
        if (saved && !saved.done && saved.ply > 0 && saved.ply < game.moves.length) {
          setPly(saved.ply);
          setCorrect(saved.correct || 0);
          setGuessed(saved.guessed || 0);
          setGuessLog(saved.guessLog || []);
        }
        loaded.current = true;
      })
      .catch(() => {
        loaded.current = true;
      });
  }, [gameId, game.moves.length]);

  // Save after every guess change (Guess mode only; Watch mode never touches progress).
  useEffect(() => {
    if (!loaded.current || mode === "watch") return;
    AsyncStorage.getItem(PROGRESS_KEY)
      .then((raw) => {
        const all = raw ? JSON.parse(raw) : {};
        all[gameId] = { ply, correct, guessed, guessLog, done: ply >= game.moves.length, updatedAt: Date.now() };
        return AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
      })
      .catch(() => {});
  }, [ply, correct, guessed, guessLog, mode, gameId, game.moves.length]);

  // Slow auto-play timer for Watch mode (2.5 seconds per ply).
  useEffect(() => {
    if (mode !== "watch" || !autoPlaying) return;
    const timer = setInterval(() => {
      setWatchPly((current) => {
        if (current + 1 >= game.moves.length) {
          setAutoPlaying(false);
          return game.moves.length;
        }
        return current + 1;
      });
    }, 2500);
    return () => clearInterval(timer);
  }, [mode, autoPlaying, game.moves.length]);

  const done = ply >= game.moves.length;
  const guessing = mode === "guess" && !done && !reveal && isGuessPly(game, ply);
  const lastMoveEntry = ply > 0 ? game.moves[ply - 1] : null;
  const watchMoveEntry = watchPly > 0 ? game.moves[watchPly - 1] : null;

  const guessComment = flattenComment(
    (reveal || !guessing ? lastMoveEntry?.comment : "") || (ply === 0 ? game.gameComment : "")
  );
  const watchComment = flattenComment(
    (watchPly === 0 ? game.gameComment : watchMoveEntry?.comment) || ""
  );
  const activeComment = mode === "watch" ? watchComment : guessComment;

  const legal = guessing ? game.moves[ply].legal : [];
  const movable = useMemo(() => (guessing ? new Set(movableSquares(legal)) : new Set()), [legal, guessing]);

  const onSquarePress = (square) => {
    if (mode !== "guess" || variation || !guessing) return;
    if (selected) {
      const uci = resolveGuess(legal, selected, square);
      if (uci) {
        const bookUci = game.moves[ply].uci;
        const v = guessVerdict(uci, bookUci, game.evals?.[String(ply)] || null);
        setGuessed((n) => n + 1);
        if (v.verdict === "green") setCorrect((n) => n + 1);
        setGuessLog((l) => [...l, { ply, verdict: v.verdict, cpLoss: v.cpLoss }]);
        setReveal({ ...v, guessUci: uci, bookUci });
        setSelected(null);
        setPly((p) => p + 1); // the master's move is played on the board
        return;
      }
      if (movable.has(square) && square !== selected) {
        setSelected(square);
        return;
      }
      setSelected(null);
      return;
    }
    if (movable.has(square)) setSelected(square);
  };

  const onButton = () => {
    if (variation) {
      if (variation.vply < variation.line.length) setVariation({ ...variation, vply: variation.vply + 1 });
      else setVariation(null);
      return;
    }
    if (done) {
      navigation.goBack();
      return;
    }
    if (reveal) {
      setReveal(null);
      return;
    }
    setPly((p) => p + 1); // watch phase / opponent's reply
  };

  // ---- what the board shows
  let fen = mode === "watch" ? fenAt(game, watchPly) : fenAt(game, ply);
  let lastMove = mode === "watch"
    ? watchMoveEntry ? [watchMoveEntry.uci.slice(0, 2), watchMoveEntry.uci.slice(2, 4)] : null
    : lastMoveEntry ? [lastMoveEntry.uci.slice(0, 2), lastMoveEntry.uci.slice(2, 4)] : null;
  let arrows = [];

  if (variation) {
    fen = variation.vply === 0 ? variation.baseFen : variation.line[variation.vply - 1].fenAfter;
    const vm = variation.vply > 0 ? variation.line[variation.vply - 1] : null;
    lastMove = vm ? [vm.uci.slice(0, 2), vm.uci.slice(2, 4)] : null;
  } else if (mode === "guess" && reveal) {
    const book = { from: reveal.bookUci.slice(0, 2), to: reveal.bookUci.slice(2, 4) };
    if (reveal.verdict === "green") arrows = [{ ...book, color: ARROW.green }];
    else {
      const mine = { from: reveal.guessUci.slice(0, 2), to: reveal.guessUci.slice(2, 4) };
      const mineColor = reveal.verdict === "red" ? ARROW.red : reveal.verdict === "blue" ? ARROW.blue : ARROW.guess;
      arrows = [{ ...mine, color: mineColor }, { ...book, color: ARROW.green }];
    }
  }

  // ---- status line + banner
  const moveNo = Math.floor(Math.min(ply, game.moves.length - 1) / 2) + 1;
  const watchMoveNo = Math.floor(Math.max(0, Math.min(watchPly, game.moves.length - 1)) / 2) + 1;

  let banner = null;
  let status = "";

  if (variation) {
    const vm = variation.vply > 0 ? variation.line[variation.vply - 1] : null;
    status = vm ? `Variation: ${vm.san}` : "A line from the book — tap through it";
    banner = vm?.comment ? { color: P.border, bg: P.card, text: flattenComment(vm.comment) } : null;
  } else if (mode === "watch") {
    if (watchPly === 0) {
      status = "Start of the game — tap › or ▶ to watch";
    } else if (watchPly >= game.moves.length) {
      status = `Game finished · ${game.result || "End"}`;
    } else {
      const side = watchPly % 2 === 1 ? "White" : "Black";
      const m = game.moves[watchPly - 1];
      status = `${side}: ${m.san} (${sanOfUci(m.uci)})`;
    }
  } else if (done) {
    status = "The end!";
  } else if (guessing) {
    status = selected ? "Now tap the square to move to" : `Your move — what did ${master} play?`;
  } else if (ply < guessStartPly(game)) {
    status = `Watch how the game starts — you take over at move ${game.guessFrom}`;
  } else {
    status = `${game.guessSide === "White" ? "Black" : "White"} replies…`;
  }

  if (mode === "guess" && reveal) {
    const bookSan = lastMoveEntry?.san;
    if (reveal.verdict === "green") banner = { color: P.correctBorder, bg: P.correctBg, textColor: P.correctText, text: `You found ${master}'s move: ${bookSan}` };
    else if (reveal.verdict === "blue") banner = { color: ARROW.blue, bg: P.card, text: `Even better than ${master}! Yours wins by ${(reveal.cpDelta / 100).toFixed(1)} pawns. The game move was ${bookSan}.` };
    else if (reveal.verdict === "red") banner = { color: P.wrongBorder, bg: P.wrongBg, textColor: P.wrongText, text: `${sanOfUci(reveal.guessUci)} loses ${(reveal.cpLoss / 100).toFixed(1)} pawns. ${master} played ${bookSan}.` };
    else if (reveal.verdict === "amber") banner = { color: P.gold, bg: P.card, text: `Good move — close to best. ${master} chose ${bookSan}.` };
    else banner = { color: P.border, bg: P.card, text: `${master} played ${bookSan}. Your idea: ${sanOfUci(reveal.guessUci)}.` };
  }

  const variations = !variation
    ? (mode === "watch" ? watchMoveEntry?.variations : ((reveal || !guessing) ? lastMoveEntry?.variations : null))
    : null;

  const buttonLabel = variation
    ? variation.vply < variation.line.length
      ? "Next move of the line"
      : "Back to the game"
    : done
      ? "Done"
      : reveal
        ? "Continue"
        : ply === 0
          ? "Start"
          : "Next";

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title} numberOfLines={1}>
              {lastName(game.white)} vs {lastName(game.black)}
            </Text>
            <Text style={styles.sub} numberOfLines={1}>
              {game.event}{game.date ? ` · ${game.date.split(".")[0]}` : ""} · {mode === "watch" ? `move ${watchMoveNo} (${watchPly}/${game.moves.length} plies)` : `move ${moveNo} · found ${correct}/${totalGuesses}`}
            </Text>
          </View>
          <View style={styles.modeTabs}>
            <Pressable
              style={[styles.modeTab, mode === "guess" && styles.modeTabActive]}
              onPress={() => {
                setAutoPlaying(false);
                setMode("guess");
              }}
              accessibilityRole="button"
              accessibilityLabel="Guess mode"
            >
              <Text style={[styles.modeTabText, mode === "guess" && styles.modeTabTextActive]}>Guess</Text>
            </Pressable>
            <Pressable
              style={[styles.modeTab, mode === "watch" && styles.modeTabActive]}
              onPress={() => {
                setWatchPly(ply);
                setMode("watch");
              }}
              accessibilityRole="button"
              accessibilityLabel="Watch mode"
            >
              <Text style={[styles.modeTabText, mode === "watch" && styles.modeTabTextActive]}>Watch</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.middle} showsVerticalScrollIndicator={false}>
        {mode === "guess" && done ? (() => {
          const r = strengthReport(game, guessLog);
          const pawns = (cp) => (cp / 100).toFixed(1);
          return (
            <View style={[styles.banner, { borderColor: P.correctBorder, backgroundColor: P.correctBg, gap: 6 }]}>
              <Text style={[styles.bannerText, { color: P.correctText }]}>
                {game.result === "1-0" ? "1–0" : game.result === "0-1" ? "0–1" : "½–½"} · You found {r.found} of {r.total} of {master}'s moves.
              </Text>
              {r.avgLossCp != null ? (
                <Text style={[styles.bannerText, { color: P.correctText }]}>
                  Your moves lost {pawns(r.avgLossCp)} pawns on average{r.masterAvgLossCp != null ? ` — ${master}'s lost ${pawns(r.masterAvgLossCp)}` : ""}.
                </Text>
              ) : null}
              {r.blues > 0 ? (
                <Text style={[styles.bannerText, { color: P.correctText }]}>
                  {r.blues === 1 ? "One of your ideas was" : `${r.blues} of your ideas were`} even better than {master}'s!
                </Text>
              ) : null}
              {r.worstMiss ? (
                <Text style={[styles.bannerText, { color: P.correctText }]}>
                  Biggest miss: move {r.worstMiss.moveNo} (−{pawns(r.worstMiss.cpLoss)} pawns).
                </Text>
              ) : null}
            </View>
          );
        })() : null}
        {banner ? (
          <View style={[styles.banner, { borderColor: banner.color, backgroundColor: banner.bg }]}>
            <Text style={[styles.bannerText, banner.textColor ? { color: banner.textColor } : null]}>{banner.text}</Text>
          </View>
        ) : null}
        {activeComment && !variation ? (
          <View style={styles.bookCard}>
            <Text style={styles.bookLabel}>FROM THE BOOK</Text>
            <Text style={styles.bookText}>{activeComment}</Text>
            {variations?.map((line, i) => (
              <Pressable
                key={i}
                style={styles.variationChip}
                onPress={() => setVariation({ line, vply: 0, baseFen: fenAt(game, (mode === "watch" ? watchPly : ply) - 1) })}
                accessibilityRole="button"
              >
                <Text style={styles.variationText}>
                  ▶ {line.slice(0, 4).map((m) => m.san).join("  ")}{line.length > 4 ? " …" : ""}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.bottom}>
        <Text style={styles.status}>{status}</Text>
        <ChessBoard
          fen={fen}
          size={boardSize}
          flipped={flipped}
          lastMove={lastMove}
          selected={selected}
          dots={selected ? legalDestinations(legal, selected) : []}
          arrows={arrows}
          theme={boardTheme}
          onSquarePress={mode === "guess" && guessing && !variation ? onSquarePress : undefined}
        />
        {variation ? (
          <Pressable style={styles.button} onPress={onButton} accessibilityRole="button">
            <Text style={styles.buttonText}>{buttonLabel}</Text>
          </Pressable>
        ) : mode === "watch" ? (
          <View style={styles.watchControls}>
            <Pressable
              style={[styles.watchBtn, watchPly <= 0 && styles.btnDisabled]}
              disabled={watchPly <= 0}
              onPress={() => {
                setAutoPlaying(false);
                setWatchPly((p) => Math.max(0, p - 1));
              }}
              accessibilityRole="button"
              accessibilityLabel="Previous move"
            >
              <Text style={[styles.watchBtnText, watchPly <= 0 && styles.btnDisabledText]}>‹</Text>
            </Pressable>
            <Pressable
              style={styles.watchPlayBtn}
              onPress={() => {
                if (watchPly >= game.moves.length) {
                  setWatchPly(0);
                  setAutoPlaying(true);
                } else {
                  setAutoPlaying((a) => !a);
                }
              }}
              accessibilityRole="button"
              accessibilityLabel={autoPlaying ? "Pause auto-play" : "Start auto-play"}
            >
              <Text style={styles.watchPlayBtnText}>{autoPlaying ? "⏸ Pause" : "▶ Play"}</Text>
            </Pressable>
            <Pressable
              style={[styles.watchBtn, watchPly >= game.moves.length && styles.btnDisabled]}
              disabled={watchPly >= game.moves.length}
              onPress={() => {
                setAutoPlaying(false);
                setWatchPly((p) => Math.min(game.moves.length, p + 1));
              }}
              accessibilityRole="button"
              accessibilityLabel="Next move"
            >
              <Text style={[styles.watchBtnText, watchPly >= game.moves.length && styles.btnDisabledText]}>›</Text>
            </Pressable>
          </View>
        ) : guessing ? (
          <View style={styles.buttonGhost}>
            <Text style={styles.buttonGhostText}>Tap a piece, then its square</Text>
          </View>
        ) : (
          <Pressable style={styles.button} onPress={onButton} accessibilityRole="button">
            <Text style={styles.buttonText}>{buttonLabel}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const makeStyles = (P, insets) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: P.bg, paddingTop: insets.top + 10 },
    header: { paddingHorizontal: 16, paddingBottom: 6 },
    headerTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
    title: { fontSize: 18, fontFamily: "nunitoBold", color: P.text },
    sub: { fontSize: 13, fontFamily: "nunitoBold", color: P.textSoft, marginTop: 2 },
    modeTabs: {
      flexDirection: "row",
      backgroundColor: P.card,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: P.border,
      padding: 2,
    },
    modeTab: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 9,
    },
    modeTabActive: {
      backgroundColor: P.primary,
    },
    modeTabText: {
      fontSize: 12,
      fontFamily: "nunitoBold",
      color: P.textSoft,
    },
    modeTabTextActive: {
      color: P.onPrimary,
    },
    middle: { paddingHorizontal: 12, paddingVertical: 6, gap: 8 },
    banner: { borderWidth: 2, borderRadius: 14, padding: 10 },
    bannerText: { fontSize: 15, fontFamily: "nunitoBold", color: P.text },
    bookCard: {
      borderWidth: 2,
      borderColor: P.selectedBorder,
      backgroundColor: P.selectedBg,
      borderRadius: 14,
      padding: 12,
      gap: 8,
    },
    bookLabel: { fontSize: 11, fontFamily: "nunitoBold", letterSpacing: 1.2, color: P.label },
    bookText: { fontSize: 15, fontStyle: "italic", fontFamily: "serif", lineHeight: 21, color: P.selectedText },
    variationChip: {
      alignSelf: "flex-start",
      borderWidth: 1,
      borderColor: P.selectedBorder,
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 4,
      backgroundColor: P.card,
    },
    variationText: { fontSize: 13, fontFamily: "nunitoBold", color: P.selectedText },
    bottom: { alignItems: "center", paddingBottom: Math.max(insets.bottom, 10) + 6, gap: 8 },
    status: { fontSize: 14, fontFamily: "nunitoBold", color: P.textSoft, paddingHorizontal: 16, textAlign: "center" },
    button: {
      minHeight: 56,
      alignSelf: "stretch",
      marginHorizontal: 12,
      borderRadius: 16,
      backgroundColor: P.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonGhost: {
      minHeight: 56,
      alignSelf: "stretch",
      marginHorizontal: 12,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: P.border,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonGhostText: { fontSize: 14, fontFamily: "nunitoBold", color: P.dimText },
    buttonText: { fontSize: 17, fontFamily: "nunitoBold", color: P.onPrimary },
    watchControls: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      alignSelf: "stretch",
      marginHorizontal: 12,
      gap: 10,
    },
    watchBtn: {
      width: 58,
      minHeight: 52,
      borderRadius: 16,
      backgroundColor: P.card,
      borderWidth: 2,
      borderColor: P.border,
      borderBottomWidth: 4,
      alignItems: "center",
      justifyContent: "center",
    },
    watchBtnText: {
      fontSize: 26,
      fontFamily: "nunitoBold",
      color: P.text,
      marginTop: -2,
    },
    watchPlayBtn: {
      flex: 1,
      minHeight: 52,
      borderRadius: 16,
      backgroundColor: P.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    watchPlayBtnText: {
      fontSize: 16,
      fontFamily: "nunitoBold",
      color: P.onPrimary,
    },
    btnDisabled: {
      opacity: 0.35,
    },
    btnDisabledText: {
      color: P.dimText,
    },
  });
