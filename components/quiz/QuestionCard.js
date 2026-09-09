// components/quiz/QuestionCard.js
import React, { useMemo, useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Card, IconButton } from "react-native-paper";
import { Video, ResizeMode, Audio } from 'expo-av';
import YoutubeIframe from 'react-native-youtube-iframe';
// Assuming this path is correct for your project structure
import { useTheme } from "../../context/ThemeContext";

/**
 * Renders the main content of a question (e.g., text, image) within a styled Card.
 * This component now displays an image above the question text if the question's
 * `type` is 'image' and a `mediaUrl` is provided.
 *
 * @param {object} props - The component props.
 * @param {object} props.question - The full question object from our Firestore schema.
 * @returns {React.ReactElement} A styled card displaying the question.
 */
const QuestionCard = ({ question }) => {
  const { theme } = useTheme();
  const C = theme.appColors || theme;
  // It's safer to provide a fallback to prevent crashes if question.question is undefined
  const questionContent = question.question || { type: "text", content: "" };

  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return sound ? () => {
      sound.unloadAsync();
    } : undefined;
  }, [sound]);

  const handlePlayAudio = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    } else {
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: questionContent.mediaUrl },
          { shouldPlay: true }
        );
        setSound(newSound);
        setIsPlaying(true);
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            setIsPlaying(false);
            newSound.setPositionAsync(0);
          }
        });
      } catch (error) {
        console.error("Failed to load audio", error);
      }
    }
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: C.cardBackground,
          borderRadius: 12,
          width: "100%",
          marginBottom: 20,
          minHeight: 150,
          justifyContent: "center",
          elevation: 2,
        },
        cardContent: { padding: 15, alignItems: "center" }, // Center content
        questionText: {
          fontSize: 20,
          lineHeight: 28,
          textAlign: "center",
          fontFamily: "nunitoBold",
          color: C.textPrimary,
        },
        // --- CHANGE 1: Renamed style for clarity and added margin ---
        image: {
          width: "100%",
          height: 180,
          borderRadius: 8,
          marginBottom: 15, // Add space between image and text
        },
      }),
    [C]
  );

  const getYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        {/* --- CHANGE 2: Updated rendering logic --- */}
        {/* First, check if the question is an image type and has a mediaUrl */}
        {questionContent.type === "image" && questionContent.mediaUrl && (
          <Image
            // Use the new 'mediaUrl' property for the image source
            source={{ uri: questionContent.mediaUrl }}
            style={styles.image}
            contentFit="contain"
            cachePolicy="disk"
          />
        )}

        {/* Support for video questions (MP4 or YouTube) */}
        {questionContent.type === "video" && questionContent.mediaUrl && (
          getYoutubeId(questionContent.mediaUrl) ? (
            <View style={{ width: '100%', marginBottom: 15, borderRadius: 8, overflow: 'hidden' }}>
              <YoutubeIframe
                height={200}
                play={false}
                videoId={getYoutubeId(questionContent.mediaUrl)}
                initialPlayerParams={{
                  modestbranding: true,
                  rel: false,
                  iv_load_policy: 3,
                }}
              />
            </View>
          ) : (
            <Video
              source={{ uri: questionContent.mediaUrl }}
              style={styles.image}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              isLooping={false}
            />
          )
        )}

        {/* Support for audio questions */}
        {questionContent.type === "audio" && questionContent.mediaUrl && (
          <View style={{ alignItems: 'center', marginBottom: 15 }}>
            <IconButton
              icon={isPlaying ? "pause-circle" : "play-circle"}
              size={50}
              iconColor={C.primary}
              onPress={handlePlayAudio}
            />
          </View>
        )}

        {/* The question text is now always displayed. */}
        {/* If there's an image, it will appear below it. */}
        <Text style={styles.questionText}>{questionContent.content}</Text>
      </Card.Content>
    </Card>
  );
};

export default QuestionCard;
