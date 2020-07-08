import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import React from "react";

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
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Fridge"
        component={FridgeNavigator}
        options={{
          title: "Fridge",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="fridge" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-box"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
