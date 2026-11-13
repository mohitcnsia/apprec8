// screens/fun/FunScreen.js
// Fun tab (owner-approved mockup "C · Fun", 2026-11-04): thought of the day, games, and the old
// Home carousels (Featured stories, Book summaries) + Popular Reads from the old Study tab.

import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path, Rect, Circle } from "react-native-svg";

import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../../components/quiz/quizPalette";
import CustomCarousel from "../../components/common/CustomCarousal";
import KidsThoughtOfTheDay from "../../components/thought/KidsThoughtOfTheDay";
import { THOUGHTS } from "../../data/thoughts";
import { listenToCategoriesByGroup } from "../../services/firestoreContentApi";
import { visibleOldTiles } from "../../utils/oldContent";
import { authInstance } from "../../config/firebaseConfig";
import { ownerExtrasOn, useOwnerExtras } from "../../services/ownerView";
import { APPREC8_TEAM_REVIEWER_UID } from "../../config/appConfig";

const isOwner = () => !!APPREC8_TEAM_REVIEWER_UID && authInstance.currentUser?.uid === APPREC8_TEAM_REVIEWER_UID && ownerExtrasOn();

const tileOf = (c) => ({
  id: c.id,
  title: c.title,
  image: c.image,
  subtitle: c.subtitle || "",
  duration: c.duration || "",
  author: c.author || "",
  type: c.type || "COURSE",
  questId: c.questId || null,
});

/** Same thought for the whole day, changes daily. */
const thoughtOfTheDay = () => {
  if (!THOUGHTS || THOUGHTS.length === 0) return "No thoughts today. Only Action !!";
  const day = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  return THOUGHTS[day % THOUGHTS.length];
};

