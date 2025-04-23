// components/common/reader/Apprec8Reader.js (Corrected)

import React, { useState, useEffect, useCallback, useRef } from "react";
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
  Dimensions, // Import Dimensions
  Button, // Added missing import for Button used in error/no-data states
} from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import Markdown from "react-native-markdown-display";
import { listenToStudyContent } from "../../../services/firestoreContentApi"; // Adjust path if needed
import { Colors } from "../../../config/colors"; // Adjust path if needed

/**
 * @component Apprec8Reader
 * @description Displays formatted study content (fetched from Firestore) including text,
 * markdown, cover images, and additional images. Handles loading and error states.
 * Allows viewing images in a zoomable modal.
 * Expects the ID of the study content document to fetch via route parameters.
 *
 * @param {object} route - React Navigation route object.
 * @param {object} route.params - Parameters passed during navigation.
 * @param {string} route.params.contentId - The unique ID of the document in the 'studyContent' collection to display. This ID should match the ID of the corresponding 'STUDY' type document in the 'topics' collection.
 * @param {string} [route.params.parentTopicId] - Optional: The ID of the parent topic/subtopic for context (not directly used for fetching here).
 *
 * @param {object} navigation - React Navigation navigation object (implicitly available via props).
 */
// --- VVV Correction is Here VVV ---
const Apprec8Reader = ({ route, navigation }) => {
  // <<< Added navigation to props destructuring
  // --- Hooks ---
  const theme = useColorScheme(); // Get device theme (light/dark)
  // Determine the ID of the content to fetch, prioritizing the new 'contentId' param
  const contentId = route?.params?.contentId; // Use contentId passed from LinksScreen
  // Use ref to track if component is mounted to prevent state updates after unmount
  const isMounted = useRef(true);

  // --- State ---
  // Holds the fetched study data object from Firestore
  const [studyData, setStudyData] = useState(null);
  // Tracks whether content is currently being loaded
  const [isLoading, setIsLoading] = useState(true);
  // Stores any error message encountered during fetching
  const [error, setError] = useState(null);
  // Controls visibility of the image zoom modal
  const [modalVisible, setModalVisible] = useState(false);
  // Holds the image URL(s) for the image viewer modal
  const [selectedImage, setSelectedImage] = useState([]);

  // --- Effect for Mount/Unmount Tracking ---
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false; // Set to false on unmount
      console.log(`Apprec8Reader Unmounting (contentId: ${contentId})`);
    };
  }, []); // Run only on mount and unmount

  // --- Effect to Fetch Study Content ---
  // Runs when component mounts or when the contentId parameter changes.
  useEffect(() => {
    // Validate if contentId is provided
    if (!contentId) {
      console.error("Apprec8Reader: No contentId provided in route params.");
      if (isMounted.current) {
        setError("No content specified.");
        setIsLoading(false);
      }
      return; // Stop if no ID
    }

    // Reset state before fetching new content
    setIsLoading(true);
    setError(null);
    setStudyData(null);

    console.log(
      `Apprec8Reader: Subscribing to study content for contentId: ${contentId}`
    );

    // Attach Firestore listener using the API function
    const unsubscribe = listenToStudyContent(
      contentId,
      // --- onDataReceived Callback ---
      (data) => {
        // Check if component is still mounted before updating state
        if (isMounted.current) {
          if (data) {
            // Data found
            console.log(`Apprec8Reader: Received data for ${contentId}`);
            setStudyData(data);
            setError(null); // Clear any previous error
          } else {
            // Document does not exist in studyContent collection
            console.warn(`Apprec8Reader: No data found for ${contentId}`);
            setError("Study content not found."); // Set error message
            setStudyData(null); // Ensure no stale data is shown
          }
          setIsLoading(false); // Mark loading as complete
          console.log(`Apprec8Reader: Set isLoading=false for ${contentId}`);
        } else {
          console.log(
            `Apprec8Reader: Unmounted before data callback for ${contentId}`
          );
        }
      },
      // --- onError Callback ---
      (fetchError) => {
        // Check if component is still mounted before updating state
        if (isMounted.current) {
          console.error(
            `Apprec8Reader: Error fetching study content for ${contentId}:`,
            fetchError
          );
          setError(fetchError?.message || "Could not load study content."); // Set error message
          setStudyData(null);
          setIsLoading(false); // Mark loading as complete (with error)
          console.log(
            `Apprec8Reader: Set isLoading=false after error for ${contentId}`
          );
        } else {
          console.log(
            `Apprec8Reader: Unmounted before error callback for ${contentId}`
          );
        }
      }
    );

    // Cleanup function: Detach the Firestore listener when the component unmounts
    // or when the contentId dependency changes (triggering the effect again).
    return () => {
      console.log(
        `Apprec8Reader: Unsubscribing from listener for ${contentId}`
      );
      unsubscribe();
    };
  }, [contentId]); // Effect dependency: Re-run only if contentId changes

  // --- Image Modal Handler ---
  // Memoized function to prevent unnecessary re-creations on re-renders.
  const openImage = useCallback((imageUri) => {
    // Basic validation for the image URI
    if (imageUri && typeof imageUri === "string" && imageUri.trim() !== "") {
      console.log("Opening image:", imageUri);
      // ImageViewer expects an array of objects with a 'url' property
      setSelectedImage([{ url: imageUri }]);
      setModalVisible(true); // Show the modal
    } else {
      console.warn("Attempted to open invalid image URI:", imageUri);
    }
  }, []); // No dependencies, this function doesn't rely on props or state

  // --- Select Styles based on Theme ---
  // Using lightStyles directly as per previous code
  const dynamicStyles = lightStyles;

  // --- RENDER LOGIC ---
  console.log(
    `Apprec8Reader RENDER: isLoading=${isLoading}, error=${JSON.stringify(
      error
    )}, studyData exists=${!!studyData}`
  );

  // 1. Loading State
  if (isLoading) {
    console.log("Apprec8Reader: Rendering Loading UI");
    return (
      <View
        style={[styles.container, styles.centered, dynamicStyles.background]}
      >
        <ActivityIndicator size="large" color={dynamicStyles.text.color} />
      </View>
    );
  }

  // 2. Error State
  if (error) {
    console.log(`Apprec8Reader: Rendering Error UI: ${error}`);
    return (
      <View
        style={[styles.container, styles.centered, dynamicStyles.background]}
      >
        <Text style={[styles.message, dynamicStyles.message]}>{error}</Text>
        {/* Add a back button for better UX in error state */}
        {navigation.canGoBack() && ( // Now 'navigation' should be defined
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            color={
              dynamicStyles.text.color === "#222"
                ? Colors.primaryDarkMaroon
                : Colors.primaryWhite
            }
          />
        )}
      </View>
    );
  }

  // 3. No Data State (after loading finished without error, but data is null)
  if (!studyData) {
    console.log("Apprec8Reader: Rendering Content Not Available UI");
    return (
      <View
        style={[styles.container, styles.centered, dynamicStyles.background]}
      >
        <Text style={[styles.message, dynamicStyles.message]}>
          Content not available.
        </Text>
        {/* Add a back button here too */}
        {navigation.canGoBack() && ( // Now 'navigation' should be defined
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            color={
              dynamicStyles.text.color === "#222"
                ? Colors.primaryDarkMaroon
                : Colors.primaryWhite
            }
          />
        )}
      </View>
    );
  }

  // 4. Content Loaded State
  console.log("Apprec8Reader: Rendering main content UI");
  // Destructure fields from the fetched studyData, providing defaults for safety.
  const {
    name = "Untitled Content", // Default title
    author = "Unknown Author", // Default author
    coverImage, // Can be null/undefined/empty string
    content = "No text content available.", // Default text
    additionalImages = [], // Default to empty array
  } = studyData;

  // Ensure additionalImages is always an array
  const validAdditionalImages = Array.isArray(additionalImages)
    ? additionalImages
    : [];

  return (
    <View style={[styles.container, dynamicStyles.background]}>
      {/* Use ScrollView to allow content longer than the screen */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section: Displays title and author */}
        <View style={styles.header}>
          <Text style={[styles.name, dynamicStyles.text]}>{name}</Text>
          <Text style={[styles.author, dynamicStyles.secondaryText]}>
            By {author}
          </Text>
        </View>

        {/* Cover Image: Displayed only if a valid URL exists */}
        {coverImage ? ( // Check if coverImage is truthy (not null/empty)
          <TouchableOpacity onPress={() => openImage(coverImage)}>
            <Image
              source={{ uri: coverImage }}
              style={styles.coverImage}
              onError={(e) =>
                console.error(
                  "Cover Image Load Error:",
                  coverImage,
                  e.nativeEvent.error
                )
              }
              onLoad={() => console.log("Cover Image Loaded:", coverImage)}
            />
          </TouchableOpacity>
        ) : null}

        {/* Markdown Content Area */}
        <View style={styles.markdownContainer}>
          {/* The core Markdown component */}
          <Markdown
            style={dynamicStyles.markdownText} // Apply theme-specific styles for markdown elements
            rules={{
              // Custom rule to handle images within the markdown content
              image: (node, children, parent, inheritedStyles) => {
                const src = node.attributes.src;
                if (
                  !src ||
                  typeof src !== "string" ||
                  !src.startsWith("http")
                ) {
                  console.warn(
                    "Markdown Image Rule: Invalid or missing src attribute",
                    node.attributes
                  );
                  return null;
                }
                return (
                  <TouchableOpacity
                    key={node.key}
                    onPress={() => openImage(src)}
                    style={styles.markdownImageWrapper}
                  >
                    <Image
                      source={{ uri: src }}
                      style={dynamicStyles.markdownText.image}
                      onError={(e) =>
                        console.error(
                          "Markdown Image Load Error:",
                          src,
                          e.nativeEvent.error
                        )
                      }
                      onLoad={() => console.log("Markdown Image Loaded:", src)}
                      resizeMode={
                        dynamicStyles.markdownText.image.resizeMode || "contain"
                      }
                    />
                  </TouchableOpacity>
                );
              },
            }}
          >
            {content}
          </Markdown>
        </View>

        {/* Additional Images Section */}
        {validAdditionalImages.length > 0 && (
          <View style={styles.imageContainer}>
            <Text style={[styles.additionalImagesTitle, dynamicStyles.text]}>
              Additional Images:
            </Text>
            {validAdditionalImages.map((img, index) =>
              img && typeof img === "string" && img.trim() !== "" ? (
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
                <View
                  key={`invalid-image-${index}`}
                  style={styles.invalidImagePlaceholder}
                >
                  <Text style={dynamicStyles.secondaryText}>
                    Invalid Image Entry
                  </Text>
                </View>
              )
            )}
          </View>
        )}

        {/* Image Zoom Modal */}
        <Modal
          visible={modalVisible}
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <ImageViewer
            imageUrls={selectedImage}
            enableSwipeDown={true}
            onSwipeDown={() => setModalVisible(false)}
            renderIndicator={() => null}
            loadingRender={() => (
              <ActivityIndicator size="large" color="#FFFFFF" />
            )}
            failImageSource={{
              uri: "https://via.placeholder.com/150?text=Load+Error",
              width: 150,
              height: 150,
            }}
          />
        </Modal>
      </ScrollView>
    </View>
  );
};

