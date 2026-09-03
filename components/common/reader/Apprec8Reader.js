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

import { listenToStudyContent } from "../../../services/firestoreContentApi";
import { useTheme } from "../../../context/ThemeContext";
import FeedbackFAB from "../FeedbackFAB";

const screenWidth = Dimensions.get("window").width;
const coverImageHeight = screenWidth * 0.6;

const TRIPLE_TAP_INTERVAL = 300;
const TRIPLE_TAP_RESET_TIMEOUT = 400;
const TAP_SLOP_THRESHOLD = 10;
const TAP_ZONE_SIZE = 80;

const Apprec8Reader = ({ route, navigation }) => {
  const { theme } = useTheme();
  const C = theme.appColors || theme;
  const contentId = route?.params?.contentId;
  const completedQuizId = route?.params?.completedQuizId;

  const isMounted = useRef(true);
  const [studyData, setStudyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageViewerModalVisible, setImageViewerModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState([]);

  const [isFabVisibleByGesture, setIsFabVisibleByGesture] = useState(false);
  const tapCountRef = useRef(0);
  const lastTapTimestampRef = useRef(0);
  const gestureTimerRef = useRef(null);

  const isFabContextActiveRef = useRef(false);
  useEffect(() => {
    isFabContextActiveRef.current = !!(studyData && !isLoading && !error);
  }, [studyData, isLoading, error]);

  useEffect(() => {
    isMounted.current = true;
    setIsFabVisibleByGesture(false);
    tapCountRef.current = 0;
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
        isFabContextActiveRef.current = false;
      }
      return;
    }
    setIsLoading(true);
    setError(null);
    setStudyData(null);
    isFabContextActiveRef.current = false;

    const unsubscribe = listenToStudyContent(
      contentId,
      (data) => {
        if (isMounted.current) {
          if (data) {
            setStudyData(data);
            setError(null);
            isFabContextActiveRef.current = true;
            if (data.name) {
              navigation.setOptions({ title: data.name });
            }
          } else {
            setError("Study content not found.");
            setStudyData(null);
            isFabContextActiveRef.current = false;
          }
          setIsLoading(false);
        }
      },
      (fetchError) => {
        if (isMounted.current) {
          setError(fetchError?.message || "Could not load study content.");
          setStudyData(null);
          isFabContextActiveRef.current = false;
          setIsLoading(false);
        }
      }
    );
    return () => {
      if (unsubscribe) unsubscribe();
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

  const cornerTapPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        return isFabContextActiveRef.current;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        if (!isFabContextActiveRef.current) return false;
        return (
          Math.abs(gestureState.dx) < TAP_SLOP_THRESHOLD &&
          Math.abs(gestureState.dy) < TAP_SLOP_THRESHOLD
        );
      },
      onPanResponderGrant: (evt, gestureState) => {
        // console.log("[Apprec8Reader CornerTap] Granted to Zone");
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (!isFabContextActiveRef.current) {
          tapCountRef.current = 0;
          clearTimeout(gestureTimerRef.current);
          return;
        }
        if (
          Math.abs(gestureState.dx) < TAP_SLOP_THRESHOLD &&
          Math.abs(gestureState.dy) < TAP_SLOP_THRESHOLD
        ) {
          const now = Date.now();
          clearTimeout(gestureTimerRef.current);
          if (
            tapCountRef.current === 0 ||
            now - lastTapTimestampRef.current > TRIPLE_TAP_INTERVAL * 1.5
          ) {
            tapCountRef.current = 1;
          } else {
            tapCountRef.current++;
          }
          lastTapTimestampRef.current = now;
          if (tapCountRef.current === 3) {
            setIsFabVisibleByGesture((prev) => !prev);
            tapCountRef.current = 0;
          } else if (tapCountRef.current > 0) {
            gestureTimerRef.current = setTimeout(() => {
              tapCountRef.current = 0;
            }, TRIPLE_TAP_RESET_TIMEOUT);
          }
        } else {
          tapCountRef.current = 0;
          clearTimeout(gestureTimerRef.current);
        }
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // console.log('[Apprec8Reader CornerTap] Terminated, resetting tap count.');
        tapCountRef.current = 0;
        clearTimeout(gestureTimerRef.current);
      },
      onPanResponderTerminationRequest: (evt, gestureState) => {
        // console.log('[Apprec8Reader CornerTap] Termination requested. Yielding.');
        return true;
      },
    })
  ).current;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        outerView: { flex: 1, backgroundColor: C.background },
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
          backgroundColor: C.background,
        },
        header: { marginBottom: 20, alignItems: "center" },
        name: {
          fontSize: 28,
          fontWeight: "bold",
          letterSpacing: 0.5,
          lineHeight: 36,
          textAlign: "center",
          color: C.textPrimary,
        },
        author: {
          fontSize: 16,
          fontStyle: "italic",
          marginTop: 6,
          opacity: 0.8,
          textAlign: "center",
          color: C.textSecondary,
        },
        coverImage: {
          width: "100%",
          height: coverImageHeight,
          resizeMode: "cover",
          borderRadius: 12,
          marginBottom: 20,
          backgroundColor: C.placeholder || "#e0e0e0",
        },
        markdownContainer: { marginBottom: 20 },
        markdownImageWrapper: { marginBottom: 12, alignItems: "center" },
        imageContainer: {
          marginTop: 20,
          marginBottom: 20,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: C.border || "#cccccc66",
        },
        additionalImagesTitle: {
          fontSize: 18,
          fontWeight: "bold",
          marginBottom: 15,
          textAlign: "center",
          color: C.textPrimary,
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
          backgroundColor: C.placeholder || "#e0e0e0",
        },
        invalidImagePlaceholder: {
          width: "95%",
          aspectRatio: 16 / 9,
          borderRadius: 10,
          marginBottom: 12,
          backgroundColor: C.placeholder || "#eeeeee",
          justifyContent: "center",
          alignItems: "center",
        },
        message: {
          fontSize: 18,
          textAlign: "center",
          marginTop: 20,
          paddingHorizontal: 20,
          color: C.textSecondary,
        },
        errorTextSpecific: {
          fontSize: 18,
          textAlign: "center",
          marginTop: 20,
          paddingHorizontal: 20,
          color: C.warning || C.errorRed,
        },
        tripleTapZone: {
          position: "absolute",
          bottom: 10,
          right: 10,
          width: TAP_ZONE_SIZE,
          height: TAP_ZONE_SIZE,
          // borderColor: "red",
          // borderWidth: 2,
          // borderStyle: "dashed",
        },
      }),
    [C, coverImageHeight]
  );

  const markdownStyles = useMemo(
    () => ({
      text: { fontSize: 18, lineHeight: 28, color: C.textPrimary },
      heading1: {
        fontSize: 32,
        fontWeight: "bold",
        marginTop: 15,
        marginBottom: 10,
        lineHeight: 40,
        color: C.textPrimary,
        borderBottomColor: C.border,
        borderBottomWidth: 1,
      },
      heading2: {
        fontSize: 28,
        fontWeight: "bold",
        marginTop: 12,
        marginBottom: 8,
        lineHeight: 36,
        color: C.textPrimary,
      },
      heading3: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 10,
        marginBottom: 6,
        lineHeight: 32,
        color: C.textPrimary,
      },
      strong: { fontWeight: "bold", color: C.textPrimary },
      em: { fontStyle: "italic", color: C.textPrimary },
      bullet_list: { marginVertical: 10 },
      ordered_list: { marginVertical: 10 },
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
        color: C.textSecondary,
      },
      ordered_list_icon: {
        fontSize: 17,
        lineHeight: 26,
        marginRight: 8,
        fontWeight: "bold",
        color: C.textSecondary,
      },
      blockquote: {
        paddingLeft: 15,
        marginLeft: 0,
        borderLeftWidth: 4,
        marginVertical: 10,
        opacity: 0.9,
        backgroundColor:
          C.quoteBackground || (C.primary ? C.primary + "15" : "#E0E0E015"),
        borderLeftColor: C.quoteBorder || C.primary,
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
        backgroundColor: C.placeholder,
      },
      link: { textDecorationLine: "underline", color: C.link || C.accent },
      hr: { height: 1, marginVertical: 20, backgroundColor: C.border },
      code_inline: {
        backgroundColor: C.codeBackground || C.placeholder,
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 3,
        fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
        color: C.codeText || C.textPrimary,
      },
      fence: {
        backgroundColor: C.codeBackground || C.placeholder,
        padding: 10,
        borderRadius: 4,
        marginVertical: 10,
        fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
        color: C.codeText || C.textPrimary,
      },
      markdownImageWrapper_image: { alignItems: "center", marginVertical: 10 },
    }),
    [C, screenWidth]
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={C.primary || "#800000"} />
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
            color={C.primary || "#800000"}
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
            color={C.primary || "#800000"}
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
  const currentFabContextActive = isFabContextActiveRef.current;

  return (
    <View style={styles.outerView}>
      <ScrollView
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
                  <Text style={{ color: C.textSecondary }}>Invalid Image</Text>
                </View>
              )
            )}
          </View>
        )}
        {completedQuizId && (
          <View style={{ marginTop: 30, marginBottom: 20, alignItems: 'center' }}>
            <Button 
              title="Mark as Read & Continue" 
              onPress={() => navigation.navigate("QuestMap", { completedQuizId })} 
              color={C.primary || "#58CC02"}
            />
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
              color={C.primaryWhite || "#FFFFFF"}
            />
          )}
        />
      </RNModal>

      {currentFabContextActive && (
        <View
          style={styles.tripleTapZone}
          {...cornerTapPanResponder.panHandlers}
        />
      )}
      {currentFabContextActive && feedbackContext && (
        <FeedbackFAB
          contentContext={feedbackContext}
          visible={isFabVisibleByGesture}
        />
      )}
    </View>
  );
};

export default Apprec8Reader;
