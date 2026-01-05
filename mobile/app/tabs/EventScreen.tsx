import { FlatList, StyleSheet, Text, View, SafeAreaView } from "react-native";
import React, { useEffect, useState, useMemo } from "react";
import EventService from "@/services/EventService";
import EventItem from "@/components/home/EventItem";
import EventSearchBar from "@/components/event/EventSearchBar";

const EventScreen = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);

  const fetchEvents = async () => {
    const res = await EventService.fetchAllEventForMember();
    const data = res || [];
    setEvents(data);
    setFilteredEvents(data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleFilter = ({ search, status, tag }: { search: string; status: string; tag: string }) => {
    let result = [...events];

    // 1. Lọc theo Text (Tên hoặc Địa điểm)
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (e) => e.name?.toLowerCase().includes(s) || e.venue?.toLowerCase().includes(s)
      );
    }

    // 2. Lọc theo Tag
    if (tag) {
      result = result.filter((e) => e.tags?.includes(tag));
    }

    // 3. Lọc theo Trạng thái (Logic dựa trên thời gian)
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