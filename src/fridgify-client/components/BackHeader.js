import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

export default function BackHeader({
  navigation,
  destination,
  style,
  ...otherProps
}) {
  return (
    <View style={[styles.container, style]} {...otherProps}>
      <TouchableOpacity onPress={() => navigation.navigate(destination)}>
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
  },
});
