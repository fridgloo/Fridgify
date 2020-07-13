import React, { useState } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import { ModalTemplate, NameModal, SendModal } from "./Modals";
import { Confirmation, Cancel, Save } from "./ModalComponents";

export default function HubModal({
  modalState,
  toggleModal,
  handleSubmit,
  handleSend,
  container,
}) {
  const [state, setState] = useState({
    name: "",
  });

  const onChangeText = (value, option) => {
    setState((prevState) => ({
      ...prevState,
      [option]: value,
    }));
  };

  const modalOption = () => {
    switch (modalState.option) {
      case "name":
        return (
          <NameModal
            newVal={state.name}
            onChangeText={onChangeText}
            toggleModal={toggleModal}
            onPress={() => handleSubmit(state.name)}
            saveMessage={`Add ${container}`}
          >
            Enter {container} Name:
          </NameModal>
        );
      case "send":
        return (
          <SendModal
            toggleModal={toggleModal}
            onPress={() => handleSend(modalState.value)}
          />
        );
      default:
        return <View></View>;
    }
  };

  return (
    <ModalTemplate visible={modalState.visible} toggleModal={toggleModal}>
      {modalOption()}
    </ModalTemplate>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "80%",
    backgroundColor: "white",
    alignItems: "center",
    borderRadius: 12,
  },
  nameInput: {
    fontSize: 16,
    width: "90%",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CBCBCB",
    padding: 10,
    margin: 20,
  },
});
