// data/scienceQuest/units/u5.js: Science Unit 5, Light, Sound & Magnets (Claude, 2026-11-05). Classes 3–5.
// Standard Class 3–5 EVS / science facts (sources of light, transparent/translucent/opaque, shadows; vibration, what sound
// travels through, echo, pitch; magnetic materials, poles, compass). Unit 3 "Forces" only names magnetic force; this goes
// further. Original questions (NSO papers used only for level and style).
// Ambiguity rule: no item whose answer depends on the exact metal (steel spoons and coins can be non-magnetic, keys are
// often brass), no "candle = natural" traps, and no wrong option that is true in some reading.
import { q, study, quiz, unit, main, practice, gate, withSubtopic, endless, boss, forGrades } from "../../englishQuest/helpers.js";

const C345 = [3, 4, 5];
const t = (subtopic, question, correct, wrongs, explanation) => ({ subtopic, ...q(question, correct, wrongs, explanation) });

const u5 = forGrades(unit("sq-u5", 5, "Light, Sound & Magnets"), C345);
const light = forGrades(main("sq-light", u5.id, 1, "Light & Shadows", [study("sq-light-study"), quiz("sq-light-warmup")]), C345);
const sound = forGrades(main("sq-sound", u5.id, 2, "Sound All Around", [study("sq-sound-study"), quiz("sq-sound-warmup")]), C345);
const magnets = forGrades(main("sq-magnets", u5.id, 3, "Magnets", [study("sq-magnets-study"), quiz("sq-magnets-warmup")]), C345);

