import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AuthService from "@/services/AuthService";
import Toast from "react-native-toast-message";

const LoginScreen = () => {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    const res = await AuthService.login({ account, password });
    console.log(res);
    if (res.canAccess) {
      router.replace("/tabs/HomeScreen");
    } else {
      Toast.show({
        type: "error",
        text1: "Lỗi đăng nhập",
        text2:
          res.message == "Đăng nhập thành công"
            ? "Tài khoản của bạn không phù hợp"
            : res.message,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Giúp đẩy nội dung lên khi bàn phím hiện ra */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <View style={styles.headerBox}>
          <Text style={styles.title}>Xin chào!</Text>
          <Text style={styles.subtitle}>Đăng nhập để tiếp tục trải nghiệm</Text>
        </View>

        <View style={styles.form}>
          {/* Label Tài khoản */}
          <Text style={styles.label}>Tài khoản</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="person-outline"
              size={20}
              color="#2563eb"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email hoặc username"
              placeholderTextColor="#94a3b8"
              value={account}
              onChangeText={setAccount}
              autoCapitalize="none"
            />
          </View>

          {/* Label Mật khẩu */}
          <Text style={styles.label}>Mật khẩu</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#2563eb"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu của bạn"
              placeholderTextColor="#94a3b8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!isPasswordVisible}
            />
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              style={styles.eyeBtn}
            >
              <Ionicons
                name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
                size={22}
                color="#64748b"
              />
            </TouchableOpacity>
          </View>

          {/* Nút Login xanh chủ đạo */}
          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
            <Text style={styles.loginBtnText}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc", // Nền hơi xám xanh nhạt để làm nổi bật form trắng
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  headerBox: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1e3a8a", // Xanh đậm cho tiêu đề
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
  },
  form: {
    width: "100%",
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e40af", // Màu xanh text label
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#bfdbfe", // Màu xanh nhạt cho viền
    borderRadius: 16,
    marginBottom: 20,
    paddingHorizontal: 15,
    height: 60,
    // Đổ bóng nhẹ cho ô input
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1e293b",
  },
  eyeBtn: {
    padding: 5,
  },
  loginBtn: {
    backgroundColor: "#2563eb", // Chuẩn màu Blue-600
    height: 60,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  loginBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});
