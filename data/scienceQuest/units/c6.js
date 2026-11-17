// data/scienceQuest/units/c6.js: Science for Class 6 (owner 17 Nov 2026: ISO science exam, Level 1 on 3 Dec). One topic per
// chapter of the Class 6 book (NCERT "Curiosity", 2024), each a Learn page (idea cards + a check) and 8 practice questions.
// Every topic is open from the start (openTopics), so a kid can go straight to the chapter they need. Plan doc:
// https://claude.ai/artifact/5GrheovRHncDQhzQe1bski
// Split (plan doc): Claude writes chapters 1–8 here; Gemini drafts chapters 9–12 in c6b.js (G126), Claude checks them.
// Papers and the SOF books are a guide to coverage and level only: every question is original.
// Quality rules: 4 options, a why-not on every wrong option, at least one near miss, exactly one defensible answer.
import { q, study, quiz, unit, main, forGrades } from "../../englishQuest/helpers.js";

export const C6 = [6];
// Units shared with c6b.js (Gemini's chapters join these units, after Claude's topics).
export const C6_UNITS = {
  living: forGrades(unit("sq6-u1", 7.5, "Living World & Health", { openTopics: true }), C6),
  materials: forGrades(unit("sq6-u2", 7.6, "Materials & Water", { openTopics: true }), C6),
  measure: forGrades(unit("sq6-u3", 7.7, "Magnets, Measuring & Space", { openTopics: true }), C6),
};
/** A Class 6 topic: Learn page `<id>-study` + 8 questions `<id>-quiz`. */
export const topic6 = (id, u, order, title) => forGrades(main(id, u.id, order, title, [study(`${id}-study`), quiz(`${id}-quiz`)]), C6);

/** A Learn page: idea cards [emoji, title, text (≤ 40 words), examples[]] + 1 check card (4 options), and a plain page for old app versions. */
export const page6 = (name, cards, check) => ({
  name,
  author: "Apprec8",
  cards: [...cards.map(([emoji, title, text, examples]) => ({ emoji, title, text, examples })), { kind: "check", ...check }],
  content: cards.map(([emoji, title, text, examples]) => `### ${emoji} ${title}\n\n${text}\n\n${examples.map((e) => `- ${e}`).join("\n")}`).join("\n\n"),
});

const { living, materials, measure } = C6_UNITS;

// Mistake tags (Class 6): method-step-mixup, observation-guess-mixup, fair-test-mixup, plant-type-mixup, venation-root-mixup,
// seed-leaf-mixup, habitat-adaptation-mixup, biodiversity-mixup, nutrient-role-mixup, food-test-mixup, deficiency-mixup,
// balanced-diet-mixup, magnetic-material-mixup, pole-rule-mixup, compass-mixup, magnet-care-mixup, length-unit-mixup,
// scale-reading-mixup, motion-type-mixup, reference-point-mixup, material-property-mixup, transparency-mixup,
// solubility-mixup, float-sink-mixup, temperature-scale-mixup, thermometer-type-mixup, thermometer-use-mixup,
// touch-temperature-mixup, state-change-mixup, evaporation-factor-mixup, condensation-mixup, water-cycle-mixup
const science = topic6("sq6-science", living, 1, "The World of Science");
const diversity = topic6("sq6-diversity", living, 2, "Diversity in the Living World");
const eating = topic6("sq6-eating", living, 3, "Mindful Eating");
const magnets = topic6("sq6-magnets", measure, 1, "Exploring Magnets");

