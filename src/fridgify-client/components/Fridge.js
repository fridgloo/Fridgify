import React from "react";
import { View, Text, TouchableWithoutFeedback, StyleSheet } from "react-native";

export default function Fridge({ name, onPress }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.fridge}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  fridge: {
    borderRadius: 15,
    backgroundColor: "#F1F3F6",
    width: 160,
  },
  name: {
    marginBottom: 7,
  },
});
