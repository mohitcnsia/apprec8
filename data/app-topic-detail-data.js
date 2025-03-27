import AppTopicQuiz from "../models/AppTopicQuiz";

export const getTopicStudy = (parentId) => {
  console.log("Figuring out Study dataset for Parent Id: " + parentId);
  const dataset = getTopicStudyDataSet(parentId);
  const result = dataset.find((record) => record.parentId === parentId);
  console.log("result: " + result.content);
  return result;
};

export const getTopicStudyDataSet = (parentId) => {
  console.log("Looking for Study data with parentId: ", parentId);
  switch (parentId) {
    case "4-imo-div":
    case "4-imo-add":
    case "4-imo-sub":
    case "4-imo-mul": // ideally in DB, we will compare this id to parentId and fetch records
      return imoStudyData;

    case "sam-psy-1":
    case "sam-psy-2":
    case "sam-psy-3":
    case "sam-psy-4":
    case "sam-psy-5":
    case "sam-psy-6":
    case "sam-psy-7":
    case "sam-psy-8":
      return psychologyStudyData;
    case "4-sam-rsn-1":
    case "4-sam-rsn-2":
    case "4-sam-rsn-3":
    case "4-sam-rsn-4":
    case "4-sam-rsn-5":
    case "4-sam-rsn-6":
    case "4-sam-rsn-7":
    case "4-sam-rsn-8":
    case "4-sam-rsn-9":
    case "4-sam-rsn-10":
    case "4-sam-rsn-11":
      return reasoningStudyData;
    // case "sysd1":
    //   return systemDesignStudyData;
    default:
      console.log("!!!!!!!!!" + parentId + " doesn't exist yet !!!!!!!!!");
      return [];
  }
};

export const getTopicQuiz = (parentId) => {
  console.log("Figuring out Quiz dataset for Parent Id: " + parentId);
  const dataset = getTopicQuizDataSet(parentId);
  return dataset.filter((record) => record.parentId === parentId);
};

export const getTileStudy = (id) => {
  return tileStudyData.find((record) => record.id === id);
};

export const getTileQuiz = (id) => {
  return tileQuizData.find((record) => record.id === id);
};

export const getTopicQuizDataSet = (parentId) => {
  console.log("Looking for Quiz data with parentId: ", parentId);
  switch (parentId) {
    case "4-imo-div": // this is just a simulation
    case "4-imo-mul":
    case "4-imo-sub":
    case "4-imo-add":
      return imoQuizData;
    default:
      console.log("!!!!!!!!!" + parentId + " doesn't exist yet !!!!!!!!!");
      return [];
  }
};

/**
 * This of this as a response from Database where you wanted to fetch results where parentId is 4-imo-divison.
 * For parent Id you will get all the results (paginated).
 * If you look at individual item in imoData array, you'll notice an Id field, which can be used to
 * fetch individual item from DB (for later per optimisation. Will be useful when large documents
 * need to be divided by headings for example).
 */
export const imoStudyData = [
  {
    id: "4-imo-div-study",
    name: "Divison",
    parentId: "4-imo-div",
    author: "Mohit Chilkoti",
    content: `## Introduction\n This is **Dummy** Data for IMO Devison Class`,
    type: "STUDY",
  },
  {
    id: "4-imo-add-study",
    name: "Addition",
    parentId: "4-imo-add",
    author: "Mohit Chilkoti",
    content: `## Introduction 
    This is dummy data for IMO Addition Class.`,
    type: "STUDY",
  },
  {
    id: "4-imo-sub-study",
    name: "Subtraction",
    parentId: "4-imo-sub",
    author: "Mohit Chilkoti",
    content: `## Introduction 
    This is dummy data for IMO Subtraction Class.`,
    type: "STUDY",
  },
  {
    id: "4-imo-mul-study",
    name: "Multiplication",
    parentId: "4-imo-mul",
    author: "Mohit Chilkoti",
    content: `## Introduction 
    This is dummy data for IMO Multiplication Class.`,
    type: "STUDY",
  },
];

