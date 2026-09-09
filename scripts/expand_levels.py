import json

file_path = '/Users/mohitchilkoti/Documents/projects/apprec8/data/space_olympiad_data.json'

with open(file_path, 'r') as f:
    data = json.load(f)

# Level 3: Galaxies and Stars
l3_questions = [
    {
        "question": "What type of galaxy is the Milky Way?",
        "options": [
            {"content": "Elliptical", "isCorrect": False},
            {"content": "Spiral", "isCorrect": True},
            {"content": "Irregular", "isCorrect": False},
            {"content": "Lenticular", "isCorrect": False}
        ],
        "explanation": {
            "text": "The Milky Way is a barred spiral galaxy, which means it has a central bar-shaped structure composed of stars, with spiral arms extending outward.",
            "trivia": "Our solar system is located in one of the Milky Way's spiral arms, called the Orion Arm.",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/0/09/Milky_Way_Galaxy.jpg"
        },
        "difficulty": 1,
        "type": "multiple-choice"
    },
    {
        "question": "What is the closest major galaxy to the Milky Way?",
        "options": [
            {"content": "Triangulum Galaxy", "isCorrect": False},
            {"content": "Andromeda Galaxy", "isCorrect": True},
            {"content": "Sombrero Galaxy", "isCorrect": False},
            {"content": "Whirlpool Galaxy", "isCorrect": False}
        ],
        "explanation": {
            "text": "The Andromeda Galaxy (M31) is the closest large spiral galaxy to our own.",
            "trivia": "Andromeda and the Milky Way are actually moving towards each other and are expected to collide in about 4.5 billion years!",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/9/98/Andromeda_Galaxy_%28with_h-alpha%29.jpg"
        },
        "difficulty": 1,
        "type": "multiple-choice"
    },
    {
        "question": "What is formed when a massive star collapses under its own gravity at the end of its life?",
        "options": [
            {"content": "White Dwarf", "isCorrect": False},
            {"content": "Red Giant", "isCorrect": False},
            {"content": "Black Hole", "isCorrect": True},
            {"content": "Protostar", "isCorrect": False}
        ],
        "explanation": {
            "text": "When extremely massive stars die in a supernova explosion, their core can collapse into a black hole—a region of space where gravity is so strong that not even light can escape.",
            "trivia": "The center of almost every large galaxy, including our own Milky Way, is believed to contain a supermassive black hole.",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/4/4f/Black_hole_-_Messier_87_crop_max_res.jpg"
        },
        "difficulty": 2,
        "type": "multiple-choice"
    },
    {
        "question": "What is a massive explosion that occurs at the end of a very large star's life called?",
        "options": [
            {"content": "Solar Flare", "isCorrect": False},
            {"content": "Supernova", "isCorrect": True},
            {"content": "Nebula", "isCorrect": False},
            {"content": "Pulsar", "isCorrect": False}
        ],
        "explanation": {
            "text": "A supernova is the explosion of a star. It is the largest explosion that takes place in space.",
            "trivia": "A supernova can briefly outshine an entire galaxy, emitting more energy than our sun will in its entire lifetime!",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/d/d4/Keplers_supernova.jpg"
        },
        "difficulty": 2,
        "type": "multiple-choice"
    },
    {
        "question": "What is a 'Nebula'?",
        "options": [
            {"content": "A giant cloud of dust and gas in space", "isCorrect": True},
            {"content": "A dead star", "isCorrect": False},
            {"content": "An icy comet", "isCorrect": False},
            {"content": "A group of planets", "isCorrect": False}
        ],
        "explanation": {
            "text": "A nebula is a giant cloud of dust and gas in space. Some nebulae come from the gas and dust thrown out by the explosion of a dying star, such as a supernova. Other nebulae are regions where new stars are beginning to form.",
            "trivia": "Because many stars are born in these clouds, nebulae are often called 'star nurseries.'",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b2/Eagle_nebula_pillars.jpg"
        },
        "difficulty": 1,
        "type": "multiple-choice"
    },
    {
        "question": "What color are the hottest stars in the universe?",
        "options": [
            {"content": "Red", "isCorrect": False},
            {"content": "Yellow", "isCorrect": False},
            {"content": "Blue", "isCorrect": True},
            {"content": "White", "isCorrect": False}
        ],
        "explanation": {
            "text": "Counterintuitively, blue stars are much hotter than red or yellow stars.",
            "trivia": "Just like a flame on Earth, the blue part of the fire is the hottest part!",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/1/10/Pleiades_large.jpg"
        },
        "difficulty": 2,
        "type": "multiple-choice"
    },
    {
        "question": "What is an exoplanet?",
        "options": [
            {"content": "A planet that has been destroyed", "isCorrect": False},
            {"content": "A planet outside our solar system", "isCorrect": True},
            {"content": "A dwarf planet", "isCorrect": False},
            {"content": "A rogue planet with no star", "isCorrect": False}
        ],
        "explanation": {
            "text": "An exoplanet is any planet beyond our solar system. Most orbit other stars, but free-floating exoplanets, called rogue planets, orbit the galactic center and are untethered to any star.",
            "trivia": "Scientists have discovered over 5,000 confirmed exoplanets so far!",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/6/6c/Exoplanet_Comparison.png"
        },
        "difficulty": 2,
        "type": "multiple-choice"
    },
    {
        "question": "Which star is famous for remaining almost perfectly stationary in the northern night sky?",
        "options": [
            {"content": "Sirius", "isCorrect": False},
            {"content": "Betelgeuse", "isCorrect": False},
            {"content": "Polaris (The North Star)", "isCorrect": True},
            {"content": "Vega", "isCorrect": False}
        ],
        "explanation": {
            "text": "Polaris is known as the North Star because it sits almost exactly above Earth's North Pole.",
            "trivia": "Because Earth's axis slowly wobbles over thousands of years, Polaris hasn't always been the North Star and won't always be in the future!",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/e/ee/Polaris_system.jpg"
        },
        "difficulty": 1,
        "type": "multiple-choice"
    },
    {
        "question": "What is the name of the brightest star in Earth's night sky?",
        "options": [
            {"content": "Polaris", "isCorrect": False},
            {"content": "Sirius", "isCorrect": True},
            {"content": "Proxima Centauri", "isCorrect": False},
            {"content": "Alpha Centauri", "isCorrect": False}
        ],
        "explanation": {
            "text": "Sirius, also known as the Dog Star, is the brightest star in the night sky.",
            "trivia": "Sirius is actually a binary star system, meaning it consists of two stars orbiting each other!",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/c/c6/Sirius_A_and_B_Hubble_photo.jpg"
        },
        "difficulty": 2,
        "type": "multiple-choice"
    },
    {
        "question": "What do we call a small, incredibly dense star that remains after a supernova explosion?",
        "options": [
            {"content": "Red Dwarf", "isCorrect": False},
            {"content": "Neutron Star", "isCorrect": True},
            {"content": "Brown Dwarf", "isCorrect": False},
            {"content": "Quasar", "isCorrect": False}
        ],
        "explanation": {
            "text": "A neutron star is the collapsed core of a massive supergiant star. They are the smallest and densest stars known to exist.",
            "trivia": "A teaspoon of neutron star material would weigh about 6 billion tons on Earth!",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/d/d4/Neutron_star_illustration.jpg"
        },
        "difficulty": 3,
        "type": "multiple-choice"
    },
    {
        "question": "What is a rapidly spinning neutron star that emits beams of electromagnetic radiation called?",
        "options": [
            {"content": "Quasar", "isCorrect": False},
            {"content": "Pulsar", "isCorrect": True},
            {"content": "Magnetar", "isCorrect": False},
            {"content": "Blazar", "isCorrect": False}
        ],
        "explanation": {
            "text": "A pulsar is a highly magnetized rotating neutron star that emits beams of radiation out of its magnetic poles.",
            "trivia": "If a pulsar's beam sweeps across Earth, we can detect it as regular, precise pulses of radio waves, like a cosmic lighthouse.",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/3/30/Pulsar_schematic.svg"
        },
        "difficulty": 3,
        "type": "multiple-choice"
    },
    {
        "question": "Which of these is the closest star system to our Solar System?",
        "options": [
            {"content": "Sirius", "isCorrect": False},
            {"content": "Alpha Centauri", "isCorrect": True},
            {"content": "Betelgeuse", "isCorrect": False},
            {"content": "The Pleiades", "isCorrect": False}
        ],
        "explanation": {
            "text": "Alpha Centauri is the closest star system to Earth, located about 4.37 light-years away.",
            "trivia": "It is actually a triple star system, consisting of Alpha Centauri A, Alpha Centauri B, and Proxima Centauri.",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/3/3f/Alpha_Centauri_system.jpg"
        },
        "difficulty": 2,
        "type": "multiple-choice"
    },
    {
        "question": "What is the term for a theoretical region in space where matter is falling into a black hole and getting incredibly hot?",
        "options": [
            {"content": "Accretion Disk", "isCorrect": True},
            {"content": "Event Horizon", "isCorrect": False},
            {"content": "Singularity", "isCorrect": False},
            {"content": "Photon Sphere", "isCorrect": False}
        ],
        "explanation": {
            "text": "An accretion disk is a structure formed by diffuse material in orbital motion around a massive central body, like a black hole.",
            "trivia": "Friction in the accretion disk heats the matter so much that it emits powerful X-rays, allowing us to 'see' where a black hole is!",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/e/ea/Black_Hole_Accretion_Disk.jpg"
        },
        "difficulty": 3,
        "type": "multiple-choice"
    },
    {
        "question": "What is the boundary around a black hole beyond which nothing, not even light, can escape?",
        "options": [
            {"content": "The Point of No Return", "isCorrect": False},
            {"content": "The Event Horizon", "isCorrect": True},
            {"content": "The Singularity", "isCorrect": False},
            {"content": "The Dark Zone", "isCorrect": False}
        ],
        "explanation": {
            "text": "The event horizon is the threshold around a black hole where the escape velocity surpasses the speed of light.",
            "trivia": "If you crossed the event horizon, you would never be able to send a message back out to the rest of the universe.",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/8/8c/Black_Hole_Event_Horizon.jpg"
        },
        "difficulty": 2,
        "type": "multiple-choice"
    },
    {
        "question": "What are groups of stars that form imaginary shapes or pictures in the sky called?",
        "options": [
            {"content": "Galaxies", "isCorrect": False},
            {"content": "Nebulae", "isCorrect": False},
            {"content": "Constellations", "isCorrect": True},
            {"content": "Asterisms", "isCorrect": False}
        ],
        "explanation": {
            "text": "A constellation is a recognizable pattern of stars in the night sky.",
            "trivia": "The International Astronomical Union officially recognizes 88 constellations that cover the entire northern and southern sky.",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/c/ce/Orion_constellation_map.svg"
        },
        "difficulty": 1,
        "type": "multiple-choice"
    }
]

