// utils/openCategory.js
// Opens a content tile (a `categories` doc) by its type. Shared by the carousels and the new
// Home / Fun tiles, so every tile behaves the same. The target screens must be in the current stack.

export function openCategory(navigation, item) {
  if (!item || !item.id) {
    console.warn("openCategory: no item or item.id");
    return;
  }
  switch (item.type?.toUpperCase()) {
    case "STUDY":
      navigation.push("Apprec8Reader", { contentId: item.id });
      break;
    case "QUIZ":
      navigation.push("Quiz", { quizContentId: item.id });
      break;
    case "CLOCK":
      navigation.push("ClockPracticeGenerator", {});
      break;
    case "SUDOKU":
      navigation.push("SudokuGame", {});
      break;
    case "MINESWEEPER":
      navigation.push("Minesweeper", {});
      break;
    case "VOCAB_BUILDER":
      navigation.push("VocabBuilder", {});
      break;
    case "SPELLBEE":
      navigation.navigate("SpellingBeeGame", {});
      break;
    case "QUEST":
      // Tile-based quest (e.g. English Quest). The category id is the quest id unless it sets `questId`.
      // navigate (not push) so a double tap doesn't stack two intro screens.
      navigation.navigate("EnglishQuestIntro", { questId: item.questId || item.id });
      break;
    case "COURSE":
      // A teacher's course built as a tile quest (e.g. Seema Ma'am · Class 10 English, G81) opens like a quest. Walk on
      // the owner's phone, 12 Nov: it opened the old category screen ("No items found for this section").
      if (item.questId) {
        navigation.navigate("EnglishQuestIntro", { questId: item.questId });
        break;
      }
    // falls through: old courses (no questId) keep the old screen
    case "COMPLEX":
    case "ACTIVITY":
      navigation.push("LinkScreen", { categoryId: item.id, categoryTitle: item.title });
      break;
    default:
      console.warn(`openCategory: unhandled type ${item.type} for ${item.id}`);
      navigation.navigate("DummyScreen", {
        errorMessage: `Action for "${item.title || "this item"}" of type "${item.type}" is not yet defined.`,
      });
      break;
  }
}
