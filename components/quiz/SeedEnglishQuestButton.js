// components/quiz/SeedEnglishQuestButton.js
// Seeds English Quest. The logic is shared by every tile quest: components/quiz/SeedTileQuestButton.js.

import React from "react";
import SeedTileQuestButton from "./SeedTileQuestButton";
import * as EnglishQuest from "../../data/englishQuestData";

export default function SeedEnglishQuestButton() {
  return <SeedTileQuestButton data={EnglishQuest} />;
}
