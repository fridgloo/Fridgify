import React from "react";
import {
  SafeAreaView,
  ScrollView,
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ImageBackground,
} from "react-native";
import Modal from "react-native-modal";
import * as SecureStore from "expo-secure-store";
import { TouchableOpacity } from "react-native-gesture-handler";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialCommunity from "react-native-vector-icons/MaterialCommunityIcons";

export default function GlistHubScreen({ navigation, route }) {
  const [state, setState] = React.useState({
    glists: [],
  });
  const [modal, setModal] = React.useState({
    visible: false,
    style: "",
    newName: "",
    newId: "",
  });

  React.useEffect(() => {
    getGlists();
  }, [route.params?.data]);

  const getGlists = async () => {
    let token = await SecureStore.getItemAsync("user_token");
    const response = await fetch(`http://localhost:3200/v1/glist/${token}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (response.ok) {
      resetGlists();
      data.glists.map((glist) => {
        const glistState = {
          _id: glist._id,
          name: glist.name,
          created: glist.created,
          items: glist.items,
        };
        setState((prev) => ({
          glists: [...prev.glists, glistState],
        }));
      });
    }
  };

  const addGlist = async (name) => {
    let token = await SecureStore.getItemAsync("user_token");
    await fetch(`http://localhost:3200/v1/glist/${token}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setState((prevState) => ({
            glists: [...prevState.glists, data],
          }));
        } else {
          // glist w/ that name already exists
        }
      });
  };

  const deleteGlist = async (id) => {
    let token = await SecureStore.getItemAsync("user_token");
    await fetch(`http://localhost:3200/v1/glist/${token}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: id }),
    }).then(() => {
      const glistIndex = state.glists.findIndex((element) => element._id == id);
      let newArray = [...state.glists];
      newArray.splice(glistIndex, 1);
      setState((prevState) => ({
        ...prevState,
        glists: newArray,
      }));
    });
  };

  const sendGlist = async (id) => {
    let token = await SecureStore.getItemAsync("user_token");
    await fetch(`http://localhost:3200/v1/item/glist/${id}/${token}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((items) =>
        fetch(`http://localhost:3200/v1/item/glist/${token}`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: items, glist: state.glists[0]._id }),
        })
      )
      .then(() => getGlists());
  };

  const resetGlists = () => {
    setState((prev) => ({
      glists: [],
    }));
  };

  const toggleModal = () => {
    setModal((prev) => ({
      ...prev,
      visible: !prev.visible,
      newName: "",
    }));
  };

  const loadConfirmation = (id) => {
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
            flex: 0.5,
            width: "100%",
            height: "100%",
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
                modal.style === "delete" ? deleteGlist(id) : sendGlist(id);
                toggleModal();
              }}
            >
              <Text style={{ fontSize: 16, color: "white" }}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const loadAddGlist = () => {
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
          <View
            style={{
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#CBCBCB",
              paddingHorizontal: 15,
              paddingVertical: 15,
            }}
          >
            <TextInput
              style={{
                fontSize: 16,
              }}
              numberOfLines={1}
              placeholder={"Grocery list name..."}
              onChangeText={(val) =>
                setModal((prevState) => ({
                  ...prevState,
                  newName: val,
                }))
              }
            />
          </View>
        </View>
        <View
          style={{
            flex: 0.5,
            width: "100%",
            height: "100%",
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
              <Text style={{ fontSize: 16, color: "#2D82FF" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: modal.newName === "" ? "#A7CBFF" : "#2D82FF",
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
                addGlist(modal.newName);
                toggleModal();
              }}
              disabled={modal.newName === ""}
            >
              <Text style={{ fontSize: 16, color: "white" }}>Create</Text>
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
          isVisible={modal.visible}
          onBackdropPress={toggleModal}
        >
          {modal.style === "add"
            ? loadAddGlist()
            : loadConfirmation(modal.newId)}
        </Modal>
      </View>
      {/* --------------------------------Header ---------------------------------------------- */}
      <View
        style={{
          flex: 1,
          paddingHorizontal: 25,
          paddingVertical: 5,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          style={{
            height: 60,
            width: 60,
          }}
          resizeMode="center"
          source={require("../assets/images/igloo.png")}
        />

        <Text
          adjustsFontSizeToFit
          style={{
            paddingLeft: 15,
            color: "#2D82FF",
            fontSize: 32,
            fontWeight: "600",
          }}
        >
          G r o c e r y
        </Text>
      </View>
      {/* --------------------------------Grocery Overview ------------------------------------ */}
      <View
        style={{
          flex: 2.5,
          paddingHorizontal: 25,
        }}
      >
        <View
          style={{
            alignItems: "center",
            paddingVertical: 20,
          }}
        >
          <TouchableOpacity
            style={{
              borderRadius: 15,
              width: Math.round(Dimensions.get("window").width - 50),
              height: "100%",
              backgroundColor: "#F1F3F6",
            }}
            onPress={() =>
              navigation.navigate("ShoppingCartScreen", {
                data: state.glists[0],
                type: "INITIALIZE",
              })
            }
          >
            <ImageBackground
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "cover",
                justifyContent: "center",
              }}
              imageStyle={{ borderRadius: 15 }}
              source={require("../assets/images/grocery.jpg")}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    paddingLeft: 25,
                  }}
                ></View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    paddingRight: 10,
                  }}
                >
                  <View
                    style={{
                      borderRadius: 20,
                      width: 100
                      ,
                      height: 50,
                      backgroundColor: "white",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>{state.glists[0]?.items.length} items</Text>
                  </View>
                  <View
                    style={{
                      paddingLeft: 10,
                    }}
                  >
                    <FontAwesome
                      name={"chevron-right"}
                      size={25}
                      color="white"
                    />
                  </View>
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      </View>
      {/* --------------------------------Glists----------------------------------------------- */}
      <View
        style={{
          flex: 5,
          paddingHorizontal: 25,
          paddingTop: 15,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "600",
            }}
          >
            Your Grocery Lists
          </Text>
          <TouchableOpacity
            style={
              state.glists.length >= 6
                ? styles.addGlistDisabled
                : styles.addGlistEnabled
            }
            onPress={() =>
              setModal((prevState) => ({
                ...prevState,
                visible: true,
                newName: "",
                style: "add",
              }))
            }
            disabled={state.glists.length >= 6}
          >
            <FontAwesome name={"plus"} size={10} color="white" />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 10,
          }}
        >
          <ScrollView>
            {state.glists.slice(1)?.map((glist, index) => {
              return (
                <TouchableOpacity
                  style={{
                    backgroundColor: "#F1F3F6",
                    width: Math.round(Dimensions.get("window").width - 60),
                    height: 80,
                    borderRadius: 15,
                    marginVertical: 5,
                  }}
                  key={index}
                  onPress={() =>
                    navigation.navigate("GlistScreen", {
                      data: glist,
                      type: "INITIALIZE",
                    })
                  }
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                    }}
                  >
                    <View
                      style={{
                        flex: 3,
                        justifyContent: "center",
                        paddingLeft: 25,
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "400",
                          fontSize: 18,
                        }}
                      >
                        {glist.name}
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 2,
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          setModal((prevState) => ({
                            ...prevState,
                            visible: true,
                            style: "send",
                            newId: glist._id,
                          }))
                        }
                      >
                        <FontAwesome
                          name={"send-o"}
                          size={20}
                          color={"#2D82FF"}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() =>
                          setModal((prevState) => ({
                            ...prevState,
                            visible: true,
                            style: "delete",
                            newId: glist._id,
                          }))
                        }
                      >
                        <FontAwesome
                          name={"trash-o"}
                          size={22}
                          color={"#2D82FF"}
                        />
                      </TouchableOpacity>
                      <FontAwesome5
                        name={"chevron-right"}
                        size={22}
                        color={"black"}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  addGlistEnabled: {
    borderRadius: 30,
    width: 26,
    height: 26,
    backgroundColor: "#FF7F23",
    justifyContent: "center",
    alignItems: "center",
  },
  addGlistDisabled: {
    borderRadius: 30,
    width: 26,
    height: 26,
    backgroundColor: "#FFC194",
    justifyContent: "center",
    alignItems: "center",
  },
});