export const imoQuizData = [
  new AppTopicQuiz(53, "41888 divisible by __", ["8", "11", "9", "4"], "8", [
    "A number is divisible by 8 if the Sum of its last Three digits is divisible by 8.",
    "4-imo-div",
  ]),
  new AppTopicQuiz(
    54,
    "Is 5467984 divisible by 4 ?",
    ["Yes", "No", "Not Sure"],
    "Yes",
    [
      "A number is divisible by 4 if the Sum of its last Two digits is divisible by 4.",
    ],
    "4-imo-div"
  ),
  new AppTopicQuiz(
    50,
    "19 x __ = 152",
    ["6", "7", "8", "9"],
    "8",
    "",
    "4-imo-mul"
  ),
  new AppTopicQuiz(
    51,
    "18 x __ = 162",
    ["6", "7", "8", "9"],
    "9",
    "",
    "4-imo-mul"
  ),
  new AppTopicQuiz(
    52,
    "19 x __ = 171",
    ["6", "7", "8", "9"],
    "9",
    "",
    "4-imo-div"
  ),
];

//new AppTopic("4-ieo-noun", "ieo", "Nouns", { study: yes, quiz: yes }),
export const ieoStudyData = [
  {
    id: "4-ieo-noun-study",
    name: "Noun",
    parentId: "4-ieo-noun",
    author: "Mohit Chilkoti",
    content: `## Introduction Noun is the name of a Person, Place or a thing.`,
    type: "STUDY",
  },
];

export const psychologyStudyData = [
  {
    id: "sam-psy-1-study",
    name: "1. Intro to Psychology",
    parentId: "sam-psy-1",
    author: "Seema Joshi",
    content: `## Introduction Psychology is the study of Brain.`,
    type: "STUDY",
  },
  {
    id: "sam-psy-2-study",
    name: "2. Methods of Enquiry",
    parentId: "sam-psy-2",
    author: "Seema Joshi",
    content: `## Introduction
    Here is the study of Methods of Enquiry.`,
    type: "STUDY",
  },
  {
    id: "sam-psy-3-study",
    name: "3. Human Development",
    parentId: "sam-psy-3",
    author: "Seema Joshi",
    content: `## Introduction 
    Not every Human gets Developed. `,
    type: "STUDY",
  },
  {
    id: "sam-psy-4-study",
    name: "4. Sensory Attention",
    parentId: "sam-psy-4",
    author: "Seema Joshi",
    content: `## Introduction 
    Sensory or unsensory we are not going to pay attention.`,
    type: "STUDY",
  },
  {
    id: "sam-psy-5-study",
    name: "5. Learning",
    parentId: "sam-psy-5",
    author: "Seema Joshi",
    content: `## Introduction 
    Everything that is useless stays in Memory foever.`,
    type: "STUDY",
  },
  {
    id: "sam-psy-6-study",
    name: "6. Human Memory",
    parentId: "sam-psy-6",
    author: "Seema Joshi",
    content: `## Introduction 
    Everything that is useless stays in Memory forever.`,
    type: "STUDY",
  },
  {
    id: "sam-psy-7-study",
    name: "7. Thinking",
    parentId: "sam-psy-7",
    author: "Seema Joshi",
    content: `## Introduction 
    Garbage in Garbage out.`,
    type: "STUDY",
  },
  {
    id: "sam-psy-8-study",
    name: "8. Motivation and Emotion",
    parentId: "sam-psy-8",
    author: "Seema Joshi",
    content: `## Introduction 
    No motivation, all emotion`,
    type: "STUDY",
  },
];

