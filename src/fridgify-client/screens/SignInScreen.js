import React from "react";
import { View, SafeAreaView, Image, Text, StyleSheet} from "react-native"; 
import { AuthContext } from "../providers/AuthContextProvider";
import AuthButton from "../components/AuthButton";
import AppTextInput from "../components/AppTextInput";
import LogoText from "../components/LogoText";

export default function SignInScreen({ navigation }) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const { signIn } = React.useContext(AuthContext);
  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <LogoText style={styles.title}>Fridgloo </LogoText>
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
      <View>
        <AuthButton title="Login" onPress={() => signIn({ username, password })} />
      </View>
      <View>
        <AuthButton
        title="Register"
        onPress={() => navigation.navigate("Registration")}
      />
      </View>
      <Text
        onPress={() => navigation.navigate("Registration")}
        style={{ textAlign: "center" }}
      >
        Forgot Password?
      </Text>
    </SafeAreaView>
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
    marginBottom: "5%",
  },
  logo: {
    width: 50,
    height: 50,
  },
  loginIndicator: {
    fontFamily: "Avenir",
    fontSize: 15,
    marginLeft: "10%",
    marginBottom: 5,
  },
});
