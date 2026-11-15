# scripts/wordPower/part4_data.py
# Groups 13-17: Groups & Behaviors, Importance & Method, More Actions & Qualities, Speaking & Size, Thinking & Situations (100 words)

GROUPS_BEHAVIORS = {
    "acquaintance": {
        "example": "He struck up a conversation with an old school acquaintance on the morning train.",
        "synonym": "contact",
        "antonym": "stranger",
        "confusable": ["aquaintance", "acquaintence"]
    },
    "amalgamate": {
        "example": "The two publishing houses agreed to amalgamate their businesses into one large firm.",
        "synonym": "merge",
        "antonym": "separate",
        "confusable": ["amalgameat", "amalgamayt"]
    },
    "assertive": {
        "example": "Being politely assertive allows you to speak up for your ideas without being rude.",
        "synonym": "confident",
        "antonym": "diffident",
        "confusable": ["asertive", "assertiv"]
    },
    "bevy": {
        "example": "A noisy bevy of quail scurried across the country lane into the bushes.",
        "synonym": "flock",
        "antonym": None,
        "confusable": ["bevvy", "bevie"]
    },
    "bombastic": {
        "example": "His bombastic political speech used grandiose vocabulary but said very little of substance.",
        "synonym": "pompous",
        "antonym": "modest",
        "confusable": ["bombastick", "bombasticc"]
    },
    "collate": {
        "example": "The student volunteers helped collate the survey sheets into alphabetical order.",
        "synonym": "organise",
        "antonym": "disarrange",
        "confusable": ["colate", "collait"]
    },
    "congregation": {
        "example": "The temple congregation bowed respectfully during the evening prayer chants.",
        "synonym": "assembly",
        "antonym": None,
        "confusable": ["congregasion", "congeregation"]
    },
    "connote": {
        "example": "In literature, the word 'winter' can often connote loneliness and barren stillness.",
        "synonym": "imply",
        "antonym": "denote",
        "confusable": ["conote", "connot"]
    },
    "consortium": {
        "example": "An international consortium of aerospace engineers collaborated to build the telescope.",
        "synonym": "syndicate",
        "antonym": None,
        "confusable": ["consorsium", "consortiam"]
    },
    "correlation": {
        "example": "Doctors noticed a direct correlation between regular exercise and improved heart health.",
        "synonym": "connection",
        "antonym": None,
        "confusable": ["corelation", "correlasion"]
    },
    "diffident": {
        "example": "The diffident boy hesitated to raise his hand even though he knew the right answer.",
        "synonym": "timid",
        "antonym": "assertive",
        "confusable": ["diffadent", "defident"]
    },
    "pernicious": {
        "example": "Spreading false rumours on the internet can cause pernicious harm to reputations.",
        "synonym": "destructive",
        "antonym": "beneficial",
        "confusable": ["pernitious", "pernitous"]
    },
    "proficient": {
        "example": "After three years of dedicated practice, she became proficient in playing the cello.",
        "synonym": "skilled",
        "antonym": "inept",
        "confusable": ["profishent", "proficiant"]
    },
    "quirky": {
        "example": "Uncle Leo had a quirky habit of wearing mismatched socks on every holiday.",
        "synonym": "eccentric",
        "antonym": "conventional",
        "confusable": ["quirkey", "qwirky"]
    },
    "reconciliation": {
        "example": "After a week of stubborn silence, the two brothers achieved a warm reconciliation.",
        "synonym": "settlement",
        "antonym": "estrangement",
        "confusable": ["reconsiliation", "reconcilation"]
    },
    "segregate": {
        "example": "The sanitation department asked households to segregate plastic from organic kitchen waste.",
        "synonym": "separate",
        "antonym": "integrate",
        "confusable": ["segragate", "segregeat"]
    },
    "self-sufficient": {
        "example": "The mountain farmhouse was completely self-sufficient with solar panels and a vegetable garden.",
        "synonym": "independent",
        "antonym": "dependent",
        "confusable": ["self sufficient", "self-sufficiant"]
    },
    "tenacious": {
        "example": "The tenacious climber held on firmly to the steep cliff ledge until the safety rope was secured.",
        "synonym": "persistent",
        "antonym": "fickle",
        "confusable": ["tenatious", "tenacius"]
    },
    "urbane": {
        "example": "The diplomat possessed an urbane charm that put every guest at ease immediately.",
        "synonym": "suave",
        "antonym": "uncouth",
        "confusable": ["urban", "urbaen"]
    },
    "whimsical": {
        "example": "The children's bedtime story featured whimsical drawings of floating teapots and flying fish.",
        "synonym": "playful",
        "antonym": "sober",
        "confusable": ["wimsical", "whimzical"]
    }
}

