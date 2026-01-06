import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useLocalSearchParams } from "expo-router";
import { Send, Image as ImageIcon } from "lucide-react-native";
import { useVideoPlayer, VideoView } from "expo-video"; // Import từ thư viện mới

import ConversationService from "@/services/ConversationService";
import AuthService from "@/services/AuthService";
import { formatToHHMM } from "@/utils/date";
import ChatHeader from "@/components/conversation/ChatHeader";

// Component con để xử lý từng Video riêng biệt (quan trọng để quản lý Player)
const VideoMessage = ({ url }: { url: string }) => {
  const player = useVideoPlayer(url, (player) => {
    player.loop = false;
  });

  return (
    <VideoView
      style={styles.videoContent}
      player={player}
      allowsFullscreen
      allowsPictureInPicture
    />
  );
};

const ChatScreen = () => {
  const { conversationId, title, avatarUrl } = useLocalSearchParams();
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState("");
  const [myId, setMyId] = useState("");
  const [sending, setSending] = useState(false);

  const handleSeen = async (userId: string) => {
    try {
      if (!conversationId || !userId) return;
      await ConversationService.seenMessages(conversationId as string, userId);
    } catch (error) {
      console.error("Seen error:", error);
    }
  };

  const initChat = async () => {
    try {
      setLoading(true);
      const myAccount = await AuthService.getMyAccount();
      setMyId(myAccount._id);

      const res = await ConversationService.getMessages(
        conversationId as string
      );
      // Dữ liệu từ API thường là mới nhất ở đầu, ta reverse để dùng xuôi chiều
      setMessages((res.messages || []).reverse());

      await handleSeen(myAccount._id);
    } catch (error) {
      console.error("Init error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initChat();
  }, [conversationId]);

  const handleSend = async () => {
    if (!inputText.trim() || sending) return;
    const content = inputText.trim();
    setInputText("");
    setSending(true);

    try {
      const res = await ConversationService.sendMessage(
        conversationId as string,
        {
          senderId: myId,
          message: content,
        }
      );
      setMessages((prev) => [...prev, res.message]);
      handleSeen(myId);
    } catch (error) {
      console.error("Send error:", error);
    } finally {
      setSending(false);
    }
  };

  const renderMessageItem = ({ item }: { item: any }) => {
    const sender = item.senderId;
    const isMine = (sender._id || sender) === myId;
    const media = item.media;

    return (
      <View
        style={[styles.messageRow, isMine ? styles.myRow : styles.otherRow]}
      >
        {!isMine && (
          <Image
            source={{
              uri: sender?.avatar?.url || "https://via.placeholder.com/150",
            }}
            style={styles.miniAvatar}
          />
        )}

        <View
          style={[styles.messageContent, isMine && { alignItems: "flex-end" }]}
        >
          {!isMine && (
            <Text style={styles.senderName}>{sender?.displayName}</Text>
          )}

          <View
            style={[
              styles.bubble,
              isMine ? styles.myBubble : styles.otherBubble,
              media && styles.mediaBubble,
            ]}
          >
            {/* PHẦN HIỂN THỊ MEDIA */}
            {media && (
              <View style={styles.mediaContainer}>
                {media.type === "image" ? (
                  <Image
                    source={{ uri: media.url }}
                    style={styles.imageContent}
                  />
                ) : media.type === "video" ? (
                  <VideoMessage url={media.url} />
                ) : null}
              </View>
            )}

            {/* PHẦN HIỂN THỊ TIN NHẮN CHỮ */}
            {item.message !== "" && (
              <Text
                style={[
                  styles.messageText,
                  isMine ? styles.myText : styles.otherText,
                  media && { marginTop: 8 },
                ]}
              >
                {item.message}
              </Text>
            )}
          </View>
          <Text style={styles.chatTime}>{formatToHHMM(item.createdAt)}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ChatHeader
        title={title as string}
        avatarUrl={avatarUrl as string}
        conversationId={conversationId as string}
      />

      {loading ? (
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          inverted
          keyExtractor={(item) => item._id}
          renderItem={renderMessageItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <View style={styles.inputArea}>
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.iconButton}>
              <ImageIcon size={24} color="#64748b" />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Nhập tin nhắn..."
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                !inputText.trim() && styles.disabledSend,
              ]}
              onPress={handleSend}
            >
              <Send size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={{ height: Platform.OS === "ios" ? 25 : 10 }} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  loadingCenter: { flex: 1, justifyContent: "center", alignItems: "center" },
  listContent: { padding: 16 },
  messageRow: { flexDirection: "row", marginBottom: 14, maxWidth: "85%" },
  myRow: { alignSelf: "flex-end" },
  otherRow: { alignSelf: "flex-start" },
  miniAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    alignSelf: "flex-end",
  },
  messageContent: { flexShrink: 1 },
  senderName: {
    fontSize: 11,
    color: "#94a3b8",
    marginBottom: 2,
    marginLeft: 4,
  },
  bubble: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  myBubble: { backgroundColor: "#2563eb", borderBottomRightRadius: 2 },
  otherBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  mediaBubble: { padding: 4, maxWidth: 260 },
  mediaContainer: {
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  imageContent: { width: 250, height: 200, resizeMode: "cover" },
  videoContent: { width: 250, height: 200 },
  messageText: { fontSize: 15, lineHeight: 20, paddingHorizontal: 4 },
  myText: { color: "#fff" },
  otherText: { color: "#1e293b" },
  chatTime: { fontSize: 10, color: "#cbd5e1", marginTop: 4 },
  inputArea: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  inputContainer: { flexDirection: "row", alignItems: "center", padding: 8 },
  input: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  disabledSend: { backgroundColor: "#cbd5e1" },
  iconButton: { padding: 8 },
});
