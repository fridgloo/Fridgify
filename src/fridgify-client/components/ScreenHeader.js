import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import LogoText from "./LogoText";

export default function ScreenHeader({
  name,
  primary,
  children,
  style,
  ...otherProps
}) {
  return (
    <View style={[styles.container, style]} {...otherProps}>
      <View style={styles.title}>
        <LogoText
          style={{ fontSize: name?.length > 10 ? 26 : 40 }}
          numberOfLines={1}
        >
          {name}
        </LogoText>
        {primary ? (
          <FontAwesome5
            style={{ paddingLeft: 10 }}
            name={"igloo"}
            size={26}
            color={"black"}
          />
        ) : null}
      </View>
      <View style={styles.buttons}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  title: {
    flex: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  buttons: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
});