IMPORTANCE_METHOD = {
    "annually": {
        "example": "Our school organizes an inter-state athletic meet annually during the winter term.",
        "synonym": "yearly",
        "antonym": None,
        "confusable": ["anually", "annualy"]
    },
    "avidly": {
        "example": "The students listened avidly as the famous mountaineer recounted his Everest expedition.",
        "synonym": "eagerly",
        "antonym": "indifferently",
        "confusable": ["avidley", "avidli"]
    },
    "beneficial": {
        "example": "Eating fresh seasonal fruits and green vegetables is highly beneficial to our immune system.",
        "synonym": "advantageous",
        "antonym": "harmful",
        "confusable": ["benificial", "benefisial"]
    },
    "candidness": {
        "example": "Her refreshing candidness made it easy for everyone to trust her honest feedback.",
        "synonym": "frankness",
        "antonym": "deceitfulness",
        "confusable": ["candidnes", "candiddness"]
    },
    "crucial": {
        "example": "Drinking enough clean water is crucial for maintaining stamina during long runs.",
        "synonym": "essential",
        "antonym": "trivial",
        "confusable": ["crutial", "cruciall"]
    },
    "emphatic": {
        "example": "The head coach gave an emphatic warning about the importance of wearing safety pads.",
        "synonym": "forceful",
        "antonym": "hesitant",
        "confusable": ["emfatick", "emphatick"]
    },
    "favourable": {
        "example": "The ship waited in the deep harbor until a favourable wind began blowing eastward.",
        "synonym": "advantageous",
        "antonym": "unfavourable",
        "confusable": ["favorable", "favourabel"]
    },
    "germane": {
        "example": "Please raise only points that are directly germane to the topic under discussion.",
        "synonym": "relevant",
        "antonym": "irrelevant",
        "confusable": ["germain", "germayne"]
    },
    "grumble": {
        "example": "It does no good to grumble about the rainy weather when there are indoor games to play.",
        "synonym": "complain",
        "antonym": "praise",
        "confusable": ["grumbel", "grumbl"]
    },
    "innate": {
        "example": "Swallows possess an innate instinct that guides their migration across thousands of miles.",
        "synonym": "inborn",
        "antonym": "acquired",
        "confusable": ["inate", "innaet"]
    },
    "intrinsic": {
        "example": "The intrinsic beauty of gold is that it never rusts or tarnishes over time.",
        "synonym": "inherent",
        "antonym": "extrinsic",
        "confusable": ["intrinzic", "intrinsick"]
    },
    "latent": {
        "example": "The summer art camp helped uncover her latent talent for watercolour painting.",
        "synonym": "dormant",
        "antonym": "active",
        "confusable": ["laytent", "latente"]
    },
    "moderately": {
        "example": "The spice level in the tomato soup was only moderately hot, so everyone could enjoy it.",
        "synonym": "somewhat",
        "antonym": "extremely",
        "confusable": ["moderatly", "moderatley"]
    },
    "penultimate": {
        "example": "The excitement peaked during the penultimate chapter just before the villain was revealed.",
        "synonym": None,
        "antonym": None,
        "confusable": ["penultamate", "pennultimate"]
    },
    "potent": {
        "example": "Grandmother brewed a potent herbal tea that knocked out my fever overnight.",
        "synonym": "powerful",
        "antonym": "weak",
        "confusable": ["potant", "potente"]
    },
    "seldom": {
        "example": "During winter in the desert, clouds seldom appear in the crisp blue sky.",
        "synonym": "rarely",
        "antonym": "often",
        "confusable": ["seldome", "seldum"]
    },
    "superficial": {
        "example": "The doctor assured us that the cat scratch was merely superficial and needed only a bandage.",
        "synonym": "shallow",
        "antonym": "deep",
        "confusable": ["superfitial", "superficiall"]
    },
    "unaccountably": {
        "example": "The front gate was unaccountably left unlocked despite the security guard's vigilance.",
        "synonym": "inexplicably",
        "antonym": "accountably",
        "confusable": ["unaccountabel", "unaccountabli"]
    },
    "unknowingly": {
        "example": "Rohan unknowingly stepped onto a patch of wet cement outside the library.",
        "synonym": "unwittingly",
        "antonym": "knowingly",
        "confusable": ["unknowenly", "unknowingley"]
    },
    "utmost": {
        "example": "Treating museum exhibits with the utmost care is mandatory for every visitor.",
        "synonym": "greatest",
        "antonym": "least",
        "confusable": ["upmost", "utmoast"]
    }
}

