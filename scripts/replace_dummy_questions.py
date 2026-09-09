import json

file_path = '/Users/mohitchilkoti/Documents/projects/apprec8/data/space_olympiad_data.json'

with open(file_path, 'r') as f:
    data = json.load(f)

real_questions_l1 = [
    {
        "question": "Which planet is the hottest in our solar system?",
        "options": [
            {"content": "Mercury", "isCorrect": False},
            {"content": "Venus", "isCorrect": True},
            {"content": "Mars", "isCorrect": False},
            {"content": "Jupiter", "isCorrect": False}
        ],
        "explanation": {
            "text": "Even though Mercury is closer to the Sun, Venus is hotter because its thick atmosphere traps heat like a giant greenhouse.",
            "trivia": "Temperatures on Venus can reach up to 900 degrees Fahrenheit (475 degrees Celsius)!",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e5/Venus-real_color.jpg"
        },
        "difficulty": 2,
        "type": "multiple-choice"
    },
    {
        "question": "Which planet spins almost completely on its side?",
        "options": [
            {"content": "Uranus", "isCorrect": True},
            {"content": "Venus", "isCorrect": False},
            {"content": "Saturn", "isCorrect": False},
            {"content": "Neptune", "isCorrect": False}
        ],
        "explanation": {
            "text": "Uranus is unique because its axis is tilted by 98 degrees, making it look like a rolling ball as it orbits the Sun.",
            "trivia": "Scientists believe a giant collision with an Earth-sized object long ago may have knocked Uranus on its side.",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg"
        },
        "difficulty": 2,
        "type": "multiple-choice"
    },
    {
        "question": "Which is the farthest official planet from the Sun?",
        "options": [
            {"content": "Pluto", "isCorrect": False},
            {"content": "Uranus", "isCorrect": False},
            {"content": "Neptune", "isCorrect": True},
            {"content": "Saturn", "isCorrect": False}
        ],
        "explanation": {
            "text": "Since Pluto was reclassified as a dwarf planet, Neptune is the farthest official planet in our solar system.",
            "trivia": "A single year on Neptune takes 165 Earth years!",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/5/56/Neptune_Full.jpg"
        },
        "difficulty": 1,
        "type": "multiple-choice"
    },
    {
        "question": "Which planet is famous for having the most spectacular, bright ring system?",
        "options": [
            {"content": "Jupiter", "isCorrect": False},
            {"content": "Uranus", "isCorrect": False},
            {"content": "Saturn", "isCorrect": True},
            {"content": "Mars", "isCorrect": False}
        ],
        "explanation": {
            "text": "Saturn's rings are made up of billions of pieces of ice, dust, and rock, ranging from tiny grains to giant chunks.",
            "trivia": "Jupiter, Uranus, and Neptune also have rings, but they are very faint and hard to see.",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg"
        },
        "difficulty": 1,
        "type": "multiple-choice"
    },
    {
        "question": "What is the name of the largest volcano in the solar system, located on Mars?",
        "options": [
            {"content": "Mount Everest", "isCorrect": False},
            {"content": "Mauna Kea", "isCorrect": False},
            {"content": "Olympus Mons", "isCorrect": True},
            {"content": "Elysium Mons", "isCorrect": False}
        ],
        "explanation": {
            "text": "Olympus Mons is a massive shield volcano on Mars.",
            "trivia": "It is nearly three times taller than Mount Everest!",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/2/23/Olympus_Mons_alt.jpg"
        },
        "difficulty": 2,
        "type": "multiple-choice"
    },
    {
        "question": "What is the continuous stream of charged particles flowing out from the Sun called?",
        "options": [
            {"content": "Solar Flare", "isCorrect": False},
            {"content": "Solar Wind", "isCorrect": True},
            {"content": "Coronal Mass Ejection", "isCorrect": False},
            {"content": "Sunspots", "isCorrect": False}
        ],
        "explanation": {
            "text": "The solar wind is a stream of energized, charged particles, primarily electrons and protons, flowing outward from the Sun.",
            "trivia": "The solar wind shapes the magnetic fields of planets and creates beautiful auroras when it interacts with Earth's atmosphere.",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/6/67/Solar_wind.jpg"
        },
        "difficulty": 2,
        "type": "multiple-choice"
    },
    {
        "question": "What do we call the bubble-like region of space dominated by the Sun's magnetic field and solar wind?",
        "options": [
            {"content": "The Atmosphere", "isCorrect": False},
            {"content": "The Heliosphere", "isCorrect": True},
            {"content": "The Oort Cloud", "isCorrect": False},
            {"content": "The Magnetosphere", "isCorrect": False}
        ],
        "explanation": {
            "text": "The heliosphere acts as a protective shield for our solar system, blocking much of the harmful cosmic radiation from interstellar space.",
            "trivia": "The Voyager 1 and 2 spacecraft have officially crossed the boundary of the heliosphere and are now in interstellar space!",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/6/69/Heliosphere_diagram.jpg"
        },
        "difficulty": 3,
        "type": "multiple-choice"
    },
    {
        "question": "What is a 'Light Year'?",
        "options": [
            {"content": "The time it takes light to travel to the Sun", "isCorrect": False},
            {"content": "The speed of light in a vacuum", "isCorrect": False},
            {"content": "The distance light travels in one Earth year", "isCorrect": True},
            {"content": "A year with 366 days", "isCorrect": False}
        ],
        "explanation": {
            "text": "A light-year is a unit of distance, not time. It's how far light can travel in one Earth year.",
            "trivia": "One light-year is about 5.88 trillion miles (9.46 trillion kilometers)!",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e1/FullMoon2010.jpg"
        },
        "difficulty": 1,
        "type": "multiple-choice"
    },
    {
        "question": "Which of these is a dwarf planet located in the main asteroid belt?",
        "options": [
            {"content": "Pluto", "isCorrect": False},
            {"content": "Makemake", "isCorrect": False},
            {"content": "Ceres", "isCorrect": True},
            {"content": "Eris", "isCorrect": False}
        ],
        "explanation": {
            "text": "Ceres is the largest object in the asteroid belt between Mars and Jupiter and the only dwarf planet in the inner solar system.",
            "trivia": "Ceres contains so much water ice that scientists think it may have an ocean beneath its surface.",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/7/76/Ceres_-_RC3_-_Haulani_Crater_%2822381131691%29_%28cropped%29.jpg"
        },
        "difficulty": 2,
        "type": "multiple-choice"
    },
    {
        "question": "Which human-made spacecraft is currently the farthest from Earth?",
        "options": [
            {"content": "Apollo 11", "isCorrect": False},
            {"content": "New Horizons", "isCorrect": False},
            {"content": "Hubble Space Telescope", "isCorrect": False},
            {"content": "Voyager 1", "isCorrect": True}
        ],
        "explanation": {
            "text": "Launched in 1977, Voyager 1 is the most distant human-made object and the first spacecraft to enter interstellar space.",
            "trivia": "Voyager 1 carries a 'Golden Record' containing sounds and images from Earth, just in case aliens ever find it!",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/d/d2/Voyager_spacecraft_model.png"
        },
        "difficulty": 2,
        "type": "multiple-choice"
    },
    {
        "question": "Which planet has the shortest day, spinning on its axis in just under 10 hours?",
        "options": [
            {"content": "Jupiter", "isCorrect": True},
            {"content": "Mercury", "isCorrect": False},
            {"content": "Earth", "isCorrect": False},
            {"content": "Saturn", "isCorrect": False}
        ],
        "explanation": {
            "text": "Despite being the largest planet, Jupiter spins incredibly fast, giving it the shortest day in the solar system.",
            "trivia": "Because it spins so quickly, Jupiter bulges out at its equator and is slightly squashed at its poles.",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg"
        },
        "difficulty": 2,
        "type": "multiple-choice"
    },
    {
        "question": "What is Valles Marineris?",
        "options": [
            {"content": "A giant crater on the Moon", "isCorrect": False},
            {"content": "A massive canyon system on Mars", "isCorrect": True},
            {"content": "An ocean on Venus", "isCorrect": False},
            {"content": "A mountain on Mercury", "isCorrect": False}
        ],
        "explanation": {
            "text": "Valles Marineris is a vast canyon system that runs along the Martian equator.",
            "trivia": "It is over 4,000 km long and up to 7 km deep, making the Grand Canyon look tiny in comparison!",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/6/6c/Valles_Marineris_on_Mars.jpg"
        },
        "difficulty": 3,
        "type": "multiple-choice"
    },
    {
        "question": "Which planet rotates backwards compared to most other planets?",
        "options": [
            {"content": "Mars", "isCorrect": False},
            {"content": "Jupiter", "isCorrect": False},
            {"content": "Venus", "isCorrect": True},
            {"content": "Neptune", "isCorrect": False}
        ],
        "explanation": {
            "text": "Venus has 'retrograde rotation,' meaning it spins backwards. On Venus, the Sun rises in the west and sets in the east!",
            "trivia": "A day on Venus (one rotation) takes longer than its year (orbit around the Sun).",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/8/85/Venus_globe.jpg"
        },
        "difficulty": 2,
        "type": "multiple-choice"
    },
    {
        "question": "What is the theoretical spherical shell of icy objects at the very outer edge of our solar system called?",
        "options": [
            {"content": "The Kuiper Belt", "isCorrect": False},
            {"content": "The Asteroid Belt", "isCorrect": False},
            {"content": "The Oort Cloud", "isCorrect": True},
            {"content": "The Heliosphere", "isCorrect": False}
        ],
        "explanation": {
            "text": "The Oort Cloud is believed to be a giant spherical shell surrounding the solar system, filled with icy pieces of space debris.",
            "trivia": "It is considered the origin of most long-period comets that occasionally visit the inner solar system.",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e4/Oort_cloud.png"
        },
        "difficulty": 3,
        "type": "multiple-choice"
    },
    {
        "question": "What are comets primarily made of?",
        "options": [
            {"content": "Solid iron and nickel", "isCorrect": False},
            {"content": "Hot gases like the Sun", "isCorrect": False},
            {"content": "Ice, dust, and rocky material", "isCorrect": True},
            {"content": "Liquid water", "isCorrect": False}
        ],
        "explanation": {
            "text": "Comets are often described as 'dirty snowballs' because they are composed of frozen gases, rock, and dust.",
            "trivia": "As a comet gets closer to the Sun, the ice turns to gas, creating a glowing tail that can stretch for millions of miles.",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/d/df/Comet_NEOWISE_July_18_2020.jpg"
        },
        "difficulty": 1,
        "type": "multiple-choice"
    }
]

