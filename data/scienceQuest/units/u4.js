// data/scienceQuest/units/u4.js: Science Unit 4, Our Environment (Claude, 2026-11-05). Classes 3–5 (food chains from Class 3,
// farming and pollution from Class 4). Fills the "Unit 3: Ecology, Agriculture & Environment" gap in docs/exam/nso-pattern.md.
// Original questions; facts are standard Class 3–5 EVS / science. Ambiguity rule: no option that also fits (e.g. "cloth bag"
// counts as both reduce and reuse, so it is not used; earthworms are left out of decomposer questions).
import { q, study, quiz, unit, main, practice, gate, withSubtopic, endless, boss, forGrades } from "../../englishQuest/helpers.js";

const C345 = [3, 4, 5];
const C45 = [4, 5];
const t = (subtopic, question, correct, wrongs, explanation) => ({ subtopic, ...q(question, correct, wrongs, explanation) });

const u4 = forGrades(unit("sq-u4", 4, "Our Environment"), C345);
const chains = forGrades(main("sq-chains", u4.id, 1, "Food Chains & Webs", [study("sq-chains-study"), quiz("sq-chains-warmup")]), C345);
const farming = forGrades(main("sq-farming", u4.id, 2, "From Farm to Plate", [study("sq-farming-study"), quiz("sq-farming-warmup")]), C45);
const pollution = forGrades(main("sq-pollution", u4.id, 3, "Pollution & Saving Earth", [study("sq-pollution-study"), quiz("sq-pollution-warmup")]), C45);

