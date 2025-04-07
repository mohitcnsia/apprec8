import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";
import { useFonts } from "expo-font";
import { Colors } from "./config/colors";
import BottomTabNavigator from "./navigation/BottomTabNavigator";
import AuthScreen from "./screens/auth/AuthScreen";
import useFirebaseAuth from "./hooks/useFirebaseAuth"; // ✅ New hook
import CalmLoader from "./components/common/CalmLoader";

export default function App() {
  const [fontsLoaded] = useFonts({
    rouge: require("./assets/fonts/RougeScript-Regular.ttf"),
    delius: require("./assets/fonts/Delius-Regular.ttf"),
    deliusBold: require("./assets/fonts/DeliusUnicase-Bold.ttf"),
    pacifico: require("./assets/fonts/Pacifico-Regular.ttf"),
  });

  const { user, isGuest, error, loading, onGuestLogin, signoutHandler } =
    useFirebaseAuth();

  if (!fontsLoaded || loading) {
    return <CalmLoader />;
  }

  return (
    <>
      <StatusBar
        style="inverted"
        translucent={false}
        backgroundColor={Colors.primaryDarkMaroon}
      />
      <View style={styles.container}>
        {user || isGuest ? (
          <BottomTabNavigator
            isGuest={isGuest}
            signoutHandler={signoutHandler}
            user={user}
          />
        ) : (
          <AuthScreen externalError={error} onGuestLogin={onGuestLogin} />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryDarkMaroon,
  },
});
