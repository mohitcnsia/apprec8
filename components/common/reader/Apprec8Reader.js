// components/common/reader/Apprec8Reader.js

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Modal,
  TouchableOpacity,
  useColorScheme,
  Image,
  ActivityIndicator,
} from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import Markdown from "react-native-markdown-display";
import { listenToStudyContent } from "../../../services/firestoreContentApi"; // Adjust path if needed
import { Colors } from "../../../config/colors"; // Adjust path if needed

const Apprec8Reader = ({ route }) => {
  const theme = useColorScheme();
  const topicId = route?.params?.topicId; // Expect topicId from navigation

  // State for fetched data, loading, error
  const [studyData, setStudyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for image modal
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
    setStudyData(null); // Reset data when topic changes
    let isMounted = true;

    console.log(
      `Apprec8Reader: Subscribing to study content for topicId: ${topicId}`
    );
    const unsubscribe = listenToStudyContent(
      topicId,
      (data) => {
        if (isMounted) {
          if (data) {
            console.log(`Apprec8Reader: Received data for ${topicId}`);
            setStudyData(data);
          } else {
            console.warn(`Apprec8Reader: No data found for ${topicId}`);
            setError("Study content not found.");
          }
          setIsLoading(false);
        }
      },
      (fetchError) => {
        if (isMounted) {
          console.error(
            `Apprec8Reader: Error fetching study content for ${topicId}:`,
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

  // Memoized function to open image modal
  const openImage = useCallback((imageUri) => {
    if (imageUri && typeof imageUri === "string" && imageUri.trim() !== "") {
      console.log("Opening image:", imageUri);
      setSelectedImage([{ url: imageUri }]);
      setModalVisible(true);
    } else {
      console.warn("Attempted to open invalid image URI:", imageUri);
    }
  }, []); // No dependencies, function doesn't change

  // Select theme-specific styles
  // const dynamicStyles = theme === "dark" ? darkStyles : lightStyles;
  const dynamicStyles = lightStyles;

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
        <Text style={[styles.message, dynamicStyles.message]}>{error}</Text>
      </View>
    );
  }

  if (!studyData) {
    // This state might occur briefly or if data is null after fetch
    return (
      <View
        style={[styles.container, styles.centered, dynamicStyles.background]}
      >
        <Text style={[styles.message, dynamicStyles.message]}>
          Content not available.
        </Text>
      </View>
    );
  }

  // Destructure fields safely, providing defaults for potentially missing fields
  const {
    name = "Untitled",
    author = "Unknown Author",
    coverImage, // Can be null or empty string
    content = "No content available.", // Default content
    additionalImages = [],
  } = studyData;

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
        {coverImage && ( // Only render if coverImage is a non-empty string
          <TouchableOpacity onPress={() => openImage(coverImage)}>
            <Image
              source={{ uri: coverImage }}
              style={styles.coverImage}
              onError={(e) =>
                console.log(
                  "Cover Image Load Error:",
                  coverImage,
                  e.nativeEvent.error
                )
              }
              onLoad={() => console.log("Cover Image Loaded:", coverImage)}
            />
          </TouchableOpacity>
        )}

        {/* Markdown Content */}
        <View style={styles.markdownContainer}>
          {/* Pass theme styles to the library AND use them in the custom rule */}
          <Markdown
            style={dynamicStyles.markdownText}
            rules={{
              // --- THIS IS THE KEY CHANGE ---
              image: (node, children, parent, inheritedStyles) => {
                const src = node.attributes.src;
                // Log the source being processed by the rule
                // console.log('Markdown Image Rule Processing:', src);

                // Basic check for valid URI before rendering
                if (
                  !src ||
                  typeof src !== "string" ||
                  !src.startsWith("http")
                ) {
                  console.warn(
                    "Markdown Image Rule: Invalid or missing src attribute",
                    node.attributes
                  );
                  return null; // Don't render anything if src is invalid
                }

                return (
                  <TouchableOpacity
                    key={node.key} // Use key provided by the library
                    onPress={() => openImage(src)}
                    style={styles.markdownImageWrapper} // Optional: Add wrapper style if needed
                  >
                    <Image
                      source={{ uri: src }}
                      // Apply the correct theme-specific image style
                      style={dynamicStyles.markdownText.image}
                      // Add error/load handlers for debugging
                      onError={(e) =>
                        console.error(
                          "Markdown Image Load Error:",
                          src,
                          e.nativeEvent.error
                        )
                      }
                      onLoad={() => console.log("Markdown Image Loaded:", src)}
                      // Ensure resizeMode is explicitly set if not in style obj
                      resizeMode={
                        dynamicStyles.markdownText.image.resizeMode || "contain"
                      }
                    />
                  </TouchableOpacity>
                );
              },
              // You can add other custom rules here if needed
            }}
          >
            {content}
          </Markdown>
        </View>

        {/* Additional Images */}
        {additionalImages && additionalImages.length > 0 && (
          <View style={styles.imageContainer}>
            <Text style={[styles.additionalImagesTitle, dynamicStyles.text]}>
              Additional Images:
            </Text>
            {additionalImages.map((img, index) =>
              img && typeof img === "string" && img.trim() !== "" ? ( // Check if img is a valid string
                <TouchableOpacity
                  key={`additional-image-${index}`}
                  onPress={() => openImage(img)}
                  style={styles.additionalImageTouchable}
                >
                  <Image
                    source={{ uri: img }}
                    style={styles.additionalImage}
                    onError={(e) =>
                      console.error(
                        "Additional Image Load Error:",
                        img,
                        e.nativeEvent.error
                      )
                    }
                    onLoad={() => console.log("Additional Image Loaded:", img)}
                  />
                </TouchableOpacity>
              ) : (
                // Optionally render a placeholder or log an error for invalid entries
                <View
                  key={`invalid-image-${index}`}
                  style={styles.invalidImagePlaceholder}
                >
                  <Text style={dynamicStyles.secondaryText}>Invalid Image</Text>
                </View>
              )
            )}
          </View>
        )}

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
            renderIndicator={() => null} // Hide default indicator
            loadingRender={() => (
              <ActivityIndicator size="large" color="#FFFFFF" /> // Ensure color contrast
            )}
            // Optional: Add error handling for the viewer itself
            // renderError={() => <Text style={{ color: 'white', textAlign: 'center' }}>Error loading image</Text>}
            failImageSource={{
              uri: "https://via.placeholder.com/150?text=Error",
              width: 150,
              height: 150,
            }} // Placeholder on fail
          />
        </Modal>
      </ScrollView>
    </View>
  );
};

// --- Styles ---

// Shared styles
const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 20 },
  centered: { justifyContent: "center", alignItems: "center" },
  header: { marginBottom: 20 },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 0.5,
    lineHeight: 36,
  },
  author: { fontSize: 16, fontStyle: "italic", marginTop: 6, opacity: 0.8 },
  coverImage: {
    width: "100%",
    height: 260, // Consider using aspectRatio if height varies
    // aspectRatio: 16 / 9,
    resizeMode: "cover",
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: "#cccccc33", // Added placeholder background
  },
  markdownContainer: {
    // Add padding/margin if needed to separate from cover image/additional images
    marginBottom: 20,
  },
  // Style for the TouchableOpacity wrapping the markdown image (optional)
  markdownImageWrapper: {
    marginBottom: 12, // Match the margin of the image style
    alignItems: "center", // Center image if its width is not 100%
  },
  imageContainer: {
    marginTop: 20,
    marginBottom: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#cccccc44", // Separator line
  },
  additionalImagesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  additionalImageTouchable: {
    marginBottom: 12, // Spacing between additional images
    width: "100%", // Ensure touchable takes full width if needed
    alignItems: "center", // Center image if not full width
  },
  additionalImage: {
    width: "90%", // Example: make additional images slightly smaller
    aspectRatio: 16 / 9,
    resizeMode: "contain", // Use contain to see the whole image
    borderRadius: 10,
    backgroundColor: "#cccccc33", // Added placeholder background
  },
  invalidImagePlaceholder: {
    width: "90%",
    aspectRatio: 16 / 9,
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#cccccc55",
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
    paddingHorizontal: 20,
  }, // Added padding
});

