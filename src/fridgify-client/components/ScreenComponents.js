import React from "react";
import {
  TouchableOpacity,
  TouchableHighlight,
  Picker,
  Button,
  TextInput,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
} from "react-native";
import Modal from "react-native-modal";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SwipeListView } from "react-native-swipe-list-view";
import * as SecureStore from "expo-secure-store";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export function FridglooModal(props) {
  return (
    <View>
      <Modal
        style={styles.container}
        onBackdropPress={props.toggleModal}
        isVisible={props.visible}
      >
        <ModalOption option={props.option} onChangeText={props.onChangeText}/>
      </Modal>
    </View>
  );
}

function ModalOption(props) {
  const option = props.option;
  return (
    <View style={[styles.optionContainer, { height: optionHeight(option) }]}>
      <Name onChangeText={props.onChangeText} />
    </View>
  );
}

function Name(props) {
  return (
    <View
      style={{
        flex: 1,
        width: "90%",
        justifyContent: "center",
      }}
    >
      <Text style={{ paddingBottom: 10, fontSize: 16 }}>Name (required):</Text>
      <View
        style={{
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#CBCBCB",
          paddingHorizontal: 10,
          paddingVertical: 10,
        }}
      >
        <TextInput
          style={{
            fontSize: 16,
          }}
          numberOfLines={1}
          placeholder={"Name..."}
          onChangeText={(val) => props.onChangeText(val)}
        />
      </View>
    </View>
  );
}



function optionHeight(option) {
  switch (option) {
    case "name":
      return "15%";
    case "type":
      return "15%";
    case "exp_date":
      return "32%";
    default:
      break;
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  optionContainer: {
    width: "80%",
    backgroundColor: "white",
    alignItems: "center",
    borderRadius: 12,
  },
});
