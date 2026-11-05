// utils/oldContent.js
// Old (V1) content tiles: hidden for everyone except the owner (Seema's feedback 2026-11-05: "looks ugly"), apart
// from Pratha's favourites (dogs, animals), which stay for everyone until they move to the new style. Nothing is
// deleted; English Quest Unit 1 still uses some old quizzes inside the quest.

export const FAVOURITES = /\b(dogs?|puppy|puppies|german shepherds?|animals?|animal kingdom)\b/i;

/** Old tiles this person sees. */
export function visibleOldTiles(tiles = [], { isAdmin = false } = {}) {
  if (isAdmin) return tiles;
  return tiles.filter((t) => FAVOURITES.test(`${t?.title || ""} ${t?.subtitle || ""}`));
}

/** The old Space quest map (legacy look): owner only for now. */
export const showOldSpace = ({ isAdmin = false } = {}) => isAdmin;
