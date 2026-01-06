import { StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import HeaderBar from "@/components/layout/HeaderBar";

import AuthService from "@/services/AuthService";
import SocketManager from "@/utils/SocketManager";

const MainLayout = () => {
  const router = useRouter();

  useEffect(() => {
    const setupSocket = async () => {
      // 1. Lấy thông tin tài khoản để kết nối
      const myAccount = await AuthService.getMyAccount();
      console.log(myAccount._id);
      if (!myAccount?._id) return;

      // 2. Thực hiện kết nối
      SocketManager.connect(myAccount._id);

      // 3. Lắng nghe các sự kiện (Socket Handlers)

      // Sự kiện chào mừng
      SocketManager.on("welcome", (data) => {
        Toast.show({
          type: "success",
          text1: `Xin chào, ${data.fullname}! 👋`,
          text2: "Bạn đã kết nối thành công.",
        });
      });

      // Sự kiện có sự kiện mới
      SocketManager.on("new_event_for_member", (eventId) => {
        Toast.show({
          type: "info",
          text1: "Sự kiện mới 📢",
          text2: "Chi đoàn vừa đăng tải một sự kiện mới, xem ngay!",
          onPress: () => {
            router.push({
              pathname: "/main/screen/EventDetailScreen",
              params: { id: eventId },
            });
            Toast.hide();
          },
        });
      });

      // Sự kiện có tin nhắn mới
      SocketManager.on("new_message", (payload) => {
        Toast.show({
          type: "info",
          text1: `Tin nhắn từ ${payload.chatName} 💬`,
          text2: payload.text || "Bạn có một tin nhắn mới",
          onPress: () => {
            router.push({
              pathname: "/main/screen/ChatDetailScreen",
              params: { conversationId: payload.conversationId },
            });
            Toast.hide();
          },
        });
      });
    };

    setupSocket();

    // Cleanup: Ngắt kết nối hoặc hủy lắng nghe khi unmount layout này
    return () => {
      SocketManager.off("welcome");
      SocketManager.off("new_event_for_member");
      SocketManager.off("new_message");
      SocketManager.off("call:incoming");
      // Nếu muốn ngắt hẳn socket khi thoát MainLayout:
      // SocketManager.disconnect();
    };
  }, []);

  return (
    <Stack>
      <Stack.Screen name="tabs" options={{ headerShown: false }} />
      <Stack.Screen name="screen/ChatScreen" options={{ headerShown: false }} />
      <Stack.Screen
        name="screen/ChatDetailScreen"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="screen/EventDetailScreen"
        options={{ header: () => <HeaderBar title="Chi tiết sự kiện" /> }}
      />
      <Stack.Screen
        name="screen/SurveyResultScreen"
        options={{ header: () => <HeaderBar title="Chi tiết khảo sát" /> }}
      />
      <Stack.Screen
        name="screen/DoSurveyScreen"
        options={{ header: () => <HeaderBar title="Làm khảo sát" /> }}
      />
      <Stack.Screen
        name="screen/EditProfileScreen"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="screen/ScanQrScreen"
        options={{ headerShown: false }}
      />
      {/* Đăng ký thêm màn hình cuộc gọi nếu cần */}
    </Stack>
  );
};

export default MainLayout;

const styles = StyleSheet.create({});
