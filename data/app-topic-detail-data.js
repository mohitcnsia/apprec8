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
