import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import SignInScreen from "../screens/SignInScreen";
import RegistrationScreen from "../screens/RegistrationScreen";

const AuthStack = createStackNavigator();

export default function AuthStackNavigator({ navigation }) {
  return (
    <AuthStack.Navigator>
        <AuthStack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{ title: "Sign in" }}
        />
        <AuthStack.Screen
            name="Registration"
            component={RegistrationScreen}
            options={{ title: "Create Account" }}
        />
    </AuthStack.Navigator>
  );
}