// --- Theme-Specific Styles ---

const commonMarkdownStyles = {
  // Shared styles for markdown elements common to both themes
  text: { fontSize: 18, lineHeight: 28 },
  heading1: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
    lineHeight: 40,
  },
  heading2: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 8,
    lineHeight: 36,
  },
  strong: { fontWeight: "bold" },
  em: { fontStyle: "italic" },
  bullet_list: { marginBottom: 10 },
  ordered_list: { marginBottom: 10 },
  list_item: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  blockquote: {
    paddingLeft: 15,
    marginLeft: 10,
    borderLeftWidth: 3,
    marginBottom: 10,
    opacity: 0.9,
  },
  // This is the crucial style for images within Markdown
  image: {
    width: "100%", // Take full available width
    // height: 200, // Avoid fixed height unless necessary, use aspectRatio
    aspectRatio: 16 / 9, // Maintain aspect ratio
    borderRadius: 10,
    // Removed margin here, applied to wrapper instead
    // marginBottom: 12,
    resizeMode: "stretch", // Use 'contain' to see the whole image, 'cover' to fill
    alignSelf: "center", // Center the image within its container
    backgroundColor: "#cccccc33", // Added placeholder background
  },
  link: {
    textDecorationLine: "underline",
  },
  hr: {
    height: 1,
    marginBottom: 15,
    marginTop: 15,
  },
};

