import React from "react";
import {
  TouchableOpacity,
  TouchableHighlight,
  Picker,
  TextInput,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SwipeListView } from "react-native-swipe-list-view";
import * as SecureStore from "expo-secure-store";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import FridgeModal from "../components/modals/FridgeModal";
import {
  formatDate,
  getExpirationColor,
  getItemType,
} from "../util/ScreenHelpers";

export default function FridgeScreen({ navigation, route }) {
  const [state, setState] = React.useState({
    _id: "",
    name: "",
    created: "",
    primary: false,
    changed: false,
    items: [],
    search: "",
    filter: {},
  });
  const [modal, setModal] = React.useState({
    visible: false,
    option: "",
    value: "",
    newName: "",
    newType: "",
    newDate: new Date(),
    changed: false,
  });

  React.useEffect(() => {
    if (route.params?.type === "INITIALIZE") {
      fillFridgeState(route.params?.data);
    } else {
      fillFridgeState(state);
    }
  }, [route.params?.data]);

  const fillFridgeState = async (params) => {
    let token = await SecureStore.getItemAsync("user_token");
    const response = await fetch(
      `http://localhost:3200/v1/item/fridge/${params._id}/${token}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      setState((prev) => ({
        ...prev,
        _id: params._id,
        name: params.name,
        created: params.created,
        primary: params.primary,
        items: data.items,
      }));
    }
  };

  const deleteFridge = async () => {
    let token = await SecureStore.getItemAsync("user_token");
    await fetch(`http://localhost:3200/v1/fridge/${token}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: state._id }),
    }).then(() =>
      navigation.navigate("FridgeHub", { data: state._id, type: "DELETE" })
    );
  };

  const clearFridge = async () => {
    let token = await SecureStore.getItemAsync("user_token");
    await fetch(`http://localhost:3200/v1/item/fridge/${token}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fridge: state._id, items: state.items }),
    }).then(() => setState((prevState) => ({ ...prevState, items: [] })));
  };

  const addItem = async () => {
    let token = await SecureStore.getItemAsync("user_token");
    await fetch(`http://localhost:3200/v1/item/fridge/${token}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          name: modal.newName,
          type: modal.newType,
          exp_date: modal.newDate,
          bought_date: new Date(),
        },
        fridge: state._id,
      }),
    }).then(() => fillFridgeState(state));
    // .then((response) => response.json())
    // .then((data) => {
    //     setState((prevState) => ({
    //       ...prevState,
    //       items: [...prevState.items, data.item],
    //     }));
    //   });
  };

  // const addItem = async (data) => {
  //   let token = await SecureStore.getItemAsync("user_token");
  //   await fetch(`http://localhost:3200/v1/item/fridge/${token}`, {
  //     method: "POST",
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ data: data, fridge: state._id }),
  //   }).then(() => fillFridgeState(state));
  //   // .then((response) => response.json())
  //   // .then((data) => {
  //   //     setState((prevState) => ({
  //   //       ...prevState,
  //   //       items: [...prevState.items, data.item],
  //   //     }));
  //   //   });
  // };

  const setItemPrimary = async () => {
    let token = await SecureStore.getItemAsync("user_token");
    await fetch(`http://localhost:3200/v1/fridge/${token}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: { primary: true }, _id: state._id }),
    }).then(() =>
      setState((prevState) => ({ ...prevState, primary: true, changed: true }))
    );
  };

  const setItemElement = async () => {
    const value =
      modal.option === "name"
        ? modal.newName
        : modal.option === "type"
        ? modal.newType
        : modal.newDate;
    let token = await SecureStore.getItemAsync("user_token");
    await fetch(`http://localhost:3200/v1/item/${token}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: { [modal.option]: value },
        _id: modal.value._id,
      }),
    }).then((res) => {
      if (res.ok) {
        const itemIndex = state.items.findIndex(
          (element) => element._id == modal.value._id
        );
        let newArray = [...state.items];
        newArray[itemIndex] = {
          ...newArray[itemIndex],
          [modal.option]: value,
        };
        setState((prevState) => ({
          ...prevState,
          items: newArray,
        }));
      }
    });
  };

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteItem = async (item) => {
    let token = await SecureStore.getItemAsync("user_token");
    await fetch(`http://localhost:3200/v1/item/fridge/${token}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fridge: state._id, items: [item] }),
    }).then(() => {
      const itemIndex = state.items.findIndex(
        (element) => element._id == item._id
      );
      let newArray = [...state.items];
      newArray.splice(itemIndex, 1);
      setState((prevState) => ({
        ...prevState,
        items: newArray,
      }));
    });
  };

  const onChangeText = (val, nestedOption) => {
    if (modal.option === "name") {
      setModal((prev) => ({
        ...prev,
        newName: val,
        changed: val === "" || val === modal.value.name ? false : true,
      }));
    } else if (modal.option === "type") {
      setModal((prev) => ({
        ...prev,
        newType: val,
        changed: val === modal.value.type ? false : true,
      }));
    } else if (modal.option === "exp_date") {
      setModal((prev) => ({
        ...prev,
        newDate: val,
        changed: formatDate(val) !== formatDate(modal.value.exp_date),
      }));
    } else if (modal.option === "add") {
      if (nestedOption === "name") {
        setModal((prev) => ({
          ...prev,
          newName: val,
          changed: val === "" || val === modal.value.name ? false : true,
        }));
      } else if (nestedOption === "type") {
        setModal((prev) => ({
          ...prev,
          newType: val,
        }));
      } else if (nestedOption === "exp_date") {
        setModal((prev) => ({
          ...prev,
          newDate: val,
        }));
      }
    }
  };

  const toggleModal = () => {
    setModal((prev) => ({
      ...prev,
      visible: !prev.visible,
    }));
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <FridgeModal
        modalState={modal}
        toggleModal={toggleModal}
        onChangeText={onChangeText}
        deleteFridge={deleteFridge}
        clearFridge={clearFridge}
        setItemElement={setItemElement}
        addItem={addItem}
      />

      <View
        style={{
          flex: 1,
          paddingLeft: 10,
          justifyContent: "flex-end",
        }}
      >
        <TouchableOpacity
          onPress={() =>
            modal.changed
              ? navigation.navigate("FridgeHub", { data: state._id })
              : navigation.navigate("FridgeHub")
          }
        >
          <FontAwesome5 name={"chevron-left"} size={22} color={"#2D82FF"} />
        </TouchableOpacity>
      </View>
      {/* --------------------------------Fridge Name / DefaultOrNot / DropDown Menu----------- */}
      <View
        style={{
          flex: 1.4,
          flexDirection: "row",
          paddingHorizontal: 25,
          paddingVertical: 8,
          alignItems: "center",
        }}
      >
        <View
          style={{
            flex: 3,
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: state.name.length > 8 ? 25 : 40,
              color: "#2D82FF",
            }}
          >
            {state.name}
          </Text>
          <View
            style={{
              paddingLeft: 10,
              justifyContent: "center",
            }}
          >
            {state.primary ? (
              <FontAwesome5
                name={"igloo"}
                size={state.name.length > 8 ? 26 : 36}
                color={"black"}
              />
            ) : (
              <Text />
            )}
          </View>
        </View>

        <View
          style={{
            flex: 1.4,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <TouchableOpacity
            onPress={() => setItemPrimary()}
            disabled={state.primary}
          >
            <FontAwesome
              name={"star"}
              size={25}
              color={state.primary ? "#A7CBFF" : "#2D82FF"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setModal((prevState) => ({
                ...prevState,
                visible: true,
                option: "delete",
                changed: true,
              }))
            }
          >
            <FontAwesome5 name={"trash"} size={25} color={"#2D82FF"} />
          </TouchableOpacity>
        </View>
      </View>
      {/* --------------------------------List Options (Search, Clear List)-------------------- */}
      <View
        style={{
          flex: 1.6,
          flexDirection: "row",
          alignItems: "center",
          borderColor: "#CBCBCB",
          paddingHorizontal: 25,
          paddingBottom: 5,
        }}
      >
        <View
          style={{
            flex: 3,
            flexDirection: "row",
            paddingHorizontal: 10,
            paddingVertical: 10,
            alignItems: "center",
            justifyContent: "space-between",
            borderWidth: 1,
            borderColor: "#CBCBCB",
            borderRadius: 15,
          }}
        >
          <View
            style={{
              flex: 10,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <FontAwesome5
              style={{
                paddingRight: 10,
              }}
              name={"search"}
              size={15}
            />
            <TextInput
              style={{
                width: "90%",
                fontSize: 15,
              }}
              numberOfLines={1}
              placeholder={"search item..."}
              value={state.search}
              onChangeText={(text) =>
                setState((prevState) => ({ ...prevState, search: text.trim() }))
              }
            />
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            <TouchableOpacity
              disabled={state.search === ""}
              onPress={() =>
                setState((prevState) => ({
                  ...prevState,
                  search: "",
                }))
              }
            >
              <FontAwesome name={"times-circle"} size={16} />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#2D82FF",
              borderRadius: 12,
              padding: 5,
              width: "80%",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() =>
              setModal((prevState) => ({
                ...prevState,
                visible: true,
                option: "clear",
                changed: true,
              }))
            }
          >
            <Text
              numberOfLines={1}
              style={{
                fontSize: 12,
                color: "white",
              }}
            >
              Clear List
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* --------------------------------List Labels------------------------------------------ */}
      <View
        style={{
          flex: 0.8,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 25,
          borderColor: "#CBCBCB",
          borderBottomWidth: 0.5,
        }}
      >
        <View
          style={{
            flex: 1,
            paddingRight: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              const items = state.items;
              items.sort((a, b) =>
                a.name > b.name
                  ? state.filter.name
                    ? -1
                    : 1
                  : b.name > a.name
                  ? state.filter.name
                    ? 1
                    : -1
                  : 0
              );
              setState((prevState) => ({
                ...prevState,
                items: items,
                filter: {
                  name: !prevState.filter.name,
                },
              }));
            }}
          >
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <Text
                style={{ fontSize: 14, paddingRight: 5, fontWeight: "500" }}
              >
                Name
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 0.2,
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              const items = state.items;
              items.sort((a, b) =>
                a.type > b.type
                  ? state.filter.type
                    ? -1
                    : 1
                  : b.type > a.type
                  ? state.filter.type
                    ? 1
                    : -1
                  : 0
              );
              setState((prevState) => ({
                ...prevState,
                items: items,
                filter: {
                  type: !prevState.filter.type,
                },
              }));
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "500" }}>Type</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 0.1,
            alignItems: "center",
          }}
        ></View>
        <View
          style={{
            flex: 0.45,
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              const items = state.items;
              items.sort((a, b) =>
                a.exp_date > b.exp_date
                  ? state.filter.exp_date
                    ? -1
                    : 1
                  : b.exp_date > a.exp_date
                  ? state.filter.exp_date
                    ? 1
                    : -1
                  : 0
              );
              setState((prevState) => ({
                ...prevState,
                items: items,
                filter: {
                  exp_date: !prevState.filter.exp_date,
                },
              }));
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "500" }}>Expiration</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* --------------------------------Food List-------------------------------------------- */}
      <View
        style={{
          flex: 14,
        }}
      >
        <SwipeListView
          useFlatList={true}
          data={
            state.search === ""
              ? state.items
              : state.items.filter((item) =>
                  item.name.toLowerCase().includes(state.search.toLowerCase())
                )
          }
          renderItem={(data, rowMap) => (
            <View
              style={{
                borderColor: "#CBCBCB",
                borderBottomWidth: 1,
                borderTopWidth: data.index === 0 ? 0.5 : 0,
                backgroundColor: "white",
                width: Math.round(Dimensions.get("window").width),
                height: 60,
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 25,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    paddingRight: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      setModal({
                        visible: true,
                        option: "name",
                        value: data.item,
                        newDate: new Date(),
                        newName: "",
                        changed: false,
                      })
                    }
                  >
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 17,
                      }}
                    >
                      {data.item.name}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flex: 0.2,
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      setModal({
                        visible: true,
                        option: "type",
                        value: data.item,
                        newDate: new Date(),
                        newName: data.item.type,
                        changed: false,
                      })
                    }
                  >
                    <FontAwesome5
                      name={getItemType(data.item.type)}
                      size={20}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flex: 0.1,
                    alignItems: "center",
                  }}
                >
                  <FontAwesome
                    name={"circle"}
                    color={getExpirationColor(data.item.exp_date)}
                  />
                </View>
                <View
                  style={{
                    flex: 0.45,
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      setModal({
                        visible: true,
                        option: "exp_date",
                        value: data.item,
                        newDate: data.item.exp_date
                          ? new Date(data.item.exp_date)
                          : new Date(),
                        newName: "",
                        changed: data.item.exp_date ? false : true,
                      })
                    }
                  >
                    {data.item.exp_date ? (
                      <Text numberOfLines={1}>
                        {formatDate(data.item.exp_date)}
                      </Text>
                    ) : (
                      <View style={{}}>
                        <FontAwesome name={"calendar-o"} size={24} />
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          renderHiddenItem={(data, rowMap) => (
            <View
              style={{
                alignItems: "center",
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                paddingLeft: 15,
                borderBottomColor: "#CBCBCB",
                borderBottomWidth: 1,
                backgroundColor: "red",
              }}
            >
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  bottom: 0,
                  justifyContent: "center",
                  position: "absolute",
                  top: 0,
                  width: 75,
                  backgroundColor: "red",
                  right: 0,
                }}
                onPress={() => {
                  closeRow(rowMap, data.index);
                  deleteItem(data.item);
                }}
              >
                <Text
                  style={{
                    color: "white",
                  }}
                >
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          )}
          rightOpenValue={-75}
          onRowOpen={(rowKey, rowMap) => {
            setTimeout(() => {
              closeRow(rowMap, rowKey);
            }, 2000);
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      {/* --------------------------------Add Item--------------------------------------------- */}
      <View
        style={{
          flex: 1.5,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "#2D82FF",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#2D82FF",
            height: "100%",
            width: "100%",
          }}
          onPress={() =>
            setModal((prevState) => ({
              ...prevState,
              visible: true,
              option: "add",
              newName: "",
              newDate: new Date(),
              newType: "",
            }))
          }
        >
          <Text style={{ fontSize: 20, color: "white" }}>Add Item</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  addFridgeEnabled: {
    borderWidth: 5,
    borderColor: "#0771ED",
    borderRadius: 50,
    width: "30%",
    height: "80%",
    backgroundColor: "#2D82FF",
    justifyContent: "center",
    alignItems: "center",
  },
  addFridgeDisabled: {
    borderWidth: 5,
    borderColor: "#7DADE5",
    borderRadius: 50,
    width: "30%",
    height: "80%",
    backgroundColor: "#85B2E6",
    justifyContent: "center",
    alignItems: "center",
  },
});
