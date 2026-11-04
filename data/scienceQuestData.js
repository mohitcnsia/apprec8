// data/scienceQuestData.js
// Science Quest (NSO), the second tile quest. Same format and helpers as English Quest
// (docs/CONTENT_GUIDE.md); seeded by components/quiz/SeedTileQuestButton.js (Admin tools).
//
// ONE tree for all classes (owner design, 2026-11-04): every topic carries `grades` (the classes it is for).
// The app hides topics that aren't for the kid's class (utils/gradeFilter.js); a topic for several
// classes is shared. Untagged = for everyone (avoid in Science).
//
// STATUS: DRAFT. Seeds to carouselGroup "quest_draft" while draft is true.
// Class 5 NSO focus: Unit 1 "The Living World" (Living vs non-living, Plants, Animals).

import {
  q,
  study,
  quiz,
  unit,
  main,
  practice,
  gate,
  withSubtopic,
  endless,
  boss,
  forGrades,
} from "./englishQuest/helpers.js";

export const QUEST_ID = "science-quest";

export const quest = {
  title: "Science Quest",
  description: "Explore living things, plants, animals, matter, forces, Earth and space, one branch at a time, up to Olympiad (NSO) level.",
  image: null,
  version: 1,
  draft: true,
};

export const tile = {
  title: "Science Quest",
  type: "QUEST",
  carouselGroup: quest.draft ? "quest_draft" : "quest",
  order: 2,
  image: null,
  questId: QUEST_ID,
  description: "Science for NSO, matched to your class",
};

// ---------- Mistake tags (keep short, reuse) ----------
// moves-means-alive, needs-energy-means-alive, sign-of-life-mixup, never-alive-mixup,
// still-alive-mixup, colour-means-alive, natural-nonliving-mixup,
// cotyledon-function-mixup, germination-condition-mixup, seed-part-mixup, dispersal-agent-mixup,
// light-for-germination-myth, vegetative-part-mixup, spore-seed-mixup,
// breathing-organ-mixup, amphibian-breathing-mixup, insect-breathing-mixup, body-covering-mixup,
// camouflage-mixup, migration-reason-mixup, teeth-diet-mixup

// ---------- Study pages ----------
export const studyPages = {
  "sq-living-study": {
    name: "Living and Non-living Things",
    author: "Apprec8",
    content: `### 🌱 Is it alive?

Everything around us is either **living** or **non-living**.

**Living things** show all the essential *signs of life*:

- 🍎 They need **food** and **water** to survive and gain energy.
- 🌬️ They **breathe** (exchange gases with their environment).
- 📏 They **grow** and develop over time.
- 🐣 They **reproduce** (produce young ones of their own kind or make seeds).
- 👀 They **respond** to stimuli (a sunflower turns toward the sun; you pull your hand away from a hot object).
- 🍂 They have a life cycle and eventually **die**.

---

### 🪨 Non-living things

Non-living things do **not** grow, breathe, need food, or reproduce by themselves.

| Living | Non-living (Man-made) | Non-living (Natural) |
|---|---|---|
| Mango tree | Bicycle | Rock |
| Cat | Plastic bottle | River |
| Honeybee | Car | Cloud |

> 💡 **Careful!** A car **moves** and needs **petrol** for energy, but it cannot grow, reproduce, or breathe. Therefore, it is **non-living**. Similarly, clouds move across the sky and grow in size, but they do not show life processes.

---

### 🪵 Once living but non-living now

Some non-living things were once part of a living organism:

- **Wooden table:** made from wood that came from a living tree.
- **Cotton shirt:** made from cotton fibres produced by a cotton plant.
- **Leather shoes:** made from animal hide.
- **Coal:** formed from ancient dead plants buried millions of years ago.

In contrast, things like rocks, gold, glass, and plastic were **never alive**.

> 🌰 **Seed Mystery:** A dry seed in a jar looks still and does not eat, but it is **living**! Inside the seed is a sleeping baby plant (embryo). With water, air, and warmth, it wakes up and sprouts!`,
  },

  "sq-plants-study": {
    name: "How Plants Grow and Reproduce",
    author: "Apprec8",
    content: `### 🌰 Structure of a Seed

Most flowering plants begin their life as a seed. A seed has three main parts:

1. **Seed coat (Testa):** The tough outer skin that protects the baby plant inside.
2. **Seed leaves (Cotyledons):** The fleshy parts that store food for the baby plant. Seeds with one cotyledon are *monocots* (maize, wheat, rice); seeds with two cotyledons are *dicots* (gram, pea, bean).
3. **Embryo (Baby plant):** Contains the baby root (radicle) and baby shoot (plumule).

---

### 💧 Conditions for Germination

**Germination** is the process by which a seed wakes up and grows into a seedling.

To germinate, a seed needs:
- 💧 **Water:** softens the seed coat and activates food digestion.
- 🌬️ **Air (Oxygen):** needed for the seed cells to breathe.
- ☀️ **Warmth (Suitable temperature):** makes the seed enzymes active.

> ⚠️ **NSO Trap:** Seeds do **NOT** need sunlight to germinate! They germinate underground in the dark. Sunlight is only needed once green leaves emerge to carry out photosynthesis.

---

### 🌬️ Seed Dispersal (How Seeds Travel)

If all seeds fell beneath the parent plant, they would fight for sunlight, water, and minerals. So nature scatters them:

- **Wind:** Seeds are light and have wings or hairs (Dandelion, Cotton, Madar/Aak, Maple).
- **Water:** Seeds are spongy or fibrous to float (Coconut, Lotus).
- **Animals & Humans:** Juicy fruits are eaten and seeds discarded (Mango, Apple); or seeds have sharp hooks or spines that stick to animal fur (Xanthium/Cocklebur, Tiger nail).
- **Explosion (Bursting):** Pods dry, crack, and burst open flicking seeds away (Pea, Balsam, Lady's finger).

---

### 🌿 Vegetative Reproduction (Without Seeds)

Many plants can grow from parts other than seeds:
- **From Stems:** Potato (underground stem with 'eyes'), Ginger, Rose (stem cutting), Sugarcane.
- **From Roots:** Sweet potato, Dahlia, Carrot, Radish.
- **From Leaves:** *Bryophyllum* has tiny buds along its leaf edges that fall and grow into new plants!
- **From Spores:** Non-flowering plants like Ferns, Mosses, and Fungi do not make seeds; they reproduce by tiny dust-like spores.`,
  },

  "sq-animals-study": {
    name: "Animal Habitats and Adaptations",
    author: "Apprec8",
    content: `### 🌬️ How Animals Breathe

Animals need oxygen to break down food and release energy. Different animals breathe in different ways:

- **Lungs:** Mammals (humans, cows, whales, dolphins), Birds, and Reptiles (snakes, lizards, turtles). Whales and dolphins come to the water surface to breathe air through blowholes!
- **Gills:** Fish, tadpoles, prawns, and crabs absorb oxygen dissolved in water.
- **Moist Skin:** Earthworms breathe directly through their thin, moist skin. Adult frogs breathe through lungs on land, but breathe through their **moist skin** while in water!
- **Spiracles & Air Tubes:** Insects (cockroaches, grasshoppers, butterflies) have tiny breathing holes called **spiracles** along the sides of their bodies.

---

### 🛡️ Body Coverings

An animal's outer covering protects it from weather and enemies:

- **Scales:** Reptiles (snakes, crocodiles) have dry, horny scales to stop water loss. Fish have overlapping, slimy scales.
- **Shell:** Snails, tortoises, and turtles have hard shells to pull their soft bodies inside when danger approaches.
- **Feathers:** Birds have feathers that keep them warm and enable flight.
- **Fur or Wool:** Mammals in cold regions (polar bear, yak, sheep) have thick fur that traps air to keep body heat in.
- **Camouflage:** Blending with surroundings to hide from predators or prey (Chameleon, Stick insect, Arctic fox with white winter fur).

---

### ✈️ Animal Migration

**Migration** is the seasonal mass journey of animals from one region to another to escape harsh cold, find food, or breed in safety.

- **Siberian Crane:** Flies thousands of kilometres from chilly Siberia to Bharatpur (India) every winter.
- **Arctic Tern:** Undertakes the longest migration on Earth, flying from the Arctic to the Antarctic and back each year!
- **Monarch Butterfly:** Migrates from cold Canada to warm Mexico for the winter.`,
  },
};

