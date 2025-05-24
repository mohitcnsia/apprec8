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
  Modal as RNModal,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
  Button,
  Platform,
  PanResponder,
} from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import Markdown from "react-native-markdown-display";

// ** IMPORTANT: Adjust these import paths if they are incorrect for your project structure **
import { listenToStudyContent } from "../../../services/firestoreContentApi";
import { useTheme } from "../../../context/ThemeContext";
import FeedbackFAB from "../FeedbackFAB";

const screenWidth = Dimensions.get("window").width;
const coverImageHeight = screenWidth * 0.6;
const TRIPLE_TAP_INTERVAL = 300;
const TRIPLE_TAP_RESET_TIMEOUT = 400;
const TAP_SLOP_THRESHOLD = 8; // Increased slightly, you can tune this

const Apprec8Reader = ({ route, navigation }) => {
  const { theme } = useTheme();
  const contentId = route?.params?.contentId;
  const isMounted = useRef(true);
  const [studyData, setStudyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageViewerModalVisible, setImageViewerModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState([]);
  const [isFabVisibleByGesture, setIsFabVisibleByGesture] = useState(false);
  const tapCountRef = useRef(0);
  const lastTapTimeRef = useRef(0);
  const gestureTimerRef = useRef(null);

  useEffect(() => {
    isMounted.current = true;
    setIsFabVisibleByGesture(false);
    tapCountRef.current = 0;
    lastTapTimeRef.current = 0;
    clearTimeout(gestureTimerRef.current);

    return () => {
      isMounted.current = false;
      clearTimeout(gestureTimerRef.current);
    };
  }, [contentId]);

  useEffect(() => {
    if (!contentId) {
      if (isMounted.current) {
        setError("No content specified.");
        setIsLoading(false);
        setStudyData(null);
      }
      return;
    }

    setIsLoading(true);
    setError(null);
    setStudyData(null);

    const unsubscribe = listenToStudyContent(
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
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      clearTimeout(gestureTimerRef.current);
    };
  }, [contentId, navigation]);

  const openImage = useCallback((imageUri) => {
    if (imageUri && typeof imageUri === "string" && imageUri.trim() !== "") {
      setSelectedImage([{ url: imageUri }]);
      setImageViewerModalVisible(true);
    } else {
      console.warn(
        "[Apprec8Reader] Attempted to open invalid image URI:",
        imageUri
      );
    }
  }, []);

  const screenPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        // console.log('[PanResponder] onStartShouldSetPanResponder');
        return true; // Try to claim initial touch
      },
      onStartShouldSetPanResponderCapture: (evt, gestureState) => {
        // console.log('[PanResponder] onStartShouldSetPanResponderCapture - letting children try first');
        return false; // Let children (ScrollView) try to claim first
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const isTapLike =
          Math.abs(gestureState.dx) < TAP_SLOP_THRESHOLD &&
          Math.abs(gestureState.dy) < TAP_SLOP_THRESHOLD;
        // console.log(`[PanResponder] onMoveShouldSetPanResponder, dx: ${gestureState.dx.toFixed(2)}, dy: ${gestureState.dy.toFixed(2)}, isTapLike: ${isTapLike}`);
        return isTapLike; // Only claim if it looks like a tap
      },
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        // console.log('[PanResponder] onMoveShouldSetPanResponderCapture');
        return false;
      },
      onPanResponderGrant: (evt, gestureState) => {
        // console.log('[PanResponder] Granted');
      },
      onPanResponderMove: (evt, gestureState) => {
        // console.log(`[PanResponder] Move, dx: ${gestureState.dx.toFixed(2)}, dy: ${gestureState.dy.toFixed(2)}`);
      },
      onPanResponderRelease: (evt, gestureState) => {
        console.log(
          `[PanResponder] Release - dx: ${gestureState.dx.toFixed(
            2
          )}, dy: ${gestureState.dy.toFixed(2)}, vx: ${gestureState.vx.toFixed(
            2
          )}, vy: ${gestureState.vy.toFixed(2)}`
        );
        if (
          Math.abs(gestureState.dx) < TAP_SLOP_THRESHOLD &&
          Math.abs(gestureState.dy) < TAP_SLOP_THRESHOLD
        ) {
          // It's a tap, process it for triple-tap logic
          const now = Date.now();
          clearTimeout(gestureTimerRef.current);

          if (
            tapCountRef.current === 0 ||
            now - lastTapTimeRef.current > TRIPLE_TAP_INTERVAL
          ) {
            tapCountRef.current = 1;
          } else {
            tapCountRef.current++;
          }
          lastTapTimeRef.current = now;
          console.log(
            `[Apprec8Reader] TAP PROCESSED. Count: ${tapCountRef.current}`
          );

          if (tapCountRef.current === 3) {
            console.log(
              "[Apprec8Reader] TRIPLE-TAP ACTION! Toggling FAB visibility."
            );
            setIsFabVisibleByGesture((prev) => !prev);
            tapCountRef.current = 0;
          } else {
            gestureTimerRef.current = setTimeout(() => {
              console.log(
                "[Apprec8Reader] Tap sequence timed out or incomplete, resetting count."
              );
              tapCountRef.current = 0;
            }, TRIPLE_TAP_RESET_TIMEOUT);
          }
        } else {
          console.log(
            "[Apprec8Reader] Swipe/Drag detected (not a tap), resetting tap count."
          );
          tapCountRef.current = 0;
          clearTimeout(gestureTimerRef.current);
        }
      },
      onPanResponderTerminate: (evt, gestureState) => {
        console.log("[PanResponder] Terminated, resetting tap count.");
        tapCountRef.current = 0;
        clearTimeout(gestureTimerRef.current);
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // console.log('[PanResponder] onShouldBlockNativeResponder');
        return false; // Do not block native responders like ScrollView's scroll
      },
    })
  ).current;

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
          paddingBottom: 80,
        },
        centered: {
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          padding: 20,
          backgroundColor: theme.background,
        },
        header: {
          marginBottom: 20,
          alignItems: "center",
        },
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
        markdownContainer: {
          marginBottom: 20,
        },
        markdownImageWrapper: {
          marginBottom: 12,
          alignItems: "center",
        },
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
      text: {
        fontSize: 18,
        lineHeight: 28,
        color: theme.textPrimary,
      },
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
      strong: {
        fontWeight: "bold",
        color: theme.textPrimary,
      },
      em: {
        fontStyle: "italic",
        color: theme.textPrimary,
      },
      bullet_list: {
        marginVertical: 10,
      },
      ordered_list: {
        marginVertical: 10,
      },
      list_item: {
        flexDirection: "row",
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
      hr: {
        height: 1,
        marginVertical: 20,
        backgroundColor: theme.border,
      },
      code_inline: {
        backgroundColor: theme.codeBackground || theme.placeholder,
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 3,
        fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
        color: theme.codeText || theme.textPrimary,
      },
      fence: {
        backgroundColor: theme.codeBackground || theme.placeholder,
        padding: 10,
        borderRadius: 4,
        marginVertical: 10,
        fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
        color: theme.codeText || theme.textPrimary,
      },
      markdownImageWrapper_image: {
        alignItems: "center",
        marginVertical: 10,
      },
    }),
    [theme]
  );

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
    coverImage: studyCoverImage,
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
          titlePreview: name ? name.substring(0, 70) : "Study Content",
        }
      : null;

  const fabShouldActuallyBeVisible = isFabVisibleByGesture && !!feedbackContext;

  return (
    <View style={styles.outerView} {...screenPanResponder.panHandlers}>
      <ScrollView
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        // onScrollBeginDrag={() => console.log("[ScrollView] onScrollBeginDrag")}
        // onScrollEndDrag={() => console.log("[ScrollView] onScrollEndDrag")}
        // onMomentumScrollBegin={() => console.log("[ScrollView] onMomentumScrollBegin")}
        // onMomentumScrollEnd={() => console.log("[ScrollView] onMomentumScrollEnd")}
      >
        <View style={styles.header}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.author}>By {author}</Text>
        </View>

        {studyCoverImage && (
          <TouchableOpacity onPress={() => openImage(studyCoverImage)}>
            <Image
              source={{ uri: studyCoverImage }}
              style={styles.coverImage}
              onError={(e) =>
                console.error(
                  "Cover Image Load Error:",
                  studyCoverImage,
                  e.nativeEvent.error
                )
              }
            />
          </TouchableOpacity>
        )}

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
                ) {
                  return null;
                }
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
                        console.error("MD Img Err:", src, e.nativeEvent.error)
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
            <Text style={styles.additionalImagesTitle}>Additional Images:</Text>
            {validAdditionalImages.map((img, index) =>
              img && typeof img === "string" && img.trim() !== "" ? (
                <TouchableOpacity
                  key={`add-img-${index}`}
                  onPress={() => openImage(img)}
                  style={styles.additionalImageTouchable}
                >
                  <Image
                    source={{ uri: img }}
                    style={styles.additionalImage}
                    onError={(e) =>
                      console.error("Add Img Err:", img, e.nativeEvent.error)
                    }
                  />
                </TouchableOpacity>
              ) : (
                <View
                  key={`inv-img-${index}`}
                  style={styles.invalidImagePlaceholder}
                >
                  <Text style={{ color: theme.textSecondary }}>
                    Invalid Image
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

      {feedbackContext && (
        <FeedbackFAB
          contentContext={feedbackContext}
          visible={fabShouldActuallyBeVisible}
        />
      )}
    </View>
  );
};

// Make sure ALL parts commented with /* ... */ are fully filled in, including:
// - Full style objects for 'styles' and 'markdownStyles'
// - Full JSX for loading, error, no data states
// - Full JSX for the content inside ScrollView (header, coverImage, markdown, additionalImages)
// - Full JSX for the RNModal containing ImageViewer
// The above code assumes styles, markdownStyles, loading/error/no data UI,
// and ScrollView/Modal content are now complete based on previous iterations.

export default Apprec8Reader;
