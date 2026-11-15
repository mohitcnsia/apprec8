# scripts/wordPower/part1_data.py
# Groups 1-4: Animals, Food, Plants, School (120 words matching wordBank.js exactly)

ANIMALS = {
    "bear": {
        "example": "A hungry brown bear searched the riverbank for fresh salmon.",
        "synonym": None,
        "antonym": None,
        "confusable": ["bare", "beer"]
    },
    "camel": {
        "example": "The tall camel carried heavy sacks across the hot desert dunes.",
        "synonym": None,
        "antonym": None,
        "confusable": ["camal", "caramel"]
    },
    "chimpanzee": {
        "example": "The clever chimpanzee used a slender twig to fish for termites in a mound.",
        "synonym": None,
        "antonym": None,
        "confusable": ["chimpanze", "chimpamzee"]
    },
    "crocodile": {
        "example": "A huge crocodile glided quietly through the muddy river water.",
        "synonym": None,
        "antonym": None,
        "confusable": ["crocadile", "crocadyl"]
    },
    "deer": {
        "example": "A graceful spotted deer paused at the edge of the quiet forest.",
        "synonym": None,
        "antonym": None,
        "confusable": ["dear", "dare"]
    },
    "dolphin": {
        "example": "A playful dolphin leapt high over the ocean waves near our ferry.",
        "synonym": None,
        "antonym": None,
        "confusable": ["dolfin", "dauphin"]
    },
    "elephant": {
        "example": "The giant elephant sprayed cool river water over its dusty back.",
        "synonym": None,
        "antonym": None,
        "confusable": ["elefant", "elephunt"]
    },
    "fox": {
        "example": "A nimble red fox darted across the frosty meadow at dawn.",
        "synonym": None,
        "antonym": None,
        "confusable": ["foxe", "vox"]
    },
    "frog": {
        "example": "The bright green frog snapped up a flying insect with its long tongue.",
        "synonym": None,
        "antonym": None,
        "confusable": ["flog", "frok"]
    },
    "giraffe": {
        "example": "The tall giraffe stretched its long neck to reach fresh acacia leaves.",
        "synonym": None,
        "antonym": None,
        "confusable": ["girafe", "girraffe"]
    },
    "gorilla": {
        "example": "The powerful silverback gorilla guarded his family troop in the rainforest.",
        "synonym": None,
        "antonym": None,
        "confusable": ["guerilla", "gorila"]
    },
    "hippopotamus": {
        "example": "The heavy hippopotamus submerged into the lake to escape the midday heat.",
        "synonym": None,
        "antonym": None,
        "confusable": ["hipopotamus", "hippopotomus"]
    },
    "kangaroo": {
        "example": "A mother kangaroo carried her tiny joey safely in her pouch.",
        "synonym": None,
        "antonym": None,
        "confusable": ["kangeroo", "kangarou"]
    },
    "lion": {
        "example": "The majestic male lion let out a deep roar that echoed across the plains.",
        "synonym": None,
        "antonym": None,
        "confusable": ["loin", "lyon"]
    },
    "monkey": {
        "example": "A cheeky brown monkey swung easily from branch to branch in the banyan tree.",
        "synonym": None,
        "antonym": None,
        "confusable": ["monky", "monkie"]
    },
    "octopus": {
        "example": "The camouflaged octopus squeezed into a narrow rock crevice under the sea.",
        "synonym": None,
        "antonym": None,
        "confusable": ["octupus", "octopuss"]
    },
    "owl": {
        "example": "A barn owl perched quietly on the wooden fence, watching the field for mice.",
        "synonym": None,
        "antonym": None,
        "confusable": ["howl", "owle"]
    },
    "panda": {
        "example": "The giant panda munched happily on fresh bamboo stalks in the sanctuary.",
        "synonym": None,
        "antonym": None,
        "confusable": ["pander", "pandra"]
    },
    "parrot": {
        "example": "A brightly coloured parrot mimicked the whistling tune of the sailor.",
        "synonym": None,
        "antonym": None,
        "confusable": ["parot", "parrote"]
    },
    "penguin": {
        "example": "An emperor penguin waddled across the frozen ice before sliding into the sea.",
        "synonym": None,
        "antonym": None,
        "confusable": ["pengwin", "penguine"]
    },
    "rabbit": {
        "example": "The fluffy rabbit twitched its pink nose and nibbled on a fresh carrot top.",
        "synonym": "hare",
        "antonym": None,
        "confusable": ["rabit", "ribbit"]
    },
    "rhinoceros": {
        "example": "An armoured Indian rhinoceros wallowed in the shallow swamp to keep cool.",
        "synonym": None,
        "antonym": None,
        "confusable": ["rhinocerus", "rhinoserus"]
    },
    "seal": {
        "example": "A sleek grey seal clapped its flippers and sunbathed on the slippery rock.",
        "synonym": None,
        "antonym": None,
        "confusable": ["zeal", "ceal"]
    },
    "shark": {
        "example": "A reef shark swam smoothly along the edge of the coral reef.",
        "synonym": None,
        "antonym": None,
        "confusable": ["sharke", "sharp"]
    },
    "snake": {
        "example": "A green tree snake slithered silently among the vines in the garden.",
        "synonym": "serpent",
        "antonym": None,
        "confusable": ["snack", "snaek"]
    },
    "spider": {
        "example": "A tiny garden spider spun an intricate silken web between the rose twigs.",
        "synonym": None,
        "antonym": None,
        "confusable": ["spyder", "spidar"]
    },
    "squirrel": {
        "example": "The bushy-tailed squirrel buried an acorn beneath the damp autumn leaves.",
        "synonym": None,
        "antonym": None,
        "confusable": ["squirel", "squrrel"]
    },
    "tiger": {
        "example": "The royal Bengal tiger prowled silently through the tall golden grassland.",
        "synonym": None,
        "antonym": None,
        "confusable": ["tyger", "tigor"]
    },
    "wolf": {
        "example": "The alpha wolf led the pack through the snow-covered pine valley.",
        "synonym": None,
        "antonym": None,
        "confusable": ["wool", "wulf"]
    },
    "zebra": {
        "example": "Each zebra has a unique pattern of black and white stripes on its coat.",
        "synonym": None,
        "antonym": None,
        "confusable": ["sebra", "zeebra"]
    }
}

