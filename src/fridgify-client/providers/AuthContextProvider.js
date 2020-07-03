import * as React from "react";
import * as SecureStore from "expo-secure-store";
import { NavigationContainer } from "@react-navigation/native";

import LinkingConfiguration from "../navigation/LinkingConfiguration";
import RootStackNavigator from "../navigation/RootStackNavigator";

export const AuthContext = React.createContext();

export default function AuthContextProvider() {
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
        SecureStore.getItemAsync("user_token").then((userToken) => {
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
          const res = await fetch("http://localhost:3200/v1/user", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          if (res.ok) {
            const resData = await res.json();
            SecureStore.setItemAsync("user_token", resData.token);
            let token = await SecureStore.getItemAsync("user_token");
            await fetch(`http://localhost:3200/v1/glist/${token}`, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ name: "main" }),
            });
            await fetch(`http://localhost:3200/v1/fridge/${token}`, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ name: "Kitchen" }),
            });
            dispatch({ type: "SIGN_IN", token: resData.token });
          }
        }
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer linking={LinkingConfiguration}>
        <RootStackNavigator
          userToken={state.userToken}
          isLoading={state.isLoading}
        />
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
