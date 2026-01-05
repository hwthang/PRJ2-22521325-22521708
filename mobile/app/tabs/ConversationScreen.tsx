import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Search, MessageSquareDashed } from "lucide-react-native";
import ConversationService from "@/services/ConversationService";
import AuthService from "@/services/AuthService";
import ConversationItem from "@/components/conversation/ConversationItem";
import defAvatar from "../../assets/images/avatar.png";

const ConversationScreen = () => {
  const router = useRouter();
  const [conversations, setConversations] = useState<any[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [myId, setMyId] = useState<string>("");

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const myAccount = await AuthService.getMyAccount();
      setMyId(myAccount._id);

      const res = await ConversationService.getMyConversations(myAccount._id);
      setConversations(res || []);
      setFilteredConversations(res || []);
    } catch (error) {
      console.error("Fetch Conversations Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (!text.trim()) {
      setFilteredConversations(conversations);
      return;
    }
    const filtered = conversations.filter((item) => {
      const conversationName = item.name?.toLowerCase() || "";
      const memberNames = item.members
        .map((m: any) => m.displayName?.toLowerCase())
        .join(" ");
      return (
        conversationName.includes(text.toLowerCase()) ||
        memberNames.includes(text.toLowerCase())
      );
    });
    setFilteredConversations(filtered);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={20} color="#94a3b8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm cuộc trò chuyện..."
            value={searchText}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <FlatList
          data={filteredConversations}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            const otherMember = item.members?.find((m: any) => m._id !== myId);

            // Nếu có item.name -> Nhóm -> dùng defAvatar (URI), ngược lại dùng avatar user
            const displayTitle =
              item.name || otherMember?.displayName || "Người dùng";

            // Xử lý URI để truyền qua router params
            const displayAvatar =
              item.members.length > 2
                ? Image.resolveAssetSource(defAvatar).uri
                : item.avatar?.url || otherMember?.avatar?.url;

            return (
              <ConversationItem
                data={item}
                currentUserId={myId}
                onPress={() =>
                  router.push({
                    pathname: "/screen/ChatScreen",
                    params: {
                      conversationId: item._id,
                      title: displayTitle,
                      avatarUrl: displayAvatar,
                    },
                  })
                }
              />
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MessageSquareDashed
                size={64}
                color="#cbd5e1"
                strokeWidth={1.5}
              />
              <Text style={styles.emptyText}>Chưa có cuộc hội thoại nào</Text>
            </View>
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          onRefresh={fetchConversations}
          refreshing={loading}
        />
      )}
    </SafeAreaView>
  );
};

export default ConversationScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 15, color: "#1e293b" },
  loadingCenter: { flex: 1, justifyContent: "center", alignItems: "center" },
  separator: { height: 1, backgroundColor: "#f1f5f9", marginLeft: 84 },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: "#94a3b8",
    fontWeight: "500",
  },
});
