import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl, // 1. Import RefreshControl
} from "react-native";
import React, { useEffect, useState, useCallback } from "react"; // 2. Import useCallback
import DocumentService from "@/services/DocumentService";
import DocumentItem from "@/components/document/DocumentItem";
import DocumentSearchBar from "@/components/document/DocumentSearchBar";

const DocumentScreen = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [filteredDocs, setFilteredDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // 3. State quản lý refresh

  const fetchDocuments = async (isRefreshing = false) => {
    // Nếu là refresh thì không hiện loading spinner chính giữa màn hình
    if (!isRefreshing) setLoading(true);
    
    try {
      const res = await DocumentService.fetchAllDocuments();
      const data = res?.data?.documents || [];
      setDocuments(data);
      setFilteredDocs(data);
    } catch (error) {
      console.error("Lỗi fetch documents:", error);
    } finally {
      setLoading(false);
      setRefreshing(false); // Tắt spinner refresh
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // 4. Hàm xử lý khi kéo xuống để refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDocuments(true);
  }, []);

  const handleFilter = ({
    search,
    types,
  }: {
    search: string;
    types: string[];
  }) => {
    let result = [...documents];

    if (search) {
      const query = search.toLowerCase();
      result = result.filter(
        (doc) =>
          doc.name?.toLowerCase().includes(query) ||
          doc.docCode?.toLowerCase().includes(query)
      );
    }

    if (types && types.length > 0) {
      result = result.filter((doc) => types.includes(doc.type));
    }

    setFilteredDocs(result);
  };

  return (
    <SafeAreaView style={styles.container}>
      <DocumentSearchBar onFilterChange={handleFilter} />

      <View style={styles.content}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Danh sách văn bản</Text>
          <Text style={styles.countText}>{filteredDocs.length} tài liệu</Text>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.loadingText}>Đang tải tài liệu...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredDocs}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <DocumentItem data={item} />}
            contentContainerStyle={styles.listPadding}
            showsVerticalScrollIndicator={false}
            // 5. Thêm RefreshControl vào FlatList
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#2563eb"]} // Android
                tintColor="#2563eb"   // iOS
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>
                  Không tìm thấy tài liệu phù hợp
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default DocumentScreen;

const styles = StyleSheet.create({
  // ... Styles của bạn giữ nguyên
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    flex: 1,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },
  countText: {
    fontSize: 13,
    color: "#64748b",
  },
  listPadding: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  loadingText: {
    marginTop: 10,
    color: "#64748b",
    fontSize: 14,
  },
  emptyBox: {
    alignItems: "center",
    marginTop: 60,
  },
  emptyText: {
    color: "#94a3b8",
    fontSize: 15,
  },
});