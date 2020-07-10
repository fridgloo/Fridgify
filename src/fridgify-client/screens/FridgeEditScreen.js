import React from "react";
import { StyleSheet } from "react-native";
import Screen from "../components/Screen";
import { Form, FormField, SubmitButton } from "../components/form";

import FridgesApi from "../api/fridge";
import authStorage from "../auth/storage";

const FridgeEditScreen = ({ navigation }) => {
  const handleSubmit = async (fridgeName) => {
    const result = await FridgesApi.addFridge(fridgeName);
    if (!result.ok) {
      console.log(result);
    }

    navigation.navigate("FridgeHub");
  };

  return (
    <Screen>
      <Form
        initialValues={{
          name: "",
        }}
        onSubmit={handleSubmit}
      >
        <FormField maxLength={255} name="name" placeholder="name" />
        <SubmitButton title="Add Fridge" />
      </Form>
    </Screen>
  );
};

export default FridgeEditScreen;

const styles = StyleSheet.create({});
