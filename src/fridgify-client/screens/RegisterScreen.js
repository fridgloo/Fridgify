import React, { useState } from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";
import LogoText from "../components/LogoText";
import styles from "../constants/authStyles";

import * as Yup from "yup";
import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from "../components/form";

import usersApi from "../api/user";
import authApi from "../api/auth";
import useAuth from "../auth/useAuth";
import useApi from "../hooks/useApi";

const validationSchema = Yup.object().shape({
  username: Yup.string().required().min(2).max(16).label("Username"),
  password: Yup.string()
    .required()
    .min(8)
    .matches(
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^#&?+=`_]).{8,}$/,
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

export default function RegisterScreen() {
  const registerApi = useApi(usersApi.register);
  const signInApi = useApi(authApi.signIn);
  const auth = useAuth();
  const [error, setError] = useState();

  const handleSubmit = async ({ username, password, email }) => {
    const result = await registerApi.request({ username, password, email });

    if (!result.ok) {
      if (result.data) setError(result.data.error);
      else {
        setError("An unexpected error occurred.");
        console.log(result);
      }
      return;
    }

    const { data: authToken } = await signInApi.request(username, password);
    auth.signIn(authToken);
  };

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
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <ErrorMessage error={error} visible={error} />
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

// const styles = StyleSheet.create({
//   title: {
//     fontSize: 55,
//     lineHeight: 68,
//     textAlign: "center",
//     padding: "10%",
//     marginTop: "10%",
//   },
//   loginIndicator: {
//     fontFamily: "System",
//     fontSize: 15,
//     marginLeft: "10%",
//     marginBottom: 5,
//   },
// });
