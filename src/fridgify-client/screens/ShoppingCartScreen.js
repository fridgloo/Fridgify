import React from "react";
import {
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { CheckBox } from "react-native-elements";
import * as SecureStore from "expo-secure-store";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunity from "react-native-vector-icons/MaterialCommunityIcons";

import ShoppingCartModal from "../components/modals/ShoppingCartModal";
import {
  formatDate,
  getExpirationColor,
  getItemType,
} from "../util/ScreenHelpers";

export default function ShoppingCartScreen({ navigation, route }) {
  // refactor state system
  const [state, setState] = React.useState({
    _id: "",
    items: [],
    display_items: [],
    filter: {},
    checked: [],
  });
  const [modal, setModal] = React.useState({
    visible: false,
    option: "",
    value: "",
    newName: "",
    newType: "",
    fridges: [],
  });
  const [changed, setChanged] = React.useState(false);

  React.useEffect(() => {
    if (route.params?.type === "INITIALIZE") {
      fillGlistState(route.params?.data);
    } else {
      fillGlistState(state);
    }
  }, [route.params?.data]);

  const fillGlistState = async (params) => {
    let token = await SecureStore.getItemAsync("user_token");
    const response = await fetch(
      `http://localhost:3200/v1/item/glist/${params._id}/${token}`,
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
        items: data.items,
        checked: [],
      }));
    }
  };

  const clearGlist = async () => {
    let token = await SecureStore.getItemAsync("user_token");
    await fetch(`http://localhost:3200/v1/item/glist/${token}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ glist: state._id, items: state.items }),
    }).then(() =>
      setState((prevState) => ({ ...prevState, items: [], checked: [] }))
    );
  };

  const addItem = async () => {
    let token = await SecureStore.getItemAsync("user_token");
    await fetch(`http://localhost:3200/v1/item/glist/${token}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [
          {
            name: modal.newName,
            type: modal.newType,
          },
        ],
        glist: state._id,
      }),
    }).then(() => fillGlistState(state));
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
    await fetch(`http://localhost:3200/v1/item/glist/${token}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ glist: state._id, items: [item] }),
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

  const submitToFridge = async (fridge_id) => {
    let token = await SecureStore.getItemAsync("user_token");
    await fetch(`http://localhost:3200/v1/glist/fridge/${token}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: state.checked,
        fridge: fridge_id,
        glist: state._id,
      }),
    }).then(() => {
      fillGlistState(state);
      setChanged(true);
    });
  };

  const loadSubmitModal = async () => {
    let token = await SecureStore.getItemAsync("user_token");
    await fetch(`http://localhost:3200/v1/fridge/${token}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => await res.json())
      .then(async (data) => {
        setModal((prevState) => ({
          ...prevState,
          visible: true,
          option: "submit",
          fridges: data.fridges,
        }));
      });
  };

  const checkItem = (item) => {
    const { checked } = state;

    if (!checked.includes(item)) {
      setState((prevState) => ({
        ...prevState,
        checked: [...prevState.checked, item],
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        checked: prevState.checked.filter((a) => a !== item),
      }));
    }
  };

  const onChangeText = (val, nestedOption) => {
    if (modal.option === "name") {
      setModal((prev) => ({
        ...prev,
        newName: val,
      }));
      setChanged(!(val === "" || val === modal.value.name));
    } else if (modal.option === "type") {
      setModal((prev) => ({
        ...prev,
        newType: val,
      }));
      setChanged(val !== modal.value.type);
    } else if (modal.option === "add") {
      if (nestedOption === "name") {
        setModal((prev) => ({
          ...prev,
          newName: val,
        }));
        setChanged(!(val === "" || val === modal.value.name));
      } else if (nestedOption === "type") {
        setModal((prev) => ({
          ...prev,
          newType: val,
        }));
      }
    }
  };

  const checkAll = () => {
    const resultArray = [];
    if (state.checked.length < state.items.length) {
      state.items.map((item) => {
        resultArray.push(item._id);
      });
    }
    setState((prevState) => ({
      ...prevState,
      checked: resultArray,
    }));
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
      <ShoppingCartModal
        modalState={modal}
        changed={changed}
        toggleModal={toggleModal}
        onChangeText={onChangeText}
        clearGlist={clearGlist}
        setItemElement={setItemElement}
        addItem={addItem}
        submitToFridge={submitToFridge}
      />

      <View
        style={{
          flex: 1,
          paddingLeft: 10,
          justifyContent: "flex-end",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            changed
              ? navigation.navigate("GlistHub", { data: state })
              : navigation.navigate("GlistHub");
          }}
        >
          <FontAwesome5 name={"chevron-left"} size={22} color={"black"} />
        </TouchableOpacity>
      </View>
      {/* --------------------------------Shopping Cart Header----------- */}
      <View
        style={{
          flex: 1.4,
          flexDirection: "row",
          paddingHorizontal: 25,
          paddingVertical: 4,
          alignItems: "center",
        }}
      >
        <View
          style={{
            flex: 3,
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 36,
              color: "#FF7F23",
            }}
          >
            Shopping Cart
          </Text>
          <View
            style={{
              paddingLeft: 10,
              justifyContent: "center",
            }}
          >
            <FontAwesome5 name={"shopping-cart"} size={25} color={"#FF7F23"} />
          </View>
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
            flex: 1.5,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingLeft: 15,
          }}
        >
          <TouchableOpacity>
            <MaterialCommunity name="grid" size={25} color={"#FF7F23"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => checkAll()}>
            <MaterialCommunity name="check-all" size={25} color={"#FF7F23"} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setModal((prevState) => ({
                ...prevState,
                visible: true,
                option: "clear",
              }));
              setChanged(true);
            }}
          >
            <MaterialCommunity
              name="playlist-remove"
              size={35}
              color={"#FF7F23"}
            />
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
        <View style={{ flex: 0.1, paddingLeft: 10 }} />
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
      </View>
      {/* --------------------------------Food List-------------------------------------------- */}
      <View
        style={{
          flex: 14,
        }}
      >
        <SwipeListView
          data={
            state.search === ""
              ? state.items
              : state.items.filter((item) =>
                  item.name.toLowerCase().includes(state.search.toLowerCase())
                )
          }
          extraData={state.checked}
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
                    flex: 0.1,
                  }}
                >
                  <CheckBox
                    right
                    checked={state.checked.includes(data.item._id)}
                    onPress={() => checkItem(data.item._id)}
                    checkedColor={"#2D82FF"}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    paddingLeft: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setModal((prevState) => ({
                        ...prevState,
                        visible: true,
                        option: "name",
                        value: data.item,
                        newName: "",
                      }));
                      setChanged(false);
                    }}
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
                    onPress={() => {
                      setModal((prevState) => ({
                        ...prevState,
                        visible: true,
                        option: "type",
                        value: data.item,
                        newType: "",
                      }));
                      setChanged(false);
                    }}
                  >
                    <FontAwesome5
                      name={getItemType(data.item.type)}
                      size={20}
                    />
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
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "yellow",
        }}
      >
        <View
          style={{
            width: "50%",
            borderRightWidth: 0.5,
            borderColor: "#CBCBCB",
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#FF7F23",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
            onPress={() =>
              setModal((prevState) => ({
                ...prevState,
                visible: true,
                option: "add",
                newValue: "",
                newType: "",
              }))
            }
          >
            <Text style={{ fontSize: 20, color: "white" }}>Add Item</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: "50%",
            borderLeftWidth: 0.5,
            borderColor: "#CBCBCB",
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor:
                state.checked.length === 0 ? "#FFAD71" : "#FF7F23",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
            onPress={() => loadSubmitModal()}
            disabled={state.checked.length === 0}
          >
            <Text style={{ fontSize: 20, color: "white" }}>Submit To...</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
