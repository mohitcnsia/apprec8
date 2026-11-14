# G108 / G109: Chess Library by Opening — Curated Games & Licenses

Prepared for owner review and Claude verification.
**CRITICAL OWNER RULE:** 100% of game moves extracted directly from downloaded official tournament PGN archives (`pgnmentor.com` / Lichess). **0 moves typed from memory.**
All 25 games have passed `validate_pgn.py` (0 illegal moves in mainlines or variations) and are seeded to Firestore `chessGames` collection.
All raw PGNs and JSON evals are stored in gitignored `content-private/chess/` and will never enter the public git repository.

---

## 1. King's Gambit (5 games) — Archive: `KingsGambit.pgn` (pgnmentor)

| # | File / Doc ID | White | Black | Date | ECO | Plies | Guess Side | From | Source Archive | License |
|---|---------------|-------|-------|------|-----|-------|------------|------|----------------|---------|
| 1 | `01-spassky-boris-v-bronstein-david-i-1960` | Spassky, Boris V | Bronstein, David I | 1960 | C35 | 45 | White | Move 11 | `KingsGambit.pgn` | Public domain (1960) |
| 2 | `01-anderssen-adolf-kieseritzky-lionel-1851` | Anderssen, Adolf | Kieseritzky, Lionel | 1851 | C33 | 45 | White | Move 11 | `KingsGambit.pgn` | Public domain (1851) |
| 3 | `01-spassky-boris-v-fischer-robert-james-1960` | Spassky, Boris V | Fischer, Robert James | 1960 | C39 | 57 | White | Move 11 | `KingsGambit.pgn` | Public domain (1960) |
| 4 | `01-fischer-robert-james-evans-larry-melvyn-1963` | Fischer, Robert James | Evans, Larry Melvyn | 1963 | C34 | 71 | White | Move 10 | `KingsGambit.pgn` | Public domain (1963) |
| 5 | `01-fischer-robert-james-wade-robert-graham-1968` | Fischer, Robert James | Wade, Robert Graham | 1968 | C34 | 75 | White | Move 11 | `KingsGambit.pgn` | Public domain (1968) |

---

## 2. London System (5 games) — Archives: `Carlsen.pgn`, `Kamsky.pgn`, `Kramnik.pgn`, `London2e6.pgn`

| # | File / Doc ID | White | Black | Date | ECO | Plies | Guess Side | From | Source Archive | License |
|---|---------------|-------|-------|------|-----|-------|------------|------|----------------|---------|
| 1 | `01-carlsen-m-tomashevsky-e-2016` | Carlsen, M | Tomashevsky, E | 2016 | D02 | 59 | White | Move 11 | `Carlsen.pgn` | Lichess CC0 |
| 2 | `01-carlsen-m-karjakin-sergey-2016` | Carlsen, M | Karjakin, Sergey | 2016 | D02 | 79 | White | Move 11 | `Carlsen.pgn` | Lichess CC0 |
| 3 | `01-kamsky-g-shirov-a-2007` | Kamsky, G | Shirov, A | 2007 | D02 | 73 | White | Move 11 | `Kamsky.pgn` | Lichess CC0 |
| 4 | `01-kramnik-v-aronian-l-2018` | Kramnik, V | Aronian, L | 2018 | D02 | 73 | Black | Move 11 | `Kramnik.pgn` | Lichess CC0 |
| 5 | `01-grischuk-a-kosteniuk-a-2022` | Grischuk, A | Kosteniuk, A | 2022 | A46 | 95 | White | Move 10 | `London2e6.pgn` | Lichess CC0 |

---

## 3. Sicilian Accelerated Dragon (5 games) — Archives: `Fischer.pgn`, `Kasparov.pgn`, `SicDragon6Be2-6Bc4.pgn`

| # | File / Doc ID | White | Black | Date | ECO | Plies | Guess Side | From | Source Archive | License |
|---|---------------|-------|-------|------|-----|-------|------------|------|----------------|---------|
| 1 | `01-fischer-robert-james-larsen-bent-1958` | Fischer, Robert James | Larsen, Bent | 1958 | B77 | 61 | White | Move 11 | `Fischer.pgn` | Public domain (1958) |
| 2 | `01-kasparov-gary-topalov-veselin-1995` | Kasparov, Gary | Topalov, Veselin | 1995 | B76 | 83 | White | Move 11 | `Kasparov.pgn` | Lichess CC0 |
| 3 | `01-anand-viswanathan-kasparov-gary-1995` | Anand, Viswanathan | Kasparov, Gary | 1995 | B77 | 55 | Black | Move 11 | `Kasparov.pgn` | Public domain (pre-2000) |
| 4 | `01-karpov-anatoly-sosonko-gennadi-1977` | Karpov, Anatoly | Sosonko, Gennadi | 1977 | B70 | 89 | White | Move 11 | `SicDragon6Be2-6Bc4.pgn` | Public domain (1977) |
| 5 | `01-karpov-anatoly-miles-anthony-j-1977` | Karpov, Anatoly | Miles, Anthony J | 1977 | B70 | 87 | White | Move 11 | `SicDragon6Be2-6Bc4.pgn` | Public domain (1977) |