real_questions_l2 = [
    {
        "question": "What happens during a Solar Eclipse?",
        "options": [
            {"content": "The Earth blocks the Sun", "isCorrect": False},
            {"content": "The Moon moves between Earth and the Sun", "isCorrect": True},
            {"content": "The Sun goes behind a cloud", "isCorrect": False},
            {"content": "The stars align", "isCorrect": False}
        ],
        "explanation": {
            "text": "During a solar eclipse, the Moon passes exactly between the Earth and the Sun, blocking out the Sun's light.",
            "trivia": "A total solar eclipse is only visible from a narrow path on Earth, making it a very rare sight for any specific location.",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/c/c3/Solar_eclipse_1999_4_NR.jpg"
        },
        "difficulty": 1,
        "type": "multiple-choice"
    },
    {
        "question": "What causes a Lunar Eclipse?",
        "options": [
            {"content": "Mars passes in front of the Moon", "isCorrect": False},
            {"content": "Earth's shadow falls on the Moon", "isCorrect": True},
            {"content": "The Sun blocks the Moon", "isCorrect": False},
            {"content": "The Moon turns off its light", "isCorrect": False}
        ],
        "explanation": {
            "text": "A lunar eclipse happens when Earth passes exactly between the Sun and the Moon, casting its shadow across the lunar surface.",
            "trivia": "During a total lunar eclipse, the Moon often turns a deep reddish color because Earth's atmosphere bends sunlight onto it.",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/9/90/Lunar_eclipse_April_15_2014_California_by_Alfredo_Garcia_Jr.jpg"
        },
        "difficulty": 1,
        "type": "multiple-choice"
    },
    {
        "question": "Which of Jupiter's moons is the largest moon in the entire solar system?",
        "options": [
            {"content": "Europa", "isCorrect": False},
            {"content": "Io", "isCorrect": False},
            {"content": "Ganymede", "isCorrect": True},
            {"content": "Callisto", "isCorrect": False}
        ],
        "explanation": {
            "text": "Ganymede is absolutely massive. It is the only moon in our solar system that is larger than the planet Mercury!",
            "trivia": "Ganymede is also the only moon known to have its own magnetic field.",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b5/Ganymede%2C_moon_of_Jupiter%2C_NASA.jpg"
        },
        "difficulty": 2,
        "type": "multiple-choice"
    },
    {
        "question": "Which moon of Jupiter is famous for its hundreds of erupting volcanoes?",
        "options": [
            {"content": "Io", "isCorrect": True},
            {"content": "Europa", "isCorrect": False},
            {"content": "Titan", "isCorrect": False},
            {"content": "Phobos", "isCorrect": False}
        ],
        "explanation": {
            "text": "Io is the most volcanically active body in our solar system, completely covered in sulfur and volcanic pits.",
            "trivia": "The immense gravitational tug-of-war between Jupiter and the other moons constantly squishes and stretches Io, heating up its insides and causing the volcanoes.",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/4/4e/Io_highest_resolution_true_color.jpg"
        },
        "difficulty": 2,
        "type": "multiple-choice"
    },
    {
        "question": "Which moon of Saturn has a thick atmosphere and lakes of liquid methane?",
        "options": [
            {"content": "Enceladus", "isCorrect": False},
            {"content": "Titan", "isCorrect": True},
            {"content": "Triton", "isCorrect": False},
            {"content": "Europa", "isCorrect": False}
        ],
        "explanation": {
            "text": "Titan is the only moon in our solar system with a dense atmosphere. It has clouds, rain, rivers, and lakes, but they are made of liquid methane and ethane, not water!",
            "trivia": "In 2005, the Huygens probe actually landed on the surface of Titan, providing our first look beneath its thick orange clouds.",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/0/07/Titan_in_true_color.jpg"
        },
        "difficulty": 2,
        "type": "multiple-choice"
    },
    {
        "question": "What are the names of Mars' two small moons?",
        "options": [
            {"content": "Titan and Rhea", "isCorrect": False},
            {"content": "Io and Europa", "isCorrect": False},
            {"content": "Phobos and Deimos", "isCorrect": True},
            {"content": "Miranda and Ariel", "isCorrect": False}
        ],
        "explanation": {
            "text": "Mars has two tiny, potato-shaped moons named Phobos and Deimos.",
            "trivia": "Scientists believe these moons might actually be asteroids that got captured by Mars' gravity a long time ago.",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/5/5c/Phobos_and_Deimos.jpg"
        },
        "difficulty": 1,
        "type": "multiple-choice"
    },
    {
        "question": "What is the primary cause of ocean tides on Earth?",
        "options": [
            {"content": "Wind from strong storms", "isCorrect": False},
            {"content": "The gravitational pull of the Moon", "isCorrect": True},
            {"content": "The rotation of the Earth", "isCorrect": False},
            {"content": "Ocean currents", "isCorrect": False}
        ],
        "explanation": {
            "text": "The Moon's gravity pulls on Earth's oceans, creating a bulge of water. This causes the high and low tides we experience.",
            "trivia": "The Sun's gravity also affects the tides! When the Sun, Earth, and Moon line up, we get extra high 'spring tides.'",
            "mediaType": "video",
            "mediaUrl": "https://www.youtube.com/watch?v=3R-iwOnKgjc"
        },
        "difficulty": 1,
        "type": "multiple-choice"
    },
    {
        "question": "Why does the Moon appear to change shape (phases) over the course of a month?",
        "options": [
            {"content": "The Earth casts a moving shadow on it", "isCorrect": False},
            {"content": "Clouds in space block our view", "isCorrect": False},
            {"content": "We see different amounts of its sunlit side as it orbits Earth", "isCorrect": True},
            {"content": "The Moon actually changes physical shape", "isCorrect": False}
        ],
        "explanation": {
            "text": "Half of the Moon is always lit by the Sun. As the Moon orbits Earth, our viewing angle changes, so we see different fractions of its lit half.",
            "trivia": "It takes about 29.5 days for the Moon to go through a complete cycle of phases.",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a2/Moon_phases_en.jpg"
        },
        "difficulty": 1,
        "type": "multiple-choice"
    },
    {
        "question": "What do we call a 'Supermoon'?",
        "options": [
            {"content": "A Full Moon that occurs when the Moon is closest to Earth", "isCorrect": True},
            {"content": "A Moon that emits its own light", "isCorrect": False},
            {"content": "A Moon that has a colorful ring around it", "isCorrect": False},
            {"content": "The second Full Moon in a single calendar month", "isCorrect": False}
        ],
        "explanation": {
            "text": "The Moon's orbit isn't a perfect circle. A 'Supermoon' happens when a Full Moon coincides with perigee\u2014the point in its orbit closest to Earth.",
            "trivia": "A Supermoon can appear up to 14% larger and 30% brighter than a normal Full Moon!",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e1/FullMoon2010.jpg"
        },
        "difficulty": 2,
        "type": "multiple-choice"
    },
    {
        "question": "During an eclipse, what is the 'Umbra'?",
        "options": [
            {"content": "The glowing outer edge of the Sun", "isCorrect": False},
            {"content": "The darkest, central part of the shadow", "isCorrect": True},
            {"content": "The lighter, outer part of the shadow", "isCorrect": False},
            {"content": "A special telescope used to view the eclipse", "isCorrect": False}
        ],
        "explanation": {
            "text": "The umbra is the fully shaded inner region of a shadow. If you are standing in the umbra during a solar eclipse, you will experience a total eclipse.",
            "trivia": "The lighter, partial outer shadow is called the 'penumbra'.",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/4/41/Geometry_of_a_Lunar_Eclipse.svg"
        },
        "difficulty": 3,
        "type": "multiple-choice"
    },
    {
        "question": "Which moon of Saturn is famous for shooting massive geysers of water ice into space?",
        "options": [
            {"content": "Enceladus", "isCorrect": True},
            {"content": "Titan", "isCorrect": False},
            {"content": "Mimas", "isCorrect": False},
            {"content": "Rhea", "isCorrect": False}
        ],
        "explanation": {
            "text": "Enceladus has a global ocean of liquid water beneath its icy crust. Deep cracks at its south pole spray plumes of water and ice into space.",
            "trivia": "These icy plumes actually create one of Saturn's outer rings (the E ring)!",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/8/87/Enceladus_geysers_PIA07799.jpg"
        },
        "difficulty": 3,
        "type": "multiple-choice"
    },
    {
        "question": "What is an 'Annular Solar Eclipse'?",
        "options": [
            {"content": "An eclipse that happens every year", "isCorrect": False},
            {"content": "When the Moon covers only the edges of the Sun", "isCorrect": False},
            {"content": "When the Moon is too far away to completely cover the Sun, creating a 'ring of fire'", "isCorrect": True},
            {"content": "An eclipse that only happens at night", "isCorrect": False}
        ],
        "explanation": {
            "text": "Because the Moon's distance from Earth varies, sometimes it is slightly farther away during an eclipse. It can't cover the entire Sun, leaving a glowing 'ring of fire.'",
            "trivia": "The word 'annular' comes from the Latin word 'annulus', which means 'ring'.",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Annular_Eclipse._Taken_from_Middlegate%2C_Nevada_on_May_20%2C_2012.jpg"
        },
        "difficulty": 2,
        "type": "multiple-choice"
    },
    {
        "question": "Why don't we have a solar eclipse every single month during the New Moon phase?",
        "options": [
            {"content": "The Moon moves too fast", "isCorrect": False},
            {"content": "The Moon's orbit is tilted relative to Earth's orbit", "isCorrect": True},
            {"content": "The Earth's atmosphere bends the light", "isCorrect": False},
            {"content": "Eclipses can only happen in winter", "isCorrect": False}
        ],
        "explanation": {
            "text": "The Moon's orbit is tilted by about 5 degrees compared to Earth's orbit around the Sun. Most months, the Moon's shadow misses Earth entirely.",
            "trivia": "Eclipses only happen during 'eclipse seasons,' which occur about twice a year when the orbits align perfectly.",
            "mediaType": "video",
            "mediaUrl": "https://www.youtube.com/watch?v=kYjY-W12NlQ"
        },
        "difficulty": 3,
        "type": "multiple-choice"
    },
    {
        "question": "Which large moon of Neptune has a retrograde orbit, meaning it orbits in the opposite direction of the planet's rotation?",
        "options": [
            {"content": "Triton", "isCorrect": True},
            {"content": "Proteus", "isCorrect": False},
            {"content": "Nereid", "isCorrect": False},
            {"content": "Charon", "isCorrect": False}
        ],
        "explanation": {
            "text": "Triton is unique among large moons because of its retrograde orbit. This suggests it was likely a dwarf planet captured by Neptune's gravity.",
            "trivia": "Triton is one of the coldest objects in the solar system, with geysers that erupt liquid nitrogen!",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a6/Triton_moon_mosaic_Voyager_2_%28large%29.jpg"
        },
        "difficulty": 3,
        "type": "multiple-choice"
    },
    {
        "question": "What is sometimes called a 'Blood Moon'?",
        "options": [
            {"content": "A Total Lunar Eclipse", "isCorrect": True},
            {"content": "A Moon that occurs on Halloween", "isCorrect": False},
            {"content": "A Mars eclipse", "isCorrect": False},
            {"content": "A Moon that emits red light", "isCorrect": False}
        ],
        "explanation": {
            "text": "During a total lunar eclipse, the Earth completely blocks direct sunlight from hitting the Moon. However, sunlight passes through Earth's atmosphere, which filters out blue light and bends red light onto the Moon.",
            "trivia": "If you were standing on the Moon during a Lunar Eclipse, you would see a bright red ring around the Earth—every sunrise and sunset in the world happening at once!",
            "mediaType": "image",
            "mediaUrl": "https://upload.wikimedia.org/wikipedia/commons/9/90/Lunar_eclipse_April_15_2014_California_by_Alfredo_Garcia_Jr.jpg"
        },
        "difficulty": 1,
        "type": "multiple-choice"
    }
]

