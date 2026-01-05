import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Calendar,
  MapPin,
  Clock,
  ChevronLeft,
  Info,
  Users,
  MessageCircle,
  Send,
  Heart,
  QrCode,
} from "lucide-react-native";
import EventService from "@/services/EventService";
import {
  formatDateToDDMMYYYY,
  formatToHHMM,
  formatRelativeTime,
} from "@/utils/date";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const defAvatar = require("../../assets/images/avatar.png");

// Danh mục định nghĩa Tags với màu sắc tương ứng
const eventTopics: any = {
  volunteer: { label: "Tình nguyện", color: "#10b981" },
  blood_donation: { label: "Hiến máu", color: "#ef4444" },
  environment: { label: "Môi trường", color: "#059669" },
  startup: { label: "Khởi nghiệp", color: "#3b82f6" },
  training: { label: "Tập huấn", color: "#6366f1" },
  sports: { label: "Thể thao", color: "#f97316" },
  youth_union: { label: "Sinh hoạt Đoàn", color: "#0ea5e9" },
  charity: { label: "Từ thiện", color: "#ec4899" },
  culture: { label: "Văn hoá", color: "#8b5cf6" },
  art: { label: "Nghệ thuật", color: "#a855f7" },
  technology: { label: "Công nghệ", color: "#06b6d4" },
  education: { label: "Giáo dục", color: "#f59e0b" },
  competition: { label: "Cuộc thi", color: "#eab308" },
  career: { label: "Nghề nghiệp", color: "#14b8a6" },
  social_security: { label: "An sinh xã hội", color: "#f43f5e" },
  festival: { label: "Lễ hội", color: "#d946ef" },
  exchange: { label: "Giao lưu", color: "#84cc16" },
  training_soft: { label: "Kỹ năng mềm", color: "#a855f7" },
  propaganda: { label: "Tuyên truyền", color: "#dc2626" },
  community: { label: "Cộng đồng", color: "#22c55e" },
};

const CommentItem = ({ cmt }: { cmt: any }) => (
  <View style={styles.commentItem}>
    <Image
      source={
        cmt.accountId?.avatar?.url
          ? { uri: cmt.accountId.avatar.url }
          : defAvatar
      }
      style={styles.commentAvatar}
    />
    <View style={styles.commentContent}>
      <View style={styles.commentHeader}>
        <Text style={styles.commentUser}>{cmt.accountId?.displayName}</Text>
        <Text style={styles.commentTime}>
          {formatRelativeTime(cmt.createdAt)}
        </Text>
      </View>
      <Text style={styles.commentText}>{cmt.comment}</Text>
      {cmt.image?.url && (
        <Image
          source={{ uri: cmt.image.url }}
          style={styles.commentAttachedImage}
          resizeMode="cover"
        />
      )}
    </View>
  </View>
);

const EventDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [event, setEvent] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [commentInput, setCommentInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const fetchEventData = async () => {
    try {
      if (!event) setLoading(true);
      const res = await EventService.fetchAllEventForMember();
      const data = res.find((item: { _id: string }) => item._id == id);

      if (data) {
        setEvent(data);
        const resCmt = await EventService.getComments(data.postId._id);
        setComments(resCmt.data.comments || []);
      }
    } catch (error) {
      console.error("Lỗi fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [id]);

  const onScrollImage = (e: any) => {
    const slide = Math.ceil(
      e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width
    );
    if (slide !== activeImage) setActiveImage(slide);
  };

  const handleScanQR = () => {
    // Logic điều hướng quét mã
    console.log("Mở Camera quét QR cho sự kiện:", event.name);
    router.push('/screen/ScanQrScreen')
  };

  if (loading)
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );

  if (!event) return null;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Slider ảnh */}
          <View style={styles.sliderContainer}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={onScrollImage}
              scrollEventThrottle={16}
            >
              {event.images?.map((img: any, index: number) => (
                <Image
                  key={index}
                  source={{ uri: img.url }}
                  style={styles.bannerImage}
                />
              ))}
            </ScrollView>
            {event.images?.length > 1 && (
              <View style={styles.pagination}>
                {event.images.map((_: any, i: number) => (
                  <View
                    key={i}
                    style={[
                      styles.dot,
                      activeImage === i ? styles.activeDot : styles.inactiveDot,
                    ]}
                  />
                ))}
              </View>
            )}
          </View>

          <View style={styles.contentCard}>
            {/* Hàng trạng thái và Likes */}
            <View style={styles.topRow}>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      event.status === "running" ? "#fef3c7" : "#dbeafe",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    {
                      color: event.status === "running" ? "#d97706" : "#2563eb",
                    },
                  ]}
                >
                  {event.status === "running" ? "Đang diễn ra" : "Sắp tới"}
                </Text>
              </View>
              <View style={styles.likeBadge}>
                <Heart size={14} color="#ef4444" fill="#ef4444" />
                <Text style={styles.likeText}>{event.postId?.likes || 0}</Text>
              </View>
            </View>

            <Text style={styles.title}>{event.name}</Text>

            {/* Tags Section */}
            {event.tags && event.tags.length > 0 && (
              <View style={styles.tagContainer}>
                {event.tags.map((tagKey: string) => {
                  const tagInfo = eventTopics[tagKey];
                  if (!tagInfo) return null;
                  return (
                    <View
                      key={tagKey}
                      style={[
                        styles.tagItem,
                        {
                          backgroundColor: tagInfo.color + "15",
                          borderColor: tagInfo.color,
                        },
                      ]}
                    >
                      <Text style={[styles.tagText, { color: tagInfo.color }]}>
                        {tagInfo.label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}

            <View style={styles.infoRow}>
              <Calendar size={18} color="#64748b" />
              <Text style={styles.infoText}>
                {formatDateToDDMMYYYY(event.startedAt)} -{" "}
                {formatDateToDDMMYYYY(event.endedAt)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Clock size={18} color="#64748b" />
              <Text style={styles.infoText}>
                Bắt đầu: {formatToHHMM(event.startedAt)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <MapPin size={18} color="#ef4444" />
              <Text style={styles.infoText}>
                {event.venue || "Chưa có địa điểm"}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Info size={18} color="#1e293b" />
                <Text style={styles.sectionTitle}>Mô tả</Text>
              </View>
              <Text style={styles.description}>{event.description}</Text>
            </View>

            <View style={styles.divider} />

            {/* Bình luận */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MessageCircle size={18} color="#1e293b" />
                <Text style={styles.sectionTitle}>
                  Bình luận ({comments.length})
                </Text>
              </View>
              {comments.map((cmt) => (
                <CommentItem key={cmt._id} cmt={cmt} />
              ))}
              <View style={styles.commentInputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Viết bình luận..."
                  value={commentInput}
                  onChangeText={setCommentInput}
                  multiline
                />
                <TouchableOpacity style={styles.sendBtn}>
                  <Send size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Ban tổ chức */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Users size={18} color="#1e293b" />
                <Text style={styles.sectionTitle}>Ban tổ chức</Text>
              </View>
              <View style={styles.organizerBox}>
                <Text style={styles.organizerName}>
                  {event.chapterId?.name}
                </Text>
                <Text style={styles.organizerSub}>
                  {event.chapterId?.affiliated}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Footer với nút Đăng ký và Quét QR */}
        <View style={styles.footer}>
          {event.status === "running" && event.hadRegistered && (
            <TouchableOpacity style={styles.btnQR} onPress={handleScanQR}>
              <QrCode size={20} color="#2563eb" />
              <Text style={styles.btnQRText}>Quét QR điểm danh</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.btnAction,
              event.hadRegistered && styles.btnDisabled,
              event.status === "running" &&
                event.hadRegistered && { marginTop: 12 },
            ]}
            disabled={event.hadRegistered}
          >
            <Text
              style={[
                styles.btnText,
                event.hadRegistered && { color: "#94a3b8" },
              ]}
            >
              {event.hadRegistered ? "Đã đăng ký tham gia" : "Đăng ký tham gia"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EventDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  fixedHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1e293b",
    flex: 1,
    textAlign: "center",
  },
  backBtn: { width: 40 },
  sliderContainer: { width: SCREEN_WIDTH, height: 260 },
  bannerImage: { width: SCREEN_WIDTH, height: 260 },
  pagination: {
    position: "absolute",
    bottom: 35,
    flexDirection: "row",
    alignSelf: "center",
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 4 },
  activeDot: { backgroundColor: "#fff", width: 20 },
  inactiveDot: { backgroundColor: "rgba(255, 255, 255, 0.5)" },
  contentCard: {
    padding: 20,
    marginTop: -24,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 12, fontWeight: "700" },
  likeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff1f2",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#fecdd3",
  },
  likeText: {
    marginLeft: 5,
    fontSize: 13,
    fontWeight: "700",
    color: "#e11d48",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 12,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
    gap: 8,
  },
  tagItem: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  tagText: { fontSize: 12, fontWeight: "600" },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  infoText: {
    fontSize: 15,
    color: "#475569",
    marginLeft: 10,
    fontWeight: "500",
  },
  divider: { height: 1, backgroundColor: "#f1f5f9", marginVertical: 20 },
  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1e293b",
    marginLeft: 8,
  },
  description: { fontSize: 15, color: "#475569", lineHeight: 22 },
  commentItem: { flexDirection: "row", marginBottom: 16 },
  commentAvatar: { width: 38, height: 38, borderRadius: 19, marginRight: 12 },
  commentContent: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 12,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  commentUser: { fontWeight: "700", color: "#1e293b", fontSize: 14 },
  commentTime: { fontSize: 11, color: "#94a3b8" },
  commentText: { color: "#334155", fontSize: 14, lineHeight: 20 },
  commentAttachedImage: {
    width: "100%",
    height: 160,
    borderRadius: 8,
    marginTop: 8,
  },
  commentInputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#f1f5f9",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginTop: 10,
  },
  input: { flex: 1, maxHeight: 100, fontSize: 15 },
  sendBtn: {
    backgroundColor: "#2563eb",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  organizerBox: { padding: 16, backgroundColor: "#f8fafc", borderRadius: 12 },
  organizerName: { fontSize: 16, fontWeight: "700", color: "#2563eb" },
  organizerSub: { fontSize: 14, color: "#64748b" },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "ios" ? 30 : 15,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    backgroundColor: "#fff",
  },
  btnQR: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eff6ff",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#bfdbfe",
    borderStyle: "dashed",
  },
  btnQRText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: "700",
    color: "#2563eb",
  },
  btnAction: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnDisabled: { backgroundColor: "#f1f5f9" },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