FOOD = {
    "baguette": {
        "example": "Mother bought a warm French baguette with a crisp golden crust from the market.",
        "synonym": None,
        "antonym": None,
        "confusable": ["baguet", "bagette"]
    },
    "burger": {
        "example": "Vikram ordered a grilled vegetable burger with crunchy lettuce and tomatoes.",
        "synonym": None,
        "antonym": None,
        "confusable": ["burgher", "burgar"]
    },
    "burrito": {
        "example": "We rolled spiced beans and melted cheese tightly inside a soft flour burrito.",
        "synonym": None,
        "antonym": None,
        "confusable": ["borrito", "burito"]
    },
    "croissant": {
        "example": "A flaky buttery croissant was served alongside hot chocolate at breakfast.",
        "synonym": None,
        "antonym": None,
        "confusable": ["croisant", "crescent"]
    },
    "curry": {
        "example": "Auntie simmered a fragrant vegetable curry with turmeric, cumin, and ginger.",
        "synonym": None,
        "antonym": None,
        "confusable": ["scurry", "currey"]
    },
    "donut": {
        "example": "Arun chose a chocolate-glazed donut topped with colourful sugar sprinkles.",
        "synonym": "doughnut",
        "antonym": None,
        "confusable": ["doughnut", "doughnutte"]
    },
    "dumpling": {
        "example": "We dipped the steaming vegetable dumpling into savoury ginger and soy sauce.",
        "synonym": "dim sum",
        "antonym": None,
        "confusable": ["dumplin", "dumplinge"]
    },
    "fondue": {
        "example": "The dinner guests dipped crusty bread cubes into a pot of melted Swiss fondue.",
        "synonym": None,
        "antonym": None,
        "confusable": ["fondu", "fondued"]
    },
    "gelato": {
        "example": "On a scorching summer day, we treated ourselves to creamy pistachio gelato.",
        "synonym": "ice cream",
        "antonym": None,
        "confusable": ["gelatto", "gelate"]
    },
    "hummus": {
        "example": "She scooped up a swirl of creamy chickpea hummus with a warm slice of pita.",
        "synonym": None,
        "antonym": None,
        "confusable": ["humus", "houmous"]
    },
    "kebab": {
        "example": "The vendor grilled skewers of spiced paneer kebab over glowing charcoal.",
        "synonym": None,
        "antonym": None,
        "confusable": ["kabob", "kebap"]
    },
    "lasagna": {
        "example": "Grandma baked a hearty vegetable lasagna layered with rich tomato sauce and cheese.",
        "synonym": None,
        "antonym": None,
        "confusable": ["lasagne", "lasana"]
    },
    "macaroni": {
        "example": "Mother baked a piping hot dish of elbow macaroni tossed in rich cheddar cheese.",
        "synonym": "pasta",
        "antonym": None,
        "confusable": ["maccaroni", "macaronie"]
    },
    "nachos": {
        "example": "We shared a platter of crunchy corn nachos smothered in melted cheese and salsa.",
        "synonym": None,
        "antonym": None,
        "confusable": ["natchos", "nachoes"]
    },
    "omelet": {
        "example": "Dad folded a fluffy herb omelet loaded with diced onions, tomatoes, and spinach.",
        "synonym": "omelette",
        "antonym": None,
        "confusable": ["omelette", "omlet"]
    },
    "paella": {
        "example": "The Spanish cook prepared a giant pan of saffron rice paella over an open flame.",
        "synonym": None,
        "antonym": None,
        "confusable": ["paela", "paelia"]
    },
    "pancake": {
        "example": "Maya flipped a fluffy buttermilk pancake onto her plate and drizzled it with honey.",
        "synonym": "flapjack",
        "antonym": None,
        "confusable": ["pancack", "pancacke"]
    },
    "pizza": {
        "example": "The baker pulled a bubbly wood-fired pizza covered in melted mozzarella from the oven.",
        "synonym": None,
        "antonym": None,
        "confusable": ["piza", "piazza"]
    },
    "pretzel": {
        "example": "The vendor sprinkled coarse sea salt over the freshly baked twisted pretzel.",
        "synonym": None,
        "antonym": None,
        "confusable": ["pretzle", "pretsel"]
    },
    "ramen": {
        "example": "The chef served a piping hot bowl of Japanese ramen with chewy noodles and broth.",
        "synonym": None,
        "antonym": None,
        "confusable": ["roman", "raymen"]
    },
    "salad": {
        "example": "A refreshing green salad with crisp cucumber slices and olive oil began the meal.",
        "synonym": None,
        "antonym": None,
        "confusable": ["salid", "sallad"]
    },
    "sandwich": {
        "example": "Priya packed a wholesome cucumber and mint sandwich for her school picnic.",
        "synonym": None,
        "antonym": None,
        "confusable": ["sandwitch", "sandwhich"]
    },
    "sausage": {
        "example": "The camping breakfast featured sizzling vegetarian sausage served with baked beans.",
        "synonym": "banger",
        "antonym": None,
        "confusable": ["sausadge", "sauceage"]
    },
    "spaghetti": {
        "example": "Rohan twirled long strands of spaghetti onto his fork with savoury tomato marinara.",
        "synonym": "pasta",
        "antonym": None,
        "confusable": ["spagetti", "spagheti"]
    },
    "sushi": {
        "example": "The chef rolled cucumber and seasoned sushi rice tightly inside a sheet of seaweed.",
        "synonym": None,
        "antonym": None,
        "confusable": ["sushie", "soshi"]
    },
    "taco": {
        "example": "Carlos folded a crunchy maize taco shell filled with seasoned beans and salsa.",
        "synonym": None,
        "antonym": None,
        "confusable": ["tacco", "toco"]
    },
    "tofu": {
        "example": "We stir-fried cubes of firm bean curd tofu with broccoli and ginger sauce.",
        "synonym": "bean curd",
        "antonym": None,
        "confusable": ["tofoo", "tophu"]
    },
    "tortilla": {
        "example": "Grandmother rolled out a warm corn tortilla and toasted it on the hot cast-iron griddle.",
        "synonym": "flatbread",
        "antonym": None,
        "confusable": ["tortila", "tortillia"]
    },
    "waffle": {
        "example": "The square Belgian waffle had deep pockets filled with melted butter and syrup.",
        "synonym": None,
        "antonym": None,
        "confusable": ["waffel", "woffle"]
    },
    "yogurt": {
        "example": "Ananya stirred wild blueberries into a cup of cool creamy yogurt.",
        "synonym": "curd",
        "antonym": None,
        "confusable": ["yoghurt", "yogert"]
    }
}
# Single word synonym adjustments for food
FOOD["donut"]["synonym"] = "pastry"
FOOD["gelato"]["synonym"] = "sorbet"
FOOD["tofu"]["synonym"] = "soya"

