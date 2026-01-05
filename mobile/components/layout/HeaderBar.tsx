import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Platform } from "react-native";
import React from "react";
import { ChevronLeft } from "lucide-react-native";
import { useRouter } from "expo-router";

interface HeaderBarProps {
  title: string;
  showBack?: boolean;
}

const HeaderBar = ({ title, showBack = true }: HeaderBarProps) => {
  const router = useRouter();

  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        {/* Bên trái: Nút quay lại */}
        <View style={styles.leftSlot}>
          {showBack && (
            <TouchableOpacity 
              onPress={() => router.back()} 
              style={styles.backButton}
              hitSlop={15}
            >
              <ChevronLeft color="#fff" size={28} />
            </TouchableOpacity>
          )}
        </View>

        {/* Giữa: Tiêu đề */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText} numberOfLines={1}>
            {title}
          </Text>
        </View>

        {/* Bên phải: Để trống để cân bằng layout (hoặc thêm nút hành động sau này) */}
        <View style={styles.rightSlot} />
      </View>
    </View>
  );
};

export default HeaderBar;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#2563eb", // Blue-600
    // Đảm bảo chiều cao tổng thể khoảng 80-90 tùy thiết bị, 
    // bao gồm cả thanh trạng thái (StatusBar)
    paddingTop: Platform.OS === "android" ? 30 : 0, 
  },
  container: {
    height: 80, // Chiều cao theo yêu cầu
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  leftSlot: {
    flex: 1,
    alignItems: "flex-start",
  },
  titleContainer: {
    flex: 4,
    alignItems: "center",
  },
  rightSlot: {
    flex: 1,
  },
  titleText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
});