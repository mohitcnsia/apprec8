import React, { useEffect, useMemo } from "react";
import { View, Button } from "react-native";
import { systemDesignTopics } from "../../../data/app-topic-data";

const Apprec8ReaderTester = ({ navigation }) => {
  const data1 = useMemo(
    () => ({
      name: "Reliable, Scalable, and Maintainable Applications",
      author: "Mohit Chilkoti",
      coverImage:
        "https://media.istockphoto.com/id/495737046/vector/kids-reading-books-in-colour.jpg?s=2048x2048&w=is&k=20&c=XasE_9gSy7Psx9nIbKj0WP8F6P7_hk6BlQLZKnKltfE=",
      content: `
  ## Introduction
  When building modern --software--, three key concerns arise: **reliability, scalability, and maintainability**. These attributes ensure that a system can handle failures, grow with demand, and be easy to evolve.
  
  ## Reliability
  A system is considered **reliable** if it continues to function correctly despite failures. Failures can be:
  - **Hardware Failures**: Disks crash, network outages occur.
  - **Software Bugs**: Memory leaks, unhandled edge cases.
  - **Human Errors**: Misconfigurations, accidental data deletions.

  ## Italics
  Here is my *Italics* text using two _diff_ styles. A*cat*meow. This text is ***really important***.
  
  ## Conclusion
  Reliability, scalability, and maintainability are foundational principles in designing **data-intensive applications**. Engineers must balance trade-offs while choosing the right architecture for their systems.
  `,
      additionalImages: [
        "https://cdn.pixabay.com/photo/2024/05/17/11/24/foxes-8768091_1280.jpg",
      ],
    }),
    []
  );

  const data2 = {
    name: "Reliable, Scalable, and Maintainable Applications",
    author: "Mohit Chilkoti",
    coverImage:
      "https://media.istockphoto.com/id/495737046/vector/kids-reading-books-in-colour.jpg?s=2048x2048&w=is&k=20&c=XasE_9gSy7Psx9nIbKj0WP8F6P7_hk6BlQLZKnKltfE=",
    content: `
  ## Introduction
  When building modern --software--, three key concerns arise: **reliability, scalability, and maintainability**. These attributes ensure that a system can handle failures, grow with demand, and be easy to evolve.
  
  ## Reliability
  A system is considered **reliable** if it continues to function correctly despite failures. Failures can be:
  - **Hardware Failures**: Disks crash, network outages occur.
  - **Software Bugs**: Memory leaks, unhandled edge cases.
  - **Human Errors**: Misconfigurations, accidental data deletions.

  > Dorothy followed her through many of the beautiful rooms in her castle.

  ## Italics
  Here is my *Italics* text using two _diff_ styles. A*cat*meow. This text is ***really important***.
  
  ## Conclusion
  Reliability, scalability, and maintainability are foundational principles in designing **data-intensive applications**. Engineers must balance trade-offs while choosing the right architecture for their systems.
  `,
    additionalImages: [
      "https://cdn.pixabay.com/photo/2024/05/17/11/24/foxes-8768091_1280.jpg",
    ],
  };

  const data = systemDesignTopics[0];

  useEffect(() => {
    // Automatically navigate when the component is mounted
    navigation.navigate("Apprec8Reader", { data });
  }, [navigation, data]);

  return (
    // console.log("data2 - " + JSON.stringify(data2)),
    // console.log("system design - " + JSON.stringify(data)),
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button
        title="Open Apprec8Reader"
        onPress={() => navigation.navigate("Apprec8Reader", { data })}
      />
    </View>
  );
};

export default Apprec8ReaderTester;
