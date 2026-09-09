import { useState, useEffect, useCallback } from "react";
import Constants from "expo-constants";
import { Platform } from "react-native";
import remoteConfig from "@react-native-firebase/remote-config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
  Timestamp,
} from "@react-native-firebase/firestore";
import { authInstance } from "../config/firebaseConfig";

export const SEEN_MESSAGES_KEY = "seen_in_app_messages";

/**
 * Manages fetching, displaying, and saving in-app messages from Remote Config.
 * @returns {{isLoading: boolean, messageToShow: object|null, handleClose: function, updateUrl: string}}
 */
export const useInAppMessaging = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [messageToShow, setMessageToShow] = useState(null);
  const [updateUrl, setUpdateUrl] = useState(""); // State to hold the correct update URL

  const saveMessageToInbox = async (message, urlToSave) => {
    const userId = authInstance.currentUser?.uid;
    if (!userId || !message.messageId) return;

    try {
      const db = getFirestore();
      const messageRef = doc(
        db,
        "users",
        userId,
        "messages",
        message.messageId
      );
      const expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      const messageForDb = {
        ...message,
        actionUrl: urlToSave || "", // Add the action URL here
        isRead: false,
        receivedAt: serverTimestamp(),
        expireAt: Timestamp.fromDate(expirationDate),
      };

      await setDoc(messageRef, messageForDb, { merge: true });
      console.log(`Message ${message.messageId} saved to user's inbox.`);
    } catch (error) {
      console.error("Failed to save message to inbox:", error);
    }
  };

  const markMessageAsSeen = async (messageId) => {
    try {
      const seenMessagesRaw = await AsyncStorage.getItem(SEEN_MESSAGES_KEY);
      const seenMessages = seenMessagesRaw ? JSON.parse(seenMessagesRaw) : [];
      if (!seenMessages.includes(messageId)) {
        const updatedSeenMessages = [...seenMessages, messageId];
        await AsyncStorage.setItem(
          SEEN_MESSAGES_KEY,
          JSON.stringify(updatedSeenMessages)
        );
        console.log(`Message ${messageId} marked as seen for this device.`);
      }
    } catch (error) {
      console.error("Failed to mark message as seen:", error);
    }
  };

  const handleClose = useCallback(() => {
    if (messageToShow) {
      if (messageToShow.type !== "hard_update") {
        markMessageAsSeen(messageToShow.messageId);
      }
    }
    setMessageToShow(null);
  }, [messageToShow]);

  useEffect(() => {
    const checkMessages = async () => {
      try {
        await remoteConfig().fetch(0);
        const activated = await remoteConfig().activate();

        if (activated) {
          console.log("Remote config data activated for messaging check.");
        }

        // --- THIS IS THE CORRECTED LOGIC ---
        // 1. Get the platform-specific URL and set it in state.
        const platformUpdateUrl =
          Platform.OS === "ios"
            ? remoteConfig().getValue("update_url_ios").asString()
            : remoteConfig().getValue("update_url_android").asString();
        setUpdateUrl(platformUpdateUrl);
        console.log(
          `[useInAppMessaging] Update URL for ${Platform.OS} is: '${platformUpdateUrl}'`
        );

        // 2. Get and process the active message.
        const messageString = remoteConfig()
          .getValue("active_message")
          .asString();
        if (!messageString) {
          console.log("No active message found.");
          return;
        }

        const message = JSON.parse(messageString);
        if (!message || !message.messageId) {
          console.log("Active message is invalid or missing an ID.");
          return;
        }

        // This logic correctly handles showing the message only if it hasn't been seen
        if (message.type === "hard_update") {
          // Version checking logic for hard updates
          const currentVersion = Constants.expoConfig?.version || Constants.manifest?.version || "0.0.0";
          const minVersion = message.min_version || "99.99.99"; // Require update if min_version is missing but type is hard_update

          const currentParts = currentVersion.split(".").map(Number);
          const minParts = minVersion.split(".").map(Number);

          let needsUpdate = false;
          for (let i = 0; i < 3; i++) {
            const curr = currentParts[i] || 0;
            const min = minParts[i] || 0;
            if (curr < min) {
              needsUpdate = true;
              break;
            } else if (curr > min) {
              break;
            }
          }

          if (needsUpdate) {
            setMessageToShow(message);
          }
        } else {
          const seenMessagesRaw = await AsyncStorage.getItem(SEEN_MESSAGES_KEY);
          const seenMessages = seenMessagesRaw
            ? JSON.parse(seenMessagesRaw)
            : [];

          if (!seenMessages.includes(message.messageId)) {
            await saveMessageToInbox(message, platformUpdateUrl);
            setMessageToShow(message);
          } else {
            console.log(`Message ${message.messageId} has already been seen.`);
          }
        }
      } catch (error) {
        console.error("Error with in-app messaging check:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (authInstance.currentUser) {
      checkMessages();
    } else {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, messageToShow, handleClose, updateUrl };
};
