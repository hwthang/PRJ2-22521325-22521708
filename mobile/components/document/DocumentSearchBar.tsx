import { StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Search, RotateCcw, X, FileStack } from "lucide-react-native";
import { MultiSelect } from "react-native-element-dropdown";

// Khai báo documentTypes theo dữ liệu bạn cung cấp
export const documentTypes = {
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

// Chuyển sang format cho Dropdown
const typeOptions = Object.entries(documentTypes).map(([key, value]) => ({
  label: value.label,
  value: key,
}));

const DocumentSearchBar = ({ onFilterChange }: { onFilterChange: (filters: any) => void }) => {
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const handleApplyFilter = (newSearch: string, newTypes: string[]) => {
    onFilterChange({ search: newSearch, types: newTypes });
  };

  const clearAll = () => {
    setSearch("");
    setSelectedTypes([]);
    onFilterChange({ search: "", types: [] });
  };

  return (
    <View style={styles.container}>
      {/* HÀNG 1: TÌM KIẾM TEXT */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Search size={18} color="#64748b" />
          <TextInput
            style={styles.input}
            placeholder="Tìm mã số hoặc tên tài liệu..."
            value={search}
            placeholderTextColor="#94a3b8"
            onChangeText={(txt) => {
              setSearch(txt);
              handleApplyFilter(txt, selectedTypes);
            }}
          />
          {search !== "" && (
            <TouchableOpacity onPress={() => { setSearch(""); handleApplyFilter("", selectedTypes); }}>
              <X size={18} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.resetBtn} onPress={clearAll}>
          <RotateCcw size={18} color="#2563eb" />
          <Text style={styles.resetText}>Xóa</Text>
        </TouchableOpacity>
      </View>

      {/* HÀNG 2: LỌC THEO LOẠI TÀI LIỆU */}
      <View style={styles.filterRow}>
        <View style={styles.labelGroup}>
          <FileStack size={16} color="#475569" />
          <Text style={styles.label}>Loại tài liệu</Text>
        </View>
        <MultiSelect
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={typeOptions}
          search
          labelField="label"
          valueField="value"
          placeholder="Chọn loại văn bản..."
          searchPlaceholder="Tìm kiếm loại..."
          value={selectedTypes}
          onChange={(items) => {
            setSelectedTypes(items);
            handleApplyFilter(search, items);
          }}
          selectedStyle={styles.selectedBadge}
          activeColor="#eff6ff"
        />
      </View>
    </View>
  );
};

export default DocumentSearchBar;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: "#1e293b",
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eff6ff",
    height: 48,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 4,
  },
  resetText: {
    color: "#2563eb",
    fontWeight: "700",
    fontSize: 13,
  },
  filterRow: {
    width: "100%",
  },
  labelGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
  },
  dropdown: {
    height: 46,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  placeholderStyle: {
    fontSize: 14,
    color: "#94a3b8",
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14,
    borderRadius: 8,
  },
  selectedBadge: {
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
    marginTop: 6,
    marginRight: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 0,
  },
});