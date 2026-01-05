import { FlatList, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import EventItem from "./EventItem";

const EventSection = ({ data }: { data: any }) => {
  return (
    <View style={styles.container}>
      {/* Tiêu đề Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Sự kiện đã đăng ký</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>Tất cả ({data?.length || 0})</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách sự kiện */}
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <EventItem data={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false} // Ẩn thanh cuộn cho gọn
        scrollEnabled={false} // Nếu dùng trong ScrollView lớn của HomeScreen
        ListEmptyComponent={
          <Text style={styles.emptyText}>Bạn chưa đăng ký sự kiện nào.</Text>
        }
      />
    </View>
  );
};

export default EventSection;

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b", // Slate 800
  },
  seeAll: {
    fontSize: 14,
    color: "#2563eb", // Blue 600
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  emptyText: {
    textAlign: "center",
    color: "#94a3b8",
    marginTop: 20,
    fontSize: 14,
  },
});