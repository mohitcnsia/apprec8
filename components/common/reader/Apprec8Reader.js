// components/common/reader/Apprec8Reader.js
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Modal as RNModal, // Renamed to avoid conflict
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
  Button,
  TouchableWithoutFeedback, // For triple-tap
} from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import Markdown from "react-native-markdown-display";
import { listenToStudyContent } from "../../../services/firestoreContentApi"; // Adjust path if needed
import { useTheme } from "../../../context/ThemeContext"; // Adjust path if needed
import FeedbackFAB from "../FeedbackFAB"; // Adjust path to your FeedbackFAB component

const screenWidth = Dimensions.get("window").width;
const coverImageHeight = screenWidth * 0.6;
const TRIPLE_TAP_DELAY = 300; // Milliseconds for triple-tap detection

const Apprec8Reader = ({ route, navigation }) => {
  const { theme } = useTheme();

  const contentId = route?.params?.contentId;
  const isMounted = useRef(true);
  const [studyData, setStudyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageViewerModalVisible, setImageViewerModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState([]);

  // --- State and Refs for FAB Visibility (Triple Tap) ---
  const [isFabVisibleByGesture, setIsFabVisibleByGesture] = useState(false); // Starts hidden
  const tapCountRef = useRef(0);
  const lastTapTimestampRef = useRef(0);
  const tapTimerRef = useRef(null); // Timer to reset tap count for triple-tap sequence

  useEffect(() => {
    // This effect runs when contentId changes, or on initial mount if contentId is present.

    // 1. Reset FAB visibility states for new content
    console.log(
      `[Apprec8Reader] contentId effect: ${contentId}. Resetting FAB visibility and tap state.`
    );
    setIsFabVisibleByGesture(false);
    tapCountRef.current = 0;
    clearTimeout(tapTimerRef.current);

    // 2. Handle data fetching based on contentId
    if (!contentId) {
      if (isMounted.current) {
        // isMounted.current is still useful for async operations
        setError("No content specified.");
        setIsLoading(false);
        setStudyData(null); // Ensure studyData is also cleared
      }
      return; // Exit if no contentId
    }

    // Start loading for the new contentId
    setIsLoading(true);
    setError(null);
    setStudyData(null);

    console.log(`[Apprec8Reader] Fetching study content for ID: ${contentId}`);
    const unsubscribeFirestore = listenToStudyContent(
      // Renamed to avoid conflict with returned function
      contentId,
      (data) => {
        if (isMounted.current) {
          if (data) {
            setStudyData(data);
            setError(null);
            if (data.name) {
              navigation.setOptions({ title: data.name });
            }
          } else {
            setError("Study content not found.");
            setStudyData(null);
          }
          setIsLoading(false);
        }
      },
      (fetchError) => {
        if (isMounted.current) {
          setError(fetchError?.message || "Could not load study content.");
          setStudyData(null);
          setIsLoading(false);
        }
      }
    );

    // 3. Return cleanup function
    return () => {
      console.log(
        `[Apprec8Reader] Cleaning up effect for contentId: ${contentId}`
      );
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
      }
      clearTimeout(tapTimerRef.current); // Ensure tap timer is cleared
    };
  }, [contentId, navigation]); // Dependencies: contentId and navigation (for setOptions)

  // Separate effect for mount/unmount if 'isMounted.current' is used elsewhere
  // or for general component lifecycle cleanup not tied to contentId.
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []); // Empty dependency array means this runs only on mount and unmount

  const openImage = useCallback((imageUri) => {
    if (imageUri && typeof imageUri === "string" && imageUri.trim() !== "") {
      setSelectedImage([{ url: imageUri }]);
      setImageViewerModalVisible(true);
    } else {
      console.warn("Attempted to open invalid image URI:", imageUri);
    }
  }, []);

  // Triple-tap handler to toggle FAB visibility
  const handleScreenPressForFabToggle = () => {
    const now = Date.now();
    clearTimeout(tapTimerRef.current); // Clear previous reset timer

    // If current tap is too slow after a sequence started, reset count
    if (
      tapCountRef.current > 0 &&
      now - lastTapTimestampRef.current > TRIPLE_TAP_DELAY
    ) {
      // console.log('[Apprec8Reader] Tap sequence broken (too slow since last tap), resetting count.');
      tapCountRef.current = 0;
    }

    tapCountRef.current += 1;
    lastTapTimestampRef.current = now;
    // console.log(`[Apprec8Reader] Tap recorded. Count: ${tapCountRef.current}`);

    if (tapCountRef.current === 3) {
      console.log(
        "[Apprec8Reader] Triple-tap detected! Toggling FAB visibility."
      );
      setIsFabVisibleByGesture((prev) => !prev);
      tapCountRef.current = 0; // Reset count after successful triple-tap action
    } else if (tapCountRef.current > 0) {
      // Set a timer: if no more taps come soon enough to complete a triple, reset the count.
      tapTimerRef.current = setTimeout(() => {
        // console.log('[Apprec8Reader] Tap sequence incomplete within time, resetting tap count.');
        tapCountRef.current = 0;
      }, TRIPLE_TAP_DELAY * 2);
    }
  };

  // Styles
  const styles = useMemo(
    () =>
      StyleSheet.create({
        outerView: {
          flex: 1,
          backgroundColor: theme.background,
        },
        scrollContentContainer: {
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingTop: 20,
          paddingBottom: 80, // Space for FAB
        },
        centered: {
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          padding: 20,
          backgroundColor: theme.background,
        },
        header: { marginBottom: 20, alignItems: "center" },
        name: {
          fontSize: 28,
          fontWeight: "bold",
          letterSpacing: 0.5,
          lineHeight: 36,
          textAlign: "center",
          color: theme.textPrimary,
        },
        author: {
          fontSize: 16,
          fontStyle: "italic",
          marginTop: 6,
          opacity: 0.8,
          textAlign: "center",
          color: theme.textSecondary,
        },
        coverImage: {
          width: "100%",
          height: coverImageHeight,
          resizeMode: "cover",
          borderRadius: 12,
          marginBottom: 20,
          backgroundColor: theme.placeholder || "#e0e0e0",
        },
        markdownContainer: { marginBottom: 20 },
        markdownImageWrapper: { marginBottom: 12, alignItems: "center" },
        imageContainer: {
          marginTop: 20,
          marginBottom: 20,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: theme.border || "#cccccc66",
        },
        additionalImagesTitle: {
          fontSize: 18,
          fontWeight: "bold",
          marginBottom: 15,
          textAlign: "center",
          color: theme.textPrimary,
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
          backgroundColor: theme.placeholder || "#e0e0e0",
        },
        invalidImagePlaceholder: {
          width: "95%",
          aspectRatio: 16 / 9,
          borderRadius: 10,
          marginBottom: 12,
          backgroundColor: theme.placeholder || "#eeeeee",
          justifyContent: "center",
          alignItems: "center",
        },
        message: {
          fontSize: 18,
          textAlign: "center",
          marginTop: 20,
          paddingHorizontal: 20,
          color: theme.textSecondary,
        },
        errorTextSpecific: {
          fontSize: 18,
          textAlign: "center",
          marginTop: 20,
          paddingHorizontal: 20,
          color: theme.warning,
        },
      }),
    [theme]
  );

  // Markdown Styles
  const markdownStyles = useMemo(
    () => ({
      text: { fontSize: 18, lineHeight: 28, color: theme.textPrimary },
      heading1: {
        fontSize: 32,
        fontWeight: "bold",
        marginTop: 15,
        marginBottom: 10,
        lineHeight: 40,
        color: theme.textPrimary,
        borderBottomColor: theme.border,
        borderBottomWidth: 1,
      },
      heading2: {
        fontSize: 28,
        fontWeight: "bold",
        marginTop: 12,
        marginBottom: 8,
        lineHeight: 36,
        color: theme.textPrimary,
      },
      heading3: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 10,
        marginBottom: 6,
        lineHeight: 32,
        color: theme.textPrimary,
      },
      strong: { fontWeight: "bold", color: theme.textPrimary },
      em: { fontStyle: "italic", color: theme.textPrimary },
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
        color: theme.textSecondary,
      },
      ordered_list_icon: {
        fontSize: 17,
        lineHeight: 26,
        marginRight: 8,
        fontWeight: "bold",
        color: theme.textSecondary,
      },
      blockquote: {
        paddingLeft: 15,
        marginLeft: 0,
        borderLeftWidth: 4,
        marginVertical: 10,
        opacity: 0.9,
        backgroundColor:
          theme.quoteBackground ||
          (theme.primary ? theme.primary + "15" : "#E0E0E015"),
        borderLeftColor: theme.quoteBorder || theme.primary,
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
        backgroundColor: theme.placeholder,
      },
      link: {
        textDecorationLine: "underline",
        color: theme.link || theme.accent,
      },
      hr: { height: 1, marginVertical: 20, backgroundColor: theme.border },
      code_inline: {
        backgroundColor: theme.codeBackground || theme.placeholder,
        paddingHorizontal: 4,
        borderRadius: 3,
        color: theme.codeText || theme.textPrimary,
      },
      fence: {
        backgroundColor: theme.codeBackground || theme.placeholder,
        padding: 10,
        borderRadius: 4,
        marginVertical: 10,
        color: theme.codeText || theme.textPrimary,
      },
    }),
    [theme]
  );

  // --- RENDER LOGIC ---
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.primary || "#800000"} />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTextSpecific}>{error}</Text>
        {navigation.canGoBack() && (
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            color={theme.primary || "#800000"}
          />
        )}
      </View>
    );
  }
  if (!studyData) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>Content not available.</Text>
        {navigation.canGoBack() && (
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            color={theme.primary || "#800000"}
          />
        )}
      </View>
    );
  }

  const {
    name = "Untitled Content",
    author = "Unknown Author",
    coverImage,
    content = "No text content available.",
    additionalImages = [],
  } = studyData;
  const validAdditionalImages = Array.isArray(additionalImages)
    ? additionalImages
    : [];

  const feedbackContext =
    contentId && studyData
      ? {
          type: "study_content",
          id: contentId,
          titlePreview: studyData.name
            ? studyData.name.substring(0, 70)
            : "Study Content",
        }
      : null;

  // Determine final FAB visibility
  const fabShouldActuallyBeVisible = isFabVisibleByGesture && !!feedbackContext;

  return (
    <TouchableWithoutFeedback
      onPress={handleScreenPressForFabToggle}
      accessible={false}
    >
      <View style={styles.outerView}>
        <ScrollView
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.author}>By {author}</Text>
          </View>
          {coverImage ? (
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
              />
            </TouchableOpacity>
          ) : null}
          <View style={styles.markdownContainer}>
            <Markdown
              style={markdownStyles}
              rules={{
                image: (node, children, parent, mdStyles) => {
                  const src = node.attributes.src;
                  if (
                    !src ||
                    typeof src !== "string" ||
                    !src.startsWith("http")
                  )
                    return null;
                  return (
                    <TouchableOpacity
                      key={node.key}
                      onPress={() => openImage(src)}
                      style={
                        mdStyles.markdownImageWrapper_image ||
                        styles.markdownImageWrapper
                      }
                    >
                      <Image
                        source={{ uri: src }}
                        style={mdStyles.image}
                        onError={(e) =>
                          console.error(
                            "Markdown Image Load Error:",
                            src,
                            e.nativeEvent.error
                          )
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
          {validAdditionalImages.length > 0 && (
            <View style={styles.imageContainer}>
              <Text style={styles.additionalImagesTitle}>
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
                    />
                  </TouchableOpacity>
                ) : (
                  <View
                    key={`invalid-image-${index}`}
                    style={styles.invalidImagePlaceholder}
                  >
                    <Text style={{ color: theme.textSecondary }}>
                      Invalid Image Entry
                    </Text>
                  </View>
                )
              )}
            </View>
          )}
        </ScrollView>

        <RNModal
          visible={imageViewerModalVisible}
          transparent={true}
          onRequestClose={() => setImageViewerModalVisible(false)}
        >
          <ImageViewer
            imageUrls={selectedImage}
            enableSwipeDown={true}
            onSwipeDown={() => setImageViewerModalVisible(false)}
            renderIndicator={() => null}
            loadingRender={() => (
              <ActivityIndicator
                size="large"
                color={theme.primaryWhite || "#FFFFFF"}
              />
            )}
          />
        </RNModal>

        {/* FeedbackFAB: Mount if context is valid, visibility controlled by gesture */}
        {feedbackContext && (
          <FeedbackFAB
            contentContext={feedbackContext}
            visible={fabShouldActuallyBeVisible}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Apprec8Reader;