export const reasoningStudyData = [
  {
    id: "4-sam-rsn-1-study",
    parentId: "4-sam-rsn-1",
    name: "1. Patterns",
    author: "Seema Joshi",
    content: `## Introduction 
    Patterns are everywhere.`,
    type: "ACTIVITY",
    activities: { study: true, quiz: true },
  },
  {
    id: "4-sam-rsn-2-study",
    parentId: "4-sam-rsn-2",
    name: "2. Alphabet Test",
    author: "Seema Joshi",
    content: `## Introduction`,
    type: "ACTIVITY",
    activities: { study: true, quiz: true },
  },
  {
    id: "4-sam-rsn-3-study",
    parentId: "4-sam-rsn-3",
    name: "3. Coding-Decoding",
    author: "Seema Joshi",
    content: `## Introduction`,
    type: "ACTIVITY",
    activities: { study: true, quiz: true },
  },
  {
    id: "4-sam-rsn-4-study",
    parentId: "4-sam-rsn-4",
    name: "4. Ranking Test",
    author: "Seema Joshi",
    content: `## Introduction`,
    type: "ACTIVITY",
    activities: { study: true, quiz: true },
  },
  {
    id: "4-sam-rsn-5-study",
    parentId: "4-sam-rsn-5",
    name: "5. Mirror Images",
    author: "Seema Joshi",
    content: `## Introduction`,
    type: "ACTIVITY",
    activities: { study: true, quiz: true },
  },
  {
    id: "4-sam-rsn-6-study",
    parentId: "4-sam-rsn-6",
    name: "6. Geometrical Shapes & Solids",
    author: "Seema Joshi",
    content: `## Introduction`,
    type: "ACTIVITY",
    activities: { study: true, quiz: true },
  },
  {
    id: "4-sam-rsn-7-study",
    parentId: "4-sam-rsn-7",
    name: "7. Embedded Figures",
    author: "Seema Joshi",
    content: `## Introduction`,
    type: "ACTIVITY",
    activities: { study: true, quiz: true },
  },
  {
    id: "4-sam-rsn-8-study",
    parentId: "4-sam-rsn-8",
    name: "Direction Sense Test",
    author: "Seema Joshi",
    content: `## Introduction`,
    type: "ACTIVITY",
    activities: { study: true, quiz: true },
  },
  {
    id: "4-sam-rsn-9-study",
    parentId: "4-sam-rsn-9",
    name: "9. Possible Combinations",
    author: "Seema Joshi",
    content: `## Introduction`,
    type: "ACTIVITY",
    activities: { study: true, quiz: true },
  },
  {
    id: "4-sam-rsn-10-study",
    parentId: "4-sam-rsn-10",
    name: "10. Analogy & Classification",
    author: "Seema Joshi",
    content: `## Introduction`,
    type: "ACTIVITY",
    activities: { study: true, quiz: true },
  },
  {
    id: "4-sam-rsn-11-study",
    parentId: "4-sam-rsn-11",
    name: "11. Clock & Calendar",
    author: "Seema Joshi",
    content: `## Introduction`,
    type: "ACTIVITY",
    activities: { study: true, quiz: true },
  },
];

export const ieoQuizData = [
  new AppTopicQuiz(
    1,
    "Select a noun?",
    ["Glad", "Very", "Pratha", "Secretly"],
    "Pratha",
    "",
    "4-ieo-noun"
  ),
  new AppTopicQuiz(
    2,
    "Which one is not a noun?",
    ["Seema", "Mohit", "Pratha", "Secretly"],
    "Secretly",
    "",
    "4-ieo-noun"
  ),
  new AppTopicQuiz(
    3,
    "Select a noun?",
    ["Glad", "Very", "Pratha", "Secretly"],
    "Pratha",
    "",
    "4-ieo-noun"
  ),
  new AppTopicQuiz(
    4,
    "Select a noun?",
    ["Glad", "Very", "Pratha", "Secretly"],
    "Pratha",
    "",
    "4-ieo-noun"
  ),
  new AppTopicQuiz(
    5,
    "Select a noun?",
    ["Glad", "Very", "Pratha", "Secretly"],
    "Pratha",
    "",
    "4-ieo-noun"
  ),
  new AppTopicQuiz(
    6,
    "Select a noun?",
    ["Glad", "Very", "Pratha", "Secretly"],
    "Pratha",
    "",
    "4-ieo-noun"
  ),
];