MORE_ACTIONS_QUALITIES = {
    "accomplishment": {
        "example": "Finishing her first marathon was a proud accomplishment that took months of training.",
        "synonym": "achievement",
        "antonym": "failure",
        "confusable": ["acomplishment", "accomplishement"]
    },
    "assuredly": {
        "example": "The headmaster assuredly stated that every student would have a role in the annual play.",
        "synonym": "confidently",
        "antonym": "doubtfully",
        "confusable": ["asuredly", "assuredley"]
    },
    "bearing": {
        "example": "The tall officer maintained a dignified military bearing throughout the ceremonial parade.",
        "synonym": "demeanour",
        "antonym": None,
        "confusable": ["bareing", "baring"]
    },
    "convergent": {
        "example": "The two scientific research teams reached convergent conclusions after reviewing the field data.",
        "synonym": "merging",
        "antonym": "divergent",
        "confusable": ["converjant", "convergant"]
    },
    "dispel": {
        "example": "The teacher showed a clear video to dispel the common myth that bats are blind.",
        "synonym": "banish",
        "antonym": "engender",
        "confusable": ["dispell", "despel"]
    },
    "dominate": {
        "example": "Towering oak trees dominate the high canopy of the primeval forest.",
        "synonym": "control",
        "antonym": "surrender",
        "confusable": ["domenate", "dominit"]
    },
    "elaborate": {
        "example": "The architect presented an elaborate floor plan featuring a courtyard garden and glass skylights.",
        "synonym": "intricate",
        "antonym": "simple",
        "confusable": ["ellaborate", "elaberate"]
    },
    "evacuate": {
        "example": "Emergency sirens warned coastal residents to evacuate immediately ahead of the tsunami.",
        "synonym": "vacate",
        "antonym": "occupy",
        "confusable": ["evackuate", "evacuat"]
    },
    "hesitate": {
        "example": "Do not hesitate to ask questions in class whenever you do not understand a concept.",
        "synonym": "pause",
        "antonym": "proceed",
        "confusable": ["hesatate", "hesetate"]
    },
    "inducted": {
        "example": "The legendary cricket captain was formally inducted into the hall of fame yesterday.",
        "synonym": "enrolled",
        "antonym": None,
        "confusable": ["induckted", "inductid"]
    },
    "moderate": {
        "example": "Doctors recommend moderate physical activity such as walking or swimming thirty minutes a day.",
        "synonym": "temperate",
        "antonym": "extreme",
        "confusable": ["modarate", "moderat"]
    },
    "occupy": {
        "example": "Migratory flamingos occupy the brackish mudflats of the bay during the winter months.",
        "synonym": "inhabit",
        "antonym": "vacate",
        "confusable": ["ockupy", "ocupy"]
    },
    "purify": {
        "example": "Boiling is the simplest traditional way to purify river water for drinking in emergencies.",
        "synonym": "cleanse",
        "antonym": "pollute",
        "confusable": ["purefy", "purifie"]
    },
    "recipient": {
        "example": "Kavya was the proud recipient of the highest academic scholarship in her batch.",
        "synonym": "receiver",
        "antonym": "donor",
        "confusable": ["receipient", "recipiant"]
    },
    "reenact": {
        "example": "Historical actors gathered at the fort to reenact the famous treaty signing of 1803.",
        "synonym": "recreate",
        "antonym": None,
        "confusable": ["re-enact", "reenackt"]
    },
    "reliant": {
        "example": "Desert villages are heavily reliant upon the seasonal monsoon rains to replenish wells.",
        "synonym": "dependent",
        "antonym": "independent",
        "confusable": ["relyant", "reliante"]
    },
    "revert": {
        "example": "If the computer system crashes, it will revert automatically to its previous backup state.",
        "synonym": "return",
        "antonym": "progress",
        "confusable": ["reverte", "revertte"]
    },
    "temerity": {
        "example": "No one had the temerity to challenge the fierce pirate captain to a cutlass duel.",
        "synonym": "audacity",
        "antonym": "caution",
        "confusable": ["timidity", "temeritie"]
    },
    "underwhelming": {
        "example": "The much-hyped sci-fi movie was an underwhelming disappointment with poor special effects.",
        "synonym": "disappointing",
        "antonym": "impressive",
        "confusable": ["underwhelme", "underwhelmeing"]
    },
    "wrench": {
        "example": "The fierce storm wind threatened to wrench the front gate completely off its iron hinges.",
        "synonym": "twist",
        "antonym": None,
        "confusable": ["renche", "wrenche"]
    }
}

