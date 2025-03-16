import React from "react";
import { View, Button } from "react-native";

const Apprec8ReaderTester = ({ navigation }) => {
  const cap = {
    title: "CAP Theorem & Databases",
    author: "Mohit Chilkoti",
    coverImage:
      "https://media.istockphoto.com/id/495737046/vector/kids-reading-books-in-colour.jpg?s=2048x2048&w=is&k=20&c=XasE_9gSy7Psx9nIbKj0WP8F6P7_hk6BlQLZKnKltfE=",
    content:
      "## Understanding CAP Theorem\n" +
      "CAP theorem, formulated by Eric Brewer, states that a distributed data store can only achieve two out of the three guarantees: **Consistency (C)**, **Availability (A)**, and **Partition Tolerance (P)**.\n" +
      "\n### 1. Consistency (C)\n" +
      "Every read receives the most recent write or an error. This means all nodes see the same data at the same time. **Example:** Traditional relational databases like PostgreSQL and MySQL (with strong ACID compliance).\n" +
      "![Consistency](https://upload.wikimedia.org/wikipedia/commons/4/46/Consistency.svg)\n" +
      "\n### 2. Availability (A)\n" +
      "The system is always available to process requests, even if some nodes are down. Every request receives a response (either the latest available data or stale data). **Example:** DynamoDB and Cassandra prioritize availability.\n" +
      "![Availability](https://upload.wikimedia.org/wikipedia/commons/e/e9/Availability.svg)\n" +
      "\n### 3. Partition Tolerance (P)\n" +
      "The system continues to operate even if network partitions occur. This is a fundamental requirement in distributed systems. **Example:** Apache Kafka and MongoDB handle partition tolerance efficiently.\n" +
      "![Partition Tolerance](https://upload.wikimedia.org/wikipedia/commons/9/9e/Partition_Tolerance.svg)\n" +
      "\n## Trade-offs in CAP\n" +
      "- **CP (Consistency + Partition Tolerance)**: Prioritizes consistency, may sacrifice availability. Example: MongoDB with majority writes.\n" +
      "- **AP (Availability + Partition Tolerance)**: Prioritizes availability, allows eventual consistency. Example: DynamoDB.\n" +
      "- **CA (Consistency + Availability)**: Not possible in a distributed system as network partitions can always happen.\n" +
      "\n## Conclusion\n" +
      "Understanding CAP theorem helps in designing distributed databases that align with business requirements. Choosing the right trade-off is crucial for performance and scalability.\n",
    additionalImages: [
      "https://miro.medium.com/v2/resize:fit:720/format:webp/1*8u2Z2PKlXFan9sGivriTDw.jpeg",
    ],
  };

  const ddia1 = {
    title: "Reliable, Scalable, and Maintainable Applications",
    author: "Mohit Chilkoti",
    coverImage:
      "https://media.istockphoto.com/id/495737046/vector/kids-reading-books-in-colour.jpg?s=2048x2048&w=is&k=20&c=XasE_9gSy7Psx9nIbKj0WP8F6P7_hk6BlQLZKnKltfE=",
    content: `
  ## Introduction
  When building modern software, three key concerns arise: **reliability, scalability, and maintainability**. These attributes ensure that a system can handle failures, grow with demand, and be easy to evolve.
  
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
  Reliability, scalability, and maintainability are foundational principles in designing **data-intensive applications**. Engineers must balance trade-offs while choosing the right architecture for their systems.
  
  `,
    additionalImages: [
      "https://cdn.pixabay.com/photo/2024/05/17/11/24/foxes-8768091_1280.jpg",
    ],
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button
        title="Open Apprec8Reader"
        onPress={() => navigation.navigate("Apprec8Reader", ddia1)}
      />
    </View>
  );
};

export default Apprec8ReaderTester;
