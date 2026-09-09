import json
import os

file_path = '/Users/mohitchilkoti/Documents/projects/apprec8/data/space_olympiad_data.json'

with open(file_path, 'r') as f:
    data = json.load(f)

# Base config
default_config = {
    "passingScore": 70,
    "timeLimit": 0
}

new_quizzes = [
    {
        "id": "space-level-6",
        "title": "Level 6: Comets, Asteroids, and Meteors",
        "order": 6,
        "config": default_config,
        "questions": [
            {
                "question": "What is the difference between an asteroid and a comet?",
                "options": [
                    {"content": "Asteroids are icy, comets are rocky", "isCorrect": False},
                    {"content": "Asteroids are rocky, comets are icy and have tails", "isCorrect": True},
                    {"content": "Asteroids orbit planets, comets orbit the Sun", "isCorrect": False},
                    {"content": "There is no difference", "isCorrect": False}
                ],
                "explanation": {
                    "text": "Asteroids are made of rock and metal, while comets are composed mostly of ice, dust, and rocky material. When a comet gets close to the Sun, its ice vaporizes, creating a visible tail.",
                    "trivia": "A comet's tail always points away from the Sun, blown by the solar wind!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/2/23/Comet_Hale-Bopp_1995O1.jpg"
                },
                "difficulty": 1,
                "type": "multiple-choice"
            },
            {
                "question": "Where is the main Asteroid Belt located in our Solar System?",
                "options": [
                    {"content": "Between Earth and Mars", "isCorrect": False},
                    {"content": "Between Jupiter and Saturn", "isCorrect": False},
                    {"content": "Between Mars and Jupiter", "isCorrect": True},
                    {"content": "Beyond Neptune", "isCorrect": False}
                ],
                "explanation": {
                    "text": "The main Asteroid Belt is a torus-shaped region in the Solar System, located roughly between the orbits of the planets Jupiter and Mars.",
                    "trivia": "Despite containing millions of asteroids, the belt is mostly empty space. Spacecraft can fly through it easily without colliding with anything!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/f/f3/InnerSolarSystem-en.png"
                },
                "difficulty": 1,
                "type": "multiple-choice"
            },
            {
                "question": "What do we call a meteoroid that survives its passage through the Earth's atmosphere and hits the ground?",
                "options": [
                    {"content": "Meteor", "isCorrect": False},
                    {"content": "Meteorite", "isCorrect": True},
                    {"content": "Asteroid", "isCorrect": False},
                    {"content": "Comet", "isCorrect": False}
                ],
                "explanation": {
                    "text": "A meteoroid is in space, a meteor is burning up in the atmosphere (a 'shooting star'), and a meteorite is what actually hits the ground.",
                    "trivia": "The largest known meteorite, the Hoba meteorite in Namibia, weighs over 60 tons and has never been moved!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/3/36/Hoba_Meteorite.jpg"
                },
                "difficulty": 2,
                "type": "multiple-choice"
            },
            {
                "question": "What is a 'Shooting Star' actually?",
                "options": [
                    {"content": "A dying star falling from the sky", "isCorrect": False},
                    {"content": "A meteor burning up in Earth's atmosphere", "isCorrect": True},
                    {"content": "A comet passing close to Earth", "isCorrect": False},
                    {"content": "An asteroid", "isCorrect": False}
                ],
                "explanation": {
                    "text": "When a tiny piece of space rock (meteoroid) hits Earth's atmosphere at high speed, friction causes it to burn up, creating a bright streak of light called a meteor.",
                    "trivia": "Most 'shooting stars' are caused by space rocks no bigger than a grain of sand or a small pebble!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/4/4b/Meteor_in_the_night_sky.jpg"
                },
                "difficulty": 1,
                "type": "multiple-choice"
            },
            {
                "question": "Which famous comet is visible from Earth every 75-76 years?",
                "options": [
                    {"content": "Hale-Bopp", "isCorrect": False},
                    {"content": "Halley's Comet", "isCorrect": True},
                    {"content": "Comet NEOWISE", "isCorrect": False},
                    {"content": "Shoemaker-Levy 9", "isCorrect": False}
                ],
                "explanation": {
                    "text": "Halley's Comet is a short-period comet visible from Earth every 75-76 years. It is the only known short-period comet that is regularly visible to the naked eye.",
                    "trivia": "The famous author Mark Twain was born in 1835 when Halley's Comet appeared, and he died in 1910, exactly when it appeared next!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/2/2a/Lspn_comet_halley.jpg"
                },
                "difficulty": 2,
                "type": "multiple-choice"
            },
            {
                "question": "What is the Oort Cloud?",
                "options": [
                    {"content": "A cloud of gas surrounding Jupiter", "isCorrect": False},
                    {"content": "A theoretical spherical shell of icy objects surrounding our Solar System", "isCorrect": True},
                    {"content": "The dust rings of Saturn", "isCorrect": False},
                    {"content": "A nebula where stars are born", "isCorrect": False}
                ],
                "explanation": {
                    "text": "The Oort Cloud is believed to be a giant spherical shell surrounding the rest of the solar system, containing billions of icy bodies and acting as the source of long-period comets.",
                    "trivia": "The Voyager 1 spacecraft won't reach the Oort cloud for another 300 years, and it will take about 30,000 years to pass through it!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/3/30/Oort_cloud_and_solar_system.jpg"
                },
                "difficulty": 3,
                "type": "multiple-choice"
            },
            {
                "question": "What is the largest object in the asteroid belt, which is also classified as a dwarf planet?",
                "options": [
                    {"content": "Vesta", "isCorrect": False},
                    {"content": "Pallas", "isCorrect": False},
                    {"content": "Ceres", "isCorrect": True},
                    {"content": "Hygeia", "isCorrect": False}
                ],
                "explanation": {
                    "text": "Ceres is the largest object in the asteroid belt between Mars and Jupiter and is the only dwarf planet located in the inner solar system.",
                    "trivia": "Ceres contains so much water ice that it may have more fresh water than all of Earth!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/7/76/Ceres_-_RC3_-_Haulani_Crater_%2822381131691%29_%28cropped%29.jpg"
                },
                "difficulty": 2,
                "type": "multiple-choice"
            },
            {
                "question": "When Earth passes through the trail of debris left behind by a comet, what event do we experience on Earth?",
                "options": [
                    {"content": "A solar eclipse", "isCorrect": False},
                    {"content": "A meteor shower", "isCorrect": True},
                    {"content": "An asteroid impact", "isCorrect": False},
                    {"content": "A lunar eclipse", "isCorrect": False}
                ],
                "explanation": {
                    "text": "Meteor showers occur when Earth passes through the trail of dusty debris left by a comet. The particles burn up in the atmosphere, creating many shooting stars.",
                    "trivia": "The famous Perseid meteor shower in August is caused by the debris from Comet Swift-Tuttle.",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/5/52/Meteorid_shower_1_edit.jpg"
                },
                "difficulty": 1,
                "type": "multiple-choice"
            },
            {
                "question": "What is the solid, central part of a comet called?",
                "options": [
                    {"content": "The Nucleus", "isCorrect": True},
                    {"content": "The Coma", "isCorrect": False},
                    {"content": "The Tail", "isCorrect": False},
                    {"content": "The Core", "isCorrect": False}
                ],
                "explanation": {
                    "text": "The solid core of a comet is called the nucleus, which is basically a 'dirty snowball' made of ice, dust, and rock.",
                    "trivia": "When a comet gets close to the sun, the ice turns into gas and forms a glowing atmosphere around the nucleus called a 'coma'.",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/8/8c/Comet_67P_on_19_September_2014_NavCam_mosaic.jpg"
                },
                "difficulty": 2,
                "type": "multiple-choice"
            },
            {
                "question": "Which space agency successfully landed a probe (Philae) on a comet for the very first time in 2014?",
                "options": [
                    {"content": "NASA (USA)", "isCorrect": False},
                    {"content": "ISRO (India)", "isCorrect": False},
                    {"content": "ESA (European Space Agency)", "isCorrect": True},
                    {"content": "Roscosmos (Russia)", "isCorrect": False}
                ],
                "explanation": {
                    "text": "The European Space Agency's Rosetta mission successfully landed the Philae probe on Comet 67P/Churyumov-Gerasimenko in 2014.",
                    "trivia": "Because the comet's gravity is so weak, the probe actually bounced twice before finally settling on the surface!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/8/8f/Philae_lander.jpg"
                },
                "difficulty": 3,
                "type": "multiple-choice"
            },
            {
                "question": "What does a Near-Earth Object (NEO) refer to?",
                "options": [
                    {"content": "An alien spacecraft", "isCorrect": False},
                    {"content": "Any asteroid or comet whose orbit brings it close to Earth", "isCorrect": True},
                    {"content": "A satellite in low-Earth orbit", "isCorrect": False},
                    {"content": "The Moon", "isCorrect": False}
                ],
                "explanation": {
                    "text": "Near-Earth Objects are comets and asteroids that have been nudged by the gravitational attraction of nearby planets into orbits that allow them to enter the Earth's neighborhood.",
                    "trivia": "NASA has an entire Planetary Defense Coordination Office dedicated to finding and tracking these objects to protect Earth!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/7/75/Asteroid_belt.svg"
                },
                "difficulty": 2,
                "type": "multiple-choice"
            },
            {
                "question": "NASA's DART mission was a historic planetary defense test. What did the DART spacecraft do?",
                "options": [
                    {"content": "It captured an asteroid in a net", "isCorrect": False},
                    {"content": "It intentionally crashed into an asteroid to change its orbit", "isCorrect": True},
                    {"content": "It blew up a comet with a laser", "isCorrect": False},
                    {"content": "It mined an asteroid for gold", "isCorrect": False}
                ],
                "explanation": {
                    "text": "The Double Asteroid Redirection Test (DART) successfully crashed a spacecraft into the asteroid Dimorphos to see if kinetic impact could change its path.",
                    "trivia": "The mission was a huge success, proving that humanity could potentially deflect a dangerous asteroid headed for Earth!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/0/07/DART_Spacecraft.png"
                },
                "difficulty": 2,
                "type": "multiple-choice"
            },
            {
                "question": "What is the Kuiper Belt?",
                "options": [
                    {"content": "A region of asteroids between Earth and Mars", "isCorrect": False},
                    {"content": "A disc of icy bodies extending beyond Neptune", "isCorrect": True},
                    {"content": "The rings of Saturn", "isCorrect": False},
                    {"content": "A galaxy far away", "isCorrect": False}
                ],
                "explanation": {
                    "text": "The Kuiper Belt is a circumstellar disc in the outer Solar System, extending from the orbit of Neptune.",
                    "trivia": "Pluto is the most famous resident of the Kuiper Belt, but scientists believe there are hundreds of thousands of icy bodies there!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/d/d4/Kuiper_belt_-_Oort_cloud-en.svg"
                },
                "difficulty": 2,
                "type": "multiple-choice"
            },
            {
                "question": "What caused the extinction of the non-avian dinosaurs 66 million years ago?",
                "options": [
                    {"content": "A massive volcanic eruption", "isCorrect": False},
                    {"content": "A massive asteroid impact", "isCorrect": True},
                    {"content": "An alien invasion", "isCorrect": False},
                    {"content": "A deadly virus", "isCorrect": False}
                ],
                "explanation": {
                    "text": "The Chicxulub crater in Mexico was caused by an asteroid roughly 10 kilometers wide, which caused massive climate change and wiped out 75% of life on Earth.",
                    "trivia": "The impact released energy equivalent to 10 billion Hiroshima atomic bombs!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/5/53/Asteroid_falling_to_Earth.jpg"
                },
                "difficulty": 1,
                "type": "multiple-choice"
            },
            {
                "question": "Why do comets have two distinct tails?",
                "options": [
                    {"content": "One is for gas and one is for dust", "isCorrect": True},
                    {"content": "One points to the Sun, one points away", "isCorrect": False},
                    {"content": "Because they spin very fast", "isCorrect": False},
                    {"content": "They don't; they only have one tail", "isCorrect": False}
                ],
                "explanation": {
                    "text": "Comets actually have two tails: a dust tail (which is curved and white/yellow) and an ion/gas tail (which is straight and blue).",
                    "trivia": "The blue ion tail is heavily affected by the solar wind and always points perfectly straight away from the Sun.",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/2/23/Comet_Hale-Bopp_1995O1.jpg"
                },
                "difficulty": 3,
                "type": "multiple-choice"
            }
        ]
    },
    {
        "id": "space-level-7",
        "title": "Level 7: The History of Astronomy",
        "order": 7,
        "config": default_config,
        "questions": [
            {
                "question": "Who was the first person to use a telescope to observe the night sky?",
                "options": [
                    {"content": "Isaac Newton", "isCorrect": False},
                    {"content": "Galileo Galilei", "isCorrect": True},
                    {"content": "Johannes Kepler", "isCorrect": False},
                    {"content": "Nicolaus Copernicus", "isCorrect": False}
                ],
                "explanation": {
                    "text": "In 1609, Galileo built his own telescope and was the first to use it for astronomy, discovering the moons of Jupiter and craters on the Moon.",
                    "trivia": "Galileo didn't invent the telescope—it was invented in the Netherlands—but he vastly improved the design for space observation.",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/d/d4/Justus_Sustermans_-_Portrait_of_Galileo_Galilei%2C_1636.jpg"
                },
                "difficulty": 1,
                "type": "multiple-choice"
            },
            {
                "question": "What did Nicolaus Copernicus propose that changed our understanding of the universe?",
                "options": [
                    {"content": "The Earth is flat", "isCorrect": False},
                    {"content": "The Earth is the center of the universe", "isCorrect": False},
                    {"content": "The Sun is the center of the solar system (Heliocentrism)", "isCorrect": True},
                    {"content": "Gravity pulls apples down", "isCorrect": False}
                ],
                "explanation": {
                    "text": "Copernicus formulated a model of the universe that placed the Sun rather than Earth at the center of the universe.",
                    "trivia": "He waited until the very end of his life to publish his book because he knew it would be extremely controversial!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/c/cb/Copernicus.jpg"
                },
                "difficulty": 2,
                "type": "multiple-choice"
            },
            {
                "question": "What is the Geocentric model of the universe?",
                "options": [
                    {"content": "The belief that Earth is the center of the universe", "isCorrect": True},
                    {"content": "The belief that the Sun is the center", "isCorrect": False},
                    {"content": "The belief that the universe has no center", "isCorrect": False},
                    {"content": "The belief that the galaxy is flat", "isCorrect": False}
                ],
                "explanation": {
                    "text": "The geocentric model, championed by Ptolemy and Aristotle, was the accepted astronomical model for over a thousand years, placing Earth at the center.",
                    "trivia": "To explain why planets sometimes appeared to move backward in the sky, astronomers had to invent complex looping paths called 'epicycles'.",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/0/07/Ptolemaic_system_2_%28psf%29.png"
                },
                "difficulty": 1,
                "type": "multiple-choice"
            },
            {
                "question": "Who discovered the three laws of planetary motion, proving that planets move in elliptical (oval) orbits?",
                "options": [
                    {"content": "Galileo Galilei", "isCorrect": False},
                    {"content": "Johannes Kepler", "isCorrect": True},
                    {"content": "Tycho Brahe", "isCorrect": False},
                    {"content": "Isaac Newton", "isCorrect": False}
                ],
                "explanation": {
                    "text": "Kepler realized that planets don't move in perfect circles around the sun, but in elongated ellipses.",
                    "trivia": "Kepler used the incredibly precise naked-eye observations made by his mentor, Tycho Brahe, to figure out these mathematical laws.",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/d/d4/Johannes_Kepler_1610.jpg"
                },
                "difficulty": 2,
                "type": "multiple-choice"
            },
            {
                "question": "Which ancient civilization is credited with creating the first known astronomical records and calendars based on the Moon and stars?",
                "options": [
                    {"content": "The Romans", "isCorrect": False},
                    {"content": "The Babylonians", "isCorrect": True},
                    {"content": "The Vikings", "isCorrect": False},
                    {"content": "The Aztecs", "isCorrect": False}
                ],
                "explanation": {
                    "text": "The Babylonians (in modern-day Iraq) kept meticulous clay tablet records of planetary movements dating back to 1000 BCE.",
                    "trivia": "We still use their base-60 math system today to measure time (60 seconds in a minute, 60 minutes in an hour)!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/2/23/Babylonian_clay_tablet_with_cuneiform.jpg"
                },
                "difficulty": 3,
                "type": "multiple-choice"
            },
            {
                "question": "Who formulated the Universal Law of Gravitation, explaining what keeps planets in orbit?",
                "options": [
                    {"content": "Albert Einstein", "isCorrect": False},
                    {"content": "Isaac Newton", "isCorrect": True},
                    {"content": "Stephen Hawking", "isCorrect": False},
                    {"content": "Carl Sagan", "isCorrect": False}
                ],
                "explanation": {
                    "text": "Isaac Newton published his laws of motion and universal gravitation in 1687, finally explaining the physics behind Kepler's elliptical orbits.",
                    "trivia": "The famous story of an apple falling on his head is likely exaggerated, but watching an apple fall did inspire his theory of gravity!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/3/39/GodfreyKneller-IsaacNewton-1689.jpg"
                },
                "difficulty": 1,
                "type": "multiple-choice"
            },
            {
                "question": "What incredible discovery did Edwin Hubble make in the 1920s?",
                "options": [
                    {"content": "He discovered Pluto", "isCorrect": False},
                    {"content": "He discovered that the universe is expanding", "isCorrect": True},
                    {"content": "He discovered black holes", "isCorrect": False},
                    {"content": "He invented the telescope", "isCorrect": False}
                ],
                "explanation": {
                    "text": "Hubble observed that distant galaxies were moving away from us, and the further away they were, the faster they were moving, proving the universe is expanding.",
                    "trivia": "Before Hubble's discoveries, most scientists thought the Milky Way was the entire universe!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/4/4c/Edwin_Hubble.jpg"
                },
                "difficulty": 2,
                "type": "multiple-choice"
            },
            {
                "question": "Which ancient Greek astronomer accurately calculated the circumference of the Earth using the shadows of sticks?",
                "options": [
                    {"content": "Aristotle", "isCorrect": False},
                    {"content": "Plato", "isCorrect": False},
                    {"content": "Eratosthenes", "isCorrect": True},
                    {"content": "Ptolemy", "isCorrect": False}
                ],
                "explanation": {
                    "text": "Around 240 BC, Eratosthenes measured the angle of the sun's shadow in two different Egyptian cities to calculate the size of the Earth with remarkable accuracy.",
                    "trivia": "This proves that educated people knew the Earth was round over 2,000 years before Columbus!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/8/86/Eratosthenes_measure_of_Earth_circumference.svg"
                },
                "difficulty": 3,
                "type": "multiple-choice"
            },
            {
                "question": "Which instrument, often made of brass, was used by ancient sailors and astronomers to navigate and measure the altitude of stars?",
                "options": [
                    {"content": "Microscope", "isCorrect": False},
                    {"content": "Astrolabe", "isCorrect": True},
                    {"content": "Barometer", "isCorrect": False},
                    {"content": "Geiger Counter", "isCorrect": False}
                ],
                "explanation": {
                    "text": "An astrolabe is an ancient astronomical instrument that was a handheld model of the universe.",
                    "trivia": "It was essentially the ancient equivalent of a smartphone—used to tell time, navigate, and predict planetary positions!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/8/8c/Astrolabium_1.jpg"
                },
                "difficulty": 2,
                "type": "multiple-choice"
            },
            {
                "question": "Who was the astronomer that discovered the planet Uranus in 1781?",
                "options": [
                    {"content": "William Herschel", "isCorrect": True},
                    {"content": "Clyde Tombaugh", "isCorrect": False},
                    {"content": "Galileo Galilei", "isCorrect": False},
                    {"content": "Urbain Le Verrier", "isCorrect": False}
                ],
                "explanation": {
                    "text": "William Herschel discovered Uranus using a telescope he built himself.",
                    "trivia": "He originally wanted to name the planet 'Georgium Sidus' (George's Star) after King George III of England!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/9/91/William_Herschel01.jpg"
                },
                "difficulty": 3,
                "type": "multiple-choice"
            },
            {
                "question": "How was the planet Neptune discovered in 1846?",
                "options": [
                    {"content": "By accident while looking at a comet", "isCorrect": False},
                    {"content": "By predicting its existence using mathematics", "isCorrect": True},
                    {"content": "By sending a probe", "isCorrect": False},
                    {"content": "It was visible to the naked eye", "isCorrect": False}
                ],
                "explanation": {
                    "text": "Astronomers noticed that Uranus's orbit was behaving strangely, pulled by unseen gravity. Urbain Le Verrier used math to predict exactly where a new planet must be, and astronomers found Neptune right where he calculated!",
                    "trivia": "It is the only planet in our solar system discovered through mathematical prediction rather than empirical observation.",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/5/56/Neptune_Full.jpg"
                },
                "difficulty": 3,
                "type": "multiple-choice"
            },
            {
                "question": "What did the ancient structure of Stonehenge likely serve as for early Britons?",
                "options": [
                    {"content": "A fortress", "isCorrect": False},
                    {"content": "An astronomical observatory and calendar", "isCorrect": True},
                    {"content": "A market", "isCorrect": False},
                    {"content": "A water reservoir", "isCorrect": False}
                ],
                "explanation": {
                    "text": "The giant stones at Stonehenge are perfectly aligned with the sunrise on the summer solstice and sunset on the winter solstice.",
                    "trivia": "Stonehenge was built long before the invention of writing or the wheel in Britain!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/3/3c/Stonehenge2007_07_30.jpg"
                },
                "difficulty": 1,
                "type": "multiple-choice"
            },
            {
                "question": "Who was the female astronomer that discovered Cepheid variable stars could be used as 'standard candles' to measure the size of the universe?",
                "options": [
                    {"content": "Marie Curie", "isCorrect": False},
                    {"content": "Henrietta Swan Leavitt", "isCorrect": True},
                    {"content": "Ada Lovelace", "isCorrect": False},
                    {"content": "Caroline Herschel", "isCorrect": False}
                ],
                "explanation": {
                    "text": "Henrietta Swan Leavitt discovered the relationship between the luminosity and the period of Cepheid variable stars, giving astronomers a cosmic ruler to measure distances to other galaxies.",
                    "trivia": "Edwin Hubble used her discovery to prove the universe was expanding!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/7/77/Henrietta_Swan_Leavitt.jpg"
                },
                "difficulty": 3,
                "type": "multiple-choice"
            },
            {
                "question": "What massive radio telescope in Puerto Rico was instrumental in radar astronomy until its collapse in 2020?",
                "options": [
                    {"content": "Very Large Array", "isCorrect": False},
                    {"content": "Arecibo Observatory", "isCorrect": True},
                    {"content": "Green Bank Telescope", "isCorrect": False},
                    {"content": "FAST", "isCorrect": False}
                ],
                "explanation": {
                    "text": "The Arecibo Observatory was built into a natural sinkhole in Puerto Rico and sent the famous 'Arecibo Message' to space to try and contact aliens.",
                    "trivia": "It was featured in popular movies like James Bond's 'GoldenEye' and 'Contact'.",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/6/6b/Arecibo_Observatory_Aerial_View.jpg"
                },
                "difficulty": 2,
                "type": "multiple-choice"
            },
            {
                "question": "What famous comet was proven to be the same object returning periodically by Edmond Halley?",
                "options": [
                    {"content": "Comet Encke", "isCorrect": False},
                    {"content": "Halley's Comet", "isCorrect": True},
                    {"content": "Comet Hale-Bopp", "isCorrect": False},
                    {"content": "Comet ISON", "isCorrect": False}
                ],
                "explanation": {
                    "text": "Edmond Halley used Newton's laws to calculate that comets seen in 1531, 1607, and 1682 were actually the exact same object returning every 76 years.",
                    "trivia": "He correctly predicted its return in 1758, though he died 16 years before he could see it!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/2/2a/Lspn_comet_halley.jpg"
                },
                "difficulty": 1,
                "type": "multiple-choice"
            }
        ]
    }
]