SPEAKING_SIZE = {
    "abundant": {
        "example": "The tropical rainforest receives abundant rainfall that supports thousands of plant species.",
        "synonym": "plentiful",
        "antonym": "scarce",
        "confusable": ["abundent", "abundantt"]
    },
    "affluence": {
        "example": "The sprawling mansions and manicured estates along the coast were clear signs of affluence.",
        "synonym": "wealth",
        "antonym": "poverty",
        "confusable": ["afluence", "affluance"]
    },
    "ample": {
        "example": "There was ample time before the train arrived to grab a warm cup of cocoa at the station.",
        "synonym": "sufficient",
        "antonym": "insufficient",
        "confusable": ["ampel", "ampl"]
    },
    "clamorous": {
        "example": "A clamorous crowd of cheering fans gathered outside the stadium after the historic win.",
        "synonym": "noisy",
        "antonym": "quiet",
        "confusable": ["clamourous", "clamarous"]
    },
    "colossal": {
        "example": "The engineers constructed a colossal concrete dam across the rushing mountain river.",
        "synonym": "gigantic",
        "antonym": "tiny",
        "confusable": ["collosal", "colosall"]
    },
    "dearth": {
        "example": "The severe drought caused a catastrophic dearth of fresh drinking water in the region.",
        "synonym": "scarcity",
        "antonym": "abundance",
        "confusable": ["derth", "dearthe"]
    },
    "eloquence": {
        "example": "The speaker moved the entire audience to tears with the sheer eloquence of his words.",
        "synonym": "fluency",
        "antonym": "inarticulateness",
        "confusable": ["eloquance", "eloquense"]
    },
    "immense": {
        "example": "Looking across the immense blue expanse of the Pacific Ocean left the sailors in awe.",
        "synonym": "vast",
        "antonym": "minuscule",
        "confusable": ["imense", "immence"]
    },
    "inarticulateness": {
        "example": "His momentary inarticulateness during the interview was caused by sudden stage fright.",
        "synonym": "clumsiness",
        "antonym": "eloquence",
        "confusable": ["inarticulatness", "inarticulatenees"]
    },
    "minuscule": {
        "example": "Under the microscope, tiny bacteria were visible swimming in a minuscule droplet of pond water.",
        "synonym": "tiny",
        "antonym": "colossal",
        "confusable": ["miniscule", "minuscul"]
    },
    "raucous": {
        "example": "The party next door erupted into raucous laughter that kept the entire neighbourhood awake.",
        "synonym": "boisterous",
        "antonym": "subdued",
        "confusable": ["rawcous", "raucus"]
    },
    "scarce": {
        "example": "Fresh water was so scarce in the arid desert that nomads travelled for days between oases.",
        "synonym": "rare",
        "antonym": "abundant",
        "confusable": ["scarse", "scairce"]
    },
    "shrilly": {
        "example": "The tea kettle whistled shrilly on the stove, signalling that the water was boiling.",
        "synonym": "piercingly",
        "antonym": None,
        "confusable": ["shrily", "shrillee"]
    },
    "strident": {
        "example": "The referee blew a loud and strident whistle to immediately stop the rough football tackle.",
        "synonym": "harsh",
        "antonym": "soft",
        "confusable": ["stridant", "stridente"]
    },
    "sufficient": {
        "example": "Make sure you pack sufficient warm clothing and drinking water for the overnight trek.",
        "synonym": "enough",
        "antonym": "insufficient",
        "confusable": ["sufficiant", "suffitient"]
    },
    "taper": {
        "example": "The branches of the spruce tree taper gradually as they reach the snowy mountain top.",
        "synonym": "narrow",
        "antonym": "widen",
        "confusable": ["tapir", "tapere"]
    },
    "terse": {
        "example": "The headmaster gave a terse two-word reply of 'absolutely not' to the student's request.",
        "synonym": "concise",
        "antonym": "verbose",
        "confusable": ["tirse", "terce"]
    },
    "verbose": {
        "example": "His verbose essay was five pages long when a simple one-page summary would have sufficed.",
        "synonym": "wordy",
        "antonym": "terse",
        "confusable": ["verbos", "verbouse"]
    },
    "vociferous": {
        "example": "A vociferous crowd of protesters shouted slogans loudly outside the municipal building.",
        "synonym": "clamorous",
        "antonym": "quiet",
        "confusable": ["vocifrous", "vociferuos"]
    },
    "wrangle": {
        "example": "The two shopkeepers began to wrangle angrily over the ownership of the narrow alleyway.",
        "synonym": "quarrel",
        "antonym": "agree",
        "confusable": ["wrangell", "rangell"]
    }
}

