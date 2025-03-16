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
  const theme = useColorScheme();
  const {
    title,
    author,
    coverImage,
    content,
    additionalImages = Array.isArray(route.params.additionalImages)
      ? route.params.additionalImages
      : [],
  } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openImage = (imageUri) => {
    setSelectedImage([{ url: imageUri }]);
    setModalVisible(true);
  };

  return (
    console.log("additionalImages:", additionalImages),
    (
      <View
        style={[
          styles.container,
          theme === "dark" ? styles.darkBackground : styles.lightBackground,
        ]}
      >
        <ScrollView>
          <View style={styles.header}>
            <Text
              style={[
                styles.title,
                theme === "dark" ? styles.darkText : styles.lightText,
              ]}
            >
              {title}
            </Text>
            <Text
              style={[
                styles.author,
                theme === "dark"
                  ? styles.darkTextSecondary
                  : styles.lightTextSecondary,
              ]}
            >
              By {author}
            </Text>
          </View>
          {coverImage && (
            <TouchableOpacity onPress={() => openImage(coverImage)}>
              <Image source={{ uri: coverImage }} style={styles.coverImage} />
            </TouchableOpacity>
          )}
          <Markdown
            style={theme === "dark" ? markdownDarkTheme : markdownLightTheme}
            rules={{
              image: (node) => (
                <TouchableOpacity
                  onPress={() => openImage(node.attributes.src)}
                >
                  <Image
                    source={{ uri: node.attributes.src }}
                    style={styles.markdownImage} // NEW style for markdown images
                  />
                </TouchableOpacity>
              ),
            }}
          >
            {content}
          </Markdown>

          <View style={styles.imageContainer}>
            {additionalImages.map((img, index) => (
              <TouchableOpacity
                key={`image-${index}-${img}`}
                onPress={() => openImage(img)}
              >
                <Image
                  source={{ uri: img }}
                  style={styles.additionalImage}
                  accessibilityLabel={`Additional image ${index + 1}`}
                />
              </TouchableOpacity>
            ))}
          </View>

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
    )
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 20 },
  header: { marginBottom: 20 },
  title: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: 0.5,
    lineHeight: 36,
  },
  author: { fontSize: 16, fontStyle: "italic", marginTop: 6, opacity: 0.8 },

  // ✅ Fix Cover Image
  coverImage: {
    width: "100%",
    height: 260,
    resizeMode: "cover",
    borderRadius: 12,
    marginBottom: 20,
  },

  // ✅ Fix Markdown Image (Full width, Proportional Height)
  markdownImage: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 12,
    marginBottom: 12,
  },

  // ✅ Fix Additional Images (Full width, Proportional Height)
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

  darkBackground: { backgroundColor: "#121212" },
  darkText: { color: "#EAEAEA" },
  darkTextSecondary: { color: "#BBBBBB" },
  lightBackground: { backgroundColor: "#FFFFFF" },
  lightText: { color: "#222" },
  lightTextSecondary: { color: "#666" },
});

const markdownDarkTheme = {
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
};

const markdownLightTheme = {
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
};

export default Apprec8Reader;
