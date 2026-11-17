// utils/quizLang.js: which language a quest's screens speak (owner 17 Nov 2026: Hindi learners need Hindi buttons).
// A quest says so in its data (quest.lang, e.g. आओ जानें = "hi"); otherwise the text decides (utils/uiLabels.js).
import { bundledQuest } from "../data/quests/index.js";
import { langOf } from "./uiLabels.js";

export function quizLang({ questId = null, texts = [] } = {}) {
  const fromQuest = questId ? bundledQuest(questId)?.quest?.lang : null;
  return fromQuest || langOf(texts);
}
