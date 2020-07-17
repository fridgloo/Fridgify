import React from "react";
import { StyleSheet, View } from "react-native";

function ListItemSeparator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "#000",
  },
});

export default ListItemSeparator;
