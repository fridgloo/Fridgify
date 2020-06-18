import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import FridgeHubScreen from "../screens/FridgeHubScreen";
import AddFridgeModal from "../screens/modals/AddFridgeModal";
import FridgeScreen from "../screens/FridgeScreen";

const FridgeRootStack = createStackNavigator();
const FridgeHubStack = createStackNavigator();

function FridgeHubStackNavigator({ navigation }) {
  return (
    <FridgeHubStack.Navigator>
      <FridgeHubStack.Screen
        name="FridgeHub"
        component={FridgeHubScreen}
        options={{
          headerShown: false
        }}
      />
      <FridgeHubStack.Screen
        name="FridgeScreen"
        component={FridgeScreen}
        options={{
          headerShown: false,
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
