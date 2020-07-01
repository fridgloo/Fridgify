import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import GlistHubScreen from "../screens/GlistHubScreen";
import GlistScreen from "../screens/GlistScreen";
import ShoppingCartScreen from "../screens/ShoppingCartScreen";

const GlistRootStack = createStackNavigator();

export default function GlistRootStackNavigator({ navigation }) {
  return (
    <GlistRootStack.Navigator initialRouteName={"GlistHub"}>
      <GlistRootStack.Screen
        name="GlistHub"
        component={GlistHubScreen}
        options={{ headerShown: false }}
      />
      <GlistRootStack.Screen
        name="GlistScreen"
        component={GlistScreen}
        options={{ headerShown: false }}
      />
      <GlistRootStack.Screen
        name="ShoppingCartScreen"
        component={ShoppingCartScreen}
        options={{ headerShown: false }}
      />
    </GlistRootStack.Navigator>
  );
}
