import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import FridgeHubScreen from "../screens/FridgeHubScreen";
import FridgeDetailsScreen from "../screens/FridgeDetailsScreen";

const Fridge = createStackNavigator();

export default function FridgeNavigator() {
  return (
    <Fridge.Navigator mode="modal" screenOptions={{ headerShown: false }}>
      <Fridge.Screen name="FridgeHub" component={FridgeHubScreen} />
      <Fridge.Screen name="FridgeDetails" component={FridgeDetailsScreen} />
    </Fridge.Navigator>
  );
}
