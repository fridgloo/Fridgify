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
    fontSize: 50,
    textAlign: "center",
    paddingTop: "5%",
    height: "15%",
  },
});
