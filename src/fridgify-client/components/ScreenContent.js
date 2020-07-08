import React from "react";
import { View, StyleSheet } from "react-native";
import LogoText from "./LogoText";

export default function ScreenContent({
  children,
  style,
  header,
  ...otherProps
}) {
  return (
    <View style={[styles.container, style]} {...otherProps}>
      <LogoText style={styles.header}>{header}</LogoText>
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
    fontSize: 20,
    padding: "3%",
    color: "black",
  },
});
