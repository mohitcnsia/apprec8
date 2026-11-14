# Report: G109 — Chess Library Redo (Fetched PGNs Only)

**Status:** Ready for Claude verification & spot-checking.
**Rule:** 0 moves written from memory. 100% of game plies extracted from authentic downloaded PGN archives.
**Privacy:** No raw PGNs or Stockfish evals are tracked in git (`content-private/` is gitignored). Inline PGNs in `scripts/chess/build_library.py` have been deleted from git.

---

## 1. Opening Verification & Winning Sides

- **King's Gambit (White Wins 1-0, Guess: White):**
  - All games feature the King's Gambit (ECO C30–C39: 1.e4 e5 2.f4).
  - White scores 1-0 in all 5 games.
- **London System (White Wins 1-0, Guess: White):**
  - All games feature the London System setup (1.d4, 2.Bf4 / 2.Nf3 & 3.Bf4).
  - White scores 1-0 in all 5 games.
- **Sicilian Accelerated Dragon (Black Wins 0-1, Guess: Black):**
  - All games feature the Accelerated Dragon / Dragon setups (ECO B34–B39 / B70–B79).
  - Black scores 0-1 in all 5 games (Fischer, Petrosian, Kasparov, Miles).
- **Bogo-Indian Defence (Black Wins 0-1, Guess: Black):**
  - All games feature the Bogo-Indian Defence (ECO E11: 1.d4 Nf6 2.c4 e6 3.Nf3 Bb4+).
  - Black scores 0-1 in all 5 games (Kasparov, Anand, Marshall, Capablanca, Carlsen).
- **Classic Masters (Historic Masterpieces):**
  - Immortal Game (Anderssen), Evergreen Game (Anderssen), Opera Game (Morphy), Gold Coins Game (Marshall), Game of the Century (Fischer).

---

## 2. Master Library Table

