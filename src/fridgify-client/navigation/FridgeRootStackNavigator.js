import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import FridgeHubScreen from "../screens/FridgeHubScreen";
import AddFridgeModal from "../screens/modals/AddFridgeModal";
import FridgeScreen from "../screens/FridgeScreen";
import AddItemFromFridgeModal from "../screens/modals/AddItemFromFridgeModal";

import Constants from "expo-constants";

const FridgeRootStack = createStackNavigator();
const FridgeHubStack = createStackNavigator();
const FridgeScreenStack = createStackNavigator();

function FridgeScreenStackNavigator({ navigation }) {
  return (
    <FridgeScreenStack.Navigator mode="modal">
      <FridgeScreenStack.Screen
        name="FridgeScreen"
        component={FridgeScreen}
        options={{
          headerShown: false,
        }}
      />
      <FridgeScreenStack.Screen
        name="AddItemFromFridgeModal"
        component={AddItemFromFridgeModal}
        options={{
          headerShown: false,
        }}
      />
    </FridgeScreenStack.Navigator>
  );
}

function FridgeHubStackNavigator({ navigation }) {
  return (
    <FridgeHubStack.Navigator>
      <FridgeHubStack.Screen
        name="FridgeHub"
        component={FridgeHubScreen}
        options={{
          title: "The Fridge Hub",
          headerTintColor: "#177AEE",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 50,
            marginBottom: -20,
          },
          headerStyle: {
            borderBottomWidth: 0,
            shadowOpacity: 0,
          },

          safeAreaInsets: {
            top: Constants.statusBarHeight,
          },
        }}
      />
      <FridgeHubStack.Screen
        name="FridgeScreenStack"
        component={FridgeScreenStackNavigator}
        options={{
          title: "",
          headerStyle: {
            borderBottomWidth: 0,
            shadowOpacity: 0,
          },
          headerBackTitleVisible: false,
        }}
      />
    </FridgeHubStack.Navigator>
  );
}

export default function FridgeRootStackNavigator({ navigation }) {
  return (
    <FridgeRootStack.Navigator mode="modal">
      <FridgeRootStack.Screen
        name="FridgeHubStack"
        component={FridgeHubStackNavigator}
        options={{ headerShown: false }}
      />
      <FridgeRootStack.Screen
        name="AddFridgeModal"
        component={AddFridgeModal}
        options={{ headerShown: false }}
      />
    </FridgeRootStack.Navigator>
  );
}
