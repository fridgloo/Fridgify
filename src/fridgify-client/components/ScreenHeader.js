import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import LogoText from "./LogoText";

export default function ScreenHeader({
  fridge,
  children,
  style,
  ...otherProps
}) {
  console.log(fridge);
  return (
    <View style={[styles.container, style]} {...otherProps}>
      <LogoText style={{ fontSize: 40 }} numberOfLines={1}>
        Basement Basement
      </LogoText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "10%",
    flexDirection: "row",
    paddingHorizontal: 20,
    alignItems: "center",
    backgroundColor: "green",
  },
});
