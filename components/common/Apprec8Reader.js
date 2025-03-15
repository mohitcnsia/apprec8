import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Modal,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";

const Apprec8Reader = ({ route }) => {
  const theme = useColorScheme();
  const {
    title,
    author,
    coverImage,
    content,
    additionalImages = [],
  } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Open Image in Full-Screen Mode
  const openImage = (imageUri) => {
    setSelectedImage([{ url: imageUri }]);
    setModalVisible(true);
  };

  const renderContent = (item, index) => {
    console.log("Rendering item:", item); // Debugging

    if (item.heading) {
      return (
        <Text
          key={index}
          style={[
            styles.heading,
            theme === "dark" ? styles.darkText : styles.lightText,
          ]}
        >
          {item.heading}
        </Text>
      );
    }

    if (item.paragraph) {
      return (
        <Text
          key={index}
          style={[
            styles.paragraph,
            theme === "dark" ? styles.darkText : styles.lightText,
          ]}
        >
          {item.paragraph}
        </Text>
      );
    }

    if (item.image) {
      return (
        <TouchableOpacity key={index} onPress={() => openImage(item.image)}>
          <Image source={{ uri: item.image }} style={styles.inlineImage} />
        </TouchableOpacity>
      );
    }

    return null; // Prevent rendering empty elements
  };

  return (
    <ScrollView
      style={[
        styles.container,
        theme === "dark" ? styles.darkBackground : styles.lightBackground,
      ]}
    >
      {/* Title & Author */}
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

      {/* Clickable Cover Image */}
      {coverImage && (
        <TouchableOpacity onPress={() => openImage(coverImage)}>
          <Image source={{ uri: coverImage }} style={styles.coverImage} />
        </TouchableOpacity>
      )}

      {/* Content */}
      <View>
        {/* Rendering the content */}
        {content && content.map((item, index) => renderContent(item, index))}
      </View>

      {/* Additional Clickable Images */}
      <View style={styles.imageContainer}>
        {additionalImages.length > 0 ? (
          additionalImages.map((img, index) => (
            <TouchableOpacity key={index} onPress={() => openImage(img)}>
              <Image source={{ uri: img }} style={styles.additionalImage} />
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noImageText}>No additional images available</Text>
        )}
      </View>

      {/* Full-Screen Image Viewer Modal */}
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
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  header: { marginBottom: 15 },
  title: { fontSize: 26, fontWeight: "bold" },
  author: { fontSize: 16, fontStyle: "italic", marginTop: 4 },
  coverImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: 15,
  },
  content: { marginBottom: 20 },
  paragraph: {
    fontSize: 18,
    lineHeight: 28,
    textAlign: "justify",
    marginBottom: 12,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  bulletContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  bulletPoint: { fontSize: 20, marginRight: 10 },
  bulletText: { fontSize: 18, flex: 1 },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 10,
  },
  additionalImage: {
    width: 150,
    height: 150,
    resizeMode: "cover",
    borderRadius: 8,
    margin: 5,
  },
  noImageText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginTop: 10,
  },
  inlineImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 10,
    marginVertical: 10,
  },
  darkBackground: { backgroundColor: "#1c1c1e" },
  darkText: { color: "#f4f4f4" },
  darkTextSecondary: { color: "#aaa" },
  lightBackground: { backgroundColor: "#ffffff" },
  lightText: { color: "#222" },
  lightTextSecondary: { color: "#555" },
});

export default Apprec8Reader;