# Adding levels 8, 9, 10
l8_to_l10 = [
    {
        "id": "space-level-8",
        "title": "Level 8: Rockets and Spacecraft",
        "order": 8,
        "config": default_config,
        "questions": [
            {
                "question": "Which force must a rocket overcome to lift off the ground?",
                "options": [
                    {"content": "Friction", "isCorrect": False},
                    {"content": "Gravity", "isCorrect": True},
                    {"content": "Magnetism", "isCorrect": False},
                    {"content": "Centrifugal force", "isCorrect": False}
                ],
                "explanation": {
                    "text": "Gravity is the force pulling the rocket back towards Earth. A rocket must generate enough upward thrust to overcome its own weight.",
                    "trivia": "Rockets work based on Newton's Third Law: For every action, there is an equal and opposite reaction.",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9a/Soyuz_TMA-9_launch.jpg"
                },
                "difficulty": 1,
                "type": "multiple-choice"
            },
            {
                "question": "What is the name of the most powerful rocket ever successfully flown, built by SpaceX?",
                "options": [
                    {"content": "Saturn V", "isCorrect": False},
                    {"content": "Space Launch System (SLS)", "isCorrect": False},
                    {"content": "Starship", "isCorrect": True},
                    {"content": "Falcon 9", "isCorrect": False}
                ],
                "explanation": {
                    "text": "SpaceX's Starship is the tallest and most powerful launch vehicle ever built, designed to be fully reusable and take humans to Mars.",
                    "trivia": "Starship is 394 feet tall, which is taller than the Statue of Liberty!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/1/1d/Starship_Flight_3_Liftoff.jpg"
                },
                "difficulty": 2,
                "type": "multiple-choice"
            },
            {
                "question": "Which massive rocket was used by NASA to send astronauts to the Moon during the Apollo missions?",
                "options": [
                    {"content": "Delta IV Heavy", "isCorrect": False},
                    {"content": "Saturn V", "isCorrect": True},
                    {"content": "Atlas V", "isCorrect": False},
                    {"content": "Titan II", "isCorrect": False}
                ],
                "explanation": {
                    "text": "The Saturn V rocket remains the only launch vehicle to carry humans beyond low Earth orbit.",
                    "trivia": "The Saturn V burned through 20 tons of fuel per second at liftoff!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/1/16/Apollo_11_Launch_-_GPN-2000-000630.jpg"
                },
                "difficulty": 1,
                "type": "multiple-choice"
            },
            {
                "question": "What was the name of the NASA spacecraft program that operated as reusable space planes from 1981 to 2011?",
                "options": [
                    {"content": "The Apollo Program", "isCorrect": False},
                    {"content": "The Space Shuttle Program", "isCorrect": True},
                    {"content": "The Gemini Program", "isCorrect": False},
                    {"content": "The Mercury Program", "isCorrect": False}
                ],
                "explanation": {
                    "text": "The Space Shuttle was a partially reusable low Earth orbital spacecraft system that launched like a rocket and landed like an airplane.",
                    "trivia": "The Space Shuttle fleet included Columbia, Challenger, Discovery, Atlantis, and Endeavour.",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/d/d6/Space_Shuttle_Atlantis_landing.jpg"
                },
                "difficulty": 1,
                "type": "multiple-choice"
            },
            {
                "question": "What is 'escape velocity'?",
                "options": [
                    {"content": "The speed needed to break a rocket's heat shield", "isCorrect": False},
                    {"content": "The minimum speed required to completely escape a planet's gravity", "isCorrect": True},
                    {"content": "The speed of light", "isCorrect": False},
                    {"content": "The speed a rover drives on Mars", "isCorrect": False}
                ],
                "explanation": {
                    "text": "Escape velocity is the speed an object needs to travel to break free from the gravitational pull of a massive body without further propulsion.",
                    "trivia": "Earth's escape velocity is about 11.2 kilometers per second (25,000 mph)!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/6/69/Escape_velocity.jpg"
                },
                "difficulty": 2,
                "type": "multiple-choice"
            },
            {
                "question": "Which space probe holds the record for being the farthest human-made object from Earth?",
                "options": [
                    {"content": "New Horizons", "isCorrect": False},
                    {"content": "Voyager 1", "isCorrect": True},
                    {"content": "Cassini", "isCorrect": False},
                    {"content": "Pioneer 10", "isCorrect": False}
                ],
                "explanation": {
                    "text": "Launched in 1977, Voyager 1 has officially left the solar system and entered interstellar space.",
                    "trivia": "It carries a 'Golden Record' containing sounds and images of Earth in case aliens ever find it!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/6/60/Voyager_spacecraft_model.png"
                },
                "difficulty": 2,
                "type": "multiple-choice"
            },
            {
                "question": "India's Chandrayaan-3 made history by landing near which part of the Moon?",
                "options": [
                    {"content": "The Lunar North Pole", "isCorrect": False},
                    {"content": "The Lunar South Pole", "isCorrect": True},
                    {"content": "The Sea of Tranquility", "isCorrect": False},
                    {"content": "The Dark Side", "isCorrect": False}
                ],
                "explanation": {
                    "text": "Chandrayaan-3 successfully landed near the rugged lunar south pole, a region believed to contain frozen water in permanently shadowed craters.",
                    "trivia": "India was the first country in the world to successfully land a spacecraft in this difficult polar region!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9f/Chandrayaan-3_Lander.png"
                },
                "difficulty": 2,
                "type": "multiple-choice"
            },
            {
                "question": "What does a spacecraft's 'heat shield' protect it from?",
                "options": [
                    {"content": "Solar flares", "isCorrect": False},
                    {"content": "Friction when re-entering Earth's atmosphere", "isCorrect": True},
                    {"content": "Laser beams", "isCorrect": False},
                    {"content": "Space junk", "isCorrect": False}
                ],
                "explanation": {
                    "text": "When a spacecraft re-enters the atmosphere at massive speeds, friction and compressed air generate temperatures hot enough to melt metal.",
                    "trivia": "Heat shields can reach temperatures over 3,000°F (1,650°C) during re-entry!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/d/d4/Apollo_13_Command_Module.jpg"
                },
                "difficulty": 1,
                "type": "multiple-choice"
            },
            {
                "question": "What is the primary function of a space rover, like Curiosity or Perseverance?",
                "options": [
                    {"content": "To destroy asteroids", "isCorrect": False},
                    {"content": "To drive on the surface of another planet to conduct science experiments", "isCorrect": True},
                    {"content": "To build space stations", "isCorrect": False},
                    {"content": "To carry humans to Mars", "isCorrect": False}
                ],
                "explanation": {
                    "text": "Rovers are robotic vehicles equipped with cameras and scientific instruments designed to explore the terrain of other planets.",
                    "trivia": "Perseverance even brought a tiny helicopter named Ingenuity, which became the first aircraft to fly on another planet!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/f/fa/Martian_rover_Curiosity_using_ChemCam_M-100_focus_stacked_-_tight_crop.jpg"
                },
                "difficulty": 1,
                "type": "multiple-choice"
            },
            {
                "question": "What fuel is traditionally mixed with liquid oxygen in the main engines of the Space Shuttle?",
                "options": [
                    {"content": "Liquid Hydrogen", "isCorrect": True},
                    {"content": "Kerosene", "isCorrect": False},
                    {"content": "Diesel", "isCorrect": False},
                    {"content": "Plutonium", "isCorrect": False}
                ],
                "explanation": {
                    "text": "The Space Shuttle Main Engines burned a mixture of liquid hydrogen and liquid oxygen. When combined and ignited, they produce enormous thrust.",
                    "trivia": "The only exhaust product from burning hydrogen and oxygen is pure water vapor!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/c/c5/Space_Shuttle_Main_Engine.jpg"
                },
                "difficulty": 3,
                "type": "multiple-choice"
            },
            {
                "question": "What happens if a spacecraft goes faster than the orbital velocity while in low Earth orbit?",
                "options": [
                    {"content": "It will fall back to Earth", "isCorrect": False},
                    {"content": "Its orbit will become wider and more elliptical", "isCorrect": True},
                    {"content": "It will explode", "isCorrect": False},
                    {"content": "It will stop moving", "isCorrect": False}
                ],
                "explanation": {
                    "text": "To increase the altitude of an orbit, a spacecraft fires its engines to go faster. This pushes it further outward into a wider orbit.",
                    "trivia": "In space navigation, if you want to catch up to a space station ahead of you, you actually slow down to drop into a lower, faster orbit!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/1/11/Orbital_mechanics.png"
                },
                "difficulty": 3,
                "type": "multiple-choice"
            },
            {
                "question": "Which space agency is responsible for the Galileo, Cassini, and Juno missions?",
                "options": [
                    {"content": "ESA", "isCorrect": False},
                    {"content": "NASA", "isCorrect": True},
                    {"content": "ISRO", "isCorrect": False},
                    {"content": "JAXA", "isCorrect": False}
                ],
                "explanation": {
                    "text": "NASA (National Aeronautics and Space Administration) launched these highly successful missions to Jupiter and Saturn.",
                    "trivia": "Juno currently holds the record for the farthest solar-powered spacecraft from Earth!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e5/NASA_logo.svg"
                },
                "difficulty": 2,
                "type": "multiple-choice"
            },
            {
                "question": "What is an 'Orbital Trajectory'?",
                "options": [
                    {"content": "A type of rocket fuel", "isCorrect": False},
                    {"content": "The path a spacecraft follows through space", "isCorrect": True},
                    {"content": "The window in a space capsule", "isCorrect": False},
                    {"content": "The countdown sequence", "isCorrect": False}
                ],
                "explanation": {
                    "text": "A trajectory is the curved path that an object, like a rocket or satellite, follows in space under the action of gravity.",
                    "trivia": "Spacecraft often use 'slingshot' trajectories around planets to gain speed without using fuel!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/6/69/Gravity_assist.png"
                },
                "difficulty": 1,
                "type": "multiple-choice"
            },
            {
                "question": "Which part of a multi-stage rocket carries the astronauts or satellites?",
                "options": [
                    {"content": "The Booster", "isCorrect": False},
                    {"content": "The Payload", "isCorrect": True},
                    {"content": "The Thruster", "isCorrect": False},
                    {"content": "The Fuel Tank", "isCorrect": False}
                ],
                "explanation": {
                    "text": "The payload is the cargo of a spacecraft, which can include satellites, space probes, or spacecraft carrying humans.",
                    "trivia": "In most rockets, the payload makes up less than 5% of the total weight of the rocket at launch; the rest is almost entirely fuel!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/5/53/Falcon_Heavy_Fairing.jpg"
                },
                "difficulty": 2,
                "type": "multiple-choice"
            },
            {
                "question": "What is the term for space debris (old satellites, rocket parts) orbiting Earth that poses a danger to spacecraft?",
                "options": [
                    {"content": "Space Junk", "isCorrect": True},
                    {"content": "Asteroids", "isCorrect": False},
                    {"content": "Meteoroids", "isCorrect": False},
                    {"content": "Coma", "isCorrect": False}
                ],
                "explanation": {
                    "text": "Space junk or space debris is defunct human-made objects in space.",
                    "trivia": "Even a tiny fleck of paint orbiting at 17,500 mph can crack the window of the International Space Station!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/a/af/Debris-LEO1280.jpg"
                },
                "difficulty": 1,
                "type": "multiple-choice"
            }
        ]
    },
    {
        "id": "space-level-9",
        "title": "Level 9: The Universe and Cosmology",
        "order": 9,
        "config": default_config,
        "questions": [
            {
                "question": "What theory describes the origin of the universe as a rapid expansion from a highly dense and hot state?",
                "options": [
                    {"content": "The String Theory", "isCorrect": False},
                    {"content": "The Big Bang Theory", "isCorrect": True},
                    {"content": "The Steady State Theory", "isCorrect": False},
                    {"content": "The Multiverse Theory", "isCorrect": False}
                ],
                "explanation": {
                    "text": "The Big Bang theory is the prevailing cosmological model explaining the existence of the observable universe from the earliest known periods.",
                    "trivia": "The universe didn't explode *into* space; space itself expanded rapidly everywhere at once!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/6/6f/CMB_Timeline300_no_WMAP.jpg"
                },
                "difficulty": 1,
                "type": "multiple-choice"
            },
            {
                "question": "Roughly how old do scientists believe the universe is?",
                "options": [
                    {"content": "4.5 Billion years", "isCorrect": False},
                    {"content": "13.8 Billion years", "isCorrect": True},
                    {"content": "100 Million years", "isCorrect": False},
                    {"content": "1 Trillion years", "isCorrect": False}
                ],
                "explanation": {
                    "text": "By observing the oldest stars and measuring the rate of expansion of the universe, scientists estimate the universe is about 13.8 billion years old.",
                    "trivia": "Our solar system is only about 4.6 billion years old, meaning the universe was around for 9 billion years before Earth even existed!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/6/6f/CMB_Timeline300_no_WMAP.jpg"
                },
                "difficulty": 2,
                "type": "multiple-choice"
            },
            {
                "question": "What is the 'Cosmic Microwave Background'?",
                "options": [
                    {"content": "Radiation from microwaves used on the ISS", "isCorrect": False},
                    {"content": "The afterglow radiation left over from the Big Bang", "isCorrect": True},
                    {"content": "Light from the furthest stars", "isCorrect": False},
                    {"content": "Radio waves from aliens", "isCorrect": False}
                ],
                "explanation": {
                    "text": "The CMB is faint background radiation filling all space. It is the oldest light in the universe, essentially the glowing 'echo' of the Big Bang.",
                    "trivia": "If you tune an old analog TV between channels, a small percentage of the static on the screen is actually from the Cosmic Microwave Background!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/3/3c/Ilc_9yr_moll4096.png"
                },
                "difficulty": 3,
                "type": "multiple-choice"
            },
            {
                "question": "What unit of measurement is most commonly used by astronomers to measure the vast distances between galaxies?",
                "options": [
                    {"content": "Miles", "isCorrect": False},
                    {"content": "Astronomical Units (AU)", "isCorrect": False},
                    {"content": "Light-years", "isCorrect": True},
                    {"content": "Kilometers", "isCorrect": False}
                ],
                "explanation": {
                    "text": "A light-year is the distance that light travels in one Earth year (about 9.46 trillion kilometers or 5.88 trillion miles).",
                    "trivia": "Because light takes time to travel, looking at distant galaxies means we are looking back in time. We see the Andromeda galaxy as it was 2.5 million years ago!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/a/af/Light_dispersion_conceptual.jpg"
                },
                "difficulty": 1,
                "type": "multiple-choice"
            },
            {
                "question": "What is the name of our home supercluster of galaxies?",
                "options": [
                    {"content": "The Virgo Supercluster", "isCorrect": True},
                    {"content": "The Coma Supercluster", "isCorrect": False},
                    {"content": "The Shapley Supercluster", "isCorrect": False},
                    {"content": "The Hercules Supercluster", "isCorrect": False}
                ],
                "explanation": {
                    "text": "The Milky Way is part of the Local Group of galaxies, which in turn is part of the massive Virgo Supercluster.",
                    "trivia": "Even larger maps have recently shown that the Virgo Supercluster is just one lobe of an even more massive structure called Laniakea, meaning 'immense heaven' in Hawaiian.",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/8/87/Earth%27s_Location_in_the_Universe_SMALLER_%28JPEG%29.jpg"
                },
                "difficulty": 3,
                "type": "multiple-choice"
            },
            {
                "question": "What will eventually happen to our Sun in about 5 billion years?",
                "options": [
                    {"content": "It will explode as a Supernova", "isCorrect": False},
                    {"content": "It will turn into a Black Hole", "isCorrect": False},
                    {"content": "It will expand into a Red Giant and then become a White Dwarf", "isCorrect": True},
                    {"content": "It will simply burn out and disappear", "isCorrect": False}
                ],
                "explanation": {
                    "text": "The Sun is not massive enough to supernova. Instead, it will expand to swallow the inner planets, shed its outer layers, and leave behind a glowing core called a white dwarf.",
                    "trivia": "As a white dwarf, the Sun will be roughly the size of Earth but incredibly dense!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/9/90/Sun_red_giant.jpg"
                },
                "difficulty": 2,
                "type": "multiple-choice"
            },
            {
                "question": "What is a 'Wormhole' in theoretical physics?",
                "options": [
                    {"content": "A hole made by space worms", "isCorrect": False},
                    {"content": "A tunnel through spacetime connecting two distant points", "isCorrect": True},
                    {"content": "The center of a black hole", "isCorrect": False},
                    {"content": "A dead star", "isCorrect": False}
                ],
                "explanation": {
                    "text": "A wormhole (or Einstein-Rosen bridge) is a speculative structure linking disparate points in spacetime, potentially creating shortcuts for long journeys across the universe.",
                    "trivia": "While mathematically possible under general relativity, no wormhole has ever been observed.",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/5/5e/Wormhole_travel.png"
                },
                "difficulty": 2,
                "type": "multiple-choice"
            },
            {
                "question": "What is the 'Observable Universe'?",
                "options": [
                    {"content": "The entire universe in all directions forever", "isCorrect": False},
                    {"content": "A spherical region of the universe comprising all matter that can be observed from Earth right now", "isCorrect": True},
                    {"content": "Only the stars we can see with our eyes", "isCorrect": False},
                    {"content": "Our solar system", "isCorrect": False}
                ],
                "explanation": {
                    "text": "Because the universe has an age (13.8 billion years) and light travels at a finite speed, we can only see objects whose light has had time to reach us. This creates a 'bubble' of observability.",
                    "trivia": "The observable universe is about 93 billion light-years in diameter, and the 'whole' universe is likely much, much larger than that!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/8/87/Earth%27s_Location_in_the_Universe_SMALLER_%28JPEG%29.jpg"
                },
                "difficulty": 3,
                "type": "multiple-choice"
            },
            {
                "question": "What is a quasar?",
                "options": [
                    {"content": "An extremely luminous active galactic nucleus powered by a supermassive black hole", "isCorrect": True},
                    {"content": "A planet made of gas", "isCorrect": False},
                    {"content": "A type of alien spacecraft", "isCorrect": False},
                    {"content": "A tiny star", "isCorrect": False}
                ],
                "explanation": {
                    "text": "Quasars are the brightest objects in the universe. They consist of a supermassive black hole actively feeding on gas, which heats up and shines incredibly brightly.",
                    "trivia": "A single quasar can shine thousands of times brighter than an entire galaxy of hundreds of billions of stars!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/c/c5/Artist%27s_rendering_of_ULAS_J1120%2B0641.jpg"
                },
                "difficulty": 3,
                "type": "multiple-choice"
            },
            {
                "question": "Which of these is the most abundant element in the universe?",
                "options": [
                    {"content": "Oxygen", "isCorrect": False},
                    {"content": "Carbon", "isCorrect": False},
                    {"content": "Helium", "isCorrect": False},
                    {"content": "Hydrogen", "isCorrect": True}
                ],
                "explanation": {
                    "text": "Hydrogen accounts for about 75% of the universe's elemental mass. It is the fuel that stars burn to create light and heavier elements.",
                    "trivia": "Every drop of water on Earth contains hydrogen that was created during the Big Bang 13.8 billion years ago!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/e/ea/Hydrogen_discharge_tube.jpg"
                },
                "difficulty": 1,
                "type": "multiple-choice"
            },
            {
                "question": "What do scientists call the theoretical 'end' of the universe where everything expands so far and fast that stars burn out and it goes dark and cold?",
                "options": [
                    {"content": "The Big Crunch", "isCorrect": False},
                    {"content": "The Big Freeze (Heat Death)", "isCorrect": True},
                    {"content": "The Big Bounce", "isCorrect": False},
                    {"content": "The Singularity", "isCorrect": False}
                ],
                "explanation": {
                    "text": "Because dark energy is accelerating the expansion of the universe, the leading theory is that eventually, all galaxies will fly apart, stars will burn out, and the universe will reach absolute zero in a 'Heat Death'.",
                    "trivia": "Don't worry, this won't happen for trillions and trillions of years!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/a/ad/Cosmological_expansion.jpg"
                },
                "difficulty": 3,
                "type": "multiple-choice"
            },
            {
                "question": "Who is the theoretical physicist who proposed that black holes aren't completely black, but emit faint radiation?",
                "options": [
                    {"content": "Albert Einstein", "isCorrect": False},
                    {"content": "Carl Sagan", "isCorrect": False},
                    {"content": "Stephen Hawking", "isCorrect": True},
                    {"content": "Neil deGrasse Tyson", "isCorrect": False}
                ],
                "explanation": {
                    "text": "Stephen Hawking used quantum mechanics to prove that black holes slowly leak energy over time, a phenomenon now known as 'Hawking Radiation'.",
                    "trivia": "Because of this radiation, black holes will eventually 'evaporate' completely, though it takes an unimaginably long time.",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/e/eb/Stephen_Hawking.StarChild.jpg"
                },
                "difficulty": 2,
                "type": "multiple-choice"
            },
            {
                "question": "What does a 'light-year' measure?",
                "options": [
                    {"content": "Time", "isCorrect": False},
                    {"content": "Speed", "isCorrect": False},
                    {"content": "Distance", "isCorrect": True},
                    {"content": "Brightness", "isCorrect": False}
                ],
                "explanation": {
                    "text": "Despite the word 'year', a light-year is a measure of distance—the distance light travels in one Earth year.",
                    "trivia": "One light-year is roughly 6 trillion miles!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/a/af/Light_dispersion_conceptual.jpg"
                },
                "difficulty": 1,
                "type": "multiple-choice"
            },
            {
                "question": "What is the study of the origin, evolution, and eventual fate of the universe called?",
                "options": [
                    {"content": "Astrology", "isCorrect": False},
                    {"content": "Cosmology", "isCorrect": True},
                    {"content": "Geology", "isCorrect": False},
                    {"content": "Meteorology", "isCorrect": False}
                ],
                "explanation": {
                    "text": "Cosmology is the branch of astronomy that deals with the physical origin and evolution of the universe as a whole.",
                    "trivia": "Astrology, on the other hand, is a pseudoscience dealing with horoscopes, which has nothing to do with modern science!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/6/6f/CMB_Timeline300_no_WMAP.jpg"
                },
                "difficulty": 1,
                "type": "multiple-choice"
            },
            {
                "question": "What is 'String Theory'?",
                "options": [
                    {"content": "A theory that all planets are connected by invisible strings", "isCorrect": False},
                    {"content": "A theoretical framework where particles are replaced by one-dimensional strings", "isCorrect": True},
                    {"content": "A theory about knitting in zero gravity", "isCorrect": False},
                    {"content": "A proven law of physics", "isCorrect": False}
                ],
                "explanation": {
                    "text": "String theory suggests that the fundamental ingredients of the universe are not tiny dots of matter, but vibrating loops of energy called strings.",
                    "trivia": "For the math in string theory to work, the universe must have at least 10 dimensions, most of which are curled up too small for us to see!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/1/1d/Calabi_yau_formatted.svg"
                },
                "difficulty": 3,
                "type": "multiple-choice"
            }
        ]
    },
    {
        "id": "space-level-10",
        "title": "Level 10: The Search for Extraterrestrial Life",
        "order": 10,
        "config": default_config,
        "questions": [
            {
                "question": "What does 'SETI' stand for?",
                "options": [
                    {"content": "Space Exploration and Travel Institute", "isCorrect": False},
                    {"content": "Search for Extraterrestrial Intelligence", "isCorrect": True},
                    {"content": "Scientists Examining The Interstellar", "isCorrect": False},
                    {"content": "Study of Earth's Topography from Ice", "isCorrect": False}
                ],
                "explanation": {
                    "text": "SETI is a collective term for scientific searches for intelligent extraterrestrial life, often by monitoring electromagnetic radiation for signs of transmissions.",
                    "trivia": "SETI scientists use giant radio telescopes to listen to the stars, hoping to hear artificial signals.",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/1/14/Allen_Telescope_Array.jpg"
                },
                "difficulty": 1,
                "type": "multiple-choice"
            },
            {
                "question": "What is the 'Goldilocks Zone' (Habitable Zone) in astronomy?",
                "options": [
                    {"content": "A region where bears live in space", "isCorrect": False},
                    {"content": "The region around a star where conditions are just right for liquid water to exist", "isCorrect": True},
                    {"content": "The zone where gold is mined on asteroids", "isCorrect": False},
                    {"content": "The center of the galaxy", "isCorrect": False}
                ],
                "explanation": {
                    "text": "The habitable zone is the area around a star where it is not too hot and not too cold for liquid water to exist on the surface of a planet.",
                    "trivia": "Earth is perfectly situated in the Sun's Goldilocks zone, while Venus is too hot and Mars is too cold.",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/2/2f/Habitable_zone-en.svg"
                },
                "difficulty": 1,
                "type": "multiple-choice"
            },
            {
                "question": "Which moon in our solar system is considered one of the best places to look for alien life because it has a massive liquid water ocean under an icy crust?",
                "options": [
                    {"content": "Earth's Moon", "isCorrect": False},
                    {"content": "Phobos (Mars)", "isCorrect": False},
                    {"content": "Europa (Jupiter)", "isCorrect": True},
                    {"content": "Titan (Saturn)", "isCorrect": False}
                ],
                "explanation": {
                    "text": "Jupiter's moon Europa is covered by a shell of ice, but underneath lies a salty, liquid ocean that could potentially harbor microbial life.",
                    "trivia": "Europa's hidden ocean is estimated to contain twice as much water as all of Earth's oceans combined!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e4/Europa-moon.jpg"
                },
                "difficulty": 2,
                "type": "multiple-choice"
            },
            {
                "question": "What is the famous 'Drake Equation' used to estimate?",
                "options": [
                    {"content": "The speed of light", "isCorrect": False},
                    {"content": "The number of active, communicative alien civilizations in our galaxy", "isCorrect": True},
                    {"content": "The distance to the nearest black hole", "isCorrect": False},
                    {"content": "The weight of a dragon", "isCorrect": False}
                ],
                "explanation": {
                    "text": "Written by Frank Drake in 1961, the equation multiplies several factors (like the rate of star formation and fraction of planets with life) to guess how many alien societies might exist.",
                    "trivia": "Because we don't know the exact values of many variables, the Drake Equation is more of a discussion tool than an exact calculation.",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/9/91/Drake_equation.svg"
                },
                "difficulty": 2,
                "type": "multiple-choice"
            },
            {
                "question": "What famous contradiction asks: 'If the universe is so vast and old, where are all the aliens?'",
                "options": [
                    {"content": "The Fermi Paradox", "isCorrect": True},
                    {"content": "Schrödinger's Cat", "isCorrect": False},
                    {"content": "The Grandfather Paradox", "isCorrect": False},
                    {"content": "Occam's Razor", "isCorrect": False}
                ],
                "explanation": {
                    "text": "The Fermi Paradox, named after physicist Enrico Fermi, highlights the contradiction between the high probability of alien life existing and the absolute lack of evidence we have found so far.",
                    "trivia": "Some solutions to the paradox suggest aliens might be hiding, while others suggest advanced civilizations always destroy themselves.",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/1/18/Are_we_alone%3F.jpg"
                },
                "difficulty": 2,
                "type": "multiple-choice"
            },
            {
                "question": "Saturn's moon Enceladus shoots giant geysers of what substance into space, making it a prime target in the search for life?",
                "options": [
                    {"content": "Liquid Methane", "isCorrect": False},
                    {"content": "Lava", "isCorrect": False},
                    {"content": "Water vapor and ice", "isCorrect": True},
                    {"content": "Sulfuric acid", "isCorrect": False}
                ],
                "explanation": {
                    "text": "The Cassini spacecraft flew right through the plumes erupting from Enceladus and detected salt water and organic molecules, key ingredients for life.",
                    "trivia": "These geysers actually create Saturn's 'E ring' by constantly spewing ice into orbit!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/7/77/Enceladus_plumes.jpg"
                },
                "difficulty": 3,
                "type": "multiple-choice"
            },
            {
                "question": "What are 'Extremophiles'?",
                "options": [
                    {"content": "Aliens from extreme distances", "isCorrect": False},
                    {"content": "Organisms on Earth that can survive in extreme conditions (like boiling water or radiation)", "isCorrect": True},
                    {"content": "Astronauts trained for extreme missions", "isCorrect": False},
                    {"content": "Planets that are extremely hot", "isCorrect": False}
                ],
                "explanation": {
                    "text": "Extremophiles are organisms (usually microbes) on Earth that thrive in conditions previously thought uninhabitable, like volcanic vents or deep ice.",
                    "trivia": "Tardigrades (water bears) are extremophiles that can even survive the vacuum and radiation of outer space!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e0/Tardigrade.jpg"
                },
                "difficulty": 1,
                "type": "multiple-choice"
            },
            {
                "question": "Which space telescope was explicitly designed to discover Earth-size exoplanets orbiting other stars?",
                "options": [
                    {"content": "Hubble Space Telescope", "isCorrect": False},
                    {"content": "Kepler Space Telescope", "isCorrect": True},
                    {"content": "Chandra X-Ray Observatory", "isCorrect": False},
                    {"content": "Spitzer", "isCorrect": False}
                ],
                "explanation": {
                    "text": "The Kepler mission looked for tiny dips in a star's brightness, which happens when a planet passes in front of it (a transit).",
                    "trivia": "Kepler discovered over 2,600 exoplanets before retiring in 2018, proving that there are more planets than stars in our galaxy!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/d/de/Kepler_space_telescope.jpg"
                },
                "difficulty": 2,
                "type": "multiple-choice"
            },
            {
                "question": "What is the 'Wow! Signal'?",
                "options": [
                    {"content": "A strong, unexplained radio signal detected in 1977 that some thought might be alien", "isCorrect": True},
                    {"content": "The signal a rocket makes when it launches", "isCorrect": False},
                    {"content": "A signal sent by NASA to Mars", "isCorrect": False},
                    {"content": "A typo in an astronomy book", "isCorrect": False}
                ],
                "explanation": {
                    "text": "In 1977, a radio telescope picked up a powerful, 72-second narrow-band radio signal. It was so perfectly aligned with what an alien signal would look like that the astronomer wrote 'Wow!' next to the data.",
                    "trivia": "Despite years of searching, the signal has never been detected again.",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/2/29/Wow_signal.jpg"
                },
                "difficulty": 2,
                "type": "multiple-choice"
            },
            {
                "question": "What are 'Biosignatures' in astronomy?",
                "options": [
                    {"content": "Alien autographs", "isCorrect": False},
                    {"content": "Substances (like certain gases) in an exoplanet's atmosphere that provide evidence of life", "isCorrect": True},
                    {"content": "Satellites monitoring Earth's biology", "isCorrect": False},
                    {"content": "The shapes of constellations", "isCorrect": False}
                ],
                "explanation": {
                    "text": "Biosignatures are specific elements or molecules (like oxygen and methane together) that would strongly suggest living organisms are producing them.",
                    "trivia": "The James Webb Space Telescope is powerful enough to detect these biosignatures in the atmospheres of distant exoplanets!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/7/77/Exoplanet_Atmosphere.jpg"
                },
                "difficulty": 3,
                "type": "multiple-choice"
            },
            {
                "question": "Which of these moons has a thick atmosphere, lakes of liquid methane, and is a major target for astrobiology?",
                "options": [
                    {"content": "Ganymede", "isCorrect": False},
                    {"content": "Europa", "isCorrect": False},
                    {"content": "Titan (Saturn)", "isCorrect": True},
                    {"content": "Io", "isCorrect": False}
                ],
                "explanation": {
                    "text": "Titan is the only moon in the solar system with a dense atmosphere, and it's the only place besides Earth known to have stable liquids on its surface (though it's liquid methane, not water).",
                    "trivia": "NASA is sending a drone called 'Dragonfly' to fly around Titan and search for chemical signs of life in 2028!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/e/ec/Titan_in_true_color.jpg"
                },
                "difficulty": 3,
                "type": "multiple-choice"
            },
            {
                "question": "What is Panspermia?",
                "options": [
                    {"content": "A type of alien plant", "isCorrect": False},
                    {"content": "The hypothesis that life exists throughout the universe and can be distributed by meteoroids or comets", "isCorrect": True},
                    {"content": "A disease caught by astronauts", "isCorrect": False},
                    {"content": "A type of galaxy", "isCorrect": False}
                ],
                "explanation": {
                    "text": "Panspermia suggests that life didn't necessarily originate on Earth, but rather microbial life 'hitched a ride' on a comet or asteroid and seeded our planet.",
                    "trivia": "We have found meteorites on Earth that were originally blasted off the surface of Mars by ancient impacts!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/4/4b/Meteor_in_the_night_sky.jpg"
                },
                "difficulty": 3,
                "type": "multiple-choice"
            },
            {
                "question": "Why do astronomers mostly use Radio Waves to listen for alien intelligence?",
                "options": [
                    {"content": "Because radio waves are cheap to produce", "isCorrect": False},
                    {"content": "Because radio waves can easily pass through the cosmic dust that blocks visible light", "isCorrect": True},
                    {"content": "Because aliens only use FM radio", "isCorrect": False},
                    {"content": "Because they are faster than light", "isCorrect": False}
                ],
                "explanation": {
                    "text": "Radio waves have long wavelengths, which allows them to easily penetrate the massive clouds of dust and gas in the Milky Way without being absorbed or scattered.",
                    "trivia": "The frequency of 1420 MHz (the hydrogen line) is considered the universal 'water hole' where alien civilizations might try to communicate.",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/6/6b/Arecibo_Observatory_Aerial_View.jpg"
                },
                "difficulty": 2,
                "type": "multiple-choice"
            },
            {
                "question": "What message did the Arecibo Observatory broadcast into space in 1974?",
                "options": [
                    {"content": "A map of the solar system and human DNA encoded in binary", "isCorrect": True},
                    {"content": "A music video", "isCorrect": False},
                    {"content": "A spoken greeting in 55 languages", "isCorrect": False},
                    {"content": "The works of Shakespeare", "isCorrect": False}
                ],
                "explanation": {
                    "text": "The Arecibo message was a simple visual message beamed into space, containing information about human DNA, the solar system, and humanity, written in binary code.",
                    "trivia": "It was aimed at the globular star cluster M13, which is 25,000 light-years away. It will take 25,000 years to get there!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/3/30/Arecibo_message.svg"
                },
                "difficulty": 2,
                "type": "multiple-choice"
            },
            {
                "question": "If we discover a microbial fossil on Mars, what would it prove?",
                "options": [
                    {"content": "That Mars currently has intelligent life", "isCorrect": False},
                    {"content": "That life can begin and evolve on planets other than Earth", "isCorrect": True},
                    {"content": "That humans came from Mars", "isCorrect": False},
                    {"content": "That Mars is exactly like Earth", "isCorrect": False}
                ],
                "explanation": {
                    "text": "Finding even simple microbial life elsewhere would be the greatest discovery in history, proving that biology is not unique to Earth and the universe may be teeming with life.",
                    "trivia": "NASA's Perseverance rover is currently collecting rock samples on Mars right now, hoping they might contain ancient microfossils!",
                    "mediaType": "image",
                    "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/f/fa/Martian_rover_Curiosity_using_ChemCam_M-100_focus_stacked_-_tight_crop.jpg"
                },
                "difficulty": 1,
                "type": "multiple-choice"
            }
        ]
    }
]

# Update the JSON
for quiz in new_quizzes + l8_to_l10:
    existing_idx = next((i for i, q in enumerate(data['quizzes']) if q['id'] == quiz['id']), None)
    if existing_idx is not None:
        data['quizzes'][existing_idx] = quiz
    else:
        data['quizzes'].append(quiz)

with open(file_path, 'w') as f:
    json.dump(data, f, indent=2)

print("Expanded Levels 6-10 successfully!")
