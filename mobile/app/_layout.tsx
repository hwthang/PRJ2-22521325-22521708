import { StyleSheet } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";


const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#22c55e",
        backgroundColor: "#ecfdf5",
      }}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      text1Style={{
        fontSize: 15,
        fontWeight: "600",
        color: "#166534",
      }}
      text2Style={{
        fontSize: 13,
        color: "#14532d",
      }}
    />
  ),

  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: "#ef4444",
        backgroundColor: "#fef2f2",
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: "600",
        color: "#7f1d1d",
      }}
      text2Style={{
        fontSize: 13,
        color: "#991b1b",
      }}
    />
  ),

  info: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#3b82f6",
        backgroundColor: "#eff6ff",
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: "600",
        color: "#1e3a8a",
      }}
      text2Style={{
        fontSize: 13,
        color: "#1d4ed8",
      }}
    />
  ),
};

const RootLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="(auth)/index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="main"
          options={{
            headerShown: false,
          }}
        />
       
      </Stack>
      <Toast config={toastConfig} />
    </>
  );
};

export default RootLayout;

const styles = StyleSheet.create({});
