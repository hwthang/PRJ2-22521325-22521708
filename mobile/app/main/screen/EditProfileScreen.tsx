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
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ChevronLeft,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Clock,
  BookOpen,
} from "lucide-react-native";
import MemberService from "@/services/MemberService";
import { API_URL } from "@/services/Api";

const EditProfileScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // State quản lý form dữ liệu đúng cấu trúc mẫu gửi đi
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    fullName: "",
    gender: "",
    dateOfBirth: "",
    hometown: "",
    address: "",
    ethnicity: "",
    religion: "",
    education: "",
    qualification: "",
    politicalTheory: "",
    joinedAt: "",
    position: "",
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/members`);
      const json = await res.json();

      // Tìm member dựa trên accountId._id khớp với id từ params
      const member = json.data.members.find(
        (item: any) => item.accountId?._id === id
      );

      if (member) {
        // Cập nhật state dựa trên cấu trúc dữ liệu mới
        setFormData({
          // Lấy từ object accountId lồng bên trong
          username: member.accountId?.username || "",
          email: member.accountId?.email || "",
          phoneNumber: member.accountId?.phoneNumber || "",
          
          // Lấy trực tiếp từ object member
          fullName: member.fullName || "",
          gender: member.gender || "",
          dateOfBirth: member.dateOfBirth ? member.dateOfBirth.split("T")[0] : "",
          hometown: member.hometown || "",
          address: member.address || "",
          ethnicity: member.ethnicity || "",
          religion: member.religion || "",
          education: member.education || "",
          qualification: member.qualification || "",
          politicalTheory: member.politicalTheory || "",
          joinedAt: member.joinedAt ? member.joinedAt.split("T")[0] : "",
          position: member.position || "",
        });
      }
    } catch (error) {
      console.error("Lỗi khi tải thông tin:", error);
      Alert.alert("Lỗi", "Không thể tải dữ liệu người dùng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProfile();
  }, [id]);

  const handleUpdate = async () => {
    try {
      // Gọi service update với dữ liệu từ formData
      const res = await MemberService.updateMemberById(id as string, formData);
      
      if (res) {
        Alert.alert("Thành công", "Thông tin hồ sơ đã được cập nhật.");
        router.back();
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      Alert.alert("Lỗi", "Cập nhật thất bại. Vui lòng thử lại sau.");
    }
  };

  const renderInput = (
    label: string,
    value: string,
    key: string,
    icon?: any,
    placeholder?: string
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        {icon}
        <TextInput
          style={[styles.input, !icon && { marginLeft: 0 }]}
          value={value}
          onChangeText={(text) => setFormData({ ...formData, [key]: text })}
          placeholder={placeholder || label}
          placeholderTextColor="#94a3b8"
        />
      </View>
    </View>
  );

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ marginTop: 10, color: "#64748b" }}>Đang tải dữ liệu...</Text>
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={20}>
            <ChevronLeft color="#1e293b" size={28} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chỉnh sửa hồ sơ</Text>
          <TouchableOpacity onPress={handleUpdate} hitSlop={20}>
            <Save color="#2563eb" size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Section 1: Tài khoản */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin tài khoản</Text>
            {renderInput("Tên đăng nhập", formData.username, "username", <User size={18} color="#64748b" />)}
            {renderInput("Email", formData.email, "email", <Mail size={18} color="#64748b" />)}
            {renderInput("Số điện thoại", formData.phoneNumber, "phoneNumber", <Phone size={18} color="#64748b" />)}
          </View>

          {/* Section 2: Thông tin cá nhân */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
            {renderInput("Họ và tên", formData.fullName, "fullName", <User size={18} color="#64748b" />)}
            
            <View style={styles.rowInputs}>
              <View style={{ flex: 1 }}>
                {renderInput("Giới tính", formData.gender, "gender")}
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                {renderInput("Dân tộc", formData.ethnicity, "ethnicity")}
              </View>
            </View>

            {renderInput("Ngày sinh (YYYY-MM-DD)", formData.dateOfBirth, "dateOfBirth", <Clock size={18} color="#64748b" />)}
            {renderInput("Quê quán", formData.hometown, "hometown", <MapPin size={18} color="#64748b" />)}
            {renderInput("Địa chỉ hiện tại", formData.address, "address", <MapPin size={18} color="#64748b" />)}
            {renderInput("Tôn giáo", formData.religion, "religion")}
          </View>

          {/* Section 3: Học vấn & Tổ chức */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Học vấn & Tổ chức</Text>
            {renderInput("Trình độ văn hóa", formData.education, "education", <BookOpen size={18} color="#64748b" />)}
            {renderInput("Trình độ chuyên môn", formData.qualification, "qualification", <BookOpen size={18} color="#64748b" />)}
            {renderInput("Lý luận chính trị", formData.politicalTheory, "politicalTheory", <Briefcase size={18} color="#64748b" />)}
            {renderInput("Ngày vào đoàn", formData.joinedAt, "joinedAt", <Clock size={18} color="#64748b" />)}
            {renderInput("Chức vụ", formData.position, "position", <Briefcase size={18} color="#64748b" />)}
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
            <Text style={styles.saveBtnText}>Lưu thay đổi</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    height: 120,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#1e293b" },
  scrollContent: { padding: 16 },
  section: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#2563eb",
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "600", color: "#64748b", marginBottom: 6 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  input: { flex: 1, height: 48, fontSize: 15, color: "#1e293b", marginLeft: 10 },
  rowInputs: { flexDirection: "row" },
  saveBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 40,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});