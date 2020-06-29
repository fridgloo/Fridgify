import React from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import AuthButton from "../components/AuthButton";
import LogoText from "../components/LogoText";
import ProfileInfo from "../components/ProfileInfo";
import useAuth from "../auth/useAuth";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  return (
    <SafeAreaView>
      <LogoText style={styles.profiletitle}>{user.user.username}</LogoText>
      <ProfileInfo>Your Fridges:</ProfileInfo>
      <ProfileInfo>Password:</ProfileInfo>
      <ProfileInfo>Email: {user.user.email}</ProfileInfo>
      <AuthButton
        title="Dark Mode"
        onPress={() => console.log("Dark Mode was pressed")}
      />
      <AuthButton
        title="Turn Off Notifications"
        onPress={() => console.log("Turn Off Notifications was pressed")}
      />
      <AuthButton
        title="Log Out"
        onPress={() => {
          signOut();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  profiletitle: {
    fontSize: 35,
    textAlign: "center",
    padding: "10%",
  },
});
