import React from "react";
import {
  TouchableOpacity,
  Picker,
  TextInput,
  StyleSheet,
  Text,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import colors from "../../constants/colors";

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
        width: "90%",
        paddingVertical: 20,
        justifyContent: "center",
      }}
    >
      {props.children ? (
        <Text style={{ paddingBottom: 10, fontSize: 16 }}>
          {props.children}
        </Text>
      ) : null}

      <TextInput
        style={{
          fontSize: 16,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#CBCBCB",
          paddingHorizontal: 10,
          paddingVertical: 10,
        }}
        numberOfLines={1}
        placeholder={"Name..."}
        onChangeText={(val) => props.onChangeText(val, "name")}
      />
    </View>
  );
}

export function Type(props) {
  return (
    <View
      style={{
        width: "90%",
        paddingVertical: 10,
        justifyContent: "center",
      }}
    >
      {props.children ? (
        <Text style={{ fontSize: 16 }}>{props.children}</Text>
      ) : null}
      <Picker
        selectedValue={props.newVal}
        itemStyle={{
          height: 88,
          fontSize: 16,
        }}
        onValueChange={(val) => {
          props.onChangeText(val, "type");
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
        width: "90%",
        paddingVertical: 10,
        justifyContent: "center",
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {props.children ? (
          <Text style={{ paddingBottom: 10, fontSize: 16 }}>
            {props.children}
          </Text>
        ) : null}
        <TouchableOpacity
          style={{ paddingBottom: 10 }}
          onPress={() =>
            props.newVal
              ? props.onChangeText(null, "exp_date")
              : props.onChangeText(new Date(), "exp_date")
          }
        >
          <Text
            style={{
              fontSize: 16,
              color: colors.primaryColor,
            }}
          >
            Toggle Date
          </Text>
        </TouchableOpacity>
      </View>
      {props.newVal ? (
        <DateTimePicker
          testID="dateTimePicker"
          value={props.newVal}
          mode={"date"}
          display={"default"}
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || props.newVal;
            props.onChangeText(currentDate, "exp_date");
          }}
        />
      ) : (
        <Text style={{ textAlign: "center" }}>No Date</Text>
      )}
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
        onPress={() => props.toggleModal("", "")}
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
        backgroundColor: props.value === "" ? "#A7CBFF" : "#2D82FF",
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
          props.toggleModal("", "");
        }}
        disabled={props.value === ""}
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
        paddingVertical: 20,
        justifyContent: "center",
      }}
    >
      <Text
        numberOfLines={props.numberOfLines}
        style={{ textAlign: "center", fontSize: 18, fontWeight: "300" }}
      >
        {props.children}
      </Text>
    </View>
  );
}
