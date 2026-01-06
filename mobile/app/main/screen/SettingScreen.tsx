import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";

const SettingScreen = () => {
  return (
    <View>
      <Text>SettingScreen</Text>
      <Link replace href={"/(auth)"}>
        Log out
      </Link>
    </View>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({});
