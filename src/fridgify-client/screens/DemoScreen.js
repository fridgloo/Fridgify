import React from "react";
import { FlatList, Button, ActivityIndicator, Text, View } from "react-native";
import * as SecureStore from 'expo-secure-store';

import { AuthContext } from "../App";


export default function DemoScreen () {
  React.useEffect(() => {
    SecureStore.getItemAsync('user_token')
    .then(value => {
      console.log(value)
    })})

  const { signOut } = React.useContext(AuthContext);
  return (
    <View style={{ flex: 1, paddingTop: 20 }}>
      <Button title="Logout" onPress={() => { signOut(); }}></Button>
    </View>
  );
}

