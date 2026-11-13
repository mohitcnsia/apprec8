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
import ChessBoard from "../../../components/games/chess/ChessBoard";
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
} from "../../../utils/chessGame";

const PROGRESS_KEY = "chessProgress:v1";
const ARROW = { green: "#2FA84F", red: "#E04836", blue: "#3E73C8", guess: "#85508a" };

const fenAt = (game, ply) => (ply <= 0 ? START_FEN : game.moves[ply - 1]?.fenAfter || START_FEN);
const lastName = (s) => String(s || "").split(",")[0].trim();
const sanOfUci = (u) => `${u.slice(0, 2)}–${u.slice(2, 4)}`;

export default function ChessPlayScreen({ navigation, route }) {
  const { game, gameId } = route.params;
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const boardSize = Math.min(width - 24, 420);
  const styles = useMemo(() => makeStyles(P, insets), [P, insets]);

  const master = lastName(game.guessSide === "White" ? game.white : game.black);
  const flipped = game.guessSide === "Black";
  const totalGuesses = useMemo(() => guessPlies(game).length, [game]);

  // ply = plies already on the board. reveal = result of the last guess. variation = replay mode.
  const [ply, setPly] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [guessed, setGuessed] = useState(0);
  const [selected, setSelected] = useState(null);
  const [reveal, setReveal] = useState(null); // { verdict, guessUci, cpLoss, cpDelta }
  const [variation, setVariation] = useState(null); // { line, vply, baseFen }
  const loaded = useRef(false);

  // Resume where the owner left off.
  useEffect(() => {
    AsyncStorage.getItem(PROGRESS_KEY)
      .then((raw) => {
        const saved = raw ? JSON.parse(raw)[gameId] : null;
        if (saved && !saved.done && saved.ply > 0 && saved.ply < game.moves.length) {
          setPly(saved.ply);
          setCorrect(saved.correct || 0);
          setGuessed(saved.guessed || 0);
        }
        loaded.current = true;
      })
      .catch(() => {
        loaded.current = true;
      });
  }, [gameId]);

  // Save after every change (one tiny local write, no network).
  useEffect(() => {
    if (!loaded.current) return;
    AsyncStorage.getItem(PROGRESS_KEY)
      .then((raw) => {
        const all = raw ? JSON.parse(raw) : {};
        all[gameId] = { ply, correct, guessed, done: ply >= game.moves.length, updatedAt: Date.now() };
        return AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
      })
      .catch(() => {});
  }, [ply, correct, guessed]);

  const done = ply >= game.moves.length;
  const guessing = !done && !reveal && isGuessPly(game, ply);
  const lastMoveEntry = ply > 0 ? game.moves[ply - 1] : null;
  const comment = flattenComment(
    (reveal || !guessing ? lastMoveEntry?.comment : "") || (ply === 0 ? game.gameComment : "")
  );
  const legal = guessing ? game.moves[ply].legal : [];
  const movable = useMemo(() => (guessing ? new Set(movableSquares(legal)) : new Set()), [legal, guessing]);

  const onSquarePress = (square) => {
    if (variation || !guessing) return;
    if (selected) {
      const uci = resolveGuess(legal, selected, square);
      if (uci) {
        const bookUci = game.moves[ply].uci;
        const v = guessVerdict(uci, bookUci, game.evals?.[String(ply)] || null);
        setGuessed((n) => n + 1);
        if (v.verdict === "green") setCorrect((n) => n + 1);
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
  let fen = fenAt(game, ply);
  let lastMove = lastMoveEntry ? [lastMoveEntry.uci.slice(0, 2), lastMoveEntry.uci.slice(2, 4)] : null;
  let arrows = [];
  if (variation) {
    fen = variation.vply === 0 ? variation.baseFen : variation.line[variation.vply - 1].fenAfter;
    const vm = variation.vply > 0 ? variation.line[variation.vply - 1] : null;
    lastMove = vm ? [vm.uci.slice(0, 2), vm.uci.slice(2, 4)] : null;
  } else if (reveal) {
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
  let banner = null;
  let status = "";
  if (variation) {
    const vm = variation.vply > 0 ? variation.line[variation.vply - 1] : null;
    status = vm ? `Variation: ${vm.san}` : "A line from the book — tap through it";
    banner = vm?.comment ? { color: P.border, bg: P.card, text: flattenComment(vm.comment) } : null;
  } else if (done) {
    status = "The end!";
  } else if (guessing) {
    status = selected ? "Now tap the square to move to" : `Your move — what did ${master} play?`;
  } else if (ply < guessStartPly(game)) {
    status = `Watch how the game starts — you take over at move ${game.guessFrom}`;
  } else {
    status = `${game.guessSide === "White" ? "Black" : "White"} replies…`;
  }
  if (reveal) {
    const bookSan = lastMoveEntry?.san;
    if (reveal.verdict === "green") banner = { color: P.correctBorder, bg: P.correctBg, textColor: P.correctText, text: `You found ${master}'s move: ${bookSan}` };
    else if (reveal.verdict === "blue") banner = { color: ARROW.blue, bg: P.card, text: `Even better than ${master}! Yours wins by ${(reveal.cpDelta / 100).toFixed(1)} pawns. The game move was ${bookSan}.` };
    else if (reveal.verdict === "red") banner = { color: P.wrongBorder, bg: P.wrongBg, textColor: P.wrongText, text: `${sanOfUci(reveal.guessUci)} loses ${(reveal.cpLoss / 100).toFixed(1)} pawns. ${master} played ${bookSan}.` };
    else if (reveal.verdict === "amber") banner = { color: P.gold, bg: P.card, text: `Good move — close to best. ${master} chose ${bookSan}.` };
    else banner = { color: P.border, bg: P.card, text: `${master} played ${bookSan}. Your idea: ${sanOfUci(reveal.guessUci)}.` };
  }

  const variations = !variation && (reveal || !guessing) ? lastMoveEntry?.variations : null;
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
        <Text style={styles.title} numberOfLines={1}>
          {lastName(game.white)} vs {lastName(game.black)}
        </Text>
        <Text style={styles.sub} numberOfLines={1}>
          {game.event}{game.date ? ` · ${game.date.split(".")[0]}` : ""} · move {moveNo} · found {correct}/{totalGuesses}
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.middle} showsVerticalScrollIndicator={false}>
        {done ? (
          <View style={[styles.banner, { borderColor: P.correctBorder, backgroundColor: P.correctBg }]}>
            <Text style={[styles.bannerText, { color: P.correctText }]}>
              {game.result === "1-0" ? "1–0" : game.result === "0-1" ? "0–1" : "½–½"} · You found {correct} of {totalGuesses} of {master}'s moves.
            </Text>
          </View>
        ) : null}
        {banner ? (
          <View style={[styles.banner, { borderColor: banner.color, backgroundColor: banner.bg }]}>
            <Text style={[styles.bannerText, banner.textColor ? { color: banner.textColor } : null]}>{banner.text}</Text>
          </View>
        ) : null}
        {comment && !variation ? (
          <View style={styles.bookCard}>
            <Text style={styles.bookLabel}>FROM THE BOOK</Text>
            <Text style={styles.bookText}>{comment}</Text>
            {variations?.map((line, i) => (
              <Pressable
                key={i}
                style={styles.variationChip}
                onPress={() => setVariation({ line, vply: 0, baseFen: fenAt(game, ply - 1) })}
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
          onSquarePress={guessing && !variation ? onSquarePress : undefined}
        />
        {guessing && !variation ? (
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
    title: { fontSize: 18, fontFamily: "nunitoBold", color: P.text },
    sub: { fontSize: 13, fontFamily: "nunitoBold", color: P.textSoft, marginTop: 2 },
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
  });