const GridArt = () => (
  <Svg width={44} height={44} viewBox="0 0 44 44">
    <Rect x={3} y={3} width={38} height={38} rx={8} fill="#F7E8F8" stroke="#85508a" strokeWidth={3} />
    <Path d="M16 3v38M28 3v38M3 16h38M3 28h38" stroke="#85508a" strokeWidth={2} />
    <Rect x={17} y={17} width={10} height={10} fill="#F5C842" />
  </Svg>
);
const MineArt = () => (
  <Svg width={44} height={44} viewBox="0 0 44 44">
    <Circle cx={22} cy={24} r={12} fill="#3b0940" />
    <Path d="M22 6v6M22 36v4M6 24h4M34 24h4M10 12l4 4M34 12l-4 4" stroke="#3b0940" strokeWidth={3} strokeLinecap="round" />
    <Circle cx={18} cy={20} r={3} fill="#FFFFFF" />
  </Svg>
);
const ClockArt = () => (
  <Svg width={44} height={44} viewBox="0 0 44 44">
    <Circle cx={22} cy={22} r={18} fill="#FFFFFF" stroke="#3E73C8" strokeWidth={4} />
    <Path d="M22 12v10l7 5" stroke="#3b0940" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
const WordArt = () => (
  <Svg width={44} height={44} viewBox="0 0 44 44">
    <Rect x={2} y={12} width={18} height={20} rx={5} fill="#F5C842" />
    <Rect x={24} y={12} width={18} height={20} rx={5} fill="#3E9B3A" />
    <Path d="M7 27l4-10 4 10M8.5 24h5M30 17h5a3 3 0 010 6h-5v-6zM30 23h6a3 3 0 010 6h-6z" stroke="#3b0940" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
const BeeArt = () => (
  <Svg width={44} height={44} viewBox="0 0 44 44">
    <Path d="M14 12c-6-8-14 0-6 6M30 12c6-8 14 0 6 6" fill="#E8DCE9" stroke="#85508a" strokeWidth={2} />
    <Rect x={8} y={14} width={28} height={22} rx={11} fill="#F5C842" />
    <Path d="M17 14v22M27 14v22" stroke="#3b0940" strokeWidth={4} />
  </Svg>
);

const KnightArt = () => (
  <Svg width={44} height={44} viewBox="0 0 44 44">
    <Rect x={6} y={34} width={32} height={6} rx={3} fill="#B58863" />
    <Path
      d="M14 34c0-8 3-11 8-14l-4-2c-1-3 1-7 5-9 1-2 3-2 3 0 5 1 9 6 9 13 0 5-2 8-5 12z"
      fill="#F0D9B5"
      stroke="#3b0940"
      strokeWidth={2.5}
      strokeLinejoin="round"
    />
    <Circle cx={25} cy={14} r={1.6} fill="#3b0940" />
  </Svg>
);
const LeafArt = () => (
  <Svg width={44} height={44} viewBox="0 0 44 44">
    <Path d="M8 36C8 18 20 8 38 6c-2 18-12 30-30 30z" fill="#E6F6E4" stroke="#3E9B3A" strokeWidth={3} strokeLinejoin="round" />
    <Path d="M10 34C18 26 24 20 32 12" stroke="#3E9B3A" strokeWidth={2.5} strokeLinecap="round" />
  </Svg>
);

const GAMES = [
  // Seema's 9 calming strategies (well-being, 2026-11-12): always here, not only after a mood tap.
  { key: "calm", title: "Calm corner", sub: "Ways to feel better", screen: "CalmCorner", Art: LeafArt },
  { key: "sudoku", title: "Sudoku", sub: "Number puzzle", screen: "SudokuGame", Art: GridArt },
  { key: "mines", title: "Minesweeper", sub: "Find the mines", screen: "Minesweeper", Art: MineArt },
  { key: "clock", title: "Tell the time", sub: "Clock practice", screen: "ClockPracticeGenerator", Art: ClockArt },
  { key: "vocab", title: "Word builder", sub: "New words", screen: "VocabBuilder", Art: WordArt },
  { key: "spell", title: "Spelling bee", sub: "Hear and spell", screen: "SpellingBeeGame", Art: BeeArt },
];

// The owner's own game (13 Nov 2026): guess the moves of annotated master games. Owner extras only.
const CHESS_TILE = { key: "chess", title: "Guess the Move", sub: "Classic chess games", screen: "ChessTrainer", Art: KnightArt };

export default function FunScreen({ navigation }) {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(P, insets), [P, insets]);
  const ownerExtras = useOwnerExtras();
  const games = ownerExtras && isOwner() ? [...GAMES, CHESS_TILE] : GAMES;

  const [stories, setStories] = useState([]);
  const [books, setBooks] = useState([]);
  const [reads, setReads] = useState([]);

  useEffect(() => {
    const warn = (what) => (e) => console.warn(`FunScreen: ${what} failed to load`, e);
    // Old reading carousels: owner only (Seema 2026-11-05), so nobody else pays for the reads.
    if (!isOwner()) return undefined;
    const subs = [
      listenToCategoriesByGroup("story", (d) => setStories(visibleOldTiles(d.map(tileOf), { isAdmin: true })), warn("stories")),
      listenToCategoriesByGroup("book_summary", (d) => setBooks(visibleOldTiles(d.map(tileOf), { isAdmin: true })), warn("book summaries")),
      listenToCategoriesByGroup("popular_read", (d) => setReads(visibleOldTiles(d.map(tileOf), { isAdmin: true })), warn("popular reads")),
    ];
    return () => subs.forEach((u) => u && u());
  }, []);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <KidsThoughtOfTheDay thought={thoughtOfTheDay()} />

      <Text style={styles.section}>Games</Text>
      <View style={styles.grid}>
        {games.map(({ key, title, sub, screen, Art }) => (
          <Pressable key={key} style={styles.gridCell} onPress={() => navigation.push(screen, {})} accessibilityRole="button">
            <View style={styles.gameTile}>
              <Art />
              <View style={{ flex: 1 }}>
                <Text style={styles.gameTitle} numberOfLines={1}>{title}</Text>
                <Text style={styles.gameSub} numberOfLines={1}>{sub}</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>

      {stories.length > 0 ? (
        <CustomCarousel title="Featured" data={stories} navigation={navigation} customWidth={50} customHeight={180} />
      ) : null}
      {books.length > 0 ? (
        <CustomCarousel title="Book Summaries" data={books} navigation={navigation} customWidth={50} customHeight={180} />
      ) : null}
      {reads.length > 0 ? (
        <CustomCarousel title="Popular Reads" data={reads} navigation={navigation} customWidth={40} customHeight={120} />
      ) : null}
    </ScrollView>
  );
}

const makeStyles = (P, insets) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: P.bg },
    content: { paddingTop: insets.top + 14, paddingBottom: 28, gap: 12 },
    h1: { fontSize: 28, fontFamily: "nunitoBold", color: P.text, paddingHorizontal: 18 },
    section: { fontSize: 20, fontFamily: "nunitoBold", color: P.text, paddingHorizontal: 18, marginTop: 4 },
    grid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 12 },
    gridCell: { width: "50%", padding: 6 },
    gameTile: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      padding: 12,
      minHeight: 72,
      borderRadius: 18,
      backgroundColor: P.card,
      borderWidth: 2,
      borderColor: P.border,
      borderBottomWidth: 5,
    },
    gameTitle: { fontSize: 16, fontFamily: "nunitoBold", color: P.text },
    gameSub: { fontSize: 13, fontFamily: "nunitoBold", color: P.textSoft },
  });
