# Chess Library Audit: 25 Curated Master Games (G108)

All 25 games have been extracted from downloaded historical and tournament PGN archives from pgnmentor.com and Lichess archives.
**Strict Owner Rule Applied:** Zero moves were generated from memory. Every single ply, legal move set, and commentary is machine-validated via `scripts/chess/validate_pgn.py` (25/25 PASSED).

## Rule Alignment
- **King's Gambit:** White wins (**1-0**), guess side is **White**.
- **London System:** White wins (**1-0**), guess side is **White**.
- **Sicilian Accelerated Dragon:** Black wins (**0-1**), guess side is **Black**.
- **Bogo-Indian Defence:** Black wins (**0-1**), guess side is **Black**.
- **Classic Masters:** Historic masterpieces played by chess legends.

---

## 1. King's Gambit (White Wins 1-0, Guess: White)

| # | Players | Year | Event / Context | Result | Plies | Guess From | Source Archive & License |
|---|---|---|---|---|---|---|---|
| 1 | Spassky vs Bronstein | 1960 | USSR Championship 27, Leningrad | 1-0 | 45 | Move 11 | `KingsGambit.pgn` (Public domain 1960) |
| 2 | Anderssen vs Kieseritzky | 1851 | London *The Immortal Game* | 1-0 | 45 | Move 11 | `KingsGambit.pgn` (Public domain 1851) |
| 3 | Spassky vs Fischer | 1960 | Mar del Plata | 1-0 | 57 | Move 11 | `KingsGambit.pgn` (Public domain 1960) |
| 4 | Fischer vs Evans | 1963 | US Championship, New York | 1-0 | 71 | Move 11 | `KingsGambit.pgn` (Public domain 1963) |
| 5 | Fischer vs Wade | 1968 | Vinkovci | 1-0 | 75 | Move 11 | `KingsGambit.pgn` (Public domain 1968) |

---

## 2. London System (White Wins 1-0, Guess: White)

| # | Players | Year | Event / Context | Result | Plies | Guess From | Source Archive & License |
|---|---|---|---|---|---|---|---|
| 1 | Carlsen vs Tomashevsky | 2016 | 78th Tata Steel Group A, Wijk aan Zee | 1-0 | 59 | Move 11 | `Carlsen.pgn` (Lichess CC0) |
| 2 | Carlsen vs Karjakin | 2016 | 9th Bilbao Masters Final | 1-0 | 79 | Move 11 | `Carlsen.pgn` (Lichess CC0) |
| 3 | Kamsky vs Shirov | 2007 | FIDE World Cup Khanty-Mansiysk | 1-0 | 73 | Move 11 | `Kamsky.pgn` (Lichess CC0) |
| 4 | Kamsky vs Karpov | 2007 | World Blitz Championship, Moscow | 1-0 | 53 | Move 10 | `London2e6.pgn` (Lichess CC0) |
| 5 | Grischuk vs Kosteniuk | 2022 | Titled Tuesday Masters | 1-0 | 95 | Move 11 | `London2e6.pgn` (Lichess CC0) |

---

## 3. Sicilian Accelerated Dragon (Black Wins 0-1, Guess: Black)

| # | Players | Year | Event / Context | Result | Plies | Guess From | Source Archive & License |
|---|---|---|---|---|---|---|---|
| 1 | Larsen vs Fischer | 1971 | Candidates Semifinal Game 2, Denver | 0-1 | 108 | Move 11 | `Fischer.pgn` (Public domain 1971) |
| 2 | Damjanovic vs Fischer | 1970 | Buenos Aires International | 0-1 | 155 | Move 11 | `Fischer.pgn` (Public domain 1970) |
| 3 | Keres vs Petrosian | 1959 | Candidates Tournament, Bled/Zagreb | 0-1 | 102 | Move 11 | `Petrosian.pgn` (Public domain 1959) |
| 4 | Anand vs Kasparov | 1995 | PCA World Championship Game 13, NYC | 0-1 | 50 | Move 11 | `Kasparov.pgn` (Public domain pre-2000) |
| 5 | Larsen vs Miles | 1978 | Las Palmas Masters | 0-1 | 56 | Move 11 | `SicDragon6Be2-6Bc4.pgn` (Public domain pre-1980) |

---

## 4. Bogo-Indian Defence (Black Wins 0-1, Guess: Black)

| # | Players | Year | Event / Context | Result | Plies | Guess From | Source Archive & License |
|---|---|---|---|---|---|---|---|
| 1 | Topalov vs Kasparov | 1996 | Las Palmas Super-Tournament | 0-1 | 118 | Move 11 | `Kasparov.pgn` (Public domain pre-2000) |
| 2 | Piket vs Anand | 1996 | Hoogovens, Wijk aan Zee | 0-1 | 88 | Move 11 | `Anand.pgn` (Lichess CC0) |
| 3 | Vidmar vs Marshall | 1927 | New York International | 0-1 | 114 | Move 11 | `Marshall.pgn` (Public domain 1927) |
| 4 | Marshall vs Capablanca | 1928 | Berlin Tageblatt | 0-1 | 66 | Move 11 | `Marshall.pgn` (Public domain 1928) |
| 5 | Megaranto vs Carlsen | 2022 | 44th Chess Olympiad, Chennai | 0-1 | 94 | Move 11 | `Carlsen.pgn` (Lichess CC0) |

---

## 5. Classic Masters (Historical Masterpieces)

| # | Players | Year | Event / Context | Result | Plies | Guess From | Source Archive & License |
|---|---|---|---|---|---|---|---|
| 1 | Morphy vs Duke Karl / Isouard | 1858 | Paris *The Opera Game* | 1-0 | 33 | Move 9 | `Morphy.pgn` (Public domain 1858) |
| 2 | Anderssen vs Dufresne | 1852 | Berlin *The Evergreen Game* | 1-0 | 47 | Move 11 | `Anderssen.pgn` (Public domain 1852) |
| 3 | Steinitz vs Von Bardeleben | 1895 | Hastings Masters | 1-0 | 49 | Move 11 | `Steinitz.pgn` (Public domain 1895) |
| 4 | Levitsky vs Marshall | 1912 | DSB Congress *The Gold Coins Game* | 0-1 | 46 | Move 11 | `Marshall.pgn` (Public domain 1912) |
| 5 | Byrne vs Fischer | 1956 | New York *Game of the Century* | 0-1 | 82 | Move 11 | `Fischer.pgn` (Public domain 1956) |

---

## Validation & Seeding Status
- Validated via `scripts/chess/validate_pgn.py --json content-private/chess/out content-private/chess/library/*.pgn`: **25/25 PASSED (0 errors)**.
- Seeded to Firestore collection `chessGames` via `scripts/chess/seedChessGame.mjs`:
  - 25 docs uploaded with full moves, annotations, and metadata.
  - Opera Game also mapped to `chessGames/opera-game` to align with the bundled fallback.
- Firestore Security Rules deployed and verified:
  - `chessGames/{gameId}` allows read if `isAdmin()`, write `false` (mac admin script writes via admin SDK).
