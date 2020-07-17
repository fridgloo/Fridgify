import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import GlistHubScreen from "../screens/GlistHubScreen";
import GlistDetailsScreen from "../screens/GlistDetailsScreen";
import ShoppingCartScreen from "../screens/ShoppingCartScreen";

const Glist = createStackNavigator();

export default function GlistNavigator() {
  return (
    <Glist.Navigator mode="card" screenOptions={{ headerShown: false }}>
      <Glist.Screen name="GlistHub" component={GlistHubScreen} />
      <Glist.Screen name="GlistDetails" component={GlistDetailsScreen} />
      <Glist.Screen name="ShoppingCart" component={ShoppingCartScreen} />
    </Glist.Navigator>
  );
}
