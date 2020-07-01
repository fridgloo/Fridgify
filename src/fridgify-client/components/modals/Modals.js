import React from "react";
import { StyleSheet, View } from "react-native";
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
import { optionHeight } from "../../util/ScreenHelpers";

export function ModalTemplate(props) {
  return (
    <View>
      <Modal
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        onBackdropPress={() => props.toggleModal()}
        isVisible={props.visible}
      >
        {props.children}
      </Modal>
    </View>
  );
}

export function NameModal(props) {
  return (
    <View style={[styles.container, { height: optionHeight("name") }]}>
      <Name onChangeText={props.onChangeText} />
      <Confirmation>
        <Cancel toggleModal={props.toggleModal}>Cancel</Cancel>
        <Save
          onPress={props.onPress}
          toggleModal={props.toggleModal}
          changed={props.changed}
        >
          Save
        </Save>
      </Confirmation>
    </View>
  );
}

export function TypeModal(props) {
  return (
    <View style={[styles.container, { height: optionHeight("type") }]}>
      <Type onChangeText={props.onChangeText} newVal={props.newVal} />
      <Confirmation>
        <Cancel toggleModal={props.toggleModal}>Cancel</Cancel>
        <Save
          onPress={props.onPress}
          toggleModal={props.toggleModal}
          changed={props.changed}
        >
          Save
        </Save>
      </Confirmation>
    </View>
  );
}

export function ExpDateModal(props) {
  return (
    <View style={[styles.container, { height: optionHeight("exp_date") }]}>
      <ExpDate onChangeText={props.onChangeText} newVal={props.newVal} />
      <Confirmation>
        <Cancel toggleModal={props.toggleModal}>Cancel</Cancel>
        <Save
          onPress={props.onPress}
          toggleModal={props.toggleModal}
          changed={props.changed}
        >
          Save
        </Save>
      </Confirmation>
    </View>
  );
}

export function DeleteModal(props) {
  return (
    <View style={[styles.container, { height: optionHeight("delete") }]}>
      <Message>Are you sure?</Message>
      <Confirmation>
        <Cancel toggleModal={props.toggleModal}>No</Cancel>
        <Save
          onPress={props.onPress}
          toggleModal={props.toggleModal}
          changed={props.changed}
        >
          Yes
        </Save>
      </Confirmation>
    </View>
  );
}

export function ClearModal(props) {
  return (
    <View style={[styles.container, { height: optionHeight("clear") }]}>
      <Message>Clear the list?</Message>
      <Confirmation>
        <Cancel toggleModal={props.toggleModal}>No</Cancel>
        <Save
          onPress={props.onPress}
          toggleModal={props.toggleModal}
          changed={props.changed}
        >
          Yes
        </Save>
      </Confirmation>
    </View>
  );
}

export function AddItemNTEModal(props) {
  return (
    <View style={[styles.container, { height: optionHeight("add_nte") }]}>
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
          changed={props.changed}
        >
          Save
        </Save>
      </Confirmation>
    </View>
  );
}

export function AddItemNTModal(props) {
  return (
    <View style={[styles.container, { height: optionHeight("add_nt") }]}>
      <Name onChangeText={props.onChangeText}>Name (required):</Name>
      <Type onChangeText={props.onChangeText} newVal={props.newType}>
        Type:
      </Type>
      <Confirmation>
        <Cancel toggleModal={props.toggleModal}>Cancel</Cancel>
        <Save
          onPress={props.onPress}
          toggleModal={props.toggleModal}
          changed={props.changed}
        >
          Save
        </Save>
      </Confirmation>
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
