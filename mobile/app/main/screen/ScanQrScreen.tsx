import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { ChevronLeft, X } from "lucide-react-native";
import EventService from "@/services/EventService";

const { width } = Dimensions.get("window");

const ScanQrScreen = () => {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  // Yêu cầu quyền camera khi vào màn hình
  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  // Nếu đang đợi cấp quyền
  if (!permission) {
    return <View style={styles.container} />;
  }

  // Nếu người dùng từ chối quyền truy cập
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.textCenter}>Chúng tôi cần quyền truy cập camera để quét QR</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Cấp quyền</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Hàm xử lý khi quét trúng mã QR
  // ... các import cũ


// Trong component ScanQrScreen...

const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
  setScanned(true);
  console.log("--- DỮ LIỆU QR GỐC ---", data);

  try {
    // 1. Giải mã chuỗi JSON từ QR
    const qrData = JSON.parse(data);

    // 2. Kiểm tra tính hợp lệ của dữ liệu
    if (qrData.action === "CHECK_IN" && qrData.eventId) {
      console.log("Đang tiến hành check-in cho Event ID:", qrData.eventId);

      // 3. Gọi đến EventService (giả định tên hàm là checkInEvent)
      // Bạn hãy điều chỉnh tên hàm đúng với thực tế trong EventService của bạn
      const response = await EventService.checkIn(qrData.eventId);

      if (response) {
        Alert.alert("Thành công", "Bạn đã điểm danh thành công!");
        router.back(); // Quay lại màn hình chi tiết sau khi thành công
      }
    } else {
      Alert.alert("Lỗi", "Mã QR không hợp lệ cho việc điểm danh.");
    }
  } catch (error: any) {
    console.error("Lỗi xử lý QR hoặc Check-in:", error);
    
    // Xử lý thông báo lỗi từ Server nếu có
    const errorMessage = error.response?.data?.message || "Không thể thực hiện điểm danh. Vui lòng thử lại.";
    Alert.alert("Thông báo", errorMessage);
  } finally {
    // Đợi một khoảng thời gian ngắn trước khi cho phép quét lại (nếu chưa thoát màn hình)
    setTimeout(() => setScanned(false), 3000);
  }
};

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"], // Chỉ tập trung quét QR
        }}
      >
        {/* Lớp phủ Giao diện (Overlay) */}
        <View style={styles.overlay}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
              <X color="#fff" size={30} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Quét mã QR</Text>
          </View>

          <View style={styles.unfocusedContainer}></View>

          <View style={styles.middleContainer}>
            <View style={styles.unfocusedContainer}></View>
            {/* Khung vuông quét QR */}
            <View style={styles.focusedContainer}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
            </View>
            <View style={styles.unfocusedContainer}></View>
          </View>

          <View style={styles.bottomContainer}>
            <Text style={styles.hintText}>Đưa mã QR vào khung để quét điểm danh</Text>
          </View>
        </View>
      </CameraView>
    </View>
  );
};

export default ScanQrScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
  },
  textCenter: {
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 30,
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 10,
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    marginRight: 30,
  },
  closeBtn: {
    zIndex: 10,
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  middleContainer: {
    flexDirection: "row",
    height: 250,
  },
  focusedContainer: {
    width: 250,
    height: 250,
    backgroundColor: "transparent",
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingTop: 20,
    alignItems: "center",
  },
  hintText: {
    color: "#fff",
    fontSize: 14,
  },
  // Style cho 4 góc khung quét
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: "#2563eb",
    borderWidth: 4,
  },
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
});