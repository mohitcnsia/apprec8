# scripts/wordPower/compile_word_details.py
import json

from scripts.wordPower.part1_data import ANIMALS, FOOD, PLANTS, SCHOOL
from scripts.wordPower.part2_data import ACTIONS_CHANGE, STATES_BEING, CHARACTER_ACTION, CONFLICT_QUALITIES
from scripts.wordPower.part3_data import DESCRIBING_EFFORT, DETAILS_CONSEQUENCES, FEELINGS_QUALITY, FINAL_WORDS
from scripts.wordPower.part4_data import GROUPS_BEHAVIORS, IMPORTANCE_METHOD, MORE_ACTIONS_QUALITIES, SPEAKING_SIZE, THINKING_SITUATIONS
from scripts.wordPower.stories_data import STORIES

word_details = {}
for g in [
    ANIMALS, FOOD, PLANTS, SCHOOL,
    ACTIONS_CHANGE, STATES_BEING, CHARACTER_ACTION, CONFLICT_QUALITIES,
    DESCRIBING_EFFORT, DETAILS_CONSEQUENCES, FEELINGS_QUALITY, FINAL_WORDS,
    GROUPS_BEHAVIORS, IMPORTANCE_METHOD, MORE_ACTIONS_QUALITIES, SPEAKING_SIZE, THINKING_SITUATIONS
]:
    word_details.update(g)

print(f"Total word details compiled: {len(word_details)}")
assert len(word_details) == 370, f"Expected 370 words, got {len(word_details)}"

out_path = "data/wordPower/wordDetails.js"

lines = [
    "// data/wordPower/wordDetails.js",
    "// Enriched dictionary metadata for all 370 words in data/wordPower/wordBank.js.",
    "// Includes natural kid-safe examples, selective single-word synonyms/antonyms (or null),",
    "// 2 near-miss confusable spellings, and 17 original 120-180 word stories (>=8 group words each).",
    "// Task G111 Step 1 (owner YES 14 Nov 2026).",
    "",
    "export const WORD_DETAILS = " + json.dumps(word_details, indent=2) + ";",
    "",
    "export const GROUP_STORIES = " + json.dumps(STORIES, indent=2) + ";",
    ""
]

with open(out_path, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print(f"Successfully generated {out_path} ({len(lines)} lines)")
