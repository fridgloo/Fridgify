import React from "react";
import { Text } from "react-native";
import AuthButton from "../components/AuthButton";

export default function ProfileScreen() {
    return (
    <View>
        <Text style={styles.loginIndicator}> ProfileScreen</Text>
        <Text>Name</Text>
        <Text>Email</Text>
        <AuthButton title="Log Out" onPress={() => console.log("Log Out was pressed")} />
    </View>
    )
}