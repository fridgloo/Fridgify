import React from "react";
import { FlatList, Button, TextInput, Text, View } from "react-native";
import * as SecureStore from "expo-secure-store";

export default function AddItemFromFridgeModal({ navigation, route }) {
  const [state, setState] = React.useState({
    name: "",
    bought_date: "",
    exp_date: "",
    type: "",
    note: "",
  });

  const addItem = async (data) => {
    let token = await SecureStore.getItemAsync("user_token");
    const res = await fetch(`http://localhost:3200/v1/item/fridge/${token}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: data, fridge: route.params?.fridge }),
    });
    const info = await res.json();
    if (res.ok) {
      resetState();
      navigation.navigate("FridgeScreen", { data: info, type: "CREATE" });
    }
  };

  const resetState = () => {
    setState({
      name: "",
      bought_date: "",
      exp_date: "",
      type: "",
      note: "",
    });
  };

  const onChange = (name, value) => {
    setState({
      ...state,
      [name]: value,
    });
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <TextInput
        placeholder="Name"
        id="name"
        name="name"
        value={state.name}
        onChangeText={(value) => onChange("name", value)}
      />
      <TextInput
        placeholder="Bought Date"
        id="bought_date"
        name="bought_date"
        value={state.bought_date}
        onChangeText={(value) => onChange("bought_date", value)}
        secureTextEntry
      />
      <TextInput
        placeholder="Expiration Date"
        id="exp_date"
        name="exp_date"
        value={state.exp_date}
        onChangeText={(value) => onChange("exp_date", value)}
      />
      <TextInput
        placeholder="Type"
        id="type"
        name="type"
        value={state.type}
        onChangeText={(value) => onChange("type", value)}
      />
      <TextInput
        placeholder="Note"
        id="note"
        name="note"
        value={state.note}
        onChangeText={(value) => onChange("note", value)}
      />
      <Button
        title="Add Item"
        onPress={() => addItem(state)}
        disabled={state.name === ""}
      ></Button>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
}
