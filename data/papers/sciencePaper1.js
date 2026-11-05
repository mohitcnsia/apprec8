// data/papers/sciencePaper1.js: Practice paper, Science, Paper 1 (Claude, 2026-11-05). DRAFT for mockup Q (not approved yet).
// Shape of a Class 5 science olympiad paper (docs/exam/nso-pattern.md): 50 questions, 60 minutes, 60 marks:
// 10 Thinking skills (1 mark) · 35 Science (1) · 5 Champion (3 marks each). New, original questions; `topic` = quest node.
// Facts are standard Class 5 EVS / science. Avoided on purpose: frog life-cycle stage counts (books differ), Siberian cranes
// (no longer reach India), "pupil" next to "iris", seeds that also need air when only water is offered.
import { q } from "../englishQuest/helpers.js";

const P = (node, question, correct, wrongs, explanation) => ({ topic: { quest: "science-quest", node }, ...q(question, correct, wrongs, explanation) });

export default {
  id: "paper-sci-1",
  subject: "science",
  title: "Paper 1",
  minutes: 60,
  grades: [5],
  draft: true, // testers only until the owner approves the questions (review page + second review)
  passages: {},
  parts: [
    {
      id: "thinking",
      title: "Thinking skills",
      marks: 1,
      questions: [
        P("sq-patterns", "What comes next? 3, 7, 11, 15, ___", "19", [["18", "series-rule-mixup"], ["20", "series-rule-mixup"], ["21", "series-rule-mixup"]], "Add 4 each time: 15 + 4 = 19."),
        P("sq-patterns", "What comes next? B, E, H, K, ___", "N", [["M", "series-rule-mixup"], ["O", "series-rule-mixup"], ["L", "series-rule-mixup"]], "Jump 3 letters each time: K (11) + 3 = N (14)."),
        P("sq-patterns", "Find the odd one out: iron, copper, wood, aluminium", "wood", [["iron", "odd-one-mixup"], ["copper", "odd-one-mixup"], ["aluminium", "odd-one-mixup"]], "Iron, copper and aluminium are metals. Wood is not."),
        P("sq-patterns", "Eye is to see as ear is to ___.", "hear", [["sound", "analogy-mixup"], ["music", "analogy-mixup"], ["nose", "analogy-mixup"]], "We see with our eyes and hear with our ears."),
        P("sq-codes", "In a code, PLANT is written as QMBOU. How is SEED written?", "TFFE", [["RDDC", "code-direction-mixup"], ["TFFD", "code-step-mixup"], ["TEFE", "code-step-mixup"]], "Each letter moves one step forward: S → T, E → F, E → F, D → E."),
        P("sq-codes", "If A = 1, B = 2 and so on, what do the letters of FISH add up to?", "42", [["40", "code-step-mixup"], ["41", "code-step-mixup"], ["43", "code-step-mixup"]], "F 6 + I 9 + S 19 + H 8 = 42."),
        P("sq-codes", "You face West and turn right two times. Which way do you face now?", "East", [["South", "direction-turn-mixup"], ["North", "direction-turn-mixup"], ["West", "direction-turn-mixup"]], "West → right → North → right → East."),
        P("sq-order", "In a row of 25 students, Kiran is 9th from the right. What is her place from the left?", "17th", [["16th", "rank-count-mixup"], ["18th", "rank-count-mixup"], ["15th", "rank-count-mixup"]], "25 − 9 + 1 = 17."),
        P("sq-order", "If 5 March is a Tuesday, what day is 15 March?", "Friday", [["Thursday", "calendar-count-mixup"], ["Saturday", "calendar-count-mixup"], ["Tuesday", "calendar-count-mixup"]], "10 days later = 7 + 3, so Tuesday + 3 = Friday."),
        P("sq-order", "Your mother's sister's son is your ___.", "cousin", [["brother", "relation-mixup"], ["nephew", "relation-mixup"], ["uncle", "relation-mixup"]], "Your mother's sister is your aunt, and your aunt's son is your cousin."),
      ],
    },
    {
      id: "science",
      title: "Science",
      marks: 1,
      questions: [
        P("sq-plants", "Which part of a seed grows into the root?", "Radicle", [["Plumule", "seed-part-mixup"], ["Cotyledon", "seed-part-mixup"], ["Seed coat", "seed-part-mixup"]], "The radicle becomes the root; the plumule becomes the shoot; cotyledons store food."),
        P("sq-plants", "Which of these does a seed need to start growing (germinate)?", "Water", [["Soil", "germination-mixup"], ["Sunlight", "germination-mixup"], ["Fertiliser", "germination-mixup"]], "Seeds need water, air and warmth to germinate. Soil and sunlight are not needed at the start."),
        P("sq-plants", "Drumstick (moringa) seeds have thin wings. How are they spread?", "By wind", [["By water", "dispersal-mixup"], ["By animals", "dispersal-mixup"], ["By bursting pods", "dispersal-mixup"]], "Light, winged seeds are carried by the wind."),
        P("sq-plants", "Which plant is grown from pieces of its stem?", "Sugarcane", [["Wheat", "plant-growth-mixup"], ["Mustard", "plant-growth-mixup"], ["Pea", "plant-growth-mixup"]], "Farmers plant pieces of sugarcane stem; wheat, mustard and peas grow from seeds."),
        P("sq-plants", "Which plant traps insects for food?", "Pitcher plant", [["Cactus", "plant-adaptation-mixup"], ["Lotus", "plant-adaptation-mixup"], ["Money plant", "plant-adaptation-mixup"]], "The pitcher plant traps insects to get nutrients that its soil lacks."),
        P("sq-plants", "A cactus has spines instead of broad leaves. How does this help it in the desert?", "It loses less water.", [["It makes more food.", "plant-adaptation-mixup"], ["It catches insects.", "plant-adaptation-mixup"], ["It floats on water.", "plant-adaptation-mixup"]], "Spines have a tiny surface, so very little water escapes."),
        P("sq-animals", "Which animal breathes through its moist skin as well as its lungs?", "Frog", [["Fish", "breathing-organ-mixup"], ["Cockroach", "breathing-organ-mixup"], ["Whale", "breathing-organ-mixup"]], "A frog breathes through its lungs and its moist skin."),
        P("sq-animals", "Insects breathe through tiny holes in their body called ___.", "spiracles", [["gills", "breathing-organ-mixup"], ["lungs", "breathing-organ-mixup"], ["stomata", "breathing-organ-mixup"]], "Spiracles are air holes along an insect's body. Stomata are tiny holes in leaves."),
        P("sq-animals", "Which animal grows through egg, larva, pupa and adult?", "Butterfly", [["Cockroach", "life-cycle-mixup"], ["Grasshopper", "life-cycle-mixup"], ["Hen", "life-cycle-mixup"]], "A butterfly has four stages: egg, caterpillar (larva), pupa, adult. A cockroach and a grasshopper have three."),
        P("sq-animals", "Polar bears have thick fur and a layer of fat. This helps them to ___.", "keep warm in the cold", [["swim faster in warm water", "adaptation-mixup"], ["hide in the desert", "adaptation-mixup"], ["climb tall trees", "adaptation-mixup"]], "Fur and fat (blubber) keep the heat in."),
        P("sq-animals", "Which of these birds flies to India from far away every winter?", "Bar-headed goose", [["Peacock", "migration-mixup"], ["House sparrow", "migration-mixup"], ["Crow", "migration-mixup"]], "Bar-headed geese fly over the Himalayas to spend the winter in India. Peacocks, sparrows and crows live here all year."),
        P("sq-animals", "Which animal can change its colour to match its surroundings?", "Chameleon", [["Elephant", "adaptation-mixup"], ["Cow", "adaptation-mixup"], ["Parrot", "adaptation-mixup"]], "A chameleon changes colour, which helps it hide (camouflage)."),
        P("sq-bones", "Which kind of joint is in the shoulder?", "Ball-and-socket joint", [["Hinge joint", "joint-mixup"], ["Pivot joint", "joint-mixup"], ["Fixed joint", "joint-mixup"]], "A ball-and-socket joint lets the arm move in a full circle."),
        P("sq-bones", "The elbow has a ___ joint.", "hinge", [["ball-and-socket", "joint-mixup"], ["pivot", "joint-mixup"], ["fixed", "joint-mixup"]], "The elbow bends one way, like a door hinge."),
        P("sq-nervous", "Which part of the brain helps us keep our balance?", "Cerebellum", [["Cerebrum", "brain-part-mixup"], ["Medulla", "brain-part-mixup"], ["Spinal cord", "brain-part-mixup"]], "The cerebellum controls balance and smooth movement."),
        P("sq-nervous", "Which part of the eye controls how much light goes in?", "Iris", [["Retina", "eye-part-mixup"], ["Lens", "eye-part-mixup"], ["Cornea", "eye-part-mixup"]], "The coloured iris makes the opening (pupil) bigger or smaller."),
        P("sq-food", "Lack of vitamin C causes ___.", "scurvy", [["rickets", "deficiency-mixup"], ["night blindness", "deficiency-mixup"], ["goitre", "deficiency-mixup"]], "Vitamin C: scurvy (bleeding gums). Rickets: vitamin D. Night blindness: vitamin A. Goitre: iodine."),
        P("sq-food", "Which food is rich in protein?", "Pulses (dal)", [["Rice", "nutrient-mixup"], ["Sugar", "nutrient-mixup"], ["Butter", "nutrient-mixup"]], "Dal is rich in protein; rice and sugar give carbohydrates; butter gives fat."),
        P("sq-food", "Malaria spreads through the bite of a ___.", "female Anopheles mosquito", [["housefly", "disease-vector-mixup"], ["bed bug", "disease-vector-mixup"], ["honeybee", "disease-vector-mixup"]], "The female Anopheles mosquito carries the malaria germ."),
        P("sq-food", "In which organ does the digestion of food finish?", "Small intestine", [["Large intestine", "digestion-mixup"], ["Food pipe", "digestion-mixup"], ["Mouth", "digestion-mixup"]], "Digestion is completed in the small intestine, where food is absorbed into the blood."),
        P("sq-matter", "Which of these has a fixed shape and a fixed volume?", "A stone", [["Water", "state-mixup"], ["Air", "state-mixup"], ["Milk", "state-mixup"]], "A stone is a solid. Liquids take the shape of their container; gases fill any space."),
        P("sq-matter", "Naphthalene balls get smaller without melting. This change is called ___.", "sublimation", [["evaporation", "change-of-state-mixup"], ["condensation", "change-of-state-mixup"], ["freezing", "change-of-state-mixup"]], "A solid turning straight into a gas is sublimation."),
        P("sq-matter", "Which of these is a chemical change?", "Burning paper", [["Melting ice", "change-type-mixup"], ["Tearing paper", "change-type-mixup"], ["Dissolving salt in water", "change-type-mixup"]], "Burning makes new substances (ash, smoke) and can't be undone."),
        P("sq-matter", "Tea leaves are separated from tea with a strainer. This is called ___.", "filtration", [["evaporation", "separation-mixup"], ["winnowing", "separation-mixup"], ["magnetic separation", "separation-mixup"]], "A strainer lets the liquid through and holds back the solid: filtration."),
        P("sq-matter", "Which of these dissolves in water?", "Sugar", [["Sand", "solubility-mixup"], ["Cooking oil", "solubility-mixup"], ["Chalk powder", "solubility-mixup"]], "Sugar dissolves; sand and chalk settle down; oil floats on top."),
        P("sq-matter", "Water drops form on the outside of a glass of cold water. This is because of ___.", "condensation", [["evaporation", "change-of-state-mixup"], ["melting", "change-of-state-mixup"], ["sublimation", "change-of-state-mixup"]], "Water vapour in the air cools on the cold glass and turns into drops."),
        P("sq-forces", "Which force pulls things down towards the Earth?", "Gravity", [["Friction", "force-type-mixup"], ["Magnetic force", "force-type-mixup"], ["Muscular force", "force-type-mixup"]], "Gravity pulls everything towards the Earth."),
        P("sq-forces", "Why do we put oil on a squeaky door hinge?", "To reduce friction", [["To increase friction", "friction-mixup"], ["To make it heavier", "friction-mixup"], ["To make it magnetic", "friction-mixup"]], "Oil makes the surfaces slide easily: less friction, no squeak."),
        P("sq-forces", "A see-saw is an example of a ___.", "lever", [["pulley", "machine-mixup"], ["wheel and axle", "machine-mixup"], ["screw", "machine-mixup"]], "A see-saw is a bar that turns on a point (fulcrum): a lever."),
        P("sq-forces", "A solar panel changes ___ energy into electrical energy.", "light", [["sound", "energy-change-mixup"], ["wind", "energy-change-mixup"], ["magnetic", "energy-change-mixup"]], "Solar panels turn sunlight into electricity."),
        P("sq-earth", "Which is the outermost layer of the Earth?", "Crust", [["Mantle", "earth-layer-mixup"], ["Outer core", "earth-layer-mixup"], ["Inner core", "earth-layer-mixup"]], "We live on the crust, the thin outer layer."),
        P("sq-earth", "Marble is a ___ rock.", "metamorphic", [["igneous", "rock-type-mixup"], ["sedimentary", "rock-type-mixup"], ["fossil", "rock-type-mixup"]], "Marble forms when limestone is changed by heat and pressure: a metamorphic rock."),
        P("sq-earth", "The ozone layer protects us from ___.", "harmful ultraviolet rays from the Sun", [["rain and storms", "atmosphere-mixup"], ["earthquakes", "atmosphere-mixup"], ["loud noise", "atmosphere-mixup"]], "Ozone high in the sky blocks most of the Sun's harmful UV rays."),
        P("sq-earth", "About how many days does the Moon take to go through all its phases?", "About 29½ days", [["About 7 days", "moon-phase-mixup"], ["About 15 days", "moon-phase-mixup"], ["About 365 days", "moon-phase-mixup"]], "From one new moon to the next takes about 29½ days."),
        P("sq-pollution", "Which of these adds to global warming?", "Burning coal and petrol", [["Planting trees", "pollution-types-mixup"], ["Using solar power", "pollution-types-mixup"], ["Walking to school", "pollution-types-mixup"]], "Burning coal and petrol releases carbon dioxide, which traps heat."),
      ],
    },
    {
      id: "champion",
      title: "Champion questions",
      marks: 3,
      questions: [
        P("sq-plants", "Pot A: seeds with water, kept warm. Pot B: seeds with water, kept in a fridge. Pot C: seeds kept warm, no water. Which seeds will sprout?", "Pot A only", [["Pots A and B", "germination-mixup"], ["Pots A and C", "germination-mixup"], ["All three pots", "germination-mixup"]], "Seeds need water, air AND warmth. Only Pot A has all three."),
        P("sq-chains", "In the food chain grass → grasshopper → frog → snake, all the frogs die. What happens first?", "Grasshoppers increase", [["Grass increases", "food-chain-order-mixup"], ["Snakes increase", "food-chain-order-mixup"], ["Nothing changes", "food-chain-order-mixup"]], "Nothing eats the grasshoppers now, so their number goes up first. (Later the grass may decrease and the snakes go hungry.)"),
        P("sq-forces", "The same toy car is pushed equally hard on four surfaces. On which does it go the furthest?", "Ice", [["Carpet", "friction-mixup"], ["Sand", "friction-mixup"], ["Grass", "friction-mixup"]], "Ice is the smoothest surface, so there is the least friction."),
        P("sq-matter", "Ravi heats ice in a pan until nothing is left. In what order does it change?", "Solid → liquid → gas", [["Liquid → solid → gas", "change-of-state-mixup"], ["Solid → gas → liquid", "change-of-state-mixup"], ["Gas → liquid → solid", "change-of-state-mixup"]], "Ice melts into water, then the water evaporates into steam."),
        P("sq-animals", "Which animal is a mammal that can fly?", "Bat", [["Eagle", "animal-group-mixup"], ["Penguin", "animal-group-mixup"], ["Flying fish", "animal-group-mixup"]], "A bat feeds its babies milk (a mammal) and truly flies. Eagles are birds; penguins can't fly; flying fish only glide."),
      ],
    },
  ],
};
