import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Button, TextInput, Card, Text } from "react-native-paper";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { auth } from "../../config/firebaseConfig";
import { mapAuthError } from "../auth/authService";
import { Colors } from "../../config/colors";

export default function AuthScreen({
  externalError,
  onGuestLogin,
  onGoogleLogin,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

  const handleAuthAction = async (authFunction) => {
    setIsLoading(true);
    setError("");
    try {
      const userCredential = await authFunction();
    } catch (err) {
      setError(mapAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailPassword = () => {
    if (!isValid) return;

    const action = isLogin
      ? () => signInWithEmailAndPassword(auth, email, password)
      : async () => {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          await sendEmailVerification(userCredential.user);
          setError("Verification email sent. Please verify before logging in.");
          await signOut(auth);
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
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secureText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          right={
            shouldShowEye ? (
              <TextInput.Icon
                icon={secureText ? "eye-off" : "eye"}
                onPress={() => setSecureText((prev) => !prev)}
                forceTextInputFocus={false}
              />
            ) : null
          }
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
          disabled={isLoading}
          onPress={onGoogleLogin}
          style={styles.button}
          loading={isLoading}
        >
          Continue with Google
        </Button>

        <View style={styles.bottomView}>
          <Button
            mode="text"
            onPress={() => setError("TODO: Implement password reset")}
          >
            Forgot Password?
          </Button>
          <Button mode="text" onPress={onGuestLogin}>
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
