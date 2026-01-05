import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { ClipboardCheck, Calendar, Clock, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react-native";
import { formatDateToDDMMYYYY } from "@/utils/date";

const SurveyItem = ({ data, onPress }: { data: any; onPress?: () => void }) => {
  // Kiểm tra trạng thái khảo sát
  const isCompleted = data?.isDone === true;
  const isExpired = new Date(data?.endedAt) < new Date();

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      {/* Cột trái: Icon trạng thái */}
      <View style={[
        styles.statusIndicator, 
        { backgroundColor: isCompleted ? "#f0fdf4" : isExpired ? "#fef2f2" : "#eff6ff" }
      ]}>
        {isCompleted ? (
          <CheckCircle2 size={24} color="#16a34a" />
        ) : isExpired ? (
          <AlertCircle size={24} color="#dc2626" />
        ) : (
          <ClipboardCheck size={24} color="#2563eb" />
        )}
      </View>

      {/* Cột giữa: Nội dung */}
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.chapterName} numberOfLines={1}>
            {data?.chapterId?.name || "Chi đoàn"}
          </Text>
          <View style={[
            styles.badge, 
            { backgroundColor: isCompleted ? "#dcfce7" : isExpired ? "#fee2e2" : "#dbeafe" }
          ]}>
            <Text style={[
              styles.badgeText, 
              { color: isCompleted ? "#16a34a" : isExpired ? "#dc2626" : "#2563eb" }
            ]}>
              {isCompleted ? "Hoàn thành" : isExpired ? "Hết hạn" : "Chưa làm"}
            </Text>
          </View>
        </View>

        <Text style={styles.surveyName} numberOfLines={2}>
          {data?.name}
        </Text>

        <View style={styles.footerRow}>
          <View style={styles.timeInfo}>
            <Calendar size={14} color="#64748b" />
            <Text style={styles.timeText}>{formatDateToDDMMYYYY(data?.startedAt)}</Text>
          </View>
          <View style={styles.timeInfo}>
            <Clock size={14} color="#64748b" />
            <Text style={[styles.timeText, isExpired && !isCompleted && { color: "#dc2626" }]}>
              Hết hạn: {formatDateToDDMMYYYY(data?.endedAt)}
            </Text>
          </View>
        </View>
      </View>

      {/* Cột phải: Mũi tên */}
      <View style={styles.rightAction}>
        <ChevronRight size={20} color="#cbd5e1" />
      </View>
    </TouchableOpacity>
  );
};

export default SurveyItem;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f1f5f9",
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statusIndicator: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    marginLeft: 12,
    marginRight: 4,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  chapterName: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  surveyName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 8,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  timeInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: "#64748b",
  },
  rightAction: {
    marginLeft: 4,
  },
});