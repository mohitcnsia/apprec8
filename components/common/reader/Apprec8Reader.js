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
  Modal,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
  Button, // Kept for fallback error button
} from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import Markdown from "react-native-markdown-display";
import { listenToStudyContent } from "../../../services/firestoreContentApi";
import { useTheme } from "../../../context/ThemeContext";
import FeedbackFAB from "../FeedbackFAB"; // <<< ADDED IMPORT (Adjust path: if FeedbackFAB is in /common, this becomes '../FeedbackFAB')

const screenWidth = Dimensions.get("window").width;
const coverImageHeight = screenWidth * 0.6;

const Apprec8Reader = ({ route, navigation }) => {
  const { theme } = useTheme();

  const contentId = route?.params?.contentId;
  const isMounted = useRef(true);
  const [studyData, setStudyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState([]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!contentId) {
      if (isMounted.current) {
        setError("No content specified.");
        setIsLoading(false);
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
            // Set screen title if possible
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
    return () => unsubscribe();
  }, [contentId, navigation]); // Added navigation to dependency array for setOptions

  const openImage = useCallback((imageUri) => {
    if (imageUri && typeof imageUri === "string" && imageUri.trim() !== "") {
      setSelectedImage([{ url: imageUri }]);
      setModalVisible(true);
    } else {
      console.warn("Attempted to open invalid image URI:", imageUri);
    }
  }, []);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          paddingHorizontal: 16,
          paddingTop: 20,
          backgroundColor: theme.background,
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
        backgroundColor: theme.quoteBackground || theme.primary + "15",
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

  // Prepare contentContext for FeedbackFAB
  const feedbackContext =
    contentId && studyData
      ? {
          type: "study_content", // Or 'study_material_page'
          id: contentId,
          // parentId: studyData.topicId || studyData.categoryId, // If available from studyData
          titlePreview: studyData.name
            ? studyData.name.substring(0, 70)
            : "Study Content",
        }
      : null;

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Ensure main view has flex 1 for FAB positioning */}
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
                // Changed styles to mdStyles to avoid conflict
                const src = node.attributes.src;
                if (!src || typeof src !== "string" || !src.startsWith("http"))
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
            <Text style={styles.additionalImagesTitle}>Additional Images:</Text>
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
              <ActivityIndicator
                size="large"
                color={theme.primaryWhite || "#FFFFFF"}
              />
            )}
          />
        </Modal>
      </ScrollView>
      {/* ADDED FeedbackFAB - Render only if context can be formed */}
      {feedbackContext && <FeedbackFAB contentContext={feedbackContext} />}
    </View>
  );
};

export default Apprec8Reader;
