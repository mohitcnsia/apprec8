// screens/auth/AuthScreen.js

import React, { useState, useEffect, useMemo } from "react"; // Import useMemo
import { View, StyleSheet } from "react-native";
import { Button, TextInput, Card, Text } from "react-native-paper";
// import { Colors } from "../../config/colors"; // <-- Remove this direct import
import { useTheme } from "../../context/ThemeContext"; // <-- Import useTheme

export default function AuthScreen({
  externalError,
  isAuthLoading,
  onGuestLogin,
  onGoogleLogin,
  onEmailSignIn,
  onEmailSignUp,
  onPasswordReset,
}) {
  const { theme } = useTheme(); // <-- Use the theme hook

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [secureText, setSecureText] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const shouldShowEye = isFocused || password.length === 0;
  const isValid = email.includes("@") && password.length >= 6;

  useEffect(() => {
    if (externalError) setError(externalError);
  }, [externalError]);

  useEffect(() => {
    let timer;
    if (!secureText) {
      timer = setTimeout(() => setSecureText(true), 1200);
    }
    return () => clearTimeout(timer);
  }, [secureText]);

  const handleEmailPassword = () => {
    if (!isValid) return;
    setError("");
    if (isLogin) {
      onEmailSignIn(email, password);
    } else {
      onEmailSignUp(email, password);
    }
  };

  // --- Define Styles Inside Component with useMemo ---
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: "center",
          padding: 20,
          backgroundColor: theme.background, // Use theme background
        },
        card: {
          padding: 20,
          elevation: 4, // Keep elevation if desired
          backgroundColor: theme.cardBackground, // Use theme card background
        },
        title: {
          fontSize: 24,
          marginBottom: 20,
          textAlign: "center",
          fontFamily: "deliusBold", // Keep custom font
          color: theme.primary, // Use theme primary color (e.g., Maroon)
        },
        input: {
          marginBottom: 10,
          // Note: Fully theming Paper inputs (underline, label, etc.)
          // is best done via PaperProvider.theme.
          // Setting background explicitly might be needed if card bg differs.
          // backgroundColor: theme.inputBackground || theme.cardBackground,
        },
        button: {
          // Common button margin
          marginTop: 10,
        },
        error: {
          color: theme.warning, // Use theme warning color
          marginBottom: 10,
          textAlign: "center",
        },
        bottomView: {
          flexDirection: "row",
          justifyContent: "space-evenly", // Better spacing for two buttons
          marginTop: 15,
        },
      }),
    [theme]
  ); // Depend on theme

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>{isLogin ? "Login" : "Register"}</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TextInput
          label="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setError("");
          }}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
          disabled={isAuthLoading}
          // Paper Theming Notes: Apply theme colors if needed, but PaperProvider is better.
          // Example minimal overrides:
          activeOutlineColor={theme.primary} // Or theme.accent
          activeUnderlineColor={theme.primary} // Or theme.accent
          textColor={theme.textPrimary}
          // theme={{ colors: { primary: theme.accent, background: theme.cardBackground } }} // More complex override
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError("");
          }}
          secureTextEntry={secureText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={isAuthLoading}
          style={styles.input}
          // Paper Theming Notes: (Similar to above)
          activeOutlineColor={theme.primary} // Or theme.accent
          activeUnderlineColor={theme.primary} // Or theme.accent
          textColor={theme.textPrimary}
          right={
            shouldShowEye ? (
              <TextInput.Icon
                icon={secureText ? "eye-off" : "eye"}
                onPress={() => setSecureText((prev) => !prev)}
                forceTextInputFocus={false}
                disabled={isAuthLoading}
                iconColor={theme.textSecondary} // Use theme color for icon
              />
            ) : null
          }
        />

        {/* Login / Register Button */}
        <Button
          mode="contained"
          onPress={handleEmailPassword}
          style={styles.button}
          disabled={!isValid || isAuthLoading}
          loading={isAuthLoading}
          // Paper Theming: Use specific props
          buttonColor={theme.primary} // Use theme accent for background
          textColor={theme.buttonText} // Use theme color for text
        >
          {isLogin ? "Login" : "Register"}
        </Button>

        {/* Switch Button */}
        <Button
          mode="outlined"
          onPress={() => {
            setIsLogin(!isLogin);
            setError("");
          }}
          style={[styles.button, { borderColor: theme.primary }]} // Apply border color via style
          disabled={isAuthLoading}
          // Paper Theming: Use specific props
          textColor={theme.primary} // Use theme accent for text/border
        >
          Switch to {isLogin ? "Register" : "Login"}
        </Button>

        {/* Google Login Button */}
        <Button
          mode="contained"
          icon="google"
          disabled={isAuthLoading}
          onPress={onGoogleLogin}
          style={styles.button}
          loading={isAuthLoading} // Show loading indicator if auth is generally busy
          // Paper Theming: Style Google button distinctively if desired
          buttonColor={theme.cardBackground} // e.g., Use card background
          textColor={theme.textPrimary} // e.g., Use primary text color
          // Alternatively, keep it consistent with primary action:
          // buttonColor={theme.accent}
          // textColor={theme.buttonText}
        >
          Continue with Google
        </Button>

        {/* Bottom buttons */}
        <View style={styles.bottomView}>
          <Button
            mode="text"
            onPress={() => {
              if (email && email.includes("@")) {
                onPasswordReset(email); // Call the handler passed via props
              } else {
                // Prompt user to enter email first if the field is empty/invalid
                setError(
                  "Please enter your email address in the field above first."
                );
              }
            }}
            disabled={isAuthLoading}
            // Paper Theming: Use specific props
            textColor={theme.textSecondary} // Use secondary text color
          >
            Forgot Password?
          </Button>
          <Button
            mode="text"
            onPress={() => {
              onGuestLogin();
              setError("");
            }}
            disabled={isAuthLoading}
            // Paper Theming: Use specific props
            textColor={theme.textSecondary} // Use secondary text color
          >
            Continue as Guest
          </Button>
        </View>
      </Card>
    </View>
  );
}
