import React from "react";
import {
  TouchableOpacity,
  TouchableHighlight,
  FlatList,
  Button,
  TextInput,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
} from "react-native";
import Modal from "react-native-modal";
import { Picker } from "@react-native-community/picker";
import { SwipeListView } from "react-native-swipe-list-view";
import * as SecureStore from "expo-secure-store";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function FridgeScreen({ navigation, route }) {
  const [state, setState] = React.useState({
    id: "",
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
    style: "",
    value: "",
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
      `http://localhost:3200/v1/item/fridge/${params.id}/${token}`,
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
        id: params.id,
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
      body: JSON.stringify({ id: state.id }),
    }).then(() =>
      navigation.navigate("FridgeHub", { data: state.id, type: "DELETE" })
    );
  };

  const clearFridge = async () => {
    let token = await SecureStore.getItemAsync("user_token");
    await fetch(`http://localhost:3200/v1/fridge/${token}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: { items: [] }, id: state.id }),
    })
      .then(
        async () =>
          await fetch(`http://localhost:3200/v1/item/fridge/${token}`, {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ fridge: state.id, items: state.items }),
          })
      )
      .then(() => setState((prevState) => ({ ...prevState, items: [] })));
  };

  const setPrimary = async () => {
    let token = await SecureStore.getItemAsync("user_token");
    await fetch(`http://localhost:3200/v1/fridge/${token}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: { primary: true }, id: state.id }),
    }).then(() =>
      setState((prevState) => ({ ...prevState, primary: true, changed: true }))
    );
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
      body: JSON.stringify({ fridge: state.id, items: item }),
    }).then(() => fillFridgeState(state));
  };

  const formatDate = (date) => {
    date = new Date(date);
    let month = "" + (date.getMonth() + 1);
    let day = "" + date.getDate();
    const year = date.getFullYear();

    if (month.length < 2) {
      month = "0" + month;
    }
    if (day.length < 2) {
      day = "0" + day;
    }

    return [month, day, year].join("/");
  };

  const getExpirationColor = (date) => {
    if (!date) {
      return "#CBCBCB";
    }
    date = new Date(date);
    if (date < Date.now()) {
      return "red";
    } else {
      if ((date - Date.now()) / (1000 * 60 * 60 * 24) <= 3) {
        return "orange";
      } else {
        return "green";
      }
    }
  };

  const getItemType = (type) => {
    switch (type.toLowerCase()) {
      case "meat":
        return "drumstick-bite";
      case "vegetable":
        return "carrot";
      case "fruit":
        return "apple-alt";
      default:
        return "question";
    }
  };

  const toggleModal = (style) => {
    setModal((prev) => ({
      ...prev,
      visible: !prev.visible,
    }));
  };

  console.log("TEST");

  const loadModalByOption = (option, value) => {
    let newValue = "";
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: "80%",
            height: "15%",
            backgroundColor: "white",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <View
            style={{
              width: "80%",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#CBCBCB",
              paddingHorizontal: 10,
              paddingVertical: 6,
              flexDirection: "row",
            }}
          >
            {option === "name" ? (
              <TextInput
                style={{
                  fontSize: 16,
                }}
                numberOfLines={1}
                placeholder={value}
                onChangeText={(val) => (newValue = val)}
              />
            ) : option === "type" ? (
              <Picker
                style={{ height: 50, width: 100 }}
                selectedValue={newValue}
                onValueChange={(itemValue, itemIndex) => (newValue = itemValue)}
              >
                <Picker.Item label="Meat" value="meat" />
                <Picker.Item label="Fruit" value="fruit" />
                <Picker.Item label="Vegetable" value="vegetable" />
              </Picker>
            ) : (
              ""
            )}
          </View>
          <View
            style={{
              width: "80%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                backgroundColor: "#2D82FF",
                borderRadius: 16,
                width: "45%",
              }}
            >
              <TouchableOpacity
                style={{
                  padding: 5,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 16, color: "white" }}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                backgroundColor: "#2D82FF",
                borderRadius: 16,
                width: "45%",
              }}
            >
              <TouchableOpacity
                style={{
                  padding: 5,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 16, color: "white" }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <View>
        <Modal isVisible={modal.visible}>
          {loadModalByOption(modal.style, modal.value)}
        </Modal>
      </View>
      <View
        style={{
          flex: 1,
          paddingLeft: 10,
          justifyContent: "flex-end",
        }}
      >
        <TouchableOpacity
          onPress={() =>
            state.changed
              ? navigation.navigate("FridgeHub", { data: state.id })
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
              fontSize: 44,
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
              <FontAwesome5 name={"igloo"} size={36} color={"black"} />
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
            onPress={() => setPrimary()}
            disabled={state.primary}
          >
            <FontAwesome
              name={"star"}
              size={25}
              color={state.primary ? "#A7CBFF" : "#2D82FF"}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteFridge()}>
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
            onPress={() => clearFridge()}
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
                        style: "name",
                        value: data.item.name,
                      })
                    }
                  >
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 16,
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
                        style: "type",
                        value: data.item.type,
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
                    alignItems: "flex-start",
                  }}
                >
                  <TouchableOpacity>
                    <Text numberOfLines={1} style={{}}>
                      {data.item.exp_date ? formatDate(data.item.exp_date) : ""}
                    </Text>
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
                  deleteItem([data.item]);
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
            navigation.navigate("AddItemFromFridgeModal", { fridge: state.id })
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
