// components/games/chess/ChessBoard.js
// Pure-JS chessboard for the owner's "Guess the Move" trainer (mockups approved 13 Nov 2026):
// wood squares (#F0D9B5 / #B58863), yellow last-move highlight, dots on legal destinations,
// and one SVG arrow for the verdict (green / red / blue). Renders a FEN — no chess rules here
// (utils/chessGame.js). No new native code: Views + react-native-svg only, so it ships OTA.

import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Line, Polygon } from "react-native-svg";

import { parseFen } from "../../../utils/chessGame";

const LIGHT_SQ = "#F0D9B5";
const DARK_SQ = "#B58863";
const LAST_MOVE = "rgba(246, 214, 85, 0.55)";
const SELECTED = "rgba(133, 80, 138, 0.55)";
const DOT = "rgba(40, 28, 44, 0.35)";
const FILES = "abcdefgh";

// One filled glyph set for both sides; colour + outline tell them apart (crisper than the
// hollow white glyphs on Android).
const GLYPH = { K: "♚", Q: "♛", R: "♜", B: "♝", N: "♞", P: "♟" };

const squareXY = (square, flipped, sq) => {
  const file = FILES.indexOf(square[0]);
  const rank = Number(square[1]) - 1;
  const col = flipped ? 7 - file : file;
  const row = flipped ? rank : 7 - rank;
  return { x: col * sq, y: row * sq, cx: (col + 0.5) * sq, cy: (row + 0.5) * sq };
};

function Arrow({ from, to, color, flipped, sq, size }) {
  const a = squareXY(from, flipped, sq);
  const b = squareXY(to, flipped, sq);
  const dx = b.cx - a.cx;
  const dy = b.cy - a.cy;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const head = sq * 0.42;
  // stop the shaft where the arrowhead begins
  const ex = b.cx - ux * head;
  const ey = b.cy - uy * head;
  const px = -uy;
  const py = ux;
  const w = sq * 0.26;
  const points = [
    `${b.cx},${b.cy}`,
    `${ex + px * w},${ey + py * w}`,
    `${ex - px * w},${ey - py * w}`,
  ].join(" ");
  return (
    <Svg width={size} height={size} style={StyleSheet.absoluteFill} pointerEvents="none">
      <Line x1={a.cx} y1={a.cy} x2={ex} y2={ey} stroke={color} strokeWidth={sq * 0.22} strokeLinecap="round" opacity={0.9} />
      <Polygon points={points} fill={color} opacity={0.9} />
    </Svg>
  );
}

/**
 * Props: fen, size, flipped, lastMove ([from, to] squares), selected (square),
 * dots (array of destination squares), arrows ([{ from, to, color }]),
 * onSquarePress (square) — omit to make the board read-only.
 */
export default function ChessBoard({ fen, size, flipped = false, lastMove, selected, dots = [], arrows = [], onSquarePress }) {
  const sq = size / 8;
  const { squares } = useMemo(() => parseFen(fen), [fen]);
  const dotSet = useMemo(() => new Set(dots), [dots]);
  const last = new Set(lastMove || []);

  const rows = [];
  for (let row = 0; row < 8; row += 1) {
    const cells = [];
    for (let col = 0; col < 8; col += 1) {
      const file = flipped ? 7 - col : col;
      const rank = flipped ? row : 7 - row;
      const square = FILES[file] + String(rank + 1);
      const piece = squares[square];
      const isDark = (file + rank) % 2 === 0;
      cells.push(
        <Pressable
          key={square}
          onPress={onSquarePress ? () => onSquarePress(square) : undefined}
          style={{ width: sq, height: sq, backgroundColor: isDark ? DARK_SQ : LIGHT_SQ }}
          accessibilityLabel={piece ? `${square} ${piece}` : square}
        >
          {last.has(square) ? <View style={[StyleSheet.absoluteFill, { backgroundColor: LAST_MOVE }]} /> : null}
          {selected === square ? <View style={[StyleSheet.absoluteFill, { backgroundColor: SELECTED }]} /> : null}
          {piece ? (
            <Text
              allowFontScaling={false}
              style={{
                fontSize: sq * 0.74,
                lineHeight: sq,
                textAlign: "center",
                color: piece[0] === "w" ? "#FFFFFF" : "#1A1218",
                textShadowColor: piece[0] === "w" ? "#3B2B40" : "#F4EDF5",
                textShadowRadius: 2,
                textShadowOffset: { width: 0, height: piece[0] === "w" ? 1 : 0 },
              }}
            >
              {GLYPH[piece[1]]}
            </Text>
          ) : null}
          {dotSet.has(square) ? (
            <View
              style={{
                position: "absolute",
                alignSelf: "center",
                top: piece ? 2 : sq / 2 - sq * 0.14,
                width: piece ? sq - 4 : sq * 0.28,
                height: piece ? sq - 4 : sq * 0.28,
                borderRadius: sq,
                borderWidth: piece ? 3 : 0,
                borderColor: DOT,
                backgroundColor: piece ? "transparent" : DOT,
              }}
            />
          ) : null}
        </Pressable>
      );
    }
    rows.push(
      <View key={row} style={{ flexDirection: "row" }}>
        {cells}
      </View>
    );
  }

  return (
    <View style={{ width: size, height: size, borderRadius: 10, overflow: "hidden" }}>
      {rows}
      {arrows.map((a, i) => (
        <Arrow key={`${a.from}${a.to}${i}`} from={a.from} to={a.to} color={a.color} flipped={flipped} sq={sq} size={size} />
      ))}
    </View>
  );
}
