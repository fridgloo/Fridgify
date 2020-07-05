import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import GlistHubScreen from "../screens/GlistHubScreen";
import GlistScreen from "../screens/GlistScreen";

const Glist = createStackNavigator();

export default function GlistNavigator() {
  return (
    <Glist.Navigator screenOptions={{ headerShown: false }}>
      <Glist.Screen name="GlistHub" component={GlistHubScreen} />
      <Glist.Screen name="GlistScreen" component={GlistScreen} />
    </Glist.Navigator>
  );
}
