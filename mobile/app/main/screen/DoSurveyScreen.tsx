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
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Send,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react-native";
import { API_URL } from "@/services/Api";
import AuthService from "@/services/AuthService";

const { width } = Dimensions.get("window");

const DoSurveyScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // States
  const [surveyData, setSurveyData] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 1. Tải dữ liệu khảo sát
  const fetchSurvey = async (surveyId: any) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/surveys/${surveyId}`);
      const json = await res.json();

      if (json.data) {
        setSurveyData(json.data.survey);
        // Chuyển đổi object câu hỏi thành mảng
        const qArray = Object.keys(json.data.survey)
          .filter((key) => !isNaN(Number(key)))
          .map((key) => json.data.survey[key]);
        setQuestions(qArray);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải dữ liệu khảo sát.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurvey(id);
  }, [id]);

  // 2. Hàm xử lý lưu câu trả lời (Lưu INDEX cho trắc nghiệm)
  const handleAnswer = (questionId: string, value: any, type: string) => {
    setAnswers((prev) => {
      const currentVal = prev[questionId];
      if (type === "multiple") {
        const currentArr = Array.isArray(currentVal) ? currentVal : [];
        // value lúc này là index (number)
        const newArr = currentArr.includes(value)
          ? currentArr.filter((i) => i !== value)
          : [...currentArr, value];
        return { ...prev, [questionId]: newArr };
      }
      // Đối với text: value là string | Đối với single: value là index (number)
      return { ...prev, [questionId]: value };
    });
  };

  // 3. Kiểm tra trạng thái hoàn thành của câu hỏi hiện tại
  const isCurrentQuestionAnswered = () => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return false;
    const ans = answers[currentQ._id];

    if (currentQ.type === "text") {
      return ans && ans.trim().length > 0;
    }
    // Dùng check undefined/null vì index có thể là 0 (falsy value)
    if (currentQ.type === "multiple") {
      return ans && ans.length > 0;
    }
    return ans !== undefined && ans !== null; 
  };

  // 4. Gửi kết quả
  const handleSubmit = async () => {
    if (!isCurrentQuestionAnswered()) {
      return Alert.alert("Thông báo", "Vui lòng hoàn thành câu hỏi cuối cùng.");
    }

    const myAccount = await AuthService.getMyAccount();
    const memberId = myAccount?.member?._id;
    if (!memberId) return Alert.alert("Lỗi", "Vui lòng đăng nhập lại.");

    try {
      setSubmitting(true);

      const payloads = questions.map((q) => {
        const value = answers[q._id];
        return {
          questionId: q._id,
          memberId: memberId,
          text: q.type === "text" ? value : "",
          // Lưu ý: value lúc này đã là index (số)
          options: q.type === "text" ? [""] : Array.isArray(value) ? value : [value],
        };
      });

      console.log("=== PAYLOAD GỬI ĐI (INDEX) ===", JSON.stringify(payloads, null, 2));

      await Promise.all(
        payloads.map((payload, index) => {
          console.log(`=> Gửi câu ${index + 1}:`, payload);
          return fetch(`${API_URL}/api/answers`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }).then(res => res.json());
        })
      );

      Alert.alert("Thành công", "Bạn đã gửi khảo sát thành công!", [
        { text: "Đóng", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Lỗi submit:", error);
      Alert.alert("Lỗi", "Không thể gửi kết quả.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Đang tải câu hỏi...</Text>
      </View>
    );

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? (currentIndex + 1) / questions.length : 0;
  const canGoNext = isCurrentQuestionAnswered();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Thanh tiến trình */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerInfo}>
            <View>
              <Text style={styles.stepText}>CÂU HỎI {currentIndex + 1} / {questions.length}</Text>
              <Text style={styles.surveyName} numberOfLines={1}>{surveyData?.name}</Text>
            </View>
            {!canGoNext && (
              <View style={styles.badgeRequired}>
                <AlertCircle size={12} color="#f59e0b" />
                <Text style={styles.badgeText}>Bắt buộc</Text>
              </View>
            )}
          </View>

          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{currentQuestion?.question}</Text>

            {/* Render câu hỏi dạng TEXT */}
            {currentQuestion?.type === "text" && (
              <TextInput
                style={styles.textInput}
                placeholder="Nhập câu trả lời của bạn..."
                multiline
                value={answers[currentQuestion._id] || ""}
                onChangeText={(text) => handleAnswer(currentQuestion._id, text, "text")}
              />
            )}

            {/* Render câu hỏi dạng SINGLE/MULTIPLE (Lưu index) */}
            {(currentQuestion?.type === "single" || currentQuestion?.type === "multiple") && (
              <View style={styles.optionsList}>
                {currentQuestion.options.map((option: string, idx: number) => {
                  const isSelected = currentQuestion.type === "multiple"
                    ? answers[currentQuestion._id]?.includes(idx)
                    : answers[currentQuestion._id] === idx;

                  return (
                    <TouchableOpacity
                      key={idx}
                      activeOpacity={0.7}
                      style={[styles.optionItem, isSelected && styles.optionSelected]}
                      onPress={() => handleAnswer(currentQuestion._id, idx, currentQuestion.type)}
                    >
                      <Text style={[styles.optionText, isSelected && styles.optionTextActive]}>{option}</Text>
                      <View style={[styles.radio, isSelected && styles.radioActive]}>
                        {isSelected && <CheckCircle2 size={16} color="#fff" />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>

        {/* Nút điều hướng */}
        <View style={styles.footer}>
          <View style={styles.buttonGroup}>
            {currentIndex > 0 && (
              <TouchableOpacity style={styles.backBtn} onPress={() => setCurrentIndex(currentIndex - 1)}>
                <ChevronLeft size={24} color="#64748b" />
              </TouchableOpacity>
            )}

            {currentIndex < questions.length - 1 ? (
              <TouchableOpacity
                style={[styles.nextBtn, !canGoNext && styles.btnDisabled]}
                disabled={!canGoNext}
                onPress={() => setCurrentIndex(currentIndex + 1)}
              >
                <Text style={styles.nextBtnText}>Tiếp tục</Text>
                <ChevronRight size={20} color="#fff" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.submitBtn, (!canGoNext || submitting) && styles.btnDisabled]}
                disabled={!canGoNext || submitting}
                onPress={handleSubmit}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.submitBtnText}>Hoàn thành</Text>
                    <Send size={18} color="#fff" />
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default DoSurveyScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f8faff" },
  loadingText: { marginTop: 12, color: "#64748b", fontWeight: "600" },
  progressContainer: { height: 6, backgroundColor: "#f1f5f9", width: "100%" },
  progressBar: { height: 6, backgroundColor: "#2563eb" },
  scrollContent: { padding: 24, paddingBottom: 100 },
  headerInfo: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 },
  stepText: { fontSize: 11, fontWeight: "900", color: "#2563eb", letterSpacing: 1, marginBottom: 4 },
  surveyName: { fontSize: 14, fontWeight: "600", color: "#94a3b8", maxWidth: width * 0.6 },
  badgeRequired: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#fffbeb", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 10, fontWeight: "700", color: "#f59e0b" },
  questionContainer: { minHeight: 300 },
  questionText: { fontSize: 22, fontWeight: "800", color: "#1e293b", lineHeight: 30, marginBottom: 24 },
  textInput: { backgroundColor: "#f8fafc", borderRadius: 20, padding: 20, fontSize: 16, color: "#334155", minHeight: 150, textAlignVertical: "top", borderWidth: 1, borderColor: "#e2e8f0" },
  optionsList: { gap: 12 },
  optionItem: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 18, borderRadius: 16, borderWidth: 2, borderColor: "#f1f5f9", backgroundColor: "#f8fafc" },
  optionSelected: { borderColor: "#2563eb", backgroundColor: "#eff6ff" },
  optionText: { fontSize: 16, fontWeight: "600", color: "#64748b", flex: 1 },
  optionTextActive: { color: "#1e3a8a" },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: "#cbd5e1", alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  radioActive: { borderColor: "#2563eb", backgroundColor: "#2563eb" },
  footer: { position: "absolute", bottom: 0, width: "100%", padding: 20, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: "#f1f5f9" },
  buttonGroup: { flexDirection: "row", gap: 12 },
  backBtn: { width: 56, height: 56, backgroundColor: "#f1f5f9", borderRadius: 16, alignItems: "center", justifyContent: "center" },
  nextBtn: { flex: 1, height: 56, backgroundColor: "#2563eb", borderRadius: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  nextBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  submitBtn: { flex: 1, height: 56, backgroundColor: "#1e293b", borderRadius: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  submitBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  btnDisabled: { opacity: 0.3 },
});