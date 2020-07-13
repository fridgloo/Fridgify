import React, { useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import {
  ModalTemplate,
  NameModal,
  TypeModal,
  ExpDateModal,
  PrimaryModal,
  DeleteModal,
  ClearModal,
  AddItemNTEModal,
  AddItemNTModal,
  SendModal,
  SubmitToModal,
} from "./Modals";
import { FontAwesome5 } from "@expo/vector-icons";

export default function ScreenModal({
  modalState,
  toggleModal,
  setItemElement,
  addItem,
  setPrimary,
  deleteContainer,
  clearContainer,
  sendToCart,
  submitToFridge,
  container,
}) {
  const [state, setState] = useState({
    name: "",
    type: "",
    exp_date: null,
  });

  useEffect(() => {
    if (
      modalState.visible &&
      (modalState.option === "exp_date" || modalState.option === "type")
    ) {
      const { option, value } = modalState;
      let newValue = value[option];
      if (option === "exp_date") {
        if (newValue !== null) {
          newValue = new Date(newValue);
        }
      }
      setState((prevState) => ({
        ...prevState,
        [option]: newValue,
      }));
    } else {
      onCancel();
    }
  }, [modalState.visible]);

  const onChangeText = (val, option) => {
    setState((prevState) => ({
      ...prevState,
      [option]: val,
    }));
  };

  const onCancel = () => {
    setState({
      name: "",
      type: "",
      exp_date: null,
    });
  };

  const modalOption = () => {
    switch (modalState.option) {
      case "name":
        return (
          <NameModal
            newVal={state.name}
            onChangeText={onChangeText}
            toggleModal={(a, b) => {
              toggleModal(a, b);
              onCancel();
            }}
            onPress={() => setItemElement(state.name)}
            saveMessage={"Save"}
          />
        );
      case "type":
        return (
          <TypeModal
            newVal={state.type}
            onChangeText={onChangeText}
            toggleModal={(a, b) => {
              toggleModal(a, b);
              onCancel();
            }}
            onPress={() => setItemElement(state.type)}
          />
        );
      case "exp_date":
        return (
          <ExpDateModal
            newVal={state.exp_date}
            onChangeText={onChangeText}
            toggleModal={(a, b) => {
              toggleModal(a, b);
              onCancel();
            }}
            onPress={() => setItemElement(state.exp_date)}
          />
        );
      case "add_nte":
        return (
          <AddItemNTEModal
            newName={state.name}
            newType={state.type}
            newDate={state.exp_date}
            onChangeText={onChangeText}
            toggleModal={(a, b) => {
              toggleModal(a, b);
              onCancel();
            }}
            onPress={() =>
              addItem({
                name: state.name,
                type: state.type,
                exp_date: state.exp_date,
              })
            }
          />
        );
      case "add_nt":
        return (
          <AddItemNTModal
            newName={state.name}
            newType={state.type}
            onChangeText={onChangeText}
            toggleModal={(a, b) => {
              toggleModal(a, b);
              onCancel();
            }}
            onPress={() =>
              addItem([
                {
                  name: state.name,
                  type: state.type,
                },
              ])
            }
          />
        );
      case "primary":
        return (
          <PrimaryModal
            toggleModal={(a, b) => {
              toggleModal(a, b);
              onCancel();
            }}
            onPress={setPrimary}
          />
        );
      case "delete":
        return (
          <DeleteModal
            toggleModal={(a, b) => {
              toggleModal(a, b);
              onCancel();
            }}
            onPress={deleteContainer}
            container={container}
          />
        );
      case "clear":
        return (
          <ClearModal
            toggleModal={(a, b) => {
              toggleModal(a, b);
              onCancel();
            }}
            onPress={clearContainer}
          />
        );
      case "send":
        return <SendModal toggleModal={toggleModal} onPress={sendToCart} />;
      case "submit":
        return (
          <SubmitToModal numFridges={modalState.fridges.length}>
            {modalState.fridges.map((fridge, index) => {
              return (
                <View style={styles.submitContainer} key={index}>
                  <TouchableOpacity
                    style={styles.fridge}
                    onPress={() => {
                      submitToFridge(fridge._id);
                      toggleModal("", "");
                    }}
                  >
                    <View style={styles.fridgeHeader}>
                      <Text numberOfLines={1} style={styles.fridgeName}>
                        {fridge.name}
                      </Text>
                      {fridge.primary ? (
                        <FontAwesome5
                          style={styles.fridgeIgloo}
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
  };

  return (
    <ModalTemplate
      visible={modalState.visible}
      toggleModal={(a, b) => {
        toggleModal(a, b);
        onCancel();
      }}
      onCancel={onCancel}
    >
      {modalOption()}
    </ModalTemplate>
  );
}

const styles = StyleSheet.create({
  submitContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  fridge: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    borderColor: "#FF7F23",
    borderWidth: 1,
    borderRadius: 12,
  },
  fridgeHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  fridgeName: {
    fontSize: 16,
    paddingVertical: 20,
  },
  fridgeIgloo: {
    paddingLeft: 5,
  },
});
