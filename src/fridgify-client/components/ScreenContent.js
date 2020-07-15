import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import LogoText from "./LogoText";
import colors from "../constants/colors";
import { FontAwesome5 } from "@expo/vector-icons";

export default function ScreenContent({
  children,
  style,
  header,
  toggleModal,
  ...otherProps
}) {
  return (
    <View style={[styles.container, style]} {...otherProps}>
      <View style={styles.header}>
        <LogoText style={styles.headerTitle}>{header}</LogoText>
        {toggleModal && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => toggleModal("name", "")}
          >
            <FontAwesome5 name={"plus"} size={10} color="white" />
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "26%",
    paddingBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  headerTitle: {
    fontSize: 20,
    padding: "3%",
    color: "black",
  },
  button: {
    backgroundColor: colors.secondaryColor,
    borderRadius: 25,
    width: 26,
    height: 26,
    justifyContent: "center",
    alignItems: "center",
  },
});
