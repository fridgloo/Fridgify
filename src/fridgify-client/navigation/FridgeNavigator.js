import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import FridgeHubScreen from "../screens/FridgeHubScreen";
import FridgeScreen from "../screens/FridgeScreen";

const Fridge = createStackNavigator();

export default function FridgeNavigator({ navigation }) {
  return (
    <Fridge.Navigator>
      <Fridge.Screen
        name="FridgeHub"
        component={FridgeHubScreen}
        options={{ headerShown: false }}
      />
      <Fridge.Screen
        name="FridgeScreen"
        component={FridgeScreen}
        options={{ headerShown: false }}
      />
    </Fridge.Navigator>
  );
}
