import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ClipboardEdit,
  Clock,
  Building2,
  Send,
  CheckCircle2,
  Circle,
  ChevronLeft,
} from "lucide-react-native";
import { API_URL } from "@/services/Api";
import { formatDateToDDMMYYYY, formatToHHMM } from "@/utils/date";
import AuthService from "@/services/AuthService";

const DoSurveyScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [surveyData, setSurveyData] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Giả sử memberId lấy từ storage hoặc context. Ở đây tôi để fix theo data bạn cung cấp.

  const fetchSurvey = async (surveyId: any) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/surveys/${surveyId}`);
      const json = await res.json();

      if (json.data) {
        setSurveyData(json.data.survey);
        const qArray = Object.keys(json.data.survey)
          .filter((key) => !isNaN(Number(key)))
          .map((key) => json.data.survey[key]);
        setQuestions(qArray);
      }
    } catch (error) {
      console.error("Lỗi fetch khảo sát:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurvey(id);
  }, [id]);

  const handleAnswer = (questionId: string, value: any, type: string) => {
    setAnswers((prev) => {
      if (type === "multiple") {
        const currentAnswers = (prev[questionId] as string[]) || [];
        const newAnswers = currentAnswers.includes(value)
          ? currentAnswers.filter((i) => i !== value)
          : [...currentAnswers, value];
        return { ...prev, [questionId]: newAnswers };
      }
      return { ...prev, [questionId]: value };
    });
  };

  // Hàm gọi API trả lời cho từng câu hỏi
  const answerOneQuestion = async (data: any) => {
    const res = await fetch(`${API_URL}/api/answers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  };

  const handleSubmit = async () => {
    const myAccount = await AuthService.getMyAccount();
    const memberId = myAccount.member._id;
    // 1. Kiểm tra xem đã trả lời hết câu hỏi chưa
    if (Object.keys(answers).length < questions.length) {
      Alert.alert("Thông báo", "Vui lòng hoàn thành tất cả các câu hỏi.");
      return;
    }

    try {
      setSubmitting(true);

      // 2. Tạo mảng các payload cần gửi
      const payloads = questions.map((q) => {
        const value = answers[q._id];
        return {
          questionId: q._id,
          memberId: memberId,
          text: q.type === "text" ? value : "",
          // Nếu là single thì bọc value vào mảng, nếu multiple thì value đã là mảng
          options:
            q.type === "text" ? [""] : Array.isArray(value) ? value : [value],
        };
      });

      // 3. Gọi API lần lượt (hoặc song song bằng Promise.all)
      // Sử dụng for...of nếu bạn muốn gửi tuần tự để tránh quá tải server
      for (const payload of payloads) {
        await answerOneQuestion(payload);
      }

      Alert.alert("Thành công", "Bạn đã gửi khảo sát thành công!", [
        { text: "Đóng", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Lỗi khi gửi kết quả:", error);
      Alert.alert("Lỗi", "Không thể gửi kết quả khảo sát. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ marginTop: 10 }}>Đang tải khảo sát...</Text>
      </View>
    );

  if (!surveyData)
    return (
      <View style={styles.center}>
        <Text>Không có dữ liệu</Text>
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={24} color="#1e293b" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Làm khảo sát</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.infoCard}>
            <Text style={styles.surveyName}>{surveyData.name}</Text>
            <View style={styles.row}>
              <Building2 size={16} color="#64748b" />
              <Text style={styles.subText}>{surveyData.chapterId?.name}</Text>
            </View>
            <View style={styles.row}>
              <Clock size={16} color="#ef4444" />
              <Text style={styles.timeText}>
                Hạn: {formatToHHMM(surveyData.endedAt)} -{" "}
                {formatDateToDDMMYYYY(surveyData.endedAt)}
              </Text>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <ClipboardEdit size={20} color="#2563eb" />
            <Text style={styles.sectionTitle}>Nội dung khảo sát</Text>
          </View>

          {questions.map((q, index) => (
            <View key={q._id} style={styles.questionCard}>
              <Text style={styles.questionLabel}>
                Câu {index + 1} (
                {q.type === "text"
                  ? "Tự luận"
                  : q.type === "single"
                  ? "Chọn một"
                  : "Chọn nhiều"}
                )
              </Text>
              <Text style={styles.questionText}>{q.question}</Text>

              {q.type === "text" && (
                <TextInput
                  style={styles.textInput}
                  placeholder="Nhập câu trả lời..."
                  multiline
                  value={answers[q._id] || ""}
                  onChangeText={(text) => handleAnswer(q._id, text, "text")}
                />
              )}

              {(q.type === "single" || q.type === "multiple") && (
                <View style={styles.optionsContainer}>
                  {q.options.map((option: string, idx: number) => {
                    const isSelected =
                      q.type === "multiple"
                        ? answers[q._id]?.includes(option)
                        : answers[q._id] === option;

                    return (
                      <TouchableOpacity
                        key={idx}
                        style={[
                          styles.optionItem,
                          isSelected && styles.optionSelected,
                        ]}
                        onPress={() => handleAnswer(q._id, option, q.type)}
                      >
                        {isSelected ? (
                          <CheckCircle2 size={20} color="#2563eb" />
                        ) : (
                          <Circle size={20} color="#cbd5e1" />
                        )}
                        <Text
                          style={[
                            styles.optionText,
                            isSelected && styles.optionTextActive,
                          ]}
                        >
                          {option}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          ))}

          <TouchableOpacity
            style={[styles.submitBtn, submitting && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Send size={20} color="#fff" />
                <Text style={styles.submitBtnText}>Gửi kết quả</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default DoSurveyScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  headerTitle: { fontSize: 17, fontWeight: "700", color: "#1e293b" },
  scrollContent: { padding: 16 },
  infoCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  surveyName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 12,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  subText: { fontSize: 14, color: "#64748b" },
  timeText: { fontSize: 14, color: "#ef4444", fontWeight: "500" },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#1e293b" },
  questionCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  questionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2563eb",
    marginBottom: 4,
  },
  questionText: {
    fontSize: 16,
    color: "#1e293b",
    fontWeight: "600",
    marginBottom: 16,
  },
  textInput: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: "top",
  },
  optionsContainer: { gap: 10 },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#fff",
  },
  optionSelected: {
    borderColor: "#2563eb",
    backgroundColor: "#eff6ff",
  },
  optionText: { marginLeft: 10, fontSize: 15, color: "#475569" },
  optionTextActive: { color: "#2563eb", fontWeight: "600" },
  submitBtn: {
    backgroundColor: "#2563eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginBottom: 40,
  },
  submitBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