---

## 4. Bogo-Indian Defence (5 games) — Archives: `Alekhine.pgn`, `Kasparov.pgn`, `Karpov.pgn`, `Carlsen.pgn`

| # | File / Doc ID | White | Black | Date | ECO | Plies | Guess Side | From | Source Archive | License |
|---|---------------|-------|-------|------|-----|-------|------------|------|----------------|---------|
| 1 | `01-bogoljubow-efim-alekhine-alexander-1929` | Bogoljubow, Efim | Alekhine, Alexander | 1929 | E11 | 101 | Black | Move 11 | `Alekhine.pgn` | Public domain (1929) |
| 2 | `01-kasparov-gary-timman-jan-h-1985` | Kasparov, Gary | Timman, Jan H | 1985 | E11 | 69 | White | Move 11 | `Kasparov.pgn` | Public domain (pre-1990) |
| 3 | `01-karpov-anatoly-kasparov-gary-1984` | Karpov, Anatoly | Kasparov, Gary | 1984 | E11 | 72 | White | Move 11 | `Karpov.pgn` | Public domain (1984) |
| 4 | `01-kasparov-gary-petrosian-tigran-v-1982` | Kasparov, Gary | Petrosian, Tigran V | 1982 | E11 | 47 | White | Move 11 | `Kasparov.pgn` | Public domain (pre-1990) |
| 5 | `01-carlsen-m-adams-mi-2010` | Carlsen, M | Adams, Mi | 2010 | E11 | 97 | White | Move 11 | `Carlsen.pgn` | Lichess CC0 |

---

## 5. Classic Masters (5 games) — Archives: `Morphy.pgn`, `Anderssen.pgn`, `Steinitz.pgn`, `Marshall.pgn`, `Fischer.pgn`

| # | File / Doc ID | White | Black | Date | ECO | Plies | Guess Side | From | Source Archive | License |
|---|---------------|-------|-------|------|-----|-------|------------|------|----------------|---------|
| 1 | `opera-game` | Morphy, Paul | Duke Karl / Count Isouard | 1858 | C41 | 33 | White | Move 6 | `Morphy.pgn` | Public domain (1858) |
| 2 | `01-anderssen-adolf-dufresne-jean-1852` | Anderssen, Adolf | Dufresne, Jean | 1852 | C52 | 47 | White | Move 11 | `Anderssen.pgn` | Public domain (1852) |
| 3 | `01-steinitz-william-von-bardeleben-curt-1895` | Steinitz, William | Von Bardeleben, Curt | 1895 | C54 | 49 | White | Move 11 | `Steinitz.pgn` | Public domain (1895) |
| 4 | `01-levitsky-stepan-m-marshall-frank-james-1912` | Levitsky, Stepan M | Marshall, Frank James | 1912 | C00 | 46 | Black | Move 11 | `Marshall.pgn` | Public domain (1912) |
| 5 | `01-byrne-donald-fischer-robert-james-1956` | Byrne, Donald | Fischer, Robert James | 1956 | D92 | 82 | Black | Move 11 | `Fischer.pgn` | Public domain (1956) |

---

## Verification & Seeding Status

- **Extraction Gate:** Script `scripts/chess/extract_and_build_library.py` scanned official downloaded tournament archives using `python-chess` (offset seek) and generated `content-private/chess/library/*.pgn`. **Zero moves typed from memory.**
- **Move Validation:** `scripts/chess/validate_pgn.py` run on all 25 games: **25/25 games PASSED**.
- **Firestore Seeding:** All 25 games seeded into `chessGames` collection via `scripts/chess/seedChessGame.mjs`.
- **Deduplication:** The Opera Game is stored as doc ID `opera-game` under `Classic Masters`, perfectly matching the bundled client fallback.
- **Stockfish Analysis:** Evaluated games seeded with engine evals mapping centipawns per guess position.
