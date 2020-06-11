import React from "react";
import { FlatList, Button, TextInput, Text, View } from "react-native";
import * as SecureStore from "expo-secure-store";

export default function AddFridgeModal({ navigation, route }) {
  const [name, setName] = React.useState("");

  const addFridge = async (name) => {
    let token = await SecureStore.getItemAsync("user_token");
    const res = await fetch(`http://localhost:3200/v1/fridge/${token}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name }),
    });
    const data = await res.json();
    if (res.ok) {
      resetName();
      navigation.navigate("FridgeHubStack", {
        screen: "FridgeHub",
        params: { data: data, type: "CREATE" },
      });
    }
  };

  const resetName = () => {
    setName("");
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <TextInput placeholder="Name" value={name} onChangeText={setName} />
      <Button
        title="Add Fridge"
        onPress={() => addFridge(name)}
        disabled={name === ""}
      ></Button>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
}
