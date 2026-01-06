import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import SurveyService from "@/services/SurveyService";
import {
  User,
  Calendar,
  MapPin,
  CheckCircle2,
  ClipboardList,
} from "lucide-react-native";
import { formatDateToDDMMYYYY } from "@/utils/date"; // Giả sử bạn đã có hàm này
import defAvatar from "../../../assets/images/avatar.png";
const SurveyResultScreen = () => {
  const { id } = useLocalSearchParams();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchResult = async (surveyId: any) => {
    try {
      setLoading(true);
      const res = await SurveyService.fetchSurveyResultById(surveyId);
      setResult(res);
    } catch (error) {
      console.error("Lỗi fetch result:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResult(id);
  }, [id]);

  if (loading)
    return (
      <View style={styles.center}>
        <Text>Đang tải kết quả...</Text>
      </View>
    );
  if (!result)
    return (
      <View style={styles.center}>
        <Text>Không tìm thấy dữ liệu</Text>
      </View>
    );

  const { member, answers, completedAt } = result;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Phần Header: Thông tin thành viên */}
        <View style={styles.headerCard}>
          <View style={styles.profileRow}>
            <Image
              source={
                member.accountId?.avatar?.url
                  ? { uri: member.accountId?.avatar?.url }
                  : defAvatar
              }
              style={styles.avatar}
            />
            <View style={styles.headerInfo}>
              <Text style={styles.fullName}>{member.fullName}</Text>
              <Text style={styles.memberCode}>Mã số: {member.memberCode}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{member.position}</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Calendar size={16} color="#64748b" />
              <Text style={styles.infoValue}>
                {formatDateToDDMMYYYY(completedAt)}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <MapPin size={16} color="#64748b" />
              <Text style={styles.infoValue} numberOfLines={1}>
                {member.address}
              </Text>
            </View>
          </View>
        </View>

        {/* Phần Nội dung: Các câu trả lời */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <ClipboardList size={20} color="#1e293b" />
            <Text style={styles.sectionTitle}>Nội dung khảo sát</Text>
          </View>

          {answers.map((item: any, index: number) => (
            <View key={item.questionId || index} style={styles.answerCard}>
              <View style={styles.questionHeader}>
                <Text style={styles.questionNumber}>Câu {index + 1}</Text>
                <View style={styles.typeTag}>
                  <Text style={styles.typeTagText}>
                    {item.type.toUpperCase()}
                  </Text>
                </View>
              </View>

              <Text style={styles.questionText}>{item.question}</Text>

              <View style={styles.answerBox}>
                <CheckCircle2 size={16} color="#10b981" />
                <Text style={styles.answerText}>{item.answer}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SurveyResultScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerCard: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  profileRow: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f1f5f9",
  },
  headerInfo: { marginLeft: 16, flex: 1 },
  fullName: { fontSize: 18, fontWeight: "800", color: "#1e293b" },
  memberCode: { fontSize: 13, color: "#64748b", marginTop: 2 },
  badge: {
    backgroundColor: "#eff6ff",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 6,
  },
  badgeText: { color: "#2563eb", fontSize: 11, fontWeight: "700" },
  divider: { height: 1, backgroundColor: "#f1f5f9", marginVertical: 16 },
  infoGrid: { flexDirection: "row", justifyContent: "space-between" },
  infoItem: { flexDirection: "row", alignItems: "center", gap: 6, flex: 1 },
  infoValue: { fontSize: 13, color: "#475569" },

  section: { paddingHorizontal: 16, paddingBottom: 30 },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 17, fontWeight: "700", color: "#1e293b" },

  answerCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#2563eb",
  },
  questionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  questionNumber: { fontSize: 12, fontWeight: "700", color: "#64748b" },
  typeTag: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  typeTagText: { fontSize: 10, color: "#94a3b8", fontWeight: "700" },
  questionText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 12,
  },
  answerBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f0fdf4",
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  answerText: { flex: 1, fontSize: 14, color: "#166534", lineHeight: 20 },
});
