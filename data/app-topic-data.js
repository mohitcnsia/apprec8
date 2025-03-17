import Topic from "../models/quiz/topic";

export const olympiadTopics = [
  new Topic(
    "ieo",
    "International English Olympiad",
    "The International English Olympiad (IEO) is an English language and Grammar competition for students of class 1 to class 12. It is conducted by Science Olympiad Foundation (SOF) in collaboration with British Council. The content of the tests is designed to focus on communication and use of English language, rather than rote learning and correct grammar only. Participants of IEO are ranked on the basis of marks obtained in 1st Level. After taking the first level of the test, students can judge themselves academically at four different levels - within the school, at city level, at state level and above all at International level."
  ),
  new Topic(
    "nso",
    "International Science Olympiad",
    "International Science Olympiad"
  ),
  new Topic(
    "imo",
    "International Mathematics Olympiad",
    "International Mathematics Olympiad"
  ),
  new Topic(
    "iho",
    "International Hindi Olympiad",
    "International Hindi Olympiad"
  ),
];

export const psychologyTopics = [
  {
    id: "sam-psy-1",
    parentIds: ["psy"],
    title: "Intro to Psychology",
  },
  {
    id: "sam-psy-2",
    parentIds: ["psy"],
    title: "Methods of Enquiry",
  },
  {
    id: "sam-psy-3",
    parentIds: ["psy"],
    title: "Human Development",
  },
  {
    id: "sam-psy-4",
    parentIds: ["psy"],
    title: "Sensory, Attention and ...",
  },
  {
    id: "sam-psy-5",
    parentIds: ["psy"],
    title: "Learning",
  },
  {
    id: "sam-psy-6",
    parentIds: ["psy"],
    title: "Human Memory",
  },
  {
    id: "sam-psy-7",
    parentIds: ["psy"],
    title: "Thinking",
  },
  {
    id: "sam-psy-8",
    parentIds: ["psy"],
    title: "Motivation and Emotion",
  },
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
