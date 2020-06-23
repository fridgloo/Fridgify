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

export function Confirmation(props) {
  return (
    <View
      style={{
        width: "100%",
        height: 50,
        flexDirection: "row",
        justifyContent: "space-between",
        borderTopColor: "#CBCBCB",
        borderTopWidth: 1,
      }}
    >
      {props.children}
    </View>
  );
}

export function Name(props) {
  return (
    <View
      style={{
        flex: 1,
        width: "90%",
        justifyContent: "center",
      }}
    >
      {props.children ? (
        <Text style={{ paddingBottom: 10, fontSize: 16 }}>
          {props.children}
        </Text>
      ) : (
        null
      )}
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
          onChangeText={(val) => props.onChangeText(val, "name")}
        />
      </View>
    </View>
  );
}

export function Type(props) {
  return (
    <View
      style={{
        flex: 1,
        width: "90%",
        justifyContent: "center",
      }}
    >
      {props.children ? (
        <Text style={{ fontSize: 16 }}>
          {props.children}
        </Text>
      ) : (
        null
      )}
      <Picker
        selectedValue={props.newVal}
        itemStyle={{
          height: 88,
          fontSize: 16,
        }}
        onValueChange={(val) => {
          if (val !== "0") {
            props.onChangeText(val, "type");
          }
        }}
      >
        <Picker.Item
          label={"Scroll to a type..."}
          value={"0"}
          color={"#CBCBCB"}
        />
        <Picker.Item label={"Fish"} value={"fish"} />
        <Picker.Item label={"Fruit"} value={"fruit"} />
        <Picker.Item label={"Meat"} value={"meat"} />
        <Picker.Item label={"Vegetable"} value={"vegetable"} />
      </Picker>
    </View>
  );
}

export function ExpDate(props) {
  return (
    <View
      style={{
        flex: 2.4,
        width: "90%",
        paddingVertical: 10,
      }}
    >
      <View
        style={{
          justifyContent: "center",
        }}
      >
        {props.children ? (
        <Text style={{ fontSize: 16 }}>
          {props.children}
        </Text>
      ) : (
        null
      )}
        <DateTimePicker
          testID="dateTimePicker"
          value={props.newVal}
          mode={"date"}
          display={"default"}
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || props.newVal;
            props.onChangeText(currentDate, "exp_date");
          }}
          style={{
            flex: 1,
          }}
        />
      </View>
    </View>
  );
}

export function Cancel(props) {
  return (
    <View
      style={{
        width: "50%",
        backgroundColor: "white",
        justifyContent: "center",
        borderBottomStartRadius: 12,
      }}
    >
      <TouchableOpacity
        style={{
          padding: 5,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => props.toggleModal()}
      >
        <Text style={{ fontSize: 16, color: "#2D82FF" }}>{props.children}</Text>
      </TouchableOpacity>
    </View>
  );
}

export function Save(props) {
  return (
    <View
      style={{
        backgroundColor: !props.changed ? "#A7CBFF" : "#2D82FF",
        width: "50%",
        justifyContent: "center",
        borderBottomEndRadius: 12,
      }}
    >
      <TouchableOpacity
        style={{
          padding: 5,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => {
          props.onPress();
          props.toggleModal();
        }}
        disabled={!props.changed}
      >
        <Text style={{ fontSize: 16, color: "white" }}>{props.children}</Text>
      </TouchableOpacity>
    </View>
  );
}

export function Message(props) {
  return (
    <View
      style={{
        width: "85%",
        height: "90%",
        flex: 1,
        justifyContent: "center",
      }}
    >
      <Text
        numberOfLines={props.numberOfLines}
        style={{ textAlign: "center", fontSize: 20 }}
      >
        {props.children}
      </Text>
    </View>
  );
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
