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
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  fridge: {
    backgroundColor: "#F1F3F6",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 20,
    width: Math.round(Dimensions.get("window").width / 3.8),
    height: "100%",
    marginLeft: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  name: {
    marginBottom: 7,
  },
});
