import React from "react";
import { View, Button } from "react-native";

const Apprec8ReaderTester = ({ navigation }) => {
  const contentArray = [
    { type: "heading", text: "Introduction" },
    { text: "Distributed systems are composed of multiple nodes..." },
    { type: "heading", text: "CAP Theorem" },
    { text: "A common trade-off in distributed systems is between..." },
    { image: "https://example.com/image.jpg" },
  ];

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button
        title="Open Apprec8Reader"
        onPress={() =>
          navigation.navigate("Apprec8Reader", {
            title: "Understanding Distributed Systems",
            author: "Roberto Vitillo",
            coverImage:
              "https://media.istockphoto.com/id/495737046/vector/kids-reading-books-in-colour.jpg?s=2048x2048&w=is&k=20&c=XasE_9gSy7Psx9nIbKj0WP8F6P7_hk6BlQLZKnKltfE=",
            content: [
              { heading: "Introduction" },
              {
                paragraph:
                  "Distributed systems are composed of multiple nodes communicating over a network.",
              },
              { heading: "CAP Theorem" },
              {
                paragraph:
                  "A common trade-off in distributed systems is between consistency and availability.",
              },
              {
                image:
                  "https://cdn.pixabay.com/photo/2024/06/12/11/11/sketch-8825072_1280.jpg",
              },
              { heading: "Real-World Example: Amazon DynamoDB" },
              {
                paragraph:
                  "Amazon DynamoDB is a NoSQL database that prioritizes availability over strict consistency.",
              },
              { heading: "Consensus Algorithms" },
              {
                paragraph:
                  "Raft and Paxos are common algorithms for achieving consensus in distributed systems.",
              },
              { heading: "Conclusion" },
              {
                paragraph:
                  "Distributed systems require careful trade-offs between consistency, availability, and partition tolerance.",
              },
            ],
          })
        }
      />
    </View>
  );
};

export default Apprec8ReaderTester;
