import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import useCachedResources from "../hooks/useCachedResources";

import AuthStackNavigator from './AuthStackNavigator';
import AppTabNavigator from './AppTabNavigator';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';

const RootStack = createStackNavigator();

export default function RootStackNavigator({ navigation, userToken, isLoading }) {
    const isCacheLoading = !useCachedResources();

    return (
    <RootStack.Navigator initialRoutName="Auth">
        {isLoading || isCacheLoading ? (
            <RootStack.Screen name="AuthLoading" component={AuthLoadingScreen} options={{headerShown: false}}/>
        ) : !userToken ? (
            <RootStack.Screen name="Auth" component={AuthStackNavigator} options={{headerShown: false}} />
        ) : (
            <RootStack.Screen name="App" component={AppTabNavigator} />
        )}
    </RootStack.Navigator>
  );
}