PLANTS = {
    "bamboo": {
        "example": "The tall green bamboo stalks swayed gently in the mountain breeze.",
        "synonym": None,
        "antonym": None,
        "confusable": ["bamboe", "bambou"]
    },
    "bryophyllum": {
        "example": "Tiny new plantlets sprouted along the serrated edges of the bryophyllum leaf.",
        "synonym": None,
        "antonym": None,
        "confusable": ["briophyllum", "bryophilum"]
    },
    "cactus": {
        "example": "The prickly pear cactus thrives in harsh rocky deserts with minimal rainfall.",
        "synonym": None,
        "antonym": None,
        "confusable": ["caktus", "cactas"]
    },
    "coconut": {
        "example": "A ripe brown coconut fell with a heavy thud onto the soft sandy beach.",
        "synonym": None,
        "antonym": None,
        "confusable": ["cocanut", "cocoanut"]
    },
    "dodder": {
        "example": "Yellow leafless vines of the parasitic dodder plant wrapped tightly around the hedge.",
        "synonym": "cuscuta",
        "antonym": None,
        "confusable": ["doder", "doddor"]
    },
    "duckweed": {
        "example": "Tiny green leaves of floating duckweed formed a dense green mat across the pond.",
        "synonym": None,
        "antonym": None,
        "confusable": ["duck weed", "dukweed"]
    },
    "fern": {
        "example": "Feathery green fronds of the maidenhair fern unfurled in the shaded grotto.",
        "synonym": None,
        "antonym": None,
        "confusable": ["furn", "fairn"]
    },
    "fir": {
        "example": "Needle-like green foliage adorned the evergreen Douglas fir tree in the alpine grove.",
        "synonym": None,
        "antonym": None,
        "confusable": ["fur", "fyr"]
    },
    "flytrap": {
        "example": "The carnivorous venus flytrap snapped its hinged leaves shut on a wandering ant.",
        "synonym": None,
        "antonym": None,
        "confusable": ["fly trap", "flytrapp"]
    },
    "ginger": {
        "example": "Grandmother grated aromatic spicy ginger root into the simmering evening tea.",
        "synonym": None,
        "antonym": None,
        "confusable": ["jinger", "gingar"]
    },
    "hyacinth": {
        "example": "Clusters of sweet-scented purple blossoms covered the water hyacinth in the lake.",
        "synonym": None,
        "antonym": None,
        "confusable": ["hyasinth", "hiacinth"]
    },
    "hydrilla": {
        "example": "Whorls of thin green leaves on the submerged hydrilla plant oxygenated the aquarium.",
        "synonym": None,
        "antonym": None,
        "confusable": ["hidrilla", "hydrila"]
    },
    "lily": {
        "example": "A pristine white water lily floated gracefully on the surface of the village pool.",
        "synonym": None,
        "antonym": None,
        "confusable": ["lilly", "lili"]
    },
    "lotus": {
        "example": "The sacred pink lotus flower bloomed proudly above the muddy swamp waters.",
        "synonym": None,
        "antonym": None,
        "confusable": ["lotas", "lotuss"]
    },
    "mangrove": {
        "example": "Stilt roots of the coastal mangrove tree anchored the muddy shoreline against rough tides.",
        "synonym": None,
        "antonym": None,
        "confusable": ["man-grove", "mangroov"]
    },
    "mimosa": {
        "example": "Brushing the delicate leaflets of the mimosa plant caused them to fold shut instantly.",
        "synonym": "sensitive plant",
        "antonym": None,
        "confusable": ["mimoza", "mimmosa"]
    },
    "mistletoe": {
        "example": "Evergreen sprigs of mistletoe with white berries grew high in the branches of the oak.",
        "synonym": None,
        "antonym": None,
        "confusable": ["missletoe", "misteltoe"]
    },
    "moss": {
        "example": "A soft carpet of velvet moss covered the damp stones beside the trickling brook.",
        "synonym": None,
        "antonym": None,
        "confusable": ["mose", "mosses"]
    },
    "mould": {
        "example": "Leaving damp bread in a dark cupboard allowed fuzzy greenish mould to grow rapidly.",
        "synonym": "fungus",
        "antonym": None,
        "confusable": ["mold", "mowld"]
    },
    "mushroom": {
        "example": "After the warm autumn rain, a ring of umbrella-shaped wild mushroom caps appeared on the lawn.",
        "synonym": "toadstool",
        "antonym": None,
        "confusable": ["mushrom", "mush-room"]
    },
    "onion": {
        "example": "Chopping a raw pungent onion released fumes that brought tears to the cook's eyes.",
        "synonym": "shallot",
        "antonym": None,
        "confusable": ["onien", "oniyon"]
    },
    "pine": {
        "example": "Woodland paths through the alpine pine forest were strewn with fragrant brown cones.",
        "synonym": None,
        "antonym": None,
        "confusable": ["pyne", "spine"]
    },
    "pitcher": {
        "example": "The insect slipped down into the fluid-filled cavity of the carnivorous pitcher plant.",
        "synonym": None,
        "antonym": None,
        "confusable": ["picher", "pitchar"]
    },
    "potato": {
        "example": "Farmers dug into the rich soil to unearth baskets of starchy brown potato tubers.",
        "synonym": "spud",
        "antonym": None,
        "confusable": ["potatoe", "potatto"]
    },
    "rubber": {
        "example": "Workers made diagonal cuts in the bark of the rubber tree to harvest sticky white latex.",
        "synonym": "latex",
        "antonym": None,
        "confusable": ["rubbar", "rubbor"]
    },
    "spruce": {
        "example": "Tall needle-bearing branches of the Norway spruce sheltered nesting owls during winter.",
        "synonym": None,
        "antonym": None,
        "confusable": ["spruse", "sprooce"]
    },
    "sundew": {
        "example": "Glistening sticky droplets on the leaves of the sundew trapped tiny gnats instantly.",
        "synonym": None,
        "antonym": None,
        "confusable": ["sundue", "sonldew"]
    },
    "tapegrass": {
        "example": "Long ribbon-like green leaves of tapegrass rippled gently in the freshwater stream.",
        "synonym": "vallisneria",
        "antonym": None,
        "confusable": ["tape grass", "tapegas"]
    },
    "teak": {
        "example": "The durable dining table was crafted from solid seasoned teak wood that resists moisture.",
        "synonym": "timber",
        "antonym": None,
        "confusable": ["teake", "teek"]
    },
    "wolffia": {
        "example": "Floating on the water surface, wolffia is celebrated as the smallest flowering plant on Earth.",
        "synonym": "watermeal",
        "antonym": None,
        "confusable": ["wolfia", "wolffya"]
    }
}
PLANTS["mimosa"]["synonym"] = "shrub"