export default {
  studyPages: {
    "sq-light-study": {
      name: "Light and Shadows",
      author: "Apprec8",
      content: `### 💡 Where does light come from?

Some things **give out their own light**. They are **sources of light**.

| Gives out its own light | Only reflects light |
|---|---|
| ☀️ Sun, ⭐ stars, 🕯️ candle flame, 💡 bulb, firefly | 🌙 Moon, 🪞 mirror, a book, a wall |

> 💡 The Moon has no light of its own. It shines because it **reflects sunlight**.

We see a book because light **bounces off it into our eyes**.

---

### 🪟 Does light pass through?

| Transparent | Translucent | Opaque |
|---|---|---|
| almost all light passes | some light passes | no light passes |
| clear glass, clean water, air | butter paper, frosted glass, tissue | wood, stone, metal, cardboard |
| you see clearly through it | blurry view | you can't see through it |

---

### 👤 Shadows

Light travels in **straight lines**. When an **opaque** object blocks it, a dark patch forms behind the object: a **shadow**.

You need: a **light**, an **opaque object** and a **surface** (wall, ground).

| Sun's position | Your shadow |
|---|---|
| Low (morning, evening) | **long** |
| High overhead (noon) | **shortest** |

> ⚠️ A shadow is always **dark**, whatever the colour of the object. It falls on the side **away from** the light.

---

### 🎯 Now you can…
- tell sources of light from things that reflect it
- sort things into transparent, translucent and opaque
- explain how shadows form and change`,
    },
    "sq-sound-study": {
      name: "Sound All Around",
      author: "Apprec8",
      content: `### 🥁 Sound comes from vibrations

Sound is made when something **vibrates** (moves back and forth very fast).

| Sound | What vibrates |
|---|---|
| Drum | the skin on top |
| Sitar, guitar | the strings |
| Flute | the air inside |
| Your voice | the voice box in your throat |

> 💡 Hold a ringing bell tightly: the vibration stops, so the sound stops.

---

### 🌊 What does sound travel through?

| Solids (wood, metal) | Liquids (water) | Gases (air) | Empty space |
|---|---|---|---|
| ✅ fastest | ✅ | ✅ | ❌ no sound |

> 🚀 Space has no air, so astronauts talk by **radio**.
> ⚡ Light is much faster than sound: we see lightning **before** we hear thunder.

---

### 🔊 Loud, soft, high, low and echoes

- **Bigger** vibrations → **louder** sound. Hit a drum harder: it gets louder.
- **High** sounds: a whistle, a mosquito, a small bell. **Low** sounds: a lion's roar, a cow, a big drum.
- An **echo** is sound that **bounces back** from a hard surface: a big empty hall, a well, a hill.
- Bats find their way in the dark by listening to the echoes of their own squeaks.

> ⚠️ Very loud sounds can hurt your ears. Cover them near firecrackers.

---

### 🎯 Now you can…
- explain that sound comes from vibrations
- say what sound can and can't travel through
- tell loud from soft, high from low, and explain an echo`,
    },
    "sq-magnets-study": {
      name: "Magnets",
      author: "Apprec8",
      content: `### 🧲 What do magnets pull?

| Magnetic (attracted) | Non-magnetic (not attracted) |
|---|---|
| **iron**, **nickel**, **cobalt** (iron nails, steel paper clips) | copper, aluminium, gold, silver, wood, plastic, glass, rubber |

> 💡 Magnetic force works **through** paper, glass and water. A magnet can pull a pin through a sheet of paper.

A natural magnet found in rocks is called **lodestone** (magnetite).

---

### ⬆️⬇️ Two poles

Every magnet has a **North pole (N)** and a **South pole (S)**. A magnet is **strongest at its poles** and weakest in the middle.

| Poles facing | What happens |
|---|---|
| N and S (unlike) | **attract**: pull together |
| N and N, or S and S (like) | **repel**: push apart |

> ⚠️ Break a magnet in two and each piece still has **both** an N and an S pole.

---

### 🧭 Compass and care

- A magnet hanging freely always points **North–South**. A **compass** needle is a tiny magnet, so it shows directions. The Earth acts like a giant magnet.
- Heating, hammering or dropping a magnet again and again makes it **lose its magnetism**.
- Store bar magnets in pairs with **unlike poles** side by side.

---

### 🎯 Now you can…
- tell magnetic from non-magnetic materials
- predict attract or repel
- explain how a compass works`,
    },
  },

  quizzes: {
    // ---------- Light & Shadows ----------
    "sq-light-warmup": [
      t("light-sources", "Which of these gives out its own light?", "A burning candle", [["The Moon", "light-source-mixup"], ["A mirror", "light-source-mixup"], ["A shiny spoon", "light-source-mixup"]], "A candle flame makes its own light. The Moon, a mirror and a spoon only reflect light."),
      t("light-sources", "Why does the Moon shine at night?", "It reflects light from the Sun.", [["It makes its own light.", "light-source-mixup"], ["It is on fire like the Sun.", "light-source-mixup"], ["Its rocks glow in the dark.", "light-source-mixup"]], "The Moon has no light of its own. Sunlight bounces off it towards us."),
      t("light-sources", "How does light travel?", "In straight lines", [["In circles", "light-path-mixup"], ["Only around corners", "light-path-mixup"], ["In zigzags", "light-path-mixup"]], "Light travels in straight lines. That is why it can't bend around a wall to reach you."),
      t("light-materials", "Which material lets almost all light pass through it?", "Clear glass", [["Butter paper", "light-material-mixup"], ["A wooden board", "light-material-mixup"], ["Cardboard", "light-material-mixup"]], "Clear glass is transparent. Butter paper lets only some light through (translucent)."),
      t("light-materials", "A material that lets only SOME light pass through is called ___.", "translucent", [["transparent", "light-material-mixup"], ["opaque", "light-material-mixup"], ["luminous", "light-source-mixup"]], "Translucent things, like butter paper, let some light through, but you can't see clearly."),
      t("light-materials", "Which of these is opaque?", "A brick", [["Clear water", "light-material-mixup"], ["Clean window glass", "light-material-mixup"], ["Air", "light-material-mixup"]], "No light passes through a brick, so it is opaque."),
      t("shadows", "When is a shadow formed?", "When an opaque object blocks light", [["When light passes through glass", "shadow-mixup"], ["When it is completely dark", "shadow-mixup"], ["When a transparent object is in light", "shadow-mixup"]], "An opaque object stops the light, so a dark patch forms behind it."),
      t("shadows", "At what time of day is your shadow the shortest?", "At noon", [["Early in the morning", "shadow-mixup"], ["Late in the evening", "shadow-mixup"], ["Just after sunrise", "shadow-mixup"]], "At noon the Sun is high overhead, so shadows are shortest."),
    ],
    "sq-light-shadows": [
      t("shadows", "In the morning the Sun is in the east. Which way does your shadow point?", "West", [["East", "shadow-mixup"], ["North", "shadow-mixup"], ["Up into the sky", "shadow-mixup"]], "A shadow falls on the side away from the light. Sun in the east → shadow to the west."),
      t("shadows", "What do you need to make a shadow?", "A light, an opaque object and a surface", [["A light and a mirror only", "shadow-mixup"], ["Only a dark room", "shadow-mixup"], ["A transparent object and water", "shadow-mixup"]], "The opaque object blocks the light, and the shadow falls on a surface such as a wall."),
      t("shadows", "Why are shadows long in the evening?", "The Sun is low in the sky.", [["The Sun is right overhead.", "shadow-mixup"], ["The Sun is hotter in the evening.", "shadow-mixup"], ["Objects grow taller in the evening.", "shadow-mixup"]], "When the Sun is low, light comes in from the side, so shadows stretch out long."),
      t("shadows", "Which object makes the darkest shadow?", "A steel plate", [["A clear glass bottle", "light-material-mixup"], ["A sheet of tissue paper", "light-material-mixup"], ["A clear plastic sheet", "light-material-mixup"]], "A steel plate is opaque: it blocks all the light. Tissue lets some through; clear glass and plastic let most through."),
      t("shadows", "What colour is the shadow of a red ball?", "Dark (black or grey)", [["Red", "shadow-mixup"], ["Pink", "shadow-mixup"], ["Bright white", "shadow-mixup"]], "A shadow is just a place where light can't reach, so it is always dark."),
      t("shadows", "A torch shines on a toy from the LEFT. Where does the toy's shadow fall?", "On the right of the toy", [["On the left of the toy", "shadow-mixup"], ["On top of the torch", "shadow-mixup"], ["Nowhere: there is no shadow", "shadow-mixup"]], "A shadow falls on the side away from the light."),
      t("shadows", "You move a toy closer to the torch. Its shadow on the wall gets ___.", "bigger", [["smaller", "shadow-mixup"], ["red", "shadow-mixup"], ["brighter", "shadow-mixup"]], "Closer to the light, the toy blocks more of the light, so the shadow grows."),
      t("shadows", "Can clear glass make a dark shadow?", "No, light passes through it.", [["Yes, a very dark shadow.", "light-material-mixup"], ["Yes, but only at night.", "shadow-mixup"], ["Only if the glass is very big.", "shadow-mixup"]], "Clear glass is transparent: most light passes through, so it makes almost no shadow."),
    ],
    "sq-light-gate-pool": [
      t("light-sources", "Which is a natural source of light?", "The Sun", [["A torch", "light-source-mixup"], ["A tube light", "light-source-mixup"], ["A table lamp", "light-source-mixup"]], "The Sun gives light on its own; torches and lamps are made by people."),
      t("light-sources", "Which of these does NOT give out its own light?", "The Moon", [["A star", "light-source-mixup"], ["A firefly", "light-source-mixup"], ["A lit bulb", "light-source-mixup"]], "The Moon only reflects sunlight."),
      t("light-sources", "We can see a book in a lit room because ___.", "light bounces off the book into our eyes", [["the book makes its own light", "light-source-mixup"], ["our eyes send light to the book", "light-path-mixup"], ["the book is transparent", "light-material-mixup"]], "Light from the lamp bounces off the book and enters our eyes."),
      t("light-sources", "Which shows that light travels in straight lines?", "A torch beam in a dark, dusty room", [["A ball rolling down a slope", "light-path-mixup"], ["Water flowing in a river", "light-path-mixup"], ["A kite flying in the wind", "light-path-mixup"]], "The beam goes straight from the torch: you can see the straight path in the dust."),
      t("light-sources", "Which of these is a man-made source of light?", "An electric bulb", [["The Sun", "light-source-mixup"], ["A firefly", "light-source-mixup"], ["A star", "light-source-mixup"]], "People make bulbs. The Sun, stars and fireflies are natural sources."),
      t("light-materials", "Frosted glass in a bathroom window is ___.", "translucent", [["transparent", "light-material-mixup"], ["opaque", "light-material-mixup"], ["a source of light", "light-source-mixup"]], "Frosted glass lets some light in, but you can't see clearly through it."),
      t("light-materials", "Which group has ONLY opaque things?", "Wood, stone, metal", [["Glass, water, air", "light-material-mixup"], ["Butter paper, wood, glass", "light-material-mixup"], ["Air, stone, tissue paper", "light-material-mixup"]], "No light passes through wood, stone or metal."),
      t("light-materials", "Why are windows made of clear glass?", "It lets light in, and we can see through it.", [["It stops all the light.", "light-material-mixup"], ["It makes its own light.", "light-source-mixup"], ["It makes the room dark.", "light-material-mixup"]], "Clear glass is transparent: light comes in, and we can see outside."),
      t("light-materials", "Which of these is transparent?", "Clean water in a glass", [["Milk", "light-material-mixup"], ["Muddy water", "light-material-mixup"], ["Orange juice", "light-material-mixup"]], "You can see clearly through clean water. Milk, juice and muddy water block much of the light."),
      t("light-materials", "Oily paper lets some light through, but you can't see clearly through it. It is ___.", "translucent", [["transparent", "light-material-mixup"], ["opaque", "light-material-mixup"], ["luminous", "light-source-mixup"]], "Some light, blurry view → translucent."),
      t("shadows", "Where is the Sun when shadows are shortest?", "High overhead, at noon", [["Low in the east, at sunrise", "shadow-mixup"], ["Low in the west, at sunset", "shadow-mixup"], ["Just above the horizon", "shadow-mixup"]], "The higher the Sun, the shorter the shadow."),
      t("shadows", "Riya stands with the Sun behind her. Where is her shadow?", "In front of her", [["Behind her", "shadow-mixup"], ["Above her head", "shadow-mixup"], ["She has no shadow", "shadow-mixup"]], "The shadow falls on the side away from the light: in front of her."),
      t("shadows", "Which statement about shadows is TRUE?", "A shadow forms on the side away from the light.", [["A shadow shows the colour of the object.", "shadow-mixup"], ["Transparent objects make the darkest shadows.", "light-material-mixup"], ["Shadows form only at night.", "shadow-mixup"]], "Light is blocked, so the dark patch is behind the object, away from the light."),
      t("shadows", "A pole's shadow is long at 8 a.m. and short at noon. At 5 p.m. it will be ___.", "long again", [["the shortest of the day", "shadow-mixup"], ["the same as at noon", "shadow-mixup"], ["gone, even in sunshine", "shadow-mixup"]], "In the late afternoon the Sun is low again, so the shadow is long again."),
      t("shadows", "How can you make a toy's shadow on the wall SMALLER?", "Move the toy away from the torch", [["Move the toy closer to the torch", "shadow-mixup"], ["Use a red torch", "shadow-mixup"], ["Paint the toy white", "shadow-mixup"]], "Further from the light, the toy blocks less light, so its shadow shrinks."),
    ],

    // ---------- Sound All Around ----------
    "sq-sound-warmup": [
      t("vibration", "How is sound made?", "By something vibrating quickly", [["By something getting hot", "sound-vibration-mixup"], ["By light hitting an object", "sound-vibration-mixup"], ["By something staying very still", "sound-vibration-mixup"]], "Sound comes from vibrations: something moving back and forth very fast."),
      t("vibration", "When you hit a drum, what vibrates to make the sound?", "The skin stretched on top", [["The floor under it", "sound-vibration-mixup"], ["The light in the room", "sound-vibration-mixup"], ["Nothing moves at all", "sound-vibration-mixup"]], "The drum skin shakes back and forth: that vibration is the sound."),
      t("vibration", "Which part of your body vibrates when you talk?", "Your voice box (in your throat)", [["Your elbow", "sound-vibration-mixup"], ["Your eyes", "sound-vibration-mixup"], ["Your knees", "sound-vibration-mixup"]], "Your voice box vibrates when you speak. Touch your throat and hum to feel it."),
      t("sound-travel", "Can sound travel through water?", "Yes, it can.", [["No, never.", "sound-medium-mixup"], ["Only at night.", "sound-medium-mixup"], ["Only if the water is hot.", "sound-medium-mixup"]], "Sound travels through solids, liquids and gases. Whales hear each other far away in the sea."),
      t("sound-travel", "Why do astronauts on the Moon talk by radio?", "There is no air to carry sound.", [["It is too cold to talk.", "sound-medium-mixup"], ["Their voices are too soft.", "sound-medium-mixup"], ["The Moon is too bright.", "sound-medium-mixup"]], "Sound needs something to travel through. Space and the Moon have no air."),
      t("sound-travel", "Sound travels FASTEST through ___.", "solids, like wood", [["liquids, like water", "sound-medium-mixup"], ["gases, like air", "sound-medium-mixup"], ["empty space", "sound-medium-mixup"]], "Sound is fastest in solids, slower in water, slower still in air, and can't travel in empty space."),
      t("hearing", "What is an echo?", "A sound that bounces back to you", [["A very soft whisper", "echo-mixup"], ["A sound made only by water", "echo-mixup"], ["A light that bounces back", "echo-mixup"]], "An echo is sound reflected from a hard surface, like a hill or a big empty hall."),
      t("hearing", "Hitting a drum harder makes the sound ___.", "louder", [["softer", "pitch-loudness-mixup"], ["stop", "pitch-loudness-mixup"], ["travel through space", "sound-medium-mixup"]], "A harder hit makes bigger vibrations, and bigger vibrations are louder."),
    ],
    "sq-sound-hearing": [
      t("hearing", "Which makes a HIGH sound?", "A mosquito buzzing", [["A lion roaring", "pitch-loudness-mixup"], ["A big drum", "pitch-loudness-mixup"], ["Thunder", "pitch-loudness-mixup"]], "A mosquito's thin buzz is high. Roars, big drums and thunder are low."),
      t("hearing", "Which makes a LOW sound?", "A cow mooing", [["A whistle", "pitch-loudness-mixup"], ["A small bell", "pitch-loudness-mixup"], ["A bird chirping", "pitch-loudness-mixup"]], "A cow's moo is a deep, low sound."),
      t("hearing", "Where are you most likely to hear an echo?", "In a big, empty hall", [["In a small room full of cushions", "echo-mixup"], ["Under a thick blanket", "echo-mixup"], ["In a noisy, crowded market", "echo-mixup"]], "Hard walls in a big empty hall bounce sound back. Soft things soak it up."),
      t("hearing", "Bats fly in the dark. How do they find their way?", "They listen to echoes of their squeaks.", [["They follow the light of the Moon.", "echo-mixup"], ["They smell the walls.", "echo-mixup"], ["They feel the wind.", "echo-mixup"]], "Bats squeak and listen to the echoes bouncing off things around them."),
      t("hearing", "A thin, tight guitar string makes a ___ sound than a thick, loose one.", "higher", [["lower", "pitch-loudness-mixup"], ["slower", "pitch-loudness-mixup"], ["colder", "pitch-loudness-mixup"]], "Thin, tight strings vibrate faster, so their sound is higher."),
      t("hearing", "Very loud sounds for a long time can ___.", "hurt our ears", [["make us taller", "pitch-loudness-mixup"], ["help us see better", "pitch-loudness-mixup"], ["make our hair grow", "pitch-loudness-mixup"]], "Very loud sounds can damage our hearing. Cover your ears near loud noise."),
      t("hearing", "Why do we cover our ears near a loud firecracker?", "To protect our ears", [["To see the colours better", "pitch-loudness-mixup"], ["To make the sound louder", "pitch-loudness-mixup"], ["To keep our ears warm", "pitch-loudness-mixup"]], "Very loud sounds can hurt our ears."),
      t("hearing", "A small bell and a big bell are hit. Which usually gives the higher sound?", "The small bell", [["The big bell", "pitch-loudness-mixup"], ["Both always sound the same", "pitch-loudness-mixup"], ["Neither makes a sound", "sound-vibration-mixup"]], "Smaller things vibrate faster, so the small bell sounds higher."),
    ],
    "sq-sound-gate-pool": [
      t("vibration", "You pluck a rubber band stretched over a box. What makes the sound?", "The band vibrating", [["The box getting warm", "sound-vibration-mixup"], ["Light shining on the band", "sound-vibration-mixup"], ["The band staying still", "sound-vibration-mixup"]], "The plucked band moves back and forth fast: that vibration makes the sound."),
      t("vibration", "Put your hand on your throat and hum. What do you feel?", "Vibrations", [["Nothing at all", "sound-vibration-mixup"], ["Your throat getting cold", "sound-vibration-mixup"], ["Drops of water", "sound-vibration-mixup"]], "Your voice box vibrates when you hum, and you can feel it."),
      t("vibration", "You hold a ringing bell tightly. The sound ___.", "stops", [["gets louder", "sound-vibration-mixup"], ["gets higher", "pitch-loudness-mixup"], ["keeps going for ever", "sound-vibration-mixup"]], "Holding the bell stops its vibrations, so the sound stops."),
      t("vibration", "Which musical instrument makes sound with vibrating strings?", "Sitar", [["Tabla", "sound-vibration-mixup"], ["Flute", "sound-vibration-mixup"], ["Drum", "sound-vibration-mixup"]], "A sitar has strings. A tabla and a drum have a skin; a flute uses the air inside."),
      t("vibration", "In a flute, what vibrates to make the sound?", "The air inside it", [["The holes", "sound-vibration-mixup"], ["The player's fingers", "sound-vibration-mixup"], ["The paint on the flute", "sound-vibration-mixup"]], "Blowing makes the air inside the flute vibrate."),
      t("sound-travel", "Sound CANNOT travel through ___.", "empty space", [["water", "sound-medium-mixup"], ["wood", "sound-medium-mixup"], ["air", "sound-medium-mixup"]], "Sound needs a solid, liquid or gas to travel through. Empty space has nothing."),
      t("sound-travel", "You put your ear on a table and a friend taps the far end. Why do you hear it clearly?", "Sound travels well through solids.", [["Wood makes its own sound.", "sound-medium-mixup"], ["Sound travels only through air.", "sound-medium-mixup"], ["Light carries the sound.", "sound-medium-mixup"]], "Sound travels faster and better through solids like wood than through air."),
      t("sound-travel", "Whales call to each other across the sea. What does their sound travel through?", "Water", [["Empty space", "sound-medium-mixup"], ["Only air", "sound-medium-mixup"], ["Light", "sound-medium-mixup"]], "Sound travels well through water."),
      t("sound-travel", "Two paper cups joined by a tight string make a toy phone. Why does it work?", "Sound travels along the tight string.", [["The string carries electricity.", "sound-medium-mixup"], ["Light moves along the string.", "sound-medium-mixup"], ["The cups make their own sound.", "sound-vibration-mixup"]], "Your voice makes the cup and string vibrate, and the vibration travels to the other cup."),
      t("sound-travel", "Why do we see lightning before we hear thunder?", "Light travels much faster than sound.", [["Thunder is made later.", "sound-medium-mixup"], ["Sound travels faster than light.", "sound-medium-mixup"], ["Thunder travels only through rain.", "sound-medium-mixup"]], "Both happen at the same moment, but light reaches us almost at once, and sound takes longer."),
      t("hearing", "Which sound is the HIGHEST?", "A whistle", [["A lion's roar", "pitch-loudness-mixup"], ["A truck engine", "pitch-loudness-mixup"], ["A big drum", "pitch-loudness-mixup"]], "A whistle makes a high, sharp sound. The others are low."),
      t("hearing", "Why does an empty hall echo, but a room with curtains and sofas does not?", "Soft things soak up sound; hard walls bounce it back.", [["Curtains make sound louder.", "echo-mixup"], ["Sofas make their own echo.", "echo-mixup"], ["Sound cannot enter a full room.", "sound-medium-mixup"]], "Hard, bare walls reflect sound. Soft curtains and cushions soak it up."),
      t("hearing", "Which is TRUE about loud and soft sounds?", "Bigger vibrations make louder sounds.", [["Smaller vibrations make louder sounds.", "pitch-loudness-mixup"], ["Loud sounds can travel through space.", "sound-medium-mixup"], ["Soft sounds have no vibrations.", "sound-vibration-mixup"]], "The bigger the vibration, the louder the sound."),
      t("hearing", "You shout towards a far-away hill and hear your voice again. This is ___.", "an echo", [["a shadow", "echo-mixup"], ["a whisper", "echo-mixup"], ["thunder", "echo-mixup"]], "Your voice bounced off the hill and came back: an echo."),
      t("hearing", "Which helps to cut the noise from a busy road?", "Planting rows of trees", [["Playing music louder", "pitch-loudness-mixup"], ["Honking more", "pitch-loudness-mixup"], ["Opening all the windows", "pitch-loudness-mixup"]], "Trees and bushes soak up some of the sound."),
    ],

    // ---------- Magnets ----------
    "sq-magnets-warmup": [
      t("magnetic-materials", "Which of these will a magnet pull?", "An iron nail", [["A wooden spoon", "magnetic-material-mixup"], ["A plastic ruler", "magnetic-material-mixup"], ["A rubber eraser", "magnetic-material-mixup"]], "Magnets attract iron. Wood, plastic and rubber are not magnetic."),
      t("magnetic-materials", "Which metal is NOT attracted by a magnet?", "Copper", [["Iron", "magnetic-material-mixup"], ["Nickel", "magnetic-material-mixup"], ["Cobalt", "magnetic-material-mixup"]], "Only some metals are magnetic: iron, nickel and cobalt. Copper is not."),
      t("magnetic-materials", "Things that a magnet attracts are called ___.", "magnetic materials", [["non-magnetic materials", "magnetic-material-mixup"], ["luminous materials", "magnetic-material-mixup"], ["transparent materials", "magnetic-material-mixup"]], "Iron, nickel and cobalt are magnetic materials."),
      t("magnet-poles", "Every magnet has two poles. What are they called?", "North pole and South pole", [["East pole and West pole", "magnet-poles-mixup"], ["Top pole and bottom pole", "magnet-poles-mixup"], ["Hot pole and cold pole", "magnet-poles-mixup"]], "A magnet has a North (N) pole and a South (S) pole."),
      t("magnet-poles", "Where is a bar magnet strongest?", "At its two ends (the poles)", [["In the middle", "magnet-poles-mixup"], ["The same everywhere", "magnet-poles-mixup"], ["Nowhere: it has no strong part", "magnet-poles-mixup"]], "Most pins stick at the poles, the ends of the magnet."),
      t("magnet-poles", "Two North poles are brought close. What happens?", "They push each other away.", [["They pull together.", "magnet-poles-mixup"], ["Nothing happens.", "magnet-poles-mixup"], ["They turn into South poles.", "magnet-poles-mixup"]], "Like poles repel: N and N push apart."),
      t("compass", "A bar magnet hanging freely from a thread comes to rest pointing ___.", "North and South", [["East and West", "compass-mixup"], ["up and down", "compass-mixup"], ["towards the nearest window", "compass-mixup"]], "A freely hanging magnet always lines up North–South."),
      t("compass", "What is a compass used for?", "Finding directions", [["Measuring heat", "compass-mixup"], ["Making light", "compass-mixup"], ["Weighing things", "compass-mixup"]], "A compass needle points North, so we can find our way."),
    ],
    "sq-magnets-poles": [
      t("magnet-poles", "A North pole and a South pole are brought close. What happens?", "They attract (pull together).", [["They repel (push apart).", "magnet-poles-mixup"], ["Nothing happens.", "magnet-poles-mixup"], ["Both become North poles.", "magnet-poles-mixup"]], "Unlike poles attract: N and S pull together."),
      t("magnet-poles", "Which of these will REPEL each other?", "Two South poles", [["A North pole and a South pole", "magnet-poles-mixup"], ["A pole and an iron nail", "magnetic-material-mixup"], ["A pole and a steel paper clip", "magnetic-material-mixup"]], "Like poles repel. A magnet always attracts iron, never repels it."),
      t("magnet-poles", "A bar magnet breaks into two pieces. How many poles does each piece have?", "Two: a North and a South", [["Only one", "magnet-poles-mixup"], ["None", "magnet-poles-mixup"], ["Four", "magnet-poles-mixup"]], "Each piece becomes a new, smaller magnet with both poles."),
      t("magnet-poles", "Which rule about magnets is correct?", "Like poles repel; unlike poles attract.", [["Like poles attract; unlike poles repel.", "magnet-poles-mixup"], ["All poles attract each other.", "magnet-poles-mixup"], ["Poles never push or pull.", "magnet-poles-mixup"]], "Same poles push apart; different poles pull together."),
      t("magnet-poles", "Ring magnets on a pencil float one above the other. Why?", "Their like poles face each other and repel.", [["They are very light.", "magnet-poles-mixup"], ["The pencil is magnetic.", "magnetic-material-mixup"], ["Air holds them up.", "magnet-poles-mixup"]], "The facing poles are the same, so they push each other apart."),
      t("magnet-poles", "Which is the surest test that a metal bar is a magnet?", "It repels one end of a magnet.", [["It attracts a magnet.", "magnet-poles-mixup"], ["It is shiny.", "magnetic-material-mixup"], ["It is heavy.", "magnetic-material-mixup"]], "An iron bar is also attracted by a magnet. Only another magnet can REPEL a pole."),
      t("magnet-poles", "You bring the N pole of a magnet near a compass needle. The needle's N end ___.", "turns away from it", [["turns towards it", "magnet-poles-mixup"], ["falls off", "compass-mixup"], ["starts to glow", "compass-mixup"]], "The needle is a tiny magnet. N and N repel, so its N end turns away."),
      t("magnet-poles", "Where on a bar magnet do most iron pins stick?", "At the two ends", [["In the middle", "magnet-poles-mixup"], ["Evenly all over", "magnet-poles-mixup"], ["None stick at all", "magnetic-material-mixup"]], "A magnet is strongest at its poles, the two ends."),
    ],
    "sq-magnets-gate-pool": [
      t("magnetic-materials", "Which group has ONLY magnetic materials?", "Iron, nickel, cobalt", [["Iron, copper, wood", "magnetic-material-mixup"], ["Gold, silver, plastic", "magnetic-material-mixup"], ["Nickel, glass, rubber", "magnetic-material-mixup"]], "Iron, nickel and cobalt are all magnetic."),
      t("magnetic-materials", "A magnet picks up iron pins through a thin sheet of paper. This shows that ___.", "magnetic force works through paper", [["paper is magnetic", "magnetic-material-mixup"], ["the pins are made of paper", "magnetic-material-mixup"], ["the magnet is made of paper", "magnetic-material-mixup"]], "Magnetic force can pass through paper, glass and water."),
      t("magnetic-materials", "How can you separate iron filings mixed with sand?", "Move a magnet over the mix", [["Add water and stir", "magnetic-material-mixup"], ["Blow on the mix", "magnetic-material-mixup"], ["Shine a torch on it", "magnetic-material-mixup"]], "The magnet pulls out the iron filings and leaves the sand."),
      t("magnetic-materials", "Which of these will NOT stick to a fridge magnet?", "An aluminium can", [["An iron nail", "magnetic-material-mixup"], ["A steel paper clip", "magnetic-material-mixup"], ["An iron screw", "magnetic-material-mixup"]], "Aluminium is not magnetic. Iron and the steel in paper clips are."),
      t("magnetic-materials", "A natural magnet found in rocks is called ___.", "lodestone", [["marble", "magnetic-material-mixup"], ["chalk", "magnetic-material-mixup"], ["granite", "magnetic-material-mixup"]], "Lodestone (magnetite) is a natural magnet. Long ago, sailors used it to find North."),
      t("magnet-poles", "Two magnets push each other away. The poles facing each other must be ___.", "the same (N and N, or S and S)", [["different (N and S)", "magnet-poles-mixup"], ["made of copper", "magnetic-material-mixup"], ["very hot", "magnet-poles-mixup"]], "Only like poles repel."),
      t("magnet-poles", "Which statement is TRUE?", "Every magnet has a North and a South pole.", [["Some magnets have only a North pole.", "magnet-poles-mixup"], ["The poles are in the middle of a bar magnet.", "magnet-poles-mixup"], ["Like poles always attract.", "magnet-poles-mixup"]], "Every magnet, even a broken piece, has both poles."),
      t("magnet-poles", "The N pole of magnet A attracts end X of magnet B. End X is ___.", "a South pole", [["a North pole", "magnet-poles-mixup"], ["not a pole", "magnet-poles-mixup"], ["made of plastic", "magnetic-material-mixup"]], "Unlike poles attract, so end X must be South."),
      t("magnet-poles", "Iron pins are held near a bar magnet. Where do the FEWEST stick?", "In the middle", [["At the North end", "magnet-poles-mixup"], ["At the South end", "magnet-poles-mixup"], ["At both ends", "magnet-poles-mixup"]], "A magnet is weakest in the middle and strongest at the poles."),
      t("magnet-poles", "Why are bar magnets stored in pairs with unlike poles side by side?", "So they keep their magnetism longer", [["So they look neat", "compass-mixup"], ["So they become heavier", "magnet-poles-mixup"], ["So they turn into iron", "magnetic-material-mixup"]], "Storing them N next to S helps magnets stay strong."),
      t("compass", "The needle of a compass is a tiny ___.", "magnet", [["mirror", "compass-mixup"], ["bulb", "compass-mixup"], ["battery", "compass-mixup"]], "The needle is a small magnet, so it lines up North–South."),
      t("compass", "Which can make a magnet lose its magnetism?", "Heating it or hammering it", [["Keeping it in a box", "compass-mixup"], ["Wiping it with a cloth", "compass-mixup"], ["Keeping it dry", "compass-mixup"]], "Heating, hammering or dropping a magnet again and again weakens it."),
      t("compass", "Why does a compass needle point North?", "The Earth acts like a giant magnet.", [["The North is always colder.", "compass-mixup"], ["The wind blows from the North.", "compass-mixup"], ["The needle is heavier at one end.", "compass-mixup"]], "The Earth's magnetism pulls the tiny needle magnet into a North–South line."),
      t("compass", "Which of these uses a magnet?", "A fridge door that snaps shut", [["A wooden chair", "magnetic-material-mixup"], ["A glass window", "magnetic-material-mixup"], ["A cotton shirt", "magnetic-material-mixup"]], "A magnetic strip in the fridge door keeps it closed."),
      t("compass", "Long ago, sailors used a compass to ___.", "find their way at sea", [["catch more fish", "compass-mixup"], ["measure how deep the water was", "compass-mixup"], ["keep their food cold", "compass-mixup"]], "A compass shows North, so sailors could steer the right way."),
    ],

    // ---------- Unit 5 Boss (12, Classes 3–5) ----------
    "sq-u5-test": [
      q("Which of these is a source of light?", "A glowing firefly", [["A mirror", "light-source-mixup"], ["The Moon", "light-source-mixup"], ["A white wall", "light-source-mixup"]], "A firefly makes its own light. The others only reflect light."),
      q("Which material is translucent?", "Butter paper", [["Clear glass", "light-material-mixup"], ["A wooden door", "light-material-mixup"], ["A steel plate", "light-material-mixup"]], "Butter paper lets some light through, but you can't see clearly through it."),
      q("Your shadow is shortest when the Sun is ___.", "high overhead", [["just rising", "shadow-mixup"], ["about to set", "shadow-mixup"], ["low in the sky", "shadow-mixup"]], "The higher the Sun, the shorter the shadow."),
      q("A shadow is formed when ___ blocks light.", "an opaque object", [["a transparent object", "light-material-mixup"], ["clean air", "light-material-mixup"], ["a clear window", "light-material-mixup"]], "Only opaque things block light fully and make a dark shadow."),
      q("Sound is made when something ___.", "vibrates", [["glows", "sound-vibration-mixup"], ["melts", "sound-vibration-mixup"], ["stays still", "sound-vibration-mixup"]], "All sounds come from vibrations."),
      q("Sound CANNOT travel through ___.", "empty space", [["water", "sound-medium-mixup"], ["a wall", "sound-medium-mixup"], ["air", "sound-medium-mixup"]], "Sound needs a solid, liquid or gas. Empty space has none."),
      q("Which of these makes a HIGH sound?", "A mosquito", [["A lion", "pitch-loudness-mixup"], ["A cow", "pitch-loudness-mixup"], ["A buffalo", "pitch-loudness-mixup"]], "A mosquito's buzz is high; the others make low sounds."),
      q("You shout into a deep well and hear your voice come back. This is ___.", "an echo", [["a shadow", "echo-mixup"], ["a vibration stopping", "sound-vibration-mixup"], ["light bouncing back", "echo-mixup"]], "Sound bounced off the water and walls of the well: an echo."),
      q("Which will a magnet attract?", "A steel paper clip", [["A gold ring", "magnetic-material-mixup"], ["A glass marble", "magnetic-material-mixup"], ["A plastic button", "magnetic-material-mixup"]], "Paper clips are made of steel, which contains iron."),
      q("Two South poles are brought close. What happens?", "They repel.", [["They attract.", "magnet-poles-mixup"], ["They melt.", "magnet-poles-mixup"], ["They turn into North poles.", "magnet-poles-mixup"]], "Like poles repel."),
      q("A magnet hanging freely from a thread points ___.", "North–South", [["East–West", "compass-mixup"], ["up and down", "compass-mixup"], ["towards the Sun", "compass-mixup"]], "A freely hanging magnet lines up North–South, like a compass needle."),
      q("Which statement is TRUE?", "Light travels in straight lines.", [["Sound travels through empty space.", "sound-medium-mixup"], ["Magnets attract copper.", "magnetic-material-mixup"], ["Clear glass makes dark shadows.", "light-material-mixup"]], "Light travels in straight lines. The other three are false."),
    ],
  },

  nodes: [
    u5,
    light,
    forGrades(withSubtopic(practice("sq-light-p1", light, 1, "Shadow Detective", "medium", [quiz("sq-light-shadows")]), "shadows"), C345),
    forGrades(gate("sq-light-gate", light, "Light Challenge", "sq-light-gate-pool", {
      "light-sources": "Sources of light",
      "light-materials": "Does light pass through?",
      shadows: "Shadows",
    }), C345),
    forGrades(endless(light), C345),

    sound,
    forGrades(withSubtopic(practice("sq-sound-p1", sound, 1, "Loud, Soft, High, Low", "medium", [quiz("sq-sound-hearing")]), "hearing"), C345),
    forGrades(gate("sq-sound-gate", sound, "Sound Challenge", "sq-sound-gate-pool", {
      vibration: "Vibrations",
      "sound-travel": "How sound travels",
      hearing: "Loud, high and echoes",
    }), C345),
    forGrades(endless(sound), C345),

    magnets,
    forGrades(withSubtopic(practice("sq-magnets-p1", magnets, 1, "Attract or Repel?", "medium", [quiz("sq-magnets-poles")]), "magnet-poles"), C345),
    forGrades(gate("sq-magnets-gate", magnets, "Magnet Challenge", "sq-magnets-gate-pool", {
      "magnetic-materials": "What magnets pull",
      "magnet-poles": "Poles: attract or repel",
      compass: "Compass and care",
    }), C345),
    forGrades(endless(magnets), C345),

    forGrades(boss("sq-u5-boss", u5.id, "Light, Sound & Magnets Boss", "sq-u5-test", "Dr. Bio-Mixer has switched off the lights, muffled every sound and scrambled all the compasses! Use what you know about light, sound and magnets to put the world back in order."), C345),
  ],
};
