// screens/profile/EditProfileScreen.js
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image, // Re-added Image for displaying avatars
  ActivityIndicator,
  TouchableOpacity, // For avatar selection
  Platform,
  FlatList, // For displaying avatar choices
} from "react-native";
import {
  TextInput,
  Button as PaperButton,
  HelperText,
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
// import Avatar from 'react-avatar'; // Removed react-avatar
import { useTheme } from "../../context/ThemeContext";
import {
  authInstance,
  firestoreInstance as firestore,
} from "../../config/firebaseConfig";

// Using DiceBear for predefined cartoonish avatars.
// You can choose different styles and seeds.
// Styles: https://www.dicebear.com/styles/
const PREDEFINED_AVATARS = [
  "https://api.dicebear.com/8.x/adventurer/png?seed=Leo&backgroundColor=b6e3f4",
  "https://api.dicebear.com/8.x/adventurer-neutral/png?seed=Mia&backgroundColor=ffdfbf",
  "https://api.dicebear.com/8.x/big-ears/png?seed=Coco&backgroundColor=d1d4f9",
  "https://api.dicebear.com/8.x/big-smile/png?seed=Buddy&backgroundColor=ffd5dc",
  "https://api.dicebear.com/8.x/miniavs/png?seed=Pixel&backgroundColor=c0f0d4",
  "https://api.dicebear.com/8.x/personas/png?seed=Alex&backgroundColor=f5f5f5",
  "https://api.dicebear.com/8.x/rings/png?seed=Sparkle&backgroundColor=transparent", // More abstract
  // Add more or change styles/seeds as desired
];

// Fallback if no avatar is selected or current photoURL is invalid
const DEFAULT_AVATAR = PREDEFINED_AVATARS[0];

const EditProfileScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const {
    currentUsername = "",
    currentFirstName = "",
    currentPhotoURL = "", // This will be the URL of the previously selected avatar
  } = route.params || {};

  const [firstName, setFirstName] = useState(currentFirstName);
  const [username, setUsername] = useState(currentUsername);
  // selectedAvatarUrl will hold the URL of the chosen predefined avatar
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState(
    currentPhotoURL && PREDEFINED_AVATARS.includes(currentPhotoURL)
      ? currentPhotoURL
      : DEFAULT_AVATAR
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const currentAuthUser = authInstance.currentUser;
  const userId = currentAuthUser?.uid;

  // Effect to set initial avatar if currentPhotoURL is one of the predefined ones
  useEffect(() => {
    if (currentPhotoURL && PREDEFINED_AVATARS.includes(currentPhotoURL)) {
      setSelectedAvatarUrl(currentPhotoURL);
    } else {
      setSelectedAvatarUrl(DEFAULT_AVATAR); // Default if not in predefined or no currentPhotoURL
    }
  }, [currentPhotoURL]);

  const handleSaveProfile = useCallback(async () => {
    if (!userId) {
      setError("User not authenticated. Cannot save profile.");
      return;
    }
    const trimmedFirstName = firstName.trim();
    const trimmedUsername = username.trim();

    if (!trimmedFirstName) {
      setError("First Name cannot be empty.");
      return;
    }
    if (!trimmedUsername) {
      setError("Unique Username cannot be empty.");
      return;
    }
    if (trimmedUsername.length < 3) {
      setError("Unique Username must be at least 3 characters long.");
      return;
    }
    if (!selectedAvatarUrl) {
      // Should always be set due to default
      setError("Please select an avatar.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const userDataToUpdate = {
      firstName: trimmedFirstName,
      username: trimmedUsername,
      photoURL: selectedAvatarUrl, // Save the URL of the selected predefined avatar
      lastUpdatedAt: firestore.FieldValue.serverTimestamp(),
    };

    try {
      await firestore()
        .collection("users")
        .doc(userId)
        .update(userDataToUpdate);
      setSuccessMessage("Profile updated successfully!");
      setLoading(false);
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (err) {
      console.error("Error updating profile:", err);
      if (err.code === "permission-denied") {
        setError("You do not have permission to perform this action.");
      } else {
        setError(err.message || "Failed to update profile. Please try again.");
      }
      setLoading(false);
    }
  }, [userId, firstName, username, selectedAvatarUrl, navigation]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        gradientContainer: { flex: 1 },
        scrollContainer: {
          flexGrow: 1,
          justifyContent: "flex-start",
          paddingBottom: 50,
        },
        container: {
          flex: 1,
          padding: 20,
          paddingTop: Platform.OS === "android" ? 30 : 20,
        },
        avatarSectionTitle: {
          fontSize: 16,
          fontFamily: "deliusBold",
          color: theme.textPrimaryOnGradient || theme.textPrimary,
          marginBottom: 10,
          textAlign: "center",
        },
        currentAvatarContainer: {
          // For displaying the currently selected avatar
          alignItems: "center",
          marginBottom: 15,
        },
        currentAvatar: {
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: theme.placeholder || "#e0e0e0",
          borderWidth: 3,
          borderColor: theme.primary || theme.accent,
        },
        avatarListContainer: {
          // For the FlatList of choices
          marginBottom: 25,
          maxHeight: 100, // Adjust based on avatar size and number of items visible
        },
        avatarListItem: {
          // For each item in the FlatList
          marginHorizontal: 8,
          padding: 3, // Padding for selection border visual cue
          borderRadius: 40, // Slightly larger than image for border effect
        },
        avatarListItemSelected: {
          // Style for the selected avatar in the list
          borderColor: theme.accent || theme.primary, // Highlight selected avatar
          borderWidth: 3,
        },
        avatarImage: {
          // Style for the Image component in the FlatList
          width: 70,
          height: 70,
          borderRadius: 35, // Make it circular
          backgroundColor: theme.placeholder || "#e0e0e0", // Placeholder while loading
        },
        input: {
          marginBottom: 18,
          backgroundColor: theme.inputBackground || "transparent",
        },
        button: { marginTop: 20, paddingVertical: 10 },
        errorText: {
          color: theme.warning || "red",
          textAlign: "center",
          marginBottom: 15,
          fontFamily: "delius",
          fontSize: 14,
        },
        successText: {
          color: theme.success || "green",
          textAlign: "center",
          marginBottom: 15,
          fontFamily: "deliusBold",
          fontSize: 14,
        },
      }),
    [theme]
  );

  const handleImageError = (error, uri) => {
    console.error(`Failed to load image: ${uri}`, error.nativeEvent.error);
    // Optionally, handle specific image load errors, e.g., set to a default if one fails
  };

  const renderAvatarChoice = ({ item: avatarUrl }) => (
    <TouchableOpacity
      style={[
        styles.avatarListItem,
        selectedAvatarUrl === avatarUrl && styles.avatarListItemSelected,
      ]}
      onPress={() => setSelectedAvatarUrl(avatarUrl)}
    >
      <Image
        source={{ uri: avatarUrl }}
        style={styles.avatarImage}
        onError={(error) => handleImageError(error, avatarUrl)}
      />
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={[
        theme.gradientStart || "#8B0000",
        theme.gradientEnd || "#D3D3D3",
      ]}
      style={styles.gradientContainer}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.avatarSectionTitle}>Choose Your Avatar</Text>
        {/* Display the currently selected avatar */}
        <View style={styles.currentAvatarContainer}>
          <Image
            source={{ uri: selectedAvatarUrl }}
            style={styles.currentAvatar}
            onError={(error) => handleImageError(error, selectedAvatarUrl)}
          />
        </View>

        {/* List of predefined avatars to choose from */}
        <FlatList
          horizontal
          data={PREDEFINED_AVATARS}
          renderItem={renderAvatarChoice}
          keyExtractor={(item) => item} // URLs are unique
          showsHorizontalScrollIndicator={false}
          style={styles.avatarListContainer}
          contentContainerStyle={{
            alignItems: "center",
            paddingHorizontal: 10,
          }}
        />

        {error && <Text style={styles.errorText}>{error}</Text>}
        {successMessage && (
          <Text style={styles.successText}>{successMessage}</Text>
        )}

        <TextInput
          label="First Name"
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
          mode="outlined"
          textColor={theme.textPrimaryOnGradient || theme.textPrimary}
          theme={{
            colors: {
              primary: theme.accent || theme.primary,
              text: theme.textPrimaryOnGradient || theme.textPrimary,
              placeholder: theme.textSecondaryOnGradient || theme.textSecondary,
              background: "transparent",
              onSurfaceVariant:
                theme.textSecondaryOnGradient || theme.textSecondary,
            },
          }}
        />

        <TextInput
          label="Unique Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          mode="outlined"
          autoCapitalize="none"
          textColor={theme.textPrimaryOnGradient || theme.textPrimary}
          theme={{
            colors: {
              primary: theme.accent || theme.primary,
              text: theme.textPrimaryOnGradient || theme.textPrimary,
              placeholder: theme.textSecondaryOnGradient || theme.textSecondary,
              background: "transparent",
              onSurfaceVariant:
                theme.textSecondaryOnGradient || theme.textSecondary,
            },
          }}
        />
        <HelperText
          type="info"
          visible={true}
          style={{
            color: theme.textSecondaryOnGradient || theme.textSecondary,
            marginBottom: 10,
          }}
        >
          Username must be unique and at least 3 characters.
        </HelperText>

        <PaperButton
          mode="contained"
          onPress={handleSaveProfile}
          disabled={loading}
          loading={loading}
          style={styles.button}
          labelStyle={{ fontFamily: "deliusBold", fontSize: 18 }}
          buttonColor={theme.primary || theme.accent}
          textColor={theme.buttonText || "#FFFFFF"}
        >
          {loading ? "Saving..." : "Save Profile"}
        </PaperButton>
      </ScrollView>
    </LinearGradient>
  );
};

export default EditProfileScreen;