# Replacement Logic
# q_extra_1_l1 to q_extra_15_l1
# q_extra_1_l2 to q_extra_15_l2

for quiz in data['quizzes']:
    if quiz['id'] == 'space-level-1':
        for q in quiz['questions']:
            if q.get('id') and q['id'].startswith('q_extra_'):
                # Extract number from ID
                # ID format: q_extra_1_l1
                parts = q['id'].split('_')
                if len(parts) >= 3:
                    num = int(parts[2])
                    if 1 <= num <= 15:
                        idx = num - 1
                        q['question'] = real_questions_l1[idx]['question']
                        q['options'] = real_questions_l1[idx]['options']
                        q['explanation'] = real_questions_l1[idx]['explanation']
                        q['difficulty'] = real_questions_l1[idx]['difficulty']
                        q['type'] = real_questions_l1[idx]['type']
    elif quiz['id'] == 'space-level-2':
        for q in quiz['questions']:
            if q.get('id') and q['id'].startswith('q_extra_'):
                parts = q['id'].split('_')
                if len(parts) >= 3:
                    num = int(parts[2])
                    if 1 <= num <= 15:
                        idx = num - 1
                        q['question'] = real_questions_l2[idx]['question']
                        q['options'] = real_questions_l2[idx]['options']
                        q['explanation'] = real_questions_l2[idx]['explanation']
                        q['difficulty'] = real_questions_l2[idx]['difficulty']
                        q['type'] = real_questions_l2[idx]['type']

with open(file_path, 'w') as f:
    json.dump(data, f, indent=2)

print("Replaced all 30 dummy questions successfully with rich explanations!")