SCHOOL = {
    "backpack": {
        "example": "Kunal zipped up his blue backpack after packing his pencil box and reading book.",
        "synonym": "knapsack",
        "antonym": None,
        "confusable": ["backpak", "back-pack"]
    },
    "blackboard": {
        "example": "The mathematics teacher wrote four division equations across the slate blackboard.",
        "synonym": "chalkboard",
        "antonym": None,
        "confusable": ["black board", "blackbord"]
    },
    "bus": {
        "example": "The bright yellow school bus honked twice outside the front gate each morning.",
        "synonym": "coach",
        "antonym": None,
        "confusable": ["buss", "buzz"]
    },
    "calculator": {
        "example": "During the physics practical, Arjun used a digital calculator to check his multiplication.",
        "synonym": None,
        "antonym": None,
        "confusable": ["calculater", "calcualtor"]
    },
    "certificate": {
        "example": "Rhea proudly held her merit certificate after winning first place in the debate contest.",
        "synonym": "diploma",
        "antonym": None,
        "confusable": ["sertificate", "certifacate"]
    },
    "chalk": {
        "example": "White dust drifted softly from the wooden ledge as the teacher picked up a fresh chalk stick.",
        "synonym": None,
        "antonym": None,
        "confusable": ["chawk", "chalke"]
    },
    "computer": {
        "example": "Every student practiced typing on a desktop computer in the air-conditioned laboratory.",
        "synonym": None,
        "antonym": None,
        "confusable": ["computar", "computor"]
    },
    "crayon": {
        "example": "The kindergartener selected a bright turquoise crayon to colour the ocean picture.",
        "synonym": None,
        "antonym": None,
        "confusable": ["craiyon", "crayun"]
    },
    "desk": {
        "example": "Tanya stacked her notebooks neatly in the cubby beneath her wooden school desk.",
        "synonym": "table",
        "antonym": None,
        "confusable": ["deske", "dask"]
    },
    "dictionary": {
        "example": "When Kabir encountered an unfamiliar word, he looked it up in the school library dictionary.",
        "synonym": "lexicon",
        "antonym": None,
        "confusable": ["dictionery", "dictionairy"]
    },
    "eraser": {
        "example": "Pooja rubbed out her pencil sketch mistake cleanly using a soft white rubber eraser.",
        "synonym": "rubber",
        "antonym": None,
        "confusable": ["erasor", "iraser"]
    },
    "exam": {
        "example": "The students revised their science notes diligently the night before their final exam.",
        "synonym": "test",
        "antonym": None,
        "confusable": ["exame", "exsam"]
    },
    "globe": {
        "example": "The geography teacher spun the colourful world globe to show the location of Madagascar.",
        "synonym": "sphere",
        "antonym": None,
        "confusable": ["gloab", "globa"]
    },
    "glue": {
        "example": "She applied a dab of sticky craft glue to paste the paper petals onto the card.",
        "synonym": "adhesive",
        "antonym": None,
        "confusable": ["glew", "glou"]
    },
    "homework": {
        "example": "The students finished their daily arithmetic homework before sitting down for dinner.",
        "synonym": "assignment",
        "antonym": None,
        "confusable": ["home work", "homewurk"]
    },
    "library": {
        "example": "A peaceful silence filled the library as children browsed through rows of mystery novels.",
        "synonym": None,
        "antonym": None,
        "confusable": ["libary", "librery"]
    },
    "lunchbox": {
        "example": "Aarav popped open his insulated lunchbox to find warm stuffed parathas inside.",
        "synonym": "tiffin",
        "antonym": None,
        "confusable": ["lunch box", "luncbox"]
    },
    "map": {
        "example": "The teacher unfurled a topographical map of India showing all major mountain ranges.",
        "synonym": "chart",
        "antonym": None,
        "confusable": ["mapp", "mop"]
    },
    "notebook": {
        "example": "Ananya wrote down the science definitions carefully inside her ruled exercise notebook.",
        "synonym": "journal",
        "antonym": None,
        "confusable": ["note book", "notebuk"]
    },
    "pencil": {
        "example": "She sharpened her wooden lead pencil to a fine point before starting the geometry exam.",
        "synonym": None,
        "antonym": None,
        "confusable": ["pensil", "pencel"]
    },
    "principal": {
        "example": "The school principal delivered an encouraging speech during the morning assembly.",
        "synonym": "headmaster",
        "antonym": None,
        "confusable": ["principle", "principall"]
    },
    "projector": {
        "example": "The science teacher turned on the digital projector to display animated cells on the screen.",
        "synonym": None,
        "antonym": None,
        "confusable": ["projecter", "progector"]
    },
    "recess": {
        "example": "Children rushed out onto the sunny playground the moment the bell rang for recess.",
        "synonym": "break",
        "antonym": None,
        "confusable": ["reces", "recesse"]
    },
    "register": {
        "example": "The class monitor marked attendance in the blue attendance register each morning.",
        "synonym": "roster",
        "antonym": None,
        "confusable": ["registar", "regester"]
    },
    "ruler": {
        "example": "Use a clear straight ruler to draw a crisp margin down the left side of your page.",
        "synonym": "straightedge",
        "antonym": None,
        "confusable": ["ruller", "rulor"]
    },
    "scissors": {
        "example": "Carefully snip along the dotted black line using a pair of blunt-tipped craft scissors.",
        "synonym": "shears",
        "antonym": None,
        "confusable": ["scisors", "sissors"]
    },
    "sharpener": {
        "example": "Kavita emptied pencil shavings from the plastic container of her handheld sharpener.",
        "synonym": None,
        "antonym": None,
        "confusable": ["sharpner", "sharpnor"]
    },
    "stapler": {
        "example": "He used a metal office stapler to bind the three printed report pages together.",
        "synonym": None,
        "antonym": None,
        "confusable": ["staplar", "stappler"]
    },
    "teacher": {
        "example": "Our history teacher brought ancient Roman coins to class for students to examine.",
        "synonym": "instructor",
        "antonym": "student",
        "confusable": ["techer", "teachor"]
    },
    "uniform": {
        "example": "Every Monday morning, the students wore their neatly pressed white school uniform.",
        "synonym": "attire",
        "antonym": None,
        "confusable": ["unifrom", "uneform"]
    }
}
