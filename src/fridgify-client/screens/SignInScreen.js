import React, { useState } from "react";
import { View, SafeAreaView, Image, Text, StyleSheet } from "react-native";
import AuthButton from "../components/AuthButton";
import LogoText from "../components/LogoText";
import styles from "../constants/AuthStyles";

import * as Yup from "yup";
import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from "../components/form";
import authApi from "../api/auth";
import useAuth from "../auth/useAuth";
import routes from "../navigation/routes";

const validationSchema = Yup.object().shape({
  username: Yup.string().required().max(255).label("Username"),
  password: Yup.string().required().max(255).label("Password"),
});

export default function SignInScreen({ navigation }) {
  const auth = useAuth();
  const [signInFailed, setSignInFailed] = useState(false);

  const handleSubmit = async ({ username, password }) => {
    const result = await authApi.signIn(username, password);
    if (!result.ok) return setSignInFailed(true);
    setSignInFailed(false);
    auth.signIn(result.data.token);
  };

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

      <Form
        initialValues={{ username: "", password: "" }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <ErrorMessage
          error="Invalid Username/Password."
          visible={signInFailed}
        />
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          name="username"
          placeholder="Username"
        />
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          name="password"
          placeholder="Password"
          secureTextEntry
          textContentType="password"
        />
        <SubmitButton title="Login" />
      </Form>
      <AuthButton
        title="Register"
        onPress={() => navigation.navigate(routes.REGISTER)}
      />
      <Text
        onPress={() => navigation.navigate(routes.REGISTER)}
        style={{ textAlign: "center" }}
      >
        Forgot Password?
      </Text>
    </SafeAreaView>
  );
}

// const styles = StyleSheet.create({
//   title: {
//     fontSize: 55,
//     lineHeight: 68,
//     textAlign: "center",
//     padding: "10%",
//     marginTop: "10%",
//   },
//   logoContainer: {
//     justifyContent: "center",
//     alignItems: "center",
//     margin: "10%",
//     marginBottom: "5%",
//   },
//   logo: {
//     width: 50,
//     height: 50,
//   },
//   loginIndicator: {
//     fontFamily: "System",
//     fontSize: 15,
//     marginLeft: "10%",
//     marginBottom: 5,
//   },
// });
