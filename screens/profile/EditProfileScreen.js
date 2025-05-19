// screens/profile/EditProfileScreen.js
import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  FlatList,
} from "react-native";
import { TextInput, Button as PaperButton } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContext";
import {
  authInstance,
  db as firestoreService,
} from "../../config/firebaseConfig";
import firestore from "@react-native-firebase/firestore";

const PREDEFINED_AVATARS = [
  "https://firebasestorage.googleapis.com/v0/b/apprec8-ca229.firebasestorage.app/o/avatars%2Fbee3.webp?alt=media&token=e4b96cb2-7180-4a9b-900d-14c34dbaa6ba",
  "https://firebasestorage.googleapis.com/v0/b/apprec8-ca229.firebasestorage.app/o/avatars%2Fbee4.webp?alt=media&token=018f93c2-f566-4f40-a91f-f279a829c5c7",
  "https://firebasestorage.googleapis.com/v0/b/apprec8-ca229.firebasestorage.app/o/avatars%2Fmonster1.webp?alt=media&token=ca184ae0-9478-402e-aee3-c3e7bccebc0e",
  "https://api.dicebear.com/8.x/big-smile/png?seed=Buddy&backgroundColor=ffd5dc",
  "https://api.dicebear.com/8.x/miniavs/png?seed=Pixel&backgroundColor=c0f0d4",
  "https://api.dicebear.com/8.x/personas/png?seed=Alex&backgroundColor=f5f5f5",
  "https://firebasestorage.googleapis.com/v0/b/apprec8-ca229.firebasestorage.app/o/avatars%2Fant1.png?alt=media&token=926544d2-0732-40e0-a9a1-9d222db17c4c",
  "https://firebasestorage.googleapis.com/v0/b/apprec8-ca229.firebasestorage.app/o/avatars%2Fbear1.webp?alt=media&token=b7778a72-b108-4f0b-b336-597f72e229a2",
  "https://firebasestorage.googleapis.com/v0/b/apprec8-ca229.firebasestorage.app/o/avatars%2Fbee1.webp?alt=media&token=554b346b-e061-4e56-aa29-e12350095bc4",
  "https://firebasestorage.googleapis.com/v0/b/apprec8-ca229.firebasestorage.app/o/avatars%2Fboy1.webp?alt=media&token=f87e20c1-3e6c-4caf-a495-ea38d72e3d11",
  "https://firebasestorage.googleapis.com/v0/b/apprec8-ca229.firebasestorage.app/o/avatars%2Fboy2.webp?alt=media&token=1e0a994d-894c-46f1-a6dc-77e504aac996",
  "https://firebasestorage.googleapis.com/v0/b/apprec8-ca229.firebasestorage.app/o/avatars%2Fant5.png?alt=media&token=950e3899-c798-487e-9301-c060f4405d9c",
];

const DEFAULT_AVATAR = PREDEFINED_AVATARS[0];
const AVATARS_PER_COLUMN = 3;
const TEN_MIN_IN_MS = 10 * 60 * 1000;

// Define dimensions outside useMemo if they don't depend on theme, or inside if they do.
// For clarity, defining them here as they are structural.
const AVATAR_IMAGE_SIZE = 70; // Both width and height
const AVATAR_ITEM_MARGIN_BOTTOM = 10; // Space between avatars in a column
const AVATAR_COLUMN_PADDING_VERTICAL = 5; // Padding top/bottom of each column
const AVATAR_ITEM_TOUCHABLE_PADDING = 3; // Padding for the touchable area for border visibility

// Calculate height for one column
const singleItemTotalHeight =
  AVATAR_IMAGE_SIZE + AVATAR_ITEM_TOUCHABLE_PADDING * 2; // Image + its own padding
const singleColumnContentHeight =
  singleItemTotalHeight * AVATARS_PER_COLUMN +
  AVATAR_ITEM_MARGIN_BOTTOM * (AVATARS_PER_COLUMN - 1);
const totalColumnHeightForContainer =
  singleColumnContentHeight + AVATAR_COLUMN_PADDING_VERTICAL * 2;

const EditProfileScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const {
    currentFirstName = "",
    currentLastName = "",
    currentPhotoURL = "",
    currentLastUpdatedAt = null,
  } = route.params || {};

  const [firstName, setFirstName] = useState(currentFirstName);
  const [lastName, setLastName] = useState(currentLastName);
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState(
    currentPhotoURL || DEFAULT_AVATAR
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [canUpdateProfile, setCanUpdateProfile] = useState(true);
  const [updateCooldownMessage, setUpdateCooldownMessage] = useState("");

  const currentAuthUser = authInstance.currentUser;
  const userId = currentAuthUser?.uid;

  const groupedAvatarData = useMemo(() => {
    const groups = [];
    for (let i = 0; i < PREDEFINED_AVATARS.length; i += AVATARS_PER_COLUMN) {
      groups.push(PREDEFINED_AVATARS.slice(i, i + AVATARS_PER_COLUMN));
    }
    return groups;
  }, []);

  useEffect(() => {
    let lastUpdateDate = null;

    if (currentLastUpdatedAt) {
      if (typeof currentLastUpdatedAt.toDate === "function") {
        // It's already a Firestore Timestamp object
        lastUpdateDate = currentLastUpdatedAt.toDate();
      } else if (
        typeof currentLastUpdatedAt.seconds === "number" &&
        typeof currentLastUpdatedAt.nanoseconds === "number"
      ) {
        // It's a plain object, convert it to a Firestore Timestamp, then to a JS Date
        // This requires the 'Timestamp' class from the Firestore SDK
        try {
          const firestoreTimestamp = new firestore.Timestamp(
            currentLastUpdatedAt.seconds,
            currentLastUpdatedAt.nanoseconds
          );
          lastUpdateDate = firestoreTimestamp.toDate();
          console.log("Converted plain object to JS Date:", lastUpdateDate);
        } catch (e) {
          console.error(
            "Error converting plain object to Firestore Timestamp:",
            e
          );
        }
      } else {
        console.warn(
          "currentLastUpdatedAt is in an unrecognized format:",
          currentLastUpdatedAt
        );
      }
    }

    if (lastUpdateDate) {
      const now = new Date();
      const timeSinceLastUpdate = now.getTime() - lastUpdateDate.getTime();
      console.log(
        "Time since last update (ms):",
        timeSinceLastUpdate,
        "Required (ms):",
        TEN_MIN_IN_MS
      );

      if (timeSinceLastUpdate < TEN_MIN_IN_MS) {
        setCanUpdateProfile(false);
        const timeLeftMs = TEN_MIN_IN_MS - timeSinceLastUpdate;
        const minutesLeft = Math.ceil(timeLeftMs / (60 * 1000));
        setUpdateCooldownMessage(
          `You can update your profile again in about ${minutesLeft} minute(s).`
        );
        console.log(`Cooldown active. Minutes left: ${minutesLeft}`);
      } else {
        setCanUpdateProfile(true);
        setUpdateCooldownMessage("");
        console.log("Cooldown ended or not applicable.");
      }
    } else {
      // If no valid previous update timestamp
      setCanUpdateProfile(true);
      setUpdateCooldownMessage("");
      console.log("No valid last update timestamp, update allowed.");
    }
  }, [currentLastUpdatedAt]);

  const handleSaveProfile = useCallback(async () => {
    if (!canUpdateProfile) {
      setError(
        updateCooldownMessage || "You cannot update your profile so soon."
      );
      return;
    }
    if (!userId) {
      setError("User not authenticated.");
      return;
    }
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    if (!trimmedFirstName) {
      setError("First Name cannot be empty.");
      return;
    }
    if (!selectedAvatarUrl) {
      setError("Please select an avatar.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    const userDataToUpdate = {
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
      photoURL: selectedAvatarUrl,
      lastUpdatedAt: firestore.FieldValue.serverTimestamp(),
    };
    try {
      await firestoreService
        .collection("users")
        .doc(userId)
        .update(userDataToUpdate);
      setSuccessMessage("Profile updated! You can update again in 10 minutes.");
      setLoading(false);
      setCanUpdateProfile(false);
      setUpdateCooldownMessage(`You can update again in about 10 minute(s).`);
      setTimeout(() => navigation.goBack(), 2500);
    } catch (err) {
      console.error("Error updating profile:", err);
      const message =
        err.code === "permission-denied" || err.code === "PERMISSION_DENIED"
          ? updateCooldownMessage && !canUpdateProfile
            ? updateCooldownMessage
            : "Permission Denied or too soon."
          : err.message || "Failed to update profile.";
      setError(message);
      setLoading(false);
    }
  }, [
    userId,
    firstName,
    lastName,
    selectedAvatarUrl,
    navigation,
    canUpdateProfile,
    updateCooldownMessage,
  ]);

  const componentStyles = useMemo(
    () =>
      StyleSheet.create({
        gradientContainer: { flex: 1 },
        scrollViewContent: {
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: Platform.OS === "android" ? 20 : 30,
          paddingBottom: 50,
        },
        sectionContainer: { alignItems: "center", marginBottom: 25 },
        avatarSectionTitle: {
          fontSize: 18,
          fontWeight: "bold",
          color: theme.textPrimaryOnGradient || theme.textPrimary,
          marginBottom: 15,
          textAlign: "center",
        },
        currentAvatar: {
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: theme.placeholder || "#e0e0e0",
          borderWidth: 3,
          borderColor: theme.primary || theme.accent,
          marginBottom: 10,
        },
        avatarSelectorContainer: {
          marginBottom: 25,
          height: totalColumnHeightForContainer + 5, // Use calculated height + small buffer
        },
        avatarColumn: {
          flexDirection: "column",
          marginRight: 10,
          paddingVertical: AVATAR_COLUMN_PADDING_VERTICAL,
        },
        avatarListItem: {
          padding: AVATAR_ITEM_TOUCHABLE_PADDING,
          borderRadius: AVATAR_IMAGE_SIZE / 2 + AVATAR_ITEM_TOUCHABLE_PADDING, // make it circular around the image
          marginBottom: AVATAR_ITEM_MARGIN_BOTTOM,
        },
        avatarListItemLast: {
          // Style to remove margin for the last item in a column
          marginBottom: 0,
        },
        avatarListItemSelected: {
          borderColor: theme.accent || theme.primary,
          borderWidth: 3,
        },
        avatarImage: {
          width: AVATAR_IMAGE_SIZE,
          height: AVATAR_IMAGE_SIZE,
          borderRadius: AVATAR_IMAGE_SIZE / 2,
          backgroundColor: theme.placeholder || "#e0e0e0",
        },
        input: {
          marginBottom: 18,
          backgroundColor: theme.inputBackground || "transparent",
          width: "100%",
        },
        button: { marginTop: 20, paddingVertical: 5, width: "100%" },
        errorText: {
          color: theme.warning || "red",
          textAlign: "center",
          marginBottom: 15,
          fontSize: 14,
        },
        successText: {
          color: theme.success || "green",
          textAlign: "center",
          marginBottom: 15,
          fontSize: 14,
          fontWeight: "bold",
        },
        cooldownText: {
          color: theme.textSecondaryOnGradient || theme.textSecondary,
          textAlign: "center",
          marginBottom: 15,
          fontSize: 14,
        },
      }),
    [theme]
  );

  const handleImageError = (error, uri) => {
    console.error(`Failed to load image: ${uri}`, error.nativeEvent.error);
    if (
      uri === currentPhotoURL &&
      uri !== DEFAULT_AVATAR &&
      selectedAvatarUrl === uri
    ) {
      setSelectedAvatarUrl(DEFAULT_AVATAR);
    }
  };

  const renderAvatarColumn = ({ item: columnAvatars }) => (
    <View style={componentStyles.avatarColumn}>
      {columnAvatars.map((avatarUrl, avatarIndex) => (
        <TouchableOpacity
          key={avatarUrl}
          style={[
            componentStyles.avatarListItem,
            // Apply specific style to remove marginBottom for the last item in the column
            avatarIndex === columnAvatars.length - 1 &&
              componentStyles.avatarListItemLast,
            selectedAvatarUrl === avatarUrl &&
              componentStyles.avatarListItemSelected,
          ]}
          onPress={() => setSelectedAvatarUrl(avatarUrl)}
        >
          <Image
            source={{ uri: avatarUrl }}
            style={componentStyles.avatarImage}
            onError={(e) => handleImageError(e, avatarUrl)}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <LinearGradient
      colors={[
        theme.gradientStart || "#8B0000",
        theme.gradientEnd || "#D3D3D3",
      ]}
      style={componentStyles.gradientContainer}
    >
      <ScrollView
        contentContainerStyle={componentStyles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={componentStyles.sectionContainer}>
          <Image
            source={{ uri: selectedAvatarUrl }}
            style={componentStyles.currentAvatar}
            onError={(e) => handleImageError(e, selectedAvatarUrl)}
          />
        </View>

        <Text style={componentStyles.avatarSectionTitle}>
          Choose a New Avatar
        </Text>
        <View style={componentStyles.avatarSelectorContainer}>
          <FlatList
            horizontal
            data={groupedAvatarData}
            renderItem={renderAvatarColumn}
            keyExtractor={(_item, index) => `avatar-column-${index}`}
            showsHorizontalScrollIndicator={false}
            // Optional: for snapping behavior
            // snapToInterval={AVATAR_IMAGE_SIZE + 10} // Approximate width of a column + marginRight
            // decelerationRate="fast"
          />
        </View>

        {!canUpdateProfile && updateCooldownMessage && (
          <Text style={componentStyles.cooldownText}>
            {updateCooldownMessage}
          </Text>
        )}
        {error && <Text style={componentStyles.errorText}>{error}</Text>}
        {successMessage && (
          <Text style={componentStyles.successText}>{successMessage}</Text>
        )}

        <View style={componentStyles.sectionContainer}>
          <TextInput
            label="First Name"
            value={firstName}
            onChangeText={setFirstName}
            style={componentStyles.input}
            mode="outlined"
            textColor={theme.textPrimaryOnGradient || theme.textPrimary}
            theme={{
              colors: {
                primary: theme.accent || theme.primary,
                text: theme.textPrimaryOnGradient || theme.textPrimary,
                placeholder:
                  theme.textSecondaryOnGradient || theme.textSecondary,
                background: "transparent",
                onSurfaceVariant:
                  theme.textSecondaryOnGradient || theme.textSecondary,
              },
            }}
          />
          <TextInput
            label="Last Name"
            value={lastName}
            onChangeText={setLastName}
            style={componentStyles.input}
            mode="outlined"
            textColor={theme.textPrimaryOnGradient || theme.textPrimary}
            theme={{
              colors: {
                primary: theme.accent || theme.primary,
                text: theme.textPrimaryOnGradient || theme.textPrimary,
                placeholder:
                  theme.textSecondaryOnGradient || theme.textSecondary,
                background: "transparent",
                onSurfaceVariant:
                  theme.textSecondaryOnGradient || theme.textSecondary,
              },
            }}
          />
          {canUpdateProfile ? ( // Only show the button if the user CAN update
            <PaperButton
              mode="contained"
              onPress={handleSaveProfile}
              disabled={loading} // Button is only disabled by loading state now
              loading={loading}
              style={componentStyles.button}
              labelStyle={{ fontSize: 18, fontWeight: "bold" }}
              buttonColor={theme.primary || theme.accent} // Active button color
              textColor={theme.buttonText || "#FFFFFF"} // Active text color
            >
              {loading ? "Saving..." : "Save Profile"}
            </PaperButton>
          ) : // Optional: You can render null or an empty View if you want nothing else,
          // or keep the cooldown message prominent here if it's not already shown above.
          // The cooldown message is already being displayed above the input section
          // based on `!canUpdateProfile && updateCooldownMessage`.
          // So, rendering null here for the button spot is fine.
          null}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default EditProfileScreen;
