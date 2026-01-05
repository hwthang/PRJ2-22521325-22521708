import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";
import { formatDateToTimeOrDate } from "@/utils/date";
import { CheckCheck, ImageIcon, Video } from "lucide-react-native"; // Thêm icon minh họa
import defAvatar from "../../assets/images/avatar.png";

interface ConversationItemProps {
  data: any;
  currentUserId: string;
  onPress?: () => void;
}

const ConversationItem = ({ data, currentUserId, onPress }: ConversationItemProps) => {
  const { members, lastMessage, name } = data;

  const otherMember = members.find((m: any) => m._id !== currentUserId) || members[0];
  const displayName = name || otherMember?.displayName || "Người dùng";
  const displayAvatar = name 
    ? defAvatar 
    : (otherMember?.avatar?.url ? { uri: otherMember.avatar.url } : defAvatar);

  const isSeen = lastMessage?.seenBy?.includes(currentUserId);

  // --- LOGIC HIỂN THỊ NỘI DUNG TIN NHẮN CUỐI ---
  const renderLastMessageContent = () => {
    if (!lastMessage) return "Bắt đầu cuộc trò chuyện";

    const isMine = (lastMessage.senderId?._id || lastMessage.senderId) === currentUserId;
    const prefix = isMine ? "Bạn: " : "";

    // Ưu tiên hiển thị text nếu có
    if (lastMessage.message && lastMessage.message.trim() !== "") {
      return `${prefix}${lastMessage.message}`;
    }

    // Nếu không có text, kiểm tra media
    if (lastMessage.media) {
      const mediaType = lastMessage.media.type;
      if (mediaType === "image") return `${prefix}[Hình ảnh]`;
      if (mediaType === "video") return `${prefix}[Video]`;
      return `${prefix}[Tệp tin]`;
    }

    return "Tin nhắn mới";
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.avatarContainer}>
        <Image source={displayAvatar} style={styles.avatar} />
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>
            {displayName}
          </Text>
          <Text style={styles.time}>
            {lastMessage ? formatDateToTimeOrDate(lastMessage.createdAt) : ""}
          </Text>
        </View>

        <View style={styles.messageRow}>
          <View style={styles.messagePreview}>
            {/* Hiển thị icon nhỏ nếu là Media */}
            {!lastMessage?.message && lastMessage?.media?.type === "image" && (
              <ImageIcon size={14} color={isSeen ? "#64748b" : "#1e293b"} style={{ marginRight: 4 }} />
            )}
            {!lastMessage?.message && lastMessage?.media?.type === "video" && (
              <Video size={14} color={isSeen ? "#64748b" : "#1e293b"} style={{ marginRight: 4 }} />
            )}
            
            <Text 
              style={[styles.lastMessage, !isSeen && styles.unreadText]} 
              numberOfLines={1}
            >
              {renderLastMessageContent()}
            </Text>
          </View>
          
          <View style={styles.statusContainer}>
            {/* Check xanh cho tin nhắn mình gửi */}
            {(lastMessage?.senderId?._id === currentUserId || lastMessage?.senderId === currentUserId) && (
              <CheckCheck 
                size={16} 
                color={isSeen ? "#2563eb" : "#94a3b8"} 
              />
            )}
            
            {/* Chấm xanh cho tin nhắn người khác gửi mà mình chưa đọc */}
            {!isSeen && (lastMessage?.senderId?._id !== currentUserId && lastMessage?.senderId !== currentUserId) && (
              <View style={styles.unreadBadge} />
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ConversationItem;

const styles = StyleSheet.create({
  container: { flexDirection: "row", paddingHorizontal: 16, paddingVertical: 12, alignItems: "center", backgroundColor: "#fff" },
  avatarContainer: { position: "relative" },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#f1f5f9" },
  infoContainer: { flex: 1, marginLeft: 12, justifyContent: "center" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  name: { fontSize: 16, fontWeight: "600", color: "#1e293b", flex: 1, marginRight: 8 },
  time: { fontSize: 12, color: "#64748b" },
  messageRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  messagePreview: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  lastMessage: { fontSize: 14, color: "#64748b", flex: 1 },
  unreadText: { color: "#1e293b", fontWeight: "700" },
  statusContainer: { marginLeft: 8, minWidth: 20, alignItems: 'flex-end' },
  unreadBadge: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#2563eb" },
});