export const tileStudyData = [
  {
    id: "sysd",
    name: "Reliability, Scalability & Maintainability",
    author: "Mohit Chilkoti",
    coverImage:
      "https://media.istockphoto.com/id/495737046/vector/kids-reading-books-in-colour.jpg?s=2048x2048&w=is&k=20&c=XasE_9gSy7Psx9nIbKj0WP8F6P7_hk6BlQLZKnKltfE=",

    content: `## Introduction\nWhen building modern --software--, three key concerns arise: **reliability, scalability, and maintainability**.
  These attributes ensure that a system can handle failures, grow with demand, and be easy to evolve.
  
  ## Reliability
  A system is considered **reliable** if it continues to function correctly despite failures. Failures can be:
    - **Hardware Failures**: Disks crash, network outages occur.
    - **Software Bugs**: Memory leaks, unhandled edge cases.
    - **Human Errors**: Misconfigurations, accidental data deletions.
  Techniques for improving reliability:
    - **Replication**: Keeping multiple copies of data.
    - **Fault Isolation**: Microservices prevent cascading failures.
    - **Monitoring & Alerting**: Proactive failure detection.
  
  ![System Reliability](https://miro.medium.com/v2/resize:fit:720/format:webp/1*8u2Z2PKlXFan9sGivriTDw.jpeg)
    
  ## Scalability
  A system is **scalable** if it can handle increased load effectively. Two primary ways to scale:
  1. **Vertical Scaling** (Scaling Up) – Adding more resources (CPU, RAM) to a single machine.
  2. **Horizontal Scaling** (Scaling Out) – Adding more machines to distribute the load.
  
  Key scalability factors:
  - **Latency vs. Throughput**: Lowering response time vs. handling more requests.
  - **Elasticity**: Auto-scaling infrastructure like AWS Auto Scaling.
  - **Load Balancing**: Distributing requests among multiple nodes.
  
  ## Maintainability
  Software needs to be easy to modify and extend. This involves:
  - **Modularity**: Well-defined boundaries between components.
  - **Automation**: CI/CD pipelines for seamless deployments.
  - **Observability**: Logs, metrics, and distributed tracing.
  
  Maintaining a **data-intensive** system is even more critical as systems evolve.
  
  ## Conclusion
  Reliability, scalability, and maintainability are foundational principles in designing **data-intensive applications**. Engineers must balance trade-offs while choosing the right architecture for their systems.`,
  },

  {
    id: "bgh1",
    name: "Buddha: The Prince Who Found Peace",
    author: "Apprec8",
    content: `

#### **1. The Prince Who Had Everything**  
Long ago in **India** (around 563 BCE), a prince named **Siddhartha Gautama** was born. His father, King Suddhodana, gave him a palace full of riches, hoping he’d become a great king.  
&nbsp;
#### **2. The Four Surprises**  
Siddhartha grew up sheltered, but one day, he sneaked out and saw:  
- An **old man** (aging),  
- A **sick man** (suffering),  
- A **dead man** (mortality),  
- A **peaceful monk** (contentment).  

This shocked him! He realized **life is full of pain**, and he wanted to find a way to end suffering.  
&nbsp;
#### **3. The Great Quest**  
At age **29**, Siddhartha left his palace, family, and riches to become a wandering monk. For years, he meditated, starved himself, and studied—but still felt unsatisfied.  
&nbsp;
#### **4. The Enlightenment**  
One day, he sat under a **Bodhi tree** and vowed not to move until he found answers. After **49 days of meditation**, he finally understood:  
- **Why we suffer** (attachment and desire).  
- **How to end suffering** (the **Middle Way**—not too much luxury, not too much hardship).  

He became **"Buddha"** ("The Awakened One") at age **35**.  
&nbsp;
#### **5. The Teacher of Peace**  
For **45 years**, Buddha traveled, teaching **Four Noble Truths** and the **Eightfold Path** (like being kind, honest, and mindful). His followers grew into millions!  
&nbsp;
#### **6. The Final Peace**  
At **80**, Buddha passed away (called **"Parinirvana"**), but his teachings live on today in **Buddhism**.  

---
&nbsp;
### **Fun Facts:**  
🌿 **Buddha didn’t worship gods**—he taught **self-effort** ("Be your own light!").  
🐘 His birth symbol was a **white elephant** (a dream his mom had before he was born!).  
☸️ The **"Wheel of Dharma"** (Buddhist symbol) represents his teachings rolling across the world.

Here’s a **child-friendly summary** of Buddha’s **Four Noble Truths** and **Eightfold Path**, formatted with tiny-text tricks for GitHub:

---

---
&nbsp;

**Moral**: *"Happiness comes from within, not from things!"*

 `,
    type: "STUDY",
  },

  {
    id: "akbb1",
    name: "Crows in the Kingdom",
    author: "Apprec8",
    content: `

**One day, Emperor Akbar** wanted to test Birbal’s cleverness. He pointed to a flock of crows in the palace garden and asked:  

*"Birbal, how many crows live in my kingdom?"*  

(Everyone gasped—how could *anyone* count all the crows?!)  

**Birbal** (without hesitating): *"Your Majesty, there are exactly **99,999** crows."*  

**Akbar** (smirking): *"What if there are *more*?"*  

**Birbal**: *"Then some crows must be visiting from other kingdoms!"*  

**Akbar** (laughing): *"And if there are *fewer*?"*  

**Birbal**: *"Then some of *your* crows must be vacationing abroad!"*  

The court burst into laughter, and Akbar rewarded Birbal for his wit.  

`,
    type: "STUDY",
  },

  {
    id: "pct1",
    name: "बंदर और मगरमच्छ",
    author: "Mohit Chilkoti",
    content: `
एक बंदर नदी के किनारे एक बेर के पेड़ पर रहता था। एक मगरमच्छ रोज़ उसके पास आता और बंदर उसे मीठे बेर देता। थोड़े ही समय में दोनों अच्छे दोस्त बन गए।  

एक दिन मगरमच्छ की पत्नी ने ज़िद की कि : "इस बंदर का दिल खाना चाहिए!"

पत्नी की बात मानकर मगरमच्छ बंदर के पास गया और बोला की आज तुम्हारी भाभी ने तुमको खाने पर बुलाया है।
ऐसा कहकर वह बंदर को अपनी पीठ पर बैठाकर अपने घर को चल पड़ा। नदी के बीच में पहुँच कर उसने बंदर को सच बताया।

बंदर ने चालाकी से कहा: "अरे! पर मैं तो अपना दिल पेड़ पर ही छोड़ आया हूँ! तुमने मुझे पहले क्यों नहीं बताया? चलो वापस चलकर पेड़ से मेरा दिल ले आते हैं।"  

जैसे ही वे किनारे पहुँचे, बंदर पेड़ पर कूद गया और नाराज़ होकर बोला - "अब कभी इधर मत आना धोखेबाज़ !!"  

**नैतिक शिक्षा (Moral):**  
1. बुद्धि बल से बड़ी होती है  
2. दोस्ती में धोखा नहीं देना चाहिए
`,
    type: "STUDY",
  },

  // Stories

  {
    id: "harry1",
    name: "Harry Potter and the Philosopher’s Stone",
    author: "Pratha Chilkoti",
    content: `Harry Potter, an orphan raised by cruel relatives, discovers he’s a wizard on his 11th birthday. At Hogwarts School, he befriends Ron Weasley and Hermione Granger, and they uncover a plot to steal the Philosopher’s Stone (which grants immortality).

**Key events**

- The Sorting Hat puts Harry in Gryffindor.

- They face a three-headed dog named Fluffy, a life-sized chess game, and a mirror that shows desires.

- Harry learns the stone is hidden at Hogwarts, guarded by traps.

In the climax, Harry confronts Professor Quirrell, who’s secretly hosting the dark wizard Voldemort. The Stone burns Quirrell when Harry touches him (due to his mother’s protective love magic). Harry wakes in the hospital wing, and Headmaster Dumbledore explains how love is the most powerful magic.

**Themes** Friendship, courage, and good vs. evil.`,
    type: "STUDY",
  },
  {
    id: "matilda",
    name: "Matilda",
    author: "Pratha Chilkoti",
    content: `Matilda Wormwood is a **child genius** neglected by her TV-obsessed parents. At school, she befriends her sweet teacher Miss Honey and faces the **tyrannical principal Miss Trunchbull**, who throws children out windows and locks them in the "Chokey" (a nail-filled closet).  

Matilda discovers **telekinetic powers**—she can move objects with her mind! She uses them to play pranks on her parents (like gluing her dad’s hat to his head) and helps Miss Honey reclaim her stolen inheritance from Miss Trunchbull.  

In the climax, Matilda **haunts Miss Trunchbull** by writing a ghost message on the chalkboard, making her faint and flee town. Miss Honey adopts Matilda, and they live happily in Miss Honey’s cottage, reading books together.  

**Themes:** The power of intelligence, standing up to bullies, and found family. `,
    type: "STUDY",
  },
  {
    id: "tgwdtm",
    name: "The Girl Who Drank the Moon",
    author: "Mohit Chilkoti",
    content: `Every year, the Protectorate village sacrifices a baby to the "witch" in the forest. Unbeknownst to them, the kind witch **Xan** rescues these babies and gives them to loving families. One year, Xan accidentally feeds baby Luna **starlight-infused moonlight**, filling her with magic.  

Xan raises Luna with a tiny dragon (Fyrian) and a swamp monster (Glerk). As Luna’s 13th birthday nears, her magic surges uncontrollably. Meanwhile, in the Protectorate, a young man named **Antain** begins questioning the sacrifice ritual.  

The story weaves together Luna’s journey to control her magic, Xan’s secret past, and the Protectorate’s liberation from lies. In the end, Luna **breaks the curse** of sorrow over the village and reunites with her birth mother.  

**Themes:** Love vs. fear, the cost of lies, and how magic exists in kindness. `,
    type: "STUDY",
  },
  {
    id: "bfg",
    name: "The BFG",
    author: "Seema Joshi",
    content: `Sophie, an orphan in London, is snatched one night by a **24-foot-tall giant**. But unlike other giants who eat humans, the **BFG (Big Friendly Giant)** is kind and only eats disgusting snozzcumbers. He reveals that **nine man-eating giants** (like Fleshlumpeater and Bloodbottler) terrorize the world every night.  

The BFG shows Sophie how he **catches dreams** in Dream Country using a butterfly net, storing good dreams in jars to blow into children's bedrooms. Sophie hatches a plan to **stop the evil giants** with help from the Queen of England. In a hilarious scene, the BFG serves the Queen a frobscottle (a fizzy drink that causes whizzpoppers—giant farts!), making her guards float upside down.  

With the Queen’s army, they **trap the giants** while they sleep, airlift them to England, and imprison them in a pit where they eat snozzcumbers forever. The BFG gets a **house next to the Queen**, and Sophie becomes his family.  

**Themes:** Friendship, bravery, and how even small people (or giants) can change the world. `,
    type: "STUDY",
  },
];

