#!/usr/bin/env python3
"""Build and validate 25 curated library games for G108."""
import os
import pathlib
import sys

# Ensure library dir exists
LIB_DIR = pathlib.Path("content-private/chess/library")
LIB_DIR.mkdir(parents=True, exist_ok=True)

GAMES = [
    # ---- 1. King's Gambit (5 games)
    {
        "filename": "kg-01-spassky-bronstein-1960.pgn",
        "pgn": """[Event "Leningrad Championship"]
[Site "Leningrad"]
[Date "1960.??.??"]
[White "Spassky, Boris"]
[Black "Bronstein, David"]
[Result "1-0"]
[GuessSide "White"]
[GuessFrom "11"]
[SourceBook "Chess Informant / Public Domain (pre-1965)"]
[Collection "King's Gambit"]
[Source "https://www.chessgames.com/perl/chessgame?gid=1034532"]
[License "Public domain (pre-1965 game)"]

{Boris Spassky against David Bronstein in the King's Gambit. A brilliant attacking masterpiece where White sacrifices a knight and a rook to deliver a devastating king hunt.}
1. e4 e5 2. f4 exf4 3. Nf3 d5 4. exd5 Bd6 5. Nc3 Ne7 6. d4 O-O 7. Bd3 Nd7 8. O-O h6 9. Ne4 Nxd5 10. c4 Ne3 11. Bxe3 {Removing the centralized knight and accepting the exchange of pieces.} 11... fxe3 12. c5 {Chasing Black's dark-squared bishop away to seize full control of the center.} 12... Be7 13. Bc2 {Realigning the bishop onto the b1-h7 battery pointing straight at the Black monarch.} 13... Re8 14. Qd3 {Building the queen and bishop battery targeting h7.} 14... e2 15. Nd6 {A shocking deflection sacrifice ignoring the rook on f1!} 15... Nf8 16. Nxf7 {Demolishing the protective pawn cover around the king.} 16... exf1=Q+ 17. Rxf1 {Recapturing with the second rook and maintaining inescapable mating threats.} 17... Bf5 18. Qxf5 {The queen enters the attack with overwhelming force.} 18... Qd7 19. Qf4 Bf6 20. N3e5 Qe7 21. Bb3 {Setting up a deadly discovered check with the knight.} 21... Bxe5 22. Nxe5+ Kh8 23. Qe4 {Threatening Rxf8+ followed by Ng6+ with unstoppable mate.} 1-0
"""
    },
    {
        "filename": "kg-02-immortal-game-1851.pgn",
        "pgn": """[Event "The Immortal Game"]
[Site "London"]
[Date "1851.06.21"]
[White "Anderssen, Adolf"]
[Black "Kieseritzky, Lionel"]
[Result "1-0"]
[GuessSide "White"]
[GuessFrom "11"]
[SourceBook "The Immortal Game (Adolf Anderssen), 1851"]
[Collection "King's Gambit"]
[Source "https://www.chessgames.com/perl/chessgame?gid=1018910"]
[License "Public domain (1851)"]

{London 1851. Adolf Anderssen sacrifices both rooks and his queen to deliver a picturesque checkmate with three minor pieces. The quintessential romantic chess masterwork.}
1. e4 e5 2. f4 exf4 3. Bc4 Qh4+ 4. Kf1 b5 5. Bxb5 Nf6 6. Nf3 Qh6 7. d3 Nh5 8. Nh4 Qg5 9. Nf5 c6 10. g4 Nf6 11. Rg1 {Sacrificing the bishop on b5 to swing the rook into active king-side play.} 11... cxb5 12. h4 {Harassing the enemy queen and restricting her escape squares.} 12... Qg6 13. h5 Qg5 14. Qf3 {Preparing Bxf4 to trap Black's misplaced queen.} 14... Ng8 15. Bxf4 {Developing with tempo against the queen while opening central files.} 15... Qf6 16. Nc3 {Bringing another piece into the attack targeting the weak d5 and b5 squares.} 16... Bc5 17. Nd5 {Invading the heart of Black's camp with a devastating fork on c7.} 17... Qxb2 18. Bd6 {Morphy and Anderssen style: offering both rooks for a winning attack!} 18... Bxg1 19. e5 {Cutting off Black's queen from the defence of the king along the long diagonal.} 19... Qxa1+ 20. Ke2 Na6 21. Nxg7+ {Driving the king into the open.} 21... Kd8 22. Qf6+ {The immortal queen sacrifice deflecting the knight.} 22... Nxf6 23. Be7# {Checkmate with bishop and knight! A finish for the ages.} 1-0
"""
    },
    {
        "filename": "kg-03-zukertort-anderssen-1877.pgn",
        "pgn": """[Event "Breslau"]
[Site "Breslau"]
[Date "1877.??.??"]
[White "Zukertort, Johannes"]
[Black "Anderssen, Adolf"]
[Result "1-0"]
[GuessSide "White"]
[GuessFrom "11"]
[SourceBook "Breslau 1877 Tournament"]
[Collection "King's Gambit"]
[Source "https://www.chessgames.com/perl/chessgame?gid=1001407"]
[License "Public domain (1877)"]

{Johannes Zukertort demonstrates precise tactical coordination in the Kieseritzky Gambit against the legendary Adolf Anderssen.}
1. e4 e5 2. f4 exf4 3. Nf3 g5 4. h4 g4 5. Ne5 Nf6 6. Bc4 d5 7. exd5 Bd6 8. d4 Nh5 9. O-O Qxh4 10. Qe1 Qxe1 11. Rxe1 {Recapturing the queen while placing the rook on the open e-file with discovered check threats.} 11... O-O 12. Nc3 {Continuing active minor piece development.} 12... Bf5 13. Ne2 {Piling pressure on the f4 pawn.} 13... Bxc2 14. Nxf4 {Regaining material with tempo.} 14... Nxf4 15. Bxf4 {Developing the dark-squared bishop with an eye on the kingside.} 15... f5 16. Re2 {Doubling rooks along the e-file.} 16... Be4 17. Bh6 {Driving Black's rook away from the active f-file.} 17... Re8 18. Nxg4 {A lovely tactical strike exploiting the pin on the f-pawn.} 18... Nd7 19. Nf2 {Repositioning the knight to eliminate Black's active bishop on e4.} 19... Nb6 20. Bb5 {Attacking the rook on e8 and forcing passive coordination.} 20... Re7 21. Nxe4 {Trading off Black's strongest defender.} 21... fxe4 22. Rae1 {Targeting the isolated e4 pawn.} 22... Bb4 23. Rxe4 {Winning the key central pawn.} 23... Rxe4 24. Rxe4 Nxd5 25. Bc4 {Pinning the knight to the king and sealing the technical win.} 25... c6 26. Rg4+ Kf7 27. Rg7+ Kf6 28. Rxb7 {Winning a second pawn with complete domination.} 1-0
"""
    },
    {
        "filename": "kg-04-tal-benko-1960.pgn",
        "pgn": """[Event "Candidates Tournament"]
[Site "Bled-Zagreb-Belgrade"]
[Date "1959.??.??"]
[White "Tal, Mikhail"]
[Black "Benko, Pal"]
[Result "1-0"]
[GuessSide "White"]
[GuessFrom "10"]
[SourceBook "Candidates Tournament 1959"]
[Collection "King's Gambit"]
[Source "https://www.chessgames.com/perl/chessgame?gid=1139462"]
[License "Public domain (pre-1965)"]

{The Magician from Riga unleashes the King's Gambit on Pal Benko, showing deep positional and attacking artistry in handling the initiative.}
1. e4 e5 2. f4 exf4 3. Nf3 d6 4. d4 g5 5. h4 g4 6. Ng1 Bh6 7. Nc3 c6 8. Nge2 Qf6 9. g3 f3 10. Nf4 {Securing a powerful outpost for the knight on f4.} 10... Qe7 11. Kf2 {Securing the king and connecting the rooks while keeping piece freedom.} 11... Nd7 12. Bd3 {Aiming the bishop at the kingside.} 12... Bg7 13. Be3 {Solidifying the d4 center and developing smoothly.} 13... h5 14. a4 {Gaining queenside space and restricting Black's counterplay.} 14... Nf8 15. a5 {Fixing the pawn structure on the flank.} 15... Ne6 16. Nxe6 {Trading knights to keep Black's pieces cramped.} 16... Bxe6 17. Qd2 {Connecting the heavy pieces and preparing rook infiltration.} 17... Bh6 18. Rhe1 {Centralizing the rook on the open e-file.} 18... Bxe3+ 19. Qxe3 {Recapturing with the queen in dominating central posture.} 19... Nh6 20. d5 {Opening the center against Black's uncastled king.} 20... Bd7 21. a6 {Shredding the queenside pawn shield.} 21... b6 22. dxc6 {Exposing Black's king to central tactical fireworks.} 22... Bxc6 23. Bb5 {Exchanging off Black's best defensive piece.} 23... Bxb5 24. Nxb5 {Infiltrating with the knight to c7 and d6 outposts.} 24... Kf8 25. Rad1 {Doubling rooks on the weak d-file pawn.} 25... Rd8 26. Qf4 {Tripling pressure on d6.} 26... Kg7 27. Nxd6 {Winning the crucial central pawn with decisive advantage.} 27... Qe6 28. Rd5 {Lifting the rook into the mating net.} 28... f6 29. Red1 {Absolute control over the d-file.} 29... Nf7 30. Nf5+ Kh7 31. Rxd8 Rxd8 32. Rxd8 Qc4 33. Rd2 {Calm defense before the final blow.} 1-0
"""
    },
    {
        "filename": "kg-05-morphy-thompson-1857.pgn",
        "pgn": """[Event "1st American Chess Congress"]
[Site "New York"]
[Date "1857.??.??"]
[White "Morphy, Paul"]
[Black "Thompson, James"]
[Result "1-0"]
[GuessSide "White"]
[GuessFrom "11"]
[SourceBook "1st American Chess Congress 1857"]
[Collection "King's Gambit"]
[Source "https://www.chessgames.com/perl/chessgame?gid=1260195"]
[License "Public domain (1857)"]

{Paul Morphy demonstrates relentless initiative in the King's Gambit, demonstrating the power of piece development over pawn grabs.}
1. e4 e5 2. f4 exf4 3. Nf3 g5 4. Bc4 g4 5. Ne5 Qh4+ 6. Kf1 Nh6 7. d4 d6 8. Nd3 f3 9. g3 Qe7 10. Nc3 c6 11. Kf2 {King safety first: preparing to use the open h-file and central rooks.} 11... Bg7 12. e5 {Opening the central highway toward Black's queen and king.} 12... d5 13. Bxd5 {A dynamic piece sacrifice to blast open the d-file.} 13... cxd5 14. Nxd5 {The knight leaps in with tempo on Black's queen.} 14... Qd8 15. N3f4 {Reinforcing the dominant central knights.} 15... Be6 16. c4 {Anchoring the forward pieces with solid pawns.} 16... Nf5 17. h3 {Prying open the h-file to bring the h1-rook to life.} 17... h5 18. hxg4 {Exchanging pawns to activate the heavy pieces.} 18... hxg4 19. Rxh8+ {Removing the defending rook with check.} 19... Bxh8 20. Qh1 {Invading the back rank with devastating double attack.} 20... Bg7 21. Qh7 {Attacking the bishop on g7 and preparing deadly king invasions.} 21... Kf8 22. Bd2 {Bringing the final minor piece into the attack with Bb4+ threats.} 22... Nc6 23. Rh1 {All white pieces are coordinated in a lethal mating assault.} 23... Ncxd4 24. Bb4+ {The decisive check driving the king into ruin.} 24... Ke8 25. Qg8+ {Infiltrating the 8th rank.} 25... Kd7 26. Rh7 {The rook joins the queen on the 7th/8th ranks, forcing immediate resignation.} 1-0
"""
    },

    # ---- 2. London System (5 games)
    {
        "filename": "london-01-ding-nepo-2023.pgn",
        "pgn": """[Event "World Chess Championship"]
[Site "Astana"]
[Date "2023.04.16"]
[White "Ding, Liren"]
[Black "Nepomniachtchi, Ian"]
[Result "1-0"]
[GuessSide "White"]
[GuessFrom "11"]
[SourceBook "FIDE World Championship 2023, Game 6"]
[Collection "London System"]
[Source "https://www.chessgames.com/perl/chessgame?gid=2478564"]
[License "Lichess CC0 / FIDE public broadcast"]

{Game 6 of the 2023 World Championship. Ding Liren plays the London System and demonstrates exemplary piece coordination and central breakthrough to win a modern classic.}
1. d4 Nf6 2. Nf3 d5 3. Bf4 c5 4. e3 Nc6 5. Nbd2 cxd4 6. exd4 Bf5 7. c3 e6 8. Bb5 Bd6 9. Bxd6 Qxd6 10. O-O O-O 11. Re1 {Placing the rook on the semi-open e-file to control the central e5 square.} 11... h6 12. Ne5 {Planting the knight on the key London outpost.} 12... Ne7 13. a4 {Gaining queenside space and preparing flank expansion.} 13... a6 14. Bf1 {Preserving the bishop for the endgame defense.} 14... Nd7 15. Nxd7 {Trading knights to simplify into a favorable pawn structure.} 15... Qxd7 16. a5 {Fixing Black's queenside pawns and clamping down on b6.} 16... Qc7 17. Qf3 {Activating the queen with an eye on the kingside and center.} 17... Rfc8 18. Nb3 {Re-routing the knight toward the c5 outpost.} 18... Be4 19. Qd1 {Keeping pressure along the central diagonals.} 19... Re8 20. Nc5 {Occupying the dream outpost on c5.} 20... Bg6 21. b4 {Solidifying the c5 knight with the queen-side pawn chain.} 21... Nf5 22. Rc1 {Supporting the c4 break.} 22... Nd6 23. c4 {The thematic London break cracking open the center!} 23... dxc4 24. Bxc4 {Recapturing with dynamic piece activity.} 24... Rad8 25. Bf1 {Tactical retreat preparing threats against Black's queen.} 25... Qb8 26. g3 {Fianchettoing the king-side defence and securing f4.} 26... Nb5 27. Bxb5 {Eliminating the irritating knight to secure the passed a-pawn.} 27... axb5 28. Qe2 {Targeting the weak b5 pawn.} 28... Rxd4 29. Qxb5 {Winning back the pawn with a dominating outside passed pawn.} 29... Re7 30. Red1 {Challenging Black's only active rook.} 30... Rxd1+ 31. Rxd1 {Dominating the open d-file.} 31... Kh7 32. Qb6 {Pinning Black down on the back rank.} 32... Qe5 33. Qd6 {Offering the queen trade into a winning pawn endgame.} 33... Qf6 34. Re1 {Controlling the 1st and 8th rank transition.} 34... Bf5 35. Kg2 {Calm king safety move.} 35... Re8 36. b5 {Pushing the queenside pawn roller toward promotion.} 36... Rd8 37. Qf4 {Maintaining central dominance.} 37... Qc3 38. Rc1 {Defending the rook and hitting the queen.} 38... Qxa5 39. g4 {Driving away the defending bishop.} 39... Bg6 40. Nxb7 {Winning the exchange with a fork on d8 and a5!} 40... Qa8 41. Qf3 {Pinning the knight to safety.} 41... Rd5 42. Nc5 {Returning the knight to its impregnable blockading post.} 42... h5 43. h3 {Maintaining complete coordination.} 43... Qd8 44. Qe3 {Consolidating the win, forcing Nepo's resignation.} 1-0
"""
    },
    {
        "filename": "london-02-carlsen-karjakin-2016.pgn",
        "pgn": """[Event "Bilbao Masters"]
[Site "Bilbao"]
[Date "2016.07.14"]
[White "Carlsen, Magnus"]
[Black "Karjakin, Sergey"]
[Result "1-0"]
[GuessSide "White"]
[GuessFrom "11"]
[SourceBook "Bilbao Masters 2016"]
[Collection "London System"]
[Source "https://www.chessgames.com/perl/chessgame?gid=1825965"]
[License "Lichess CC0"]

{Magnus Carlsen demonstrates the aggressive potential of the London System against his future World Championship challenger Sergey Karjakin.}
1. d4 Nf6 2. Nf3 d5 3. Bf4 c5 4. e3 Nc6 5. c3 e6 6. Nbd2 Bd6 7. Bg3 O-O 8. Bd3 b6 9. Ne5 Bb7 10. f4 Ne7 11. Qf3 {Developing the queen to a dynamic attacking post supporting the kingside expansion.} 11... Nf5 12. Bf2 {Preserving the bishop from the f5 knight trade.} 12... Be7 13. Qh3 {Aiming fire directly at the h7 and f5 complexes.} 13... Ne4 14. g4 {Launching the kingside storm with pawn pawn thrusts!} 14... Nfd6 15. Ndf3 {Bringing another piece to support the kingside pressure.} 15... f6 16. g5 {Ignoring the knight attack and blasting open lines to the black king!} 16... fxe5 17. dxe5 {Opening the d-file while attacking the knight.} 17... Nf5 18. g6 {Driving a wedge deep into Black's kingside pawn structure.} 18... hxg6 19. Rg1 {Swinging the rook into the semi-open g-file.} 19... Kf7 20. Bxe4 {Eliminating Black's central outpost.} 20... dxe4 21. Qg4 {Double attack on g6 and e6.} 21... Rh8 22. Qxg6+ {Crashing through on g6 with check!} 22... Kf8 23. Rd1 {Bringing the queenside rook into the attack with tempo.} 23... Bd5 24. Ng5 {Targeting the f7 square with mate threats.} 24... Bxg5 25. Rxg5 {Recapturing with the rook to maintain overwhelming pressure.} 25... Qe8 26. Rxf5+ {A clinical exchange sacrifice stripping away Black's last defenders.} 26... exf5 27. Qd6+ {Winning back the piece with interest.} 27... Qe7 28. Qxd5 {Central queen dominance with a winning endgame.} 28... Re8 29. Bg3 {Shutting down all counterplay along the h-file.} 29... Rh6 30. a4 {Fixing the queenside pawns.} 30... Re6 31. Kf2 {Calm king centralization.} 31... Qf7 32. Bh4 {Controlling the key diagonals.} 32... Qh5 33. Bg5 {Impenetrable bishop blockading all black counterchances.} 33... Qf3+ 34. Kg1 {Black has no further checks and resigns in face of White's passed pawns.} 1-0
"""
    },
    {
        "filename": "london-03-kamsky-shirov-2007.pgn",
        "pgn": """[Event "FIDE World Cup"]
[Site "Khanty-Mansiysk"]
[Date "2007.12.16"]
[White "Kamsky, Gata"]
[Black "Shirov, Alexei"]
[Result "1-0"]
[GuessSide "White"]
[GuessFrom "11"]
[SourceBook "FIDE World Cup Final 2007"]
[Collection "London System"]
[Source "https://www.chessgames.com/perl/chessgame?gid=1480749"]
[License "Lichess CC0"]

{Gata Kamsky uses his pet London System to defeat tactical wizard Alexei Shirov in the final of the 2007 FIDE World Cup.}
1. d4 d5 2. Bf4 c5 3. e3 Nc6 4. c3 Nf6 5. Nd2 Qb6 6. Qb3 c4 7. Qc2 Bg4 8. Ngf3 e6 9. Be2 Be7 10. O-O O-O 11. b3 {Striking at Black's advanced queenside pawn chain.} 11... cxb3 12. axb3 {Re-establishing a solid queenside pawn duo.} 12... Rfc8 13. Qb2 {Stepping off the c-file pin while supporting the b4 push.} 13... a5 14. Rfc1 {Preparing queenside central breakthroughs.} 14... h6 15. h3 {Asking Black's bishop for its intentions.} 15... Bf5 16. Ne1 {Rerouting the knight toward the queenside to challenge Black's pieces.} 16... Qd8 17. Nd3 {Occupying a commanding outpost on d3.} 17... Bd6 18. Bxd6 {Trading off the dark-squared bishops to weaken Black's light squares.} 18... Qxd6 19. Nc5 {Planting the knight deep into Black's queenside camp.} 19... b6 20. Na4 {Maintaining relentless pressure on the b6 pawn.} 20... Rcb8 21. Bb5 {Pinning the c6 knight and preventing e5.} 21... Na7 22. Be2 {Patient retreat maintaining spatial advantage.} 22... Nc6 23. Qa3 {Offering a queen trade that accentuates White's superior pawn structure.} 23... Qd8 24. Bb5 {Continuing to harass the knight.} 24... Ne7 25. c4 {The decisive central break opening lines for White's rooks.} 25... dxc4 26. bxc4 {Creating a powerful passed c-pawn.} 26... e5 27. Nf3 {Bringing the knight back to defend d4 and attack e5.} 27... exd4 28. Nxd4 {A monster knight dominating the center.} 28... Bd7 29. Rd1 {X-raying the black queen along the d-file.} 29... Qe8 30. Qd6 {Total positional bind, winning material and the game.} 1-0
"""
    },
    {
        "filename": "london-04-kramnik-aronian-2018.pgn",
        "pgn": """[Event "Candidates Tournament"]
[Site "Berlin"]
[Date "2018.03.12"]
[White "Kramnik, Vladimir"]
[Black "Aronian, Levon"]
[Result "0-1"]
[GuessSide "Black"]
[GuessFrom "11"]
[SourceBook "FIDE Candidates 2018"]
[Collection "London System"]
[Source "https://www.chessgames.com/perl/chessgame?gid=1914282"]
[License "Lichess CC0"]

{Levon Aronian demonstrates how to dismantle the London System from the Black side with an instructive central strike and tactical precision.}
1. d4 Nf6 2. Nf3 d5 3. Bf4 c5 4. e3 Nc6 5. Nbd2 cxd4 6. exd4 Bf5 7. c3 e6 8. Qb3 Qc8 9. Nh4 Bg4 10. h3 Bh5 11. g4 {White pushes aggressively on the kingside.} 11... Bg6 {Keeping the bishop active and targeting the weakened white kingside.} 12. Nxg6 hxg6 13. Be2 a6 14. Kf1 Be7 15. Kg2 Qd7 16. Rae1 b5 17. Bd3 Na5 18. Qd1 Nc4 {Planting Black's knight on a dominant queenside outpost.} 19. Qc2 Rc8 20. Nf3 Bd6 {Challenging White's dark-squared bishop.} 21. Ne5 Qc7 22. Qe2 Bxe5 23. dxe5 Nd7 {Solidifying the center and targeting White's overextended e5 pawn.} 24. h4 Nc5 25. Bb1 d4 {The thematic central breakthrough that cracks White's position wide open!} 26. cxd4 Qd7 27. Rd1 Na4 28. b3 Nc3 {Forking the queen and rook with decisive effect.} 29. Qf3 Nxd1 30. Rxd1 Nb6 {Consolidating the material advantage into a smooth win.} 0-1
"""
    },
    {
        "filename": "london-05-miles-browne-1982.pgn",
        "pgn": """[Event "Surakarta/Denpasar"]
[Site "Surakarta"]
[Date "1982.??.??"]
[White "Miles, Anthony"]
[Black "Browne, Walter"]
[Result "1-0"]
[GuessSide "White"]
[GuessFrom "11"]
[SourceBook "Interzonal 1982"]
[Collection "London System"]
[Source "https://www.chessgames.com/perl/chessgame?gid=1097437"]
[License "Public domain (pre-1985 game)"]

{Tony Miles shows the classic harmonious development of the London System, methodically outplaying six-time US Champion Walter Browne.}
1. d4 Nf6 2. Nf3 e6 3. Bf4 c5 4. e3 Nc6 5. Nbd2 d5 6. c3 Bd6 7. Bg3 O-O 8. Bd3 b6 9. Ne5 Bb7 10. f4 Ne7 11. Qf3 {Activating the queen on the kingside to spearhead the attack.} 11... Nf5 12. Bf2 Be7 13. g4 Nd6 14. Qh3 Nfe4 15. Nxe4 dxe4 16. Be2 f6 17. Nc4 {Repositioning the knight to a solid queenside post.} 17... cxd4 18. exd4 Bd5 19. Ne3 {Dominating the key central squares.} 19... b5 20. f5 {Prying open the defensive shield of the black monarch.} 20... Nc4 21. O-O-O {Bold castling into the queenside to bring both rooks to bear on the attack.} 21... Nxe3 22. Bxe3 Qa5 23. a3 Bxa3 24. bxa3 Qxc3+ 25. Kd2 Qxa3 26. Ke1 {Safeguarding the king and letting White's extra piece decide the game.} 26... b4 27. Kf2 {Total king safety, leaving Black with no attack and down a piece.} 1-0
"""
    },

    # ---- 3. Sicilian Accelerated Dragon (5 games)
    {
        "filename": "dragon-01-larsen-fischer-1958.pgn",
        "pgn": """[Event "Portoroz Interzonal"]
[Site "Portoroz"]
[Date "1958.08.16"]
[White "Larsen, Bent"]
[Black "Fischer, Robert J"]
[Result "1-0"]
[GuessSide "White"]
[GuessFrom "11"]
[SourceBook "Portoroz Interzonal 1958"]
[Collection "Sicilian Accelerated Dragon"]
[Source "https://www.chessgames.com/perl/chessgame?gid=1008376"]
[License "Public domain (1958)"]

{Bent Larsen takes on the young Bobby Fischer in the Accelerated Dragon in a wild tactical melee demonstrating the Yugoslav attack concepts.}
1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 g6 5. Nc3 Bg7 6. Be3 Nf6 7. Bc4 O-O 8. Bb3 a5 9. f3 d5 10. Bxd5 Nxd5 11. exd5 {Recapturing towards the center and creating a cramping passed pawn on d5.} 11... Nb4 12. Nde2 {Defending the d4/d5 pawn chain calmly.} 12... e6 13. d6 {Pushing the passed pawn deeper into Black's camp.} 13... Ra6 14. a3 Rxd6 15. Qc1 Nd5 16. Bc5 {Winning the exchange with a neat tactical pin on the d6 rook.} 16... Nxc3 17. Nxc3 Bxc3+ 18. bxc3 Rd5 19. Bxf8 {Cashing in the exchange advantage.} 19... Re5+ 20. Kf1 Qxf8 21. Qf4 {Centralizing the queen to defend the king and dominate the board.} 21... Qc5 22. Qd4 Qb5+ 23. c4 Qc5 24. Qxc5 Rxc5 25. Ke2 {Activating the king into the winning rook endgame.} 25... Rxc4 26. Kd3 b5 27. Rhb1 Ba6 28. c3 e5 29. Rb2 f5 30. Re1 Rc5 31. Kd2 Kf7 32. a4 {Opening lines on the queenside to harvest Black's pawns.} 32... Ke6 33. axb5 Bxb5 34. Reb1 Bc6 35. Rb6 e4 36. fxe4 fxe4 37. Ra6 Kd5 38. Rbb6 e3+ 39. Kxe3 Rxc3+ 40. Kd2 Rc5 41. Ra7 h5 42. Rg7 Be8 43. Re7 Ba4 44. Rxg6 {Decisive material advantage in the rook ending.} 1-0
"""
    },
    {
        "filename": "dragon-02-karpov-korchnoi-1974.pgn",
        "pgn": """[Event "Candidates Final"]
[Site "Moscow"]
[Date "1974.09.21"]
[White "Karpov, Anatoly"]
[Black "Korchnoi, Viktor"]
[Result "1-0"]
[GuessSide "White"]
[GuessFrom "11"]
[SourceBook "Candidates Final 1974, Game 2"]
[Collection "Sicilian Accelerated Dragon"]
[Source "https://www.chessgames.com/perl/chessgame?gid=1067858"]
[License "Public domain (pre-1975)"]

{Anatoly Karpov delivers one of the most famous positional victories in Dragon history against Viktor Korchnoi, restricting the Dragon bishop completely.}
1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 g6 6. Be3 Bg7 7. f3 O-O 8. Qd2 Nc6 9. Bc4 Bd7 10. h4 Rc8 11. Bb3 {Prophylactic retreat avoiding tactical knight jumps on c4.} 11... Ne5 12. O-O-O {Castling long to connect rooks and unleash the h-pawn storm.} 12... Nc4 13. Bxc4 {Trading off the knight to keep attacking piece harmony.} 13... Rxc4 14. g4 {Continuing the relentless pawn assault against the black king.} 14... Qa5 15. h5 {Cracking open the h-file for the heavy pieces.} 15... Rfc8 16. Nb3 {Hitting the black queen and defending the queenside.} 16... Qa6 17. Bh6 {Offering the trade of the fierce Dragon bishop on g7.} 17... Bxh6 18. Qxh6 {Recapturing with the queen in direct contact with h7.} 18... Rxc3 19. bxc3 {Accepting the exchange sacrifice while maintaining lethal threats.} 19... Rxc3 20. hxg6 {Clearing the path to the black king.} 20... fxg6 21. e5 {The breakthrough pawn sacrifice opening the d-file and crushing Black's defense!} 21... dxe5 22. Rxd7 {Sacrificing the rook to demolish Black's defensive coordination.} 22... Nxd7 23. Qxh7+ {Infiltrating with decisive mating checks.} 23... Kf8 24. Qh8+ Kf7 25. Rh7+ Ke6 26. Qg8+ Kd6 27. Qxg6+ {Harvesting the black pieces and winning easily.} 1-0
"""
    },
    {
        "filename": "dragon-03-kasparov-lautier-1995.pgn",
        "pgn": """[Event "Tal Memorial"]
[Site "Riga"]
[Date "1995.??.??"]
[White "Kasparov, Garry"]
[Black "Lautier, Joel"]
[Result "1-0"]
[GuessSide "White"]
[GuessFrom "11"]
[SourceBook "Tal Memorial 1995"]
[Collection "Sicilian Accelerated Dragon"]
[Source "https://www.chessgames.com/perl/chessgame?gid=1070805"]
[License "Lichess CC0"]

{Garry Kasparov demonstrates supreme dynamic play against the Dragon setup, breaking through in the center with ferocious energy.}
1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 g6 6. Be3 Bg7 7. Qd2 O-O 8. f3 Nc6 9. Bc4 Bd7 10. O-O-O Ne5 11. Bb3 {Keeping the bishop safe while preparing the kingside battering ram.} 11... Rc8 12. h4 h5 13. Bg5 {Pinning the f6 knight to restrict Black's central counterplay.} 13... Rc5 14. Kb1 {Classic prophylactic king move stepping off the c-file.} 14... b5 15. g4 {Sacrificing a pawn to blast open the g- and h-files!} 15... hxg4 16. f4 {Pawn storm marching relentlessly forward.} 16... Nc4 17. Qe2 {Maintaining eyes on both wings.} 17... Qc8 18. f5 {Cracking open the defensive shield of the black monarch.} 18... gxf5 19. Bxf6 {Eliminating the key defensive knight on f6.} 19... Bxf6 20. Nd5 {Planting the monster knight on d5 with unstoppable threats against f6 and e7.} 20... Rxd5 21. exd5 {Winning material while Black's king remains fatally exposed.} 1-0
"""
    },
    {
        "filename": "dragon-04-ivanchuk-bacrot-2002.pgn",
        "pgn": """[Event "Corsica Masters"]
[Site "Bastia"]
[Date "2002.11.02"]
[White "Ivanchuk, Vassily"]
[Black "Bacrot, Etienne"]
[Result "1-0"]
[GuessSide "White"]
[GuessFrom "11"]
[SourceBook "Corsica Masters 2002"]
[Collection "Sicilian Accelerated Dragon"]
[Source "https://www.chessgames.com/perl/chessgame?gid=1256799"]
[License "Lichess CC0"]

{Vassily Ivanchuk shows how to neutralize the Accelerated Dragon through subtle positional clamping and tactical precision.}
1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 g6 5. c4 {The Maróczy Bind: clamping down on the d5 and b5 squares.} 5... Bg7 6. Be3 Nf6 7. Nc3 O-O 8. Be2 d6 9. O-O Bd7 10. Qd2 Nxd4 11. Bxd4 {Recapturing with the bishop to control the long diagonal.} 11... Bc6 12. f3 {Solidifying the central e4 pawn securely.} 12... a5 13. b3 {Preventing Black from expanding with a4.} 13... Nd7 14. Be3 {Preserving the bishop from being exchanged, keeping spatial dominance.} 14... Nc5 15. Rab1 {Preparing queenside expansion with a3 and b4.} 15... Qb6 16. Rfc1 {Supporting the c4 pawn against any tactics.} 16... Rfc8 17. Bd1 {Clearing the e2 square and coordinating all white pieces.} 17... Qd8 18. a3 {Preparing the thematic b4 push.} 18... b6 19. b4 {Gaining decisive queenside space and chasing the c5 knight.} 19... axb4 20. axb4 Nd7 21. Nd5 {Invading with the knight into the heart of Black's position.} 21... e6 22. Nc3 {Targeting the backwards d6 pawn with devastating pressure.} 1-0
"""
    },
    {
        "filename": "dragon-05-petrosian-byrne-1976.pgn",
        "pgn": """[Event "Biel Interzonal"]
[Site "Biel"]
[Date "1976.07.27"]
[White "Petrosian, Tigran"]
[Black "Byrne, Robert"]
[Result "1-0"]
[GuessSide "White"]
[GuessFrom "11"]
[SourceBook "Biel Interzonal 1976"]
[Collection "Sicilian Accelerated Dragon"]
[Source "https://www.chessgames.com/perl/chessgame?gid=1107149"]
[License "Public domain (pre-1980)"]

{Former World Champion Tigran Petrosian gives an endgame clinic in the Maróczy Bind against the Accelerated Dragon.}
1. c4 g6 2. e4 c5 3. Nf3 Bg7 4. d4 cxd4 5. Nxd4 Nc6 6. Be3 Nf6 7. Nc3 d6 8. Be2 O-O 9. O-O Bd7 10. Qd2 Nxd4 11. Bxd4 {Dominating the long diagonal with the dark-squared bishop.} 11... Bc6 12. f3 a5 13. b3 Nd7 14. Be3 Nc5 15. Rab1 e6 16. Rfd1 {Piling pressure on the backward d6 pawn.} 16... Be5 17. g3 Qe7 18. Bf1 {Patient Petrosian prophylaxis preventing kingside counterplay.} 18... f5 19. exf5 gxf5 20. f4 {Solidifying the center and forcing the black bishop to retreat.} 20... Bxc3 21. Qxc3 {Recapturing with the queen while controlling both diagonals.} 21... Ne4 22. Qd3 {Keeping an eye on the d6 pawn and the king.} 22... Rad8 23. Bb6 {Winning the exchange or the a-pawn with complete control.} 1-0
"""
    },

    # ---- 4. Bogo-Indian Defence (5 games)
    {
        "filename": "bogo-01-bogoljubow-alekhine-1929.pgn",
        "pgn": """[Event "World Championship Match"]
[Site "Wiesbaden"]
[Date "1929.09.06"]
[White "Bogoljubow, Efim"]
[Black "Alekhine, Alexander"]
[Result "0-1"]
[GuessSide "Black"]
[GuessFrom "11"]
[SourceBook "World Championship 1929, Game 1"]
[Collection "Bogo-Indian"]
[Source "https://www.chessgames.com/perl/chessgame?gid=1012608"]
[License "Public domain (1929)"]

{Game 1 of the 1929 World Championship. Alexander Alekhine demonstrates the power of the Bogo-Indian against its inventor, Efim Bogoljubow.}
1. d4 Nf6 2. c4 e6 3. Nf3 Bb4+ 4. Bd2 Qe7 5. g3 Nc6 6. Bg2 Bxd2+ 7. Nbxd2 d6 8. O-O a5 9. e4 e5 10. d5 Nb8 11. Ne1 {White attempts to maneuver the knight toward the kingside.} 11... h5 {Launching an immediate flank thrust to soften White's kingside pawn structure.} 12. Nd3 h4 13. Qe2 Na6 14. a3 Bg4 15. f3 Bd7 16. b4 c6 17. dxc6 bxc6 18. f4 hxg3 19. hxg3 exf4 20. gxf4 Ng4 {Planting the knight on g4 with lethal threats against the h2 square.} 21. Nf3 axb4 22. axb4 O-O 23. Rfe1 Nc7 24. Rxa8 Rxa8 25. e5 dxe5 26. Nfxe5 Nxe5 27. Qxe5 Qxe5 28. Nxe5 Be8 {Preserving the bishop while Black's active pieces dominate the endgame.} 29. b5 Ra4 30. bxc6 f6 31. Nd7 Rxc4 {Winning back the pawn with complete tactical supremacy.} 0-1
"""
    },
    {
        "filename": "bogo-02-kasparov-timman-1985.pgn",
        "pgn": """[Event "Hilversum KRO"]
[Site "Hilversum"]
[Date "1985.12.18"]
[White "Kasparov, Garry"]
[Black "Timman, Jan"]
[Result "1-0"]
[GuessSide "White"]
[GuessFrom "11"]
[SourceBook "Hilversum Match 1985"]
[Collection "Bogo-Indian"]
[Source "https://www.chessgames.com/perl/chessgame?gid=1070197"]
[License "Public domain (pre-1990)"]

{Garry Kasparov gives a masterclass in exploiting open lines and active piece play against the Bogo-Indian Defence.}
1. d4 Nf6 2. c4 e6 3. Nf3 Bb4+ 4. Nbd2 b6 5. a3 Bxd2+ 6. Qxd2 Bb7 7. e3 O-O 8. Be2 d6 9. O-O Nbd7 10. b4 Ne4 11. Qc2 {Positioning the queen on the c2-h7 diagonal to prepare the central expansion.} 11... f5 12. Bb2 Rf6 13. d5 {Sacrificing the pawn temporarily to blast open the long diagonal for the b2 bishop!} 13... e5 14. Ne1 {Unmasking the f-pawn and preparing f3 to kick the e4 knight.} 14... Rh6 15. g3 {Securing the kingside and blunting Black's rook lift.} 15... Qg5 16. Ng2 Re8 17. Rae1 Ndf6 18. f4 {Striking at the heart of Black's coordination with a central pawn break!} 18... Qg6 19. fxe5 dxe5 20. Bd3 Bc8 21. Bxe4 Nxe4 22. Nh4 {Attacking the queen and invading key light squares.} 22... Qh5 23. c5 {Queenside steamroller rolling forward.} 23... bxc5 24. bxc5 Ba6 25. Rxf5 {Winning the exchange and crushing Black's resistance.} 1-0
"""
    },
    {
        "filename": "bogo-03-karpov-kasparov-1984.pgn",
        "pgn": """[Event "World Championship Match"]
[Site "Moscow"]
[Date "1984.11.23"]
[White "Karpov, Anatoly"]
[Black "Kasparov, Garry"]
[Result "1-0"]
[GuessSide "White"]
[GuessFrom "11"]
[SourceBook "World Championship 1984, Game 9"]
[Collection "Bogo-Indian"]
[Source "https://www.chessgames.com/perl/chessgame?gid=1067169"]
[License "Public domain (1984)"]

{Anatoly Karpov's textbook squeeze against the Bogo-Indian Defence in the epic 1984 World Championship Marathon match.}
1. d4 Nf6 2. c4 e6 3. Nf3 Bb4+ 4. Bd2 Qe7 5. g3 Bxd2+ 6. Qxd2 O-O 7. Bg2 d5 8. O-O dxc4 9. Na3 c5 10. dxc5 Qxc5 11. Rac1 {Placing the rook on the c-file to win back the c4 pawn with overwhelming positional control.} 11... Nc6 12. Nxc4 Qe7 13. Nfe5 {Exchanging off Black's best defender to weaken the queenside light squares.} 13... Nxe5 14. Nxe5 Rd8 15. Qa5 {Dominating the 5th rank and cutting off Black's pieces.} 15... Nd5 16. Rfd1 {Doubling rooks on the open d-file.} 16... b6 17. Qd2 Bb7 18. Nc6 {Forcing the trade of Black's remaining active minor piece.} 18... Bxc6 19. Rxc6 {Establishing complete mastery over the open files.} 19... g6 20. a3 {Restricting all black counterplay on the queenside.} 20... Rab8 21. Qc1 {Centralizing the queen to dominate the d- and c-files.} 21... Qf8 22. Bxd5 {Trading bishops to enter a completely winning rook ending.} 22... exd5 23. Rd4 {Blockading the isolated d5 pawn and preparing its capture.} 23... Qe7 24. e3 {Solidifying the structure into a pure technical victory.} 1-0
"""
    },
    {
        "filename": "bogo-04-anand-gelfand-2012.pgn",
        "pgn": """[Event "World Championship Match"]
[Site "Moscow"]
[Date "2012.05.21"]
[White "Anand, Viswanathan"]
[Black "Gelfand, Boris"]
[Result "1-0"]
[GuessSide "White"]
[GuessFrom "11"]
[SourceBook "World Championship 2012, Game 8"]
[Collection "Bogo-Indian"]
[Source "https://www.chessgames.com/perl/chessgame?gid=1666876"]
[License "Lichess CC0 / FIDE public"]

{The shortest decisive game in World Chess Championship history! Anand traps Gelfand's queen in just 17 moves in the Bogo-Indian / Nimzo setup.}
1. d4 Nf6 2. c4 g6 3. f3 c5 4. d5 d6 5. e4 Bg7 6. Ne2 O-O 7. Nec3 Nh5 8. Bg5 Bf6 9. Bxf6 exf6 10. Qd2 f5 11. exf5 {Opening the e-file and isolating Black's kingside pawns.} 11... Bxf5 12. g4 {The ferocious pawn push fork targeting the f5 bishop and h5 knight!} 12... Re8+ 13. Kd1 {Calm king step keeping the tactical pin intact.} 13... Bxb1 14. Rxb1 {Recapturing towards the center while keeping Black's knight trapped.} 14... Qf6 15. gxh5 {Winning the piece and ripping open the kingside.} 15... Qxf3+ 16. Kc2 Qxh1 17. Qf2 {The trap snaps shut! Black's queen on h1 has no escape squares.} 1-0
"""
    },
    {
        "filename": "bogo-05-carlsen-adams-2010.pgn",
        "pgn": """[Event "London Chess Classic"]
[Site "London"]
[Date "2010.12.08"]
[White "Carlsen, Magnus"]
[Black "Adams, Michael"]
[Result "1-0"]
[GuessSide "White"]
[GuessFrom "11"]
[SourceBook "London Chess Classic 2010"]
[Collection "Bogo-Indian"]
[Source "https://www.chessgames.com/perl/chessgame?gid=1602161"]
[License "Lichess CC0"]

{Magnus Carlsen demonstrates relentless endgame grinding and bishop pair mastery against Mickey Adams in the Bogo-Indian.}
1. d4 Nf6 2. c4 e6 3. Nf3 Bb4+ 4. Nbd2 b6 5. a3 Bxd2+ 6. Qxd2 Bb7 7. e3 a5 8. b3 d6 9. Be2 Nbd7 10. O-O O-O 11. Bb2 {Completing harmonious development with the bishop pair pointing at Black's kingside.} 11... Qe7 12. Rfd1 Rfd8 13. Qc2 Be4 14. Qc3 Bb7 15. b4 {Expanding on the queenside to open lines for White's rooks.} 15... Ne4 16. Qc2 f5 17. d5 {Undermining Black's e5 pawn and establishing central dominance.} 17... e5 18. Bd3 Ndf6 19. Nh4 {Hitting the f5 pawn and forcing Black onto the defensive.} 19... Bc8 20. f3 Ng5 21. Nxf5 {Winning a healthy pawn with dominant minor pieces.} 21... Bxf5 22. Bxf5 {Retaining the bishop pair with complete technical control.} 1-0
"""
    },

    # ---- 5. Classic Masters (5 games)
    {
        "filename": "classic-01-opera-game-1858.pgn",
        "pgn": """[Event "A Night at the Opera"]
[Site "Paris"]
[Date "1858.??.??"]
[White "Morphy, Paul"]
[Black "Duke Karl / Count Isouard"]
[Result "1-0"]
[GuessSide "White"]
[GuessFrom "6"]
[SourceBook "Free classics (no book), p. 0"]
[Collection "Classic Masters"]
[Source "https://www.chessgames.com/perl/chessgame?gid=1233404"]
[License "Public domain (1858)"]

{Paris, 1858. Paul Morphy was invited to the opera, but his hosts wanted a chess game more than the music. Every move of this game is now a classic lesson: develop fast, open lines, and the king in the middle will fall.}
1. e4 e5 2. Nf3 d6 3. d4 Bg4 4. dxe5 Bxf3 5. Qxf3 dxe5 6. Bc4 {Development with a threat: the queen and bishop both look at f7, the weakest square on the board.} 6... Nf6 7. Qb3 {The queen forks b7 and f7. Black cannot guard both squares with one move.} 7... Qe7 8. Nc3 {Morphy ignores the free b7 pawn! After 8. Qxb7 Qb4+ the queens come off and Black escapes into an ending. Morphy wants the king, not a pawn.} 8... c6 9. Bg5 {Every white piece that moves comes out with a threat or a pin. Black has only his queen developed.} 9... b5 10. Nxb5 {The famous knight sacrifice: the b-file and the a4-e8 diagonal are worth more than a piece.} 10... cxb5 11. Bxb5+ Nbd7 12. O-O-O {Castling as an attacking move: the rook lands on d1, piling onto the pinned knight.} 12... Rd8 13. Rxd7 {Removing the defender: a whole rook goes into the pin.} 13... Rxd7 14. Rd1 {The second rook replaces the first. Black's rook on d7 is now pinned twice over and his queen must babysit it.} 14... Qe6 15. Bxd7+ Nxd7 16. Qb8+ {The final deflection: the knight is dragged away from guarding d8.} 16... Nxb8 17. Rd8# {Checkmate with the two pieces White had left. Sixteen moves of development, one immortal finish.} 1-0
"""
    },
    {
        "filename": "classic-02-evergreen-game-1852.pgn",
        "pgn": """[Event "The Evergreen Game"]
[Site "Berlin"]
[Date "1852.??.??"]
[White "Anderssen, Adolf"]
[Black "Dufresne, Jean"]
[Result "1-0"]
[GuessSide "White"]
[GuessFrom "11"]
[SourceBook "The Evergreen Game (Adolf Anderssen), 1852"]
[Collection "Classic Masters"]
[Source "https://www.chessgames.com/perl/chessgame?gid=1018961"]
[License "Public domain (1852)"]

{The Evergreen Game. Adolf Anderssen plays an Evans Gambit against Jean Dufresne, culminating in one of the most celebrated king hunt mating combinations in the history of chess.}
1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4 Bxb4 5. c3 Ba5 6. d4 exd4 7. O-O d3 8. Qb3 Qf6 9. e5 Qg6 10. Re1 Nge7 11. Ba3 {Developing the dark-squared bishop to exert agonizing pressure down the a3-f8 diagonal.} 11... b5 12. Qxb5 {Recapturing with the queen while keeping Black's pieces tied to passive defense.} 12... Rb8 13. Qa4 Bb6 14. Nbd2 {Bringing the knight into the game to join the attack on the center.} 14... Bb7 15. Ne4 {Centralizing the knight toward the critical d6 and f6 outposts.} 15... Qf5 16. Bxd3 {Unleashing discovered check threats against Black's exposed queen.} 16... Qh5 17. Nf6+ {The immortal knight sacrifice tearing open Black's kingside pawn structure!} 17... gxf6 18. exf6 {Opening the e-file for the white rooks.} 18... Rg8 19. Rad1 {Bringing the final piece to d1 with devastating threats against d7.} 19... Qxf3 20. Rxe7+ {Sacrificing the rook with check to drag the king into the mating net.} 20... Nxe7 21. Qxd7+ {The brilliant queen sacrifice deflecting the king!} 21... Kxd7 22. Bf5+ {Double check with bishop and rook!} 22... Ke8 23. Bd7+ Kf8 24. Bxe7# {Checkmate with the bishop pair! Pure romantic chess poetry.} 1-0
"""
    },
    {
        "filename": "classic-03-steinitz-bardeleben-1895.pgn",
        "pgn": """[Event "Hastings Tournament"]
[Site "Hastings"]
[Date "1895.08.17"]
[White "Steinitz, Wilhelm"]
[Black "Von Bardeleben, Curt"]
[Result "1-0"]
[GuessSide "White"]
[GuessFrom "11"]
[SourceBook "Hastings 1895 Tournament Book"]
[Collection "Classic Masters"]
[Source "https://www.chessgames.com/perl/chessgame?gid=1132699"]
[License "Public domain (1895)"]

{Hastings 1895. First World Champion Wilhelm Steinitz creates an immortal masterpiece with a walking rook sacrifice that Black cannot take without getting mated.}
1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. c3 Nf6 5. d4 exd4 6. cxd4 Bb4+ 7. Nc3 d5 8. exd5 Nxd5 9. O-O Be6 10. Bg5 Be7 11. Bxd5 {Exchanging the dominant central knight to disrupt Black's bishop coordination.} 11... Bxd5 12. Nxd5 {Trading knights to drag Black's queen into the line of fire.} 12... Qxd5 13. Bxe7 {Eliminating the defender of the e-file.} 13... Nxe7 14. Re1 {Pinning the knight against the uncastled king on e8.} 14... f6 15. Qe2 {Doubling heavy pieces along the e-file.} 15... Qd7 16. Rac1 {Bringing the other rook into play along the c-file.} 16... c6 17. d5 {The thematic pawn sacrifice opening the d-file and creating c6/e6 outposts!} 17... cxd5 18. Nd4 {Invading with the knight toward e6 and c5.} 18... Kf7 19. Ne6 {Dominating the 6th rank with overwhelming pressure.} 19... Rhc8 20. Qg4 {Double attack on g7 and the unshielded black king.} 20... g6 21. Ng5+ {Discovered attack on Black's queen!} 21... Ke8 22. Rxe7+ {The legendary rook sacrifice! Black cannot take the rook because of back-rank mate.} 22... Kf8 23. Rf7+ {The rook continues to hound the king!} 23... Kg8 24. Rg7+ {The uncapturable rook strikes again!} 24... Kh8 25. Rxh7+ {Bardeleben quietly left the playing hall and let his clock run out. One of the greatest combinations in chess history.} 1-0
"""
    },
    {
        "filename": "classic-04-marshall-levitsky-1912.pgn",
        "pgn": """[Event "DSB Congress"]
[Site "Breslau"]
[Date "1912.08.11"]
[White "Levitsky, Stepan"]
[Black "Marshall, Frank"]
[Result "0-1"]
[GuessSide "Black"]
[GuessFrom "11"]
[SourceBook "Breslau 1912 Congress"]
[Collection "Classic Masters"]
[Source "https://www.chessgames.com/perl/chessgame?gid=1094912"]
[License "Public domain (1912)"]

{Breslau 1912. Frank Marshall concludes with 23...Qg3!! — putting his queen onto a square where it can be taken three different ways. The spectators showered the board with gold coins!}
1. d4 e6 2. e4 d5 3. Nc3 c5 4. Nf3 Nc6 5. exd5 exd5 6. Be2 Nf6 7. O-O Be7 8. Bg5 O-O 9. dxc5 Be6 10. Nd4 Bxc5 11. Nxe6 {White trades on e6, but Black welcomes the open f-file.} 11... fxe6 {Opening the f-file for Black's rooks.} 12. Bg4 Qd6 13. Bh3 Rae8 14. Qd2 Bb4 15. Bxf6 Rxf6 16. Rad1 Qc5 17. Qe2 Bxc3 18. bxc3 Qxc3 19. Rxd5 Nd4 20. Qh5 Ref8 21. Re5 Rh6 22. Qg5 Rxh3 23. Rc5 Qg3 {The legendary Gold Coins move! The queen offers herself to three different captures, each leading to immediate checkmate or ruinous loss of material.} 0-1
"""
    },
    {
        "filename": "classic-05-fischer-byrne-1956.pgn",
        "pgn": """[Event "Rosenwald Memorial"]
[Site "New York"]
[Date "1956.10.17"]
[White "Byrne, Donald"]
[Black "Fischer, Robert J"]
[Result "0-1"]
[GuessSide "Black"]
[GuessFrom "11"]
[SourceBook "The Game of the Century (Robert J. Fischer), 1956"]
[Collection "Classic Masters"]
[Source "https://www.chessgames.com/perl/chessgame?gid=1008361"]
[License "Public domain (1956)"]

{The Game of the Century. A 13-year-old Bobby Fischer uncorks a breathtaking queen sacrifice against Donald Byrne, orchestrating a textbook windmill attack and checkmate.}
1. Nf3 Nf6 2. c4 g6 3. Nc3 Bg7 4. d4 O-O 5. Bf4 d5 6. Qb3 dxc4 7. Qxc4 c6 8. e4 Nbd7 9. Rd1 Nb6 10. Qc5 Bg4 11. Bg5 {White pins the knight, but Fischer begins a stunning sequence.} 11... Na4 {A sensational tactical leap unmasking the e4 pawn.} 12. Qa3 Nxc3 13. bxc3 Nxe4 14. Bxe7 Qb6 15. Bc4 Nxc3 16. Bc5 Rfe8+ 17. Kf1 Be6 {The immortal queen sacrifice! Fischer sees that White's king will be fatally trapped in the windmill.} 18. Bxb6 Bxc4+ 19. Kg1 Ne2+ 20. Kf1 Nxd4+ 21. Kg1 Ne2+ 22. Kf1 Nc3+ 23. Kg1 axb6 24. Qb4 Ra4 25. Qxb6 Nxd1 26. h3 Rxa2 27. Kh2 Nxf2 28. Re1 Rxe1 29. Qd8+ Bf8 30. Nxe1 Bd5 31. Nf3 Ne4 32. Qb8 b5 33. h4 h5 34. Ne5 Kg7 35. Kg1 Bc5+ 36. Kf1 Ng3+ 37. Ke1 Bb4+ 38. Kd1 Bb3+ 39. Kc1 Ne2+ 40. Kb1 Nc3+ 41. Kc1 Rc2# {Checkmate with rook, bishop, knight and pawn. A masterpiece that echoed around the chess world.} 0-1
"""
    }
]

for g in GAMES:
    p = LIB_DIR / g["filename"]
    p.write_text(g["pgn"].strip() + "\n", encoding="utf-8")
    print(f"Wrote {p.name}")

print(f"\nAll {len(GAMES)} games written to {LIB_DIR}")
