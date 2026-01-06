import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import defAvatar from "../../assets/images/avatar.png";
import { Link } from "expo-router";
import { Calendar, MapPin } from "lucide-react-native";
import { formatDateToDDMMYYYY } from "@/utils/date";
import EventService from "@/services/EventService";

const EventItem = ({ data }: { data: any }) => {
  // --- Hàm xử lý trạng thái ---
  const getStatus = () => {
    const now = new Date();
    const start = new Date(data?.startedAt);
    const end = new Date(data?.endedAt);

    if (now < start) {
      return { label: "Sắp diễn ra", color: "#f59e0b", bgColor: "#fef3c7" }; // Vàng
    } else if (now >= start && now <= end) {
      return { label: "Đang diễn ra", color: "#10b981", bgColor: "#d1fae5" }; // Xanh lá
    } else {
      return { label: "Đã kết thúc", color: "#ef4444", bgColor: "#fee2e2" }; // Đỏ
    }
  };

  const status = getStatus();

  return (
    <Link href={`/main/screen/EventDetailScreen?id=${data?._id}`} asChild>
      <TouchableOpacity style={styles.card}>
        <View style={styles.imageContainer}>
          <Image
            source={
              data?.images?.[0]?.url ? { uri: data?.images[0].url } : defAvatar
            }
            style={styles.image}
          />
          {/* Nhãn trạng thái đè lên ảnh hoặc nằm dưới tiêu đề tùy bạn, ở đây mình để góc ảnh cho gọn */}
          <View
            style={[styles.statusBadge, { backgroundColor: status.bgColor }]}
          >
            <Text style={[styles.statusText, { color: status.color }]}>
              {status.label}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {data?.name}
          </Text>

          <View style={styles.infoRow}>
            <MapPin size={14} color="#64748b" />
            <Text style={styles.infoText} numberOfLines={1}>
              {data?.venue}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Calendar size={14} color="#64748b" />
            <Text style={styles.infoText}>
              {formatDateToDDMMYYYY(data?.startedAt)} - {formatDateToDDMMYYYY(data?.endedAt)}
            </Text>
          </View>

          {/* Tags */}
          <View style={styles.tagContainer}>
            {data?.tags?.map((item: string) => {
              const topic =
                EventService.eventTopics[
                  item as keyof typeof EventService.eventTopics
                ];
              if (!topic) return null;
              return (
                <View key={item} style={styles.tag}>
                  <Text style={styles.tagText}>{topic.label}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default EventItem;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    height: 95,
    width: 95,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
  },
  statusBadge: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    paddingVertical: 2,
    alignItems: "center",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  infoText: {
    fontSize: 13,
    color: "#64748b",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tag: {
    backgroundColor: "#eff6ff",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    color: "#2563eb",
    fontWeight: "600",
  },
});