const darkStyles = {
  background: { backgroundColor: "#121212" },
  text: { color: "#EAEAEA" },
  secondaryText: { color: "#BBBBBB" },
  markdownText: {
    // Spread common styles and override/add dark theme specifics
    ...commonMarkdownStyles,
    text: { ...commonMarkdownStyles.text, color: "#EAEAEA" },
    heading1: { ...commonMarkdownStyles.heading1, color: "#FFFFFF" },
    heading2: { ...commonMarkdownStyles.heading2, color: "#FFFFFF" },
    strong: { ...commonMarkdownStyles.strong, color: "#EAEAEA" },
    em: { ...commonMarkdownStyles.em, color: "#EAEAEA" },
    blockquote: {
      ...commonMarkdownStyles.blockquote,
      backgroundColor: "#222222",
      borderLeftColor: "#555555",
    },
    image: { ...commonMarkdownStyles.image, backgroundColor: "#333333" }, // Darker placeholder bg
    link: { ...commonMarkdownStyles.link, color: "#64b5f6" }, // Example link color
    hr: { ...commonMarkdownStyles.hr, backgroundColor: "#444444" },
  },
  message: { color: "#BBBBBB" },
};

const lightStyles = {
  background: { backgroundColor: "#FFFFFF" },
  text: { color: "#222" },
  secondaryText: { color: "#666" },
  markdownText: {
    // Spread common styles and override/add light theme specifics
    ...commonMarkdownStyles,
    text: { ...commonMarkdownStyles.text, color: "#222" },
    heading1: { ...commonMarkdownStyles.heading1, color: "#000" },
    heading2: { ...commonMarkdownStyles.heading2, color: "#000" },
    strong: { ...commonMarkdownStyles.strong, color: "#222" },
    em: { ...commonMarkdownStyles.em, color: "#222" },
    blockquote: {
      ...commonMarkdownStyles.blockquote,
      backgroundColor: "#f0f0f0",
      borderLeftColor: "#cccccc",
    },
    image: { ...commonMarkdownStyles.image, backgroundColor: "#e0e0e0" }, // Lighter placeholder bg
    link: { ...commonMarkdownStyles.link, color: "#0d47a1" }, // Example link color
    hr: { ...commonMarkdownStyles.hr, backgroundColor: "#cccccc" },
  },
  message: { color: "#666" },
};

export default Apprec8Reader;
