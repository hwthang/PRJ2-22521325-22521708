import { StyleSheet, Text, View, Image, FlatList } from "react-native";
import React from "react";
import { Trophy, Star } from "lucide-react-native";
import defAvatar from "../../assets/images/avatar.png";

const LeaderBoardSection = ({ data }: { data: any }) => {
  // Sắp xếp data theo score giảm dần nếu cần
 const sortedData = data ? [...data].sort((a, b) => b.score - a.score) : [];

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const isTop3 = index < 3;
    const rankColors = ["#fbbf24", "#94a3b8", "#b45309"]; // Vàng, Bạc, Đồng

    return (
      <View style={styles.itemRow}>
        {/* Thứ hạng */}
        <View style={styles.rankContainer}>
          {index === 0 ? (
            <Trophy size={20} color={rankColors[0]} fill={rankColors[0]} />
          ) : (
            <Text style={[styles.rankText, isTop3 && { color: rankColors[index], fontWeight: '800' }]}>
              {index + 1}
            </Text>
          )}
        </View>

        {/* Avatar & Tên */}
        <Image
          source={item.avatar ? { uri: item.avatar} : defAvatar}
          style={[styles.avatar, isTop3 && { borderColor: rankColors[index] || '#2563eb', borderWidth: 2 }]}
        />
        
        <View style={styles.nameContainer}>
          <Text style={styles.fullName} numberOfLines={1}>{item.fullName}</Text>
          <Text style={styles.subText}>{item.surveys} khảo sát • {item.activities} hoạt động</Text>
        </View>

        {/* Điểm số */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{item.score}</Text>
          <Text style={styles.scoreLabel}>điểm</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bảng xếp hạng</Text>
        <Star size={20} color="#2563eb" fill="#2563eb" />
      </View>

      <FlatList
        data={sortedData}
        keyExtractor={(item) => item.memberId}
        renderItem={renderItem}
        scrollEnabled={false} // Tắt scroll nếu bọc trong ScrollView chính
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default LeaderBoardSection;

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  list: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 10,
    // Đổ bóng nhẹ cho card trắng
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  rankContainer: {
    width: 30,
    alignItems: "center",
  },
  rankText: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "600",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginHorizontal: 12,
    backgroundColor: "#e2e8f0",
  },
  nameContainer: {
    flex: 1,
  },
  fullName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e293b",
  },
  subText: {
    fontSize: 11,
    color: "#94a3b8",
    marginTop: 2,
  },
  scoreContainer: {
    alignItems: "center",
    backgroundColor: "#eff6ff",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    minWidth: 50,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#2563eb",
  },
  scoreLabel: {
    fontSize: 9,
    color: "#2563eb",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});