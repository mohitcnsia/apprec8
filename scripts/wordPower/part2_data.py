# scripts/wordPower/part2_data.py
# Groups 5-8: Actions & Change, Actions & States of Being, Character & Action, Conflict & Qualities (80 words)

ACTIONS_CHANGE = {
    "abide": {
        "example": "All participants agreed to abide by the official rules of the chess tournament.",
        "synonym": "obey",
        "antonym": "flout",
        "confusable": ["abaide", "abite"]
    },
    "ambush": {
        "example": "The playful kittens hid behind the sofa to ambush their mother's tail.",
        "synonym": "trap",
        "antonym": None,
        "confusable": ["ambushh", "ambushment"]
    },
    "appall": {
        "example": "Cruel behaviour towards stray animals will appall anyone with a kind heart.",
        "synonym": "shock",
        "antonym": "please",
        "confusable": ["appal", "apall"]
    },
    "audacity": {
        "example": "The little mouse had the audacity to snatch cheese right from under the cat's nose.",
        "synonym": "boldness",
        "antonym": "timidity",
        "confusable": ["audasity", "audacitee"]
    },
    "bias": {
        "example": "The referee remained completely fair and showed no bias towards either football team.",
        "synonym": "prejudice",
        "antonym": "fairness",
        "confusable": ["byas", "biass"]
    },
    "bouquet": {
        "example": "Kavita handed a colourful flower bouquet to her teacher on Teacher's Day.",
        "synonym": "posy",
        "antonym": None,
        "confusable": ["boquet", "bouqet"]
    },
    "brandish": {
        "example": "The pirate began to brandish his gleaming cutlass high in the air.",
        "synonym": "wave",
        "antonym": None,
        "confusable": ["brandich", "brandiss"]
    },
    "conspicuous": {
        "example": "His bright neon raincoat made him conspicuous even in the heavy fog.",
        "synonym": "noticeable",
        "antonym": "hidden",
        "confusable": ["conspicious", "conspicous"]
    },
    "empathy": {
        "example": "Showing genuine empathy helps us comfort friends who are feeling sad.",
        "synonym": "compassion",
        "antonym": "callousness",
        "confusable": ["emphathy", "empethy"]
    },
    "employ": {
        "example": "The carpenter will employ specialised hand tools to carve the wooden chair.",
        "synonym": "use",
        "antonym": "discard",
        "confusable": ["imploy", "emloy"]
    },
    "fiasco": {
        "example": "The poorly planned school play turned into an utter fiasco when the stage curtain fell down.",
        "synonym": "disaster",
        "antonym": "success",
        "confusable": ["feasco", "fiascoe"]
    },
    "flicker": {
        "example": "We watched the candle flame flicker when a cool draught blew under the door.",
        "synonym": "flutter",
        "antonym": None,
        "confusable": ["fliker", "flickor"]
    },
    "neglect": {
        "example": "You must never neglect your daily homework if you want to perform well.",
        "synonym": "ignore",
        "antonym": "cherish",
        "confusable": ["neglet", "neglec"]
    },
    "pioneer": {
        "example": "Kalpana Chawla was an inspiring pioneer who explored human space flight.",
        "synonym": "innovator",
        "antonym": "follower",
        "confusable": ["pyoneer", "pionere"]
    },
    "rehearse": {
        "example": "The orchestra gathered every evening to rehearse the new symphony.",
        "synonym": "practise",
        "antonym": None,
        "confusable": ["reherse", "reh默认"]
    },
    "remedy": {
        "example": "Warm honey and lemon water is a soothing remedy for a scratchy sore throat.",
        "synonym": "cure",
        "antonym": None,
        "confusable": ["remedee", "remady"]
    },
    "smother": {
        "example": "Use a damp woollen blanket to smother small kitchen grease fires safely.",
        "synonym": "extinguish",
        "antonym": None,
        "confusable": ["smothur", "smuther"]
    },
    "totter": {
        "example": "The tiny toddler began to totter unsteadily across the living room carpet.",
        "synonym": "wobble",
        "antonym": None,
        "confusable": ["toter", "tatter"]
    },
    "vicinity": {
        "example": "There is a quiet public library located in the immediate vicinity of our school.",
        "synonym": "neighbourhood",
        "antonym": None,
        "confusable": ["vicinitie", "viciniti"]
    },
    "waver": {
        "example": "Her determination did not waver even when the math problems grew challenging.",
        "synonym": "hesitate",
        "antonym": "persist",
        "confusable": ["waiver", "wavur"]
    }
}
# Fix confusable for rehearse
ACTIONS_CHANGE["rehearse"]["confusable"] = ["reherse", "reharse"]