// --- Styles ---
const screenWidth = Dimensions.get("window").width;
const coverImageHeight = screenWidth * 0.6;

// Shared styles
const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 20 },
  centered: { justifyContent: "center", alignItems: "center" },
  header: { marginBottom: 20, alignItems: "center" },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 0.5,
    lineHeight: 36,
    textAlign: "center",
  },
  author: {
    fontSize: 16,
    fontStyle: "italic",
    marginTop: 6,
    opacity: 0.8,
    textAlign: "center",
  },
  coverImage: {
    width: "100%",
    height: coverImageHeight,
    resizeMode: "cover",
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: "#e0e0e0",
  },
  markdownContainer: { marginBottom: 20 },
  markdownImageWrapper: { marginBottom: 12, alignItems: "center" },
  imageContainer: {
    marginTop: 20,
    marginBottom: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#cccccc66",
  },
  additionalImagesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  additionalImageTouchable: {
    marginBottom: 12,
    width: "100%",
    alignItems: "center",
  },
  additionalImage: {
    width: "95%",
    aspectRatio: 16 / 9,
    resizeMode: "contain",
    borderRadius: 10,
    backgroundColor: "#e0e0e0",
  },
  invalidImagePlaceholder: {
    width: "95%",
    aspectRatio: 16 / 9,
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#eeeeee",
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    paddingHorizontal: 20,
  },
});

