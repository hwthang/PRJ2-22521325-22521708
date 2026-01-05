import { StyleSheet, View, SafeAreaView, FlatList, ActivityIndicator, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import SurveyService from "@/services/SurveyService";
import SurveyItem from "@/components/survey/SurveyItem";
import SurveySearchBar from "@/components/survey/SurveySearchBar";

const SurveyScreen = () => {
  const router = useRouter();
  const [surveys, setSurveys] = useState<any[]>([]);
  const [filteredSurveys, setFilteredSurveys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSurveys = async () => {
    setLoading(true);
    try {
      const res = await SurveyService.fetchSurveyForMember();
      const data = res || [];
      setSurveys(data);
      setFilteredSurveys(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  const handleFilter = ({ search, status }: { search: string; status: string }) => {
    let result = [...surveys];
    const now = new Date();

    if (search) {
      result = result.filter(s => s.name?.toLowerCase().includes(search.toLowerCase()));
    }

    if (status !== "all") {
      result = result.filter(s => {
        const isExpired = new Date(s.endedAt) < now;
        if (status === "done") return s.isDone === true;
        if (status === "todo") return s.isDone === false && !isExpired;
        if (status === "expired") return isExpired && s.isDone === false;
        return true;
      });
    }
    setFilteredSurveys(result);
  };

  const handleItemPress = (item: any) => {
    if (item.isDone) {
      router.push({ pathname: "/screen/SurveyResultScreen", params: { id: item._id } });
    } else {
      const isExpired = new Date(item.endedAt) < new Date();
      if (isExpired) return; // Không cho làm nếu hết hạn
      router.push({ pathname: "/screen/DoSurveyScreen", params: { id: item._id } });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <SurveySearchBar onFilterChange={handleFilter} />

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filteredSurveys}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <SurveyItem data={item} onPress={() => handleItemPress(item)} />
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Không có khảo sát nào phù hợp.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default SurveyScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  list: { padding: 16, paddingBottom: 40 },
  emptyText: { textAlign: "center", marginTop: 50, color: "#94a3b8" }
});