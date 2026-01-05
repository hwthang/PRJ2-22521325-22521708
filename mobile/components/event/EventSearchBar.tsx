import { StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Search, RotateCcw, X, Layers, Activity } from "lucide-react-native";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";

const eventTopics = {
  volunteer: { label: "Tình nguyện" },
  blood_donation: { label: "Hiến máu" },
  environment: { label: "Môi trường" },
  startup: { label: "Khởi nghiệp" },
  training: { label: "Tập huấn" },
  sports: { label: "Thể thao" },
  youth_union: { label: "Sinh hoạt Đoàn" },
  charity: { label: "Từ thiện" },
  culture: { label: "Văn hoá" },
  art: { label: "Nghệ thuật" },
  technology: { label: "Công nghệ" },
  education: { label: "Giáo dục" },
  competition: { label: "Cuộc thi" },
  career: { label: "Nghề nghiệp" },
  social_security: { label: "An sinh xã hội" },
  festival: { label: "Lễ hội" },
  exchange: { label: "Giao lưu" },
  training_soft: { label: "Kỹ năng mềm" },
  propaganda: { label: "Tuyên truyền" },
  community: { label: "Cộng đồng" },
};

const tagData = Object.entries(eventTopics).map(([key, value]) => ({
  label: value.label,
  value: key,
}));

const statusData = [
  { label: "Tất cả trạng thái", value: "all" },
  { label: "Đang diễn ra", value: "ongoing" },
  { label: "Sắp diễn ra", value: "upcoming" },
  { label: "Đã kết thúc", value: "ended" },
];

const EventSearchBar = ({ onFilterChange }: { onFilterChange: (filters: any) => void }) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [tags, setTags] = useState<string[]>([]);

  const handleApplyFilter = (newSearch: string, newStatus: string, newTags: string[]) => {
    onFilterChange({ search: newSearch, status: newStatus, tags: newTags });
  };

  const clearAllFilters = () => {
    setSearch("");
    setStatus("all");
    setTags([]);
    onFilterChange({ search: "", status: "all", tags: [] });
  };

  return (
    <View style={styles.container}>
      {/* HÀNG 1: TÌM KIẾM THEO CHỮ */}
      <View style={styles.row}>
        <View style={styles.searchRowContainer}>
          <View style={styles.searchSection}>
            <Search size={18} color="#64748b" />
            <TextInput
              style={styles.input}
              placeholder="Tìm kiếm sự kiện, địa điểm..."
              value={search}
              placeholderTextColor="#94a3b8"
              onChangeText={(txt) => {
                setSearch(txt);
                handleApplyFilter(txt, status, tags);
              }}
            />
            {search !== "" && (
              <TouchableOpacity onPress={() => { setSearch(""); handleApplyFilter("", status, tags); }}>
                <X size={18} color="#94a3b8" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.resetBtn} onPress={clearAllFilters} activeOpacity={0.7}>
            <RotateCcw size={18} color="#2563eb" />
            <Text style={styles.resetText}>Làm mới</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* HÀNG 2: LỌC THEO TRẠNG THÁI */}
      <View style={styles.row}>
        <View style={styles.labelGroup}>
          <Activity size={16} color="#475569" />
          <Text style={styles.label}>Trạng thái</Text>
        </View>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={statusData}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Chọn trạng thái"
          value={status}
          onChange={(item) => {
            setStatus(item.value);
            handleApplyFilter(search, item.value, tags);
          }}
        />
      </View>

      {/* HÀNG 3: LỌC THEO TAGS (CHỌN NHIỀU) */}
      <View style={[styles.row, { marginBottom: 0 }]}>
        <View style={styles.labelGroup}>
          <Layers size={16} color="#475569" />
          <Text style={styles.label}>Chủ đề (Tags)</Text>
        </View>
        <MultiSelect
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={tagData}
          search
          labelField="label"
          valueField="value"
          placeholder="Chọn một hoặc nhiều tag"
          searchPlaceholder="Tìm tên tag..."
          value={tags}
          onChange={(items) => {
            setTags(items);
            handleApplyFilter(search, status, items);
          }}
          selectedStyle={styles.selectedTagItem}
          activeColor="#eff6ff"
        />
      </View>
    </View>
  );
};

export default EventSearchBar;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  row: {
    marginBottom: 16,
  },
  searchRowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchSection: {
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
    marginLeft: 10,
    fontSize: 15,
    color: "#1e293b",
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    paddingHorizontal: 12,
    height: 48,
    backgroundColor: "#eff6ff",
    borderRadius: 12,
  },
  resetText: {
    marginLeft: 4,
    color: "#2563eb",
    fontSize: 13,
    fontWeight: "700",
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
    color: "#1e293b",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14,
    borderRadius: 8,
  },
  selectedTagItem: {
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
    borderWidth: 0,
    marginTop: 6,
    marginRight: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});