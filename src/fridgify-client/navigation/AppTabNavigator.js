import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from "react";

import TabBarIcon from "../components/TabBarIcon";
import HomeScreen from "../screens/HomeScreen";
import LinksScreen from "../screens/LinksScreen";
import DemoScreen from "../screens/DemoScreen";
import GlistScreen from "../screens/GlistScreen";
import FridgeRootStackNavigator from "./FridgeRootStackNavigator";
import GlistRootStackNavigator from "./GlistRootStackNavigator";
import ProfileScreen from "../screens/ProfileScreen";

const AppTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = "Fridge";

export default function AppTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerTitle: getHeaderTitle(route) });
  return (
    <AppTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <AppTab.Screen
        name="Grocery"
        component={GlistRootStackNavigator}
        options={{
          title: "Grocery",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-basket" />
          ),
        }}
      />
      <AppTab.Screen
        name="Fridge"
        component={FridgeRootStackNavigator}
        options={{
          title: "Fridge",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-journal" />
          ),
        }}
      />
      <AppTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-person" />
          ),
        }}
      />
    </AppTab.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName =
    route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case "Grocery":
      return "Grocery List";
    case "Fridge":
      return "Fridge";
    case "Profile":
      return "Profile"
  }
}
