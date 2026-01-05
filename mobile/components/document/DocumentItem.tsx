import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { FileText, Calendar, FileDown, Building2 } from "lucide-react-native";
import { formatDateToDDMMYYYY } from "@/utils/date";

// Đổi cách import theo gợi ý của Expo Error
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

const documentTypes: any = {
  baoCao: { label: "Báo cáo", color: "#3b82f6" },
  huongDan: { label: "Hướng dẫn", color: "#6366f1" },
  keHoach: { label: "Kế hoạch", color: "#06b6d4" },
  congVan: { label: "Công văn", color: "#64748b" },
  ketLuan: { label: "Kết luận", color: "#10b981" },
  quyetDinh: { label: "Quyết định", color: "#ef4444" },
  thongBao: { label: "Thông báo", color: "#eab308" },
  nghiQuyet: { label: "Nghị quyết", color: "#a855f7" },
  quyDinh: { label: "Quy định", color: "#475569" },
  chiThi: { label: "Chỉ thị", color: "#f97316" },
  thongTri: { label: "Thông tri", color: "#14b8a6" },
  taiLieuChiDoan: { label: "Tài liệu sinh hoạt chi đoàn", color: "#22c55e" },
  taiLieuCLB: { label: "Tài liệu sinh hoạt CLB Lý luận trẻ", color: "#ec4899" },
};

const DocumentItem = ({ data }: { data: any }) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!data?.file?.url) {
      return Alert.alert("Thông báo", "Tài liệu này không có tệp đính kèm.");
    }

    setDownloading(true);
    try {
      // Sử dụng cacheDirectory từ FileSystem legacy
      const fileName = `Document_${data.docCode || data._id}.pdf`.replace(
        /\//g,
        "_"
      );
      const fileUri = FileSystem.cacheDirectory + fileName;

      // Gọi downloadAsync từ bản legacy
      const downloadRes = await FileSystem.downloadAsync(
        data.file.url,
        fileUri
      );

      if (downloadRes.status === 200) {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(downloadRes.uri);
        } else {
          Alert.alert("Thành công", "Tài liệu đã được tải về bộ nhớ tạm.");
        }
      } else {
        throw new Error("Download status not 200");
      }
    } catch (error) {
      console.error("Download Error:", error);
      Alert.alert("Lỗi", "Không thể tải tài liệu. Vui lòng thử lại sau.");
    } finally {
      setDownloading(false);
    }
  };

  const typeConfig = documentTypes[data?.type] || {
    label: "Tài liệu",
    color: "#64748b",
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View
          style={[styles.iconBox, { backgroundColor: `${typeConfig.color}15` }]}
        >
          <FileText size={22} color={typeConfig.color} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.docCode} numberOfLines={1}>
            Số hiệu: {data?.docCode || "N/A"}
          </Text>
          <View
            style={[styles.typeBadge, { backgroundColor: typeConfig.color }]}
          >
            <Text style={styles.typeText}>{typeConfig.label}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.docName} numberOfLines={2}>
        {data?.name}
      </Text>

      <View style={styles.details}>
        <View style={styles.infoLine}>
          <Building2 size={14} color="#64748b" />
          <Text style={styles.infoText} numberOfLines={1}>
            {data?.chapterId?.name}
          </Text>
        </View>
        <View style={styles.infoLine}>
          <Calendar size={14} color="#64748b" />
          <Text style={styles.infoText}>
            Ngày ban hành: {formatDateToDDMMYYYY(data?.issuedAt)}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.downloadButton, downloading && styles.buttonDisabled]}
        onPress={handleDownload}
        disabled={downloading}
      >
        {downloading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <FileDown size={18} color="#fff" />
        )}
        <Text style={styles.downloadButtonText}>
          {downloading ? "Đang tải..." : "Tải về máy (.pdf)"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default DocumentItem;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    elevation: 2,
  },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  docCode: { fontSize: 13, fontWeight: "600", color: "#64748b", flex: 1 },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  typeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#fff",
    textTransform: "uppercase",
  },
  docName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 12,
  },
  details: {
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 12,
    gap: 8,
    marginBottom: 16,
  },
  infoLine: { flexDirection: "row", alignItems: "center", gap: 8 },
  infoText: { fontSize: 13, color: "#475569" },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  buttonDisabled: { backgroundColor: "#93c5fd" },
  downloadButtonText: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
