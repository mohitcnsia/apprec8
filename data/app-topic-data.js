import AppTopic from "../models/AppTopic";

export const getTopicData = (parentId) => {
  console.log("Figuring out dataset for Id: " + parentId);
  const dataset = getTopicDataSet(parentId);
  return dataset
    ? dataset.filter((record) => record.parentId === parentId)
    : [];
};

export const getTopicDataSet = (parentId) => {
  console.log("Looking for data with parent id: ", parentId);
  switch (parentId) {
    case "imo": // ideally in DB, we will compare this id to parentId and fetch records
    case "ieo": // this is just a simulation
    case "nso":
    case "iho":
      return olympiadTopics;
    case "psy":
      return psychologyTopics;
    case "rsn":
      return reasoningTopics;
    case "sysd1":
      return systemDesignStudyData;
    default:
      console.error("!! Topic:  " + parentId + " N/A !!");
  }
};

export const olympiadTopics = [
  new AppTopic("4-ieo-noun", "ieo", "Nouns", "ACTIVITY", {
    study: true,
    quiz: true,
  }),
  new AppTopic("4-ieo-pronoun", "ieo", "Pronouns", { study: true, quiz: true }),
  new AppTopic("4-ieo-verb", "ieo", "Verb", { study: true, quiz: true }),
  new AppTopic("4-ieo-adverb", "ieo", "Adverb", { study: true, quiz: true }),
  // if meta is present then it is complext automatically
  new AppTopic("4-ieo-adjective", "ieo", "Adjective", {
    study: true,
    quiz: true,
  }),
  // If QUIZ then directly show Quizscreen. Same for STUDY (show reader)
  new AppTopic("4-ieo-quiz-1", "ieo", "IEO Quiz 1", "QUIZ"),

  new AppTopic("4-imo-add", "imo", "Addition", "ACTIVITY", {
    study: true,
    quiz: true,
  }),
  new AppTopic("4-imo-sub", "imo", "Subtraction", "ACTIVITY", {
    study: true,
    quiz: true,
  }),
  new AppTopic("4-imo-div", "imo", "Divison", "ACTIVITY", {
    study: true,
    quiz: true,
  }),
  new AppTopic("4-imo-mul", "imo", "Multiplication", "ACTIVITY", {
    study: true,
    quiz: true,
  }),

  // new AppTopic("4-imo-5", "imo", "Coming Soon", null, null),
  // new AppTopic("4-imo-6", "imo", "Comin Soon", null, null),

  new AppTopic("4-nso-1", "nso", "Topic 1", "LINK"),
  new AppTopic("4-nso-2", "nso", "Topic 2", "LINK"),
  new AppTopic("4-nso-3", "nso", "Topic 3", "LINK"),
  new AppTopic("4-nso-4", "nso", "Topic 4", "LINK"),

  new AppTopic("4-iho-1", "iho", "Topic 1", "LINK"),
  new AppTopic("4-iho-2", "iho", "Topic 2", "LINK"),
  new AppTopic("4-iho-3", "iho", "Topic 3", "LINK"),
  new AppTopic("4-iho-4", "iho", "Topic 4", "LINK"),
];

// export const psychologyTopics = [
//   {
//     id: "sam-psy-1",
//     parentId: "psy",
//     title: "1. Intro to Psychology",
//     type: "ACTIVITY",
//     activities: { study: true, quiz: true },
//   },
//   {
//     id: "sam-psy-2",
//     parentId: "psy",
//     title: "2. Methods of Enquiry",
//     type: "ACTIVITY",
//     activities: { study: true, quiz: true },
//   },
//   {
//     id: "sam-psy-3",
//     parentId: "psy",
//     title: "3. Human Development",
//     type: "ACTIVITY",
//     activities: { study: true, quiz: true },
//   },
//   {
//     id: "sam-psy-4",
//     parentId: "psy",
//     title: "4. Sensory, Attention and ...",
//     type: "ACTIVITY",
//     activities: { study: true, quiz: true },
//   },
//   {
//     id: "sam-psy-5",
//     parentIds: ["psy"],
//     title: "5. Learning",
//     type: "ACTIVITY",
//     activities: { study: true, quiz: true },
//   },
//   {
//     id: "sam-psy-6",
//     parentId: "psy",
//     title: "6. Human Memory",
//     type: "ACTIVITY",
//     activities: { study: true, quiz: true },
//   },
//   {
//     id: "sam-psy-7",
//     parentId: "psy",
//     title: "7. Thinking",
//     type: "ACTIVITY",
//     activities: { study: true, quiz: true },
//   },
//   {
//     id: "sam-psy-8",
//     parentId: "psy",
//     title: "8. Motivation and Emotion",
//     type: "ACTIVITY",
//     activities: { study: true, quiz: true },
//   },
// ];

