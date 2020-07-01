import React from "react";
import { StyleSheet, View } from "react-native";
import {
  ModalTemplate,
  NameModal,
  TypeModal,
  DeleteModal,
  ClearModal,
  AddItemNTModal,
} from "./Modals";

export default function ShoppingCartModal(props) {
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
          changed={props.changed}
          onChangeText={props.onChangeText}
          toggleModal={props.toggleModal}
          onPress={props.setItemElement}
        />
      );
    case "type":
      return (
        <TypeModal
          newVal={props.modalState.newType}
          changed={props.changed}
          onChangeText={props.onChangeText}
          toggleModal={props.toggleModal}
          onPress={props.setItemElement}
        />
      );
    case "add":
      return (
        <AddItemNTModal
          newType={props.modalState.newType}
          changed={props.changed}
          onChangeText={props.onChangeText}
          toggleModal={props.toggleModal}
          onPress={props.addItem}
        />
      );
    case "clear":
      return (
        <ClearModal
          changed={props.changed}
          toggleModal={props.toggleModal}
          onPress={props.clearGlist}
        />
      );
    default:
      return <View></View>;
  }
}