import React from "react";
import { Image, View, Text, StyleSheet } from "react-native";
import { AuthContext } from "../providers/AuthContextProvider";
import AppButton from "../components/AppButton";
import AppTextInput from "../components/AppTextInput";
import AppText from "../components/AppText";

export default function SignInScreen({ navigation }) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const { signIn } = React.useContext(AuthContext);
  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <AppText style={styles.title}>Fridgloo</AppText>
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
        />
      </View>
      <Text style={styles.loginIndicator}>Login</Text>

      <AppTextInput
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <AppTextInput
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />

      <AppButton title="Login" onPress={() => signIn({ username, password })} />
      <AppButton
        title="Register"
        onPress={() => navigation.navigate("Registration")}
      />
      <Text
        onPress={() => navigation.navigate("Registration")}
        style={{ textAlign: "center" }}
      >
        Forgot Password?
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 55,
    lineHeight: 68,
    textAlign: "center",
    padding: "10%",
    marginTop: "10%",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: "10%",
  },
  logo: {
    width: 50,
    height: 50,
  },
  loginIndicator: {
    fontFamily: "Roboto",
    fontSize: 15,
    marginLeft: "10%",
    marginTop: "30%",
    marginBottom: 5,
  },
});