export const reasoningTopics = [
  {
    id: "4-sam-rsn-1",
    parentId: "rsn",
    title: "1. Patterns",
    type: "ACTIVITY",
    activities: { study: true, quiz: true },
  },
  {
    id: "4-sam-rsn-2",
    parentId: "rsn",
    title: "2. Alphabet Test",
    type: "ACTIVITY",
    activities: { study: true, quiz: true },
  },
  {
    id: "4-sam-rsn-3",
    parentId: "rsn",
    title: "3. Coding-Decoding",
    type: "ACTIVITY",
    activities: { study: true, quiz: true },
  },
  {
    id: "4-sam-rsn-4",
    parentId: "rsn",
    title: "4. Ranking Test",
    type: "ACTIVITY",
    activities: { study: true, quiz: true },
  },
  {
    id: "4-sam-rsn-5",
    parentId: "rsn",
    title: "5. Mirror Images",
    type: "ACTIVITY",
    activities: { study: true, quiz: true },
  },
  {
    id: "4-sam-rsn-6",
    parentId: "rsn",
    title: "6. Geometrical Shapes & Solids",
    type: "ACTIVITY",
    activities: { study: true, quiz: true },
  },
  {
    id: "4-sam-rsn-7",
    parentId: "rsn",
    title: "7. Embedded Figures",
    type: "ACTIVITY",
    activities: { study: true, quiz: true },
  },
  {
    id: "4-sam-rsn-8",
    parentId: "rsn",
    title: "Direction Sense Test",
    type: "ACTIVITY",
    activities: { study: true, quiz: true },
  },
  {
    id: "4-sam-rsn-9",
    parentId: "rsn",
    title: "9. Possible Combinations",
    type: "ACTIVITY",
    activities: { study: true, quiz: true },
  },
  {
    id: "4-sam-rsn-10",
    parentId: "rsn",
    title: "10. Analogy & Classification",
    type: "ACTIVITY",
    activities: { study: true, quiz: true },
  },
  {
    id: "4-sam-rsn-11",
    parentId: "rsn",
    title: "11. Clock & Calendar",
    type: "ACTIVITY",
    activities: { study: true, quiz: true },
  },
];

export const helpTopics = [
  { id: "faq", title: "FAQs" },
  { id: "cntct", title: "Contact Us" },
  { id: "tnc", title: "Terms and Privacy Policy" },
];

export const bookSummaryTopics = [];

export const storyTopics = [];

export const systemDesignTopics = [
  {
    id: "sysd1",
    name: "Reliability, Scalability & Maintainability",
    author: "Mohit Chilkoti",
    coverImage:
      "https://media.istockphoto.com/id/495737046/vector/kids-reading-books-in-colour.jpg?s=2048x2048&w=is&k=20&c=XasE_9gSy7Psx9nIbKj0WP8F6P7_hk6BlQLZKnKltfE=",
    content: `## Introduction
  When building modern --software--, three key concerns arise: **reliability, scalability, and maintainability**.
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
    additionalImages: [
      "https://cdn.pixabay.com/photo/2024/05/17/11/24/foxes-8768091_1280.jpg",
    ],
  },
];

export const Topics = [];

export const getCollection = (id) => {};
