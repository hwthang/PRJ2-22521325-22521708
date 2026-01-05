import { StyleSheet} from "react-native";
import React from "react";
import { Stack } from "expo-router";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import HeaderBar from "@/components/layout/HeaderBar";

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
          name="tabs"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="screen/ChatScreen"
          options={{
            headerShown: false,
          }}
        />
         <Stack.Screen
          name="screen/ChatDetailScreen"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="screen/EventDetailScreen"
          options={{
            header:()=><HeaderBar title="Chi tiết sự kiện"/>
          }}
        />
        <Stack.Screen
          name="screen/SurveyResultScreen"
          options={{
            header:()=><HeaderBar title="Chi tiết khảo sát"/>
          }}
        />
         <Stack.Screen
          name="screen/DoSurveyScreen"
          options={{
            header:()=><HeaderBar title="Làm khảo sát"/>
          }}
        />
        
      </Stack>
      <Toast config={toastConfig} />
    </>
  );
};

export default RootLayout;

const styles = StyleSheet.create({});
