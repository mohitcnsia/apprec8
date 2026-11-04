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

  "sq-bones-study": {
    name: "Bones, Joints and Muscles",
    author: "Apprec8",
    content: `### 🦴 The Human Skeleton

The human skeleton is a strong internal framework of **206 bones** in an adult. A newborn baby has about **300 soft bones**, but many fuse together as the baby grows.

The skeleton performs five critical functions:
1. **Support:** It gives our body shape and keeps us upright.
2. **Protection:** It shields delicate internal organs from injury.
3. **Movement:** Bones work together with muscles to allow us to walk, bend, and lift.
4. **Blood cell production:** Soft tissue called **bone marrow** inside long bones makes red and white blood cells.
5. **Mineral storage:** Bones store essential minerals like **calcium** and **phosphorus**.

---

### 🛡️ Major Parts of the Skeleton

- **The Skull:** Made of **22 bones** (8 flat cranial bones interlocking to protect the brain, and 14 facial bones). Only the **lower jaw (mandible)** is movable, enabling us to chew and speak.
- **The Backbone (Spine):** Made of **33 small ring-like bones called vertebrae**. It protects the delicate **spinal cord** and lets us twist and bend.
- **The Rib Cage:** Formed by **12 pairs of curved bones** (24 ribs). They join the breastbone (**sternum**) in front and the spine at the back, protecting the heart and lungs. The lowest two pairs are joined only to the spine and are called **floating ribs**.
- **Limbs:**
  - **Forelimbs (Arms):** The upper arm has one long bone called the **humerus**; the forearm has two bones (**radius** and **ulna**).
  - **Hindlimbs (Legs):** The thigh bone, called the **femur**, is the **longest and strongest bone** in the entire human body.

---

### 🔄 Movable Joints

A **joint** is the place where two or more bones meet. Tough elastic bands of tissue called **ligaments** hold bones together at joints. A smooth rubbery layer called **cartilage** covers the bone ends so they do not grind against each other.

There are four main types of movable joints:
1. **Ball-and-socket joint:** A rounded bone head fits into a hollow cup. Moves freely in **all directions**. Found in the **shoulder** and **hip**.
2. **Hinge joint:** Works like a door on a hinge, moving in **one direction back and forth**. Found in the **elbow, knee, fingers, and toes**.
3. **Pivot joint:** Allows a bone to rotate sideways and nod up and down. Found in the **neck** (between the skull and first two vertebrae).
4. **Gliding joint:** Bones slide smoothly over one another in multiple directions. Found in the **wrist, ankle**, and between the vertebrae of the spine.

> 🔒 **Immovable Joints:** The joints between the cranial bones of your skull are fixed together and cannot move at all.

---

### 💪 Muscles: Working in Pairs

Bones cannot move by themselves. Over **600 muscles** in the human body are attached to bones by tough white cords called **tendons**.

- **Muscles can only pull—they never push!** When a muscle contracts, it gets shorter, thicker, and pulls on the bone.
- Because muscles only pull, they work in **antagonistic pairs**. To bend your elbow, the **biceps** on the front contracts while the **triceps** on the back relaxes. To straighten your arm, the **triceps contracts** while the **biceps relaxes**.
- **Voluntary muscles:** Muscles whose movement you can consciously control (muscles of your arms, legs, face).
- **Involuntary muscles:** Muscles that work automatically without conscious effort (cardiac muscles of the heart pumping blood, smooth muscles of the stomach and intestines churning food).`,
  },
  "sq-food-study": {
    name: "Digestion, Teeth and Food",
    author: "Apprec8",
    content: `### 🦷 Our Teeth and Their Care

Teeth help us bite, chew, and break down food so our body can digest it easily.

- **Two sets of teeth in a lifetime:**
  - **Temporary teeth (Milk teeth):** A child develops **20 milk teeth** starting around six months of age.
  - **Permanent teeth:** Between ages 6 and 12, milk teeth fall out and are replaced by **32 permanent teeth** (16 in the upper jaw and 16 in the lower jaw).

---

### ✂️ Four Types of Teeth

| Tooth Type | Count | Shape | Function |
|---|---|---|---|
| **Incisors** | 8 (4 upper, 4 lower) | Chisel-shaped with flat sharp edges | Biting and cutting food |
| **Canines** | 4 (2 upper, 2 lower) | Sharp, pointed and conical | Tearing tough food |
| **Premolars** | 8 (4 upper, 4 lower) | Broad with flat ridged tops | Cracking and crushing food |
| **Molars** | 12 (6 upper, 6 lower) | Wider and flatter than premolars | Grinding food finely before swallowing |

The outer visible part of a tooth is the **crown**, while the part anchored inside the jawbone is the **root**. The shiny white outer layer is **enamel**, which is the **hardest substance in the human body**! Under the enamel lies the yellow **dentine**, and inside is the soft **pulp** filled with nerves and blood vessels.

---

### 🥣 The Journey of Digestion

Digestion is the process of breaking down complex food into simple, soluble substances that the blood can absorb:

1. **Mouth:** Teeth chew food into tiny pieces. Salivary glands release **saliva**, which contains digestive enzymes that convert insoluble **starch into soluble sugar**.
2. **Food Pipe (Oesophagus):** A muscular tube that pushes food down into the stomach using wave-like rhythmic contractions called **peristalsis**.
3. **Stomach:** A muscular J-shaped bag that churns food with acidic **gastric juices** for 3–4 hours, killing harmful bacteria and breaking down **proteins**.
4. **Small Intestine:** A long, coiled tube (nearly 6 metres long). Digestion finishes here with help from juices secreted by the **liver** (which makes **bile** to digest fats) and the **pancreas**. Tiny finger-like projections called **villi** absorb the dissolved nutrients directly into the blood.
5. **Large Intestine:** It receives undigested waste, absorbs excess **water and salts**, and passes semi-solid waste (faeces) into the **rectum** to be eliminated through the **anus**.

---

### 🥗 Balanced Diet & Deficiency Diseases

A **balanced diet** contains carbohydrates, fats, proteins, vitamins, minerals, roughage, and water in the right proportions.

When a diet consistently lacks a specific nutrient over a long period, it causes a **deficiency disease**:

| Missing Nutrient | Deficiency Disease | Symptoms | Food Sources |
|---|---|---|---|
| **Vitamin A** | Night blindness | Cannot see clearly in dim light | Carrots, papaya, spinach, milk |
| **Vitamin B1** | Beriberi | Weak muscles and severe nerve fatigue | Whole grains, beans, unpolished rice |
| **Vitamin C** | Scurvy | Bleeding gums, swollen painful joints | Amla, oranges, lemons, tomatoes |
| **Vitamin D** | Rickets | Soft, weak bones that bend into bow legs | Sunlight exposure, milk, fish, eggs |
| **Iron** | Anaemia | Low haemoglobin, pale skin, constant tiredness | Spinach, jaggery, beetroot, apples |
| **Iodine** | Goitre | Swollen thyroid gland in front of the neck | Iodised salt, seafood |
| **Calcium** | Weak bones & teeth | Fragile bones, brittle teeth | Milk, curd, paneer, green leafy vegetables |
| **Proteins** | Kwashiorkor | Swollen belly, stunted growth, thin limbs | Pulses, soy, eggs, fish, lentils |`,
  },
  "sq-nervous-study": {
    name: "The Nervous System, Sense Organs and Health",
    author: "Apprec8",
    content: `### 🧠 The Control Centre: The Nervous System

The **nervous system** controls and coordinates all activities of the human body, from thinking and breathing to running and feeling pain. It consists of the **brain**, the **spinal cord**, and a vast network of **nerves**.

---

### 🏛️ The Three Parts of the Brain

The brain weighs about 1.4 kg and is protected inside the hard bony **skull (cranium)**. It has three distinct parts:

1. **Cerebrum:**
   - The **largest and uppermost part** of the brain, covered in deep folds.
   - It controls conscious thinking, memory, intelligence, learning, emotions, and the five senses.
   - When you solve a maths puzzle, recall a poem, or decide to wave your hand, your cerebrum is working.

2. **Cerebellum:**
   - Located at the back of the head, below the cerebrum.
   - It coordinates voluntary muscle movements, posture, and body **balance**.
   - When you ride a bicycle, dance, or balance on one foot without falling, your cerebellum is in charge.

3. **Medulla Oblongata (Brain Stem):**
   - Connects the brain to the spinal cord.
   - It controls involuntary life-support functions: **heartbeat, breathing, blood pressure, and swallowing**.
   - It never sleeps—it works non-stop 24 hours a day even when you are fast asleep!

---

### ⚡ The Spinal Cord & Reflex Actions

The **spinal cord** is a thick bundle of nerves that emerges from the medulla and runs down the back, safely enclosed inside the flexible vertebral column (backbone).

A **reflex action** is an immediate, automatic, involuntary response to a stimulus that happens without thinking.
- When you accidentally touch a hot plate or step on a sharp thorn, your hand or foot pulls back instantly before you even feel the pain.
- In a reflex action, sensory nerves send the emergency message to the **spinal cord**, which immediately commands the muscles to pull back via motor nerves. **The message does not wait for the cerebrum to think**, preventing serious injury!

---

### 👁️ Sense Organs and Healthy Living

Our five sense organs connect us to the world:
- **Eyes:** The transparent **cornea** admits light, the coloured **iris** adjusts the **pupil** size, and the **lens** focuses images onto the light-sensitive **retina**. The **optic nerve** carries visual signals to the brain.
- **Ears:** The outer ear catches sound waves; the vibrating **eardrum** passes vibrations through three tiny middle ear bones to the cochlea, which sends signals via the **auditory nerve**.
- **Nose & Tongue:** Olfactory nerves detect smells; taste buds detect sweet, salty, sour, and bitter tastes.
- **Skin:** The largest sense organ, packed with nerve endings sensitive to touch, pressure, pain, heat, and cold.

---

### 🦠 Communicable Diseases and Microbes

Diseases can be classified into two categories:
- **Non-communicable diseases:** Cannot spread from person to person (e.g., deficiency diseases like scurvy, rickets, anaemia).
- **Communicable (infectious) diseases:** Spread from an infected person to a healthy person through harmful microorganisms called **pathogens**:

| Pathogen | Diseases Caused | Mode of Spread | Prevention Method |
|---|---|---|---|
| **Bacteria** | Typhoid, cholera, tuberculosis, pneumonia | Contaminated food, dirty water, infected cough droplets | Drinking boiled water, proper sanitation |
| **Viruses** | Common cold, influenza, measles, polio, dengue | Sneeze droplets in air, viral vectors (Aedes mosquito for dengue) | Covering mouth when coughing, vaccination |
| **Protozoa** | Malaria, amoebic dysentery | Bite of female *Anopheles* mosquito, unclean water | Sleeping under mosquito nets, preventing stagnant water |
| **Fungi** | Ringworm, athlete's foot | Direct skin contact, sharing infected towels or combs | Keeping skin clean and dry, personal hygiene |

> 🛡️ **Vaccination:** Vaccines train our immune system to recognise and fight specific disease germs before they can make us sick!`,
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

  "sq-bones-warmup": [
    {
      subtopic: "skeletal-system",
      ...q(
        "How many bones does a normal adult human skeleton contain?",
        "206 bones",
        [
          ["300 bones", "bone-count-mixup"],
          ["150 bones", "bone-count-mixup"],
          ["250 bones", "bone-count-mixup"]
        ],
        "An adult human skeleton has 206 bones. A baby is born with about 300 softer bones, but many fuse together as the child grows."
      ),
    },
    {
      subtopic: "skeletal-system",
      ...q(
        "Which bone is the longest and strongest bone in the human body?",
        "The thigh bone (femur)",
        [
          ["The upper arm bone (humerus)", "bone-location-mixup"],
          ["The breastbone (sternum)", "bone-location-mixup"],
          ["The backbone (spine)", "bone-location-mixup"]
        ],
        "The femur (thigh bone) is the longest and strongest bone in the body, supporting our body weight while walking and jumping."
      ),
    },
    {
      subtopic: "skeletal-system",
      ...q(
        "Which part of the human skull is movable?",
        "Only the lower jaw",
        [
          ["Only the upper jaw", "skull-mobility-mixup"],
          ["The nasal bone", "skull-mobility-mixup"],
          ["All skull bones", "skull-mobility-mixup"]
        ],
        "All bones of the skull are immovable and locked together except the lower jaw (mandible), which moves to let us speak and chew."
      ),
    },
    {
      subtopic: "movable-joints",
      ...q(
        "Which type of movable joint is found at your elbow and knee?",
        "Hinge joint",
        [
          ["Ball-and-socket joint", "joint-type-mixup"],
          ["Pivot joint", "joint-type-mixup"],
          ["Gliding joint", "joint-type-mixup"]
        ],
        "Elbows and knees have hinge joints that open and close in one direction like the hinge of a door."
      ),
    },
    {
      subtopic: "muscular-system",
      ...q(
        "What tough tissue connects muscles to bones in the human body?",
        "Tendons",
        [
          ["Ligaments", "tissue-connection-mixup"],
          ["Cartilage", "tissue-connection-mixup"],
          ["Bone marrow", "tissue-connection-mixup"]
        ],
        "Tendons are tough cords that attach muscles to bones. Ligaments connect bones to other bones at joints."
      ),
    },
    {
      subtopic: "muscular-system",
      ...q(
        "Why do biceps and triceps work together in pairs to move the arm?",
        "Muscles can only pull, never push",
        [
          ["One muscle has no nerve supply", "muscle-action-mixup"],
          ["Bones push muscles into position", "muscle-action-mixup"],
          ["Muscles only contract when sleeping", "muscle-action-mixup"]
        ],
        "Muscles move bones by contracting and pulling on them. Because a muscle cannot push, another muscle must contract to pull the bone back."
      ),
    },
  ],
  "sq-bones-joints-quiz": [
    {
      subtopic: "movable-joints",
      ...q(
        "Which joint allows maximum movement in all directions?",
        "Ball-and-socket joint",
        [
          ["Hinge joint", "joint-motion-mixup"],
          ["Pivot joint", "joint-motion-mixup"],
          ["Gliding joint", "joint-motion-mixup"]
        ],
        "The ball-and-socket joint in the shoulder and hip allows the limb to rotate freely in all directions."
      ),
    },
    {
      subtopic: "movable-joints",
      ...q(
        "Which type of joint connects the skull to the top of the backbone, allowing you to turn your head?",
        "Pivot joint",
        [
          ["Hinge joint", "joint-location-mixup"],
          ["Ball-and-socket joint", "joint-location-mixup"],
          ["Fixed joint", "joint-location-mixup"]
        ],
        "The pivot joint between the skull and the first two neck vertebrae allows your head to rotate from side to side and nod up and down."
      ),
    },
    {
      subtopic: "movable-joints",
      ...q(
        "What is the smooth, flexible tissue that covers the ends of bones at joints to prevent friction?",
        "Cartilage",
        [
          ["Ligament", "joint-lining-mixup"],
          ["Tendon", "joint-lining-mixup"],
          ["Bone marrow", "joint-lining-mixup"]
        ],
        "Cartilage acts as a smooth, rubbery shock absorber at bone ends so that bones do not grind against each other during movement."
      ),
    },
    {
      subtopic: "movable-joints",
      ...q(
        "Which of the following contains an immovable (fixed) joint?",
        "The cranium of the skull",
        [
          ["The human shoulder", "immovable-joint-mixup"],
          ["The human wrist", "immovable-joint-mixup"],
          ["The human knee", "immovable-joint-mixup"]
        ],
        "The bones of the cranium fit tightly together like puzzle pieces and cannot move, protecting the soft brain inside."
      ),
    },
    {
      subtopic: "muscular-system",
      ...q(
        "What happens to your biceps and triceps when you bend your elbow to touch your shoulder?",
        "Biceps contracts and triceps relaxes",
        [
          ["Biceps relaxes and triceps contracts", "muscle-pair-mixup"],
          ["Both biceps and triceps contract together", "muscle-pair-mixup"],
          ["Both biceps and triceps relax completely", "muscle-pair-mixup"]
        ],
        "To bend the elbow, the biceps on the front of the upper arm contracts (shortens), while the triceps on the back relaxes."
      ),
    },
    {
      subtopic: "muscular-system",
      ...q(
        "Which kind of muscle is found in the walls of the stomach and blood vessels?",
        "Involuntary smooth muscle",
        [
          ["Voluntary skeletal muscle", "muscle-type-mixup"],
          ["Voluntary cardiac muscle", "muscle-type-mixup"],
          ["Involuntary bone muscle", "muscle-type-mixup"]
        ],
        "Internal organs like the stomach, intestines, and blood vessels are made of involuntary smooth muscles that work automatically."
      ),
    },
  ],
  "sq-bones-gate-pool": [
    {
      subtopic: "skeletal-system",
      ...q(
        "How many pairs of ribs make up the human rib cage?",
        "12 pairs of ribs",
        [
          ["10 pairs of ribs", "rib-count-mixup"],
          ["14 pairs of ribs", "rib-count-mixup"],
          ["24 pairs of ribs", "rib-count-mixup"]
        ],
        "The human rib cage consists of 12 pairs (24 total) of curved bones that protect the heart and lungs."
      ),
    },
    {
      subtopic: "skeletal-system",
      ...q(
        "Why are the lowest two pairs of ribs in the rib cage called 'floating ribs'?",
        "They are attached only to the spine",
        [
          ["They float freely inside the lungs", "floating-rib-mixup"],
          ["They are made entirely of liquid", "floating-rib-mixup"],
          ["They are not joined to any bone", "floating-rib-mixup"]
        ],
        "The 11th and 12th pairs of ribs do not attach to the breastbone (sternum) in front; they are attached only to the vertebral column."
      ),
    },
    {
      subtopic: "skeletal-system",
      ...q(
        "Which important organ system is protected inside the vertebral column (backbone)?",
        "The spinal cord",
        [
          ["The human stomach", "spine-organ-mixup"],
          ["The two kidneys", "spine-organ-mixup"],
          ["The vocal cords", "spine-organ-mixup"]
        ],
        "The vertebral column consists of 33 ring-shaped vertebrae stacked together to shelter and protect the delicate spinal cord."
      ),
    },
    {
      subtopic: "skeletal-system",
      ...q(
        "Where are red blood cells produced in the human skeletal system?",
        "Inside bone marrow",
        [
          ["Inside hard bone enamel", "bone-function-mixup"],
          ["Inside cartilage layers", "bone-function-mixup"],
          ["Inside joint ligaments", "bone-function-mixup"]
        ],
        "Bone marrow is a soft, spongy tissue found inside hollow long bones where new blood cells are continuously produced."
      ),
    },
    {
      subtopic: "skeletal-system",
      ...q(
        "Read the following statements about human bones:\n(i) Bones store calcium and phosphorus.\n(ii) All bones in the human skull can move freely.\n(iii) The femur is located in the upper arm.\n(iv) The vertebral column is made of 33 vertebrae.\nWhich statements are CORRECT?",
        "(i) and (iv) only",
        [
          ["(i), (ii) and (iv) only", "skeletal-statement-eval"],
          ["(ii) and (iii) only", "skeletal-statement-eval"],
          ["(i) and (iii) only", "skeletal-statement-eval"]
        ],
        "Statement (i) is correct (bones store minerals) and (iv) is correct (33 vertebrae). Statement (ii) is false (only lower jaw moves) and (iii) is false (femur is in the thigh)."
      ),
    },
    {
      subtopic: "movable-joints",
      ...q(
        "What type of joint is present between the bones of your wrist and ankle?",
        "Gliding joint",
        [
          ["Pivot joint", "gliding-joint-mixup"],
          ["Hinge joint", "gliding-joint-mixup"],
          ["Immovable joint", "gliding-joint-mixup"]
        ],
        "The wrist and ankle contain gliding joints where flat bones slide past each other to allow smooth, multi-directional bending."
      ),
    },
    {
      subtopic: "movable-joints",
      ...q(
        "What is the main function of ligaments at a skeletal joint?",
        "To connect bone to bone",
        [
          ["To connect muscle to bone", "ligament-function-mixup"],
          ["To produce red blood cells", "ligament-function-mixup"],
          ["To supply digestive juices", "ligament-function-mixup"]
        ],
        "Ligaments are strong, stretchy bands of fibrous tissue that bind bones together at a joint, keeping the joint stable."
      ),
    },
    {
      subtopic: "movable-joints",
      ...q(
        "Refer to the given relationship and select the option that completes it correctly:\nShoulder : Ball-and-socket joint :: Knee : ———",
        "Hinge joint",
        [
          ["Pivot joint", "joint-analogy-mixup"],
          ["Gliding joint", "joint-analogy-mixup"],
          ["Fixed joint", "joint-analogy-mixup"]
        ],
        "The shoulder is an example of a ball-and-socket joint, while the knee is an example of a hinge joint."
      ),
    },
    {
      subtopic: "movable-joints",
      ...q(
        "An orthopaedic doctor observes a joint that moves in only one plane, like the opening of a single door. Which joint is this?",
        "The elbow joint",
        [
          ["The hip joint", "joint-plane-mixup"],
          ["The neck pivot joint", "joint-plane-mixup"],
          ["The skull suture joint", "joint-plane-mixup"]
        ],
        "A hinge joint moves strictly in one plane back and forth. The elbow and knee are classic hinge joints."
      ),
    },
    {
      subtopic: "movable-joints",
      ...q(
        "If the cartilage at a person's knee joint wears away completely, what is the most likely symptom they will experience?",
        "Pain from bones grinding together",
        [
          ["Bones fusing together into a fixed joint immediately", "cartilage-loss-mixup"],
          ["Loss of feeling in the leg skin", "cartilage-loss-mixup"],
          ["Bones growing longer than normal", "cartilage-loss-mixup"]
        ],
        "Cartilage cushions bone ends. Without it, the rough surfaces of the bones rub directly against each other, causing stiffness and severe pain."
      ),
    },
    {
      subtopic: "muscular-system",
      ...q(
        "Which of the following is an example of a voluntary muscle?",
        "Muscle in the arm used to lift a cup",
        [
          ["Muscle of the heart pumping blood", "voluntary-muscle-mixup"],
          ["Muscle in the stomach churning food", "voluntary-muscle-mixup"],
          ["Muscle in the eye pupil dilating", "voluntary-muscle-mixup"]
        ],
        "Voluntary muscles (like biceps and quadriceps) are under conscious control; you decide when to contract them."
      ),
    },
    {
      subtopic: "muscular-system",
      ...q(
        "What type of muscle makes up the walls of the human heart?",
        "Cardiac muscle",
        [
          ["Skeletal muscle", "cardiac-muscle-mixup"],
          ["Voluntary smooth muscle", "cardiac-muscle-mixup"],
          ["Cartilage muscle", "cardiac-muscle-mixup"]
        ],
        "The heart is made of cardiac muscle, which is involuntary and works continuously throughout life without stopping or fatiguing easily."
      ),
    },
    {
      subtopic: "muscular-system",
      ...q(
        "Complete the given relationship correctly:\nBone to bone : Ligament :: Muscle to bone : ———",
        "Tendon",
        [
          ["Cartilage", "tissue-pair-mixup"],
          ["Vertebra", "tissue-pair-mixup"],
          ["Marrow", "tissue-pair-mixup"]
        ],
        "Ligaments link bones to other bones; tendons link voluntary muscles securely to bones."
      ),
    },
    {
      subtopic: "muscular-system",
      ...q(
        "Consider the following statements about human muscles:\n(i) Muscles can push bones away during extension.\n(ii) Muscles work in opposing pairs to produce movement.\n(iii) The human body has over 600 muscles.\n(iv) Cardiac muscle is under our conscious voluntary control.\nWhich statements are TRUE?",
        "(ii) and (iii) only",
        [
          ["(i) and (iii) only", "muscle-statement-eval"],
          ["(i), (ii) and (iv) only", "muscle-statement-eval"],
          ["(ii) and (iv) only", "muscle-statement-eval"]
        ],
        "Statements (ii) and (iii) are true. Statement (i) is false because muscles only pull, never push. Statement (iv) is false because cardiac muscle is involuntary."
      ),
    },
    {
      subtopic: "muscular-system",
      ...q(
        "When an athlete straightens their bent leg at the knee, what happens to the thigh muscles?",
        "One muscle contracts while the other relaxes",
        [
          ["Both thigh muscles push outward together", "muscle-coordination-mixup"],
          ["Both thigh muscles turn into cartilage", "muscle-coordination-mixup"],
          ["Neither muscle changes length or tension", "muscle-coordination-mixup"]
        ],
        "Skeletal muscles always operate in antagonistic pairs: as one muscle contracts to pull the bone, the opposing partner muscle relaxes."
      ),
    },
  ],
  "sq-food-warmup": [
    {
      subtopic: "teeth-types",
      ...q(
        "How many permanent teeth does an adult human have in a full set?",
        "32 permanent teeth",
        [
          ["20 permanent teeth", "tooth-count-mixup"],
          ["28 permanent teeth", "tooth-count-mixup"],
          ["36 permanent teeth", "tooth-count-mixup"]
        ],
        "An adult has 32 permanent teeth (16 in the upper jaw and 16 in the lower jaw). Children have 20 milk teeth."
      ),
    },
    {
      subtopic: "teeth-types",
      ...q(
        "Which type of teeth are sharp and pointed, specifically designed for tearing food?",
        "Canines",
        [
          ["Incisors", "tooth-shape-mixup"],
          ["Premolars", "tooth-shape-mixup"],
          ["Molars", "tooth-shape-mixup"]
        ],
        "Canines are sharp, pointed teeth positioned beside the incisors, designed to tear fibrous food."
      ),
    },
    {
      subtopic: "teeth-types",
      ...q(
        "What is the hardest substance found in the human body?",
        "Tooth enamel",
        [
          ["Femur bone", "enamel-hardness-mixup"],
          ["Knee cartilage", "enamel-hardness-mixup"],
          ["Skull cranium", "enamel-hardness-mixup"]
        ],
        "Enamel, the glossy white covering of the tooth crown, is the hardest material in the human body."
      ),
    },
    {
      subtopic: "digestive-system",
      ...q(
        "Where does the process of chemical digestion begin in the human digestive system?",
        "In the mouth with saliva",
        [
          ["In the stomach with acid", "digestion-start-mixup"],
          ["In the small intestine", "digestion-start-mixup"],
          ["In the food pipe (oesophagus)", "digestion-start-mixup"]
        ],
        "Digestion begins in the mouth where saliva mixes with chewed food and starts breaking down starch into soluble sugar."
      ),
    },
    {
      subtopic: "digestive-system",
      ...q(
        "Which digestive organ produces bile to help digest fats?",
        "The liver",
        [
          ["The stomach", "liver-bile-mixup"],
          ["The pancreas", "liver-bile-mixup"],
          ["The large intestine", "liver-bile-mixup"]
        ],
        "The liver secretes bile juice, which is stored in the gall bladder and helps break down fats in the small intestine."
      ),
    },
    {
      subtopic: "nutrients-deficiency",
      ...q(
        "Which deficiency disease is caused by a severe lack of Vitamin C in the diet?",
        "Scurvy",
        [
          ["Rickets", "vitamin-c-mixup"],
          ["Beriberi", "vitamin-c-mixup"],
          ["Goitre", "vitamin-c-mixup"]
        ],
        "Scurvy causes bleeding gums and skin spots, and is caused by a lack of Vitamin C (found in citrus fruits and amla)."
      ),
    },
  ],
  "sq-food-nutrients-quiz": [
    {
      subtopic: "nutrients-deficiency",
      ...q(
        "Which nutrient is primarily responsible for building and repairing body tissues?",
        "Proteins",
        [
          ["Carbohydrates", "nutrient-role-mixup"],
          ["Fats", "nutrient-role-mixup"],
          ["Vitamins", "nutrient-role-mixup"]
        ],
        "Proteins are the body-building nutrients needed for growth, muscle development, and healing damaged tissues."
      ),
    },
    {
      subtopic: "nutrients-deficiency",
      ...q(
        "Which deficiency disease results in soft, bent bones and bow legs in young children?",
        "Rickets",
        [
          ["Scurvy", "rickets-symptom-mixup"],
          ["Anaemia", "rickets-symptom-mixup"],
          ["Night blindness", "rickets-symptom-mixup"]
        ],
        "Rickets is caused by a deficiency of Vitamin D (and calcium), making bones too soft to bear the body's weight."
      ),
    },
    {
      subtopic: "nutrients-deficiency",
      ...q(
        "A lack of which mineral causes anaemia, leading to fatigue and pale skin?",
        "Iron",
        [
          ["Calcium", "iron-anaemia-mixup"],
          ["Iodine", "iron-anaemia-mixup"],
          ["Sodium", "iron-anaemia-mixup"]
        ],
        "Iron is needed to produce haemoglobin in red blood cells. A lack of iron leads to anaemia and low energy."
      ),
    },
    {
      subtopic: "nutrients-deficiency",
      ...q(
        "What is the main role of dietary fibre (roughage) in our daily food intake?",
        "It helps move undigested waste smoothly",
        [
          ["It provides quick bursts of energy", "fibre-function-mixup"],
          ["It kills bacteria in the mouth", "fibre-function-mixup"],
          ["It repairs fractured bone tissue", "fibre-function-mixup"]
        ],
        "Roughage cannot be digested, but it adds bulk to the food, helping bowels pass waste and preventing constipation."
      ),
    },
    {
      subtopic: "digestive-system",
      ...q(
        "Which organ absorbs most of the water from undigested food before waste is passed out?",
        "The large intestine",
        [
          ["The small intestine", "large-intestine-mixup"],
          ["The stomach", "large-intestine-mixup"],
          ["The food pipe", "large-intestine-mixup"]
        ],
        "The large intestine absorbs excess water and useful mineral salts from undigested food matter, turning it into semi-solid faeces."
      ),
    },
    {
      subtopic: "nutrients-deficiency",
      ...q(
        "Which nutrient provides the body with its main and quickest source of daily energy?",
        "Carbohydrates",
        [
          ["Proteins", "carb-energy-mixup"],
          ["Minerals", "carb-energy-mixup"],
          ["Roughage", "carb-energy-mixup"]
        ],
        "Carbohydrates (such as starch and sugars found in rice, wheat, and potatoes) are broken down into glucose to release energy."
      ),
    },
  ],
  "sq-food-gate-pool": [
    {
      subtopic: "digestive-system",
      ...q(
        "What are the tiny finger-like projections on the inner wall of the small intestine that absorb nutrients?",
        "Villi",
        [
          ["Enzymes", "villi-absorb-mixup"],
          ["Vertebrae", "villi-absorb-mixup"],
          ["Taste buds", "villi-absorb-mixup"]
        ],
        "Villi line the inside of the small intestine, providing a huge surface area to absorb digested nutrients into the bloodstream."
      ),
    },
    {
      subtopic: "digestive-system",
      ...q(
        "What is the name of the rhythmic muscular contraction that pushes food along the oesophagus?",
        "Peristalsis",
        [
          ["Respiration", "peristalsis-mixup"],
          ["Circulation", "peristalsis-mixup"],
          ["Mastication", "peristalsis-mixup"]
        ],
        "Peristalsis is the wave-like contraction of smooth muscles that moves food steadily downward through the digestive tract."
      ),
    },
    {
      subtopic: "digestive-system",
      ...q(
        "What is the primary role of hydrochloric acid secreted by the stomach lining?",
        "It kills bacteria and creates an acidic environment",
        [
          ["It turns protein directly into bone enamel", "stomach-acid-mixup"],
          ["It absorbs water into the bloodstream", "stomach-acid-mixup"],
          ["It neutralises all salivary enzymes permanently", "stomach-acid-mixup"]
        ],
        "Hydrochloric acid in gastric juice destroys harmful microbes swallowed with food and activates digestive enzymes that break down protein."
      ),
    },
    {
      subtopic: "digestive-system",
      ...q(
        "Complete the given biological relationship:\nMouth : Starch breakdown :: Stomach : ———",
        "Protein breakdown",
        [
          ["Fat absorption", "digestion-site-analogy"],
          ["Water absorption", "digestion-site-analogy"],
          ["Bile production", "digestion-site-analogy"]
        ],
        "In the mouth, saliva starts digesting starch into sugars; in the stomach, gastric juices begin breaking down proteins into simpler forms."
      ),
    },
    {
      subtopic: "digestive-system",
      ...q(
        "Read the following statements about human digestion:\n(i) Most nutrient absorption takes place in the small intestine.\n(ii) The liver produces bile to help break down fats.\n(iii) Digestion is completed in the large intestine.\n(iv) Saliva contains enzymes that break down starch.\nWhich of the statements are CORRECT?",
        "(i), (ii) and (iv) only",
        [
          ["(i) and (iii) only", "digestion-statement-eval"],
          ["(ii) and (iii) only", "digestion-statement-eval"],
          ["(iii) and (iv) only", "digestion-statement-eval"]
        ],
        "Statements (i), (ii), and (iv) are correct. Statement (iii) is incorrect because digestion finishes in the small intestine; the large intestine only absorbs water."
      ),
    },
    {
      subtopic: "teeth-types",
      ...q(
        "How many incisors are present in the mouth of a person with a full set of teeth?",
        "8 incisors",
        [
          ["4 incisors", "incisor-count-mixup"],
          ["12 incisors", "incisor-count-mixup"],
          ["16 incisors", "incisor-count-mixup"]
        ],
        "There are 8 incisors in total (4 in the upper jaw and 4 in the lower jaw), used for biting and cutting food."
      ),
    },
    {
      subtopic: "teeth-types",
      ...q(
        "Which flat, broad teeth are located at the very back of the mouth, used for grinding food finely?",
        "Molars",
        [
          ["Canines", "molar-grind-mixup"],
          ["Incisors", "molar-grind-mixup"],
          ["Milk teeth", "molar-grind-mixup"]
        ],
        "Molars are wide and flat teeth at the back of each jaw that grind and crush food into a fine paste before swallowing."
      ),
    },
    {
      subtopic: "teeth-types",
      ...q(
        "What soft inner layer of a tooth contains living blood vessels and nerve endings?",
        "Pulp",
        [
          ["Enamel", "tooth-pulp-mixup"],
          ["Dentine", "tooth-pulp-mixup"],
          ["Root canal bone", "tooth-pulp-mixup"]
        ],
        "The pulp is the soft, living centre of a tooth that supplies nutrients through blood vessels and senses pain or cold through nerves."
      ),
    },
    {
      subtopic: "teeth-types",
      ...q(
        "Complete the given dental relationship:\nCutting and biting : Incisors :: Tearing tough food : ———",
        "Canines",
        [
          ["Premolars", "teeth-analogy-mixup"],
          ["Molars", "teeth-analogy-mixup"],
          ["Enamel", "teeth-analogy-mixup"]
        ],
        "Incisors are chisel-shaped for biting into food, while pointed canines tear tough or fibrous food."
      ),
    },
    {
      subtopic: "teeth-types",
      ...q(
        "A student eats sticky sweets and does not brush their teeth before sleeping. What is the direct cause of tooth decay in this situation?",
        "Bacteria produce acid from leftover sugar that dissolves enamel",
        [
          ["Sugar enters inside the tooth and pushes the root out", "plaque-acid-mixup"],
          ["Lack of protective saliva causes teeth to crack under chewing pressure", "plaque-acid-mixup"],
          ["Teeth stop receiving nutrients from the gums", "plaque-acid-mixup"]
        ],
        "Mouth bacteria feed on residual sugar from sweets and produce acids that eat away the minerals in enamel, forming a cavity."
      ),
    },
    {
      subtopic: "nutrients-deficiency",
      ...q(
        "Which symptom is most characteristic of Vitamin A deficiency (night blindness)?",
        "Difficulty seeing objects in dim light",
        [
          ["Bleeding and spongy gums during brushing", "night-blindness-symptom"],
          ["Swelling of the thyroid gland in the neck", "night-blindness-symptom"],
          ["Bones becoming soft and bending into curves", "night-blindness-symptom"]
        ],
        "Vitamin A is necessary for healthy retinas; its deficiency causes night blindness, making it hard to see in dim light."
      ),
    },
    {
      subtopic: "nutrients-deficiency",
      ...q(
        "Which disease causes swelling of the thyroid gland in the neck due to a lack of iodine?",
        "Goitre",
        [
          ["Scurvy", "goitre-iodine-mixup"],
          ["Rickets", "goitre-iodine-mixup"],
          ["Beriberi", "goitre-iodine-mixup"]
        ],
        "Goitre is an enlargement of the thyroid gland in the neck, caused by an insufficient intake of iodine in food or salt."
      ),
    },
    {
      subtopic: "nutrients-deficiency",
      ...q(
        "Identify the missing deficiency disease in the given pair:\nVitamin C : Scurvy :: Vitamin B1 : ———",
        "Beriberi",
        [
          ["Rickets", "vitamin-deficiency-analogy"],
          ["Goitre", "vitamin-deficiency-analogy"],
          ["Anaemia", "vitamin-deficiency-analogy"]
        ],
        "Lack of Vitamin C causes scurvy, while lack of Vitamin B1 (thiamine) causes beriberi, which affects muscles and nerves."
      ),
    },
    {
      subtopic: "nutrients-deficiency",
      ...q(
        "A doctor advises a child with pale skin and low energy to eat more spinach, jaggery, and dates. Which nutrient is the doctor aiming to restore?",
        "Iron",
        [
          ["Calcium", "food-nutrient-matching"],
          ["Vitamin A", "food-nutrient-matching"],
          ["Iodine", "food-nutrient-matching"]
        ],
        "Spinach, jaggery, and dates are rich sources of iron, which the body uses to manufacture haemoglobin and overcome anaemia."
      ),
    },
    {
      subtopic: "nutrients-deficiency",
      ...q(
        "Look at the following statements about nutrients:\n(i) Fats provide more energy per gram than carbohydrates.\n(ii) Scurvy is caused by a deficiency of calcium.\n(iii) Kwashiorkor in children is caused by a severe deficiency of protein.\n(iv) Sunlight triggers the production of Vitamin D in human skin.\nWhich of the statements are TRUE?",
        "(i), (iii) and (iv) only",
        [
          ["(i) and (ii) only", "nutrient-statement-eval"],
          ["(ii) and (iii) only", "nutrient-statement-eval"],
          ["(i), (ii) and (iv) only", "nutrient-statement-eval"]
        ],
        "Statements (i), (iii), and (iv) are true. Statement (ii) is false because scurvy is caused by Vitamin C deficiency, not calcium."
      ),
    },
  ],
  "sq-nervous-warmup": [
    {
      subtopic: "brain-nerves",
      ...q(
        "Which part of the human brain is the largest and controls thinking, learning, and memory?",
        "The cerebrum",
        [
          ["The cerebellum", "brain-part-mixup"],
          ["The medulla oblongata", "brain-part-mixup"],
          ["The spinal cord", "brain-part-mixup"]
        ],
        "The cerebrum is the largest part of the brain; its folded surface processes conscious thought, memory, reasoning, and speech."
      ),
    },
    {
      subtopic: "brain-nerves",
      ...q(
        "Which part of the brain coordinates muscle movement and helps you maintain balance while riding a bicycle?",
        "The cerebellum",
        [
          ["The cerebrum", "cerebellum-balance-mixup"],
          ["The medulla oblongata", "cerebellum-balance-mixup"],
          ["The skull cranium", "cerebellum-balance-mixup"]
        ],
        "The cerebellum sits under the cerebrum at the back of the skull, fine-tuning voluntary muscle coordination and posture balance."
      ),
    },
    {
      subtopic: "brain-nerves",
      ...q(
        "Which part of the brain controls involuntary life-support actions like heartbeat and breathing even when you are asleep?",
        "The medulla oblongata",
        [
          ["The cerebrum", "medulla-function-mixup"],
          ["The cerebellum", "medulla-function-mixup"],
          ["The optic nerve", "medulla-function-mixup"]
        ],
        "The medulla oblongata (brain stem) regulates automatic vital actions including breathing, blood circulation, and digestion."
      ),
    },
    {
      subtopic: "sense-organs",
      ...q(
        "What is the light-sensitive screen at the back of the human eye where images are formed?",
        "The retina",
        [
          ["The cornea", "retina-image-mixup"],
          ["The pupil", "retina-image-mixup"],
          ["The iris", "retina-image-mixup"]
        ],
        "The retina contains photoreceptor cells that detect light rays focused by the lens and pass signals to the optic nerve."
      ),
    },
    {
      subtopic: "brain-nerves",
      ...q(
        "What type of nerves carry signals from your sense organs (eyes, ears, skin) directly to the brain?",
        "Sensory nerves",
        [
          ["Motor nerves", "sensory-nerve-mixup"],
          ["Reflex nerves", "sensory-nerve-mixup"],
          ["Digestive nerves", "sensory-nerve-mixup"]
        ],
        "Sensory nerves carry sensory inputs from receptors in sense organs to the central nervous system (brain and spinal cord)."
      ),
    },
    {
      subtopic: "diseases-prevention",
      ...q(
        "Malaria is a communicable disease transmitted to humans by the bite of which insect vector?",
        "Female Anopheles mosquito",
        [
          ["Male Anopheles mosquito", "malaria-vector-mixup"],
          ["Aedes mosquito", "malaria-vector-mixup"],
          ["Housefly", "malaria-vector-mixup"]
        ],
        "Malaria is caused by a protozoan parasite (Plasmodium) transmitted through the bite of an infected female Anopheles mosquito."
      ),
    },
  ],
  "sq-nervous-senses-quiz": [
    {
      subtopic: "sense-organs",
      ...q(
        "Which coloured circular muscle controls the amount of light entering the eye through the pupil?",
        "The iris",
        [
          ["The cornea", "iris-pupil-mixup"],
          ["The retina", "iris-pupil-mixup"],
          ["The lens", "iris-pupil-mixup"]
        ],
        "The iris is the coloured part of the eye that expands or contracts to adjust the size of the pupil based on light levels."
      ),
    },
    {
      subtopic: "sense-organs",
      ...q(
        "Which nerve carries hearing signals from the inner ear directly to the brain?",
        "The auditory nerve",
        [
          ["The optic nerve", "auditory-nerve-mixup"],
          ["The olfactory nerve", "auditory-nerve-mixup"],
          ["The spinal nerve", "auditory-nerve-mixup"]
        ],
        "The auditory nerve carries electrical signals produced by vibrating fluid in the inner ear (cochlea) to the brain for sound interpretation."
      ),
    },
    {
      subtopic: "sense-organs",
      ...q(
        "What nerve transmits smell signals from the upper nasal lining to the brain?",
        "The olfactory nerve",
        [
          ["The optic nerve", "olfactory-nerve-mixup"],
          ["The auditory nerve", "olfactory-nerve-mixup"],
          ["The motor nerve", "olfactory-nerve-mixup"]
        ],
        "Olfactory nerve endings in the upper nasal passages detect airborne chemical molecules and send smell messages to the brain."
      ),
    },
    {
      subtopic: "diseases-prevention",
      ...q(
        "Which of the following is a non-communicable disease caused by nutritional deficiency?",
        "Rickets",
        [
          ["Cholera", "non-communicable-mixup"],
          ["Tuberculosis", "non-communicable-mixup"],
          ["Typhoid", "non-communicable-mixup"]
        ],
        "Rickets is a non-communicable deficiency disease caused by a lack of Vitamin D; it cannot spread from one person to another."
      ),
    },
    {
      subtopic: "diseases-prevention",
      ...q(
        "What type of pathogen causes diseases like the common cold, influenza, measles, and dengue?",
        "Viruses",
        [
          ["Bacteria", "virus-disease-mixup"],
          ["Protozoa", "virus-disease-mixup"],
          ["Fungi", "virus-disease-mixup"]
        ],
        "Viruses are microscopic infectious agents that cause illnesses like the common cold, flu, measles, and dengue."
      ),
    },
    {
      subtopic: "diseases-prevention",
      ...q(
        "Why is it important to prevent water from stagnating in open containers, old tyres, and flowerpots around the home?",
        "To stop mosquitoes from breeding",
        [
          ["To keep houseflies from drinking water", "mosquito-prevention-mixup"],
          ["To prevent earthworms from migrating", "mosquito-prevention-mixup"],
          ["To stop fungi from growing roots", "mosquito-prevention-mixup"]
        ],
        "Mosquitoes lay eggs in clean or dirty stagnant water. Removing standing water prevents disease vectors from multiplying."
      ),
    },
  ],
  "sq-nervous-gate-pool": [
    {
      subtopic: "brain-nerves",
      ...q(
        "Which part of the human central nervous system directly controls involuntary reflex actions?",
        "The spinal cord",
        [
          ["The cerebrum", "reflex-spinal-mixup"],
          ["The skull cranium", "reflex-spinal-mixup"],
          ["The nasal nerve", "reflex-spinal-mixup"]
        ],
        "Reflex actions are fast, automatic survival reactions directed by the spinal cord so the body can react before the brain thinks."
      ),
    },
    {
      subtopic: "brain-nerves",
      ...q(
        "What is the function of motor nerves in the human nervous system?",
        "They carry commands from the brain to muscles",
        [
          ["They carry smell sensations from the nose to the brain", "motor-nerve-mixup"],
          ["They carry sound signals from the ears to the brain", "motor-nerve-mixup"],
          ["They produce new bone cells in the backbone", "motor-nerve-mixup"]
        ],
        "Motor nerves transmit instructions from the brain and spinal cord to muscles and glands to trigger movement or secretion."
      ),
    },
    {
      subtopic: "brain-nerves",
      ...q(
        "Refer to the given brain functions and complete the relationship:\nThinking and memory : Cerebrum :: Balance and posture : ———",
        "Cerebellum",
        [
          ["Medulla oblongata", "brain-function-analogy"],
          ["Spinal cord", "brain-function-analogy"],
          ["Auditory nerve", "brain-function-analogy"]
        ],
        "The cerebrum is responsible for thinking and cognitive memory; the cerebellum is responsible for muscular balance and posture."
      ),
    },
    {
      subtopic: "brain-nerves",
      ...q(
        "A chef accidentally touches a boiling metal pot. Without thinking, their hand jerks backwards instantly. What pathway did this nerve impulse follow?",
        "Sensory receptor → sensory nerve → spinal cord → motor nerve → muscle",
        [
          ["Sensory receptor → cerebrum → conscious thought → motor nerve → muscle", "reflex-pathway-mixup"],
          ["Muscle → motor nerve → medulla → sensory nerve → skin", "reflex-pathway-mixup"],
          ["Sensory nerve → ear cochlea → cerebellum → heart muscle", "reflex-pathway-mixup"]
        ],
        "In a reflex arc, the signal travels from pain receptors via sensory nerves to the spinal cord, which immediately commands the arm muscles via motor nerves."
      ),
    },
    {
      subtopic: "brain-nerves",
      ...q(
        "Read the following statements about the human nervous system:\n(i) The medulla oblongata operates even when a person is asleep.\n(ii) Motor nerves carry sensory information from the eyes to the brain.\n(iii) The spinal cord is protected inside the vertebral column.\n(iv) Reflex actions require deep conscious deliberation in the cerebrum.\nWhich of the statements are TRUE?",
        "(i) and (iii) only",
        [
          ["(i), (ii) and (iii) only", "nervous-statement-eval"],
          ["(ii) and (iv) only", "nervous-statement-eval"],
          ["(i) and (iv) only", "nervous-statement-eval"]
        ],
        "Statements (i) and (iii) are true. Statement (ii) is false (optic/sensory nerves carry sensory data) and (iv) is false (reflexes bypass conscious thought)."
      ),
    },
    {
      subtopic: "sense-organs",
      ...q(
        "Which part of the human eye changes its curvature to focus objects clearly onto the retina?",
        "The eye lens",
        [
          ["The outer cornea", "eye-lens-mixup"],
          ["The optic nerve", "eye-lens-mixup"],
          ["The pupil hole", "eye-lens-mixup"]
        ],
        "The crystalline lens of the eye adjusts its focal length to focus light sharply onto the retina."
      ),
    },
    {
      subtopic: "sense-organs",
      ...q(
        "What happens to the pupil of your eye when you step from a bright sunny garden into a dimly lit room?",
        "It dilates (expands) to let in more light",
        [
          ["It constricts (shrinks) to block excess light", "pupil-dilation-mixup"],
          ["It stays exactly the same size in all conditions", "pupil-dilation-mixup"],
          ["It changes its shape from circular to oval", "pupil-dilation-mixup"]
        ],
        "In dim light, the circular muscles of the iris relax, causing the pupil to expand (dilate) so more light can enter the eye."
      ),
    },
    {
      subtopic: "sense-organs",
      ...q(
        "Select the option that completes the given sensory relationship:\nEye : Optic nerve :: Ear : ———",
        "Auditory nerve",
        [
          ["Olfactory nerve", "sensory-nerve-analogy"],
          ["Sensory tongue nerve", "sensory-nerve-analogy"],
          ["Spinal nerve", "sensory-nerve-analogy"]
        ],
        "The eye sends light impulses via the optic nerve; the ear transmits sound vibrations via the auditory nerve."
      ),
    },
    {
      subtopic: "sense-organs",
      ...q(
        "Which of the following tiny structures in the middle ear amplify sound vibrations from the eardrum to the inner ear?",
        "Three tiny middle ear bones",
        [
          ["The outer cartilage pinna", "ear-bones-mixup"],
          ["The coiled liquid cochlea", "ear-bones-mixup"],
          ["The balance canals", "ear-bones-mixup"]
        ],
        "Three small bones (the hammer, anvil, and stirrup) vibrate in sequence, amplifying vibrations from the eardrum to the cochlea."
      ),
    },
    {
      subtopic: "sense-organs",
      ...q(
        "A student tastes lemon juice, sweet honey, and salted potato chips. Which structures on the tongue identify these flavours?",
        "Taste buds",
        [
          ["Salivary ducts", "taste-buds-mixup"],
          ["Olfactory bulbs", "taste-buds-mixup"],
          ["Enamel caps", "taste-buds-mixup"]
        ],
        "Taste buds located inside small bumps (papillae) on the tongue contain chemical sensory receptors that detect basic tastes."
      ),
    },
    {
      subtopic: "diseases-prevention",
      ...q(
        "Which of the following communicable diseases is caused by bacteria?",
        "Tuberculosis",
        [
          ["Measles", "bacterial-disease-mixup"],
          ["Polio", "bacterial-disease-mixup"],
          ["Ringworm", "bacterial-disease-mixup"]
        ],
        "Tuberculosis (TB) is caused by the bacterium Mycobacterium tuberculosis. Measles and polio are caused by viruses; ringworm is caused by a fungus."
      ),
    },
    {
      subtopic: "diseases-prevention",
      ...q(
        "How do vaccines help protect the human body against infectious diseases?",
        "They train the immune system to produce antibodies",
        [
          ["They replace all white blood cells with antibiotics", "vaccine-mechanism-mixup"],
          ["They kill all microorganisms in the stomach acid", "vaccine-mechanism-mixup"],
          ["They stop the heart from pumping foreign blood", "vaccine-mechanism-mixup"]
        ],
        "Vaccines expose the body to safe, weakened forms of a pathogen so the immune system learns to make antibodies that fight off future infections."
      ),
    },
    {
      subtopic: "diseases-prevention",
      ...q(
        "Select the correct option to complete the pathogen relationship:\nRingworm : Fungi :: Cholera : ———",
        "Bacteria",
        [
          ["Virus", "pathogen-analogy-mixup"],
          ["Protozoa", "pathogen-analogy-mixup"],
          ["Mosquito", "pathogen-analogy-mixup"]
        ],
        "Ringworm is a skin infection caused by a fungus; cholera is a water-borne infection caused by the bacterium Vibrio cholerae."
      ),
    },
    {
      subtopic: "diseases-prevention",
      ...q(
        "During monsoon season, a village notices an outbreak of dengue fever. Which measure will be most effective in curbing this viral outbreak?",
        "Removing stagnant water from coolers and open containers",
        [
          ["Boiling all vegetables before cutting them", "dengue-prevention-mixup"],
          ["Applying skin moisturiser twice daily", "dengue-prevention-mixup"],
          ["Avoiding contact with garden earthworms", "dengue-prevention-mixup"]
        ],
        "Dengue is transmitted by the Aedes mosquito, which breeds in domestic collections of stagnant water. Clearing standing water halts mosquito breeding."
      ),
    },
    {
      subtopic: "diseases-prevention",
      ...q(
        "Look at the following statements about diseases and health:\n(i) Anaemia can spread from person to person through cough droplets.\n(ii) Typhoid spreads primarily through contaminated food and water.\n(iii) Drinking boiled water helps kill water-borne bacteria.\n(iv) Polio is caused by a protozoan parasite.\nWhich statements are CORRECT?",
        "(ii) and (iii) only",
        [
          ["(i) and (ii) only", "disease-statement-eval"],
          ["(i), (iii) and (iv) only", "disease-statement-eval"],
          ["(ii) and (iv) only", "disease-statement-eval"]
        ],
        "Statements (ii) and (iii) are correct. Statement (i) is false because anaemia is a non-communicable nutritional deficiency, and (iv) is false because polio is viral."
      ),
    },
  ],
  "sq-u2-test": [
    {
      subtopic: "movable-joints",
      ...q(
        "Select the correct option to complete the joint analogy:\nShoulder : Ball-and-socket :: Neck between skull and spine : ———",
        "Pivot joint",
        [
          ["Hinge joint", "boss-joint-analogy"],
          ["Gliding joint", "boss-joint-analogy"],
          ["Immovable joint", "boss-joint-analogy"]
        ],
        "The shoulder is a ball-and-socket joint, while the neck articulation allowing the head to turn is a pivot joint."
      ),
    },
    {
      subtopic: "skeletal-system",
      ...q(
        "Evaluate the following statements regarding the human skeleton:\n(i) Tendons connect bone to bone at movable joints.\n(ii) The skull protects the brain, eyes, and inner ears.\n(iii) An adult human skeleton has 206 bones.\n(iv) The lower jaw is the only movable bone in the human skull.\nWhich statements are TRUE?",
        "(ii), (iii) and (iv) only",
        [
          ["(i) and (iii) only", "boss-skeletal-eval"],
          ["(i), (ii) and (iv) only", "boss-skeletal-eval"],
          ["(ii) and (iii) only", "boss-skeletal-eval"]
        ],
        "Statements (ii), (iii), and (iv) are true. Statement (i) is false because ligaments connect bone to bone; tendons connect muscle to bone."
      ),
    },
    {
      subtopic: "skeletal-system",
      ...q(
        "An X-ray of a patient reveals a fracture in the longest and heaviest bone in their body. Which bone has been fractured?",
        "The thigh bone (femur)",
        [
          ["The upper arm bone (humerus)", "boss-femur-fracture"],
          ["The breastbone (sternum)", "boss-femur-fracture"],
          ["The backbone vertebra", "boss-femur-fracture"]
        ],
        "The femur (thigh bone) is both the longest and strongest bone in the human skeleton."
      ),
    },
    {
      subtopic: "muscular-system",
      ...q(
        "Which pair of muscles in the human upper arm contract and relax alternately to bend and straighten the elbow?",
        "Biceps and triceps",
        [
          ["Hamstring and quadriceps", "boss-arm-muscles"],
          ["Cardiac and smooth muscles", "boss-arm-muscles"],
          ["Ligament and tendon muscles", "boss-arm-muscles"]
        ],
        "Biceps on the front and triceps on the back of the upper arm work in an antagonistic pair to flex and extend the elbow joint."
      ),
    },
    {
      subtopic: "skeletal-system",
      ...q(
        "Match the skeletal part with its protective function:\nRib cage : Heart and lungs :: Vertebral column : ———",
        "Spinal cord",
        [
          ["Human brain", "boss-protection-analogy"],
          ["Digestive stomach", "boss-protection-analogy"],
          ["Sensory retina", "boss-protection-analogy"]
        ],
        "The rib cage shields the thoracic organs (heart and lungs), while the vertebral column shelters the spinal cord."
      ),
    },
    {
      subtopic: "nutrients-deficiency",
      ...q(
        "Select the option that completes the deficiency relationship:\nVitamin D : Rickets :: Vitamin C : ———",
        "Scurvy",
        [
          ["Beriberi", "boss-deficiency-analogy"],
          ["Night blindness", "boss-deficiency-analogy"],
          ["Goitre", "boss-deficiency-analogy"]
        ],
        "Lack of Vitamin D leads to rickets, while lack of Vitamin C leads to scurvy (swollen and bleeding gums)."
      ),
    },
    {
      subtopic: "digestive-system",
      ...q(
        "Consider the following statements about digestion and teeth:\n(i) Saliva converts insoluble starch into soluble sugar.\n(ii) Tooth enamel is made of soft cartilage cells.\n(iii) Villi in the small intestine absorb dissolved nutrients into the blood.\n(iv) A child develops 32 temporary milk teeth.\nWhich statements are CORRECT?",
        "(i) and (iii) only",
        [
          ["(i), (ii) and (iii) only", "boss-digestive-eval"],
          ["(ii) and (iv) only", "boss-digestive-eval"],
          ["(i) and (iv) only", "boss-digestive-eval"]
        ],
        "Statements (i) and (iii) are correct. Statement (ii) is false (enamel is the hardest substance) and (iv) is false (milk teeth count is 20)."
      ),
    },
    {
      subtopic: "nutrients-deficiency",
      ...q(
        "A laboratory technician tests four food samples:\n- Food W turns blue-black with iodine.\n- Food X turns purple with copper sulphate and caustic soda.\n- Food Y leaves a translucent greasy spot on filter paper.\nWhat nutrient is predominantly present in Food W?",
        "Starch (Carbohydrate)",
        [
          ["Protein", "boss-iodine-test"],
          ["Fat", "boss-iodine-test"],
          ["Vitamin C", "boss-iodine-test"]
        ],
        "The iodine test is specific for starch: starch turns blue-black in the presence of dilute iodine solution."
      ),
    },
    {
      subtopic: "teeth-types",
      ...q(
        "Which type of teeth are especially prominent and sharp in carnivorous animals for gripping and tearing meat?",
        "Canines",
        [
          ["Incisors", "boss-canines-diet"],
          ["Premolars", "boss-canines-diet"],
          ["Molars", "boss-canines-diet"]
        ],
        "Carnivores have well-developed, pointed canines designed to pierce and tear tough meat."
      ),
    },
    {
      subtopic: "digestive-system",
      ...q(
        "What is the primary function of bile juice produced by the liver during digestion?",
        "It helps in breaking down fats",
        [
          ["It converts protein into bone marrow", "boss-bile-fats"],
          ["It digests starch into dietary fibre", "boss-bile-fats"],
          ["It prevents hydrochloric acid from forming", "boss-bile-fats"]
        ],
        "Bile juice produced by the liver emulsifies large fat droplets into tiny droplets so enzymes can digest them easily."
      ),
    },
    {
      subtopic: "brain-nerves",
      ...q(
        "Select the option that correctly completes the brain function pair:\nCerebellum : Muscle balance :: Medulla oblongata : ———",
        "Involuntary heartbeat and breathing",
        [
          ["Solving mathematical problems", "boss-medulla-analogy"],
          ["Long-term conscious memory", "boss-medulla-analogy"],
          ["Voluntary speech in conversations", "boss-medulla-analogy"]
        ],
        "The cerebellum balances voluntary movement; the medulla oblongata controls automatic vital functions like heartbeat and breathing."
      ),
    },
    {
      subtopic: "diseases-prevention",
      ...q(
        "Read the following statements about diseases:\n(i) Dengue is transmitted by the bite of the female Aedes mosquito.\n(ii) Scurvy is an infectious communicable disease.\n(iii) Bacteria cause diseases like typhoid and tuberculosis.\n(iv) Ringworm is a fungal infection of the skin.\nWhich of the statements are TRUE?",
        "(i), (iii) and (iv) only",
        [
          ["(i) and (ii) only", "boss-disease-eval"],
          ["(ii), (iii) and (iv) only", "boss-disease-eval"],
          ["(i) and (iv) only", "boss-disease-eval"]
        ],
        "Statements (i), (iii), and (iv) are true. Statement (ii) is false because scurvy is a non-communicable nutritional deficiency disease."
      ),
    },
    {
      subtopic: "brain-nerves",
      ...q(
        "When Priya suddenly touches a spiky cactus leaf, she pulls her finger away before she feels the sting. Why does this reflex action occur so quickly?",
        "The spinal cord triggers the reflex without waiting for the brain",
        [
          ["The brain deliberates carefully before commanding the arm to move", "boss-reflex-cactus"],
          ["Sensory nerves contract the arm muscles without using motor nerves", "boss-reflex-cactus"],
          ["Skin pain receptors push the finger away on their own", "boss-reflex-cactus"]
        ],
        "In a reflex action, the spinal cord directly connects the sensory nerve to the motor nerve, triggering an immediate withdrawal to avoid tissue damage."
      ),
    },
    {
      subtopic: "sense-organs",
      ...q(
        "Which part of the human eye acts as the transparent front window through which light first enters?",
        "The cornea",
        [
          ["The retina", "boss-cornea-window"],
          ["The optic nerve", "boss-cornea-window"],
          ["The iris", "boss-cornea-window"]
        ],
        "The cornea is the clear, curved outer layer on the front surface of the eye that protects the eye and helps focus incoming light."
      ),
    },
    {
      subtopic: "diseases-prevention",
      ...q(
        "Which of the following diseases is spread by contaminated food and water rather than by an insect vector?",
        "Cholera",
        [
          ["Malaria", "boss-waterborne-cholera"],
          ["Dengue", "boss-waterborne-cholera"],
          ["Chikungunya", "boss-waterborne-cholera"]
        ],
        "Cholera is a water-borne bacterial illness spread through contaminated water or food; malaria, dengue, and chikungunya are mosquito-borne."
      ),
    },
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


// ==============================================================================
// UNIT 2: Human Body and Health
// ==============================================================================
const u2 = forGrades(unit("sq-u2", 2, "Human Body and Health"), [4, 5]);

// Topic 1: Bones, Joints and Muscles
const bones = forGrades(
  main("sq-bones", u2.id, 1, "Bones, Joints and Muscles", [
    study("sq-bones-study"),
    quiz("sq-bones-warmup"),
  ]),
  [4, 5]
);

const bonesP1 = forGrades(
  withSubtopic(
    practice(
      "sq-bones-p1",
      bones,
      1,
      "Types of Joints",
      "medium",
      [quiz("sq-bones-joints-quiz")]
    ),
    "movable-joints"
  ),
  [4, 5]
);

const bonesGate = forGrades(
  gate(
    "sq-bones-gate",
    bones,
    "Skeletal System Challenge",
    "sq-bones-gate-pool",
    {
      "skeletal-system": "The human skeleton and bones",
      "movable-joints": "Types of movable joints",
      "muscular-system": "Muscles and movement",
    }
  ),
  [4, 5]
);

const bonesEndless = forGrades(endless(bones), [4, 5]);

// Topic 2: Digestion, Teeth and Food
const food = forGrades(
  main("sq-food", u2.id, 2, "Digestion, Teeth and Food", [
    study("sq-food-study"),
    quiz("sq-food-warmup"),
  ]),
  [4, 5]
);

const foodP1 = forGrades(
  withSubtopic(
    practice(
      "sq-food-p1",
      food,
      1,
      "Nutrients and Deficiencies",
      "medium",
      [quiz("sq-food-nutrients-quiz")]
    ),
    "nutrients-deficiency"
  ),
  [4, 5]
);

const foodGate = forGrades(
  gate(
    "sq-food-gate",
    food,
    "Digestion and Food Challenge",
    "sq-food-gate-pool",
    {
      "digestive-system": "The digestive tract and organs",
      "teeth-types": "Structure and types of teeth",
      "nutrients-deficiency": "Nutrients and deficiency diseases",
    }
  ),
  [4, 5]
);

const foodEndless = forGrades(endless(food), [4, 5]);

// Topic 3: Nervous System, Sense Organs & Health
const nervous = forGrades(
  main("sq-nervous", u2.id, 3, "Nervous System and Health", [
    study("sq-nervous-study"),
    quiz("sq-nervous-warmup"),
  ]),
  [5]
);

const nervousP1 = forGrades(
  withSubtopic(
    practice(
      "sq-nervous-p1",
      nervous,
      1,
      "Sense Organs & Microbes",
      "hard",
      [quiz("sq-nervous-senses-quiz")]
    ),
    "sense-organs"
  ),
  [5]
);

const nervousGate = forGrades(
  gate(
    "sq-nervous-gate",
    nervous,
    "Nervous System & Health Challenge",
    "sq-nervous-gate-pool",
    {
      "brain-nerves": "The brain, spinal cord and nerves",
      "sense-organs": "Sense organs and functions",
      "diseases-prevention": "Diseases, microbes and prevention",
    }
  ),
  [5]
);

const nervousEndless = forGrades(endless(nervous), [5]);

// Unit 2 Boss
const u2Boss = forGrades(
  boss(
    "sq-u2-boss",
    u2.id,
    "Human Body Boss",
    "sq-u2-test",
    "Dr. Bio-Mixer is disrupting the human body! Master the skeletal, digestive, and nervous systems to restore perfect health."
  ),
  [5]
);

// Unit 3 Teaser (coming soon)
const u3 = unit("sq-u3", 3, "Matter and Materials", { comingSoon: true });

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
  bones,
  bonesP1,
  bonesGate,
  bonesEndless,
  food,
  foodP1,
  foodGate,
  foodEndless,
  nervous,
  nervousP1,
  nervousGate,
  nervousEndless,
  u2Boss,
  u3,
];
