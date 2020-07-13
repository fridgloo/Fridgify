import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";

export default function ListLabels({
  showCheckBox,
  showExpiration,
  sortByAndSet,
}) {
  return (
    <View style={[styles.container, showCheckBox ? { paddingLeft: 0 } : null]}>
      {showCheckBox ? <View style={styles.checkbox} /> : null}
      <TouchableOpacity
        style={styles.name}
        onPress={() => sortByAndSet("name")}
      >
        <Text style={{ fontSize: 14, fontWeight: "bold" }}>Name</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.type}
        onPress={() => sortByAndSet("type")}
      >
        <Text style={{ fontSize: 14, fontWeight: "bold" }}>Type</Text>
      </TouchableOpacity>
      {showExpiration ? (
        <TouchableOpacity
          style={styles.exp}
          onPress={() => sortByAndSet("exp_date")}
        >
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>Expiration</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingVertical: 5,
    borderColor: "#CBCBCB",
    borderBottomWidth: 0.5,
  },
  checkbox: {
    flex: 0.2,
  },
  name: {
    flex: 1,
  },
  type: {
    flex: 0.2,
    alignItems: "center",
  },
  exp: {
    flex: 0.55,
    alignItems: "center",
  },
});
