import AppTopicQuiz from "../../models/AppTopicQuiz";

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
      return psychologyStudyData;
    case "sysd1":
      return systemDesignStudyData;
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
    id: "sam-psy-1-study",
    name: "2. Methods of Enquiry",
    parentId: "sam-psy-2",
    author: "Seema Joshi",
    content: `## Introduction
    Here is the study of Methods of Enquiry.`,
    type: "STUDY",
  },
  {
    id: "sam-psy-1-study",
    name: "3. Human Development",
    parentId: "sam-psy-3",
    author: "Seema Joshi",
    content: `## Introduction 
    Not every Human gets Developed. `,
    type: "STUDY",
  },
  {
    id: "sam-psy-1-study",
    name: "4. Sensory Attention",
    parentId: "sam-psy-4",
    author: "Seema Joshi",
    content: `## Introduction 
    Sensory or unsensory we are not going to pay attention.`,
    type: "STUDY",
  },
  {
    id: "sam-psy-1-study",
    name: "5. Learning",
    parentId: "sam-psy-5",
    author: "Seema Joshi",
    content: `## Introduction 
    Everything that is useless stays in Memory foever.`,
    type: "STUDY",
  },
  {
    id: "sam-psy-1-study",
    name: "6. Human Memory",
    parentId: "sam-psy-5",
    author: "Seema Joshi",
    content: `## Introduction 
    Everything that is useless stays in Memory foever.`,
    type: "STUDY",
  },
  {
    id: "sam-psy-1-study",
    name: "7. Thinking",
    parentId: "sam-psy-6",
    author: "Seema Joshi",
    content: `## Introduction 
    Garbage in Garbage out.`,
    type: "STUDY",
  },
  {
    id: "sam-psy-1-study",
    name: "8. Motivation and Emotion",
    parentId: "sam-psy-7",
    author: "Seema Joshi",
    content: `## Introduction 
    No motivation, all emotion`,
    type: "STUDY",
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

export const systemDesignStudyData = [
  {
    id: "1-sys-d1",
    name: "Reliability, Scalability & Maintainability",
    parentId: "sysd",
    author: "Mohit Chilkoti",
    content: `## Introduction
      When building modern --software--, three key concerns arise: **reliability, scalability, and maintainability**.
      These attributes ensure that a system can handle failures, grow with demand, and be easy to evolve.`,
    type: "STUDY",
  },
];

export const tileStudyData = [
  {
    id: "sysd",
    name: "Reliability, Scalability & Maintainability",
    author: "Mohit Chilkoti",
    content: `## Introduction
      When building modern --software--, three key concerns arise: **reliability, scalability, and maintainability**.
      These attributes ensure that a system can handle failures, grow with demand, and be easy to evolve.`,
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
