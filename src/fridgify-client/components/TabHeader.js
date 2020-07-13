import React from "react";
import { StyleSheet } from "react-native";
import LogoText from "./LogoText";

export default function TabHeader({ children, style, ...otherProps }) {
  return (
    <LogoText style={[styles.title, style]} {...otherProps}>
      {children}
    </LogoText>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 55,
    textAlign: "center",
    paddingVertical: 25,
  },
});
