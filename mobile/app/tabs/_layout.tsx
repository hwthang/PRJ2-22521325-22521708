import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import SettingButton from "@/components/layout/SettingButton";
import {
  Calendar,
  FileText,
  Home,
  MessageCircleMore,
  Newspaper,
} from "lucide-react-native";
import HeaderBar from "@/components/layout/HeaderBar";

const TabLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="HomeScreen"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Home color={focused ? "blue" : "gray"} />
          ),
          tabBarActiveTintColor: "blue",
          title: "Trang chủ",
        }}
      />
      <Tabs.Screen
        name="EventScreen"
        options={{
          header: () => <HeaderBar title="Sự kiện" showBack={false} />,
          tabBarIcon: ({ focused }) => (
            <Calendar color={focused ? "blue" : "gray"} />
          ),
          tabBarActiveTintColor: "blue",
          title: "Sự kiện",
        }}
      />
      <Tabs.Screen
        name="DocumentScreen"
        options={{
          header: () => <HeaderBar title="Tài liệu" showBack={false} />,
          tabBarIcon: ({ focused }) => (
            <FileText color={focused ? "blue" : "gray"} />
          ),
          tabBarActiveTintColor: "blue",
          title: "Tài liệu",
        }}
      />
      <Tabs.Screen
        name="SurveyScreen"
        options={{
          header: () => <HeaderBar title="Khảo sát" showBack={false} />,
          tabBarIcon: ({ focused }) => (
            <Newspaper color={focused ? "blue" : "gray"} />
          ),
          tabBarActiveTintColor: "blue",
          title: "Khảo sát",
        }}
      />
      <Tabs.Screen
        name="ConversationScreen"
        options={{
           header: () => <HeaderBar title="Trò chuyện" showBack={false} />,
          tabBarIcon: ({ focused }) => (
            <MessageCircleMore color={focused ? "blue" : "gray"} />
          ),
          tabBarActiveTintColor: "blue",
          title: "Trò chuyện",
        }}
      />
    </Tabs>
  );
};

export default TabLayout;

const styles = StyleSheet.create({});
