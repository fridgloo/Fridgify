import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import {
  ActivityIndicator,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";

import LinkingConfiguration from "./navigation/LinkingConfiguration";
import * as SecureStore from "expo-secure-store";
import RootStackNavigator from "./navigation/RootStackNavigator";

const Stack = createStackNavigator();
export const AuthContext = React.createContext();

// TODO: Reference website to fix things like the dummytoken, etc
// We used SecureStorage instead of AsyncStorage
// https://reactnavigation.org/docs/auth-flow/

export default function App({ navigation }) {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "RESTORE_TOKEN":
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case "SIGN_IN":
          console.log("REDUCER: ", action);
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;
      try {
        SecureStore.getItemAsync("user_token")
          .then((userToken) => {
          // This will switch to the App screen or Auth screen and this loading
          // screen will be unmounted and thrown away.
            dispatch({ type: "RESTORE_TOKEN", token: userToken });
          });
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        const res = await fetch("http://localhost:3200/v1/auth", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        data = await res.json();
        if (res.ok) {
          SecureStore.setItemAsync("user_token", data.token);
          dispatch({ type: "SIGN_IN", token: data.token });
        }
      },
      signOut: async () => {
        SecureStore.deleteItemAsync("user_token");
        dispatch({ type: "SIGN_OUT" });
      },
      signUp: async (data) => {
        if (
          data !== undefined &&
          data.username !== "" &&
          data.password !== "" &&
          data.email !== ""
        ) {
          console.log(data);
          const res = await fetch("http://localhost:3200/v1/user", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          data = await res.json();
          if (res.ok) {
            SecureStore.setItemAsync("user_token", data.token);
            dispatch({ type: "SIGN_IN", token: data.token });
          }
        }
      },
    }),
    []
  );

  return (
    <View style={styles.container}>
      {Platform.OS === "ios" && <StatusBar barStyle="dark-content" />}
      <AuthContext.Provider value={authContext}>
        <NavigationContainer linking={LinkingConfiguration}>
          <RootStackNavigator
            userToken={state.userToken}
            isLoading={state.isLoading}
          />
        </NavigationContainer>
      </AuthContext.Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
