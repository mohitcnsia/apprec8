// screens/fun/chess/ChessTrainerScreen.js
// "Guess the Move" home (owner-only): the game list — bundled free classics + PGNs the owner
// pastes himself — with progress, opening into ChessPlayScreen. Pasted games are replayed by
// chess.js before they are accepted (utils/chessPgn.js) and stored on this phone only
// (AsyncStorage): no Firestore, no cost. Book games arrive later via the extraction pipeline.

import React, { useCallback, useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useTheme } from "../../../context/ThemeContext";
import { quizPalette } from "../../../components/quiz/quizPalette";
import { parsePastedPgn } from "../../../utils/chessPgn";
import { guessPlies } from "../../../utils/chessGame";
import { loadSeededChessGames } from "../../../services/chessApi";

import operaGame from "../../../data/chess/opera-game.json";

const GAMES_KEY = "chessGames:v1";
const PROGRESS_KEY = "chessProgress:v1";
const BUNDLED = [{ gameId: "opera-game", game: operaGame }];

const lastName = (s) => String(s || "").split(",")[0].trim();

export default function ChessTrainerScreen({ navigation }) {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(P, insets), [P, insets]);

  const [myGames, setMyGames] = useState([]);
  const [progress, setProgress] = useState({});
  const [seeded, setSeeded] = useState([]); // from Firestore: analysed games (evals) + future book games
  const [adding, setAdding] = useState(false);
  const [pgnText, setPgnText] = useState("");
  const [error, setError] = useState("");

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.multiGet([GAMES_KEY, PROGRESS_KEY])
        .then(([[, games], [, prog]]) => {
          setMyGames(games ? JSON.parse(games) : []);
          setProgress(prog ? JSON.parse(prog) : {});
        })
        .catch(() => {});
      let on = true;
      loadSeededChessGames().then((rows) => on && setSeeded(rows));
      return () => {
        on = false;
      };
    }, [])
  );

  // A seeded copy of a bundled game wins (it carries the engine evals); other seeded
  // games (the books, later) are listed after the bundled ones.
  const seededById = Object.fromEntries(seeded.map((r) => [r.gameId, r]));
  const classics = [
    ...BUNDLED.map((b) => seededById[b.gameId] || b),
    ...seeded.filter((r) => !BUNDLED.some((b) => b.gameId === r.gameId)),
  ];

  const addGame = () => {
    const parsed = parsePastedPgn(pgnText);
    if (!parsed.ok) {
      setError(parsed.error);
      return;
    }
    const entry = { gameId: `u-${Date.now()}`, game: parsed.game };
    const next = [entry, ...myGames];
    setMyGames(next);
    AsyncStorage.setItem(GAMES_KEY, JSON.stringify(next)).catch(() => {});
    setAdding(false);
    setPgnText("");
    setError("");
    navigation.push("ChessPlay", entry);
  };

  const removeGame = (gameId) => {
    const next = myGames.filter((g) => g.gameId !== gameId);
    setMyGames(next);
    AsyncStorage.setItem(GAMES_KEY, JSON.stringify(next)).catch(() => {});
  };

  const Row = ({ gameId, game, mine }) => {
    const p = progress[gameId];
    const total = guessPlies(game).length;
    const state = p?.done ? `Done · found ${p.correct}/${total}` : p?.ply > 0 ? `Continue · move ${Math.floor(p.ply / 2) + 1}` : `${total} moves to guess`;
    return (
      <Pressable style={styles.row} onPress={() => navigation.push("ChessPlay", { gameId, game })} accessibilityRole="button">
        <View style={{ flex: 1 }}>
          <Text style={styles.rowTitle} numberOfLines={1}>
            {lastName(game.white)} vs {lastName(game.black)}
          </Text>
          <Text style={styles.rowSub} numberOfLines={1}>
            {game.event}{game.date ? ` · ${game.date.split(".")[0]}` : ""} · you play {game.guessSide}
            {game.evals ? " · engine ✓" : ""}
          </Text>
          <Text style={[styles.rowSub, p?.done ? { color: P.correctBorder } : null]} numberOfLines={1}>{state}</Text>
        </View>
        {mine ? (
          <Pressable onPress={() => removeGame(gameId)} hitSlop={10} accessibilityRole="button" accessibilityLabel="Remove this game">
            <Text style={styles.remove}>✕</Text>
          </Pressable>
        ) : null}
      </Pressable>
    );
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.h1}>Guess the Move</Text>
        <Text style={styles.intro}>
          Play through a master game on the winning side. From the take-over move, guess what the
          master played — the book's own notes follow every move.
        </Text>

        <Text style={styles.section}>Classics</Text>
        {classics.map((e) => (
          <Row key={e.gameId} {...e} />
        ))}

        <Text style={styles.section}>My games</Text>
        {myGames.length === 0 ? (
          <Text style={styles.empty}>Paste any PGN — from a book, a website or your own games.</Text>
        ) : (
          myGames.map((e) => <Row key={e.gameId} {...e} mine />)
        )}
      </ScrollView>

      <Pressable style={styles.button} onPress={() => setAdding(true)} accessibilityRole="button">
        <Text style={styles.buttonText}>Add a game (paste PGN)</Text>
      </Pressable>

      <Modal visible={adding} animationType="slide" transparent onRequestClose={() => setAdding(false)}>
        <View style={styles.modalWrap}>
          <View style={styles.modalCard}>
            <Text style={styles.section}>Paste a PGN</Text>
            <TextInput
              style={styles.input}
              multiline
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              placeholder={'[White "..."]\n1. e4 e5 2. Nf3 ...'}
              placeholderTextColor={P.dimText}
              value={pgnText}
              onChangeText={(t) => {
                setPgnText(t);
                setError("");
              }}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Pressable style={styles.modalButton} onPress={addGame} accessibilityRole="button">
              <Text style={styles.buttonText}>Check and add</Text>
            </Pressable>
            <Pressable style={styles.cancel} onPress={() => { setAdding(false); setError(""); }} accessibilityRole="button">
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const makeStyles = (P, insets) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: P.bg, paddingTop: insets.top + 14 },
    content: { paddingHorizontal: 16, paddingBottom: 90, gap: 10 },
    h1: { fontSize: 26, fontFamily: "nunitoBold", color: P.text },
    intro: { fontSize: 14, fontFamily: "nunitoBold", color: P.textSoft, lineHeight: 20 },
    section: { fontSize: 18, fontFamily: "nunitoBold", color: P.text, marginTop: 8 },
    empty: { fontSize: 14, fontFamily: "nunitoBold", color: P.dimText },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      padding: 12,
      borderRadius: 16,
      backgroundColor: P.card,
      borderWidth: 2,
      borderColor: P.border,
      borderBottomWidth: 5,
    },
    rowTitle: { fontSize: 16, fontFamily: "nunitoBold", color: P.text },
    rowSub: { fontSize: 13, fontFamily: "nunitoBold", color: P.textSoft, marginTop: 1 },
    remove: { fontSize: 16, color: P.dimText, padding: 6 },
    button: {
      position: "absolute",
      left: 12,
      right: 12,
      bottom: Math.max(insets.bottom, 10) + 6,
      minHeight: 56,
      borderRadius: 16,
      backgroundColor: P.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: { fontSize: 17, fontFamily: "nunitoBold", color: P.onPrimary },
    modalButton: {
      minHeight: 56,
      borderRadius: 16,
      backgroundColor: P.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    modalWrap: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.5)" },
    modalCard: {
      backgroundColor: P.bg,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 16,
      paddingBottom: Math.max(insets.bottom, 10) + 10,
      gap: 10,
    },
    input: {
      minHeight: 140,
      maxHeight: 240,
      borderWidth: 2,
      borderColor: P.border,
      borderRadius: 12,
      padding: 10,
      color: P.text,
      backgroundColor: P.card,
      textAlignVertical: "top",
      fontSize: 13,
    },
    error: { fontSize: 13, fontFamily: "nunitoBold", color: P.wrongBorder },
    cancel: { alignItems: "center", paddingVertical: 8 },
    cancelText: { fontSize: 14, fontFamily: "nunitoBold", color: P.textSoft },
  });
