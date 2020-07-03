import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import {
  ModalTemplate,
  NameModal,
  TypeModal,
  ClearModal,
  AddItemNTModal,
  SubmitToModal,
} from "./Modals";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

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
    case "submit":
      return (
        <SubmitToModal numFridges={props.modalState.fridges.length}>
          {props.modalState.fridges.map((fridge, index) => {
            return (
              <View
                style={{
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                key={index}
              >
                <TouchableOpacity
                  style={{
                    height: 50,
                    width: "90%",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: 2,
                    borderColor: "#FF7F23",
                    borderWidth: 1,
                    borderRadius: 12,
                  }}
                  onPress={() => {
                    props.submitToFridge(fridge._id);
                    props.toggleModal();
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>{fridge.name}</Text>
                    {fridge.primary ? (
                      <FontAwesome5
                        style={{ paddingLeft: 5 }}
                        name={"igloo"}
                        size={14}
                        color={"black"}
                      />
                    ) : (
                      <View />
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </SubmitToModal>
      );
    default:
      return <View></View>;
  }
}
