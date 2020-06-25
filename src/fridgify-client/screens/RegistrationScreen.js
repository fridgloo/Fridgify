import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";
import { AuthContext } from "../providers/AuthContextProvider";
import LogoText from "../components/LogoText";

import * as Yup from "yup";
import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from "../components/form";

const validationSchema = Yup.object().shape({
  username: Yup.string().required().min(2).max(16).label("Username"),
  password: Yup.string()
    .required()
    .min(8)
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]$/,
      "Must contain uppercase, lowercase, number and a special character"
    )
    .label("Password"),
  confirmPassword: Yup.string()
    .required()
    .label("Confirm Password")
    .test("passwords-match", "Passwords must match", function (value) {
      return this.parent.password === value;
    }),
  email: Yup.string().required().email().label("Email"),
});

export default function RegistrationScreen({ navigation }) {
  const { signUp } = React.useContext(AuthContext);
  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <LogoText style={styles.title}>Fridgloo </LogoText>
      <Text style={styles.loginIndicator}>Register</Text>
      <Form
        initialValues={{
          username: "",
          password: "",
          confirmPassword: "",
          email: "",
        }}
        onSubmit={({ username, password, email }) =>
          signUp({ username, password, email })
        }
        validationSchema={validationSchema}
      >
        {/* <ErrorMessage error={error} visible={error} /> */}
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
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          name="confirmPassword"
          placeholder="Confirm Password"
          secureTextEntry
          textContentType="password"
        />
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          name="email"
          placeholder="Email"
          textContentType="emailAddress"
        />
        <SubmitButton title="Register" />
      </Form>
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
    fontFamily: "System",
    fontSize: 15,
    marginLeft: "10%",
    marginBottom: 5,
  },
});
