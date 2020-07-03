import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import FridgeHubScreen from "../screens/FridgeHubScreen";
import FridgeScreen from "../screens/FridgeScreen";

const FridgeRootStack = createStackNavigator();

export default function FridgeRootStackNavigator({ navigation }) {
  return (
    <FridgeRootStack.Navigator initialRouteName={"FridgeHub"}>
      <FridgeRootStack.Screen
        name="FridgeHub"
        component={FridgeHubScreen}
        options={{ headerShown: false }}
      />
      <FridgeRootStack.Screen
        name="FridgeScreen"
        component={FridgeScreen}
        options={{ headerShown: false }}
      />
    </FridgeRootStack.Navigator>
  );
}