STATES_BEING = {
    "appraisal": {
        "example": "The jeweller gave an honest appraisal of the rare vintage pocket watch.",
        "synonym": "evaluation",
        "antonym": None,
        "confusable": ["apraisal", "appraisel"]
    },
    "cerebral": {
        "example": "Chess is an intensely cerebral board game that rewards deep tactical calculation.",
        "synonym": "intellectual",
        "antonym": "emotional",
        "confusable": ["cereberal", "cerebril"]
    },
    "contented": {
        "example": "The tabby cat purred softly, looking thoroughly contented beside the warm fireplace.",
        "synonym": "satisfied",
        "antonym": "discontented",
        "confusable": ["contended", "contentid"]
    },
    "dare": {
        "example": "Few sailors dare to navigate these treacherous rocky waters in stormy weather.",
        "synonym": "venture",
        "antonym": None,
        "confusable": ["daer", "dear"]
    },
    "enmity": {
        "example": "The long-standing enmity between the two rival kingdoms finally ended with a treaty.",
        "synonym": "hostility",
        "antonym": "friendship",
        "confusable": ["enemity", "enmitie"]
    },
    "exhilarate": {
        "example": "A fast ride down the snowy slope will exhilarate anyone who loves winter sports.",
        "synonym": "thrill",
        "antonym": "depress",
        "confusable": ["exilerate", "exhilirate"]
    },
    "exhilaration": {
        "example": "The hikers felt pure exhilaration upon reaching the sunny mountain peak.",
        "synonym": "delight",
        "antonym": "gloom",
        "confusable": ["exhileration", "exilaration"]
    },
    "gallantry": {
        "example": "The brave firefighter received a medal of honor for his gallantry during the rescue.",
        "synonym": "bravery",
        "antonym": "cowardice",
        "confusable": ["galantry", "gallantree"]
    },
    "illiterate": {
        "example": "The community school volunteered evening classes to teach illiterate adults how to read.",
        "synonym": "uneducated",
        "antonym": "literate",
        "confusable": ["iliterite", "illiterit"]
    },
    "impetuous": {
        "example": "His impetuous decision to spend all his pocket money on candy left him broke.",
        "synonym": "rash",
        "antonym": "cautious",
        "confusable": ["impetuos", "impeteous"]
    },
    "nimble": {
        "example": "The nimble mountain goat scampered across the steep rocky cliff with ease.",
        "synonym": "agile",
        "antonym": "clumsy",
        "confusable": ["nimbel", "nymble"]
    },
    "placid": {
        "example": "The surface of the mountain lake remained completely placid on the windless morning.",
        "synonym": "serene",
        "antonym": "stormy",
        "confusable": ["placyd", "plassid"]
    },
    "prone": {
        "example": "Dry wooden buildings are especially prone to catching fire during hot summers.",
        "synonym": "susceptible",
        "antonym": "immune",
        "confusable": ["proan", "prohn"]
    },
    "protrude": {
        "example": "Sharp jagged rocks protrude from the coastal water at low tide.",
        "synonym": "stick out",
        "antonym": None,
        "confusable": ["protrud", "protrood"]
    },
    "prudent": {
        "example": "It is always prudent to save a portion of your allowance for unexpected needs.",
        "synonym": "wise",
        "antonym": "foolish",
        "confusable": ["prudant", "prudente"]
    },
    "pseudonym": {
        "example": "The famous author wrote her detective stories under a secret pseudonym.",
        "synonym": "pen name",
        "antonym": None,
        "confusable": ["psuedonym", "pseudonim"]
    },
    "reputation": {
        "example": "The honest merchant earned a sterling reputation throughout the bustling bazaar.",
        "synonym": "prestige",
        "antonym": None,
        "confusable": ["reputaion", "reputasion"]
    },
    "retractable": {
        "example": "A cat can silently withdraw its sharp retractable claws when walking on carpets.",
        "synonym": None,
        "antonym": None,
        "confusable": ["retractible", "retractablee"]
    },
    "sieve": {
        "example": "Mother poured the dry flour through a fine wire sieve to remove any lumps.",
        "synonym": "strainer",
        "antonym": None,
        "confusable": ["seive", "seve"]
    },
    "transparent": {
        "example": "The pristine stream was so transparent that we could count every pebble on the bottom.",
        "synonym": "clear",
        "antonym": "opaque",
        "confusable": ["transparant", "transperent"]
    }
}
# Single word synonym adjustments
STATES_BEING["protrude"]["synonym"] = "project"
STATES_BEING["pseudonym"]["synonym"] = "alias"

