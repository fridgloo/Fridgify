import React from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import Glist from "./Glist";
import { FontAwesome } from "@expo/vector-icons";

export default function GlistList({ glists, onPress, toggleModal }) {
  return (
    <View style={styles.container}>
      <FlatList
        data={glists}
        keyExtractor={(fridge) => fridge._id}
        renderItem={({ item }) => (
          <Glist
            name={item.name}
            id={item._id}
            onPress={() => onPress(item)}
            toggleModal={toggleModal}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
});
