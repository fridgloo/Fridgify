import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";

export default function ListSearchBar({ search, onChangeSearch, clearSearch }) {
  return (
    <View style={styles.container}>
      <FontAwesome5 name={"search"} size={15} />
      <TextInput
        style={styles.input}
        numberOfLines={1}
        placeholder={"Search item..."}
        value={search}
        onChangeText={(value) => onChangeSearch(value)}
      />
      <TouchableOpacity onPress={() => clearSearch()}>
        <FontAwesome name={"times-circle"} size={15} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#CBCBCB",
    borderWidth: 1,
    borderRadius: 15,
    padding: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingHorizontal: 10,
  },
});