// ---------- Quizzes (V2 format; 4 options each, tagged with mistakeTag) ----------
export const quizzes = {
  // ==========================================
  // Topic 1: Living and Non-living Things
  // ==========================================

  // Topic 1 Warm-up (8 questions)
  "sq-living-warmup": [
    {
      subtopic: "living-vs-nonliving",
      ...q(
        "Which of these is a living thing?",
        "A mango tree",
        [
          ["A rock", "never-alive-mixup"],
          ["A bicycle", "moves-means-alive"],
          ["A cloud", "moves-means-alive"],
        ],
        "A mango tree grows, takes in water, and produces seeds. Rocks, bicycles, and clouds cannot grow or reproduce."
      ),
    },
    {
      subtopic: "living-vs-nonliving",
      ...q(
        "A car can move and uses petrol for energy. Why is it still classified as a non-living thing?",
        "It cannot grow or reproduce by itself",
        [
          ["Because it has four wheels", "never-alive-mixup"],
          ["Because it is made of steel", "never-alive-mixup"],
          ["Because it travels only on roads", "moves-means-alive"],
        ],
        "Moving and using energy are not enough. Living things must also grow, breathe, and reproduce, which a car can never do."
      ),
    },
    {
      subtopic: "signs-of-life",
      ...q(
        "Which of these is an essential sign of life shown by ALL living things?",
        "Breathing and growing",
        [
          ["Making loud sounds", "sign-of-life-mixup"],
          ["Walking on legs", "moves-means-alive"],
          ["Having green colour", "colour-means-alive"],
        ],
        "All living things breathe and grow. Many living things (like plants and earthworms) do not walk or make loud sounds."
      ),
    },
    {
      subtopic: "signs-of-life",
      ...q(
        "A dry bean seed in a jar does not move or eat. What is it?",
        "Living, because it can sprout and grow into a plant",
        [
          ["Non-living, because it has no legs", "moves-means-alive"],
          ["Non-living, because it was never alive", "never-alive-mixup"],
          ["Dead, because dry seeds can never grow", "sign-of-life-mixup"],
        ],
        "A dry seed contains a living baby plant (embryo) resting inside. With water, air, and warmth, it germinates into a plant."
      ),
    },
    {
      subtopic: "once-living",
      ...q(
        "Which of these objects was once living but is non-living now?",
        "A wooden ruler",
        [
          ["A plastic bottle", "never-alive-mixup"],
          ["A steel spoon", "never-alive-mixup"],
          ["A glass marble", "never-alive-mixup"],
        ],
        "Wood comes from a tree that was once alive. Plastic, steel, and glass are synthetic or mineral materials that were never alive."
      ),
    },
    {
      subtopic: "signs-of-life",
      ...q(
        "Plants cannot walk from place to place. How do they show response to their surroundings?",
        "Their stems and leaves bend towards sunlight",
        [
          ["They change their colour every hour", "colour-means-alive"],
          ["They close their roots tightly", "sign-of-life-mixup"],
          ["They produce smoke when hot", "never-alive-mixup"],
        ],
        "Plants respond to stimuli: stems bend towards sunlight (phototropism), roots grow down towards water, and touch-me-not leaves fold when touched."
      ),
    },
    {
      subtopic: "living-vs-nonliving",
      ...q(
        "A river flows down a mountain and swells bigger after heavy rains. Is the river a living thing?",
        "No, it does not breathe, feed, or reproduce",
        [
          ["Yes, because it moves fast", "moves-means-alive"],
          ["Yes, because it drinks rainwater", "needs-energy-means-alive"],
          ["Yes, because it gets bigger in size", "sign-of-life-mixup"],
        ],
        "A river increases in size only because extra water is added from outside. It has no cells, does not breathe, and does not reproduce."
      ),
    },
    {
      subtopic: "once-living",
      ...q(
        "Which of these clothing items is made from something that was once living?",
        "A pure cotton shirt",
        [
          ["A polyester jacket", "never-alive-mixup"],
          ["A nylon raincoat", "never-alive-mixup"],
          ["A plastic badge", "never-alive-mixup"],
        ],
        "Cotton fibres come from the cotton plant (which was living). Polyester and nylon are man-made synthetic materials made from petroleum chemicals."
      ),
    },
  ],

  // Topic 1 Practice Leaf (6 questions, subtopic: signs-of-life)
  "sq-living-tricky": [
    q(
      "When you accidentally touch an ice-cold object, your hand pulls back instantly. Which life process does this show?",
      "Response to a stimulus",
      [
        ["Reproduction", "sign-of-life-mixup"],
        ["Breathing", "sign-of-life-mixup"],
        ["Growth in height", "sign-of-life-mixup"],
      ],
      "Living things sense changes in their surroundings (stimuli) and react quickly to protect themselves."
    ),
    q(
      "The leaves of the 'touch-me-not' (Mimosa) plant droop quickly when touched. What does this observation prove?",
      "Plants are living things that respond to touch",
      [
        ["The plant has instantly died", "still-alive-mixup"],
        ["Plants do not need water", "sign-of-life-mixup"],
        ["Touch-me-not is an artificial plant", "never-alive-mixup"],
      ],
      "The sudden drooping of Mimosa leaves is a clear demonstration that plants can sense and respond to stimuli."
    ),
    q(
      "Why must all living organisms take in food regularly?",
      "To obtain energy to grow, repair cells, and stay active",
      [
        ["Only to change their body colour", "colour-means-alive"],
        ["To stop their bodies from growing", "sign-of-life-mixup"],
        ["So that they never need to sleep", "needs-energy-means-alive"],
      ],
      "Food provides essential nutrients and energy needed for growth, cell repair, and bodily functions."
    ),
    q(
      "A rubber balloon becomes larger when you blow air into it. Why is this NOT real biological growth?",
      "It only stretches from added air and does not make new cells",
      [
        ["Because air is a living thing", "never-alive-mixup"],
        ["Because the balloon eats food", "sign-of-life-mixup"],
        ["Because rubber grows only in soil", "never-alive-mixup"],
      ],
      "Biological growth occurs from inside when an organism takes in food and creates new living cells. A balloon simply stretches."
    ),
    q(
      "What is the process called by which living things produce young ones of their own kind?",
      "Reproduction",
      [
        ["Respiration", "sign-of-life-mixup"],
        ["Digestion", "sign-of-life-mixup"],
        ["Circulation", "sign-of-life-mixup"],
      ],
      "Reproduction is the process by which living organisms give rise to offspring, ensuring the continuation of their species."
    ),
    q(
      "What happens to all living things at the end of their natural life cycle?",
      "They eventually die",
      [
        ["They turn into metal objects", "never-alive-mixup"],
        ["They turn back into small babies", "sign-of-life-mixup"],
        ["They stop needing air forever but stay alive", "still-alive-mixup"],
      ],
      "Every living thing has a definite life span. After completing its life cycle, it eventually dies."
    ),
  ],

  // Topic 1 Gate Pool (15 questions: 5 signs-of-life, 5 living-vs-nonliving, 5 once-living)
  "sq-living-gate-pool": [
    // 5 signs-of-life
    {
      subtopic: "signs-of-life",
      ...q(
        "Which gas do animals and plants take in during respiration?",
        "Oxygen",
        [
          ["Carbon dioxide", "sign-of-life-mixup"],
          ["Nitrogen", "sign-of-life-mixup"],
          ["Hydrogen", "sign-of-life-mixup"],
        ],
        "All living organisms (both animals and plants) take in oxygen to break down food and release energy during respiration."
      ),
    },
    {
      subtopic: "signs-of-life",
      ...q(
        "A sunflower slowly turns its face from east to west during the day. What does this demonstrate?",
        "Living things respond to light",
        [
          ["Sunflowers walk across the field", "moves-means-alive"],
          ["Sunflowers produce baby seeds every hour", "sign-of-life-mixup"],
          ["Sunflowers turn into non-living wood", "never-alive-mixup"],
        ],
        "Turning towards the sun is an example of plant movement in response to the stimulus of sunlight."
      ),
    },
    {
      subtopic: "signs-of-life",
      ...q(
        "Which of the following is an example of living things eliminating waste products from their bodies?",
        "Excretion",
        [
          ["Digestion", "sign-of-life-mixup"],
          ["Germination", "cotyledon-function-mixup"],
          ["Photosynthesis", "sign-of-life-mixup"],
        ],
        "The removal of toxic metabolic waste substances from the body of an organism is called excretion."
      ),
    },
    {
      subtopic: "signs-of-life",
      ...q(
        "A tiny kitten grows into an adult cat over several months. This is an example of ___.",
        "Growth and development",
        [
          ["Only movement", "moves-means-alive"],
          ["Breathing faster", "sign-of-life-mixup"],
          ["Changing species", "sign-of-life-mixup"],
        ],
        "Permanent increase in size, mass, and structural complexity is called growth and development."
      ),
    },
    {
      subtopic: "signs-of-life",
      ...q(
        "Which of these is NOT true about living organisms?",
        "They can survive forever without water",
        [
          ["They need energy to stay alive", "sign-of-life-mixup"],
          ["They can sense changes in their surroundings", "sign-of-life-mixup"],
          ["They produce offspring similar to themselves", "sign-of-life-mixup"],
        ],
        "Water is essential for biochemical reactions in all living cells. No living organism can survive indefinitely without water."
      ),
    },

    // 5 living-vs-nonliving
    {
      subtopic: "living-vs-nonliving",
      ...q(
        "A crystal of salt in salty water can grow bigger over time. Why is the crystal still non-living?",
        "It grows by accumulating layers on the outside, not from living cells",
        [
          ["Because salt crystals are white", "colour-means-alive"],
          ["Because crystals can run", "moves-means-alive"],
          ["Because crystals breathe in oxygen", "sign-of-life-mixup"],
        ],
        "Non-living crystals grow merely by adding more material to their outer surface. They have no cells, metabolism, or reproduction."
      ),
    },
    {
      subtopic: "living-vs-nonliving",
      ...q(
        "Which pair consists of one LIVING thing and one NON-LIVING thing?",
        "Earthworm and Soil",
        [
          ["Cat and Dog", "sign-of-life-mixup"],
          ["Stone and Brick", "never-alive-mixup"],
          ["Sparrow and Rose bush", "sign-of-life-mixup"],
        ],
        "An earthworm is a living animal, while soil is a non-living natural mixture of weathered rock particles and minerals."
      ),
    },
    {
      subtopic: "living-vs-nonliving",
      ...q(
        "A robotic vacuum cleaner moves around the room, detects obstacles, and recharges its battery. Why is it non-living?",
        "It is a machine that does not breathe, grow, or reproduce",
        [
          ["Because it moves too quietly", "moves-means-alive"],
          ["Because it cleans the floor", "never-alive-mixup"],
          ["Because it has a battery", "needs-energy-means-alive"],
        ],
        "Robots are electronic machines programmed by humans. They lack cellular structure, biological growth, and reproduction."
      ),
    },
    {
      subtopic: "living-vs-nonliving",
      ...q(
        "Which of these natural features is non-living?",
        "A granite boulder",
        [
          ["A moss cushion", "never-alive-mixup"],
          ["A fungal mushroom", "never-alive-mixup"],
          ["A pine tree", "never-alive-mixup"],
        ],
        "A granite boulder is an inorganic rock. Moss, mushrooms, and pine trees are all living organisms."
      ),
    },
    {
      subtopic: "living-vs-nonliving",
      ...q(
        "Clouds in the sky can move, change shape, and shed rain. Why are clouds non-living?",
        "They are pushed by wind and cannot breathe, eat, or reproduce",
        [
          ["Because they are too high up", "moves-means-alive"],
          ["Because they are made of cotton", "never-alive-mixup"],
          ["Because they do not have eyes", "sign-of-life-mixup"],
        ],
        "Clouds are collections of tiny water droplets floating in the air moved by wind. They do not have life processes."
      ),
    },

    // 5 once-living
    {
      subtopic: "once-living",
      ...q(
        "Which of these materials was NEVER alive at any time?",
        "Glass window pane",
        [
          ["Paper notebook", "once-living-mixup"],
          ["Silk scarf", "once-living-mixup"],
          ["Woollen sweater", "once-living-mixup"],
        ],
        "Glass is made by melting sand (silica) and minerals; it was never alive. Paper comes from wood, silk from silkworms, and wool from sheep."
      ),
    },
    {
      subtopic: "once-living",
      ...q(
        "Coal is a black rock dug from the ground. Why do scientists say coal was once living?",
        "It formed from ancient trees and swamp plants buried millions of years ago",
        [
          ["Because coal breathes underground", "still-alive-mixup"],
          ["Because coal can still grow flowers", "still-alive-mixup"],
          ["Because coal is black like soil", "colour-means-alive"],
        ],
        "Coal is a fossil fuel created over millions of years by the heat and pressure acting on remains of prehistoric swamp vegetation."
      ),
    },
    {
      subtopic: "once-living",
      ...q(
        "A leather belt is made from animal hide. How should it be classified?",
        "Non-living now, but derived from something once living",
        [
          ["Living, because it came from an animal", "still-alive-mixup"],
          ["Never alive, like plastic", "never-alive-mixup"],
          ["A living plant product", "sign-of-life-mixup"],
        ],
        "The leather comes from cattle or sheep skin that was alive, but the treated leather belt itself is now non-living."
      ),
    },
    {
      subtopic: "once-living",
      ...q(
        "Which of these items found in a classroom comes from a plant that was once living?",
        "A wooden pencil",
        [
          ["A metal sharpener blade", "never-alive-mixup"],
          ["A plastic compass", "never-alive-mixup"],
          ["A steel ruler", "never-alive-mixup"],
        ],
        "The cedar wood surrounding the graphite lead comes from a tree that was once living."
      ),
    },
    {
      subtopic: "once-living",
      ...q(
        "Fossils are rock-like impressions or petrified bones found in stones. What were fossils originally?",
        "Remains of ancient living plants or animals",
        [
          ["Man-made clay toys carved in ancient times", "never-alive-mixup"],
          ["Living rocks that produce baby stones", "still-alive-mixup"],
          ["Minerals that grew without any living organism", "never-alive-mixup"],
        ],
        "Fossils are preserved remains, imprints, or traces of organisms that lived on Earth in ancient geological times."
      ),
    },
  ],

  // ==========================================
  // Topic 2: Plants: Life and Reproduction
  // ==========================================

  // Topic 2 Warm-up (8 questions)
  "sq-plants-warmup": [
    {
      subtopic: "seed-germination",
      ...q(
        "What are the three essential environmental conditions required for a seed to germinate?",
        "Water, air (oxygen), and warmth",
        [
          ["Sunlight, soil, and ice", "light-for-germination-myth"],
          ["Darkness, fertilizer, and cold", "germination-condition-mixup"],
          ["Sunlight, carbon dioxide, and sugar", "germination-condition-mixup"],
        ],
        "A dormant seed needs water (to soften its coat), oxygen (for respiration), and suitable warmth (temperature). It does not need sunlight to germinate."
      ),
    },
    {
      subtopic: "seed-germination",
      ...q(
        "Why does a germinating seed NOT require sunlight during its first few days underground?",
        "It relies on stored food inside its cotyledons",
        [
          ["Seeds get direct sugar from dry soil", "cotyledon-function-mixup"],
          ["Seeds absorb sunlight filtered through deep soil", "light-for-germination-myth"],
          ["Seeds do not need energy to grow into seedlings", "germination-condition-mixup"],
        ],
        "The cotyledons (seed leaves) store starch and nutrients to feed the growing embryo until green leaves emerge above ground to make food."
      ),
    },
    {
      subtopic: "seed-dispersal",
      ...q(
        "Why is seed dispersal important for the survival of plant species?",
        "It prevents competition among seedlings for water, light, and space",
        [
          ["It stops animals from eating any seeds", "dispersal-agent-mixup"],
          ["It ensures all seeds remain in dark shade", "dispersal-agent-mixup"],
          ["It prevents the parent plant from growing older", "dispersal-agent-mixup"],
        ],
        "If all seeds fell beneath the parent plant, the crowded seedlings would starve for light, water, and minerals. Dispersal spreads them out."
      ),
    },
    {
      subtopic: "seed-dispersal",
      ...q(
        "Dandelion and madar (aak) seeds possess tufts of fine, silky hair. How are they dispersed?",
        "By wind",
        [
          ["By water currents", "dispersal-agent-mixup"],
          ["By explosive bursting", "dispersal-agent-mixup"],
          ["By clinging to animal fur", "dispersal-agent-mixup"],
        ],
        "The light parachute-like hairs allow dandelion and madar seeds to be carried long distances by breeze and wind currents."
      ),
    },
    {
      subtopic: "seed-dispersal",
      ...q(
        "A coconut has a thick, fibrous outer husk that traps air inside. How is it adapted to travel?",
        "It floats on ocean and river water currents",
        [
          ["It flies through the air like a glider", "dispersal-agent-mixup"],
          ["It sticks to the fur of grazing cattle", "dispersal-agent-mixup"],
          ["It bursts open with a loud cracking noise", "dispersal-agent-mixup"],
        ],
        "The fibrous husk traps air pockets, making the heavy coconut buoyant so it can float across seas and colonise distant islands."
      ),
    },
    {
      subtopic: "vegetative-growth",
      ...q(
        "A farmer plants potato tubers with small 'eyes' cut out. What develops from these eyes?",
        "New potato shoots with roots and leaves",
        [
          ["Only flower petals without roots", "vegetative-part-mixup"],
          ["Seeds that must be planted again", "vegetative-part-mixup"],
          ["Apples and mangoes", "vegetative-part-mixup"],
        ],
        "The 'eyes' of a potato are vegetative buds on an underground stem. When planted in moist soil, each eye sprouts into a new plant."
      ),
    },
    {
      subtopic: "vegetative-growth",
      ...q(
        "Which plant can grow new baby plantlets along the notches of its mature leaves?",
        "Bryophyllum",
        [
          ["Rose", "vegetative-part-mixup"],
          ["Mango", "vegetative-part-mixup"],
          ["Wheat", "vegetative-part-mixup"],
        ],
        "Bryophyllum is famous for vegetative reproduction by leaves: small buds on the leaf margins develop tiny roots and grow into new plants."
      ),
    },
    {
      subtopic: "seed-germination",
      ...q(
        "What is the protective outer layer of a seed called?",
        "Seed coat (Testa)",
        [
          ["Cotyledon", "seed-part-mixup"],
          ["Plumule", "seed-part-mixup"],
          ["Radicle", "seed-part-mixup"],
        ],
        "The tough protective outer covering of a seed is called the seed coat (or testa), which guards the delicate embryo inside."
      ),
    },
  ],

  // Topic 2 Practice Leaf (6 questions, subtopic: seed-dispersal)
  "sq-plants-dispersal-quiz": [
    q(
      "Xanthium (cocklebur) and tiger nail seeds have stiff, hooked spines. How do these adaptations help in dispersal?",
      "They hook onto animal fur and human clothing",
      [
        ["They help the seed float on deep rivers", "dispersal-agent-mixup"],
        ["They catch wind gusts like a kite", "dispersal-agent-mixup"],
        ["They pop open when heated by direct sunlight", "dispersal-agent-mixup"],
      ],
      "Hooked spines catch on passing animals or livestock, carrying the seeds far away before they are scratched off or dropped."
    ),
    q(
      "When a pea pod or balsam fruit matures and dries out completely, how does it release its seeds?",
      "The pod bursts open suddenly, flicking the seeds outward",
      [
        ["It sinks into deep water to rot", "dispersal-agent-mixup"],
        ["It grows white wings to float in wind", "dispersal-agent-mixup"],
        ["It turns into sticky syrup", "dispersal-agent-mixup"],
      ],
      "Pea, balsam, and castor pods dry under tension and burst open with explosive force, scattering the seeds several feet away."
    ),
    q(
      "Lotus fruits have a spongy structure containing air chambers. Which agent disperses lotus seeds?",
      "Water",
      [
        ["Wind", "dispersal-agent-mixup"],
        ["Explosion", "dispersal-agent-mixup"],
        ["Sticky spines", "dispersal-agent-mixup"],
      ],
      "The spongy thalamus of the lotus floats on pond and lake water, allowing seeds to drift across the water before sinking into mud."
    ),
    q(
      "Why do birds and bats help in dispersing seeds of fruits like guava, berries, and figs?",
      "They eat the juicy flesh and pass the hard seeds unharmed in droppings",
      [
        ["They chew and destroy all the seed coats", "dispersal-agent-mixup"],
        ["They bury every seed deep underground with soil", "dispersal-agent-mixup"],
        ["They blow the seeds with their wing breeze", "dispersal-agent-mixup"],
      ],
      "Animals eat tasty fruits, and the hard inner seeds pass undamaged through their digestive tract, deposited far away with natural fertilizer."
    ),
    q(
      "Maple and drumstick seeds have thin papery flat extensions. What are these extensions?",
      "Wings that help the seeds spin and glide in the wind",
      [
        ["Fins to swim in rivers", "dispersal-agent-mixup"],
        ["Teeth to bite predators", "dispersal-agent-mixup"],
        ["Sponges to absorb pool water", "dispersal-agent-mixup"],
      ],
      "Winged seeds rotate like helicopter blades as they fall, catching wind drafts so they travel far from the parent tree."
    ),
    q(
      "Which of these seeds is dispersed by animal fur because of its clinging hooks?",
      "Xanthium",
      [
        ["Dandelion", "dispersal-agent-mixup"],
        ["Coconut", "dispersal-agent-mixup"],
        ["Pea", "dispersal-agent-mixup"],
      ],
      "Xanthium seeds have small curved hooks that cling tenaciously to animal coats, hair, and clothing."
    ),
  ],

  // Topic 2 Gate Pool (15 questions: 5 seed-germination, 5 seed-dispersal, 5 vegetative-growth)
  "sq-plants-gate-pool": [
    // 5 seed-germination
    {
      subtopic: "seed-germination",
      ...q(
        "During seed germination, which part of the embryo grows out first into the soil?",
        "The radicle (baby root)",
        [
          ["The plumule (baby shoot)", "seed-part-mixup"],
          ["The flower bud", "seed-part-mixup"],
          ["The seed coat", "seed-part-mixup"],
        ],
        "The radicle emerges first from the seed to anchor the seedling in the soil and absorb moisture and minerals."
      ),
    },
    {
      subtopic: "seed-germination",
      ...q(
        "Gram, bean, and pea seeds have two cotyledons. What are these seeds called?",
        "Dicotyledonous (Dicot) seeds",
        [
          ["Monocotyledonous seeds", "cotyledon-function-mixup"],
          ["Spore-bearing seeds", "spore-seed-mixup"],
          ["Acellular seeds", "germination-condition-mixup"],
        ],
        "Seeds with two cotyledons are called dicots. Seeds with only one cotyledon (like maize and rice) are monocots."
      ),
    },
    {
      subtopic: "seed-germination",
      ...q(
        "If healthy bean seeds are kept in a freezer at zero degrees Celsius with plenty of water and air, will they germinate?",
        "No, because seeds need warmth for germination",
        [
          ["Yes, because cold makes seeds sprout faster", "germination-condition-mixup"],
          ["Yes, because only water is necessary", "germination-condition-mixup"],
          ["Yes, if placed under a bright lamp", "light-for-germination-myth"],
        ],
        "Seeds require a suitable warm temperature (typically 20°C–30°C) for their metabolic enzymes to function; freezing prevents germination."
      ),
    },
    {
      subtopic: "seed-germination",
      ...q(
        "What is the part of the embryo that grows upward to form the stem and leaves called?",
        "Plumule",
        [
          ["Radicle", "seed-part-mixup"],
          ["Cotyledon", "seed-part-mixup"],
          ["Stoma", "seed-part-mixup"],
        ],
        "The plumule is the baby shoot of the embryo that grows upward towards light to develop into the stem and green leaves."
      ),
    },
    {
      subtopic: "seed-germination",
      ...q(
        "Why do seeds soaked in boiled cooled water covered with a thick oil layer fail to germinate?",
        "Boiled water lacks dissolved air (oxygen)",
        [
          ["Because water makes seed coats too hard", "germination-condition-mixup"],
          ["Because seeds need soil chemicals to open", "germination-condition-mixup"],
          ["Because the oil layer makes the seeds too warm", "germination-condition-mixup"],
        ],
        "Boiling drives out dissolved oxygen, and the oil prevents fresh air from entering. Without oxygen, seeds cannot respire and germinate."
      ),
    },

    // 5 seed-dispersal
    {
      subtopic: "seed-dispersal",
      ...q(
        "Which of the following is a pair of seeds BOTH dispersed by WIND?",
        "Cotton and Dandelion",
        [
          ["Coconut and Lotus", "dispersal-agent-mixup"],
          ["Xanthium and Mango", "dispersal-agent-mixup"],
          ["Pea and Coconut", "dispersal-agent-mixup"],
        ],
        "Both cotton and dandelion produce light, hairy seeds specifically adapted to be carried away by wind currents."
      ),
    },
    {
      subtopic: "seed-dispersal",
      ...q(
        "How are seeds of the castor plant and touch-me-not balsam plant dispersed?",
        "By explosive mechanism (bursting of dry pods)",
        [
          ["By floating on sea water", "dispersal-agent-mixup"],
          ["By heavy windstorms only", "dispersal-agent-mixup"],
          ["By sticking to cow hooves", "dispersal-agent-mixup"],
        ],
        "Dry castor and balsam pods suddenly rupture with sudden tension, hurling seeds away from the parent plant."
      ),
    },
    {
      subtopic: "seed-dispersal",
      ...q(
        "Why do coconuts easily colonise coastal shores and distant tropical islands?",
        "Their buoyant fibrous husk lets them float across seas for months",
        [
          ["Migratory birds carry heavy coconuts in their beaks", "dispersal-agent-mixup"],
          ["Strong storm winds blow whole coconuts across clouds", "dispersal-agent-mixup"],
          ["Coconuts burst open like firecrackers", "dispersal-agent-mixup"],
        ],
        "The fibrous husk traps air, allowing the coconut to float unharmed across ocean currents until it washes up on a sandy beach."
      ),
    },
    {
      subtopic: "seed-dispersal",
      ...q(
        "Which of these seeds has papery wing-like structures for wind dispersal?",
        "Drumstick (Moringa)",
        [
          ["Mango", "dispersal-agent-mixup"],
          ["Coconut", "dispersal-agent-mixup"],
          ["Castor", "dispersal-agent-mixup"],
        ],
        "Drumstick seeds have three papery wings attached to them that assist in catching wind drafts."
      ),
    },
    {
      subtopic: "seed-dispersal",
      ...q(
        "Humans buy apples, eat the sweet pulp, and toss the cores into garden soil. What type of dispersal is this?",
        "Dispersal by animals and humans",
        [
          ["Dispersal by explosion", "dispersal-agent-mixup"],
          ["Dispersal by water currents", "dispersal-agent-mixup"],
          ["Dispersal by air wings", "dispersal-agent-mixup"],
        ],
        "Fleshy, nutritious fruits have evolved specifically to attract animals and humans, who carry the seeds away to new spots."
      ),
    },

    // 5 vegetative-growth
    {
      subtopic: "vegetative-growth",
      ...q(
        "Ginger is an underground plant structure. From which part does a new ginger plant sprout?",
        "Underground stem (Rhizome)",
        [
          ["Tap root", "vegetative-part-mixup"],
          ["Flower petal", "vegetative-part-mixup"],
          ["True fruit", "vegetative-part-mixup"],
        ],
        "Ginger is a modified underground stem called a rhizome with nodes and scale buds that grow into new shoots."
      ),
    },
    {
      subtopic: "vegetative-growth",
      ...q(
        "Which of these garden plants is commonly multiplied by cutting a healthy piece of stem and planting it?",
        "Rose",
        [
          ["Wheat", "vegetative-part-mixup"],
          ["Maize", "vegetative-part-mixup"],
          ["Papaya", "vegetative-part-mixup"],
        ],
        "Rose, sugarcane, and hibiscus are traditionally propagated using stem cuttings with active buds."
      ),
    },
    {
      subtopic: "vegetative-growth",
      ...q(
        "Sweet potato and dahlia plants can produce new plants from which vegetative organ?",
        "Modified swollen roots",
        [
          ["Green leaves", "vegetative-part-mixup"],
          ["Tree bark", "vegetative-part-mixup"],
          ["Flower seeds only", "vegetative-part-mixup"],
        ],
        "Sweet potatoes and dahlia have fleshy root tubers that can sprout buds to generate complete new plants."
      ),
    },
    {
      subtopic: "vegetative-growth",
      ...q(
        "Non-flowering plants like ferns and mosses do not produce flowers or seeds. How do they reproduce?",
        "By producing tiny microscopic spores",
        [
          ["By exploding their big fruits", "spore-seed-mixup"],
          ["By growing only from sweet roots", "vegetative-part-mixup"],
          ["They cannot reproduce at all", "spore-seed-mixup"],
        ],
        "Ferns and mosses produce dark clusters of spore cases (sori) under their fronds, releasing thousands of light spores."
      ),
    },
    {
      subtopic: "vegetative-growth",
      ...q(
        "An onion bulb placed on a glass of water soon grows green leaves on top and white roots below. What is an onion?",
        "An underground stem surrounded by fleshy scale leaves",
        [
          ["A true tap root like a carrot", "vegetative-part-mixup"],
          ["A dried fruit containing one giant seed", "vegetative-part-mixup"],
          ["A single swollen flower bud", "vegetative-part-mixup"],
        ],
        "An onion is a modified underground stem (bulb) with concentric fleshy scale leaves that store food."
      ),
    },
  ],

  // ==========================================
  // Topic 3: Animals: Habitats and Adaptations
  // ==========================================

  // Topic 3 Warm-up (8 questions)
  "sq-animals-warmup": [
    {
      subtopic: "breathing-organs",
      ...q(
        "How do fish take in oxygen while swimming underwater?",
        "Water passes over their gills where dissolved oxygen is absorbed",
        [
          ["They breathe air into large lungs like dogs", "breathing-organ-mixup"],
          ["They absorb oxygen through spiracles on their tail", "insect-breathing-mixup"],
          ["Fish do not need oxygen to stay alive", "breathing-organ-mixup"],
        ],
        "Fish gulp water through their mouth and pump it across feathery gills, which absorb oxygen directly from water into blood vessels."
      ),
    },
    {
      subtopic: "breathing-organs",
      ...q(
        "Insects such as grasshoppers, cockroaches, and bees breathe through tiny body openings called ___.",
        "Spiracles",
        [
          ["Gills", "breathing-organ-mixup"],
          ["Stomata", "breathing-organ-mixup"],
          ["Lungs", "breathing-organ-mixup"],
        ],
        "Insects have small pores along the sides of their abdomen and thorax called spiracles, connected to branching air tubes (tracheae)."
      ),
    },
    {
      subtopic: "breathing-organs",
      ...q(
        "An adult frog can live both on land and in water. How does it breathe when submerged in a pond?",
        "Through its thin, moist skin",
        [
          ["Through its lungs", "amphibian-breathing-mixup"],
          ["Through gills located in its mouth", "breathing-organ-mixup"],
          ["Frogs stop breathing entirely underwater", "amphibian-breathing-mixup"],
        ],
        "On land, adult frogs breathe using lungs. But in water, oxygen dissolves into moisture on their skin and enters blood vessels directly."
      ),
    },
    {
      subtopic: "body-coverings",
      ...q(
        "Which protective body covering shields snails, tortoises, and clams from predators?",
        "A hard calcified shell",
        [
          ["Soft down feathers", "body-covering-mixup"],
          ["Thick woollen fleece", "body-covering-mixup"],
          ["Slimy moist skin", "body-covering-mixup"],
        ],
        "A shell is a hard external covering made of calcium minerals that protects slow-moving soft-bodied animals from enemies."
      ),
    },
    {
      subtopic: "body-coverings",
      ...q(
        "How does the thick white fur coat of a polar bear help it survive in freezing Arctic conditions?",
        "It traps a layer of insulating air and blends with the snowy ice",
        [
          ["It makes the polar bear swim faster than fish", "body-covering-mixup"],
          ["It absorbs green light to make food", "camouflage-mixup"],
          ["It attracts seals by glowing in the dark", "camouflage-mixup"],
        ],
        "Thick fur traps body heat to prevent hypothermia, and its white colour acts as camouflage against snow while stalking prey."
      ),
    },
    {
      subtopic: "feeding-movement",
      ...q(
        "Why do Siberian cranes undertake an arduous journey of thousands of kilometres to India every winter?",
        "To escape freezing sub-zero weather and find food and nesting grounds",
        [
          ["Because they enjoy flying across mountain peaks", "migration-reason-mixup"],
          ["Because Siberia runs out of river rocks", "migration-reason-mixup"],
          ["To change their feather colours in sunlight", "camouflage-mixup"],
        ],
        "In Siberian winters, lakes freeze over and food becomes unavailable. Cranes migrate to warmer wetlands in India like Bharatpur."
      ),
    },
    {
      subtopic: "body-coverings",
      ...q(
        "A chameleon changes its skin pattern to match tree branches, and an arctic hare turns white in winter. What is this adaptation?",
        "Camouflage",
        [
          ["Hibernation", "body-covering-mixup"],
          ["Migration", "migration-reason-mixup"],
          ["Photosynthesis", "sign-of-life-mixup"],
        ],
        "Camouflage is the ability of an animal to blend in with its background environment to avoid predators or sneak up on prey."
      ),
    },
    {
      subtopic: "breathing-organs",
      ...q(
        "Whales and dolphins live their entire lives in the sea. How do they breathe?",
        "They surface to breathe atmospheric air using lungs through blowholes",
        [
          ["They use feathery gills like sharks underwater", "breathing-organ-mixup"],
          ["They absorb dissolved oxygen through their tail fins", "breathing-organ-mixup"],
          ["They drink ocean water to separate oxygen inside their stomach", "breathing-organ-mixup"],
        ],
        "Whales and dolphins are mammals, not fish. They have lungs and must come to the ocean surface to exhale and breathe air through blowholes."
      ),
    },
  ],

  // Topic 3 Practice Leaf (6 questions, subtopic: body-coverings)
  "sq-animals-adaptations-quiz": [
    q(
      "Reptiles such as snakes, lizards, and crocodiles have dry, horny scales on their skin. What is the primary function of these scales?",
      "To prevent internal water loss and protect against rough ground",
      [
        ["To help them fly through warm air", "body-covering-mixup"],
        ["To absorb oxygen directly from sunlight", "breathing-organ-mixup"],
        ["To make their bodies soft and spongy", "body-covering-mixup"],
      ],
      "Dry scales form a tough, waterproof barrier that allows reptiles to survive in hot, dry environments without dehydrating."
    ),
    q(
      "Why are the hollow bones and light feathers of birds critical adaptations for their lifestyle?",
      "They reduce body weight and provide streamlined lift for flying",
      [
        ["They allow birds to sink into deep ocean mud", "body-covering-mixup"],
        ["They make birds heavy enough to crush seeds", "body-covering-mixup"],
        ["They keep the bird cold during winter", "body-covering-mixup"],
      ],
      "Pneumatic (air-filled hollow) bones keep a bird's skeleton very light, while strong aerodynamic feathers enable flight and keep them warm."
    ),
    q(
      "A stick insect looks remarkably like a dry wooden twig on a bush. How does this adaptation benefit the insect?",
      "Predatory birds fail to spot and eat it",
      [
        ["It allows the insect to drink tree sap faster", "camouflage-mixup"],
        ["It helps the insect produce plant leaves", "camouflage-mixup"],
        ["It makes the insect run faster than ants", "body-covering-mixup"],
      ],
      "By mimicking a twig (protective mimicry / camouflage), the insect remains undetected by hungry birds and lizards."
    ),
    q(
      "Which animal curls up into a ball presenting hard overlapping armour plates when attacked?",
      "Armadillo / Pangolin",
      [
        ["Jellyfish", "body-covering-mixup"],
        ["Earthworm", "body-covering-mixup"],
        ["Goldfish", "body-covering-mixup"],
      ],
      "Pangolins and armadillos possess tough keratin scales or bony armor plates that shield their soft vulnerable bellies."
    ),
    q(
      "How do the overlapping, slimy scales on a freshwater fish assist in its locomotion?",
      "They reduce water friction, allowing smooth swimming",
      [
        ["They generate electricity to shock fish", "body-covering-mixup"],
        ["They act as sharp hooks to hold seaweeds", "body-covering-mixup"],
        ["They store freshwater for winter", "body-covering-mixup"],
      ],
      "Streamlined fish bodies covered in backward-facing slimy scales minimise drag and turbulence as they swim through water."
    ),
    q(
      "Why does a porcupine have sharp, stiff quills (modified hairs) on its back?",
      "To defend itself by stabbing attacking predators",
      [
        ["To catch flying insects in the dark", "body-covering-mixup"],
        ["To swim across deep lakes", "body-covering-mixup"],
        ["To dig deep tunnels in hard stone", "body-covering-mixup"],
      ],
      "Porcupine quills are sharp, barbed hairs that penetrate the skin of attackers, serving as a powerful deterrent against predators."
    ),
  ],

  // Topic 3 Gate Pool (15 questions: 5 breathing-organs, 5 body-coverings, 5 feeding-movement)
  "sq-animals-gate-pool": [
    // 5 breathing-organs
    {
      subtopic: "breathing-organs",
      ...q(
        "An earthworm has neither lungs nor gills. How does it exchange gases with its environment?",
        "Through its thin, constantly moist skin surface",
        [
          ["Through spiracles on its antennae", "insect-breathing-mixup"],
          ["Through its mouth only once a week", "breathing-organ-mixup"],
          ["Earthworms do not take in any oxygen", "breathing-organ-mixup"],
        ],
        "Oxygen dissolves in moisture on the earthworm's thin skin and diffuses directly into blood capillaries."
      ),
    },
    {
      subtopic: "breathing-organs",
      ...q(
        "A tadpole is the larval stage of a frog. What organ does a young tadpole use to breathe in pond water?",
        "Gills",
        [
          ["Large lungs", "amphibian-breathing-mixup"],
          ["Spiracles", "insect-breathing-mixup"],
          ["Dry scales", "body-covering-mixup"],
        ],
        "Tadpoles live entirely in water and breathe through gills. As they metamorphose into adult frogs, they develop lungs."
      ),
    },
    {
      subtopic: "breathing-organs",
      ...q(
        "Which of the following organisms breathes through lungs?",
        "Crocodile",
        [
          ["Prawn", "breathing-organ-mixup"],
          ["Tadpole", "amphibian-breathing-mixup"],
          ["Silverfish", "insect-breathing-mixup"],
        ],
        "Crocodiles are reptiles with well-developed lungs. Prawns and tadpoles have gills, and silverfish have spiracles."
      ),
    },
    {
      subtopic: "breathing-organs",
      ...q(
        "Why does an earthworm crawl out onto the surface of the soil during heavy rains?",
        "Water fills soil air spaces, so the worm cannot breathe underground",
        [
          ["Because earthworms love swimming in sunlight", "breathing-organ-mixup"],
          ["To drink mud water from puddles", "needs-energy-means-alive"],
          ["Because the rain makes soil too hot", "breathing-organ-mixup"],
        ],
        "Rainwater saturates soil pores, driving out air. Earthworms come to the surface to avoid suffocating underground."
      ),
    },
    {
      subtopic: "breathing-organs",
      ...q(
        "Which group of animals possesses microscopic spiracles and tracheae for breathing?",
        "Insects (cockroach, mosquito, bee)",
        [
          ["Fishes (salmon, tuna, shark)", "breathing-organ-mixup"],
          ["Birds (sparrow, pigeon, eagle)", "breathing-organ-mixup"],
          ["Mammals (cat, dog, goat)", "breathing-organ-mixup"],
        ],
        "Insects have a specialized tracheal respiratory system where air enters via spiracles and flows through tracheae directly to cells."
      ),
    },

    // 5 body-coverings
    {
      subtopic: "body-coverings",
      ...q(
        "Which animal uses its thick layer of fat called 'blubber' along with water-repellent skin to stay warm?",
        "Seal / Whale",
        [
          ["Desert camel", "body-covering-mixup"],
          ["Chameleon", "body-covering-mixup"],
          ["Grasshopper", "body-covering-mixup"],
        ],
        "Marine mammals like seals and whales have a thick sub-dermal layer of blubber (fat) that insulates their body in icy waters."
      ),
    },
    {
      subtopic: "body-coverings",
      ...q(
        "How do feathers help birds in ways OTHER than flying?",
        "They trap air to keep the bird's body warm and provide waterproof protection",
        [
          ["They help the bird breathe underwater", "breathing-organ-mixup"],
          ["They digest hard grain seeds in the stomach", "body-covering-mixup"],
          ["They replace the bird's need to drink water", "body-covering-mixup"],
        ],
        "Down feathers provide insulation against cold, and contour feathers coated in preen oil repel rain and water."
      ),
    },
    {
      subtopic: "body-coverings",
      ...q(
        "The snow leopard in the Himalayas has thick patterned spotted fur and wide fur-padded paws. How do these help?",
        "Paws act as snowshoes, and fur provides warmth and camouflage among rocks",
        [
          ["They help the leopard fly across valleys", "body-covering-mixup"],
          ["They allow the leopard to breathe inside snow", "breathing-organ-mixup"],
          ["They turn the leopard into a herbivore", "teeth-diet-mixup"],
        ],
        "Wide paws distribute body weight so the leopard does not sink in soft snow, while fur provides warmth and mountain camouflage."
      ),
    },
    {
      subtopic: "body-coverings",
      ...q(
        "Which of the following animals sheds its dry, scaly skin periodically in a process called 'moulting'?",
        "Snake",
        [
          ["Sheep", "body-covering-mixup"],
          ["Snail", "body-covering-mixup"],
          ["Duck", "body-covering-mixup"],
        ],
        "As a snake grows, its outer layer of dry scales does not stretch; it sheds the old skin periodically in a single piece (moulting/ecdysis)."
      ),
    },
    {
      subtopic: "body-coverings",
      ...q(
        "The stripes on a zebra and the spots on a cheetah make them difficult to distinguish in tall grasslands. This is an example of ___.",
        "Camouflage",
        [
          ["Migration", "migration-reason-mixup"],
          ["Excretion", "sign-of-life-mixup"],
          ["Hibernation", "body-covering-mixup"],
        ],
        "Disruptive coloration and camouflage break up the outline of an animal, making it difficult for predators or prey to see them in grasslands."
      ),
    },

    // 5 feeding-movement
    {
      subtopic: "feeding-movement",
      ...q(
        "Which bird holds the world record for the longest migration, travelling from the Arctic to the Antarctic and back each year?",
        "Arctic Tern",
        [
          ["Siberian Crane", "migration-reason-mixup"],
          ["House Sparrow", "migration-reason-mixup"],
          ["Kingfisher", "migration-reason-mixup"],
        ],
        "The Arctic Tern flies roughly 70,000 kilometres every year between the Arctic and Antarctic, experiencing two summers annually."
      ),
    },
    {
      subtopic: "feeding-movement",
      ...q(
        "Why do herbivores (like cows and deer) have flat, broad molars and premolars?",
        "To grind tough grass and plant fibres thoroughly",
        [
          ["To tear flesh and crack thick bones", "teeth-diet-mixup"],
          ["To catch flying insects in the dark", "teeth-diet-mixup"],
          ["To inject venom into predators", "teeth-diet-mixup"],
        ],
        "Plant cell walls contain tough cellulose. Herbivores possess wide, ridged flat molar teeth to grind plant material into fine pulp."
      ),
    },
    {
      subtopic: "feeding-movement",
      ...q(
        "How do ducks and frogs use their webbed feet in water?",
        "Webbed feet act like paddles to push water and propel them forward",
        [
          ["To grip slippery tree branches high up", "body-covering-mixup"],
          ["To dig underground burrows in stone", "body-covering-mixup"],
          ["To filter salt from sea water", "body-covering-mixup"],
        ],
        "The skin stretched between toes acts like a flipper or paddle, pushing a large volume of water backwards to swim efficiently."
      ),
    },
    {
      subtopic: "feeding-movement",
      ...q(
        "Carnivores like tigers and lions have prominent, long, sharp pointed teeth called ___.",
        "Canines",
        [
          ["Incisors", "teeth-diet-mixup"],
          ["Molars", "teeth-diet-mixup"],
          ["Premolars", "teeth-diet-mixup"],
        ],
        "Long, pointed, and curved canine teeth are adapted for gripping, holding prey, and tearing meat."
      ),
    },
    {
      subtopic: "feeding-movement",
      ...q(
        "Monarch butterflies travel thousands of kilometres from Canada and the United States to Mexico before winter sets in. This journey is called ___.",
        "Migration",
        [
          ["Metamorphosis", "sign-of-life-mixup"],
          ["Camouflage", "camouflage-mixup"],
          ["Germination", "cotyledon-function-mixup"],
        ],
        "Mass seasonal movement of animals from colder or dry regions to warmer, hospitable breeding grounds is termed migration."
      ),
    },
  ],

  // ==========================================
  // Unit 1 Boss: Mixed Living World Assessment (15 questions)
  // ==========================================
  "sq-u1-test": [
    q(
      "Which of these features is unique to LIVING things and NEVER seen in non-living things?",
      "Reproduction and cellular growth",
      [
        ["Moving from place to place", "moves-means-alive"],
        ["Increasing in physical size", "sign-of-life-mixup"],
        ["Producing heat or sound", "needs-energy-means-alive"],
      ],
      "Crystals can grow and machines can move or produce sounds, but only living organisms possess cells and can reproduce."
    ),
    q(
      "A student places two healthy gram seeds in moist soil. Pot A is kept under bright sunlight, and Pot B is placed in a completely dark cupboard. What will happen in the first three days?",
      "Both seeds will germinate because seeds do not need sunlight to sprout",
      [
        ["Only seed in Pot A will germinate", "light-for-germination-myth"],
        ["Only seed in Pot B will germinate", "light-for-germination-myth"],
        ["Neither seed will germinate without green leaves", "germination-condition-mixup"],
      ],
      "Seed germination requires water, air, and warmth. Stored food in cotyledons feeds the embryo; sunlight is not needed until green leaves emerge."
    ),
    q(
      "Which of these seeds is dispersed by animal fur because of sharp curved hooks?",
      "Xanthium (cocklebur)",
      [
        ["Dandelion", "dispersal-agent-mixup"],
        ["Coconut", "dispersal-agent-mixup"],
        ["Maple", "dispersal-agent-mixup"],
      ],
      "Xanthium seeds have sharp hooks that catch onto passing animal fur or human socks."
    ),
    q(
      "Bryophyllum reproduces vegetatively using its ___.",
      "Leaves",
      [
        ["Stem cuttings", "vegetative-part-mixup"],
        ["Underground roots", "vegetative-part-mixup"],
        ["Exploding pods", "vegetative-part-mixup"],
      ],
      "Bryophyllum produces miniature plantlets with roots along the notches of its leaf margins."
    ),
    q(
      "How does an adult frog breathe when swimming in pond water?",
      "Through its thin, moist skin",
      [
        ["Through its lungs", "amphibian-breathing-mixup"],
        ["Through feathery gills", "breathing-organ-mixup"],
        ["Through its webbed feet", "breathing-organ-mixup"],
      ],
      "Adult frogs have lungs for breathing on land, but underwater they breathe entirely through cutaneous respiration (moist skin)."
    ),
    q(
      "Insects like grasshoppers, houseflies, and butterflies breathe through ___.",
      "Spiracles along the sides of their body",
      [
        ["Gills inside their head", "breathing-organ-mixup"],
        ["Moist skin all over", "breathing-organ-mixup"],
        ["Lungs inside their chest", "breathing-organ-mixup"],
      ],
      "Insects take in air through spiracles (air holes) connected to a network of internal tracheal tubes."
    ),
    q(
      "Which of these items was once part of a living plant but is non-living now?",
      "A wooden cricket bat",
      [
        ["A steel nail", "never-alive-mixup"],
        ["A plastic bottle", "never-alive-mixup"],
        ["A clay brick", "never-alive-mixup"],
      ],
      "Cricket bats are made from willow wood, which was once part of a living tree."
    ),
    q(
      "Why does a coconut seed float safely across ocean waves?",
      "It has a light, fibrous husk containing air pockets",
      [
        ["It has feathers that act like sails", "dispersal-agent-mixup"],
        ["It is lighter than water droplets", "dispersal-agent-mixup"],
        ["It is hollow with no seed inside", "dispersal-agent-mixup"],
      ],
      "The thick fibrous mesocarp of the coconut traps air, giving it buoyancy to float across water bodies."
    ),
    q(
      "What is the first organ to emerge from a germinating seed?",
      "The radicle, which grows downward into soil as a root",
      [
        ["The plumule, which grows into flowers", "seed-part-mixup"],
        ["The cotyledon, which flies in the air", "seed-part-mixup"],
        ["The seed coat, which turns into green leaves", "seed-part-mixup"],
      ],
      "The radicle emerges first to anchor the new seedling in the soil and absorb moisture."
    ),
    q(
      "Whales and dolphins come to the ocean surface regularly. Why do they do this?",
      "To exhale and inhale atmospheric air through their blowholes using lungs",
      [
        ["To catch flying birds in the sky", "breathing-organ-mixup"],
        ["Because their gills cannot work in deep water", "breathing-organ-mixup"],
        ["To drink rainwater from clouds", "needs-energy-means-alive"],
      ],
      "Whales and dolphins are mammals with lungs; they cannot breathe underwater and must surface to take in air."
    ),
    q(
      "Which animal travels from Siberia to India during winter to avoid extreme cold?",
      "Siberian Crane",
      [
        ["Arctic Hare", "migration-reason-mixup"],
        ["Chameleon", "migration-reason-mixup"],
        ["King Cobra", "migration-reason-mixup"],
      ],
      "Siberian Cranes migrate thousands of kilometres south to Indian bird sanctuaries like Bharatpur every winter."
    ),
    q(
      "A stick insect resembling a tree twig and a chameleon changing colour are examples of ___.",
      "Camouflage",
      [
        ["Migration", "migration-reason-mixup"],
        ["Vegetative growth", "vegetative-part-mixup"],
        ["Hibernation", "body-covering-mixup"],
      ],
      "Camouflage allows organisms to blend into their surroundings to avoid detection by predators or prey."
    ),
    q(
      "Potatoes, ginger, and onions reproduce vegetatively through which plant part?",
      "Modified underground stems",
      [
        ["True swollen roots", "vegetative-part-mixup"],
        ["Flower buds", "vegetative-part-mixup"],
        ["Seed pods", "vegetative-part-mixup"],
      ],
      "Potatoes (tubers), ginger (rhizomes), and onions (bulbs) are all specialized underground stem modifications."
    ),
    q(
      "Why do snakes and lizards have dry, horny scales on their skin?",
      "To prevent loss of water from their bodies in dry habitats",
      [
        ["To absorb oxygen directly from soil", "breathing-organ-mixup"],
        ["To help them run on two legs", "body-covering-mixup"],
        ["To generate heat during winter", "body-covering-mixup"],
      ],
      "Scales form a tough waterproof covering that shields reptiles from rough terrain and prevents internal dehydration."
    ),
    q(
      "Which of these seeds is dispersed by the explosive bursting of its dry pod?",
      "Pea / Balsam",
      [
        ["Dandelion", "dispersal-agent-mixup"],
        ["Cotton", "dispersal-agent-mixup"],
        ["Coconut", "dispersal-agent-mixup"],
      ],
      "Pea and balsam fruits dry under internal tension until they split and burst open, flicking seeds outwards."
    ),
  ],
};

