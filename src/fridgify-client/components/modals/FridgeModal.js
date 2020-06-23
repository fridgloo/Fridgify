import React from "react";
import { StyleSheet, View } from "react-native";
import {
  ModalTemplate,
  NameModal,
  TypeModal,
  ExpDateModal,
  DeleteModal,
  ClearModal,
  AddItemNTEModal,
} from "./Modals";

export default function FridgeModal(props) {
  return (
    <ModalTemplate
      visible={props.modalState.visible}
      toggleModal={props.toggleModal}
    >
      {modalOption(props)}
    </ModalTemplate>
  );
}

function modalOption(props) {
  switch (props.modalState.option) {
    case "name":
      return (
        <NameModal
          changed={props.modalState.changed}
          onChangeText={props.onChangeText}
          toggleModal={props.toggleModal}
          onPress={props.setItemElement}
        />
      );
    case "type":
      return (
        <TypeModal
          newVal={props.modalState.newType}
          changed={props.modalState.changed}
          onChangeText={props.onChangeText}
          toggleModal={props.toggleModal}
          onPress={props.setItemElement}
        />
      );
    case "exp_date":
      return (
        <ExpDateModal
          newVal={props.modalState.newDate}
          changed={props.modalState.changed}
          onChangeText={props.onChangeText}
          toggleModal={props.toggleModal}
          onPress={props.setItemElement}
        />
      );
    case "add":
      return (
        <AddItemNTEModal
          newType={props.modalState.newType}
          newDate={props.modalState.newDate}
          changed={props.modalState.changed}
          onChangeText={props.onChangeText}
          toggleModal={props.toggleModal}
          onPress={props.addItem}
        />
      );
    case "delete":
      return (
        <DeleteModal
          changed={props.modalState.changed}
          toggleModal={props.toggleModal}
          onPress={props.deleteFridge}
        />
      );
    case "clear":
      return (
        <ClearModal
          changed={props.modalState.changed}
          toggleModal={props.toggleModal}
          onPress={props.clearFridge}
        />
      );
    default:
      return <View></View>;
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
