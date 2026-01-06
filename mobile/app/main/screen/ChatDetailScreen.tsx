import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Users, Image as ImageIcon } from "lucide-react-native";
import ConversationService from "@/services/ConversationService";
import AuthService from "@/services/AuthService";
import defAvatar from "../../../assets/images/avatar.png";

const ChatDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<any[]>([]);
  const [media, setMedia] = useState<any[]>([]);
  const [myId, setMyId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [myAccount, resMembers, msgRes] = await Promise.all([
          AuthService.getMyAccount(),
          ConversationService.getMembers(id as string),

          ConversationService.getMessages(id as string),
        ]);

        console.log(resMembers);
        setMyId(myAccount._id);
        setMembers(resMembers.members || []);
        if (msgRes.messages) {
          setMedia(
            msgRes.messages
              .filter((m: any) => m.media?.url)
              .map((m: any) => m.media)
          );
        }
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Logic Avatar: Nếu > 3 thành viên dùng defAvatar, ngược lại dùng avatar của người kia
  const isGroup = members.length > 3;
  const otherMember = members.find((m) => m._id !== myId) || members[0];

  const displayAvatar =
    isGroup || !otherMember?.avatar?.url
      ? defAvatar
      : { uri: otherMember.avatar.url };

  const displayTitle = isGroup
    ? "Nhóm trò chuyện"
    : otherMember?.displayName ||
      otherMember?.email?.split("@")[0] ||
      "Người dùng";

  if (loading)
    return (
      <View style={styles.loadingCenter}>
        <ActivityIndicator color="#2563eb" />
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft color="#1e293b" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tùy chọn</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.infoSection}>
          <Image source={displayAvatar} style={styles.mainAvatar} />
          <Text style={styles.groupName}>{displayTitle}</Text>
          <Text style={styles.subText}>{members.length} thành viên</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Users size={18} color="#64748b" />
            <Text style={styles.sectionTitle}>Thành viên</Text>
          </View>
          {members.map((member) => (
            <View key={member._id} style={styles.memberItem}>
              <Image
                source={
                  member.avatar?.url ? { uri: member.avatar.url } : defAvatar
                }
                style={styles.memberAvatar}
              />
              <Text style={styles.memberName} numberOfLines={1}>
                {member.displayName || member.email?.split("@")[0]}{" "}
                {member._id === myId && "(Bạn)"}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ImageIcon size={18} color="#64748b" />
            <Text style={styles.sectionTitle}>Ảnh & Video</Text>
          </View>
          {media.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.mediaList}
            >
              {media.map((item, index) => (
                <Image
                  key={index}
                  source={{ uri: item.url }}
                  style={styles.mediaThumb}
                />
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.emptyText}>Chưa có media</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChatDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  loadingCenter: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    height: 140,
  },
  headerTitle: { fontSize: 17, fontWeight: "700", color: "#1e293b" },
  infoSection: {
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  mainAvatar: {
    width: 85,
    height: 85,
    borderRadius: 45,
    marginBottom: 12,
    backgroundColor: "#f1f5f9",
  },
  groupName: { fontSize: 18, fontWeight: "700", color: "#1e293b" },
  subText: { color: "#64748b", fontSize: 13, marginTop: 2 },
  section: {
    backgroundColor: "#fff",
    marginTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 8,
    color: "#64748b",
    textTransform: "uppercase",
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: "#f1f5f9",
  },
  memberName: { fontSize: 15, color: "#1e293b", fontWeight: "500" },
  mediaList: { paddingVertical: 8 },
  mediaThumb: { width: 85, height: 85, borderRadius: 10, marginRight: 10 },
  emptyText: { paddingBottom: 16, color: "#94a3b8", fontSize: 13 },
});
