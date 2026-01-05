import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { Search, RotateCcw, X, Filter } from "lucide-react-native";
import { Dropdown } from "react-native-element-dropdown";

const statusOptions = [
  { label: "Tất cả trạng thái", value: "all" },
  { label: "Chưa hoàn thành", value: "todo" },
  { label: "Đã hoàn thành", value: "done" },
  { label: "Đã hết hạn", value: "expired" },
];

const SurveySearchBar = ({
  onFilterChange,
}: {
  onFilterChange: (filters: any) => void;
}) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const handleApply = (newSearch: string, newStatus: string) => {
    onFilterChange({ search: newSearch, status: newStatus });
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    onFilterChange({ search: "", status: "all" });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <View style={styles.inputContainer}>
          <Search size={18} color="#64748b" />
          <TextInput
            style={styles.input}
            placeholder="Tìm tên khảo sát..."
            value={search}
            onChangeText={(txt) => {
              setSearch(txt);
              handleApply(txt, status);
            }}
          />
          {search !== "" && (
            <TouchableOpacity
              onPress={() => {
                setSearch("");
                handleApply("", status);
              }}
            >
              <X size={18} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.resetBtn} onPress={clearFilters}>
          <RotateCcw size={18} color="#2563eb" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        <Filter size={16} color="#475569" />
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={statusOptions}
          maxHeight={300}
          labelField="label"
          valueField="value"
          value={status}
          onChange={(item) => {
            setStatus(item.value);
            handleApply(search, item.value);
          }}
        />
      </View>
    </View>
  );
};

export default SurveySearchBar;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  searchRow: { flexDirection: "row", gap: 10, marginBottom: 12 },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 45,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  input: { flex: 1, marginLeft: 8, fontSize: 14, color: "#1e293b" },
  resetBtn: {
    width: 45,
    height: 45,
    backgroundColor: "#eff6ff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  filterRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  dropdown: { flex: 1, height: 40, backgroundColor: "#fff" },
  placeholderStyle: { fontSize: 14, color: "#94a3b8" },
  selectedTextStyle: { fontSize: 14, color: "#2563eb", fontWeight: "600" },
});
