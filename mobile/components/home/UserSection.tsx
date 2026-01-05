import { Image, StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import React from "react";
import defAvatar from "../../assets/images/avatar.png";
import { Link, useRouter } from "expo-router";
import { Edit2, LogOut } from "lucide-react-native";

const UserSection = ({ data }: { data: any }) => {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc chắn muốn thoát tài khoản không?",
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Đăng xuất", 
          style: "destructive",
          onPress: () => {
            // Thêm logic xóa token/storage ở đây
            console.log("Logged out");
            router.replace('/(auth)'); // Điều hướng về trang login
          } 
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Nút Đăng xuất ở góc trái */}
      <View style={styles.logoutWrapper}>
        <TouchableOpacity onPress={handleLogout} hitSlop={20}>
          <LogOut color="#fff" size={20} opacity={0.8} />
        </TouchableOpacity>
      </View>

      {/* Nút Sửa ở góc phải */}
      <View style={styles.editWrapper}>
        <Link href={`/screen/EditProfileScreen?id=${data?._id}`} asChild>
          <TouchableOpacity hitSlop={20}>
            <Edit2 color="#fff" size={20} opacity={0.8} />
          </TouchableOpacity>
        </Link>
      </View>

      {/* Avatar tối giản */}
      <Image
        source={data?.avatar?.url ? { uri: data?.avatar?.url } : defAvatar}
        style={styles.avatar}
      />

      {/* Thông tin chính */}
      <View style={styles.infoBox}>
        <Text style={styles.fullName}>{data?.member?.fullName || "Người dùng"}</Text>
        <Text style={styles.subInfo}>
          {data?.member?.memberCode} • {data?.member?.position}
        </Text>
      </View>
    </View>
  );
};

export default UserSection;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2563eb", // Blue-600
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: "center",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    position: "relative",
  },
  logoutWrapper: {
    position: "absolute",
    top: 55,
    left: 25, // Đặt bên trái
  },
  editWrapper: {
    position: "absolute",
    top: 55,
    right: 25, // Đặt bên phải
  },
  avatar: {
    height: 90,
    width: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: "#fff",
    marginBottom: 12,
  },
  infoBox: {
    alignItems: "center",
  },
  fullName: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
  },
  subInfo: {
    color: "#dbeafe",
    fontSize: 14,
    marginTop: 4,
    fontWeight: "500",
  },
});