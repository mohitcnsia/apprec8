// screens/fun/chess/ChessTrainerScreen.js
// "Guess the Move" home (owner-only): the game list — bundled free classics + PGNs the owner
// pastes himself — with progress, opening into ChessPlayScreen. Pasted games are replayed by
// chess.js before they are accepted (utils/chessPgn.js) and stored on this phone only
// (AsyncStorage): no Firestore, no cost. Book games arrive later via the extraction pipeline.

import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useTheme } from "../../../context/ThemeContext";
import { quizPalette } from "../../../components/quiz/quizPalette";
import { BOARD_THEMES } from "../../../components/games/chess/ChessBoard";
import { parsePastedPgn, fetchPgnFromUrl } from "../../../utils/chessPgn";
import { guessPlies, computePlayerStats } from "../../../utils/chessGame";
import { loadSeededChessGames } from "../../../services/chessApi";

import operaGame from "../../../data/chess/opera-game.json";

const GAMES_KEY = "chessGames:v1";
const PROGRESS_KEY = "chessProgress:v1";
const THEME_KEY = "chessBoardTheme:v1";
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
  const [boardTheme, setBoardTheme] = useState("wood");
  const [folded, setFolded] = useState({}); // { [collectionName]: boolean }

  // Add-a-game modal state
  const [adding, setAdding] = useState(false);
  const [modalTab, setModalTab] = useState("link"); // "link" | "paste"
  const [linkUrl, setLinkUrl] = useState("");
  const [pgnText, setPgnText] = useState("");
  const [fetching, setFetching] = useState(false);
  const [multiGames, setMultiGames] = useState(null);
  const [error, setError] = useState("");

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.multiGet([GAMES_KEY, PROGRESS_KEY, THEME_KEY])
        .then(([[, games], [, prog], [, theme]]) => {
          setMyGames(games ? JSON.parse(games) : []);
          setProgress(prog ? JSON.parse(prog) : {});
          if (theme) setBoardTheme(theme);
        })
        .catch(() => {});
      let on = true;
      loadSeededChessGames().then((rows) => on && setSeeded(rows));
      return () => {
        on = false;
      };
    }, [])
  );

  const selectTheme = (themeId) => {
    setBoardTheme(themeId);
    AsyncStorage.setItem(THEME_KEY, themeId).catch(() => {});
  };

  const toggleFold = (col) => {
    setFolded((prev) => ({ ...prev, [col]: prev[col] === undefined ? false : !prev[col] }));
  };

  // A seeded copy of a bundled game wins (it carries the engine evals); other seeded
  // games (the books, later) are listed after the bundled ones.
  const seededById = Object.fromEntries(seeded.map((r) => [r.gameId, r]));
  const classics = [
    ...BUNDLED.map((b) => seededById[b.gameId] || b),
    ...seeded.filter((r) => !BUNDLED.some((b) => b.gameId === r.gameId)),
  ];

  // Group classics by collection (default "Classic Masters")
  const collections = useMemo(() => {
    const map = new Map();
    for (const e of classics) {
      const col = e.game.collection || "Classic Masters";
      if (!map.has(col)) map.set(col, []);
      map.get(col).push(e);
    }
    return Array.from(map.entries());
  }, [classics]);

  // Overall player strength across all played games
  const stats = useMemo(() => computePlayerStats(progress), [progress]);

  const addParsedGame = (game) => {
    const entry = { gameId: `u-${Date.now()}`, game };
    const next = [entry, ...myGames];
    setMyGames(next);
    AsyncStorage.setItem(GAMES_KEY, JSON.stringify(next)).catch(() => {});
    closeModal();
    navigation.push("ChessPlay", { ...entry, theme: boardTheme });
  };

  const handleAddPaste = () => {
    const parsed = parsePastedPgn(pgnText);
    if (!parsed.ok) {
      setError(parsed.error);
      return;
    }
    addParsedGame(parsed.game);
  };

  const handleFetchLink = async () => {
    if (!linkUrl.trim()) {
      setError("Please enter a link.");
      return;
    }
    setFetching(true);
    setError("");
    setMultiGames(null);
    try {
      const res = await fetchPgnFromUrl(linkUrl.trim());
      setFetching(false);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      if (res.multiple) {
        setMultiGames(res.games);
        return;
      }
      if (res.game) {
        addParsedGame(res.game);
      }
    } catch (e) {
      setFetching(false);
      setError("Could not fetch from that link. Check your network.");
    }
  };

  const handleSelectMultiGame = (item) => {
    const parsed = parsePastedPgn(item.pgnText);
    if (!parsed.ok) {
      setError(parsed.error);
      return;
    }
    addParsedGame(parsed.game);
  };

  const closeModal = () => {
    setAdding(false);
    setPgnText("");
    setLinkUrl("");
    setMultiGames(null);
    setError("");
    setFetching(false);
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
      <Pressable
        style={styles.row}
        onPress={() => navigation.push("ChessPlay", { gameId, game, theme: boardTheme })}
        accessibilityRole="button"
      >
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

        {/* Overall Player Strength Card */}
        {stats.overallElo != null ? (
          <View style={styles.statsCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.statsLabel}>YOUR STRENGTH</Text>
              <Text style={styles.statsValue}>{stats.overallElo} Elo</Text>
            </View>
            <View style={{ alignItems: "flex-end", justifyContent: "center" }}>
              <Text style={styles.statsSub}>
                {stats.gamesCompleted} {stats.gamesCompleted === 1 ? "game" : "games"} completed
              </Text>
              <Text style={styles.statsSub}>{stats.totalGuesses} moves rated</Text>
            </View>
          </View>
        ) : null}

        {/* Board theme selector */}
        <View style={styles.themeSection}>
          <Text style={styles.themeLabel}>Board theme</Text>
          <View style={styles.themeRow}>
            {Object.values(BOARD_THEMES).map((t) => {
              const active = boardTheme === t.id;
              return (
                <Pressable
                  key={t.id}
                  style={[styles.themePill, active && styles.themePillActive]}
                  onPress={() => selectTheme(t.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`${t.name} board theme`}
                >
                  <View style={styles.swatch}>
                    <View style={[styles.swatchSq, { backgroundColor: t.light }]} />
                    <View style={[styles.swatchSq, { backgroundColor: t.dark }]} />
                    <View style={[styles.swatchSq, { backgroundColor: t.dark }]} />
                    <View style={[styles.swatchSq, { backgroundColor: t.light }]} />
                  </View>
                  <Text style={[styles.themePillText, active && styles.themePillTextActive]}>{t.name}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Folded Collections */}
        <Text style={styles.section}>Library by opening</Text>
        {collections.map(([colName, games]) => {
          const isFolded = folded[colName] !== false; // folded by default, tap to unfold
          return (
            <View key={colName} style={styles.collectionBlock}>
              <Pressable
                style={styles.collectionHeader}
                onPress={() => toggleFold(colName)}
                accessibilityRole="button"
                accessibilityLabel={`${colName}, ${games.length} games, ${isFolded ? "folded" : "expanded"}`}
              >
                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text style={styles.collectionChevron}>{isFolded ? "▶" : "▼"}</Text>
                  <Text style={styles.collectionTitle}>{colName}</Text>
                </View>
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>{games.length}</Text>
                </View>
              </Pressable>
              {!isFolded ? (
                <View style={styles.collectionBody}>
                  {games.map((e) => (
                    <Row key={e.gameId} {...e} />
                  ))}
                </View>
              ) : null}
            </View>
          );
        })}

        <Text style={styles.section}>My games</Text>
        {myGames.length === 0 ? (
          <Text style={styles.empty}>Add a game from a link or paste a PGN to practice.</Text>
        ) : (
          myGames.map((e) => <Row key={e.gameId} {...e} mine />)
        )}
      </ScrollView>

      <Pressable style={styles.button} onPress={() => setAdding(true)} accessibilityRole="button">
        <Text style={styles.buttonText}>Add a game (link or PGN)</Text>
      </Pressable>

      <Modal visible={adding} animationType="slide" transparent onRequestClose={closeModal}>
        <View style={styles.modalWrap}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add a game</Text>

            {/* Segmented Tab: Link vs Paste */}
            <View style={styles.tabBar}>
              <Pressable
                style={[styles.tabBtn, modalTab === "link" && styles.tabBtnActive]}
                onPress={() => {
                  setModalTab("link");
                  setError("");
                }}
                accessibilityRole="button"
                accessibilityLabel="Add from a link"
              >
                <Text style={[styles.tabBtnText, modalTab === "link" && styles.tabBtnTextActive]}>From a link</Text>
              </Pressable>
              <Pressable
                style={[styles.tabBtn, modalTab === "paste" && styles.tabBtnActive]}
                onPress={() => {
                  setModalTab("paste");
                  setError("");
                }}
                accessibilityRole="button"
                accessibilityLabel="Paste a PGN"
              >
                <Text style={[styles.tabBtnText, modalTab === "paste" && styles.tabBtnTextActive]}>Paste PGN</Text>
              </Pressable>
            </View>

            {modalTab === "link" ? (
              <View style={{ gap: 10 }}>
                <TextInput
                  style={styles.inputSingle}
                  autoCapitalize="none"
                  autoCorrect={false}
                  spellCheck={false}
                  keyboardType="url"
                  placeholder="https://lichess.org/x8f2Yy7B or .pgn link"
                  placeholderTextColor={P.dimText}
                  value={linkUrl}
                  onChangeText={(t) => {
                    setLinkUrl(t);
                    setError("");
                    setMultiGames(null);
                  }}
                />
                <Text style={styles.helperText}>
                  Supports Lichess games, Lichess studies, and direct .pgn links. For chess.com: copy the PGN there (Share → PGN) and paste it on the Paste PGN tab.
                </Text>

                {error ? <Text style={styles.error}>{error}</Text> : null}

                {multiGames ? (
                  <View style={styles.multiWrap}>
                    <Text style={styles.multiHeader}>Pick a game from this file ({multiGames.length} games):</Text>
                    <ScrollView style={{ maxHeight: 180 }} nestedScrollEnabled showsVerticalScrollIndicator>
                      {multiGames.map((item) => (
                        <Pressable
                          key={item.id}
                          style={styles.multiRow}
                          onPress={() => handleSelectMultiGame(item)}
                          accessibilityRole="button"
                        >
                          <Text style={styles.multiTitle} numberOfLines={1}>{item.title}</Text>
                          {item.event ? <Text style={styles.multiSub} numberOfLines={1}>{item.event}</Text> : null}
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>
                ) : (
                  <Pressable
                    style={[styles.modalButton, fetching && styles.btnDisabled]}
                    onPress={handleFetchLink}
                    disabled={fetching}
                    accessibilityRole="button"
                  >
                    {fetching ? (
                      <ActivityIndicator color={P.onPrimary} />
                    ) : (
                      <Text style={styles.buttonText}>Fetch and add</Text>
                    )}
                  </Pressable>
                )}
              </View>
            ) : (
              <View style={{ gap: 10 }}>
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
                <Pressable style={styles.modalButton} onPress={handleAddPaste} accessibilityRole="button">
                  <Text style={styles.buttonText}>Check and add</Text>
                </Pressable>
              </View>
            )}

            <Pressable style={styles.cancel} onPress={closeModal} accessibilityRole="button">
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
    statsCard: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: P.card,
      borderWidth: 1.5,
      borderColor: P.border,
      borderRadius: 14,
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginTop: 2,
    },
    statsLabel: {
      fontSize: 11,
      fontFamily: "nunitoBold",
      color: P.textSoft,
      letterSpacing: 0.8,
    },
    statsValue: {
      fontSize: 22,
      fontFamily: "nunitoBold",
      color: P.correctText || P.text,
      marginTop: 2,
    },
    statsSub: {
      fontSize: 12,
      fontFamily: "nunitoBold",
      color: P.textSoft,
    },
    themeSection: {
      backgroundColor: P.card,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: P.border,
      padding: 12,
      gap: 8,
      marginTop: 2,
    },
    themeLabel: { fontSize: 13, fontFamily: "nunitoBold", color: P.textSoft, textTransform: "uppercase", letterSpacing: 0.8 },
    themeRow: { flexDirection: "row", gap: 8 },
    themePill: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 10,
      paddingHorizontal: 8,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: P.border,
      backgroundColor: P.bg,
    },
    themePillActive: {
      borderColor: P.primary,
      backgroundColor: P.selectedBg,
    },
    swatch: {
      width: 22,
      height: 22,
      borderRadius: 4,
      flexDirection: "row",
      flexWrap: "wrap",
      overflow: "hidden",
      borderWidth: 1,
      borderColor: P.border,
    },
    swatchSq: {
      width: 10,
      height: 10,
    },
    themePillText: { fontSize: 13, fontFamily: "nunitoBold", color: P.text },
    themePillTextActive: { color: P.primary },
    section: { fontSize: 18, fontFamily: "nunitoBold", color: P.text, marginTop: 10 },
    collectionBlock: {
      borderRadius: 16,
      borderWidth: 2,
      borderColor: P.border,
      backgroundColor: P.card,
      overflow: "hidden",
    },
    collectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      backgroundColor: P.card,
    },
    collectionChevron: { fontSize: 12, color: P.textSoft, width: 16 },
    collectionTitle: { fontSize: 16, fontFamily: "nunitoBold", color: P.text },
    countBadge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 10,
      backgroundColor: P.selectedBg,
      borderWidth: 1,
      borderColor: P.selectedBorder,
    },
    countBadgeText: { fontSize: 12, fontFamily: "nunitoBold", color: P.selectedText },
    collectionBody: {
      padding: 10,
      gap: 8,
      borderTopWidth: 1,
      borderTopColor: P.border,
      backgroundColor: P.bg,
    },
    empty: { fontSize: 14, fontFamily: "nunitoBold", color: P.dimText },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      padding: 12,
      borderRadius: 14,
      backgroundColor: P.card,
      borderWidth: 2,
      borderColor: P.border,
      borderBottomWidth: 4,
    },
    rowTitle: { fontSize: 15, fontFamily: "nunitoBold", color: P.text },
    rowSub: { fontSize: 12, fontFamily: "nunitoBold", color: P.textSoft, marginTop: 1 },
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
      minHeight: 52,
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
    modalTitle: { fontSize: 18, fontFamily: "nunitoBold", color: P.text },
    tabBar: {
      flexDirection: "row",
      backgroundColor: P.card,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: P.border,
      padding: 3,
      gap: 4,
    },
    tabBtn: {
      flex: 1,
      paddingVertical: 8,
      borderRadius: 9,
      alignItems: "center",
      justifyContent: "center",
    },
    tabBtnActive: {
      backgroundColor: P.primary,
    },
    tabBtnText: {
      fontSize: 13,
      fontFamily: "nunitoBold",
      color: P.textSoft,
    },
    tabBtnTextActive: {
      color: P.onPrimary,
    },
    inputSingle: {
      minHeight: 48,
      borderWidth: 2,
      borderColor: P.border,
      borderRadius: 12,
      paddingHorizontal: 12,
      color: P.text,
      backgroundColor: P.card,
      fontSize: 14,
    },
    helperText: {
      fontSize: 12,
      fontFamily: "nunitoBold",
      color: P.textSoft,
      lineHeight: 17,
    },
    input: {
      minHeight: 140,
      maxHeight: 220,
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
    btnDisabled: { opacity: 0.5 },
    multiWrap: {
      borderWidth: 1.5,
      borderColor: P.border,
      borderRadius: 12,
      padding: 10,
      backgroundColor: P.card,
      gap: 6,
    },
    multiHeader: {
      fontSize: 13,
      fontFamily: "nunitoBold",
      color: P.text,
    },
    multiRow: {
      paddingVertical: 8,
      paddingHorizontal: 6,
      borderBottomWidth: 1,
      borderBottomColor: P.border,
    },
    multiTitle: {
      fontSize: 13,
      fontFamily: "nunitoBold",
      color: P.text,
    },
    multiSub: {
      fontSize: 11,
      fontFamily: "nunitoBold",
      color: P.textSoft,
      marginTop: 1,
    },
  });