THINKING_SITUATIONS = {
    "acumen": {
        "example": "Her sharp financial acumen helped her turn a small pottery stall into a thriving business.",
        "synonym": "shrewdness",
        "antonym": "stupidity",
        "confusable": ["accumen", "akumen"]
    },
    "apparent": {
        "example": "It soon became apparent that the lost puppy had followed the scent of hot sausages from the kitchen.",
        "synonym": "evident",
        "antonym": "obscure",
        "confusable": ["apparant", "aparrent"]
    },
    "arbitrary": {
        "example": "Choosing the lottery winner by picking a name blindly out of a hat was an arbitrary decision.",
        "synonym": "random",
        "antonym": "reasoned",
        "confusable": ["arbitary", "arbitrairy"]
    },
    "ascertain": {
        "example": "The detectives interviewed all neighbours to ascertain the exact time the power went out.",
        "synonym": "determine",
        "antonym": None,
        "confusable": ["ascertane", "assertain"]
    },
    "baffled": {
        "example": "The challenging crossword puzzle completely baffled even our clever English teacher.",
        "synonym": "perplexed",
        "antonym": "clear",
        "confusable": ["baffeled", "bafled"]
    },
    "benighted": {
        "example": "The isolated village lived in benighted ignorance of modern scientific discoveries for decades.",
        "synonym": "unenlightened",
        "antonym": "enlightened",
        "confusable": ["benightedness", "benightedd"]
    },
    "catastrophe": {
        "example": "The devastating tsunami was a historic catastrophe that destroyed coastal fishing villages.",
        "synonym": "disaster",
        "antonym": "blessing",
        "confusable": ["catastrofe", "catastrophy"]
    },
    "concurrent": {
        "example": "The judge decided that the prison sentences would run concurrent rather than one after another.",
        "synonym": "simultaneous",
        "antonym": None,
        "confusable": ["concurent", "concurrant"]
    },
    "erudite": {
        "example": "The erudite university professor delivered a fascinating lecture on ancient Egyptian architecture.",
        "synonym": "learned",
        "antonym": "ignorant",
        "confusable": ["erudyt", "eruditey"]
    },
    "frenzy": {
        "example": "The children burst into a joyous frenzy when the headmistress announced an unexpected holiday.",
        "synonym": "hysteria",
        "antonym": "calm",
        "confusable": ["frenzey", "phrenzy"]
    },
    "hectic": {
        "example": "Managing two science projects while studying for exams made it a very hectic week for Tara.",
        "synonym": "chaotic",
        "antonym": "leisurely",
        "confusable": ["hectick", "hecticc"]
    },
    "ignorance": {
        "example": "Spreading health facts through school assemblies is the best way to combat ignorance about diseases.",
        "synonym": "unawareness",
        "antonym": "knowledge",
        "confusable": ["ignorence", "ignorantce"]
    },
    "inevitable": {
        "example": "After a dark overcast morning with heavy rumbling thunder, rain was completely inevitable.",
        "synonym": "unavoidable",
        "antonym": "preventable",
        "confusable": ["inevitablee", "inevitible"]
    },
    "juncture": {
        "example": "At this critical juncture in the chess match, one reckless move would forfeit the championship.",
        "synonym": "crossroads",
        "antonym": None,
        "confusable": ["junctuar", "junctur"]
    },
    "obscure": {
        "example": "The ancient stone inscription had grown so obscure over centuries that only scholars could decipher it.",
        "synonym": "unclear",
        "antonym": "clear",
        "confusable": ["obskure", "obscur"]
    },
    "perplex": {
        "example": "Mathematical riddles involving optical illusions will perplex even the smartest students.",
        "synonym": "baffle",
        "antonym": "clarify",
        "confusable": ["perplexe", "perplexx"]
    },
    "stagnant": {
        "example": "Mosquitoes lay their eggs in stagnant puddles of rainwater that have no natural outflow.",
        "synonym": "still",
        "antonym": "flowing",
        "confusable": ["stagnent", "stagnante"]
    },
    "tentative": {
        "example": "The team agreed on a tentative schedule for the picnic, subject to favourable weather.",
        "synonym": "provisional",
        "antonym": "definite",
        "confusable": ["tentetive", "tentitive"]
    },
    "turbulent": {
        "example": "The aeroplane rattled as it flew through a turbulent pocket of storm clouds over the mountains.",
        "synonym": "tempestuous",
        "antonym": "calm",
        "confusable": ["turbelent", "turbulant"]
    },
    "unconscious": {
        "example": "The boxer was knocked unconscious for ten seconds after taking a direct punch to the chin.",
        "synonym": "insensible",
        "antonym": "conscious",
        "confusable": ["unconsious", "unconcious"]
    }
}

