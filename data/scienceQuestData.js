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
- 📏 They **grow** and develop over time from inside their cells.
- 🐣 They **reproduce** (produce young ones of their own kind or make seeds).
- 👀 They **respond** to stimuli (a sunflower turns toward the sun; you pull your hand away from a hot object).
- 🍂 They have a life cycle and eventually **die**.

---

### 🪨 Non-living things

Non-living things do **not** grow from within, breathe, feed, or reproduce by themselves.

| Living | Non-living (Man-made) | Non-living (Natural) |
|---|---|---|
| Mango tree | Bicycle | Rock |
| Cat | Plastic bottle | River |
| Honeybee | Car | Cloud |

> 💡 **Careful!** A car **moves** and needs **petrol** for energy, but it cannot grow, reproduce, or breathe. Therefore, it is **non-living**. Similarly, clouds move across the sky and expand in size, but they do not show life processes like breathing or reproducing.

---

### 🪵 Once living but non-living now

Some non-living things were once part of a living organism:

- **Wooden table:** made from wood that came from a living tree.
- **Cotton shirt:** made from cotton fibres produced by a cotton plant.
- **Leather shoes:** made from animal hide.
- **Coal:** formed from ancient swamp plants buried millions of years ago.

In contrast, things like rocks, gold, glass, and synthetic plastic were **never alive**.

> 🌰 **Seed Mystery:** A dry seed in a jar looks still and does not eat, but it is **living**! Inside the seed is a sleeping baby plant (embryo). With water, air, and warmth, it wakes up and sprouts!`,
  },

  "sq-plants-study": {
    name: "How Plants Grow and Reproduce",
    author: "Apprec8",
    content: `### 🌰 Structure of a Seed

Most flowering plants begin their life as a seed. A seed has three main parts:

1. **Seed coat (Testa):** The tough outer skin that protects the baby plant inside.
2. **Seed leaves (Cotyledons):** The fleshy parts that store food for the baby plant in dicots like gram, pea, and bean (monocots like maize store food in endosperm).
3. **Embryo (Baby plant):** Contains the baby root (radicle) and baby shoot (plumule).

---

### 💧 Conditions for Germination

**Germination** is the process by which a seed wakes up and grows into a seedling.

To germinate, a seed needs:
- 💧 **Water:** softens the seed coat and activates food digestion.
- 🌬️ **Air (Oxygen):** needed for the seed cells to respire.
- ☀️ **Warmth (Suitable temperature):** makes enzymes active.

> ⚠️ **NSO Trap:** Seeds do **NOT** need sunlight to germinate! They germinate underground in the dark. Sunlight is only needed once green leaves emerge above soil to perform photosynthesis.

---

### 🌬️ Seed Dispersal (How Seeds Travel)

If all seeds fell beneath the parent plant, they would fight for sunlight, water, and minerals. So nature scatters them:

