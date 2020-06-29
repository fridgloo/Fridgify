import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import GlistHubScreen from "../screens/GlistHubScreen";
import GlistScreen from "../screens/GlistScreen";

const Glist = createStackNavigator();

export default function GlistNavigator({ navigation }) {
  return (
    <Glist.Navigator>
      <Glist.Screen
        name="GlistHub"
        component={GlistHubScreen}
        options={{ headerShown: false }}
      />
      <Glist.Screen
        name="GlistScreen"
        component={GlistScreen}
        options={{ headerShown: false }}
      />
    </Glist.Navigator>
  );
}