export default {
  studyPages: {
    "sq-chains-study": {
      name: "Who Eats Whom?",
      author: "Apprec8",
    cards: [
          {
                "emoji": "☀️",
                "title": "Producers and consumers",
                "text": "Green plants make food using sunlight, air, and water—they are producers! Animals cannot make food and must eat plants or other animals, so they are consumers.",
                "examples": [
                      "Producer: Grass and mango tree",
                      "Herbivore: Deer and rabbit",
                      "Carnivore: Tiger and eagle",
                      "Omnivore: Bear and crow"
                ]
          },
          {
                "emoji": "➡️",
                "title": "Reading a food chain",
                "text": "In a food chain, the arrow means 'is eaten by' and shows where energy flows: grass → grasshopper → frog → snake → eagle. Every chain always begins with a green producer!",
                "examples": [
                      "grass → grasshopper",
                      "grasshopper → frog",
                      "frog → snake",
                      "snake → eagle"
                ]
          },
          {
                "emoji": "🍄",
                "title": "Food webs & decomposers",
                "text": "Many food chains link into a food web. Decomposers like mushrooms and bacteria break down dead plants and animals, returning vital nutrients to the soil for new plants.",
                "examples": [
                      "Fungi (mushrooms)",
                      "Bacteria in soil",
                      "Decomposers recycle nutrients"
                ]
          },
          {
                "kind": "check",
                "question": "What does the arrow in a food chain (grass → zebra → lion) show?",
                "answer": "The flow of energy (who is eaten by whom)",
                "wrong": [
                      "Which animal runs the fastest",
                      "Which animal lives the longest",
                      "Which animal is bigger"
                ],
                "explain": "The arrow points from the food to the eater, showing how energy flows from producer to consumer."
          },
          {
                "kind": "check",
                "question": "Which organism is a producer in a food chain?",
                "answer": "Green grass",
                "wrong": [
                      "Grasshopper",
                      "Frog",
                      "Eagle"
                ],
                "explain": "Green plants produce their own food using sunlight. All other animals in the chain are consumers."
          }
    ],
      content: `### ☀️ It all starts with the Sun

**Green plants** make their own food from sunlight, air and water. They are **producers**.

Animals cannot make food. They eat plants or other animals. They are **consumers**.

| Consumer | Eats | Examples |
|---|---|---|
| Herbivore | only plants | deer, cow, rabbit, goat |
| Carnivore | other animals | tiger, lion, snake, eagle |
| Omnivore | plants and animals | crow, bear, humans |

---

### ➡️ A food chain

**grass → grasshopper → frog → snake → eagle**

> 💡 The arrow means **"is eaten by"**. It shows which way the food (energy) goes.

A chain always starts with a **plant** (a producer).

---

### 🕸️ A food web

Most animals eat more than one thing, so many food chains join up into a **food web**.

If one animal disappears, others are affected. No frogs → more grasshoppers, and less food for snakes.

---

### 🍄 Decomposers

**Fungi** (like mushrooms) and **bacteria** break down dead plants and animals. This puts goodness back into the soil for new plants.

---

### 🎯 Now you can…
- tell producers from consumers
- read the arrows in a food chain
- explain what decomposers do`,
    },
    "sq-farming-study": {
      name: "From Farm to Plate",
      author: "Apprec8",
    cards: [
          {
                "emoji": "🌾",
                "title": "Preparing and planting",
                "text": "Farming begins by ploughing the soil with a tractor to loosen it. Next, farmers sow healthy seeds using a seed drill. Drip irrigation gives water drop-by-drop right at the roots.",
                "examples": [
                      "Ploughing: Loosens soil",
                      "Sowing: Seed drill puts seeds",
                      "Irrigation: Watering crops",
                      "Drip irrigation: Saves water"
                ]
          },
          {
                "emoji": "🚜",
                "title": "Harvesting and threshing",
                "text": "Weeding removes unwanted wild plants using a khurpi. When crops ripen, farmers harvest them with sickles. Threshing separates grains from stalks, and winnowing uses wind to blow away light husk.",
                "examples": [
                      "Weeding = removing wild weeds",
                      "Harvesting = cutting ripe crops",
                      "Threshing = separating grain from stalk",
                      "Winnowing = wind removes husk"
                ]
          },
          {
                "emoji": "🌧️",
                "title": "Kharif and rabi seasons",
                "text": "India has two main crop seasons. Kharif crops like rice and maize are sown in monsoon rains (June). Rabi crops like wheat and mustard are sown in winter (October).",
                "examples": [
                      "Kharif (rainy season): Rice and maize",
                      "Kharif: Cotton and groundnut",
                      "Rabi (winter season): Wheat and mustard",
                      "Rabi: Gram and peas"
                ]
          },
          {
                "kind": "check",
                "question": "Which tool or method uses wind to blow away the light husk from grain?",
                "answer": "Winnowing",
                "wrong": [
                      "Ploughing",
                      "Irrigation",
                      "Threshing"
                ],
                "explain": "Winnowing lets wind carry away the lighter husk while the heavier grains drop straight down."
          },
          {
                "kind": "check",
                "question": "Which crop is a Rabi crop sown in winter?",
                "answer": "Wheat",
                "wrong": [
                      "Rice",
                      "Maize",
                      "Cotton"
                ],
                "explain": "Wheat, mustard, and gram are winter (Rabi) crops sown in October-November."
          }
    ],
      content: `### 🌾 The steps of farming, in order

| Step | What happens | Tool |
|---|---|---|
| 1. Ploughing | loosen and turn the soil | plough, tractor |
| 2. Sowing | put seeds in the soil | seed drill |
| 3. Irrigation | water the crop | canals, drip, sprinkler |
| 4. Weeding | remove unwanted plants (weeds) | khurpi |
| 5. Harvesting | cut the ripe crop | sickle, harvester |
| 6. Threshing | separate the grain from the stalks | thresher |
| 7. Winnowing | separate the light husk from the grain with wind | winnowing basket |
| 8. Storage | keep the dry grain safe from pests and damp | silos, sacks, neem leaves |

---

### 💧 Saving water

**Drip irrigation** gives water drop by drop to the roots, so very little is wasted.

---

### 🌧️ Two crop seasons in India

| Kharif | Rabi |
|---|---|
| sown in the **rainy** season (June–July) | sown in **winter** (October–November) |
| rice, maize, cotton, groundnut | wheat, mustard, gram, peas |

---

### 🎯 Now you can…
- put the farming steps in order
- match each step to its tool
- tell kharif crops from rabi crops`,
    },
    "sq-pollution-study": {
      name: "Pollution and Saving Earth",
      author: "Apprec8",
    cards: [
          {
                "emoji": "🏭",
                "title": "Four types of pollution",
                "text": "Smoke from factories and cars causes air pollution. Chemical waste and sewage cause water pollution. Excessive chemical fertilisers harm soil, and loud vehicle horns create noise pollution.",
                "examples": [
                      "Air: Vehicle and factory smoke",
                      "Water: Sewage and plastic in rivers",
                      "Soil: Chemical sprays and plastic",
                      "Noise: Loud horns and crackers"
                ]
          },
          {
                "emoji": "🌡️",
                "title": "Global warming",
                "text": "Greenhouse gases like carbon dioxide and methane trap heat like a blanket around Earth. Extra heat causes global warming, melting polar glaciers and raising sea levels. Planting trees absorbs carbon dioxide!",
                "examples": [
                      "Carbon dioxide traps heat",
                      "Glaciers melt as temperatures rise",
                      "Trees absorb carbon dioxide",
                      "Trees release fresh oxygen"
                ]
          },
          {
                "emoji": "♻️",
                "title": "The 3 Rs: Reduce, Reuse, Recycle",
                "text": "Reduce waste by using less, like switching off lights. Reuse old glass jars as pencil holders. Recycle old paper and metal to make fresh goods. Biodegradable peelings rot naturally into compost.",
                "examples": [
                      "Reduce: Turn off taps and fans",
                      "Reuse: Use cloth shopping bags",
                      "Recycle: Old paper into fresh books",
                      "Biodegradable: Fruit and vegetable peels"
                ]
          },
          {
                "kind": "check",
                "question": "Which of these materials is biodegradable and rots away naturally in soil?",
                "answer": "Banana peel",
                "wrong": [
                      "Plastic bottle",
                      "Glass jar",
                      "Aluminium can"
                ],
                "explain": "Banana peel and plant matter rot into nutrient-rich compost. Plastic and glass remain for hundreds of years."
          },
          {
                "kind": "check",
                "question": "What is the best way to help reduce carbon dioxide in the air?",
                "answer": "Planting more trees",
                "wrong": [
                      "Burning dry fallen leaves",
                      "Using more private cars",
                      "Leaving air conditioners on"
                ],
                "explain": "Green trees take in carbon dioxide during photosynthesis and give out clean oxygen."
          }
    ],
      content: `### 🏭 Four kinds of pollution

| Pollution | Some causes |
|---|---|
| Air | smoke from vehicles and factories, burning garbage |
| Water | sewage and factory waste in rivers, plastic |
| Soil | plastic, too many chemical fertilisers and pesticides |
| Noise | loud horns, loudspeakers, firecrackers |

---

### 🌡️ A warmer Earth

Gases like **carbon dioxide** and **methane** trap heat around the Earth. Too much of them makes the Earth warmer (**global warming**): glaciers melt and seas rise.

🌳 Trees take in carbon dioxide and give out oxygen.

---

### ♻️ The 3 Rs

| | Means | Example |
|---|---|---|
| Reduce | use less | switch off the fan when you leave the room |
| Reuse | use again | a glass jar becomes a pencil holder |
| Recycle | make something new from it | old newspapers made into new paper |

---

### 🍌 Biodegradable or not?

- **Biodegradable** (rots away): fruit peels, leaves, paper
- **Non-biodegradable** (stays for years): plastic, glass, metal cans

💧 **Rainwater harvesting**: collect rain from rooftops to use later or to fill up the ground water.

---

### 🎯 Now you can…
- name the four kinds of pollution and their causes
- explain global warming in one line
- use the 3 Rs`,
    },
  },

  quizzes: {
    // ----- Food chains (practice 8) -----
    "sq-chains-warmup": [
      t("producer-consumer", "Which of these is a producer?", "A mango tree", [["A cow", "producer-consumer-mixup"], ["A crow", "producer-consumer-mixup"], ["A mushroom", "decomposer-mixup"]], "Green plants make their own food from sunlight, so they are producers."),
      t("producer-consumer", "A deer eats only grass and leaves. What is it?", "A herbivore", [["A carnivore", "producer-consumer-mixup"], ["An omnivore", "producer-consumer-mixup"], ["A producer", "producer-consumer-mixup"]], "Animals that eat only plants are herbivores."),
      t("producer-consumer", "Which animal is an omnivore?", "Crow", [["Tiger", "producer-consumer-mixup"], ["Goat", "producer-consumer-mixup"], ["Rabbit", "producer-consumer-mixup"]], "A crow eats grains, fruit, insects and scraps: plants AND animals."),
      t("food-chain-order", "In a food chain, what does the arrow (→) mean?", "is eaten by", [["eats", "arrow-direction-mixup"], ["is bigger than", "arrow-direction-mixup"], ["lives with", "arrow-direction-mixup"]], "grass → deer means 'grass is eaten by deer'. The arrow shows where the food goes."),
      t("food-chain-order", "Which food chain is in the right order?", "grass → grasshopper → frog → snake", [["snake → frog → grasshopper → grass", "arrow-direction-mixup"], ["frog → grass → snake → grasshopper", "arrow-direction-mixup"], ["grasshopper → grass → frog → snake", "arrow-direction-mixup"]], "A food chain starts with a plant, and each arrow points to the animal that eats it."),
      t("food-chain-order", "What does every food chain start with?", "A green plant", [["A big animal", "arrow-direction-mixup"], ["A meat-eating animal", "arrow-direction-mixup"], ["A dead animal", "decomposer-mixup"]], "Only green plants can make food from sunlight, so every chain starts with a producer."),
      t("decomposers", "What do decomposers do?", "Break down dead plants and animals", [["Make food from sunlight", "decomposer-mixup"], ["Hunt other animals for food", "decomposer-mixup"], ["Carry pollen between flowers", "decomposer-mixup"]], "Decomposers like fungi and bacteria break down dead things and return goodness to the soil."),
      t("decomposers", "Which is a decomposer?", "Mushroom (a fungus)", [["Grass", "decomposer-mixup"], ["Eagle", "decomposer-mixup"], ["Cow", "decomposer-mixup"]], "Mushrooms are fungi. Fungi and bacteria are decomposers."),
    ],
    "sq-chains-webs": [
      t("food-chain-order", "In 'grass → rabbit → fox', what does the rabbit eat?", "Grass", [["Fox", "arrow-direction-mixup"], ["Nothing", "arrow-direction-mixup"], ["Other rabbits", "arrow-direction-mixup"]], "The arrow from grass to rabbit means grass is eaten by the rabbit."),
      t("food-chain-order", "In 'leaves → caterpillar → sparrow → hawk', who is eaten by the hawk?", "The sparrow", [["The caterpillar", "arrow-direction-mixup"], ["The leaves", "arrow-direction-mixup"], ["Nobody", "arrow-direction-mixup"]], "The arrow from sparrow to hawk: the sparrow is eaten by the hawk."),
      t("food-chain-order", "Many food chains joined together make a ___.", "food web", [["food pyramid", "arrow-direction-mixup"], ["food circle", "arrow-direction-mixup"], ["food bowl", "arrow-direction-mixup"]], "Linked food chains form a food web."),
      t("food-chain-order", "In 'grass → grasshopper → frog → snake', what happens if all the frogs disappear?", "Grasshoppers increase and snakes get less food", [["Grasshoppers and snakes both increase", "food-web-effect-mixup"], ["The grass grows much taller and thicker", "food-web-effect-mixup"], ["Nothing changes at all", "food-web-effect-mixup"]], "Fewer frogs eat grasshoppers, so they increase; snakes lose their food."),
      t("food-chain-order", "Where does the energy in a food chain first come from?", "The Sun", [["The soil", "arrow-direction-mixup"], ["Water", "arrow-direction-mixup"], ["The animals", "arrow-direction-mixup"]], "Plants use sunlight to make food; that energy then passes along the chain."),
      t("food-chain-order", "In 'grass → deer → tiger', which is a carnivore?", "Tiger", [["Deer", "producer-consumer-mixup"], ["Grass", "producer-consumer-mixup"], ["All three", "producer-consumer-mixup"]], "The tiger eats the deer, an animal → carnivore."),
      t("food-chain-order", "Which animal can be in more than one food chain?", "Any animal that eats many kinds of food", [["Only animals that eat one plant", "food-web-effect-mixup"], ["None, each animal is in one chain", "food-web-effect-mixup"], ["Only plants", "producer-consumer-mixup"]], "A hawk eats snakes, mice and small birds, so it is in many chains. That is why food chains join into webs."),
      t("food-chain-order", "Which chain is correct?", "plants → goat → lion", [["lion → goat → plants", "arrow-direction-mixup"], ["goat → plants → lion", "arrow-direction-mixup"], ["plants → lion → goat", "arrow-direction-mixup"]], "Plants are eaten by the goat; the goat is eaten by the lion."),
    ],
    "sq-chains-gate-pool": [
      t("producer-consumer", "Why are green plants called producers?", "They make their own food using sunlight.", [["They produce lots of seeds every year.", "producer-consumer-mixup"], ["They eat insects to get energy.", "producer-consumer-mixup"], ["They break down dead animals.", "decomposer-mixup"]], "Producers make food from sunlight, water and air."),
      t("producer-consumer", "Which group has only herbivores?", "cow, goat, rabbit", [["cow, tiger, rabbit", "producer-consumer-mixup"], ["crow, goat, lion", "producer-consumer-mixup"], ["snake, eagle, frog", "producer-consumer-mixup"]], "Cows, goats and rabbits eat only plants."),
      t("producer-consumer", "A bear eats fish, berries and honey. What is it?", "An omnivore", [["A herbivore", "producer-consumer-mixup"], ["A carnivore", "producer-consumer-mixup"], ["A producer", "producer-consumer-mixup"]], "Fish is an animal; berries and honey come from plants → both → omnivore."),
      t("producer-consumer", "Which of these is a consumer?", "A frog", [["A neem tree", "producer-consumer-mixup"], ["A grass plant", "producer-consumer-mixup"], ["A rose bush", "producer-consumer-mixup"]], "A frog cannot make food; it eats insects → consumer."),
      t("producer-consumer", "Which animal is a carnivore?", "Eagle", [["Elephant", "producer-consumer-mixup"], ["Sheep", "producer-consumer-mixup"], ["Parrot", "producer-consumer-mixup"]], "Eagles hunt snakes, fish and small animals → carnivore."),
      t("food-chain-order", "In 'algae → small fish → big fish → kingfisher', who eats the small fish?", "The big fish", [["The algae", "arrow-direction-mixup"], ["The kingfisher only", "arrow-direction-mixup"], ["Nobody", "arrow-direction-mixup"]], "The arrow from small fish points to the big fish."),
      t("food-chain-order", "Which chain is correct?", "grass → mouse → snake → eagle", [["eagle → snake → mouse → grass", "arrow-direction-mixup"], ["mouse → grass → eagle → snake", "arrow-direction-mixup"], ["grass → snake → mouse → eagle", "arrow-direction-mixup"]], "Grass is eaten by the mouse, the mouse by the snake, the snake by the eagle."),
      t("food-chain-order", "In 'grass → deer → tiger', what happens if hunters remove all the tigers?", "Deer increase and eat much more grass", [["Deer decrease because they are lonely", "food-web-effect-mixup"], ["Grass grows more because deer leave", "food-web-effect-mixup"], ["Nothing changes in the forest", "food-web-effect-mixup"]], "With no tigers, more deer survive and eat more grass."),
      t("food-chain-order", "What is the first link in every food chain?", "A producer", [["A carnivore", "arrow-direction-mixup"], ["An omnivore", "arrow-direction-mixup"], ["A decomposer", "decomposer-mixup"]], "Every chain starts with a green plant, a producer."),
      t("food-chain-order", "Which way do the arrows in a food chain point?", "From the food to the animal that eats it", [["From the eater to its food", "arrow-direction-mixup"], ["From the biggest to the smallest animal", "arrow-direction-mixup"], ["From the animal to the Sun", "arrow-direction-mixup"]], "The arrow shows where the food goes: to the eater."),
      t("decomposers", "Which pair are both decomposers?", "fungi and bacteria", [["grass and fungi", "decomposer-mixup"], ["vultures and bacteria", "decomposer-mixup"], ["bacteria and frogs", "decomposer-mixup"]], "Fungi and bacteria break down dead matter. Vultures eat dead animals but are scavengers, not decomposers."),
      t("decomposers", "What would happen if there were no decomposers?", "Dead plants and animals would pile up.", [["Plants would grow much faster.", "decomposer-mixup"], ["Animals would stop eating.", "decomposer-mixup"], ["The Sun would give less light.", "decomposer-mixup"]], "Without decomposers, dead things would not break down and the soil would lose its goodness."),
      t("decomposers", "How do decomposers help plants?", "They put goodness from dead things back into the soil.", [["They give plants sunlight.", "decomposer-mixup"], ["They eat the insects on leaves.", "decomposer-mixup"], ["They water the roots.", "decomposer-mixup"]], "Breaking down dead matter returns nutrients that plants take up."),
      t("decomposers", "A fallen log in the forest slowly turns soft and crumbly. What is doing this?", "Fungi and bacteria", [["Sunlight only", "decomposer-mixup"], ["Rain only", "decomposer-mixup"], ["Deer eating it", "decomposer-mixup"]], "Fungi and bacteria break down dead wood."),
      t("decomposers", "Mushrooms often grow on dead tree trunks. Why?", "They feed on the dead wood and break it down.", [["They make food from sunlight like leaves do.", "decomposer-mixup"], ["They protect the tree from rain.", "decomposer-mixup"], ["They are the seeds of the tree.", "decomposer-mixup"]], "Mushrooms are fungi: decomposers that feed on dead matter."),
    ],

    // ----- Farming (practice 8) -----
    "sq-farming-warmup": [
      t("farming-steps", "What is the first step before sowing seeds?", "Ploughing the soil", [["Harvesting the crop", "farming-order-mixup"], ["Winnowing the grain", "farming-order-mixup"], ["Storing the grain", "farming-order-mixup"]], "The soil is loosened and turned (ploughing) before seeds go in."),
      t("farming-steps", "Removing unwanted plants from a field is called ___.", "weeding", [["sowing", "farming-order-mixup"], ["threshing", "farming-order-mixup"], ["irrigation", "farming-order-mixup"]], "Weeds take water and food from the crop, so farmers remove them: weeding."),
      t("farming-steps", "Separating the grain from the stalks is called ___.", "threshing", [["winnowing", "farming-order-mixup"], ["ploughing", "farming-order-mixup"], ["sowing", "farming-order-mixup"]], "Threshing separates grain from the stalks. Winnowing then blows away the light husk."),
      t("farm-tools", "Which tool is used to cut a ripe crop?", "Sickle", [["Plough", "farm-tool-mixup"], ["Seed drill", "farm-tool-mixup"], ["Sprinkler", "farm-tool-mixup"]], "A sickle (or a harvester machine) cuts the ripe crop."),
      t("farm-tools", "How does drip irrigation save water?", "It gives water drop by drop to the roots.", [["It floods the whole field once a week.", "farm-tool-mixup"], ["It sprays water high into the air.", "farm-tool-mixup"], ["It stops the crop from needing water.", "farm-tool-mixup"]], "Water goes straight to the roots, so very little is wasted."),
      t("crop-seasons", "Which is a kharif crop?", "Rice", [["Wheat", "crop-season-mixup"], ["Mustard", "crop-season-mixup"], ["Gram", "crop-season-mixup"]], "Kharif crops are sown in the rainy season. Rice needs lots of water."),
      t("crop-seasons", "When are rabi crops sown?", "In winter (October–November)", [["In the rainy season (June–July)", "crop-season-mixup"], ["In peak summer (May)", "crop-season-mixup"], ["Any month of the year", "crop-season-mixup"]], "Rabi crops like wheat are sown in winter and harvested in spring."),
      t("farming-steps", "Why is grain dried before it is stored?", "Damp grain can get fungus and rot.", [["Dry grain grows into plants faster.", "farming-order-mixup"], ["Drying makes the grain heavier.", "farming-order-mixup"], ["Wet grain is easier for birds.", "farming-order-mixup"]], "Moisture lets fungus and pests spoil grain, so it is dried first."),
    ],
    "sq-farming-order": [
      t("farming-steps", "Which comes right after sowing?", "Irrigation", [["Ploughing", "farming-order-mixup"], ["Threshing", "farming-order-mixup"], ["Storage", "farming-order-mixup"]], "Seeds need water after they are sown: irrigation."),
      t("farming-steps", "Which comes right after harvesting?", "Threshing", [["Sowing", "farming-order-mixup"], ["Weeding", "farming-order-mixup"], ["Ploughing", "farming-order-mixup"]], "Cut crop → separate the grain from the stalks (threshing)."),
      t("farming-steps", "Which is the LAST step?", "Storage", [["Winnowing", "farming-order-mixup"], ["Harvesting", "farming-order-mixup"], ["Irrigation", "farming-order-mixup"]], "Clean, dry grain is stored last."),
      t("farming-steps", "Which order is correct?", "ploughing → sowing → irrigation → harvesting", [["sowing → ploughing → harvesting → irrigation", "farming-order-mixup"], ["harvesting → sowing → ploughing → irrigation", "farming-order-mixup"], ["irrigation → harvesting → sowing → ploughing", "farming-order-mixup"]], "Prepare the soil, sow, water, then cut the ripe crop."),
      t("farming-steps", "Using wind to separate the light husk from the heavy grain is called ___.", "winnowing", [["threshing", "farming-order-mixup"], ["weeding", "farming-order-mixup"], ["sowing", "farming-order-mixup"]], "In winnowing, the wind blows away the light husk; the heavy grain falls straight down."),
      t("farming-steps", "Which comes between irrigation and harvesting?", "Weeding", [["Ploughing", "farming-order-mixup"], ["Winnowing", "farming-order-mixup"], ["Storage", "farming-order-mixup"]], "While the crop grows and is watered, weeds are removed; then it is harvested."),
      t("farm-tools", "Which tool is used for sowing seeds in rows?", "Seed drill", [["Sickle", "farm-tool-mixup"], ["Thresher", "farm-tool-mixup"], ["Winnowing basket", "farm-tool-mixup"]], "A seed drill puts seeds into the soil in neat rows."),
      t("farm-tools", "Why do some families keep dried neem leaves with stored grain?", "Neem leaves keep insects away.", [["Neem leaves make the grain sweeter.", "farm-tool-mixup"], ["Neem leaves make the grain grow.", "farm-tool-mixup"], ["Neem leaves keep the grain wet.", "farm-tool-mixup"]], "Neem leaves help protect stored grain from insects."),
    ],
    "sq-farming-gate-pool": [
      t("farming-steps", "Loosening and turning the soil is called ___.", "ploughing", [["sowing", "farming-order-mixup"], ["winnowing", "farming-order-mixup"], ["harvesting", "farming-order-mixup"]], "Ploughing lets air and water reach the roots."),
      t("farming-steps", "Why do farmers plough the soil?", "So air and water can reach the roots easily.", [["To make the soil hard and flat.", "farming-order-mixup"], ["To remove the seeds from the soil.", "farming-order-mixup"], ["To cut the ripe crop.", "farming-order-mixup"]], "Loose soil lets roots grow and breathe."),
      t("farming-steps", "Which comes right before winnowing?", "Threshing", [["Sowing", "farming-order-mixup"], ["Irrigation", "farming-order-mixup"], ["Ploughing", "farming-order-mixup"]], "Threshing separates grain from stalks; winnowing then removes the husk."),
      t("farming-steps", "Weeds are harmful to crops because ___.", "they take water and food meant for the crop", [["they make the crop grow too fast", "farming-order-mixup"], ["they give the crop too much sunlight", "farming-order-mixup"], ["they are eaten by the farmer", "farming-order-mixup"]], "Weeds compete with the crop for water, nutrients and light."),
      t("farming-steps", "Which order is correct?", "harvesting → threshing → winnowing → storage", [["threshing → harvesting → storage → winnowing", "farming-order-mixup"], ["storage → winnowing → threshing → harvesting", "farming-order-mixup"], ["winnowing → storage → harvesting → threshing", "farming-order-mixup"]], "Cut, separate the grain, blow away the husk, then store."),
      t("farm-tools", "Which is used for irrigation?", "A sprinkler", [["A sickle", "farm-tool-mixup"], ["A plough", "farm-tool-mixup"], ["A thresher", "farm-tool-mixup"]], "Sprinklers spray water over crops."),
      t("farm-tools", "A khurpi is a small hand tool used for ___.", "weeding", [["harvesting", "farm-tool-mixup"], ["threshing", "farm-tool-mixup"], ["irrigation", "farm-tool-mixup"]], "A khurpi digs out weeds."),
      t("farm-tools", "Which machine cuts the crop and separates the grain in one go?", "A combine harvester", [["A seed drill", "farm-tool-mixup"], ["A sprinkler", "farm-tool-mixup"], ["A plough", "farm-tool-mixup"]], "A combine harvester does harvesting and threshing together."),
      t("farm-tools", "Where is grain stored in large amounts?", "In silos and granaries", [["In open fields", "farm-tool-mixup"], ["In rivers and ponds", "farm-tool-mixup"], ["Under the ground, wet", "farm-tool-mixup"]], "Silos and granaries keep large amounts of dry grain safe."),
      t("farm-tools", "Which irrigation method wastes the least water?", "Drip irrigation", [["Flooding the field", "farm-tool-mixup"], ["Watering at noon with buckets", "farm-tool-mixup"], ["Letting the canal overflow", "farm-tool-mixup"]], "Drip irrigation sends water straight to the roots."),
      t("crop-seasons", "Which is a rabi crop?", "Wheat", [["Rice", "crop-season-mixup"], ["Maize", "crop-season-mixup"], ["Cotton", "crop-season-mixup"]], "Wheat is sown in winter → rabi."),
      t("crop-seasons", "Kharif crops are sown in the ___ season.", "rainy", [["winter", "crop-season-mixup"], ["spring", "crop-season-mixup"], ["autumn", "crop-season-mixup"]], "Kharif crops are sown when the monsoon arrives (June–July)."),
      t("crop-seasons", "Which group has only kharif crops?", "rice, maize, cotton", [["wheat, mustard, gram", "crop-season-mixup"], ["rice, wheat, peas", "crop-season-mixup"], ["mustard, maize, gram", "crop-season-mixup"]], "Rice, maize and cotton are all sown in the rainy season."),
      t("crop-seasons", "Which group has only rabi crops?", "wheat, mustard, peas", [["rice, cotton, maize", "crop-season-mixup"], ["wheat, rice, groundnut", "crop-season-mixup"], ["maize, peas, cotton", "crop-season-mixup"]], "Wheat, mustard and peas are sown in winter."),
      t("crop-seasons", "Why is rice grown in the rainy season?", "It needs a lot of water.", [["It needs very cold weather.", "crop-season-mixup"], ["It grows only in snow.", "crop-season-mixup"], ["It needs no water at all.", "crop-season-mixup"]], "Rice fields need standing water, which the monsoon brings."),
    ],

    // ----- Pollution (practice 8) -----
    "sq-pollution-warmup": [
      t("pollution-types", "Smoke from cars and factories causes ___ pollution.", "air", [["water", "pollution-cause-mixup"], ["soil", "pollution-cause-mixup"], ["noise", "pollution-cause-mixup"]], "Smoke goes into the air we breathe → air pollution."),
      t("pollution-types", "Loud horns and firecrackers cause ___ pollution.", "noise", [["water", "pollution-cause-mixup"], ["soil", "pollution-cause-mixup"], ["light", "pollution-cause-mixup"]], "Very loud sounds are noise pollution. They can harm our ears."),
      t("pollution-types", "Factory waste poured into a river causes ___.", "water pollution", [["noise pollution", "pollution-cause-mixup"], ["air pollution only", "pollution-cause-mixup"], ["no pollution", "pollution-cause-mixup"]], "Waste in rivers makes the water dirty and harms fish and people."),
      t("greenhouse", "Which gas traps heat and makes the Earth warmer?", "Carbon dioxide", [["Oxygen", "greenhouse-mixup"], ["Nitrogen", "greenhouse-mixup"], ["Helium", "greenhouse-mixup"]], "Carbon dioxide (and methane) trap heat → global warming."),
      t("greenhouse", "How do trees help against global warming?", "They take in carbon dioxide.", [["They give out carbon dioxide all day.", "greenhouse-mixup"], ["They make the Sun shine less.", "greenhouse-mixup"], ["They melt the glaciers.", "greenhouse-mixup"]], "Trees use carbon dioxide to make food and give out oxygen."),
      t("conserve", "Using an old glass jar as a pencil holder is an example of ___.", "reuse", [["recycle", "conservation-mixup"], ["reduce", "conservation-mixup"], ["pollute", "conservation-mixup"]], "Using something again for a new job = REUSE."),
      t("conserve", "Turning old newspapers into new paper is called ___.", "recycling", [["reusing", "conservation-mixup"], ["reducing", "conservation-mixup"], ["burning", "conservation-mixup"]], "Making something new from old material = RECYCLE."),
      t("conserve", "Which of these is biodegradable?", "A banana peel", [["A plastic bottle", "conservation-mixup"], ["A glass jar", "conservation-mixup"], ["A metal can", "conservation-mixup"]], "A banana peel rots away; plastic, glass and metal stay for years."),
    ],
    "sq-pollution-3r": [
      t("conserve", "Switching off the fan when you leave the room is an example of ___.", "reduce", [["recycle", "conservation-mixup"], ["reuse", "conservation-mixup"], ["pollute", "conservation-mixup"]], "Using less electricity = REDUCE."),
      t("conserve", "Collecting rainwater from rooftops to use later is called ___.", "rainwater harvesting", [["irrigation", "conservation-mixup"], ["winnowing", "conservation-mixup"], ["evaporation", "conservation-mixup"]], "Rainwater harvesting saves water and fills up the ground water."),
      t("conserve", "Which of these is non-biodegradable?", "A plastic bag", [["Dry leaves", "conservation-mixup"], ["An apple core", "conservation-mixup"], ["A paper bag", "conservation-mixup"]], "Plastic does not rot away; it stays for hundreds of years."),
      t("conserve", "Melting old aluminium cans to make new cans is ___.", "recycling", [["reusing", "conservation-mixup"], ["reducing", "conservation-mixup"], ["polluting", "conservation-mixup"]], "Making new things from old material = RECYCLE."),
      t("conserve", "Giving your old storybooks to a younger cousin is ___.", "reuse", [["recycle", "conservation-mixup"], ["reduce", "conservation-mixup"], ["pollute", "conservation-mixup"]], "The books are used again as they are = REUSE."),
      t("conserve", "Turning off the tap while you brush your teeth is ___.", "reduce", [["recycle", "conservation-mixup"], ["reuse", "conservation-mixup"], ["pollute", "conservation-mixup"]], "Using less water = REDUCE."),
      t("conserve", "Where should a fruit peel go?", "Into a compost pit", [["Into the river", "conservation-mixup"], ["Into a fire", "conservation-mixup"], ["Onto the road", "conservation-mixup"]], "Peels are biodegradable: in a compost pit they become manure."),
      t("conserve", "Which is better for the air?", "Walking or cycling to a nearby shop", [["Going by car for every short trip", "conservation-mixup"], ["Burning dry leaves in the garden", "pollution-cause-mixup"], ["Leaving the car engine running", "pollution-cause-mixup"]], "Walking and cycling make no smoke."),
    ],
    "sq-pollution-gate-pool": [
      t("pollution-types", "Using too many chemical fertilisers mainly causes ___ pollution.", "soil", [["noise", "pollution-cause-mixup"], ["air", "pollution-cause-mixup"], ["light", "pollution-cause-mixup"]], "Extra chemicals stay in the soil and harm it."),
      t("pollution-types", "Burning garbage in the open causes ___ pollution.", "air", [["noise", "pollution-cause-mixup"], ["water", "pollution-cause-mixup"], ["no", "pollution-cause-mixup"]], "Burning makes smoke and harmful gases."),
      t("pollution-types", "Which can make people cough and have trouble breathing?", "Air pollution", [["Noise pollution", "pollution-cause-mixup"], ["Rainwater harvesting", "conservation-mixup"], ["Composting", "conservation-mixup"]], "Smoke and dust in the air harm our lungs."),
      t("pollution-types", "Sewage flowing into a lake harms the fish because ___.", "it makes the water dirty and harmful", [["it makes the water colder", "pollution-cause-mixup"], ["it adds more fish food", "pollution-cause-mixup"], ["it makes the lake deeper", "pollution-cause-mixup"]], "Sewage pollutes water and can kill water animals."),
      t("pollution-types", "Which is a cause of noise pollution?", "Loudspeakers at full volume", [["Planting trees", "pollution-cause-mixup"], ["Factory waste in rivers", "pollution-cause-mixup"], ["Plastic in the soil", "pollution-cause-mixup"]], "Very loud sounds are noise pollution."),
      t("greenhouse", "What is global warming?", "The Earth slowly getting warmer", [["The Sun getting closer to the Earth", "greenhouse-mixup"], ["Summer lasting all year in one city", "greenhouse-mixup"], ["The Moon getting hotter", "greenhouse-mixup"]], "Gases like carbon dioxide trap heat, so the Earth warms up."),
      t("greenhouse", "Which is a result of global warming?", "Glaciers melting", [["More snow every year everywhere", "greenhouse-mixup"], ["Seas drying up", "greenhouse-mixup"], ["Longer nights", "greenhouse-mixup"]], "A warmer Earth melts glaciers and the seas rise."),
      t("greenhouse", "Which two gases trap heat around the Earth?", "Carbon dioxide and methane", [["Oxygen and nitrogen", "greenhouse-mixup"], ["Oxygen and helium", "greenhouse-mixup"], ["Hydrogen and helium", "greenhouse-mixup"]], "Carbon dioxide and methane are greenhouse gases."),
      t("greenhouse", "Cutting down forests makes global warming worse because ___.", "fewer trees take in carbon dioxide", [["trees give out heat", "greenhouse-mixup"], ["trees block the wind", "greenhouse-mixup"], ["forests make the Sun brighter", "greenhouse-mixup"]], "Trees absorb carbon dioxide; with fewer trees, more of it stays in the air."),
      t("greenhouse", "Which fuel makes less air pollution in buses?", "CNG", [["Coal", "pollution-cause-mixup"], ["Wood", "pollution-cause-mixup"], ["Old diesel engines", "pollution-cause-mixup"]], "CNG (compressed natural gas) burns cleaner than diesel or coal."),
      t("conserve", "Which is an example of RECYCLE?", "Making new paper from old newspapers", [["Using a jar as a pencil holder", "conservation-mixup"], ["Switching off lights", "conservation-mixup"], ["Giving old clothes to a cousin", "conservation-mixup"]], "Recycle = make something new from old material."),
      t("conserve", "Which is an example of REDUCE?", "Turning off the tap while soaping your hands", [["Making new cans from old cans", "conservation-mixup"], ["Using an old tyre as a swing", "conservation-mixup"], ["Making paper from old paper", "conservation-mixup"]], "Reduce = use less."),
      t("conserve", "Which is an example of REUSE?", "Using an old tyre as a swing", [["Melting old cans into new cans", "conservation-mixup"], ["Switching off the fan", "conservation-mixup"], ["Making paper from old paper", "conservation-mixup"]], "Reuse = use again for another job."),
      t("conserve", "Which group is all biodegradable?", "leaves, fruit peels, paper", [["plastic, leaves, glass", "conservation-mixup"], ["metal cans, paper, peels", "conservation-mixup"], ["glass, plastic, metal", "conservation-mixup"]], "Leaves, peels and paper rot away."),
      t("conserve", "Why is rainwater harvesting useful?", "It saves rainwater for later use.", [["It makes it rain more often.", "conservation-mixup"], ["It cleans the air of smoke.", "conservation-mixup"], ["It stops rivers from flowing.", "conservation-mixup"]], "Stored rainwater can be used later or refill the ground water."),
    ],

    // ----- Unit 4 Boss (12, Class 3–5 safe: food chains for all; farming/pollution items are Class 4–5 level but kept simple) -----
    "sq-u4-test": [
      q("Which is a producer?", "A neem tree", [["A sparrow", "producer-consumer-mixup"], ["A goat", "producer-consumer-mixup"], ["A mushroom", "decomposer-mixup"]], "Green plants make their own food → producers."),
      q("A goat eats grass and leaves. It is a ___.", "herbivore", [["carnivore", "producer-consumer-mixup"], ["omnivore", "producer-consumer-mixup"], ["decomposer", "decomposer-mixup"]], "Eats only plants → herbivore."),
      q("Which food chain is correct?", "leaves → caterpillar → bird", [["bird → caterpillar → leaves", "arrow-direction-mixup"], ["caterpillar → leaves → bird", "arrow-direction-mixup"], ["leaves → bird → caterpillar", "arrow-direction-mixup"]], "Leaves are eaten by the caterpillar, the caterpillar by the bird."),
      q("Fungi and bacteria are called ___.", "decomposers", [["producers", "decomposer-mixup"], ["herbivores", "decomposer-mixup"], ["carnivores", "decomposer-mixup"]], "They break down dead plants and animals."),
      q("Where does the energy for every food chain come from?", "The Sun", [["The Moon", "arrow-direction-mixup"], ["The soil", "arrow-direction-mixup"], ["The biggest animal", "arrow-direction-mixup"]], "Plants capture the Sun's energy to make food."),
      q("Which step comes first?", "Ploughing", [["Harvesting", "farming-order-mixup"], ["Threshing", "farming-order-mixup"], ["Storage", "farming-order-mixup"]], "The soil is prepared before anything is sown."),
      q("Blowing away the husk from the grain with the wind is ___.", "winnowing", [["weeding", "farming-order-mixup"], ["ploughing", "farming-order-mixup"], ["sowing", "farming-order-mixup"]], "Wind carries the light husk away; grain falls down."),
      q("Which crop is sown in winter?", "Wheat", [["Rice", "crop-season-mixup"], ["Cotton", "crop-season-mixup"], ["Maize", "crop-season-mixup"]], "Wheat is a rabi (winter) crop."),
      q("Smoke from factories causes ___ pollution.", "air", [["noise", "pollution-cause-mixup"], ["soil", "pollution-cause-mixup"], ["water", "pollution-cause-mixup"]], "Smoke dirties the air."),
      q("Which is non-biodegradable?", "A glass bottle", [["A banana peel", "conservation-mixup"], ["Dry leaves", "conservation-mixup"], ["A paper bag", "conservation-mixup"]], "Glass does not rot away."),
      q("Using an empty box to store your toys is ___.", "reuse", [["recycle", "conservation-mixup"], ["reduce", "conservation-mixup"], ["pollute", "conservation-mixup"]], "Using it again for a new job = REUSE."),
      q("Trees help keep the Earth cool because they ___.", "take in carbon dioxide", [["give out smoke", "greenhouse-mixup"], ["trap more heat", "greenhouse-mixup"], ["make the Sun weaker", "greenhouse-mixup"]], "Trees absorb carbon dioxide, a heat-trapping gas."),
    ],
  },

  nodes: [
    u4,
    chains,
    forGrades(withSubtopic(practice("sq-chains-p1", chains, 1, "Chains and Webs", "medium", [quiz("sq-chains-webs")]), "food-chain-order"), C345),
    forGrades(gate("sq-chains-gate", chains, "Food Chain Challenge", "sq-chains-gate-pool", {
      "producer-consumer": "Producers and consumers",
      "food-chain-order": "Reading a food chain",
      decomposers: "Decomposers",
    }), C345),
    forGrades(endless(chains), C345),

    farming,
    forGrades(withSubtopic(practice("sq-farming-p1", farming, 1, "Steps in Order", "medium", [quiz("sq-farming-order")]), "farming-steps"), C45),
    forGrades(gate("sq-farming-gate", farming, "Farming Challenge", "sq-farming-gate-pool", {
      "farming-steps": "Steps of farming",
      "farm-tools": "Tools and water",
      "crop-seasons": "Kharif and rabi",
    }), C45),
    forGrades(endless(farming), C45),

    pollution,
    forGrades(withSubtopic(practice("sq-pollution-p1", pollution, 1, "Reduce, Reuse, Recycle", "medium", [quiz("sq-pollution-3r")]), "conserve"), C45),
    forGrades(gate("sq-pollution-gate", pollution, "Saving Earth Challenge", "sq-pollution-gate-pool", {
      "pollution-types": "Kinds of pollution",
      greenhouse: "A warmer Earth",
      conserve: "The 3 Rs",
    }), C45),
    forGrades(endless(pollution), C45),

    forGrades(boss("sq-u4-boss", u4.id, "Our Environment Boss", "sq-u4-test", "Dr. Bio-Mixer has tangled the food chains and filled the river with rubbish! Use what you know about food chains, farms and saving the Earth to put nature back in balance."), [4, 5]),
  ],
};