export const readings = {};
export const wordTables = {};

// ---------- The tree ----------
const u1 = forGrades(unit("sq-u1", 1, "The Living World"), [3, 4, 5]);

// Topic 0: Living and non-living
const living = forGrades(
  main("sq-living", u1.id, 0, "Living and non-living", [
    study("sq-living-study"),
    quiz("sq-living-warmup"),
  ]),
  [3, 4, 5]
);

const livingP1 = forGrades(
  withSubtopic(
    practice(
      "sq-living-p1",
      living,
      1,
      "Tricky signs of life",
      "medium",
      [quiz("sq-living-tricky")]
    ),
    "signs-of-life"
  ),
  [3, 4, 5]
);

const livingGate = forGrades(
  gate(
    "sq-living-gate",
    living,
    "Living World Challenge",
    "sq-living-gate-pool",
    {
      "signs-of-life": "Signs of life",
      "living-vs-nonliving": "Living vs non-living",
      "once-living": "Once living things",
    }
  ),
  [3, 4, 5]
);

const livingEndless = forGrades(endless(living), [3, 4, 5]);

// Topic 1: Plants: Life and Reproduction
const plants = forGrades(
  main("sq-plants", u1.id, 1, "Plants: Life & Growth", [
    study("sq-plants-study"),
    quiz("sq-plants-warmup"),
  ]),
  [4, 5]
);

