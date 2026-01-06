import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Image,
} from "react-native";
import React from "react";
import { ChevronLeft, Info } from "lucide-react-native";
import { useRouter } from "expo-router";
import defAvatar from "../../assets/images/avatar.png";

interface ChatHeaderProps {
  title: string;
  avatarUrl?: string;
  conversationId: string;
}

const ChatHeader = ({ title, avatarUrl, conversationId }: ChatHeaderProps) => {
  const router = useRouter();

  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        {/* Nút Back */}
        <View style={styles.leftSlot}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ChevronLeft color="#fff" size={28} />
          </TouchableOpacity>
        </View>

        {/* Giữa: Avatar + Tên */}
        <TouchableOpacity
          style={styles.centerSlot}
          onPress={() =>
            router.push(`/main/screen/ChatDetailScreen?id=${conversationId}`)
          }
        >
          <Image
            source={avatarUrl ? { uri: avatarUrl } : defAvatar}
            style={styles.headerAvatar}
          />
          <View style={styles.titleWrapper}>
            <Text style={styles.titleText} numberOfLines={1}>
              {title || "Đang tải..."}
            </Text>
            <Text style={styles.subTitleText}>Đang hoạt động</Text>
          </View>
        </TouchableOpacity>

        {/* Nút Chi tiết */}
        <View style={styles.rightSlot}>
          <TouchableOpacity
            onPress={() =>
              router.push(`/main/screen/ChatDetailScreen?id=${conversationId}`)
            }
            style={styles.infoButton}
          >
            <Info color="#fff" size={22} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ChatHeader;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#2563eb",
    paddingTop: Platform.OS === "android" ? 35 : 0,
  },
  container: {
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  leftSlot: { width: 40 },
  centerSlot: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.3)",
  },
  titleWrapper: {
    marginLeft: 10,
    flex: 1,
  },
  titleText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  subTitleText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
  },
  rightSlot: { width: 40, alignItems: "flex-end" },
  backButton: { width: 30, height: 40, justifyContent: "center" },
  infoButton: {
    width: 30,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-end",
  },
});
