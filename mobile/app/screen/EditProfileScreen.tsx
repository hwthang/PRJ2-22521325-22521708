import { StyleSheet, Text, View } from "react-native";
import React, { use, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";

const EditProfileScreen = () => {
  const { id } = useLocalSearchParams();
  useEffect(() => {
    console.log(id);
  }, []);
  return (
    <View>
      <Text>EditProfileScreen</Text>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({});
