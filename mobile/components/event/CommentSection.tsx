import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { Send, MessageCircle } from "lucide-react-native";
import { formatRelativeTime } from "@/utils/date";
import EventService from "@/services/EventService";

const defAvatar = require("../../assets/images/avatar.png");

interface CommentSectionProps {
  postId: string;
  comments: any[];
  onCommentAdded: () => void; // Callback để load lại data sau khi cmt
}

const CommentSection = ({ postId, comments, onCommentAdded }: CommentSectionProps) => {
  const [newComment, setNewComment] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      setSending(true);
      // Giả sử service của bạn có hàm postComment
      // await EventService.postComment(postId, { comment: newComment });
      setNewComment("");
      onCommentAdded(); // Gọi hàm fetch lại dữ liệu ở màn hình cha
    } catch (error) {
      console.error("Lỗi gửi bình luận:", error);
    } finally {
      setSending(false);
    }
  };

  const renderCommentItem = ({ item }: { item: any }) => (
    <View style={styles.commentItem}>
      <Image
        source={item.accountId?.avatar?.url ? { uri: item.accountId.avatar.url } : defAvatar}
        style={styles.commentAvatar}
      />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentUser}>{item.accountId?.displayName}</Text>
          <Text style={styles.commentTime}>{formatRelativeTime(item.createdAt)}</Text>
        </View>
        <Text style={styles.commentText}>{item.comment}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <MessageCircle size={20} color="#1e293b" />
        <Text style={styles.sectionTitle}>Bình luận ({comments.length})</Text>
      </View>

      {/* Danh sách bình luận */}
      {comments.length > 0 ? (
        <View style={styles.listWrapper}>
          {comments.map((item) => (
            <React.Fragment key={item._id}>
                {renderCommentItem({ item })}
            </React.Fragment>
          ))}
        </View>
      ) : (
        <Text style={styles.emptyText}>Hãy là người đầu tiên bình luận!</Text>
      )}

      {/* Ô nhập bình luận */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Viết bình luận..."
          value={newComment}
          onChangeText={setNewComment}
          multiline
        />
        <TouchableOpacity 
          style={[styles.sendBtn, !newComment.trim() && styles.sendBtnDisabled]} 
          onPress={handleSendComment}
          disabled={sending || !newComment.trim()}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Send size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CommentSection;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginLeft: 8,
  },
  listWrapper: {
    marginBottom: 15,
  },
  commentItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    padding: 12,
    borderRadius: 12,
    borderTopLeftRadius: 2,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b",
  },
  commentTime: {
    fontSize: 11,
    color: "#94a3b8",
  },
  commentText: {
    fontSize: 14,
    color: "#334155",
    lineHeight: 20,
  },
  emptyText: {
    textAlign: "center",
    color: "#94a3b8",
    marginVertical: 20,
    fontStyle: "italic",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 10,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    paddingTop: 8,
    paddingBottom: 8,
    fontSize: 15,
    color: "#1e293b",
  },
  sendBtn: {
    backgroundColor: "#2563eb",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  sendBtnDisabled: {
    backgroundColor: "#cbd5e1",
  },
});