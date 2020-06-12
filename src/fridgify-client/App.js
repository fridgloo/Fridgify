import * as React from "react";
import {
  ActivityIndicator,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";

import AuthContextProvider from "./providers/AuthContextProvider";

export default function App() {
  return (
    <View style={styles.container}>
      {Platform.OS === "ios" && <StatusBar barStyle="dark-content" />}
      <AuthContextProvider />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  }
});