# Level 4: Space Physics and Exploration
l4_questions = [
    {
        "question": "What was the name of the very first artificial satellite launched into space?",
        "options": [
            {"content": "Apollo 11", "isCorrect": False},
            {"content": "Sputnik 1", "isCorrect": True},
            {"content": "Explorer 1", "isCorrect": False},
            {"content": "Vostok 1", "isCorrect": False}
        ],
        "explanation": {
            "text": "Launched by the Soviet Union in 1957, Sputnik 1 was the first artificial Earth satellite.",
            "trivia": "Sputnik was about the size of a beach ball and took about 98 minutes to orbit Earth.",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/b/be/Sputnik_1.jpg"
        },
        "difficulty": 1,
        "type": "multiple-choice"
    },
    {
        "question": "What is the primary goal of India's historic Mangalyaan mission?",
        "options": [
            {"content": "To land on the Moon", "isCorrect": False},
            {"content": "To study the atmosphere and surface of Mars", "isCorrect": True},
            {"content": "To build a space station", "isCorrect": False},
            {"content": "To explore Jupiter's moons", "isCorrect": False}
        ],
        "explanation": {
            "text": "The Mars Orbiter Mission (Mangalyaan) was designed to orbit Mars and study its surface features, morphology, mineralogy, and atmosphere.",
            "trivia": "ISRO made history by successfully putting a spacecraft in Martian orbit on its very first attempt!",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/e/ee/Mars_Orbiter_Mission_-_Mangalyaan.jpg"
        },
        "difficulty": 2,
        "type": "multiple-choice"
    },
    {
        "question": "Which space telescope, launched in 1990, has taken some of the most famous deep-space photos in history?",
        "options": [
            {"content": "James Webb Space Telescope", "isCorrect": False},
            {"content": "Chandra X-ray Observatory", "isCorrect": False},
            {"content": "Hubble Space Telescope", "isCorrect": True},
            {"content": "Spitzer Space Telescope", "isCorrect": False}
        ],
        "explanation": {
            "text": "The Hubble Space Telescope orbits high above Earth's atmosphere, allowing it to take incredibly sharp and detailed images of distant galaxies.",
            "trivia": "Hubble has made more than 1.5 million observations during its lifetime!",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/3/3f/HST-SM4.jpeg"
        },
        "difficulty": 1,
        "type": "multiple-choice"
    },
    {
        "question": "Who was the first woman to travel into space?",
        "options": [
            {"content": "Sally Ride", "isCorrect": False},
            {"content": "Valentina Tereshkova", "isCorrect": True},
            {"content": "Mae Jemison", "isCorrect": False},
            {"content": "Kalpana Chawla", "isCorrect": False}
        ],
        "explanation": {
            "text": "Soviet cosmonaut Valentina Tereshkova became the first woman in space on June 16, 1963.",
            "trivia": "She orbited the Earth 48 times over almost three days during her solo mission.",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/e/ea/Valentina_Tereshkova_portrait.jpg"
        },
        "difficulty": 2,
        "type": "multiple-choice"
    },
    {
        "question": "Which fundamental force is responsible for keeping the planets in orbit around the Sun?",
        "options": [
            {"content": "Electromagnetism", "isCorrect": False},
            {"content": "The Strong Nuclear Force", "isCorrect": False},
            {"content": "The Weak Nuclear Force", "isCorrect": False},
            {"content": "Gravity", "isCorrect": True}
        ],
        "explanation": {
            "text": "Gravity is the attractive force that exists between all objects with mass. The Sun's massive gravity keeps all the planets tethered in orbit.",
            "trivia": "Gravity is actually the weakest of the four fundamental forces in physics, but it works over the longest distances!",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/5/53/Gravity_action-reaction.png"
        },
        "difficulty": 1,
        "type": "multiple-choice"
    },
    {
        "question": "According to Albert Einstein's Theory of General Relativity, gravity is actually the curving of what?",
        "options": [
            {"content": "Spacetime", "isCorrect": True},
            {"content": "Magnetic Fields", "isCorrect": False},
            {"content": "Dark Matter", "isCorrect": False},
            {"content": "Light waves", "isCorrect": False}
        ],
        "explanation": {
            "text": "Einstein showed that massive objects like stars and planets warp the fabric of 'spacetime' around them, and this curvature is what we feel as gravity.",
            "trivia": "Think of it like placing a heavy bowling ball on a trampoline—it bends the fabric down, causing smaller marbles to roll towards it.",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/2/22/Spacetime_curvature.png"
        },
        "difficulty": 3,
        "type": "multiple-choice"
    },
    {
        "question": "What happens to time as you get extremely close to a massive object with intense gravity, like a black hole?",
        "options": [
            {"content": "Time speeds up", "isCorrect": False},
            {"content": "Time slows down", "isCorrect": True},
            {"content": "Time stops completely instantly", "isCorrect": False},
            {"content": "Time goes backwards", "isCorrect": False}
        ],
        "explanation": {
            "text": "Because gravity warps spacetime, time actually passes slower in stronger gravitational fields. This is called 'gravitational time dilation'.",
            "trivia": "Even on Earth, time runs slightly faster for satellites orbiting high above the planet because they are further from Earth's gravity!",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/2/22/Spacetime_curvature.png"
        },
        "difficulty": 3,
        "type": "multiple-choice"
    },
    {
        "question": "What mysterious invisible substance makes up about 85% of the matter in the universe, holding galaxies together?",
        "options": [
            {"content": "Dark Energy", "isCorrect": False},
            {"content": "Dark Matter", "isCorrect": True},
            {"content": "Antimatter", "isCorrect": False},
            {"content": "Neutrinos", "isCorrect": False}
        ],
        "explanation": {
            "text": "Dark matter does not interact with light, making it completely invisible, but scientists know it exists because of its strong gravitational pull on galaxies.",
            "trivia": "Without dark matter, galaxies would spin apart because there isn't enough visible matter to generate the gravity needed to hold them together.",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/d/d4/Dark_matter_halo.jpg"
        },
        "difficulty": 3,
        "type": "multiple-choice"
    },
    {
        "question": "What is the speed of light in a vacuum?",
        "options": [
            {"content": "About 3,000 km per second", "isCorrect": False},
            {"content": "About 300,000 km per second", "isCorrect": True},
            {"content": "About 1 million km per second", "isCorrect": False},
            {"content": "Speed of light is infinite", "isCorrect": False}
        ],
        "explanation": {
            "text": "Light travels at an incredible speed of exactly 299,792,458 meters per second in a vacuum (roughly 300,000 km/s).",
            "trivia": "At this speed, you could travel around the Earth 7.5 times in just one second!",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/a/af/Light_dispersion_conceptual.jpg"
        },
        "difficulty": 2,
        "type": "multiple-choice"
    },
    {
        "question": "What is the mysterious force that is causing the expansion of the universe to accelerate?",
        "options": [
            {"content": "Dark Matter", "isCorrect": False},
            {"content": "Gravity", "isCorrect": False},
            {"content": "Dark Energy", "isCorrect": True},
            {"content": "Solar Wind", "isCorrect": False}
        ],
        "explanation": {
            "text": "Dark energy is a hypothetical form of energy that permeates all of space and tends to accelerate the expansion of the universe.",
            "trivia": "Dark energy makes up about 68% of the total energy density of the universe, but scientists still don't fully understand what it is!",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/a/ad/Cosmological_expansion.jpg"
        },
        "difficulty": 3,
        "type": "multiple-choice"
    },
    {
        "question": "Which space telescope was launched in 2021 as the scientific successor to Hubble, designed to view the universe in infrared?",
        "options": [
            {"content": "Kepler Space Telescope", "isCorrect": False},
            {"content": "James Webb Space Telescope", "isCorrect": True},
            {"content": "Spitzer Space Telescope", "isCorrect": False},
            {"content": "Chandra X-ray Observatory", "isCorrect": False}
        ],
        "explanation": {
            "text": "The James Webb Space Telescope (JWST) is the largest and most powerful space telescope ever built, specializing in infrared astronomy.",
            "trivia": "Its massive golden mirror is made up of 18 hexagonal segments that had to unfold in space!",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/4/41/James_Webb_Space_Telescope_model.jpg"
        },
        "difficulty": 2,
        "type": "multiple-choice"
    },
    {
        "question": "What was the name of the first human to walk on the Moon?",
        "options": [
            {"content": "Yuri Gagarin", "isCorrect": False},
            {"content": "Buzz Aldrin", "isCorrect": False},
            {"content": "Neil Armstrong", "isCorrect": True},
            {"content": "Michael Collins", "isCorrect": False}
        ],
        "explanation": {
            "text": "On July 20, 1969, American astronaut Neil Armstrong became the first person to step onto the lunar surface during the Apollo 11 mission.",
            "trivia": "His famous first words were: 'That's one small step for man, one giant leap for mankind.'",
            "mediaType": "video",
            "mediaUrl": "https://www.youtube.com/watch?v=RMINSD7MmT4"
        },
        "difficulty": 1,
        "type": "multiple-choice"
    },
    {
        "question": "Who was the first human to ever journey into outer space?",
        "options": [
            {"content": "Neil Armstrong", "isCorrect": False},
            {"content": "Alan Shepard", "isCorrect": False},
            {"content": "Yuri Gagarin", "isCorrect": True},
            {"content": "John Glenn", "isCorrect": False}
        ],
        "explanation": {
            "text": "Soviet cosmonaut Yuri Gagarin became the first human in space when his Vostok 1 spacecraft completed one orbit of the Earth on April 12, 1961.",
            "trivia": "Gagarin's entire historic flight lasted only 108 minutes from launch to landing.",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/e/ea/Yuri_Gagarin.jpg"
        },
        "difficulty": 2,
        "type": "multiple-choice"
    },
    {
        "question": "What is the name of the large, habitable artificial satellite continuously orbiting Earth, where international astronauts live and work?",
        "options": [
            {"content": "Mir", "isCorrect": False},
            {"content": "Skylab", "isCorrect": False},
            {"content": "The International Space Station (ISS)", "isCorrect": True},
            {"content": "Tiangong", "isCorrect": False}
        ],
        "explanation": {
            "text": "The ISS is a multinational collaborative project involving five participating space agencies: NASA, Roscosmos, JAXA, ESA, and CSA.",
            "trivia": "The ISS orbits Earth every 90 minutes, meaning the astronauts on board see 16 sunrises and sunsets every single day!",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/0/04/International_Space_Station_after_undocking_of_STS-132.jpg"
        },
        "difficulty": 1,
        "type": "multiple-choice"
    },
    {
        "question": "What phenomenon occurs when light from a distant galaxy is stretched towards the red end of the spectrum because it is moving away from us?",
        "options": [
            {"content": "Blueshift", "isCorrect": False},
            {"content": "Redshift", "isCorrect": True},
            {"content": "The Doppler Effect", "isCorrect": False},
            {"content": "Cosmic Microwave Background", "isCorrect": False}
        ],
        "explanation": {
            "text": "As the universe expands, galaxies move away from us. This stretches the light they emit into longer, redder wavelengths, a phenomenon known as cosmological redshift.",
            "trivia": "Edwin Hubble used redshift to prove that the universe is actively expanding, forever changing our understanding of the cosmos.",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/c/c5/Redshift_blueshift.svg"
        },
        "difficulty": 3,
        "type": "multiple-choice"
    }
]

