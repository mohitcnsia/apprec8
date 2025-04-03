import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Alert, Pressable } from "react-native";
import { ANDROID_CLIENT_ID, IOS_CLIENT_ID } from "@env";
import { Button, TextInput, Card, Text } from "react-native-paper";
import * as Google from "expo-auth-session/providers/google";
import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { auth } from "../../config/firebaseConfig";
import { mapAuthError } from "../auth/authService"; // NEW: Extract auth logic
import { CommonActions } from "@react-navigation/native";

export default function AuthScreen({
  externalError,
  navigation,
  onGuestLogin,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true); // NEW: Toggle between login/register

  // NEW: Input validation
  const isValid = email.includes("@") && password.length >= 6;

  // Google Auth Setup
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID, // NEW: Use env var
    redirectUri: "apprec8://",
  });

  useEffect(() => {
    if (externalError) {
      setError(externalError); // Sync external error with internal error state
    }
  }, [externalError]);

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      handleAuthAction(() => signInWithCredential(auth, credential)); // NEW: Unified handler
    } else if (response?.type === "error") {
      setError(mapAuthError(response.error));
    }
  }, [response]);

  // NEW: Unified auth handler
  const handleAuthAction = useCallback(async (authFunction) => {
    setIsLoading(true);
    setError("");

    try {
      const userCredential = await authFunction();
    } catch (err) {
      setError(mapAuthError(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // NEW: Combined email/password handler
  const handleEmailPassword = () => {
    if (!isValid) return;

    const action = isLogin
      ? () => signInWithEmailAndPassword(auth, email, password) // ✅ LOGIN
      : async () => {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          ); // ✅ SIGNUP
          await sendEmailVerification(userCredential.user); // ✅ Send verification email
          setError(
            "A verification email has been sent. Please verify before logging in"
          );
          await signOut(auth); // ✅ Logout until verified
        };

    handleAuthAction(action);
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>{isLogin ? "Login" : "Register"}</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
          accessibilityLabel="Email input"
          accessibilityHint="Enter your email address"
        />

        <TextInput
          label="Password"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
          style={styles.input}
          accessibilityLabel="Password input"
          accessibilityHint="Enter your password"
        />

        <Button
          mode="contained"
          onPress={handleEmailPassword}
          style={styles.button}
          disabled={!isValid || isLoading}
          loading={isLoading}
        >
          {isLogin ? "Login" : "Register"}
        </Button>

        <Button
          mode="outlined"
          onPress={() => setIsLogin(!isLogin)}
          style={styles.button}
          disabled={isLoading}
        >
          Switch to {isLogin ? "Register" : "Login"}
        </Button>

        <Button
          mode="contained"
          icon="google"
          disabled={!request || isLoading}
          onPress={() => promptAsync()}
          style={styles.button}
          loading={isLoading}
        >
          Continue with Google
        </Button>
        <View style={styles.bottomView}>
          <Button
            mode="text"
            onPress={() => setError("TODO: Implement password reset")}
            style={styles.button}
          >
            Forgot Password?
          </Button>
          <Button mode="text" onPress={onGuestLogin} style={styles.button}>
            Continue as Guest
          </Button>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  card: { padding: 20, elevation: 4 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
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
