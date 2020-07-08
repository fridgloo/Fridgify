import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

export default function BackHeader({ navigation, style, ...otherProps }) {
  return (
    <View style={[styles.container, style]} {...otherProps}>
      <TouchableOpacity onPress={() => navigation.navigate("FridgeHub")}>
        <FontAwesome5 name={"chevron-left"} size={22} color={"black"} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "6%",
    paddingLeft: 10,
    justifyContent: "flex-end",
    backgroundColor: "yellow",
  },
});