const plantsP1 = forGrades(
  withSubtopic(
    practice(
      "sq-plants-p1",
      plants,
      1,
      "Seed Travel Master",
      "medium",
      [quiz("sq-plants-dispersal-quiz")]
    ),
    "seed-dispersal"
  ),
  [4, 5]
);

const plantsGate = forGrades(
  gate(
    "sq-plants-gate",
    plants,
    "Plant Kingdom Challenge",
    "sq-plants-gate-pool",
    {
      "seed-germination": "Seeds and germination",
      "seed-dispersal": "Seed dispersal",
      "vegetative-growth": "Growing from plant parts",
    }
  ),
  [4, 5]
);

const plantsEndless = forGrades(endless(plants), [4, 5]);

// Topic 2: Animals: Habitats and Adaptations
const animals = forGrades(
  main("sq-animals", u1.id, 2, "Animals: Habitats & Adaptations", [
    study("sq-animals-study"),
    quiz("sq-animals-warmup"),
  ]),
  [4, 5]
);

const animalsP1 = forGrades(
  withSubtopic(
    practice(
      "sq-animals-p1",
      animals,
      1,
      "Extreme Adaptations",
      "hard",
      [quiz("sq-animals-adaptations-quiz")]
    ),
    "body-coverings"
  ),
  [4, 5]
);

const animalsGate = forGrades(
  gate(
    "sq-animals-gate",
    animals,
    "Animal Kingdom Challenge",
    "sq-animals-gate-pool",
    {
      "breathing-organs": "How animals breathe",
      "body-coverings": "Body coverings and shells",
      "feeding-movement": "Movement and migration",
    }
  ),
  [4, 5]
);

const animalsEndless = forGrades(endless(animals), [4, 5]);

// Unit 1 Boss
const u1Boss = forGrades(
  boss(
    "sq-u1-boss",
    u1.id,
    "Living World Boss",
    "sq-u1-test",
    "Dr. Bio-Mixer is confusing the living world! Prove your science skills across plants, animals and living things to restore nature."
  ),
  [4, 5]
);

// Unit 2 Teaser (coming soon)
const u2 = unit("sq-u2", 2, "Human Body and Health", { comingSoon: true });

export const nodes = [
  u1,
  living,
  livingP1,
  livingGate,
  livingEndless,
  plants,
  plantsP1,
  plantsGate,
  plantsEndless,
  animals,
  animalsP1,
  animalsGate,
  animalsEndless,
  u1Boss,
  u2,
];