CHARACTER_ACTION = {
    "aggravate": {
        "example": "Rubbing your irritated eyes will only aggravate the redness and swelling.",
        "synonym": "worsen",
        "antonym": "soothe",
        "confusable": ["agravate", "aggrivate"]
    },
    "allay": {
        "example": "The gentle nurse spoke calmly to allay the frightened young child's fears.",
        "synonym": "calm",
        "antonym": "arouse",
        "confusable": ["allaye", "alay"]
    },
    "alleviate": {
        "example": "Taking the prescribed syrup helped to alleviate his persistent chest pain.",
        "synonym": "ease",
        "antonym": "intensify",
        "confusable": ["aleviate", "alleviat"]
    },
    "benevolent": {
        "example": "The benevolent doctor treated impoverished patients without charging any fees.",
        "synonym": "kind",
        "antonym": "cruel",
        "confusable": ["benevelent", "benovolent"]
    },
    "callous": {
        "example": "His callous remarks about the weeping child shocked everyone in the room.",
        "synonym": "heartless",
        "antonym": "compassionate",
        "confusable": ["callus", "calous"]
    },
    "coax": {
        "example": "We had to coax the timid stray puppy from under the porch with a treat.",
        "synonym": "persuade",
        "antonym": "dissuade",
        "confusable": ["coaxe", "kokes"]
    },
    "cunning": {
        "example": "The cunning fox waited patiently until the guard dog fell fast asleep.",
        "synonym": "crafty",
        "antonym": "naive",
        "confusable": ["cuning", "cunninge"]
    },
    "dauntless": {
        "example": "The dauntless captain steered his wooden sailing vessel right through the squall.",
        "synonym": "fearless",
        "antonym": "timid",
        "confusable": ["dountless", "dauntles"]
    },
    "entice": {
        "example": "Sweet bakeries often entice passers-by with the aroma of hot cinnamon rolls.",
        "synonym": "lure",
        "antonym": "repel",
        "confusable": ["entyce", "entise"]
    },
    "fanatic": {
        "example": "He was such a fitness fanatic that he never missed a morning workout.",
        "synonym": "zealot",
        "antonym": None,
        "confusable": ["fanatick", "fanatick"]
    },
    "hinder": {
        "example": "Heavy rain and slippery mud will hinder our progress during the hill hike.",
        "synonym": "obstruct",
        "antonym": "assist",
        "confusable": ["hynder", "hindar"]
    },
    "impede": {
        "example": "Fallen tree branches will impede vehicular traffic on the narrow mountain road.",
        "synonym": "block",
        "antonym": "facilitate",
        "confusable": ["impead", "imped"]
    },
    "incite": {
        "example": "The angry speaker attempted to incite the crowd to riot in the town square.",
        "synonym": "provoke",
        "antonym": "deter",
        "confusable": ["insite", "insight"]
    },
    "naive": {
        "example": "It was naive to believe that the mysterious email promised free lottery riches.",
        "synonym": "innocent",
        "antonym": "cunning",
        "confusable": ["naieve", "naïve"]
    },
    "philanthropist": {
        "example": "The wealthy philanthropist funded the construction of three new children's hospitals.",
        "synonym": "benefactor",
        "antonym": None,
        "confusable": ["philantropist", "philanthropiste"]
    },
    "pompous": {
        "example": "The pompous young nobleman looked down his nose at ordinary townsfolk.",
        "synonym": "arrogant",
        "antonym": "humble",
        "confusable": ["pompus", "pompious"]
    },
    "righteous": {
        "example": "The righteous judge refused to accept any bribe from dishonest officials.",
        "synonym": "virtuous",
        "antonym": "wicked",
        "confusable": ["rightous", "rightuous"]
    },
    "thwart": {
        "example": "Clever detective work managed to thwart the criminal's scheme to rob the bank.",
        "synonym": "foil",
        "antonym": "aid",
        "confusable": ["thworte", "thwort"]
    },
    "virtuous": {
        "example": "Grandmother lived an honest and virtuous life, always helping her neighbours.",
        "synonym": "noble",
        "antonym": "corrupt",
        "confusable": ["virtous", "vertuous"]
    },
    "wheedle": {
        "example": "The boy tried to wheedle an extra slice of cake from his doting grandmother.",
        "synonym": "cajole",
        "antonym": None,
        "confusable": ["weedle", "wheedel"]
    }
}
CHARACTER_ACTION["fanatic"]["confusable"] = ["fanatick", "fanatickal"]