- **Wind:** Seeds are light and have wings or hairs (Dandelion, Cotton, Madar/Aak, Maple, Drumstick).
- **Water:** Seeds are spongy or fibrous to float (Coconut, Lotus).
- **Animals & Humans:** Juicy fruits are eaten and seeds discarded (Mango, Apple); or seeds have sharp hooks or spines that stick to animal fur (Xanthium/Cocklebur, Tiger nail).
- **Explosion (Bursting):** Pods dry, crack, and burst open flicking seeds away (Pea, Balsam, Lady's finger, Castor).

---

### 🌿 Vegetative Reproduction (Without Seeds)

Many plants can grow from parts other than seeds:
- **From Stems:** Potato (underground stem with 'eyes'), Ginger, Rose (stem cutting), Sugarcane, Onion.
- **From Roots:** Sweet potato, Dahlia, Carrot, Radish.
- **From Leaves:** *Bryophyllum* has tiny buds along its leaf edges that fall and grow into new plants!
- **From Spores:** Non-flowering plants like Ferns (produce sori) and Mosses (produce capsules) do not make seeds; they reproduce by microscopic dust-like spores.`,
  },

  "sq-animals-study": {
    name: "Animal Habitats and Adaptations",
    author: "Apprec8",
    content: `### 🌬️ How Animals Breathe

Animals need oxygen to break down food and release energy:

- **Lungs:** Mammals (humans, cows, whales, dolphins), Birds, and Reptiles (snakes, lizards, turtles). Whales and dolphins come to the water surface to breathe air through blowholes!
- **Gills:** Fish, young tadpoles, prawns, and crabs absorb oxygen dissolved in water.
- **Moist Skin:** Earthworms breathe directly through their thin, moist skin. Adult frogs breathe through lungs on land, but breathe through their **moist skin** while submerged in water!
- **Spiracles & Air Tubes:** Insects (cockroaches, grasshoppers, butterflies) have tiny breathing holes called **spiracles** along the sides of their bodies.

---

### 🛡️ Body Coverings

An animal's outer covering protects it from weather and enemies:

- **Scales:** Reptiles (snakes, crocodiles) have dry, horny scales to stop water loss. Fish have overlapping, slimy scales.
- **Shell:** Snails, tortoises, and turtles have hard calcified shells to pull their soft bodies inside when danger approaches.
- **Feathers:** Birds have feathers that keep them warm, provide waterproofing, and enable flight.
- **Fur or Wool:** Mammals in cold regions (polar bear, yak, sheep) have thick fur that traps air to keep body heat in.
- **Camouflage:** Blending with surroundings to hide from predators or prey (Chameleon, Stick insect, Arctic fox with white winter fur).

---

### ✈️ Animal Migration

**Migration** is the seasonal journey of animals from one region to another to escape harsh cold, find food, or breed in safety:

- **Bar-headed Goose:** Flies across the high Himalayas from Central Asia to Indian wetlands every winter.
- **Amur Falcon:** Undertakes a massive migratory flight from Northern Asia across Nagaland to Southern Africa.
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
        "A banyan tree",
        [
          ["A fluffy white cloud", "moves-means-alive"],
          ["A fast flowing river", "moves-means-alive"],
          ["A granite rock boulder", "never-alive-mixup"],
        ],
        "A banyan tree breathes, grows, takes in water, and produces seeds. Clouds, rivers, and rocks do not have cells and cannot reproduce."
      ),
    },
    {
      subtopic: "living-vs-nonliving",
      ...q(
        "A car moves on roads and consumes petrol for energy. Why is it classified as non-living?",
        "It cannot grow, breathe, or reproduce by itself",
        [
          ["It releases exhaust gases and produces heat energy", "needs-energy-means-alive"],
          ["It requires human steering instead of walking on legs", "moves-means-alive"],
          ["It is constructed from metal parts that never change", "never-alive-mixup"],
        ],
        "Moving and using energy are not enough. Living things must show life processes like growing from inside, breathing, and reproducing."
      ),
    },
    {
      subtopic: "signs-of-life",
      ...q(
        "Which of these life processes is performed by ALL living organisms without exception?",
        "Respiration and biological growth",
        [
          ["Locomotion from one place to another", "moves-means-alive"],
          ["Making sound to communicate with others", "sign-of-life-mixup"],
          ["Manufacturing food through photosynthesis", "sign-of-life-mixup"],
        ],
        "All living things respire and grow. Plants do not walk, and animals do not photosynthesize, but both respire."
      ),
    },
    {
      subtopic: "signs-of-life",
      ...q(
        "A dry bean seed kept in a glass jar does not move, breathe noticeably, or take in food. What is it?",
        "Living, because it contains a dormant baby plant that can germinate",
        [
          ["Non-living, because it never moves around in the jar", "moves-means-alive"],
          ["Non-living, because it lacks green leaves to feed", "sign-of-life-mixup"],
          ["Dead, because dry seeds lose all life completely", "sign-of-life-mixup"],
        ],
        "A dry seed has a living embryo resting inside. Given moisture, oxygen, and warmth, it activates and grows into a seedling."
      ),
    },
    {
      subtopic: "once-living",
      ...q(
        "Which of these objects was once living but is classified as non-living now?",
        "A polished wooden table",
        [
          ["A clear glass window pane", "never-alive-mixup"],
          ["A stainless steel cooking pot", "never-alive-mixup"],
          ["A hard synthetic plastic bottle", "never-alive-mixup"],
        ],
        "Wood was once part of a living tree. Glass, steel, and synthetic plastics are mineral or man-made materials that were never alive."
      ),
    },
    {
      subtopic: "signs-of-life",
      ...q(
        "How do green plants demonstrate that they can sense and respond to their environment?",
        "Their stems and leaves slowly grow and bend towards sunlight",
        [
          ["Their roots move through soil to search for food", "moves-means-alive"],
          ["Their bark changes colour instantly when touched by raindrops", "sign-of-life-mixup"],
          ["Their leaves absorb all wavelengths of light without reflection", "sign-of-life-mixup"],
        ],
        "Plants show response to stimuli (tropisms): shoots grow toward light (phototropism) and roots grow downward toward gravity and moisture."
      ),
    },
    {
      subtopic: "living-vs-nonliving",
      ...q(
        "During the monsoon, a river flows swiftly down a mountain and expands greatly in size. Why is the river still non-living?",
        "Its growth is just added water, not growing from inside",
        [
          ["Because living things only increase in size during the summer season", "sign-of-life-mixup"],
          ["Because moving river water has no energy to flow", "needs-energy-means-alive"],
          ["Because flowing river water is poisonous to plants", "never-alive-mixup"],
        ],
        "Non-living things grow only when outside material is added. Living things grow from within by making new cells."
      ),
    },
    {
      subtopic: "once-living",
      ...q(
        "Which of these clothing items is manufactured directly from a once-living organism?",
        "A warm woollen muffler",
        [
          ["A synthetic nylon raincoat", "never-alive-mixup"],
          ["A polyester sports jersey", "never-alive-mixup"],
          ["A waterproof rubber boot", "never-alive-mixup"],
        ],
        "Wool is sheared from the fleece of living sheep. Nylon and polyester are artificial fibres synthesized from petroleum chemicals."
      ),
    },
  ],

  // Topic 1 Practice Leaf (6 questions, subtopic: signs-of-life)
  "sq-living-tricky": [
    q(
      "When your hand accidentally touches a hot vessel, you pull it away in a fraction of a second. This reaction is an example of ___.",
      "Response to a stimulus",
      [
        ["Locomotion for searching food", "sign-of-life-mixup"],
        ["Reproduction of new cells", "sign-of-life-mixup"],
        ["Excretion of body waste", "sign-of-life-mixup"],
      ],
      "Living things sense changes in their surroundings (stimuli) and react quickly to protect themselves."
    ),
    q(
      "The leaves of the 'touch-me-not' (Mimosa pudica) plant fold and droop rapidly when touched. What does this demonstrate?",
      "Plants can sense external touch and respond to stimuli",
      [
        ["The plant has suffered instant cell death from the touch", "still-alive-mixup"],
        ["The plant lacks cell walls and collapses under light air", "sign-of-life-mixup"],
        ["The plant is shedding its leaves to prepare for winter cold", "sign-of-life-mixup"],
      ],
      "The sudden drooping of Mimosa leaves demonstrates that plants can sense and respond to tactile stimuli."
    ),
    q(
      "Why do all animals and humans need to consume food at regular intervals?",
      "To get energy for growth, repair, and daily activity",
      [
        ["To keep their body temperature the same as the air", "sign-of-life-mixup"],
        ["To stop their body bones from turning into stone", "sign-of-life-mixup"],
        ["To make new oxygen gas for the surrounding air", "sign-of-life-mixup"],
      ],
      "Food provides essential nutrients and energy needed for growth, cell repair, and vital metabolic processes."
    ),
    q(
      "A rubber balloon expands significantly when inflated with air. Why does this differ from the growth of a living puppy?",
      "The balloon only stretches, while the puppy grows from inside",
      [
        ["The balloon expands too fast, while puppy cells grow only in darkness", "sign-of-life-mixup"],
        ["The balloon contains synthetic rubber that rejects all surrounding gases", "never-alive-mixup"],
        ["The puppy only grows by absorbing soil minerals into its fur", "sign-of-life-mixup"],
      ],
      "Biological growth occurs from inside when an organism takes in food and creates new living cells. A balloon simply stretches."
    ),
    q(
      "What is the biological term for the process by which organisms produce offspring of their own kind?",
      "Reproduction",
      [
        ["Respiration", "sign-of-life-mixup"],
        ["Digestion", "sign-of-life-mixup"],
        ["Germination", "cotyledon-function-mixup"],
      ],
      "Reproduction is the process by which living organisms give rise to offspring, ensuring the continuation of their species."
    ),
    q(
      "Every living organism has a characteristic lifespan. What inevitably happens at the end of its life cycle?",
      "It dies and its body decomposes",
      [
        ["It turns into a hard natural stone", "never-alive-mixup"],
        ["It reverts back into an early embryo", "sign-of-life-mixup"],
        ["It stops respiring but stays living", "still-alive-mixup"],
      ],
      "Every living organism has a definite life span. After completing its life cycle, it inevitably dies."
    ),
  ],

  // Topic 1 Gate Pool (15 questions: 5 signs-of-life, 5 living-vs-nonliving, 5 once-living)
  "sq-living-gate-pool": [
    // 5 signs-of-life
    {
      subtopic: "signs-of-life",
      ...q(
        "Which gas is taken in by BOTH plants and animals during breathing (respiration)?",
        "Oxygen",
        [
          ["Nitrogen", "sign-of-life-mixup"],
          ["Carbon dioxide", "sign-of-life-mixup"],
          ["Water vapour", "sign-of-life-mixup"],
        ],
        "Both plants and animals take in oxygen during respiration to release energy from food."
      ),
    },
    {
      subtopic: "signs-of-life",
      ...q(
        "A potted plant placed near a dark room's only open window bends its stem towards the outdoor light. This reaction proves that ___.",
        "Plant stems show phototropic response towards light",
        [
          ["Plants can physically walk towards areas with better warmth", "moves-means-alive"],
          ["The dark room chemically turns green leaves into dead wood", "still-alive-mixup"],
          ["Plants only respire when completely sheltered from all winds", "sign-of-life-mixup"],
        ],
        "Shoots bending toward a light source illustrates positive phototropism, a classic plant response to environmental stimuli."
      ),
    },
    {
      subtopic: "signs-of-life",
      ...q(
        "What is the biological process called in which living organisms expel metabolic waste materials from their body?",
        "Excretion",
        [
          ["Digestion", "sign-of-life-mixup"],
          ["Ingestion", "sign-of-life-mixup"],
          ["Circulation", "sign-of-life-mixup"],
        ],
        "Excretion is the essential life process by which metabolic wastes and harmful toxins are eliminated from living bodies."
      ),
    },
    {
      subtopic: "signs-of-life",
      ...q(
        "Over two years, a small sapling thickens its trunk, adds branches, and grows taller. What does this process demonstrate?",
        "Irreversible biological growth through new cells",
        [
          ["Temporary swelling caused by absorbing soil moisture", "sign-of-life-mixup"],
          ["Passive movement driven entirely by seasonal breeze", "moves-means-alive"],
          ["A reversible change that shrinks back in cold winter", "sign-of-life-mixup"],
        ],
        "Living growth is an irreversible increase in size and dry mass resulting from cell division and tissue synthesis."
      ),
    },
    {
      subtopic: "signs-of-life",
      ...q(
        "Which statement accurately describes a major difference in nutrition between green plants and animals?",
        "Green plants make food using sunlight, while animals eat other living things",
        [
          ["Green plants eat food from soil, while animals make food from sunlight", "sign-of-life-mixup"],
          ["Green plants need only oxygen for food, while animals feed on water", "sign-of-life-mixup"],
          ["Green plants need no food at all, while animals eat all the time", "sign-of-life-mixup"],
        ],
        "Plants are autotrophs that synthesize organic food using sunlight, water, and CO2, whereas animals are heterotrophs."
      ),
    },

    // 5 living-vs-nonliving
    {
      subtopic: "living-vs-nonliving",
      ...q(
        "A crystal of alum left undisturbed in a concentrated solution gradually increases in size. Why is the alum crystal non-living?",
        "It only adds layers on the outside, but cannot breathe or reproduce",
        [
          ["Because mineral crystals can never break or dissolve in water", "never-alive-mixup"],
          ["Because crystals only grow when kept in total darkness and cold", "needs-energy-means-alive"],
          ["Because the crystal produces poisonous toxic gases that kill all surrounding liquid", "never-alive-mixup"],
        ],
        "Non-living crystals grow by adding layers on the outside. They have no cells, cannot breathe, and cannot reproduce."
      ),
    },
    {
      subtopic: "living-vs-nonliving",
      ...q(
        "Which pair consists of one LIVING organism and one NON-LIVING natural object?",
        "Earthworm and Sandy soil",
        [
          ["Banyan tree and Rose plant", "sign-of-life-mixup"],
          ["Granite rock and River pebble", "never-alive-mixup"],
          ["House sparrow and Honeybee", "sign-of-life-mixup"],
        ],
        "An earthworm is a living animal with cells and respiration, while sandy soil is an inorganic natural mixture of rock particles."
      ),
    },
    {
      subtopic: "living-vs-nonliving",
      ...q(
        "An autonomous robot vacuum cleaner roams around furniture, detects dirt using optical sensors, and recharges its battery. Why is it non-living?",
        "It is an electric machine that cannot grow, breathe, or reproduce",
        [
          ["Because it moves on rubber wheels instead of using living legs", "moves-means-alive"],
          ["Because it runs on battery power instead of burning coal", "needs-energy-means-alive"],
          ["Because it operates inside homes rather than living outdoors in natural forests", "never-alive-mixup"],
        ],
        "Machines and robots run on electricity. They do not have cells, cannot breathe, and cannot reproduce."
      ),
    },
    {
      subtopic: "living-vs-nonliving",
      ...q(
        "Which of these natural features found in a forest ecosystem is completely NON-LIVING?",
        "A granite boulder in a stream",
        [
          ["A green moss patch on tree bark", "never-alive-mixup"],
          ["A fungal mushroom on rotting logs", "never-alive-mixup"],
          ["A dormant brown tree seed in soil", "never-alive-mixup"],
        ],
        "Granite is an inorganic igneous rock. Mosses, mushrooms, and seeds are living biological organisms."
      ),
    },
    {
      subtopic: "living-vs-nonliving",
      ...q(
        "Fluffy cumulus clouds move across the sky, merge to form larger masses, and release rain. Why are clouds non-living?",
        "They are water droplets moved by winds without any life processes",
        [
          ["Because clouds exist high up where breathable air is completely absent", "never-alive-mixup"],
          ["Because water vapour can only live when frozen into solid hail ice", "never-alive-mixup"],
          ["Because clouds change their shape too frequently compared to living forest animals", "moves-means-alive"],
        ],
        "Clouds are collections of condensed water droplets transported by atmospheric wind currents. They possess no biological life."
      ),
    },

    // 5 once-living
    {
      subtopic: "once-living",
      ...q(
        "Which of these common household items was made from a material that was NEVER alive?",
        "A clear glass tumbler",
        [
          ["A cotton bedsheet", "never-alive-mixup"],
          ["A soft woollen scarf", "never-alive-mixup"],
          ["A wooden dining chair", "never-alive-mixup"],
        ],
        "Glass is made by melting inorganic silica sand, soda ash, and limestone. Cotton, wool, and wood all come from living organisms."
      ),
    },
    {
      subtopic: "once-living",
      ...q(
        "Coal is an inflammable black mineral extracted from underground mines. Why do geologists classify coal as once-living?",
        "It formed from ancient swamp plants buried millions of years ago",
        [
          ["It breathes underground gases trapped deep inside the Earth", "still-alive-mixup"],
          ["It contains live plant seeds that can germinate when watered underground", "still-alive-mixup"],
          ["It absorbs ground heat and turns into living tree roots in mines", "still-alive-mixup"],
        ],
        "Coal is a fossil fuel created by high pressure and heat acting on the dense remains of prehistoric swamp forests."
      ),
    },
    {
      subtopic: "once-living",
      ...q(
        "A leather school shoe is durable and flexible. How is the shoe accurately classified scientifically?",
        "A non-living object made from once-living animal skin",
        [
          ["A living animal organ that continues growing when worn on feet", "still-alive-mixup"],
          ["An artificial mineral synthetic material that was never alive", "never-alive-mixup"],
          ["A living plant product harvested directly from tropical trees", "never-alive-mixup"],
        ],
        "Leather comes from treated animal skin (which was once living), but the manufactured leather shoe itself is non-living."
      ),
    },
    {
      subtopic: "once-living",
      ...q(
        "Which component of an artist's sketching pencil originated directly from a once-living tree?",
        "The surrounding cedar wood casing",
        [
          ["The dark graphite pencil writing core", "never-alive-mixup"],
          ["The small metal ferrule ring", "never-alive-mixup"],
          ["The synthetic rubber eraser tip", "never-alive-mixup"],
        ],
        "Pencil casings are shaped from softwood timber harvested from trees. Graphite is an inorganic crystalline carbon mineral."
      ),
    },
    {
      subtopic: "once-living",
      ...q(
        "Dinosaur fossils found embedded in sedimentary sandstone are best described as ___.",
        "Preserved mineralized remains or imprints of prehistoric organisms",
        [
          ["Statues carefully carved into underground stone by ancient humans", "never-alive-mixup"],
          ["Ancient reptiles that have remained asleep deep in rocks", "still-alive-mixup"],
          ["Inorganic mineral crystal growths that happen to mimic bone shapes", "never-alive-mixup"],
        ],
        "Fossils are the preserved traces, bones, or petrified remains of prehistoric animals and plants that lived millions of years ago."
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
        "What are the three essential environmental conditions required for a healthy seed to germinate?",
        "Water, air (oxygen), and warmth",
        [
          ["Sunlight, rich soil, and chemical fertilizer", "light-for-germination-myth"],
          ["Darkness, ice water, and rock minerals", "germination-condition-mixup"],
          ["Direct sunlight, carbon dioxide, and clay", "germination-condition-mixup"],
        ],
        "A seed requires moisture (to soften the seed coat), oxygen (for cellular respiration), and suitable warmth for enzymatic action."
      ),
    },
    {
      subtopic: "seed-germination",
      ...q(
        "In bean and gram seeds, why can a germinating seedling sprout successfully underground in complete darkness?",
        "It uses starch and food stored inside its fleshy cotyledons",
        [
          ["It absorbs dissolved sugars directly from moist surrounding soil", "cotyledon-function-mixup"],
          ["It captures sunlight that filters through thick layers of soil", "light-for-germination-myth"],
          ["It remains completely dormant and does not use any energy at all", "germination-condition-mixup"],
        ],
        "Dicot seeds store nourishment in their cotyledons. The seedling feeds on this stored food until its green leaves reach the surface."
      ),
    },
    {
      subtopic: "seed-dispersal",
      ...q(
        "Why is wide seed dispersal essential for the healthy growth of seedling offspring?",
        "It prevents competition for sunlight, water, and soil minerals",
        [
          ["It prevents insects from finding and eating seeds", "dispersal-agent-mixup"],
          ["It guarantees that every scattered seed falls into deep water", "dispersal-agent-mixup"],
          ["It stops the parent tree from producing any more flower blossoms", "dispersal-agent-mixup"],
        ],
        "Without dispersal, crowded seedlings beneath the parent canopy would suffer from severe competition for light, moisture, and root space."
      ),
    },
    {
      subtopic: "seed-dispersal",
      ...q(
        "Dandelion and madar (aak) seeds possess tufts of fine, silky white hairs. How are these seeds dispersed?",
        "Carried long distances by wind drafts",
        [
          ["Floating across long distances on moving river currents", "dispersal-agent-mixup"],
          ["Sticking to the wet fur of mammals", "dispersal-agent-mixup"],
          ["Flicked away by explosive pod burst", "dispersal-agent-mixup"],
        ],
        "Feathery tufts act like parachutes, allowing light dandelion and madar seeds to be lifted by breezes and transported across great distances."
      ),
    },
    {
      subtopic: "seed-dispersal",
      ...q(
        "A coconut has a thick, fibrous outer husk that traps air inside. Which agent disperses coconut seeds?",
        "Water currents",
        [
          ["Strong wind gusts", "dispersal-agent-mixup"],
          ["Clinging to animal fur", "dispersal-agent-mixup"],
          ["Explosive bursting of pods", "dispersal-agent-mixup"],
        ],
        "The fibrous husk traps air pockets, making the heavy coconut buoyant so it can drift across oceans to colonize distant shores."
      ),
    },
    {
      subtopic: "vegetative-growth",
      ...q(
        "A gardener plants pieces of a potato tuber, each containing a healthy 'eye'. What develops from each eye?",
        "A new potato shoot with stems, roots, and green leaves",
        [
          ["Underground roots that never grow green leaves", "vegetative-part-mixup"],
          ["True flowers that produce seeds before roots", "vegetative-part-mixup"],
          ["A single giant seed that must be dried", "vegetative-part-mixup"],
        ],
        "The 'eyes' on a potato are vegetative buds located at stem nodes. When planted in moist soil, each bud sprouts into a complete new plant."
      ),
    },
    {
      subtopic: "vegetative-growth",
      ...q(
        "Which of these plants can develop new baby plantlets along the notches of its mature leaves?",
        "Bryophyllum",
        [
          ["Sweet potato vine", "vegetative-part-mixup"],
          ["Mango tree", "vegetative-part-mixup"],
          ["Wheat crop", "vegetative-part-mixup"],
        ],
        "Bryophyllum is renowned for vegetative propagation by leaves; small buds on the leaf margins develop adventitious roots and drop into soil."
      ),
    },
    {
      subtopic: "seed-germination",
      ...q(
        "What is the tough protective outer covering of a seed called?",
        "Seed coat (Testa)",
        [
          ["Fleshy cotyledon leaf", "seed-part-mixup"],
          ["Growing plumule", "seed-part-mixup"],
          ["Emerging radicle", "seed-part-mixup"],
        ],
        "The seed coat (testa) is the outer protective shell that guards the delicate internal embryo from physical injury and pathogens."
      ),
    },
  ],

  // Topic 2 Practice Leaf (6 questions, subtopic: seed-dispersal)
  "sq-plants-dispersal-quiz": [
    q(
      "Xanthium (cocklebur) and tiger nail seeds have stiff, curved hooks on their outer surface. How do these hooks aid in dispersal?",
      "They catch on animal fur and human clothing",
      [
        ["They allow the seed to float on river water", "dispersal-agent-mixup"],
        ["They capture wind drafts like tiny gliders", "dispersal-agent-mixup"],
        ["They burst open when heated by direct sun", "dispersal-agent-mixup"],
      ],
      "Hooked spines latch onto grazing cattle, dogs, or hikers' clothes, carrying seeds far before they drop off."
    ),
    q(
      "When ripe pea pods or balsam fruits dry out in warm weather, how do they discharge their seeds?",
      "Their pods split suddenly with explosive force",
      [
        ["Their seeds grow light wings to glide", "dispersal-agent-mixup"],
        ["Their heavy pods drop in water to float", "dispersal-agent-mixup"],
        ["Their juice dissolves into the soil", "dispersal-agent-mixup"],
      ],
      "As pea and balsam pods dry, unequal tensions cause the pod walls to twist and burst open violently, flinging the seeds outward."
    ),
    q(
      "Lotus fruits have a spongy, cup-shaped seed head containing air spaces. How are lotus seeds dispersed?",
      "By floating on water",
      [
        ["By blowing across air in strong wind", "dispersal-agent-mixup"],
        ["By clinging to fur", "dispersal-agent-mixup"],
        ["By explosive split", "dispersal-agent-mixup"],
      ],
      "The spongy fruit structure of the lotus stays afloat on lakes and ponds, drifting until seeds decay out and settle into the mud."
    ),
    q(
      "How do fruit-eating birds assist in the dispersal of seeds from plants like guavas, figs, and berries?",
      "They eat fleshy fruit and excrete hard seeds unharmed far away",
      [
        ["They crush and grind every seed into powder with sharp beaks", "dispersal-agent-mixup"],
        ["They carry whole fruit branches back to build warm nests", "dispersal-agent-mixup"],
        ["They bury dry seeds deep under river sand with their wings", "dispersal-agent-mixup"],
      ],
      "Birds consume the nutritious fruit pulp, and the tough indigestible seeds pass through their gut and are deposited with droppings."
    ),
    q(
      "Seeds of maple and drumstick trees possess thin, papery wing-like extensions. What purpose do these wings serve?",
      "They allow seeds to spin and glide on breezes",
      [
        ["They help seeds paddle in rivers", "dispersal-agent-mixup"],
        ["They act as spines against caterpillars", "dispersal-agent-mixup"],
        ["They absorb rain drops into stems", "dispersal-agent-mixup"],
      ],
      "Winged seeds rotate like miniature propeller blades as they fall, prolonging their descent so gusts of wind can blow them far away."
    ),
    q(
      "Which of these seeds relies on hooked prickles to cling to passing mammals for dispersal?",
      "Cocklebur (Xanthium)",
      [
        ["Parachute-like dandelion seed", "dispersal-agent-mixup"],
        ["Coconut husk", "dispersal-agent-mixup"],
        ["Sweet pea pod", "dispersal-agent-mixup"],
      ],
      "Xanthium fruits are covered with sharp hook-tipped spines that anchor firmly into animal coats."
    ),
  ],

  // Topic 2 Gate Pool (15 questions: 5 seed-germination, 5 seed-dispersal, 5 vegetative-growth)
  "sq-plants-gate-pool": [
    // 5 seed-germination
    {
      subtopic: "seed-germination",
      ...q(
        "During seed germination, which part of the embryo always emerges first through the seed coat?",
        "The radicle (embryonic root)",
        [
          ["The plumule (baby shoot)", "seed-part-mixup"],
          ["The first green leaf", "seed-part-mixup"],
          ["The tiny flower bud", "seed-part-mixup"],
        ],
        "The radicle grows out first to anchor the seedling into the soil and begin absorbing water and minerals."
      ),
    },
    {
      subtopic: "seed-germination",
      ...q(
        "Gram, pea, and bean seeds contain two distinct seed leaves. What botanical term is applied to these seeds?",
        "Dicotyledonous (Dicot) seeds",
        [
          ["Single-cotyledon monocot seeds", "cotyledon-function-mixup"],
          ["Spore-producing capsules", "spore-seed-mixup"],
          ["Seeds without any baby plant", "germination-condition-mixup"],
        ],
        "Seeds having two cotyledons are dicots (beans, grams, peas). Seeds having only one cotyledon (maize, wheat) are monocots."
      ),
    },
    {
      subtopic: "seed-germination",
      ...q(
        "If healthy gram seeds are kept submerged in icy water inside a refrigerator freezer at 0°C with access to air, will they sprout?",
        "No, because seeds require warmth for germination enzymes to work",
        [
          ["Yes, because freezing temperatures activate seedling germination", "germination-condition-mixup"],
          ["Yes, because moisture and air are the only necessary factors", "germination-condition-mixup"],
          ["Yes, provided a fluorescent electric bulb illuminates the freezer", "light-for-germination-myth"],
        ],
        "Seeds require suitable ambient warmth (usually 20°C–30°C) for respiratory and digestive enzymes to become metabolically active."
      ),
    },
    {
      subtopic: "seed-germination",
      ...q(
        "What is the part of the plant embryo that grows upward to develop into the stem and green leaves called?",
        "Plumule",
        [
          ["Radicle", "seed-part-mixup"],
          ["Testa", "seed-part-mixup"],
          ["Cotyledon", "seed-part-mixup"],
        ],
        "The plumule is the embryonic terminal bud that emerges after the radicle, growing upwards toward sunlight to form the shoot."
      ),
    },
    {
      subtopic: "seed-germination",
      ...q(
        "Why do healthy seeds placed in boiled, cooled water covered with a layer of vegetable oil fail to germinate?",
        "Boiling removed oxygen, and oil stops fresh air entering",
        [
          ["The thick oil dissolves the seed coat and destroys the embryo", "germination-condition-mixup"],
          ["Boiling creates minerals that chemically poison the seed cotyledons", "germination-condition-mixup"],
          ["Water without sunlight cannot be absorbed by any dry seed coat", "light-for-germination-myth"],
        ],
        "Boiling expels dissolved oxygen from water, and the oil seal prevents atmospheric air from dissolving. Without oxygen, seeds cannot respire."
      ),
    },

    // 5 seed-dispersal
    {
      subtopic: "seed-dispersal",
      ...q(
        "Which pair consists of two plant species whose seeds are BOTH dispersed primarily by WIND?",
        "Cotton and Dandelion",
        [
          ["Coconut and Water lily", "dispersal-agent-mixup"],
          ["Xanthium and Sweet mango", "dispersal-agent-mixup"],
          ["Garden pea and Castor", "dispersal-agent-mixup"],
        ],
        "Both cotton and dandelion produce lightweight seeds adorned with silky hairs adapted for wind flight."
      ),
    },
    {
      subtopic: "seed-dispersal",
      ...q(
        "How are seeds of the touch-me-not balsam plant and castor plant scattered into the environment?",
        "Through explosive bursting of their dry mature pods",
        [
          ["Carried on water across flooded fields", "dispersal-agent-mixup"],
          ["Carried by clinging to animal coats", "dispersal-agent-mixup"],
          ["Blown by high altitude winds", "dispersal-agent-mixup"],
        ],
        "Balsam and castor pods split open with explosive tension when mature and dry, hurling seeds away from the parent plant."
      ),
    },
    {
      subtopic: "seed-dispersal",
      ...q(
        "Why are coconuts frequently found growing along tropical seashores and remote coral atolls?",
        "Their waterproof fibrous husk traps air, allowing them to float across oceans",
        [
          ["Large sea birds carry heavy coconuts in their claws during flight", "dispersal-agent-mixup"],
          ["Underwater ocean currents roll heavy coconuts along the seabed sand", "dispersal-agent-mixup"],
          ["Coconuts burst open and fling their heavy seeds across island beaches", "dispersal-agent-mixup"],
        ],
        "The fibrous husk (mesocarp) holds trapped air, providing buoyancy that lets coconuts drift unharmed for months on ocean currents."
      ),
    },
    {
      subtopic: "seed-dispersal",
      ...q(
        "Which of these trees produces seeds featuring three distinct papery wings for wind dispersal?",
        "Drumstick (Moringa)",
        [
          ["Mango tree", "dispersal-agent-mixup"],
          ["Coastal coconut palm tree", "dispersal-agent-mixup"],
          ["Castor plant", "dispersal-agent-mixup"],
        ],
        "Drumstick seeds have three papery wings that enable them to be carried away by breezes as they drop from long pods."
      ),
    },
    {
      subtopic: "seed-dispersal",
      ...q(
        "People eat the sweet flesh of mangoes, apples, and watermelons and discard the seeds on soil. How are these seeds dispersed?",
        "By humans and animals",
        [
          ["By explosive mechanisms", "dispersal-agent-mixup"],
          ["By aquatic water currents", "dispersal-agent-mixup"],
          ["By aerodynamic papery wings", "dispersal-agent-mixup"],
        ],
        "Fleshy, appetizing fruits attract animals and humans, who carry the fruit away and discard the viable seeds in new locations."
      ),
    },

    // 5 vegetative-growth
    {
      subtopic: "vegetative-growth",
      ...q(
        "From which specialized plant organ does a new ginger shoot develop during vegetative propagation?",
        "An underground stem (Rhizome)",
        [
          ["A deeply swollen underground taproot system", "vegetative-part-mixup"],
          ["A modified flower petal", "vegetative-part-mixup"],
          ["A dried single-seeded fruit", "vegetative-part-mixup"],
        ],
        "Ginger is an underground modified stem called a rhizome with nodes, internodes, and scale buds that sprout into new shoots."
      ),
    },
    {
      subtopic: "vegetative-growth",
      ...q(
        "Which of these flowering garden shrubs is most commonly propagated by planting healthy stem cuttings with nodes?",
        "Rose",
        [
          ["Wheat", "vegetative-part-mixup"],
          ["Maize", "vegetative-part-mixup"],
          ["Papaya", "vegetative-part-mixup"],
        ],
        "Rose, sugarcane, and hibiscus are traditionally grown from stem cuttings that have active buds capable of forming roots and shoots."
      ),
    },
    {
      subtopic: "vegetative-growth",
      ...q(
        "Sweet potato and dahlia plants can produce complete new plants from which vegetative structure?",
        "Swollen root tubers",
        [
          ["Mature green leaf blades", "vegetative-part-mixup"],
          ["Dry wooden branch bark", "vegetative-part-mixup"],
          ["True flowering seed pods", "vegetative-part-mixup"],
        ],
        "Sweet potatoes and dahlia have fleshy root tubers that produce adventitious buds capable of growing into new plants."
      ),
    },
    {
      subtopic: "vegetative-growth",
      ...q(
        "Non-flowering plants like ferns and mosses do not produce flowers, fruits, or seeds. How do they reproduce?",
        "By releasing microscopic spores from sori and capsules",
        [
          ["By dropping heavy woody cones that split open in river mud", "spore-seed-mixup"],
          ["By growing only through swollen edible root tubers", "vegetative-part-mixup"],
          ["By producing nectar that attracts nocturnal insects", "spore-seed-mixup"],
        ],
        "Ferns produce sori under their fronds, while mosses produce capsules, both containing microscopic spores that scatter in wind."
      ),
    },
    {
      subtopic: "vegetative-growth",
      ...q(
        "An onion bulb kept over moist soil soon sprouts green leaves on top and fibrous roots below. What is an onion bulb?",
        "An underground stem surrounded by fleshy scale leaves",
        [
          ["A true underground swollen taproot similar to a common garden carrot", "vegetative-part-mixup"],
          ["A large single seed containing two fleshy cotyledons", "vegetative-part-mixup"],
          ["A modified flower bud that stores concentrated sugar", "vegetative-part-mixup"],
        ],
        "An onion is a modified underground stem (bulb) with a reduced stem disc covered by concentric fleshy scale leaves storing food."
      ),
    },
    {
      subtopic: "seed-germination",
      ...q(
        "Rohan placed soaked bean seeds in two dishes:\nDish X had moist cotton kept in a warm room.\nDish Y had moist cotton kept inside a freezer.\nWhat will happen after three days?",
        "Seeds in Dish X germinate, but seeds in Dish Y do not",
        [
          ["Seeds in Dish Y germinate, but Dish X seeds do not", "light-for-germination-myth"],
          ["Seeds in both dishes germinate equally well", "germination-condition-mixup"],
          ["Neither dish shows any seed germination", "germination-condition-mixup"],
        ],
        "Seeds need water, air, and warmth to germinate. The freezer in Dish Y is too cold, so seeds cannot sprout."
      ),
    },
    {
      subtopic: "seed-dispersal",
      ...q(
        "Read the two statements about seeds:\nStatement 1: Dandelion seeds have fluffy hairs to float in wind.\nStatement 2: Coconut seeds have fibrous coats to float on water.\nWhich is correct?",
        "Both Statement 1 and Statement 2 are true",
        [
          ["Only Statement 1 is true", "dispersal-agent-mixup"],
          ["Only Statement 2 is true", "dispersal-agent-mixup"],
          ["Neither Statement 1 nor 2 is true", "dispersal-agent-mixup"],
        ],
        "Dandelion seeds are carried by wind using light hairs, while coconuts float on water with fibrous husks."
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
        "How do fish extract dissolved oxygen from water while swimming?",
        "Water passes across feathery gills where oxygen is absorbed into blood",
        [
          ["They take atmospheric air into lungs whenever they swim near the surface", "breathing-organ-mixup"],
          ["They absorb oxygen through microscopic spiracles along their lateral line", "insect-breathing-mixup"],
          ["They break down water into hydrogen and oxygen inside their stomach", "breathing-organ-mixup"],
        ],
        "Fish pump water across their gills, where rich blood capillaries absorb dissolved oxygen and release carbon dioxide."
      ),
    },
    {
      subtopic: "breathing-organs",
      ...q(
        "Insects like grasshoppers, cockroaches, and bees breathe through tiny pores along the sides of their bodies called ___.",
        "Spiracles",
        [
          ["Gills", "breathing-organ-mixup"],
          ["Stomata", "breathing-organ-mixup"],
          ["Lungs", "breathing-organ-mixup"],
        ],
        "Insects have tiny breathing holes called spiracles along their abdomen, connected to internal air tubes (tracheae)."
      ),
    },
    {
      subtopic: "breathing-organs",
      ...q(
        "An adult frog can survive both on land and in water. How does it breathe while submerged in a pond?",
        "Through its thin, moist skin",
        [
          ["Through internal lungs", "amphibian-breathing-mixup"],
          ["Through feathery gills", "breathing-organ-mixup"],
          ["Through microscopic pores on webbed feet", "amphibian-breathing-mixup"],
        ],
        "On land, adult frogs breathe using lungs. But in water, cutaneous respiration occurs: oxygen diffuses directly through their moist skin."
      ),
    },
    {
      subtopic: "body-coverings",
      ...q(
        "Which protective body covering shields snails, tortoises, and clams from predators and harsh weather?",
        "A hard calcified shell",
        [
          ["Soft downy feathers", "body-covering-mixup"],
          ["A thick coat of dense woollen fleece", "body-covering-mixup"],
          ["Slimy skin secretions", "body-covering-mixup"],
        ],
        "A hard outer shell made of calcium minerals provides a rigid protective armor into which soft-bodied animals can withdraw."
      ),
    },
    {
      subtopic: "body-coverings",
      ...q(
        "How does the thick white fur coat of a polar bear help it survive in freezing Arctic conditions?",
        "It traps warm air for insulation and provides camouflage against snow",
        [
          ["It enables the polar bear to swim faster than marine fish", "body-covering-mixup"],
          ["It absorbs green sunlight to produce chemical food energy", "camouflage-mixup"],
          ["It reflects all scents so Arctic seals cannot detect it", "camouflage-mixup"],
        ],
        "Thick dense fur traps an insulating layer of body warmth, while the white colour helps the bear camouflage against snow while hunting."
      ),
    },
    {
      subtopic: "feeding-movement",
      ...q(
        "Every winter, thousands of bar-headed geese fly across the high Himalayas to wetlands in India. Why do they migrate?",
        "To escape extreme sub-zero cold and find open water and food",
        [
          ["To find colder ice so their eggs do not overheat in winter", "migration-reason-mixup"],
          ["Because they lose their flight feathers and can only walk", "migration-reason-mixup"],
          ["To change their body covering from feathers into thick fur", "body-covering-mixup"],
        ],
        "Bar-headed geese migrate south over the Himalayas to escape freezing northern winters where water bodies freeze and food becomes scarce."
      ),
    },
    {
      subtopic: "body-coverings",
      ...q(
        "A chameleon shifts its skin colour to match tree branches, and an arctic hare turns white in winter. This adaptation is called ___.",
        "Camouflage",
        [
          ["Hibernation", "body-covering-mixup"],
          ["Migration", "migration-reason-mixup"],
          ["Respiration", "sign-of-life-mixup"],
        ],
        "Camouflage (protective coloration) enables an animal to blend into its background, concealing it from predators or prey."
      ),
    },
    {
      subtopic: "breathing-organs",
      ...q(
        "Whales and dolphins reside in ocean waters throughout their lives. How do they breathe?",
        "They surface to breathe air into lungs through blowholes",
        [
          ["They use internal gills to extract dissolved oxygen from water", "breathing-organ-mixup"],
          ["They absorb dissolved oxygen directly through their smooth rubbery skin", "breathing-organ-mixup"],
          ["They swallow large volumes of sea water to filter oxygen in stomach", "breathing-organ-mixup"],
        ],
        "Whales and dolphins are mammals with lungs, not fish. They must surface to inhale air through blowholes at the top of their head."
      ),
    },
  ],

  // Topic 3 Practice Leaf (6 questions, subtopic: body-coverings)
  "sq-animals-adaptations-quiz": [
    q(
      "Reptiles such as snakes, lizards, and crocodiles possess dry, horny scales on their skin. What is the primary role of these scales?",
      "To prevent internal water loss and protect against abrasion",
      [
        ["To help them glide through air like feathered birds during flight", "body-covering-mixup"],
        ["To absorb oxygen and minerals directly from warm sunlight", "breathing-organ-mixup"],
        ["To keep their body skin soft and permeable to moisture", "body-covering-mixup"],
      ],
      "Dry scales provide a tough, waterproof layer that prevents vital body moisture from evaporating in hot, arid terrestrial environments."
    ),
    q(
      "Why are the pneumatic (hollow) bones and feathers of birds critical adaptations for their lifestyle?",
      "They minimize body weight while providing streamlined lift for flight",
      [
        ["They allow birds to submerge deep into ocean mud to hibernate", "body-covering-mixup"],
        ["They make the skeleton heavy enough to crush hard forest seeds", "body-covering-mixup"],
        ["They cool the bird's bloodstream by circulating mountain ice", "body-covering-mixup"],
      ],
      "Air-filled hollow bones lighten the skeleton, while feathers generate aerodynamic lift, provide insulation, and enable efficient flight."
    ),
    q(
      "A stick insect closely resembles a dry wooden twig on a bush. How does this adaptation benefit the insect?",
      "Predatory birds fail to detect and eat it",
      [
        ["It allows the insect to photosynthesize green sugar", "camouflage-mixup"],
        ["It helps the insect drink sap without using mouthparts", "camouflage-mixup"],
        ["It enables the insect to outrun aggressive spider webs", "body-covering-mixup"],
      ],
      "Protective mimicry (camouflage) allows the stick insect to pass unnoticed by sharp-eyed insectivorous birds and lizards."
    ),
    q(
      "Which animal curls up into a tight ball presenting an armor of tough overlapping keratin scales when threatened?",
      "Pangolin",
      [
        ["Jellyfish", "body-covering-mixup"],
        ["Earthworm", "body-covering-mixup"],
        ["Goldfish", "body-covering-mixup"],
      ],
      "Pangolins have protective overlapping scales made of keratin. When alarmed, they roll into an armored ball protecting their belly."
    ),
    q(
      "How do the overlapping, slimy scales covering a freshwater fish assist in its underwater locomotion?",
      "They reduce water friction, allowing smooth swimming",
      [
        ["They produce electric pulses against enemies", "body-covering-mixup"],
        ["They act as anchors to grip river weeds", "body-covering-mixup"],
        ["They store water to prevent thirst in oceans", "body-covering-mixup"],
      ],
      "A streamlined body covered in backward-facing slimy scales minimizes hydrodynamic drag as the fish moves through water."
    ),
    q(
      "Why does a porcupine have sharp, stiff quills (modified hairs) covering its back and tail?",
      "To defend itself by stabbing attacking predators",
      [
        ["To catch flying insects while foraging in the dark", "body-covering-mixup"],
        ["To act as buoyant paddles when swimming across rivers", "body-covering-mixup"],
        ["To dig deep underground tunnels through solid bedrock", "body-covering-mixup"],
      ],
      "Porcupine quills are sharp, barbed defense structures that penetrate the skin of attacking predators, deterring carnivores."
    ),
  ],

  // Topic 3 Gate Pool (15 questions: 5 breathing-organs, 5 body-coverings, 5 feeding-movement)
  "sq-animals-gate-pool": [
    // 5 breathing-organs
    {
      subtopic: "breathing-organs",
      ...q(
        "An earthworm possesses neither lungs nor gills. How does it exchange respiratory gases with the atmosphere?",
        "Through its thin, constantly moist skin surface",
        [
          ["Through paired spiracles on its body", "insect-breathing-mixup"],
          ["Through its mouth only when feeding", "breathing-organ-mixup"],
          ["Through air bubbles stored in its tail", "breathing-organ-mixup"],
        ],
        "Atmospheric oxygen dissolves in moisture on the earthworm's thin body wall and diffuses directly into blood capillaries."
      ),
    },
    {
      subtopic: "breathing-organs",
      ...q(
        "A tadpole is the aquatic larval stage of a frog. What respiratory organ does a young tadpole use to breathe in pond water?",
        "Gills",
        [
          ["Lungs", "amphibian-breathing-mixup"],
          ["Spiracles", "insect-breathing-mixup"],
          ["Dry scales", "body-covering-mixup"],
        ],
        "Tadpoles live entirely submerged and breathe through gills. As they metamorphose into frogs, lungs develop and gills disappear."
      ),
    },
    {
      subtopic: "breathing-organs",
      ...q(
        "Which of the following organisms breathes exclusively through well-developed lungs?",
        "Crocodile",
        [
          ["Prawn", "breathing-organ-mixup"],
          ["Young tadpole", "amphibian-breathing-mixup"],
          ["Dragonfly", "insect-breathing-mixup"],
        ],
        "Crocodiles are reptiles that breathe air using lungs. Prawns and tadpoles have gills, and dragonflies breathe using spiracles."
      ),
    },
    {
      subtopic: "breathing-organs",
      ...q(
        "Why do earthworms crawl out onto the surface of footpaths and soil during heavy monsoon downpours?",
        "Rainwater fills soil air pockets, so the worms cannot breathe underground",
        [
          ["Because earthworms need direct warm sunlight to digest swallowed soil", "breathing-organ-mixup"],
          ["Because excessive rainwater makes underground soil too warm for them", "breathing-organ-mixup"],
          ["Because earthworms need to lay their eggs on wet concrete footpaths", "needs-energy-means-alive"],
        ],
        "Water saturates soil spaces, driving out trapped oxygen. Earthworms must surface to avoid suffocating underground."
      ),
    },
    {
      subtopic: "breathing-organs",
      ...q(
        "Which group of organisms possesses an internal tracheal system with spiracles along the body wall for breathing?",
        "Insects (cockroach, mosquito, housefly)",
        [
          ["Fishes (salmon, tuna, freshwater rohu)", "breathing-organ-mixup"],
          ["Birds (sparrow, pigeon, mountain eagle)", "breathing-organ-mixup"],
          ["Mammals (cat, dog, wild deer)", "breathing-organ-mixup"],
        ],
        "Insects have a specialized tracheal respiratory network where air enters through lateral spiracles and delivers oxygen directly to cells."
      ),
    },

    // 5 body-coverings
    {
      subtopic: "body-coverings",
      ...q(
        "Which marine animal relies on a thick insulating subcutaneous layer of fat called 'blubber' to survive in freezing waters?",
        "Seal / Whale",
        [
          ["Desert camel", "body-covering-mixup"],
          ["Tree chameleon", "body-covering-mixup"],
          ["Field grasshopper", "body-covering-mixup"],
        ],
        "Marine mammals like seals and whales have a thick layer of blubber beneath their skin that insulates vital organs against icy water."
      ),
    },
    {
      subtopic: "body-coverings",
      ...q(
        "How do down feathers benefit birds in ways other than enabling aerial flight?",
        "They trap an insulating layer of warm air to maintain constant body temperature",
        [
          ["They help the diving bird breathe easily while submerged underwater", "breathing-organ-mixup"],
          ["They grind tough grain seeds directly inside the bird's stomach", "body-covering-mixup"],
          ["They replace the bird's need to drink fresh water during flight", "body-covering-mixup"],
        ],
        "Soft down feathers close to a bird's skin trap body heat, keeping warm-blooded birds insulated against cold winds."
      ),
    },
    {
      subtopic: "body-coverings",
      ...q(
        "The snow leopard of the Himalayas possesses thick patterned spotted fur and wide, fur-covered footpads. How do these traits help?",
        "Paws distribute weight on snow, and fur provides warmth and camouflage",
        [
          ["Paws enable climbing vertical cliffs, and fur absorbs mountain sunlight", "body-covering-mixup"],
          ["Paws allow swimming in icy rivers, and fur stores reserve fat for winter", "breathing-organ-mixup"],
          ["Paws help dig stone burrows, and fur changes colour every month", "teeth-diet-mixup"],
        ],
        "Wide fur-cushioned paws act like natural snowshoes to prevent sinking into drifts, while dense spotted fur insulates and camouflages."
      ),
    },
    {
      subtopic: "body-coverings",
      ...q(
        "Which of the following animals sheds its outer layer of scaly skin periodically in a process known as 'moulting'?",
        "Snake",
        [
          ["Sheep", "body-covering-mixup"],
          ["Snail", "body-covering-mixup"],
          ["Duck", "body-covering-mixup"],
        ],
        "As a snake grows, its non-stretching outer layer of dead scales is periodically shed in one piece (moulting/ecdysis)."
      ),
    },
    {
      subtopic: "body-coverings",
      ...q(
        "The vertical stripes of a tiger and the spots of a leopard break up their outline in grass and dappled sunlight. What is this adaptation called?",
        "Camouflage",
        [
          ["Migration", "migration-reason-mixup"],
          ["Hibernation", "body-covering-mixup"],
          ["Metamorphosis", "sign-of-life-mixup"],
        ],
        "Disruptive coloration is a form of camouflage that obscures an animal's contours, helping predators stalk prey undetected."
      ),
    },

    // 5 feeding-movement
    {
      subtopic: "feeding-movement",
      ...q(
        "Which migratory bird travels from the Arctic to the Antarctic and back each year, covering around 70,000 kilometres?",
        "Arctic Tern",
        [
          ["House Sparrow", "migration-reason-mixup"],
          ["Kingfisher", "migration-reason-mixup"],
          ["Barn Owl", "migration-reason-mixup"],
        ],
        "The Arctic Tern holds the record for the longest annual migration of any animal, travelling from the Arctic to the Antarctic and back."
      ),
    },
    {
      subtopic: "feeding-movement",
      ...q(
        "Why do herbivorous mammals (such as cows, horses, and deer) possess broad, flat premolars and molars?",
        "To grind fibrous plant matter and tough grass thoroughly",
        [
          ["To grip, pierce, and tear tough raw meat away from animal bones", "teeth-diet-mixup"],
          ["To capture and crush flying insects in the dark", "teeth-diet-mixup"],
          ["To inject paralyzing venom into attacking carnivores", "teeth-diet-mixup"],
        ],
        "Plant cell walls contain tough cellulose. Herbivores have wide, flat grinding teeth to crush and pulp tough plant fibres."
      ),
    },
    {
      subtopic: "feeding-movement",
      ...q(
        "How do the webbed feet of ducks, swans, and frogs assist them in their natural habitat?",
        "They act like paddles to push against water and propel the animal forward",
        [
          ["They act like climbing hooks to grip branches in tall trees", "body-covering-mixup"],
          ["They serve as sharp digging tools to excavate deep burrows", "body-covering-mixup"],
          ["They filter dissolved mineral salts out of muddy water while swimming", "body-covering-mixup"],
        ],
        "The skin connecting the toes creates a broad surface that pushes against water like an oar, propelling the animal smoothly."
      ),
    },
    {
      subtopic: "feeding-movement",
      ...q(
        "Carnivores like tigers, lions, and wolves possess prominent, long, sharp pointed teeth called ___.",
        "Canines",
        [
          ["Incisors", "teeth-diet-mixup"],
          ["Molars", "teeth-diet-mixup"],
          ["Premolars", "teeth-diet-mixup"],
        ],
        "Canines are sharp, curved pointed teeth positioned between incisors and premolars, specialized for tearing meat."
      ),
    },
    {
      subtopic: "feeding-movement",
      ...q(
        "Mass seasonal movement of animals from one geographic region to another to escape cold weather or breed is known as ___.",
        "Migration",
        [
          ["Metamorphosis", "sign-of-life-mixup"],
          ["Photosynthesis", "sign-of-life-mixup"],
          ["Camouflage", "camouflage-mixup"],
        ],
        "Migration is the regular seasonal journey undertaken by many animal species to find food, shelter, or hospitable breeding grounds."
      ),
    },
    {
      subtopic: "breathing-organs",
      ...q(
        "Complete the analogy:\nFish : Gills :: Cockroach : ___",
        "Spiracles",
        [
          ["Lungs", "breathing-organ-mixup"],
          ["Moist skin", "breathing-organ-mixup"],
          ["Gills", "breathing-organ-mixup"],
        ],
        "Fish breathe using gills, while insects like cockroaches breathe through tiny holes called spiracles."
      ),
    },
    {
      subtopic: "feeding-movement",
      ...q(
        "Match the animal with its movement feature:\np. Snake - 1. Padded feet\nq. Camel - 2. Fins\nr. Fish - 3. Scales and ribs",
        "p-3, q-1, r-2",
        [
          ["p-1, q-3, r-2", "adaptation-mixup"],
          ["p-3, q-2, r-1", "adaptation-mixup"],
          ["p-2, q-1, r-3", "adaptation-mixup"],
        ],
        "Snakes use scales and ribs to crawl, camels have broad padded feet for desert sand, and fish use fins to swim."
      ),
    },
  ],

  // ==========================================
  // Unit 1 Boss: Mixed Living World Assessment (15 questions)
  // ==========================================
  "sq-u1-test": [
    q(
      "Which of these characteristics is found ONLY in living organisms and is completely absent in non-living things?",
      "Cellular organization and reproduction",
      [
        ["Active movement and locomotion across space", "moves-means-alive"],
        ["Increasing in physical volume", "sign-of-life-mixup"],
        ["Producing audible noise or heat", "needs-energy-means-alive"],
      ],
      "Non-living machines can move and crystals can expand, but only living things possess cells and reproduce."
    ),
    q(
      "A student plants two identical pots of gram seeds. Pot A is kept under bright sunlight, while Pot B is kept in a dark cupboard. Both get equal water and warmth. What will happen in the first three days?",
      "Both seeds will germinate because seeds do not need light to sprout",
      [
        ["Only Pot A germinates because sunlight is needed to crack seed coats", "light-for-germination-myth"],
        ["Only Pot B germinates because direct sunlight kills young plant embryos", "light-for-germination-myth"],
        ["Neither seed germinates because soil must be sterilized with hot water", "germination-condition-mixup"],
      ],
      "Seeds do not require light to germinate underground; cotyledon food stores sustain the seedling until green leaves form."
    ),
    q(
      "Which of these seeds possesses sharp curved hooks that latch onto animal fur for dispersal?",
      "Cocklebur (Xanthium)",
      [
        ["Parachute-like dandelion seed", "dispersal-agent-mixup"],
        ["Coconut husk", "dispersal-agent-mixup"],
        ["Maple wing", "dispersal-agent-mixup"],
      ],
      "Xanthium seeds have curved prickles that catch on passing animal fur or socks, carrying seeds away."
    ),
    q(
      "Bryophyllum reproduces vegetatively using miniature plantlets that develop along its ___.",
      "Leaves",
      [
        ["Stem nodes", "vegetative-part-mixup"],
        ["Underground roots", "vegetative-part-mixup"],
        ["Exploding pods", "vegetative-part-mixup"],
      ],
      "Bryophyllum propagates vegetatively via adventitious buds formed along the notches of its leaf margins."
    ),
    q(
      "How does an adult frog breathe when submerged beneath the surface of pond water?",
      "Through its thin, moist skin",
      [
        ["Through internal lungs", "amphibian-breathing-mixup"],
        ["Through feathery gills", "breathing-organ-mixup"],
        ["Through pores on its webbed feet", "breathing-organ-mixup"],
      ],
      "Adult frogs use lungs on land, but underwater they breathe via cutaneous respiration through their moist skin."
    ),
    q(
      "Insects like grasshoppers, butterflies, and houseflies take in air through ___.",
      "Spiracles along the sides of their body",
      [
        ["Gills inside their head", "breathing-organ-mixup"],
        ["Moist skin on their abdomen", "breathing-organ-mixup"],
        ["True lungs in their thorax", "breathing-organ-mixup"],
      ],
      "Insects respire via lateral spiracles connected to an internal network of tracheal air tubes."
    ),
    q(
      "Which of these sports items was once part of a living plant but is non-living now?",
      "A wooden cricket bat",
      [
        ["A steel javelin", "never-alive-mixup"],
        ["A synthetic plastic football", "never-alive-mixup"],
        ["A brass whistle", "never-alive-mixup"],
      ],
      "Cricket bats are made from willow wood, which was once part of a living tree."
    ),
    q(
      "Why can a coconut seed float across ocean waters without sinking or rotting?",
      "Its thick fibrous husk contains trapped air pockets that give it buoyancy",
      [
        ["Its light papery wings act like sails that catch ocean trade winds", "dispersal-agent-mixup"],
        ["Its inner hollow cavity is filled with light gas that lifts it", "dispersal-agent-mixup"],
        ["Its slippery outer wax repels water molecules and prevents gravity", "dispersal-agent-mixup"],
      ],
      "The fibrous mesocarp of the coconut holds air, allowing the seed to float buoyant across ocean currents."
    ),
    q(
      "What is the first organ to emerge from a germinating seed into the soil?",
      "The radicle, which develops into the primary root",
      [
        ["The plumule, which develops upward into the green stem", "seed-part-mixup"],
        ["The cotyledon, which expands into woody bark", "seed-part-mixup"],
        ["The seed coat, which becomes green foliage", "seed-part-mixup"],
      ],
      "The radicle emerges first from the seed to anchor the seedling in the soil and absorb moisture."
    ),
    q(
      "Whales and dolphins surface regularly in the open sea. Why is this behavior necessary?",
      "To inhale atmospheric air into lungs through blowholes",
      [
        ["To drink rainwater from surface clouds to prevent dehydration", "needs-energy-means-alive"],
        ["Because their gills cannot filter dissolved oxygen in deep oceans", "breathing-organ-mixup"],
        ["To cool their thick blubber coat under direct sunlight", "breathing-organ-mixup"],
      ],
      "Whales and dolphins are mammals with lungs; they cannot breathe underwater and must surface to take in air."
    ),
    q(
      "Which bird undertakes an incredible high-altitude migration over the Himalayas to spend winter in Indian wetlands?",
      "Bar-headed goose",
      [
        ["Arctic tern", "migration-reason-mixup"],
        ["House sparrow", "migration-reason-mixup"],
        ["Common kingfisher", "migration-reason-mixup"],
      ],
      "Bar-headed geese fly over the high Himalayas from Central Asia to Indian wetlands every winter."
    ),
    q(
      "A stick insect resembling a dry twig and an arctic fox turning white in winter are examples of ___.",
      "Camouflage",
      [
        ["Migration", "migration-reason-mixup"],
        ["Vegetative growth", "vegetative-part-mixup"],
        ["Metamorphosis", "sign-of-life-mixup"],
      ],
      "Camouflage allows organisms to blend into their surroundings to avoid detection by predators or prey."
    ),
    q(
      "Potato, ginger, and onion plants reproduce vegetatively through which modified plant structure?",
      "Underground stems",
      [
        ["Swollen underground roots", "vegetative-part-mixup"],
        ["Flower buds", "vegetative-part-mixup"],
        ["Seed capsules", "vegetative-part-mixup"],
      ],
      "Potatoes (tubers), ginger (rhizomes), and onions (bulbs) are all specialized underground stem modifications."
    ),
    q(
      "Why do snakes and desert lizards possess dry, horny scales on their skin?",
      "To prevent body water loss and protect against harsh rocky ground",
      [
        ["To absorb oxygen directly from humid air without using lungs", "breathing-organ-mixup"],
        ["To generate chemical heat when moving through cold night air", "body-covering-mixup"],
        ["To allow rapid swimming through deep underground mud tunnels", "body-covering-mixup"],
      ],
      "Scales form a tough waterproof covering that shields reptiles from rough terrain and prevents internal dehydration."
    ),
    q(
      "Which of these seeds is dispersed through the explosive bursting of its dry pod?",
      "Pea / Balsam",
      [
        ["Parachute dandelion", "dispersal-agent-mixup"],
        ["Cotton", "dispersal-agent-mixup"],
        ["Coconut", "dispersal-agent-mixup"],
      ],
      "Pea and balsam fruits dry under internal tension until they split and burst open, flicking seeds outwards."
    ),
    q(
      "Complete the analogy:\nBryophyllum : Leaves :: Potato : ___",
      "Stem buds (eyes)",
      [
        ["Seeds", "vegetative-part-mixup"],
        ["Roots", "vegetative-part-mixup"],
        ["Flowers", "vegetative-part-mixup"],
      ],
      "Bryophyllum reproduces vegetatively from leaf notches, while potato reproduces from underground stem buds (eyes)."
    ),
    q(
      "Read the statements about living things:\nStatement 1: All plants produce seeds to reproduce.\nStatement 2: Non-flowering ferns produce spores instead of seeds.\nWhich option is correct?",
      "Statement 1 is false, but Statement 2 is true",
      [
        ["Both Statement 1 and Statement 2 are true", "vegetative-part-mixup"],
        ["Both Statement 1 and Statement 2 are false", "vegetative-part-mixup"],
        ["Statement 1 is true, but Statement 2 is false", "vegetative-part-mixup"],
      ],
      "Not all plants produce seeds. Non-flowering plants like ferns and mosses reproduce through microscopic spores."
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
