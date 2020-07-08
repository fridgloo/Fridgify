import React from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
} from "react-native";

export default function Fridge({ name, onPress }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.fridge}>
        <Text style={styles.name} numberOfLines={2}>
          {name}
        </Text>
        <View style={styles.handle} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  fridge: {
    flex: 1,
    backgroundColor: "#F1F3F6",
    // borderColor: "gray",
    // borderWidth: 1,
    borderRadius: 20,
    width: Math.round(Dimensions.get("window").width / 3.8),
    height: "100%",
    marginLeft: 10,
    alignItems: "center",
  },
  name: {
    paddingVertical: 10,
    textAlign: "center",
  },
  handle: {
    position: "absolute",
    backgroundColor: "#C4C4C4",
    width: "10%",
    height: "25%",
    bottom: "35%",
    right: "10%",
  },
});
