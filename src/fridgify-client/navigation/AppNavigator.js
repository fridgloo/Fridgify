import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";

import TabBarIcon from "../components/TabBarIcon";
import FridgeNavigator from "./FridgeNavigator";
import GlistNavigator from "./GlistNavigator";
import ProfileScreen from "../screens/ProfileScreen";
import routes from "./routes";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator initialRouteName={routes.FRIDGE}>
      <Tab.Screen
        name="Grocery"
        component={GlistNavigator}
        options={{
          title: "Grocery",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-basket" />
          ),
        }}
      />
      <Tab.Screen
        name="Fridge"
        component={FridgeNavigator}
        options={{
          title: "Fridge",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-journal" />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-person" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
