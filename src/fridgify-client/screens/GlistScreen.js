import React from "react";
import {
  TouchableOpacity,
  TouchableHighlight,
  Picker,
  Button,
  TextInput,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
} from "react-native";
import Modal from "react-native-modal";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SwipeListView } from "react-native-swipe-list-view";
import * as SecureStore from "expo-secure-store";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunity from "react-native-vector-icons/MaterialCommunityIcons";

export default function GlistScreen({ navigation, route }) {
  const [state, setState] = React.useState({
    _id: "",
    name: "",
    created: "",
    changed: false,
    items: [],
    search: "",
    filter: {},
  });
  const [modal, setModal] = React.useState({
    visible: false,
    style: "",
    value: "",
    newValue: "",
    newType: "",
    newDate: new Date(),
    changed: false,
  });

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
        name: params.name,
        created: params.created,
        items: data.items,
      }));
    }
  };

  const deleteGlist = async () => {
    let token = await SecureStore.getItemAsync("user_token");
    await fetch(`http://localhost:3200/v1/glist/${token}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: state._id }),
    }).then(() =>
      navigation.navigate("GlistHub", { data: state._id, type: "DELETE" })
    );
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
    }).then(() => setState((prevState) => ({ ...prevState, items: [] })));
  };

  const addItem = async (data) => {
    let token = await SecureStore.getItemAsync("user_token");
    await fetch(`http://localhost:3200/v1/item/glist/${token}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: { items: data }, glist: state._id }),
    }).then(() => {
      fillGlistState(state);
      setModal((prevState) => ({
        ...prevState,
        changed: true,
      }));
    });
    // .then((response) => response.json())
    // .then((data) => {
    //     setState((prevState) => ({
    //       ...prevState,
    //       items: [...prevState.items, data.item],
    //     }));
    //   });
  };

  const setItemElement = async (option, value, id) => {
    let token = await SecureStore.getItemAsync("user_token");
    await fetch(`http://localhost:3200/v1/item/${token}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: { [option]: value }, _id: id }),
    }).then(() => {
      const itemIndex = state.items.findIndex((element) => element._id == id);
      let newArray = [...state.items];
      newArray[itemIndex] = { ...newArray[itemIndex], [option]: value };
      setState((prevState) => ({
        ...prevState,
        items: newArray,
      }));
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
      setModal((prevState) => ({
        ...prevState,
        changed: true,
      }));
    });
  };

  const submitToFridge = async () => {
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
        await fetch(`http://localhost:3200/v1/glist/fridge/${token}`, {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: state.items,
            fridge: data.fridges[0]._id,
            glist: state._id,
          }),
        });
      })
      .then(() => {
        fillGlistState(state);
        setModal((prevState) => ({
          ...prevState,
          changed: true,
        }));
      });
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
    switch (type?.toLowerCase()) {
      case "meat":
        return "drumstick-bite";
      case "vegetable":
        return "carrot";
      case "fruit":
        return "apple-alt";
      case "fish":
        return "fish";
      default:
        return "question";
    }
  };

  const toggleModal = () => {
    setModal((prev) => ({
      ...prev,
      visible: !prev.visible,
    }));
  };

  const loadAddItem = () => {
    return (
      <View
        style={{
          width: "80%",
          height: "30%",
          backgroundColor: "white",
          alignItems: "center",
          justifyContent: "space-evenly",
          borderRadius: 12,
        }}
      >
        <View
          style={{
            flex: 1,
            width: "90%",
            justifyContent: "center",
          }}
        >
          <Text style={{ paddingBottom: 10, fontSize: 16 }}>
            Name (required):
          </Text>
          <View
            style={{
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#CBCBCB",
              paddingHorizontal: 10,
              paddingVertical: 10,
            }}
          >
            <TextInput
              style={{
                fontSize: 16,
              }}
              numberOfLines={1}
              placeholder={"Name..."}
              onChangeText={(val) =>
                setModal((prev) => ({
                  ...prev,
                  newValue: val,
                }))
              }
            />
          </View>
        </View>
        <View
          style={{
            flex: 1,
            width: "90%",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 16 }}>Type:</Text>

          <Picker
            selectedValue={modal.newType}
            itemStyle={{
              height: 88,
              fontSize: 16,
            }}
            onValueChange={(val) => {
              if (val !== "0") {
                setModal((prev) => ({
                  ...prev,
                  newType: val,
                }));
              }
            }}
          >
            <Picker.Item
              label={"Scroll to a type..."}
              value={"0"}
              color={"#CBCBCB"}
            />
            <Picker.Item label={"Fish"} value={"fish"} />
            <Picker.Item label={"Fruit"} value={"fruit"} />
            <Picker.Item label={"Meat"} value={"meat"} />
            <Picker.Item label={"Vegetable"} value={"vegetable"} />
          </Picker>
        </View>
        <View
          style={{
            width: "100%",
            height: 50,
            flexDirection: "row",
            justifyContent: "space-between",
            borderTopColor: "#CBCBCB",
            borderTopWidth: 1,
          }}
        >
          <View
            style={{
              width: "50%",
              backgroundColor: "white",
              justifyContent: "center",
              borderBottomStartRadius: 12,
            }}
          >
            <TouchableOpacity
              style={{
                padding: 5,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={toggleModal}
            >
              <Text style={{ fontSize: 16, color: "#2D82FF" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: modal.newValue === "" ? "#A7CBFF" : "#2D82FF",
              width: "50%",
              justifyContent: "center",
              borderBottomEndRadius: 12,
            }}
          >
            <TouchableOpacity
              style={{
                padding: 5,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                addItem([
                  {
                    name: modal.newValue,
                    type: modal.newType,
                    exp_date: modal.newDate,
                    bought_date: new Date(),
                  },
                ]);
                toggleModal();
              }}
              disabled={modal.newValue === ""}
            >
              <Text style={{ fontSize: 16, color: "white" }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const loadModalByOption = (option, value) => {
    return (
      <View
        style={{
          width: "80%",
          height: option === "exp_date" ? "32%" : "15%",
          backgroundColor: "white",
          alignItems: "center",
          borderRadius: 12,
        }}
      >
        <View
          style={{
            flex: 1,
            width: "90%",
            justifyContent: "center",
          }}
        >
          {option === "name" ? (
            <View
              style={{
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#CBCBCB",
                paddingHorizontal: 10,
                paddingVertical: 5,
              }}
            >
              <TextInput
                style={{
                  fontSize: 16,
                }}
                numberOfLines={1}
                placeholder={value.name}
                onChangeText={(val) =>
                  setModal((prev) => ({
                    ...prev,
                    newValue: val,
                    changed: val === "" || val === value.name ? false : true,
                  }))
                }
              />
            </View>
          ) : option === "type" ? (
            <Picker
              selectedValue={modal.newValue}
              itemStyle={{
                height: 88,
                fontSize: 16,
              }}
              onValueChange={(val) => {
                if (val !== "0") {
                  setModal((prev) => ({
                    ...prev,
                    newValue: val,
                    changed: val === value.type ? false : true,
                  }));
                }
              }}
            >
              <Picker.Item
                label={"Scroll to a type..."}
                value={"0"}
                color={"#CBCBCB"}
              />
              <Picker.Item label={"Fish"} value={"fish"} />
              <Picker.Item label={"Fruit"} value={"fruit"} />
              <Picker.Item label={"Meat"} value={"meat"} />
              <Picker.Item label={"Vegetable"} value={"vegetable"} />
            </Picker>
          ) : (
            <View
              style={{
                justifyContent: "center",
              }}
            >
              <DateTimePicker
                testID="dateTimePicker"
                value={
                  modal.changed
                    ? modal.newDate
                    : value.exp_date
                    ? new Date(value.exp_date)
                    : new Date()
                }
                mode={"date"}
                display={"default"}
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate || modal.newDate;
                  setModal((prev) => ({
                    ...prev,
                    newDate: currentDate,
                    changed:
                      formatDate(selectedDate) !== formatDate(value.exp_date),
                  }));
                }}
              />
            </View>
          )}
        </View>
        <View
          style={{
            width: "100%",
            height: 50,
            flexDirection: "row",
            justifyContent: "space-between",
            borderTopColor: "#CBCBCB",
            borderTopWidth: 1,
          }}
        >
          <View
            style={{
              width: "50%",
              backgroundColor: "white",
              justifyContent: "center",
              borderBottomStartRadius: 12,
            }}
          >
            <TouchableOpacity
              style={{
                padding: 5,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={toggleModal}
            >
              <Text style={{ fontSize: 16, color: "#2D82FF" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: !modal.changed ? "#A7CBFF" : "#2D82FF",
              width: "50%",
              justifyContent: "center",
              borderBottomEndRadius: 12,
            }}
          >
            <TouchableOpacity
              style={{
                padding: 5,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                option === "exp_date"
                  ? setItemElement(option, modal.newDate, value._id)
                  : setItemElement(option, modal.newValue, value._id);
                toggleModal();
              }}
              disabled={!modal.changed}
            >
              <Text style={{ fontSize: 16, color: "white" }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const loadConfirmation = (option) => {
    return (
      <View
        style={{
          width: "80%",
          height: "15%",
          backgroundColor: "white",
          alignItems: "center",
          justifyContent: "space-evenly",
          borderRadius: 12,
        }}
      >
        <View
          style={{
            width: "85%",
            height: "90%",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <Text numberOfLines={1} style={{ textAlign: "center", fontSize: 20 }}>
            Are you sure?
          </Text>
        </View>
        <View
          style={{
            width: "100%",
            height: 50,
            flexDirection: "row",
            justifyContent: "space-between",
            borderTopColor: "#CBCBCB",
            borderTopWidth: 1,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              width: "50%",
              justifyContent: "center",
              borderBottomStartRadius: 12,
            }}
          >
            <TouchableOpacity
              style={{
                padding: 5,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={toggleModal}
            >
              <Text style={{ fontSize: 16, color: "#2D82FF" }}>No</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: "#2D82FF",
              width: "50%",
              justifyContent: "center",
              borderBottomEndRadius: 12,
            }}
          >
            <TouchableOpacity
              style={{
                padding: 5,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                option === "delete" ? deleteGlist() : clearGlist();
                setModal((prevState) => ({
                  ...prevState,
                  visible: false,
                  changed: true,
                }));
              }}
            >
              <Text style={{ fontSize: 16, color: "white" }}>Yes</Text>
            </TouchableOpacity>
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
        <Modal
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          onBackdropPress={toggleModal}
          isVisible={modal.visible}
        >
          {modal.style === "delete" || modal.style === "clear"
            ? loadConfirmation(modal.style)
            : modal.style === "add"
            ? loadAddItem()
            : loadModalByOption(modal.style, modal.value)}
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
            modal.changed
              ? navigation.navigate("GlistHub", { data: state.items.length })
              : navigation.navigate("GlistHub")
          }
        >
          <FontAwesome5 name={"chevron-left"} size={22} color={"#2D82FF"} />
        </TouchableOpacity>
      </View>
      {/* --------------------------------Glist Name / DropDown Menu--------------------------- */}
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
        </View>

        <View
          style={{
            flex: 1.4,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <TouchableOpacity>
            <FontAwesome name={"send"} size={22} color={"#2D82FF"} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setModal((prevState) => ({
                ...prevState,
                visible: true,
                style: "delete",
              }))
            }
          >
            <FontAwesome name={"trash"} size={25} color={"#2D82FF"} />
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
              backgroundColor: state.items.length === 0 ? "#A7CBFF" : "#2D82FF",
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
                style: "clear",
              }))
            }
            disabled={state.items.length === 0}
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
                  justifyContent: "space-between",
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
                        value: data.item,
                        newDate: new Date(),
                        newValue: "",
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
                        style: "type",
                        value: data.item,
                        newDate: new Date(),
                        newValue: data.item.type,
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
              backgroundColor: "#2D82FF",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
            onPress={() =>
              setModal((prevState) => ({
                ...prevState,
                visible: true,
                style: "add",
                newValue: "",
                newDate: new Date(),
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
              backgroundColor: "#2D82FF",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
            onPress={() => submitToFridge()}
          >
            <Text style={{ fontSize: 20, color: "white" }}>Submit To...</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
