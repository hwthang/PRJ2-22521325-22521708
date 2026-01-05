import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { Settings } from "lucide-react-native";

const SettingButton = () => {
  return (
    <View>
      <Link href={"/screen/SettingScreen"}>
        <Settings />
      </Link>
    </View>
  );
};

export default SettingButton;

const styles = StyleSheet.create({});
