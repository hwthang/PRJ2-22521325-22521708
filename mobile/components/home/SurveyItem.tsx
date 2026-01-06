import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { ClipboardList, Clock, ArrowRight } from "lucide-react-native";
import { formatDateToDDMMYYYY, formatDateToDDMMYYYYHHMM } from "@/utils/date";
import { router } from "expo-router";

const SurveyItem = ({ data }: { data: any }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => router.push(`/main/screen/SurveyResultScreen?id=${data?._id}`)}
    >
      {/* Icon đại diện cho Khảo sát */}
      <View style={styles.iconContainer}>
        <ClipboardList color="#2563eb" size={24} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {data?.name || "Khảo sát không tiêu đề"}
        </Text>

        <View style={styles.timeRow}>
          <Clock size={12} color="#64748b" />
          <Text style={styles.timeText}>
            {formatDateToDDMMYYYYHHMM(data?.startedAt)} -{" "}
            {formatDateToDDMMYYYYHHMM(data?.endedAt)}
          </Text>
        </View>

        <Text style={styles.createdText}>
          Hoàn thành: {formatDateToDDMMYYYYHHMM(data?.createdAt)}
        </Text>
      </View>

      {/* Mũi tên chỉ dẫn */}
      <ArrowRight color="#cbd5e1" size={18} />
    </TouchableOpacity>
  );
};

export default SurveyItem;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    // Đổ bóng nhẹ để tách biệt khỏi nền
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#eff6ff", // Xanh nhạt Blue-50
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    marginHorizontal: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: "#64748b",
  },
  createdText: {
    fontSize: 11,
    color: "#94a3b8",
    marginTop: 2,
  },
});