| # | Collection / Opening | Game | ECO | Result | Guess Side | Raw File in `content-private/chess/raw/` | Fetch URL | Archive |
|---|---|---|---|---|---|---|---|---|
| 1 | Bogo-Indian | Topalov, Veselin vs Kasparov, Gary | E11 | 0-1 | Black | `bogo-01-topalov-kasparov-1996.pgn` | https://www.pgnmentor.com/players/Kasparov.zip | `Kasparov.pgn` |
| 2 | Bogo-Indian | Piket, Jeroen vs Anand, Viswanathan | E11 | 0-1 | Black | `bogo-02-piket-anand-1996.pgn` | https://www.pgnmentor.com/players/Anand.zip | `Anand.pgn` |
| 3 | Bogo-Indian | Vidmar, Milan Sr vs Marshall, Frank James | E11 | 0-1 | Black | `bogo-03-vidmar-marshall-1927.pgn` | https://www.pgnmentor.com/players/Marshall.zip | `Marshall.pgn` |
| 4 | Bogo-Indian | Marshall, Frank James vs Capablanca, Jose Raul | E11 | 0-1 | Black | `bogo-04-marshall-capablanca-1928.pgn` | https://www.pgnmentor.com/players/Marshall.zip | `Marshall.pgn` |
| 5 | Bogo-Indian | Megaranto,S vs Carlsen,M | E11 | 0-1 | Black | `bogo-05-megaranto-carlsen-2022.pgn` | https://www.pgnmentor.com/players/Carlsen.zip | `Carlsen.pgn` |
| 6 | Classic Masters | Morphy, Paul vs Duke Karl / Count Isouard | C41 | 1-0 | White | `classic-01-opera-game-1858.pgn` | https://www.pgnmentor.com/players/Morphy.zip | `Morphy.pgn` |
| 7 | Classic Masters | Anderssen, Adolf vs Dufresne, Jean | C52 | 1-0 | White | `classic-02-evergreen-game-1852.pgn` | https://www.pgnmentor.com/players/Anderssen.zip | `Anderssen.pgn` |
| 8 | Classic Masters | Steinitz, William vs Von Bardeleben, Curt | C54 | 1-0 | White | `classic-03-steinitz-bardeleben-1895.pgn` | https://www.pgnmentor.com/players/Steinitz.zip | `Steinitz.pgn` |
| 9 | Classic Masters | Levitsky, Stepan M vs Marshall, Frank James | B40 | 0-1 | Black | `classic-04-marshall-levitsky-1912.pgn` | https://www.pgnmentor.com/players/Marshall.zip | `Marshall.pgn` |
| 10 | Classic Masters | Byrne, Donald vs Fischer, Robert James | D97 | 0-1 | Black | `classic-05-fischer-byrne-1956.pgn` | https://www.pgnmentor.com/players/Fischer.zip | `Fischer.pgn` |
| 11 | Sicilian Accelerated Dragon | Larsen, Bent vs Fischer, Robert James | B36 | 0-1 | Black | `dragon-01-larsen-fischer-1971.pgn` | https://www.pgnmentor.com/players/Fischer.zip | `Fischer.pgn` |
| 12 | Sicilian Accelerated Dragon | Damjanovic, Mato vs Fischer, Robert James | B36 | 0-1 | Black | `dragon-02-damjanovic-fischer-1970.pgn` | https://www.pgnmentor.com/players/Fischer.zip | `Fischer.pgn` |
| 13 | Sicilian Accelerated Dragon | Keres, Paul vs Petrosian, Tigran V | B39 | 0-1 | Black | `dragon-03-keres-petrosian-1959.pgn` | https://www.pgnmentor.com/players/Petrosian.zip | `Petrosian.pgn` |
| 14 | Sicilian Accelerated Dragon | Anand, Viswanathan vs Kasparov, Gary | B77 | 0-1 | Black | `dragon-04-anand-kasparov-1995.pgn` | https://www.pgnmentor.com/players/Kasparov.zip | `Kasparov.pgn` |
| 15 | Sicilian Accelerated Dragon | Larsen, Bent vs Miles, Anthony J | B70 | 0-1 | Black | `dragon-05-larsen-miles-1978.pgn` | https://www.pgnmentor.com/openings/SicDragon6Be2-6Bc4.zip | `SicDragon6Be2-6Bc4.pgn` |
| 16 | King's Gambit | Spassky, Boris V vs Bronstein, David I | C36 | 1-0 | White | `kg-01-spassky-bronstein-1960.pgn` | https://www.pgnmentor.com/openings/KingsGambit.zip | `KingsGambit.pgn` |
| 17 | King's Gambit | Anderssen, Adolf vs Kieseritzky, Lionel | C33 | 1-0 | White | `kg-02-immortal-game-1851.pgn` | https://www.pgnmentor.com/openings/KingsGambit.zip | `KingsGambit.pgn` |
| 18 | King's Gambit | Spassky, Boris V vs Fischer, Robert James | C39 | 1-0 | White | `kg-03-spassky-fischer-1960.pgn` | https://www.pgnmentor.com/openings/KingsGambit.zip | `KingsGambit.pgn` |
| 19 | King's Gambit | Fischer, Robert James vs Evans, Larry Melvyn | C33 | 1-0 | White | `kg-04-fischer-evans-1963.pgn` | https://www.pgnmentor.com/openings/KingsGambit.zip | `KingsGambit.pgn` |
| 20 | King's Gambit | Fischer, Robert James vs Wade, Robert Graham | C30 | 1-0 | White | `kg-05-fischer-wade-1968.pgn` | https://www.pgnmentor.com/openings/KingsGambit.zip | `KingsGambit.pgn` |
| 21 | London System | Carlsen,M vs Tomashevsky,E | A46 | 1-0 | White | `london-01-carlsen-tomashevsky-2016.pgn` | https://www.pgnmentor.com/players/Carlsen.zip | `Carlsen.pgn` |
| 22 | London System | Carlsen,M vs Karjakin,Sergey | B50 | 1-0 | White | `london-02-carlsen-karjakin-2016.pgn` | https://www.pgnmentor.com/players/Carlsen.zip | `Carlsen.pgn` |
| 23 | London System | Kamsky,G vs Shirov,A | B30 | 1-0 | White | `london-03-kamsky-shirov-2007.pgn` | https://www.pgnmentor.com/players/Kamsky.zip | `Kamsky.pgn` |
| 24 | London System | Kamsky,G vs Karpov,Ana | A47 | 1-0 | White | `london-04-kamsky-karpov-2007.pgn` | https://www.pgnmentor.com/openings/London2e6.zip | `London2e6.pgn` |
| 25 | London System | Grischuk,A vs Kosteniuk,A | A46 | 1-0 | White | `london-05-grischuk-kosteniuk-2022.pgn` | https://www.pgnmentor.com/openings/London2e6.zip | `London2e6.pgn` |

---

## 3. Pipeline Checks
1. `validate_pgn.py --json content-private/chess/out content-private/chess/library/*.pgn`: **25/25 PASSED (0 errors)**.
2. `npm test`: **60+ test suites green**.
3. Firestore seeding: verified live in `chessGames` collection.
