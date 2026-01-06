import { FlatList, StyleSheet, Text, View, SafeAreaView, RefreshControl } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import EventService from "@/services/EventService";
import EventItem from "@/components/home/EventItem";
import EventSearchBar from "@/components/event/EventSearchBar";

const EventScreen = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  
  // 1. Khởi tạo state refreshing
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = async () => {
    const res = await EventService.fetchAllEventForMember();
    const data = res || [];
    setEvents(data);
    setFilteredEvents(data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // 2. Định nghĩa hàm onRefresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchEvents();
    } catch (error) {
      console.error("Lỗi khi làm mới dữ liệu:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleFilter = ({ search, status, tag }: { search: string; status: string; tag: string }) => {
    let result = [...events];

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (e) => e.name?.toLowerCase().includes(s) || e.venue?.toLowerCase().includes(s)
      );
    }

    if (tag) {
      result = result.filter((e) => e.tags?.includes(tag));
    }

    if (status && status !== "all") {
      const now = new Date();
      result = result.filter((e) => {
        const start = new Date(e.startedAt);
        const end = new Date(e.endedAt);
        if (status === "upcoming") return now < start;
        if (status === "ongoing") return now >= start && now <= end;
        if (status === "ended") return now > end;
        return true;
      });
    }

    setFilteredEvents(result);
  };

  return (
    <SafeAreaView style={styles.container}>
      <EventSearchBar onFilterChange={handleFilter} />
      
      <View style={styles.listSection}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Danh sách sự kiện</Text>
          <Text style={styles.countText}>{filteredEvents.length} kết quả</Text>
        </View>

        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <EventItem data={item} />}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          
          // 3. Tích hợp RefreshControl vào FlatList
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              colors={["#2563eb"]} // Màu cho Android
              tintColor="#2563eb"    // Màu cho iOS
            />
          }
          
          ListEmptyComponent={
            <Text style={styles.emptyText}>Không tìm thấy sự kiện phù hợp</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default EventScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  listSection: { flex: 1 },
  listHeader: {
    flexDirection: "row", 
    justifyContent: "space-between", 
    paddingHorizontal: 16, 
    paddingTop: 16,
    alignItems: 'center'
  },
  listTitle: { fontSize: 16, fontWeight: "700", color: "#1e293b" },
  countText: { fontSize: 12, color: "#64748b" },
  emptyText: { textAlign: "center", marginTop: 40, color: "#94a3b8" },
});