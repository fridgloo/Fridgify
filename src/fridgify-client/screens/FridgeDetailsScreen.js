import React, { useEffect, useState } from "react";
import { Button, FlatList, Text, StyleSheet, View, Alert } from "react-native";
import Screen from "../components/Screen";
import fridgesApi from "../api/fridge";
import authStorage from "../auth/storage";
import LogoText from "../components/LogoText";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  ListItem,
  ListItemDeleteAction,
  ListItemSeparator,
  ListSearchBar,
} from "../components/list";

const testValues = [
  {
    id: 1,
    name: "Squash",
  },
  {
    id: 2,
    name: "Watermelon",
  },
];

function FridgeDetailsScreen({ navigation, route }) {
  const [values, setValues] = useState(testValues);
  const [refreshing, setRefreshing] = useState(false);
  const fridge = route.params;

  const deleteFridge = async () => {
    const authToken = await authStorage.getToken();
    const result = await fridgesApi.deleteFridge(fridge._id, authToken);
    if (result.ok) {
      navigation.navigate("FridgeHub");
    } else {
      console.log(`Error: ${result}`);
    }
  };

  const setPrimary = async () => {
    const authToken = await authStorage.getToken();
    const result = await fridgesApi.editFridge(fridge, authToken);
    if (result.ok) {
      navigation.navigate("FridgeHub");
    } else {
      console.log(`Error: ${result}`);
    }
  };

  const handleDeleteItem = async (item) => {
    console.log("Delete Item Called");
    //Call to DB
    setValues(values.filter((m) => m.id !== item.id));
  };

  const promptUser = () => {
    const title = "Are you sure?";
    const message = "This will delete the fridge. This action is irreversible.";
    const buttons = [
      { text: "Cancel", type: "cancel" },
      {
        text: "Confirm",
        onPress: () => deleteFridge(),
      },
    ];
    Alert.alert(title, message, buttons);
  };

  return (
    <>
      <Screen>
        <View style={styles.container}>
          <LogoText style={styles.fridgeName}>{fridge.name}</LogoText>
          <MaterialCommunityIcons
            name="delete"
            size={30}
            onPress={() => promptUser()}
            color={"#2D82FF"}
          />
          <MaterialCommunityIcons
            name="star"
            size={30}
            onPress={() => setPrimary()}
            color={fridge.primary ? "#2D82FF" : "#A7CBFF"}
          />
        </View>
        <FlatList
          data={values}
          keyExtractor={(value) => value.id.toString()}
          renderItem={({ item }) => (
            <ListItem
              name={item.name}
              onPress={() => console.log("Message selected", item)}
              renderRightActions={() => (
                <ListItemDeleteAction onPress={() => handleDeleteItem(item)} />
              )}
            />
          )}
          ItemSeparatorComponent={ListItemSeparator}
          ListHeaderComponent={ListSearchBar}
          refreshing={refreshing}
          onRefresh={() => {
            setValues([
              {
                id: 2,
                name: "ramen",
              },
            ]);
          }}
        />
        <Text>{fridge.primary ? "Primary" : "Not Primary"}</Text>
        <Button title="Add Items" onPress={() => addItems()} />
      </Screen>
    </>
  );
}

export default FridgeDetailsScreen;

const styles = StyleSheet.create({
  fridgeName: {
    fontSize: 40,
    textAlign: "center",
  },
  container: {
    flexDirection: "row",
    backgroundColor: "white",
  },
});
