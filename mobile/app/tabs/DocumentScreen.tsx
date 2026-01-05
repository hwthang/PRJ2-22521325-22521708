import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import DocumentService from "@/services/DocumentService";
import DocumentItem from "@/components/document/DocumentItem";
import DocumentSearchBar from "@/components/document/DocumentSearchBar";

const DocumentScreen = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [filteredDocs, setFilteredDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await DocumentService.fetchAllDocuments();
      // Giả sử API trả về res.data.documents như console.log của bạn
      const data = res?.data?.documents || [];
      setDocuments(data);
      setFilteredDocs(data);
    } catch (error) {
      console.error("Lỗi fetch documents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Logic lọc dữ liệu
  const handleFilter = ({
    search,
    types,
  }: {
    search: string;
    types: string[];
  }) => {
    let result = [...documents];

    // 1. Lọc theo chữ (Tên tài liệu hoặc Mã docCode)
    if (search) {
      const query = search.toLowerCase();
      result = result.filter(
        (doc) =>
          doc.name?.toLowerCase().includes(query) ||
          doc.docCode?.toLowerCase().includes(query)
      );
    }

    // 2. Lọc theo nhiều loại tài liệu (Multi-select)
    if (types && types.length > 0) {
      result = result.filter((doc) => types.includes(doc.type));
    }

    setFilteredDocs(result);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Thanh tìm kiếm và lọc */}
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