// --- Theme-Specific Styles ---
const commonMarkdownStyles = {
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
  heading3: {
    fontSize: 24, // Example size (smaller than H2)
    fontWeight: "bold",
    marginTop: 10, // Example margin
    marginBottom: 6, // Example margin
    lineHeight: 32, // Example line height
  },
  strong: { fontWeight: "bold" },
  em: { fontStyle: "italic" },
  bullet_list: { marginVertical: 10 },
  ordered_list: { marginVertical: 10 },
  list_item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    marginHorizontal: 10,
  },
  bullet_list_icon: {
    fontSize: 18,
    lineHeight: 26,
    marginRight: 8,
    fontWeight: "bold",
  },
  ordered_list_icon: {
    fontSize: 17,
    lineHeight: 26,
    marginRight: 8,
    fontWeight: "bold",
  },
  blockquote: {
    paddingLeft: 15,
    marginLeft: 0,
    borderLeftWidth: 4,
    marginVertical: 10,
    opacity: 0.9,
  },
  image: {
    width: screenWidth - 64,
    maxWidth: "100%",
    height: undefined,
    aspectRatio: 16 / 9,
    borderRadius: 10,
    resizeMode: "stretch",
    alignSelf: "center",
    marginVertical: 10,
    backgroundColor: "#e0e0e0",
  },
  link: { textDecorationLine: "underline" },
  hr: { height: 1, marginVertical: 20 },
  code_inline: {
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 4,
    borderRadius: 3,
  },
  fence: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 4,
    marginVertical: 10,
  },
};

