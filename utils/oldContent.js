// utils/oldContent.js
// Old (V1) content tiles: hidden for everyone except the owner (Seema's feedback 2026-11-05: "looks ugly"). The dog
// and animal quizzes are hidden too (owner, 2026-11-06): they come back as exploration quests (Dog Squad plan).
// Nothing is deleted; English Quest Unit 1 still uses some old quizzes inside the quest.

/** Old tiles this person sees: all for the owner, none for anyone else. */
export function visibleOldTiles(tiles = [], { isAdmin = false } = {}) {
  return isAdmin ? tiles : [];
}

/** The old Space quest map (legacy look): owner only for now. */
export const showOldSpace = ({ isAdmin = false } = {}) => isAdmin;
