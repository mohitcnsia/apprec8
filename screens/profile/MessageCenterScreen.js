import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Button,
  Linking,
  SafeAreaView,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { authInstance } from "../../config/firebaseConfig";
import { listenToUserMessages } from "../../store/firestore-api"; // Import our new listener

// A small component to render each item in the list
const MessageItem = ({ item }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme); // Use a shared stylesheet

  // Format the date nicely
  const receivedDate = item.receivedAt?.toDate
    ? item.receivedAt.toDate().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Just now";

  const handleActionPress = () => {
    if (item.actionUrl) {
      Linking.canOpenURL(item.actionUrl).then((supported) => {
        if (supported) {
          Linking.openURL(item.actionUrl);
        } else {
          console.log(`Don't know how to open this URL: ${item.actionUrl}`);
        }
      });
    }
  };

  return (
    <View style={styles.messageCard}>
      <Text style={styles.messageTitle}>{item.title}</Text>
      <Text style={styles.messageBody}>{item.body}</Text>
      {item.actionUrl ? (
        <View style={styles.actionButtonContainer}>
          <Button
            title={item.primaryButton?.text || "Check it out"}
            onPress={handleActionPress}
            color={theme.primary}
          />
        </View>
      ) : (
        <Text style={styles.messageDate}>{receivedDate}</Text>
      )}
    </View>
  );
};

const MessageCenterScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = authInstance.currentUser?.uid;

  useEffect(() => {
    if (!userId) {
      setError("You must be logged in to view messages.");
      setIsLoading(false);
      return;
    }

    // Set up the real-time listener from our API file
    const unsubscribe = listenToUserMessages(
      userId,
      (fetchedMessages) => {
        setMessages(fetchedMessages);
        if (isLoading) setIsLoading(false);
        setError(null);
      },
      (err) => {
        setError("Could not load messages.");
        setIsLoading(false);
      }
    );

    // Clean up the listener when the screen is unmounted
    return () => unsubscribe();
  }, [userId]);

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageItem item={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.centeredContainer}>
            <Text style={styles.emptyText}>You have no messages.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    centeredContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    errorText: {
      color: theme.warning,
      fontSize: 16,
    },
    emptyText: {
      color: theme.textSecondary,
      fontSize: 16,
    },
    listContent: {
      padding: 16,
    },
    messageCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    messageTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.textPrimary,
      marginBottom: 4,
    },
    messageBody: {
      fontSize: 14,
      color: theme.textSecondary,
      lineHeight: 20,
      marginBottom: 10,
    },
    messageDate: {
      fontSize: 12,
      color: theme.textSecondary,
      textAlign: "right",
      fontStyle: "italic",
    },
    actionButtonContainer: {
      marginTop: 10,
      alignItems: "flex-start",
    },
  });

export default MessageCenterScreen;
