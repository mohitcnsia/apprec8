// components/quiz/Apprec8ReaderV2.js
import React, { useMemo, useRef, useEffect, useState } from "react";
import { View, StyleSheet, Text, Modal, Pressable, Dimensions } from "react-native";
import { Image } from "expo-image";
import ImageViewer from "react-native-image-zoom-viewer";
import { useTheme } from "../../context/ThemeContext";
import MarkdownDisplay from "react-native-markdown-display";
import LottieView from "lottie-react-native";
import YoutubeIframe from 'react-native-youtube-iframe';
import { Video, ResizeMode } from 'expo-av';

/**
 * An enhanced component to display markdown explanations alongside an animated mascot,
 * with support for rich media (images, YouTube) and trivia bubbles.
 *
 * @param {object} props - The component props.
 * @param {string|object} props.explanation - The explanation string or structured object.
 * @param {boolean} [props.isCorrect] - Optional: Used to show a specific animation state.
 * @returns {React.ReactElement}
 */
const Apprec8ReaderV2 = ({ explanation, isCorrect }) => {
  const { theme } = useTheme();
  const C = theme.appColors || theme;
  const animationRef = useRef(null);

  useEffect(() => {
    animationRef.current?.play();
  }, [isCorrect]);

  const [mediaError, setMediaError] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Reset media error state if the explanation changes (e.g. moving to a new question)
  useEffect(() => {
    setMediaError(false);
    setIsFullScreen(false);
  }, [explanation]);

  const expData = typeof explanation === 'string' ? { text: explanation } : (explanation || {});

  const getYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const markdownStyles = useMemo(
    () =>
      StyleSheet.create({
        body: { fontSize: 17, color: C.textPrimary, fontFamily: "nunito", lineHeight: 24 },
        heading1: {
          fontSize: 22,
          color: C.textPrimary,
          fontFamily: "nunitoBold",
          marginTop: 10,
          borderBottomWidth: 2,
          borderColor: C.borderLight,
          paddingBottom: 5,
        },
        strong: {
          fontFamily: "nunitoBold",
          color: C.textPrimary,
        }
      }),
    [C]
  );

  return (
    <View style={styles.outerWrapper}>
      
      {/* The Mascot Peeking Out */}
      <View style={styles.mascotContainer}>
        <LottieView
          ref={animationRef}
          source={require("../../assets/animations/mascot.json")}
          autoPlay={false}
          loop={false}
          style={styles.lottie}
        />
      </View>

      <View style={[styles.card, { backgroundColor: C.cardBackground, borderColor: C.borderLight, borderBottomColor: C.border }]}>
        
        {/* Main Text */}
        <View style={styles.textContainer}>
          <MarkdownDisplay style={markdownStyles}>{expData.text || ""}</MarkdownDisplay>
        </View>

        {/* Trivia Bubble */}
        {expData.trivia && (
          <View style={styles.triviaContainer}>
            <Text style={styles.triviaTitle}>✨ FUN FACT ✨</Text>
            <Text style={styles.triviaText}>{expData.trivia}</Text>
          </View>
        )}

        {/* Rich Media Section */}
        {expData.mediaType === 'image' && expData.mediaUrl && (
          <Pressable onPress={() => setIsFullScreen(true)}>
            <Image
              source={{ uri: expData.mediaUrl }}
              style={[styles.mediaImage, { borderColor: C.borderLight }]}
              contentFit="contain"
              cachePolicy="disk"
            />
          </Pressable>
        )}
        
        {!mediaError && expData.mediaType === 'video' && expData.mediaUrl && (
          getYoutubeId(expData.mediaUrl) ? (
            <View style={[styles.videoContainer, { borderColor: C.borderLight }]}>
              <YoutubeIframe
                height={200}
                play={false}
                videoId={getYoutubeId(expData.mediaUrl)}
                onError={() => setMediaError(true)}
                initialPlayerParams={{
                  modestbranding: true,
                  rel: false,
                  iv_load_policy: 3,
                }}
              />
            </View>
          ) : (
            <Video
              source={{ uri: expData.mediaUrl }}
              style={[styles.mediaImage, { borderColor: C.borderLight }]}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              isLooping={false}
              onError={() => setMediaError(true)}
            />
          )
        )}

      </View>

      {/* Full Screen Image Modal */}
      {expData.mediaType === 'image' && expData.mediaUrl && (
        <Modal
          visible={isFullScreen}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsFullScreen(false)}
        >
          <View style={styles.fullScreenOverlay}>
            <ImageViewer
              imageUrls={[{ url: expData.mediaUrl }]}
              backgroundColor="rgba(0,0,0,0.95)"
              renderIndicator={() => null}
              enableSwipeDown={true}
              onCancel={() => setIsFullScreen(false)}
            />
            
            <Pressable
              style={styles.closeButton}
              onPress={() => setIsFullScreen(false)}
            >
              <Text style={styles.closeButtonText}>✕ Close</Text>
            </Pressable>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  outerWrapper: {
    marginTop: 40, // Leave room for the peeking mascot
    paddingHorizontal: 5,
  },
  mascotContainer: {
    position: "absolute",
    top: -65, // Mascot peeks out of the top
    left: 20, // Offset to the left
    width: 100,
    height: 100,
    zIndex: 10, // Ensure it stays on top of the card
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
  card: {
    borderRadius: 24,
    padding: 20,
    paddingTop: 35, // Extra padding at top so text clears the mascot
    borderWidth: 2,
    borderBottomWidth: 6, // 3D effect
    marginBottom: 20,
  },
  textContainer: {
    marginBottom: 15,
  },
  mediaImage: {
    width: "100%",
    aspectRatio: 1.25, // Automatically scales height based on width, using more space natively
    borderRadius: 16,
    marginBottom: 15,
    borderWidth: 2,
    backgroundColor: 'rgba(0,0,0,0.05)', // Subtle background if image is transparent
  },
  videoContainer: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 15,
    borderWidth: 2,
  },
  triviaContainer: {
    padding: 16,
    borderRadius: 16,
    marginTop: 5,
    backgroundColor: "#FFF4CC", // Soft playful yellow
    borderWidth: 2,
    borderColor: "#FFC800", // Bright gold border
    borderBottomWidth: 5, // 3D effect on the trivia bubble too!
  },
  triviaTitle: {
    fontFamily: "nunitoBold",
    fontSize: 16,
    color: "#B38C00", // Dark gold
    marginBottom: 6,
    letterSpacing: 1,
  },
  triviaText: {
    fontFamily: "nunitoBold",
    fontSize: 15,
    color: "#8A6A00", // Rich dark brown/gold
    lineHeight: 22,
  },
  fullScreenOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
  },
  closeButton: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    zIndex: 100,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImageContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: "100%",
    height: "100%",
  },
});

export default Apprec8ReaderV2;
