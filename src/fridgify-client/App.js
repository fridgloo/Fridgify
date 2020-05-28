import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { ActivityIndicator, Platform, StatusBar, StyleSheet, View } from "react-native";

import useCachedResources from "./hooks/useCachedResources";

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
        userToken = await SecureStore.getItemAsync("userToken");
        useCachedResources();
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: "RESTORE_TOKEN", token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({ type: "SIGN_IN", token: "dummy-auth-token" });
      },
      signOut: () => dispatch({ type: "SIGN_OUT" }),
      signUp: async (state) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token
        if (state !== undefined && state.username !== '' && state.password !== '' && state.email !== '') {
          const res = await fetch('http://localhost:3200/v1/user', {
            method: 'POST',
            mode: 'no-cors',
            url: 'http://localhost:3200',
            body: state,
            credentials: 'include',
            headers: {
              'content-type': 'application/json'
            }
          });
          console.log(res);
          if (res.ok) {
            // Notify users
           // setNotify(`${state.username} registered.  You will now need to log in.`);
            dispatch({ type: "SIGN_IN", token: "dummy-auth-token" });
          } else {
            console.log("awefawef");
            //const err = await res.json();
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
          <RootStackNavigator userToken={state.userToken} isLoading={state.isLoading} />
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
