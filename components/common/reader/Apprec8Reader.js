// components/common/reader/Apprec8Reader.js (Refactored for @r-n-firebase listeners)

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Modal,
  TouchableOpacity,
  useColorScheme,
  Image,
  ActivityIndicator, // Added
} from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import Markdown from "react-native-markdown-display";
import { listenToStudyContent } from "../../../services/firestoreContentApi"; // Adjust path
import { Colors } from "../../../config/colors"; // Adjust path

const Apprec8Reader = ({ route }) => {
  const theme = useColorScheme();
  const topicId = route?.params?.topicId; // Expect topicId from navigation

  // State for fetched data, loading, error
  const [studyData, setStudyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState([]);

  // Effect to listen for study content
  useEffect(() => {
    if (!topicId) {
      setError("No topic specified.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    let isMounted = true;

    console.log(
      `Apprec8Reader: Listening to study content for topicId: ${topicId}`
    );
    const unsubscribe = listenToStudyContent(
      topicId,
      (data) => {
        if (isMounted) {
          if (data) {
            setStudyData(data);
          } else {
            setError("Study content not found."); // Set error if document doesn't exist
          }
          setIsLoading(false);
        }
      },
      (fetchError) => {
        if (isMounted) {
          console.error(
            `Error fetching study content for ${topicId}:`,
            fetchError
          );
          setError("Could not load study content.");
          setIsLoading(false);
        }
      }
    );

    // Cleanup listener on unmount or topicId change
    return () => {
      console.log(
        `Apprec8Reader: Unsubscribing from study content listener for ${topicId}`
      );
      isMounted = false;
      unsubscribe();
    };
  }, [topicId]); // Re-run effect if topicId changes

  // Open image in modal
  const openImage = (imageUri) => {
    if (imageUri) {
      // Check if URI is valid
      setSelectedImage([{ url: imageUri }]);
      setModalVisible(true);
    } else {
      console.warn("Attempted to open invalid image URI");
    }
  };

  // Common styles based on theme
  const dynamicStyles = theme === "dark" ? darkStyles : lightStyles;

  // --- Render Logic ---
  if (isLoading) {
    return (
      <View
        style={[styles.container, styles.centered, dynamicStyles.background]}
      >
        <ActivityIndicator size="large" color={dynamicStyles.text.color} />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[styles.container, styles.centered, dynamicStyles.background]}
      >
        <Text style={[styles.message, dynamicStyles.text]}>{error}</Text>
      </View>
    );
  }

  // Check if studyData exists before trying to render content
  if (!studyData) {
    return (
      <View
        style={[styles.container, styles.centered, dynamicStyles.background]}
      >
        <Text style={[styles.message, dynamicStyles.text]}>
          Content not available.
        </Text>
      </View>
    );
  }

  // Destructure fields from the fetched studyData state object
  const {
    name,
    author,
    coverImage,
    content,
    additionalImages = [],
  } = studyData;

  return (
    <View style={[styles.container, dynamicStyles.background]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          {/* Use name from studyData state */}
          <Text style={[styles.name, dynamicStyles.text]}>{name}</Text>
          {/* Use author from studyData state */}
          <Text style={[styles.author, dynamicStyles.secondaryText]}>
            By {author}
          </Text>
        </View>

        {/* Cover Image */}
        {coverImage && (
          <TouchableOpacity onPress={() => openImage(coverImage)}>
            <Image source={{ uri: coverImage }} style={styles.coverImage} />
          </TouchableOpacity>
        )}

        {/* Markdown Content */}
        <Markdown
          style={dynamicStyles.markdownText}
          rules={{
            image: (node, index, children, parent, styles) => (
              // Note: Markdown 'image' rule might need adjustment depending on library version
              <TouchableOpacity
                key={node.key} // Use node.key if available
                onPress={() => openImage(node.attributes.src)}
              >
                <Image
                  source={{ uri: node.attributes.src }}
                  style={styles.markdownImage} // Use your defined style
                />
              </TouchableOpacity>
            ),
          }}
        >
          {content /* Use content from studyData state */}
        </Markdown>

        {/* Additional Images */}
        <View style={styles.imageContainer}>
          {additionalImages.map((img, index) => (
            <TouchableOpacity
              key={`additional-image-${index}`}
              onPress={() => openImage(img)}
            >
              <Image source={{ uri: img }} style={styles.additionalImage} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Image Modal */}
        <Modal
          visible={modalVisible}
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <ImageViewer
            imageUrls={selectedImage}
            enableSwipeDown={true}
            onSwipeDown={() => setModalVisible(false)}
            renderIndicator={() => null} // Hide default indicator if needed
            loadingRender={() => (
              <ActivityIndicator size="large" color="white" />
            )}
          />
        </Modal>
      </ScrollView>
    </View>
  );
};

// Shared styles (keep existing or modify) - Added centered style
const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 20 },
  centered: { justifyContent: "center", alignItems: "center" }, // Added centered style
  header: { marginBottom: 20 },
  name: { fontSize: 28, fontWeight: "700", letterSpacing: 0.5, lineHeight: 36 },
  author: { fontSize: 16, fontStyle: "italic", marginTop: 6, opacity: 0.8 },
  coverImage: {
    width: "100%",
    height: 260,
    resizeMode: "cover",
    borderRadius: 12,
    marginBottom: 20,
  },
  markdownImage: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 12,
    marginBottom: 12,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 12,
  },
  additionalImage: {
    width: "100%",
    aspectRatio: 16 / 9,
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: 12,
  },
  message: { fontSize: 18, textAlign: "center", marginTop: 50 }, // Adjusted message style
});

// Theme-specific styles (keep existing)
const darkStyles = {
  background: { backgroundColor: "#121212" },
  text: { color: "#EAEAEA" },
  secondaryText: { color: "#BBBBBB" },
  markdownText: {
    /* ... keep existing markdown styles ... */
    text: { color: "#EAEAEA", fontSize: 18, lineHeight: 28 },
    heading1: {
      color: "#FFFFFF",
      fontSize: 32,
      fontWeight: "bold",
      marginBottom: 10,
    },
    heading2: {
      color: "#FFFFFF",
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 8,
    },
    strong: { color: "#EAEAEA", fontWeight: "bold" },
    em: { color: "#EAEAEA", fontStyle: "italic" },
    // Ensure image style within markdown is defined if not inheriting
    image: {
      width: "100%",
      aspectRatio: 16 / 9,
      borderRadius: 10,
      marginBottom: 12,
      resizeMode: "contain",
    },
  },
  message: { color: "#BBBBBB" }, // Theme message color
};
const lightStyles = {
  background: { backgroundColor: "#FFFFFF" },
  text: { color: "#222" },
  secondaryText: { color: "#666" },
  markdownText: {
    /* ... keep existing markdown styles ... */
    text: { color: "#222", fontSize: 18, lineHeight: 28 },
    heading1: {
      color: "#000",
      fontSize: 32,
      fontWeight: "bold",
      marginBottom: 10,
    },
    heading2: {
      color: "#000",
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 8,
    },
    strong: { color: "#222", fontWeight: "bold" },
    em: { color: "#222", fontStyle: "italic" },
    // Ensure image style within markdown is defined if not inheriting
    image: {
      width: "100%",
      aspectRatio: 16 / 9,
      borderRadius: 10,
      marginBottom: 12,
      resizeMode: "contain",
    },
  },
  message: { color: "#666" }, // Theme message color
};

export default Apprec8Reader;
