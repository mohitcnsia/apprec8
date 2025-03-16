import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Modal,
  TouchableOpacity,
  useColorScheme,
  Image,
} from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import Markdown from "react-native-markdown-display";

const Apprec8Reader = ({ route }) => {
  console.log("Received data:", route.params.data); // Debug log
  const theme = useColorScheme();
  const {
    name,
    author,
    coverImage,
    content,
    additionalImages = Array.isArray(route.params.additionalImages)
      ? route.params.additionalImages
      : [],
  } = route.params.data || {}; // Default to an empty object if data is null or undefined

  // Graceful fallback if data is missing
  if (!name || !author || !content) {
    // console.error("Required data is missing:", route.params.item); // Log the missing data for the developer
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Coming Soon...</Text>
      </View>
    );
  }

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState([]);

  // Open image in modal
  const openImage = (imageUri) => {
    setSelectedImage([{ url: imageUri }]);
    setModalVisible(true);
  };

  // Common styles based on theme
  const dynamicStyles = theme === "dark" ? darkStyles : lightStyles;

  return (
    <View style={[styles.container, dynamicStyles.background]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={[styles.name, dynamicStyles.text]}>{name}</Text>
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
            image: (node, index) => (
              <TouchableOpacity
                key={`markdown-image-${index}`}
                onPress={() => openImage(node.attributes.src)}
              >
                <Image
                  source={{ uri: node.attributes.src }}
                  style={styles.markdownImage}
                />
              </TouchableOpacity>
            ),
          }}
        >
          {content}
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
          />
        </Modal>
      </ScrollView>
    </View>
  );
};

// Shared styles for light and dark themes
const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 20 },
  header: { marginBottom: 20 },
  name: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: 0.5,
    lineHeight: 36,
  },
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
  message: { fontSize: 20, color: "#888", textAlign: "center", marginTop: 50 },
});

// Theme-specific styles
const darkStyles = {
  background: { backgroundColor: "#121212" },
  text: { color: "#EAEAEA" },
  secondaryText: { color: "#BBBBBB" },
  markdownText: {
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
    image: {
      width: "100%",
      aspectRatio: 16 / 9,
      borderRadius: 10,
      marginBottom: 12,
    },
  },
};

const lightStyles = {
  background: { backgroundColor: "#FFFFFF" },
  text: { color: "#222" },
  secondaryText: { color: "#666" },
  markdownText: {
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
    image: {
      width: "100%",
      aspectRatio: 16 / 9,
      borderRadius: 10,
      marginBottom: 12,
    },
  },
};

export default Apprec8Reader;