export const tileQuizData = [
  {
    id: "dog-quiz-1",
    quizItems: [
      {
        id: "dq-1",
        question: "Which is the fastest dog breed?",
        options: ["Greyhound", "Rottweiler", "Labrador", "Bulldog"],
        answer: "Greyhound",
        explanation: [
          "Greyhounds can reach speeds up to 45 mph, making them the fastest dog breed.",
        ],
      },
      {
        id: "dq-2",
        question:
          "What is the most popular dog breed in the U.S. (as of 2023)?",
        options: [
          "German Shepherd",
          "Golden Retriever",
          "French Bulldog",
          "Beagle",
        ],
        answer: "French Bulldog",
        explanation: [
          "French Bulldogs surpassed Labradors as the most popular breed due to their compact size and friendly nature.",
        ],
      },
      {
        id: "dq-3",
        question: "Which dog has the strongest bite force?",
        options: ["Pit Bull", "German Shepherd", "Kangal", "Doberman"],
        answer: "Kangal",
        explanation: [
          "The Kangal has a bite force of around 743 PSI (Pounds per Square Inch), the strongest among dog breeds.",
          "Human bite: 150–200 PSI",
          "Hammer hitting a nail: Around 500 PSI",
          "Lion bite: 650 PSI",
          "Polar bear’s bite: 1200 PSI, strongest in nature !!",
        ],
      },
      {
        id: "dq-4",
        question: "Which breed was originally bred to hunt badgers?",
        options: ["Dachshund", "Siberian Husky", "Boxer", "Dalmatian"],
        answer: "Dachshund",
        explanation: [
          "Dachshunds were bred in Germany to hunt badgers, with their long bodies perfect for digging into burrows.",
        ],
      },
      {
        id: "dq-5",
        question: "What is the smallest dog breed in the world?",
        options: ["Chihuahua", "Pomeranian", "Yorkshire Terrier", "Shih Tzu"],
        answer: "Chihuahua",
        explanation: [
          "The Chihuahua is the smallest breed, typically weighing between 2–6 pounds.",
        ],
      },
      {
        id: "dq-6",
        question: "Which dog breed has a blue-black tongue?",
        options: ["Chow Chow", "Shiba Inu", "Shar-Pei", "Akita"],
        answer: "Chow Chow",
        explanation: [
          "The Chow Chow is known for its distinctive blue-black tongue, a trait shared with only a few other breeds.",
        ],
      },
      {
        id: "dq-7",
        question: "Which breed is known as the 'Snoopy' dog?",
        options: ["Beagle", "Basset Hound", "Cocker Spaniel", "Pug"],
        answer: "Beagle",
        explanation: [
          "Snoopy from 'Peanuts' is a Beagle, known for their floppy ears and curious nature.",
        ],
      },
      {
        id: "dq-8",
        question: "Which dog was once used to guard Tibetan monasteries?",
        options: [
          "Saint Bernard",
          "Tibetan Mastiff",
          "Great Dane",
          "Bernese Mountain Dog",
        ],
        answer: "Tibetan Mastiff",
        explanation: [
          "Tibetan Mastiffs were bred to guard monasteries in the Himalayas. Today, some still do, but many now protect families or are treasured as super-expensive pets!",
        ],
      },
      {
        id: "dq-9",
        question: "What is the average lifespan of a Labrador Retriever?",
        options: ["5–8 years", "8–10 years", "10–12 years", "12–14 years"],
        answer: "10–12 years",
        explanation: [
          "Labrador Retrievers typically live 10–12 years, though some can live longer with good care.",
        ],
      },
      {
        id: "dq-10",
        question: "Which breed is famous for its role in '101 Dalmatians'?",
        options: [
          "Dalmatian",
          "Border Collie",
          "Australian Shepherd",
          "Siberian Husky",
        ],
        answer: "Dalmatian",
        explanation: [
          "Disney's '101 Dalmatians' made the breed famous for their unique spotted coats.",
        ],
      },
    ],
  },
];
