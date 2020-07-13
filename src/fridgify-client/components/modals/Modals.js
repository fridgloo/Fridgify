import React from "react";
import { StyleSheet, View, Text } from "react-native";
import {
  Confirmation,
  Name,
  Type,
  ExpDate,
  Cancel,
  Save,
  Message,
} from "./ModalComponents";
import Modal from "react-native-modal";
import colors from "../../constants/colors";

export function ModalTemplate(props) {
  return (
    <View>
      <Modal
        animationIn={"zoomIn"}
        animationOut={"zoomOut"}
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        onBackdropPress={() => props.toggleModal("", "")}
        isVisible={props.visible}
      >
        {props.children}
      </Modal>
    </View>
  );
}

export function NameModal(props) {
  return (
    <View style={styles.container}>
      <Name onChangeText={props.onChangeText} newVal={props.newVal}>
        {props.children}
      </Name>
      <Confirmation>
        <Cancel toggleModal={props.toggleModal}>Cancel</Cancel>
        <Save
          onPress={props.onPress}
          toggleModal={props.toggleModal}
          value={props.newVal}
        >
          {props.saveMessage}
        </Save>
      </Confirmation>
    </View>
  );
}

export function TypeModal(props) {
  return (
    <View style={styles.container}>
      <Type onChangeText={props.onChangeText} newVal={props.newVal} />
      <Confirmation>
        <Cancel toggleModal={props.toggleModal}>Cancel</Cancel>
        <Save
          onPress={props.onPress}
          toggleModal={props.toggleModal}
          value={props.newVal}
        >
          Save
        </Save>
      </Confirmation>
    </View>
  );
}

export function ExpDateModal(props) {
  return (
    <View style={styles.container}>
      <ExpDate onChangeText={props.onChangeText} newVal={props.newVal} />
      <Confirmation>
        <Cancel toggleModal={props.toggleModal}>Cancel</Cancel>
        <Save
          onPress={props.onPress}
          toggleModal={props.toggleModal}
          value={props.newVal}
        >
          Save
        </Save>
      </Confirmation>
    </View>
  );
}

export function SendModal(props) {
  return (
    <View style={styles.container}>
      <Message>Send this list to {"\n"}your shopping cart?</Message>
      <Confirmation>
        <Cancel toggleModal={props.toggleModal}>No</Cancel>
        <Save onPress={props.onPress} toggleModal={props.toggleModal}>
          Yes
        </Save>
      </Confirmation>
    </View>
  );
}

export function PrimaryModal(props) {
  return (
    <View style={styles.container}>
      <Message>Make this fridge primary?</Message>
      <Confirmation>
        <Cancel toggleModal={props.toggleModal}>No</Cancel>
        <Save onPress={props.onPress} toggleModal={props.toggleModal}>
          Yes
        </Save>
      </Confirmation>
    </View>
  );
}

export function DeleteModal(props) {
  return (
    <View style={styles.container}>
      <Message>
        Delete this {props.container}? {"\n"}(Cannot undo this action)
      </Message>
      <Confirmation>
        <Cancel toggleModal={props.toggleModal}>No</Cancel>
        <Save onPress={props.onPress} toggleModal={props.toggleModal}>
          Yes
        </Save>
      </Confirmation>
    </View>
  );
}

export function ClearModal(props) {
  return (
    <View style={styles.container}>
      <Message>Clear the list? {"\n"}(Cannot undo this action)</Message>
      <Confirmation>
        <Cancel toggleModal={props.toggleModal}>No</Cancel>
        <Save onPress={props.onPress} toggleModal={props.toggleModal}>
          Yes
        </Save>
      </Confirmation>
    </View>
  );
}

export function AddItemNTEModal(props) {
  return (
    <View style={styles.container}>
      <Name onChangeText={props.onChangeText}>Name (required):</Name>
      <Type onChangeText={props.onChangeText} newVal={props.newType}>
        Type:
      </Type>
      <ExpDate onChangeText={props.onChangeText} newVal={props.newDate}>
        Expiration Date:
      </ExpDate>
      <Confirmation>
        <Cancel toggleModal={props.toggleModal}>Cancel</Cancel>
        <Save
          onPress={props.onPress}
          toggleModal={props.toggleModal}
          value={props.newName}
        >
          Save
        </Save>
      </Confirmation>
    </View>
  );
}

export function AddItemNTModal(props) {
  return (
    <View style={styles.container}>
      <Name onChangeText={props.onChangeText}>Name (required):</Name>
      <Type onChangeText={props.onChangeText} newVal={props.newType}>
        Type:
      </Type>
      <Confirmation>
        <Cancel toggleModal={props.toggleModal}>Cancel</Cancel>
        <Save
          onPress={props.onPress}
          toggleModal={props.toggleModal}
          value={props.newName}
        >
          Save
        </Save>
      </Confirmation>
    </View>
  );
}

export function SubmitToModal(props) {
  return (
    <View style={[styles.container, { paddingBottom: 20 }]}>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 16, paddingVertical: 10 }}>
          Send {<Text style={{ color: colors.secondaryColor }}>checked</Text>}{" "}
          items to:
        </Text>
      </View>
      {props.children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "80%",
    backgroundColor: "white",
    alignItems: "center",
    borderRadius: 12,
  },
});