const darkStyles = {
  background: { backgroundColor: "#121212" },
  text: { color: "#EAEAEA" },
  secondaryText: { color: "#BBBBBB" },
  markdownText: {
    ...commonMarkdownStyles,
    text: { ...commonMarkdownStyles.text, color: "#EAEAEA" },
    heading1: {
      ...commonMarkdownStyles.heading1,
      color: "#FFFFFF",
      borderBottomColor: "#444",
      borderBottomWidth: 1,
    },
    heading2: { ...commonMarkdownStyles.heading2, color: "#FFFFFF" },
    heading3: { ...commonMarkdownStyles.heading3, color: "#EEEEEE" },
    strong: { ...commonMarkdownStyles.strong, color: "#EAEAEA" },
    em: { ...commonMarkdownStyles.em, color: "#EAEAEA" },
    bullet_list_icon: {
      ...commonMarkdownStyles.bullet_list_icon,
      color: "#BBBBBB",
    },
    ordered_list_icon: {
      ...commonMarkdownStyles.ordered_list_icon,
      color: "#BBBBBB",
    },
    blockquote: {
      ...commonMarkdownStyles.blockquote,
      backgroundColor: "#222222",
      borderLeftColor: "#555555",
    },
    image: { ...commonMarkdownStyles.image, backgroundColor: "#333333" },
    link: { ...commonMarkdownStyles.link, color: "#64b5f6" },
    hr: { ...commonMarkdownStyles.hr, backgroundColor: "#444444" },
    code_inline: {
      ...commonMarkdownStyles.code_inline,
      backgroundColor: "#333",
      color: "#eee",
    },
    fence: {
      ...commonMarkdownStyles.fence,
      backgroundColor: "#222",
      color: "#eee",
    },
  },
  message: { color: "#BBBBBB" },
};

const lightStyles = {
  background: { backgroundColor: "#FFFFFF" },
  text: { color: "#222222" },
  secondaryText: { color: "#555555" },
  markdownText: {
    ...commonMarkdownStyles,
    text: { ...commonMarkdownStyles.text, color: "#222222" },
    heading1: {
      ...commonMarkdownStyles.heading1,
      color: "#000000",
      borderBottomColor: "#ddd",
      borderBottomWidth: 1,
    },
    heading2: { ...commonMarkdownStyles.heading2, color: "#111111" },
    heading3: { ...commonMarkdownStyles.heading3, color: "#222222" },
    strong: { ...commonMarkdownStyles.strong, color: "#000000" },
    em: { ...commonMarkdownStyles.em, color: "#222222" },
    bullet_list_icon: {
      ...commonMarkdownStyles.bullet_list_icon,
      color: "#444",
    },
    ordered_list_icon: {
      ...commonMarkdownStyles.ordered_list_icon,
      color: "#444",
    },
    blockquote: {
      ...commonMarkdownStyles.blockquote,
      backgroundColor: "#f4f4f4",
      borderLeftColor: "#cccccc",
    },
    image: { ...commonMarkdownStyles.image, backgroundColor: "#e0e0e0" },
    link: { ...commonMarkdownStyles.link, color: "#056bcd" },
    hr: { ...commonMarkdownStyles.hr, backgroundColor: "#cccccc" },
    code_inline: {
      ...commonMarkdownStyles.code_inline,
      backgroundColor: "#eeeeee",
      color: "#333",
    },
    fence: {
      ...commonMarkdownStyles.fence,
      backgroundColor: "#f4f4f4",
      color: "#333",
    },
  },
  message: { color: "#555555" },
};

export default Apprec8Reader;