CONFLICT_QUALITIES = {
    "afflict": {
        "example": "Severe tropical fevers often afflict travellers who visit without vaccinations.",
        "synonym": "trouble",
        "antonym": "comfort",
        "confusable": ["aflict", "afflikt"]
    },
    "apprehension": {
        "example": "Ravi felt a sudden flutter of apprehension before stepping onto the stage.",
        "synonym": "dread",
        "antonym": "confidence",
        "confusable": ["aprehension", "apprehention"]
    },
    "coerce": {
        "example": "Nobody should ever coerce you into doing something you know is dangerous or wrong.",
        "synonym": "force",
        "antonym": "persuade",
        "confusable": ["coerse", "coherce"]
    },
    "compulsory": {
        "example": "Wearing a protective helmet is compulsory for all bicycle and scooter riders.",
        "synonym": "mandatory",
        "antonym": "optional",
        "confusable": ["compulsary", "compulsery"]
    },
    "corpulent": {
        "example": "The corpulent king struggled to climb into his golden carriage without assistance.",
        "synonym": "obese",
        "antonym": "slender",
        "confusable": ["corpulant", "corpulente"]
    },
    "eliminate": {
        "example": "We must eliminate single-use plastics to protect our marine wildlife.",
        "synonym": "remove",
        "antonym": "add",
        "confusable": ["elimenate", "eliminite"]
    },
    "entreat": {
        "example": "The villagers gathered to entreat the governor for emergency drought relief.",
        "synonym": "plead",
        "antonym": "demand",
        "confusable": ["entreet", "entrete"]
    },
    "erratic": {
        "example": "The erratic winds made it impossible for the kite to stay aloft in the air.",
        "synonym": "unpredictable",
        "antonym": "consistent",
        "confusable": ["eratic", "erratick"]
    },
    "exhaustive": {
        "example": "The scientists conducted an exhaustive study of the rare bird species in the valley.",
        "synonym": "thorough",
        "antonym": "incomplete",
        "confusable": ["exhaustiv", "exaustive"]
    },
    "exhilarating": {
        "example": "Gliding on a zipline above the green canopy was an exhilarating experience for the children.",
        "synonym": "thrilling",
        "antonym": "boring",
        "confusable": ["exhilirating", "exilerating"]
    },
    "fend": {
        "example": "The young wolf had to learn to fend for itself during the harsh winter months.",
        "synonym": "resist",
        "antonym": "surrender",
        "confusable": ["fende", "fond"]
    },
    "lash": {
        "example": "Fierce ocean squalls began to lash against the fragile wooden lighthouse windows.",
        "synonym": "strike",
        "antonym": None,
        "confusable": ["lashe", "latch"]
    },
    "rebuff": {
        "example": "She gave a polite rebuff to the pushy salesperson trying to sell encyclopedias.",
        "synonym": "rejection",
        "antonym": "acceptance",
        "confusable": ["rebuf", "rebuffe"]
    },
    "rebuke": {
        "example": "The stern headmaster issued a sharp rebuke to the students caught vandalising desks.",
        "synonym": "scold",
        "antonym": "praise",
        "confusable": ["rebook", "rebuk"]
    },
    "relinquish": {
        "example": "The reigning chess champion had to relinquish his crown after a tense final match.",
        "synonym": "surrender",
        "antonym": "retain",
        "confusable": ["relinqish", "relinquich"]
    },
    "soothe": {
        "example": "Applying cooling aloe vera gel helped soothe her painful sunburn instantly.",
        "synonym": "comfort",
        "antonym": "irritate",
        "confusable": ["sooth", "southe"]
    },
    "steadfast": {
        "example": "He remained steadfast in his loyalty to his childhood friends through hard times.",
        "synonym": "resolute",
        "antonym": "fickle",
        "confusable": ["stedfast", "steadfaste"]
    },
    "surpassed": {
        "example": "The student's exceptional test scores surpassed all her teachers' high expectations.",
        "synonym": "exceeded",
        "antonym": "trailed",
        "confusable": ["surpast", "surpased"]
    },
    "tolerance": {
        "example": "Living in a diverse city teaches children the value of mutual tolerance and respect.",
        "synonym": "patience",
        "antonym": "intolerance",
        "confusable": ["tolerence", "tollerance"]
    },
    "trigger": {
        "example": "A sudden loud noise can trigger a stampede among frightened cattle.",
        "synonym": "spark",
        "antonym": "halt",
        "confusable": ["triger", "triggur"]
    }
}

