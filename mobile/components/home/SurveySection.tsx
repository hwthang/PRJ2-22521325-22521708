import { FlatList, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import SurveyItem from "./SurveyItem";
import { ChevronRight } from "lucide-react-native";

const SurveySection = ({ data }: { data: any }) => {
  return (
    <View style={styles.container}>
      {/* Header gọn gàng */}
      <View style={styles.header}>
        <Text style={styles.title}>Khảo sát của bạn</Text>
        <TouchableOpacity style={styles.seeMore}>
          <Text style={styles.seeMoreText}>Xem tất cả</Text>
          <ChevronRight size={16} color="#2563eb" />
        </TouchableOpacity>
      </View>

      {/* Danh sách khảo sát */}
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <SurveyItem data={item} />}
        contentContainerStyle={styles.listContent}
        scrollEnabled={false} // Tắt scroll nếu bọc trong ScrollView tổng của trang chủ
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Chưa có dữ liệu khảo sát</Text>
          </View>
        }
      />
    </View>
  );
};

export default SurveySection;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  seeMore: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeMoreText: {
    fontSize: 14,
    color: "#2563eb",
    fontWeight: "600",
    marginRight: 2,
  },
  listContent: {
    paddingBottom: 10,
  },
  emptyBox: {
    padding: 10,
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
  },
  emptyText: {
    color: "#94a3b8",
    fontSize: 14,
  },
});