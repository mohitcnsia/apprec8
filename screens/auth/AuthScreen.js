// screens/auth/AuthScreen.js (Refactored for @react-native-firebase hook)

import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Button, TextInput, Card, Text } from "react-native-paper";
import { Colors } from "../../config/colors"; // Adjust path if needed

export default function AuthScreen({
  externalError, // Error state passed from useFirebaseAuth hook
  isAuthLoading, // Loading state passed from useFirebaseAuth hook
  onGuestLogin,
  onGoogleLogin,
  onEmailSignIn, // <-- Prop for sign-in handler from hook
  onEmailSignUp, // <-- Prop for sign-up handler from hook
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [isLoading, setIsLoading] = useState(false); // Loading is now controlled by the hook via isAuthLoading prop
  const [error, setError] = useState(""); // Local error state, updated by externalError prop
  const [isLogin, setIsLogin] = useState(true);
  const [secureText, setSecureText] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const shouldShowEye = isFocused || password.length === 0;
  const isValid = email.includes("@") && password.length >= 6;

  // Update local error state when the error prop from the hook changes
  useEffect(() => {
    if (externalError) setError(externalError);
  }, [externalError]);

  // Keep the secure text toggle logic
  useEffect(() => {
    let timer;
    if (!secureText) {
      timer = setTimeout(() => setSecureText(true), 1200);
    }
    return () => clearTimeout(timer);
  }, [secureText]);

  // --- REMOVED handleAuthAction function ---

  // --- REVISED handleEmailPassword function ---
  const handleEmailPassword = () => {
    // Basic client-side validation first
    if (!isValid) return;
    setError(""); // Clear local error before trying

    // Call the appropriate handler passed via props from the hook
    if (isLogin) {
      console.log("AuthScreen: Calling onEmailSignIn...");
      onEmailSignIn(email, password); // This now calls the hook's logic
    } else {
      console.log("AuthScreen: Calling onEmailSignUp...");
      onEmailSignUp(email, password); // This now calls the hook's logic
      // Note: Verification email logic is now inside the hook's emailSignUpHandler
      // You might want the hook to return a status or update the error prop
      // if you want to show the "Verification email sent" message here specifically.
      // For now, rely on the hook's error state passed via externalError.
    }
  };
  // --- END REVISED handleEmailPassword ---

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>{isLogin ? "Login" : "Register"}</Text>

        {/* Display error from local state (updated by externalError prop) */}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TextInput
          label="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setError("");
          }} // Clear error on input change
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
          disabled={isAuthLoading} // Disable input while loading
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError("");
          }} // Clear error on input change
          secureTextEntry={secureText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={isAuthLoading} // Disable input while loading
          right={
            shouldShowEye ? (
              <TextInput.Icon
                icon={secureText ? "eye-off" : "eye"}
                onPress={() => setSecureText((prev) => !prev)}
                forceTextInputFocus={false}
                disabled={isAuthLoading} // Disable icon too
              />
            ) : null
          }
        />

        <Button
          mode="contained"
          onPress={handleEmailPassword} // Call the revised handler
          style={styles.button}
          disabled={!isValid || isAuthLoading} // Use isAuthLoading from props
          loading={isAuthLoading} // Use isAuthLoading from props
        >
          {isLogin ? "Login" : "Register"}
        </Button>

        <Button
          mode="outlined"
          onPress={() => {
            setIsLogin(!isLogin);
            setError("");
          }} // Clear error on switch
          style={styles.button}
          disabled={isAuthLoading} // Use isAuthLoading from props
        >
          Switch to {isLogin ? "Register" : "Login"}
        </Button>

        {/* Google Login Button - uses onGoogleLogin prop */}
        <Button
          mode="contained"
          icon="google"
          disabled={isAuthLoading} // Use isAuthLoading from props
          onPress={onGoogleLogin}
          style={styles.button}
          // You might want to use isAuthLoading here too if Google login sets the hook's loading state
          loading={isAuthLoading && !isLogin} // Example: show loading only if relevant action active? Or just use isAuthLoading
        >
          Continue with Google
        </Button>

        {/* Bottom buttons - use onGuestLogin prop */}
        <View style={styles.bottomView}>
          <Button
            mode="text"
            onPress={() => setError("TODO: Implement password reset")}
            disabled={isAuthLoading}
          >
            Forgot Password?
          </Button>
          <Button
            mode="text"
            onPress={() => {
              onGuestLogin();
              setError("");
            }} // Clear error on guest login
            disabled={isAuthLoading}
          >
            Continue as Guest
          </Button>
        </View>
      </Card>
    </View>
  );
}

// --- Styles (Keep your existing styles) ---
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  card: { padding: 20, elevation: 4 },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "deliusBold",
    color: Colors.primaryDarkMaroon,
  },
  input: { marginBottom: 10 },
  button: { marginTop: 10 },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  bottomView: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
