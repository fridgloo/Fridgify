import React, { useState } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import { ModalTemplate } from "./Modals";
import { Confirmation, Cancel, Save } from "./ModalComponents";

export default function FridgeHubModal({ visible, toggleModal, handleSubmit }) {
  const [text, onChangeText] = useState("");
  return (
    <ModalTemplate visible={visible} toggleModal={toggleModal}>
      <View style={styles.container}>
        <TextInput
          style={styles.nameInput}
          numberOfLines={1}
          placeholder={"Fridge Name..."}
          onChangeText={(text) => onChangeText(text)}
        />
        <Confirmation>
          <Cancel toggleModal={toggleModal}>Cancel</Cancel>
          <Save
            onPress={() => {
              onChangeText("");
              handleSubmit(text);
            }}
            toggleModal={toggleModal}
            changed={true}
          >
            Add Fridge
          </Save>
        </Confirmation>
      </View>
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