# Level 5: Planetary Facts
l5_questions = [
    {
        "question": "Which planet is known to have the most extreme seasons in the solar system because of its 98-degree tilt?",
        "options": [
            {"content": "Earth", "isCorrect": False},
            {"content": "Mars", "isCorrect": False},
            {"content": "Uranus", "isCorrect": True},
            {"content": "Venus", "isCorrect": False}
        ],
        "explanation": {
            "text": "Because Uranus is tilted almost completely on its side, its north pole points almost directly at the Sun for a quarter of its orbit (21 Earth years).",
            "trivia": "This means a single season on Uranus lasts for 21 Earth years of continuous sunlight or continuous darkness!",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg"
        },
        "difficulty": 2,
        "type": "multiple-choice"
    },
    {
        "question": "Which planet has a giant storm called the 'Great Red Spot' that has been raging for hundreds of years?",
        "options": [
            {"content": "Mars", "isCorrect": False},
            {"content": "Jupiter", "isCorrect": True},
            {"content": "Saturn", "isCorrect": False},
            {"content": "Neptune", "isCorrect": False}
        ],
        "explanation": {
            "text": "Jupiter's Great Red Spot is a massive high-pressure storm in its atmosphere.",
            "trivia": "The storm is so large that you could fit the entire Earth inside it with room to spare!",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg"
        },
        "difficulty": 1,
        "type": "multiple-choice"
    },
    {
        "question": "Which planet is the least dense in the solar system, so light that it could float in a giant bathtub of water?",
        "options": [
            {"content": "Saturn", "isCorrect": True},
            {"content": "Uranus", "isCorrect": False},
            {"content": "Jupiter", "isCorrect": False},
            {"content": "Neptune", "isCorrect": False}
        ],
        "explanation": {
            "text": "Saturn is a gas giant primarily made of hydrogen and helium. Its overall density is actually lower than the density of liquid water.",
            "trivia": "Despite being massive, Saturn is the only planet in the solar system with a density less than water.",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg"
        },
        "difficulty": 2,
        "type": "multiple-choice"
    },
    {
        "question": "Which planet is covered in thick clouds of sulfuric acid, making its surface completely invisible from space?",
        "options": [
            {"content": "Neptune", "isCorrect": False},
            {"content": "Jupiter", "isCorrect": False},
            {"content": "Venus", "isCorrect": True},
            {"content": "Uranus", "isCorrect": False}
        ],
        "explanation": {
            "text": "Venus is shrouded in a highly reflective, thick cloud layer made mostly of sulfuric acid droplets.",
            "trivia": "These clouds reflect so much sunlight that they are the reason Venus is the brightest natural object in Earth's night sky after the Moon.",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a9/PIA23791-Venus-NewlyProcessedView-20200608.jpg"
        },
        "difficulty": 2,
        "type": "multiple-choice"
    },
    {
        "question": "What gives the planet Mars its reddish appearance?",
        "options": [
            {"content": "Red clouds of gas", "isCorrect": False},
            {"content": "Lava flows", "isCorrect": False},
            {"content": "Iron oxide (rust) in the soil", "isCorrect": True},
            {"content": "Red vegetation", "isCorrect": False}
        ],
        "explanation": {
            "text": "The surface of Mars is covered in iron oxide, the exact same compound that gives blood and rust their red color.",
            "trivia": "Because of this rusty dust, the sky on Mars often has a yellowish-brown or pinkish hue, unlike Earth's blue sky.",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg"
        },
        "difficulty": 1,
        "type": "multiple-choice"
    },
    {
        "question": "Which planet has the fastest winds in the solar system, reaching up to 1,200 miles per hour?",
        "options": [
            {"content": "Jupiter", "isCorrect": False},
            {"content": "Saturn", "isCorrect": False},
            {"content": "Neptune", "isCorrect": True},
            {"content": "Uranus", "isCorrect": False}
        ],
        "explanation": {
            "text": "Despite being the farthest planet from the Sun and receiving very little solar heat, Neptune has the most extreme winds, whipping clouds of frozen methane across the planet at supersonic speeds.",
            "trivia": "Scientists still aren't exactly sure what drives these incredibly powerful winds on such a cold, distant planet.",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/5/56/Neptune_Full.jpg"
        },
        "difficulty": 3,
        "type": "multiple-choice"
    },
    {
        "question": "Which two planets in our solar system do not have any moons?",
        "options": [
            {"content": "Mercury and Venus", "isCorrect": True},
            {"content": "Venus and Earth", "isCorrect": False},
            {"content": "Mars and Jupiter", "isCorrect": False},
            {"content": "Uranus and Neptune", "isCorrect": False}
        ],
        "explanation": {
            "text": "Mercury and Venus are the only two major planets in our solar system without any natural satellites.",
            "trivia": "Any moon placed too close to the Sun (like around Mercury or Venus) would likely be pulled in and destroyed by the Sun's immense gravity.",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/3/3f/Mercury_and_Venus.png"
        },
        "difficulty": 2,
        "type": "multiple-choice"
    },
    {
        "question": "Which planet has a hexagonal-shaped storm at its north pole?",
        "options": [
            {"content": "Jupiter", "isCorrect": False},
            {"content": "Saturn", "isCorrect": True},
            {"content": "Uranus", "isCorrect": False},
            {"content": "Neptune", "isCorrect": False}
        ],
        "explanation": {
            "text": "Saturn has a bizarre, persisting hexagonal cloud pattern located around its north pole.",
            "trivia": "The hexagon is massive—each of its six sides is wider than the entire Earth!",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/a/af/Saturn_Hexagon.jpg"
        },
        "difficulty": 3,
        "type": "multiple-choice"
    },
    {
        "question": "On which planet does it theoretically 'rain diamonds' due to extreme heat and pressure?",
        "options": [
            {"content": "Neptune and Uranus", "isCorrect": True},
            {"content": "Jupiter and Saturn", "isCorrect": False},
            {"content": "Venus and Mars", "isCorrect": False},
            {"content": "Earth and Venus", "isCorrect": False}
        ],
        "explanation": {
            "text": "Deep inside the ice giants Neptune and Uranus, extreme pressure condenses carbon atoms into diamonds that slowly sink towards the planetary core.",
            "trivia": "Scientists have actually recreated these extreme conditions in labs on Earth to prove that diamond rain is possible!",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/5/56/Neptune_Full.jpg"
        },
        "difficulty": 3,
        "type": "multiple-choice"
    },
    {
        "question": "Which planet experiences extreme temperature fluctuations, dropping to -290°F at night and soaring to 800°F during the day?",
        "options": [
            {"content": "Venus", "isCorrect": False},
            {"content": "Mercury", "isCorrect": True},
            {"content": "Mars", "isCorrect": False},
            {"content": "Earth", "isCorrect": False}
        ],
        "explanation": {
            "text": "Because Mercury has almost no atmosphere to trap heat, it loses all its heat into space at night, resulting in the most extreme temperature changes in the solar system.",
            "trivia": "Despite being closest to the Sun, scientists have found water ice hiding in deep craters at Mercury's poles where the sun never shines!",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/4/4a/Mercury_in_true_color.jpg"
        },
        "difficulty": 2,
        "type": "multiple-choice"
    },
    {
        "question": "What is the name of the largest dwarf planet located in the Kuiper Belt?",
        "options": [
            {"content": "Ceres", "isCorrect": False},
            {"content": "Eris", "isCorrect": False},
            {"content": "Pluto", "isCorrect": True},
            {"content": "Haumea", "isCorrect": False}
        ],
        "explanation": {
            "text": "Pluto is the largest known object in the Kuiper Belt, a region of icy bodies beyond Neptune.",
            "trivia": "Pluto actually has a heart-shaped glacier on its surface made of frozen nitrogen and carbon monoxide!",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/e/ef/Pluto_in_True_Color_-_High-Res.jpg"
        },
        "difficulty": 2,
        "type": "multiple-choice"
    },
    {
        "question": "Which planet's magnetic field is so powerful that it creates intense radiation belts that can fry unshielded spacecraft?",
        "options": [
            {"content": "Earth", "isCorrect": False},
            {"content": "Jupiter", "isCorrect": True},
            {"content": "Saturn", "isCorrect": False},
            {"content": "Venus", "isCorrect": False}
        ],
        "explanation": {
            "text": "Jupiter has an incredibly powerful magnetic field, roughly 20,000 times stronger than Earth's, which traps high-energy particles in intense radiation belts.",
            "trivia": "The Juno spacecraft currently orbiting Jupiter is built like an armored tank to survive this radiation!",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg"
        },
        "difficulty": 3,
        "type": "multiple-choice"
    },
    {
        "question": "What makes Earth unique compared to all other planets in our solar system?",
        "options": [
            {"content": "It has an atmosphere", "isCorrect": False},
            {"content": "It has liquid water on its surface", "isCorrect": True},
            {"content": "It has a moon", "isCorrect": False},
            {"content": "It has a rocky surface", "isCorrect": False}
        ],
        "explanation": {
            "text": "While other places in the solar system might have oceans trapped beneath miles of ice, Earth is the only planet known to have stable bodies of liquid water on its surface.",
            "trivia": "About 71% of Earth's surface is covered in water, which is essential for all life as we know it.",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg"
        },
        "difficulty": 1,
        "type": "multiple-choice"
    },
    {
        "question": "Which planet is famous for having a large, dark spot in its atmosphere similar to Jupiter's Great Red Spot (though it disappeared later)?",
        "options": [
            {"content": "Uranus", "isCorrect": False},
            {"content": "Neptune", "isCorrect": True},
            {"content": "Saturn", "isCorrect": False},
            {"content": "Venus", "isCorrect": False}
        ],
        "explanation": {
            "text": "When the Voyager 2 spacecraft flew by Neptune in 1989, it observed a massive storm called the 'Great Dark Spot.'",
            "trivia": "Unlike Jupiter's red spot, Neptune's dark spots seem to appear and disappear over a few years, rather than lasting for centuries.",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/5/56/Neptune_Full.jpg"
        },
        "difficulty": 2,
        "type": "multiple-choice"
    },
    {
        "question": "Which planet has a 'day' that is longer than its 'year'?",
        "options": [
            {"content": "Mercury", "isCorrect": False},
            {"content": "Venus", "isCorrect": True},
            {"content": "Mars", "isCorrect": False},
            {"content": "Uranus", "isCorrect": False}
        ],
        "explanation": {
            "text": "Venus rotates very slowly on its axis. It takes Venus 243 Earth days to complete one rotation, but only 225 Earth days to orbit the Sun!",
            "trivia": "Because Venus rotates backwards, if you could see the Sun through the thick clouds, it would rise in the west and set in the east.",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/8/85/Venus_globe.jpg"
        },
        "difficulty": 2,
        "type": "multiple-choice"
    }
]

# Update the JSON
for quiz in data['quizzes']:
    if quiz['id'] == 'space-level-3':
        quiz['questions'] = l3_questions
    elif quiz['id'] == 'space-level-4':
        quiz['questions'] = l4_questions
    elif quiz['id'] == 'space-level-5':
        quiz['questions'] = l5_questions

with open(file_path, 'w') as f:
    json.dump(data, f, indent=2)

print("Expanded Levels 3, 4, and 5 successfully!")