export default {
  studyPages: {
    "sq6-science-study": page6(
      "The World of Science",
      [
        ["🔭", "Science is a way of finding out", "Science is not just facts in a book. It is a careful way of finding out how the world works: by looking closely, asking questions and testing ideas.", ["Curiosity starts it: \"Why does this happen?\"", "Anyone can think like a scientist, at home or at school", "Science keeps changing when new evidence turns up"]],
        ["🔍", "Observe and ask", "An observation is something you notice with your senses or instruments. A good question comes from it and can be tested.", ["Observation: the plant near the window leans towards it", "Question: does light make the plant bend?", "\"Plants are nice\" is an opinion, not an observation"]],
        ["🧪", "Guess, then test", "A hypothesis is a sensible guess you can test. An experiment tests it fairly: change only one thing and keep everything else the same.", ["Guess: plants bend towards light", "Test: two same plants, one near light, one in a box", "Same pot, soil and water for both: a fair test"]],
        ["📝", "Conclude and share", "Look at the results and decide whether they support your guess. Write them down so others can repeat the test and check.", ["Results that don't match the guess are useful too", "Repeat the test to be sure", "Scientists share results so others can check them"]],
      ],
      { question: "What should you do first when you notice something puzzling?", answer: "Observe carefully and ask a question", wrong: ["Write the conclusion at once", "Change many things together", "Ignore it if it seems odd"], explain: "Science starts with careful observation and a question you can test." }
    ),
    "sq6-diversity-study": page6(
      "Diversity in the Living World",
      [
        ["🌿", "Herbs, shrubs and trees", "Plants are grouped by their stems. Herbs have soft green stems, shrubs have hard woody stems branching near the ground, and trees have one thick woody trunk.", ["Herbs: tomato, wheat, mint", "Shrubs: rose, hibiscus (gudhal), tulsi", "Trees: mango, neem, peepal", "Climbers (money plant) and creepers (pumpkin) need support or spread on the ground"]],
        ["🍃", "Leaves and roots go together", "Leaf veins show a pattern. Net-like veins (reticulate) usually go with a taproot. Parallel veins usually go with fibrous roots.", ["Reticulate + taproot: mango, mustard, rose", "Parallel + fibrous roots: grass, wheat, maize, banana", "Taproot: one main root with side roots", "Fibrous roots: many thin roots of similar size"]],
        ["🌱", "One or two seed leaves", "Seeds have seed leaves (cotyledons). Plants with two are dicots; plants with one are monocots.", ["Dicots: gram, pea, bean (seed splits into two halves)", "Monocots: maize, wheat, rice", "Monocots usually have parallel veins and fibrous roots"]],
        ["🐪", "Living things fit where they live", "Animals and plants have features that suit their habitat. The variety of living things in a place is its biodiversity, and we must protect it.", ["Camel: long legs, wide feet for sand, stores fat in its hump", "Fish: gills and a streamlined body for water", "Yak: long thick hair for the cold mountains", "Habitat loss and pollution reduce biodiversity"]],
      ],
      { question: "A plant has parallel veins in its leaves. What roots will it most likely have?", answer: "Fibrous roots", wrong: ["A taproot", "No roots at all", "Roots only above the ground"], explain: "Parallel veins usually go with fibrous roots, as in grass and wheat." }
    ),
    "sq6-eating-study": page6(
      "Mindful Eating",
      [
        ["🍚", "What food is made of", "Food contains nutrients: carbohydrates and fats give energy, proteins build and repair the body, and vitamins and minerals keep us healthy. Fibre (roughage) and water are needed too.", ["Carbohydrates: rice, wheat, potato, millets", "Proteins: dal, milk, eggs, paneer", "Fats: ghee, oil, butter, nuts", "Fibre: fruits, vegetables, whole grains"]],
        ["🧪", "Testing food", "Simple tests show which nutrients a food has.", ["Starch: a few drops of iodine turn it blue-black", "Protein: copper sulphate + sodium hydroxide give a violet colour", "Fat: rubbed on paper it leaves an oily patch you can see through", "Do tests with an adult; some chemicals are harmful"]],
        ["⚠️", "Too little of a nutrient", "Missing a nutrient for a long time causes a deficiency disease. A varied diet prevents most of them.", ["Vitamin A: night blindness", "Vitamin C: scurvy (bleeding gums)", "Vitamin D: rickets (soft, bent bones)", "Iodine: goitre · Iron: anaemia"]],
        ["🥗", "Eating mindfully", "A balanced diet has every nutrient in the right amount. Mindful eating means eating slowly, noticing when you are full and choosing fresh food over junk food.", ["Millets (Shree Anna) like ragi and bajra are very nutritious", "Junk food has lots of fat, sugar or salt and little else", "Different regions of India have their own healthy foods"]],
      ],
      { question: "Iodine turns a food blue-black. What does the food contain?", answer: "Starch", wrong: ["Protein", "Fat", "Vitamin C"], explain: "Iodine gives a blue-black colour with starch." }
    ),
    "sq6-magnets-study": page6(
      "Exploring Magnets",
      [
        ["🧲", "What magnets attract", "Magnets attract magnetic materials such as iron, nickel and cobalt. Wood, plastic, glass, paper, aluminium and copper are non-magnetic.", ["A steel pin sticks (steel is mostly iron)", "A copper coin or aluminium foil does not", "Natural magnet: a rock called magnetite (lodestone)"]],
        ["↔️", "Two poles", "Every magnet has a north pole and a south pole. Its attraction is strongest at the poles. Breaking a magnet gives two smaller magnets, each with two poles.", ["Like poles (N–N, S–S) repel", "Unlike poles (N–S) attract", "Only another magnet can repel a magnet"]],
        ["🧭", "Magnets find direction", "A magnet hung freely always comes to rest pointing north–south. A compass uses a small magnetic needle to show directions.", ["The end pointing north is the north pole", "Sailors used compasses to find their way", "Keep a compass away from magnets and iron"]],
        ["🛠️", "Making and caring for magnets", "Stroking an iron nail many times in one direction with one pole of a magnet makes it a magnet. Magnets lose their magnetism if heated, hammered or dropped.", ["Store bar magnets in pairs, unlike poles side by side, with keepers", "Keep magnets away from phones and cards", "Magnets are used in fridge doors, speakers and toys"]],
      ],
      { question: "Which is the surest test that an iron bar is a magnet?", answer: "It repels one pole of another magnet", wrong: ["It attracts a magnet", "It is shiny and heavy", "It is heavier than a wooden bar"], explain: "Plain iron is also attracted by a magnet. Only a magnet can repel a magnet." }
    ),
  },
  quizzes: {
    "sq6-science-quiz": [
      q("Rohan notices that the plant on his windowsill leans towards the window. This is…", "An observation", [["A conclusion", "observation-guess-mixup", "A conclusion comes only after testing."], ["A hypothesis", "observation-guess-mixup", "A hypothesis is a guess about why; noticing the lean is an observation."], ["An opinion", "observation-guess-mixup", "An opinion is what someone likes or thinks; the lean is seen by anyone."]], "Noticing something with your senses is an observation. It leads to questions."),
      q("Which of these is a hypothesis that can be tested?", "Plants grow taller when they get more sunlight", [["Plants are the most beautiful living things", "observation-guess-mixup", "That is an opinion; no experiment can test it."], ["My plant is 12 cm tall today", "observation-guess-mixup", "That is a measurement (an observation), not a guess."], ["Science is my favourite subject", "observation-guess-mixup", "That is a personal choice, not something to test."]], "A hypothesis is a sensible guess that an experiment can check."),
      q("Asha tests whether salt makes water boil faster. What makes her test fair?", "Same pot, same water amount, same flame; only salt differs", [["Using a bigger pot for the salty water", "fair-test-mixup", "Changing the pot too means she can't tell what caused the difference."], ["Adding salt to both pots", "fair-test-mixup", "Then nothing is being compared."], ["Testing each pot on different days", "fair-test-mixup", "Room temperature may change; keep everything the same except salt."]], "In a fair test you change only ONE thing and keep everything else the same."),
      q("Put the steps of finding out in order.", "Observe → question → hypothesis → experiment → conclusion", [["Hypothesis → observe → conclusion → experiment → question", "method-step-mixup", "You can't conclude before you experiment."], ["Experiment → observe → question → conclusion → hypothesis", "method-step-mixup", "The guess comes before the test, not after the conclusion."], ["Question → conclusion → observe → hypothesis → experiment", "method-step-mixup", "A conclusion needs results first."]], "Notice, ask, guess, test, then decide."),
      q("An experiment's result does not match the hypothesis. What should a scientist do?", "Accept the result and think of a new idea to test", [["Change the result so it matches", "method-step-mixup", "Changing results is cheating; it stops science working."], ["Throw away the notes and forget it", "method-step-mixup", "Unexpected results teach us something."], ["Repeat it until it matches, then report only that", "method-step-mixup", "Repeating is good, but hiding the other results is dishonest."]], "Results that disagree with a guess are useful: they show the guess needs changing."),
      q("Why do scientists write down and share their results?", "So others can repeat the test and check it", [["So nobody else can test the same thing", "method-step-mixup", "The opposite: sharing lets others test it too."], ["Because results never change afterwards", "method-step-mixup", "Ideas can change when new evidence comes."], ["To prove that their first guess was right", "method-step-mixup", "The aim is to find out, not to prove yourself right."]], "Science grows when others can check and build on results."),
      q("Which is the best tool to OBSERVE the tiny hairs on a leaf?", "A magnifying glass", [["A measuring tape", "method-step-mixup", "A tape measures length; it doesn't make things look bigger."], ["A thermometer", "method-step-mixup", "A thermometer measures temperature."], ["A compass", "method-step-mixup", "A compass shows directions."]], "A magnifying glass (hand lens) makes small things look bigger."),
      q("Meena wants to know if seeds need water to sprout. What should she change in her test?", "Only whether the seeds get water", [["The type of seed and the amount of water", "fair-test-mixup", "Changing two things at once makes the result unclear."], ["The room and the pot for each seed", "fair-test-mixup", "Those should stay the same in a fair test."], ["Nothing at all; just watch one dish", "fair-test-mixup", "She needs a dish without water to compare."]], "One dish with water, one without, everything else the same."),
    ],
    "sq6-diversity-quiz": [
      q("Which plant is a shrub?", "Hibiscus (gudhal)", [["Mango", "plant-type-mixup", "Mango has one thick trunk: a tree."], ["Wheat", "plant-type-mixup", "Wheat has a soft green stem: a herb."], ["Pumpkin", "plant-type-mixup", "Pumpkin spreads on the ground: a creeper."]], "Shrubs have hard woody stems that branch near the ground."),
      q("A money plant needs a stick or wall to grow upward. It is a…", "Climber", [["Creeper", "plant-type-mixup", "A creeper spreads along the ground, like pumpkin."], ["Shrub", "plant-type-mixup", "A shrub stands on its own woody stems."], ["Herb", "plant-type-mixup", "Herbs are small soft-stemmed plants that stand on their own."]], "Climbers have weak stems and climb using support."),
      q("Which pair matches a leaf with net-like veins?", "Mango leaf and a taproot", [["Grass blade and a taproot", "venation-root-mixup", "Grass has parallel veins and fibrous roots."], ["Mango leaf and fibrous roots", "venation-root-mixup", "Net-like veins usually go with a taproot, not fibrous roots."], ["Banana leaf and a taproot", "venation-root-mixup", "Banana leaves have parallel veins."]], "Reticulate (net-like) veins usually go with a taproot."),
      q("Which plant has fibrous roots?", "Maize", [["Mustard", "venation-root-mixup", "Mustard has a taproot."], ["Carrot", "venation-root-mixup", "A carrot IS a thick taproot."], ["Rose", "venation-root-mixup", "Rose has a taproot and net-like veins."]], "Maize, wheat, rice and grass have many thin fibrous roots."),
      q("A soaked gram seed splits into two halves. This shows it is a…", "Dicot", [["Monocot", "seed-leaf-mixup", "Monocots have one seed leaf and don't split into two halves."], ["Spore", "seed-leaf-mixup", "Spores are tiny cells of ferns and fungi, not seeds."], ["Fruit", "seed-leaf-mixup", "The seed is inside the fruit; the halves are seed leaves."]], "Two seed leaves (cotyledons) = dicot."),
      q("Which feature helps a camel live in the desert?", "Wide, padded feet that don't sink in sand", [["Thick fur to keep out the cold", "habitat-adaptation-mixup", "That suits a yak in cold mountains, not a hot desert."], ["Gills to take oxygen from water", "habitat-adaptation-mixup", "Gills are for fish."], ["Webbed feet for swimming", "habitat-adaptation-mixup", "Webbed feet suit ducks and frogs in water."]], "Wide feet spread its weight on soft sand."),
      q("Find the INCORRECT statement.", "All plants with parallel veins have a taproot", [["Wheat is a herb", "plant-type-mixup", "True: wheat has a soft green stem."], ["Neem is a tree", "plant-type-mixup", "True: neem has one thick woody trunk."], ["Maize seeds have one seed leaf", "seed-leaf-mixup", "True: maize is a monocot."]], "Parallel veins usually go with fibrous roots, so that statement is wrong."),
      q("Cutting down a forest for a factory mostly harms…", "Biodiversity, the variety of living things there", [["Only the trees, nothing else", "biodiversity-mixup", "Animals, birds and insects lose their homes too."], ["Nothing, because animals simply move", "biodiversity-mixup", "Many can't find a new home and die out."], ["Only the weather of far-off countries", "biodiversity-mixup", "The biggest harm is to the living things in that place."]], "Habitat loss reduces biodiversity. Protecting habitats protects many species."),
    ],
    "sq6-eating-quiz": [
      q("Which nutrient mainly helps the body grow and repair itself?", "Proteins", [["Carbohydrates", "nutrient-role-mixup", "Carbohydrates mainly give energy."], ["Fats", "nutrient-role-mixup", "Fats give energy and store it."], ["Water", "nutrient-role-mixup", "Water is needed, but it doesn't build body parts."]], "Proteins are body-building foods: dal, milk, eggs, paneer."),
      q("A food sample turns violet with copper sulphate and sodium hydroxide. It contains…", "Protein", [["Starch", "food-test-mixup", "Starch is tested with iodine (blue-black)."], ["Fat", "food-test-mixup", "Fat leaves an oily patch on paper."], ["Fibre", "food-test-mixup", "Fibre is not shown by this test."]], "Violet colour = protein."),
      q("A peanut rubbed on paper leaves a patch that light shines through. The peanut has…", "Fat", [["Starch", "food-test-mixup", "Starch shows with iodine, not on paper."], ["Protein", "food-test-mixup", "Protein shows a violet colour with chemicals."], ["Vitamin C", "food-test-mixup", "This test shows oil, not vitamins."]], "An oily, see-through patch on paper means fat."),
      q("Riya's gums bleed easily and her wounds heal slowly. Which nutrient is she likely missing?", "Vitamin C", [["Vitamin A", "deficiency-mixup", "Lack of vitamin A causes night blindness."], ["Iodine", "deficiency-mixup", "Lack of iodine causes goitre."], ["Vitamin D", "deficiency-mixup", "Lack of vitamin D causes rickets."]], "Scurvy (bleeding gums) comes from too little vitamin C: eat amla, oranges, lemons."),
      q("Which pair is matched correctly?", "Iron: anaemia", [["Iodine: night blindness", "deficiency-mixup", "Iodine lack causes goitre; night blindness is vitamin A."], ["Vitamin D: scurvy", "deficiency-mixup", "Vitamin D lack causes rickets; scurvy is vitamin C."], ["Vitamin A: rickets", "deficiency-mixup", "Rickets comes from too little vitamin D."]], "Too little iron makes the blood weak: anaemia."),
      q("Why do we need roughage (dietary fibre) even though it gives no energy?", "It helps food move through the gut and prevents constipation", [["It builds strong muscles", "nutrient-role-mixup", "That is the job of proteins."], ["It is the body's main fuel", "nutrient-role-mixup", "Carbohydrates are the main fuel."], ["It stops all diseases", "nutrient-role-mixup", "No one food stops all diseases."]], "Fibre from fruits, vegetables and whole grains keeps digestion healthy."),
      q("Which meal is the most balanced?", "Roti, dal, a green sabzi, curd and a fruit", [["Chips, a cold drink and a pastry", "balanced-diet-mixup", "Lots of fat, sugar and salt but few vitamins, minerals or proteins."], ["Only rice and potato curry", "balanced-diet-mixup", "Mostly carbohydrates; little protein or vitamins."], ["Only fruits all day", "balanced-diet-mixup", "Too little protein and fat."]], "A balanced meal has energy foods, body-building foods and protective foods together."),
      q("Ragi, jowar and bajra are millets. Why are they called nutritious?", "They are rich in fibre and minerals like iron and calcium", [["They contain no nutrients at all", "nutrient-role-mixup", "Millets are full of nutrients."], ["They are mostly fat and sugar", "balanced-diet-mixup", "That describes junk food."], ["They can only be eaten raw", "balanced-diet-mixup", "Millets are cooked as rotis, porridge and more."]], "Millets (Shree Anna) are rich in fibre and minerals and grow with little water."),
    ],
    "sq6-magnets-quiz": [
      q("Which object will a magnet attract?", "An iron nail", [["A copper wire", "magnetic-material-mixup", "Copper is not magnetic."], ["An aluminium spoon", "magnetic-material-mixup", "Aluminium is a metal but not magnetic."], ["A rubber eraser", "magnetic-material-mixup", "Rubber is non-magnetic."]], "Magnets attract iron, nickel and cobalt. Not every metal is magnetic."),
      q("Where is a bar magnet's pull the strongest?", "At its two ends (the poles)", [["In the exact middle", "pole-rule-mixup", "The middle has the weakest pull."], ["Equally everywhere along it", "pole-rule-mixup", "Iron filings crowd at the ends, so the pull is uneven."], ["Only at the north pole", "pole-rule-mixup", "Both poles pull equally strongly."]], "Iron filings gather most at the poles."),
      q("The north pole of one magnet is brought near the north pole of another. They will…", "Push each other away", [["Pull together", "pole-rule-mixup", "Unlike poles attract; like poles repel."], ["Do nothing at all", "pole-rule-mixup", "Magnets always act on each other's poles."], ["Turn into non-magnets", "pole-rule-mixup", "Bringing them close doesn't remove their magnetism."]], "Like poles repel; unlike poles attract."),
      q("A bar magnet is broken into two pieces. What do you get?", "Two magnets, each with a north and a south pole", [["One north-pole piece and one south-pole piece", "pole-rule-mixup", "A pole can't be alone: each piece gets both poles."], ["Two pieces of plain iron", "pole-rule-mixup", "Each piece is still a magnet."], ["One magnet and one non-magnet", "pole-rule-mixup", "Both pieces stay magnets."]], "Every magnet, however small, has two poles."),
      q("A bar magnet hangs freely from a thread. It will come to rest…", "Pointing north–south", [["Pointing east–west", "compass-mixup", "A free magnet always settles north–south."], ["In any direction at random", "compass-mixup", "It always turns to the same direction."], ["Spinning without stopping", "compass-mixup", "It swings, then settles north–south."]], "That is why a compass needle points north–south."),
      q("Why should you keep a compass away from a magnet?", "The magnet will pull the needle off its true direction", [["The compass will lose its glass", "compass-mixup", "The glass is fine; the needle is the problem."], ["The magnet will become a compass", "compass-mixup", "Nothing like that happens."], ["Compasses work only in the dark", "compass-mixup", "Compasses work anywhere, away from magnets and iron."]], "A nearby magnet or iron object pulls the needle and gives wrong directions."),
      q("Which of these would make a magnet WEAKER?", "Dropping and hammering it many times", [["Keeping it with a keeper", "magnet-care-mixup", "Keepers help a magnet keep its strength."], ["Storing two magnets with unlike poles side by side", "magnet-care-mixup", "That is the right way to store them."], ["Wrapping it in paper", "magnet-care-mixup", "Paper does no harm."]], "Heating, hammering and dropping make magnets lose magnetism."),
      q("Kabir strokes an iron nail 30 times in one direction with the north pole of a magnet. What happens?", "The nail becomes a magnet", [["The nail melts", "magnet-care-mixup", "Stroking doesn't make it hot enough to melt."], ["The magnet becomes plain iron", "magnet-care-mixup", "The magnet stays a magnet."], ["Nothing: iron cannot become a magnet", "magnetic-material-mixup", "Iron is magnetic, so it can be made into a magnet."]], "Stroking in one direction lines up the nail's tiny magnets, making it a magnet."),
    ],
  },
  nodes: [living, materials, measure, science, diversity, eating, magnets],
};
