import React from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import Fridge from "./Fridge";
import { FontAwesome } from "@expo/vector-icons";

export default function FridgeList({ fridges, onPress, toggleModal }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.addFridgeButton,
          fridges.length >= 4 ? styles.buttonDisabled : styles.buttonEnabled,
        ]}
        onPress={() => toggleModal("name", "")}
        disabled={fridges.length >= 4}
      >
        <FontAwesome name={"plus"} size={25} color="white" />
      </TouchableOpacity>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={fridges}
        keyExtractor={(fridge) => fridge._id}
        renderItem={({ item }) => (
          <Fridge name={item.name} onPress={() => onPress(item)} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  buttonContainer: {
    justifyContent: "center",
  },
  fridge: {
    backgroundColor: "#F1F3F6",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 20,
    width: Math.round(Dimensions.get("window").width / 3.8),
    height: "100%",
    marginLeft: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  addFridgeButton: {
    borderRadius: 50,
    width: 60,
    height: 60,
    marginLeft: 30,
    marginRight: 20,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  buttonEnabled: {
    backgroundColor: "#FF7F23",
  },
  buttonDisabled: {
    backgroundColor: "#FFC194",
  },
});
