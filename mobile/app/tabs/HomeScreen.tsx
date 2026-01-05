import { Image, ScrollView, StyleSheet, View, RefreshControl } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import AuthService from "@/services/AuthService";

import UserSection from "@/components/home/UserSection";
import EventSection from "@/components/home/EventSection";
import EventService from "@/services/EventService";
import SurveyService from "@/services/SurveyService";
import SurveySection from "@/components/home/SurveySection";
import MemberService from "@/services/MemberService";
import LeaderBoardSection from "@/components/home/LeaderBoardSection";

const HomeScreen = () => {
  const [myAccount, setMyAccount] = useState<any>();
  const [events, setEvents] = useState<any>();
  const [surveys, setSurveys] = useState<any>();
  const [leaderBoard, setLeaderBoard] = useState<any>();
  
  // State quản lý trạng thái đang refresh
  const [refreshing, setRefreshing] = useState(false);

  const getMyAccount = async () => {
    const res = await AuthService.getMyAccount();
    setMyAccount(res);
  };

  const fetchEvents = async () => {
    const res = await EventService.fetchAllEventForMember();
    setEvents(
      res.filter((item: { hadRegistered: any }) => item.hadRegistered) || []
    );
  };

  const fetchSurveys = async () => {
    const res = await SurveyService.fetchAllDoneSurveys();
    setSurveys(res.data.surveys);
  };

  const fetchLeaderBoard = async () => {
    const res = await MemberService.fetchLeaderBoard();
    setLeaderBoard(res.data.leaderboard);
  };

  // Hàm tổng hợp để load lại toàn bộ dữ liệu
  const fetchAllData = async () => {
    await Promise.all([
      getMyAccount(),
      fetchEvents(),
      fetchSurveys(),
      fetchLeaderBoard()
    ]);
  };

  // Hàm xử lý khi người dùng kéo xuống
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchAllData();
    } catch (error) {
      console.error("Lỗi khi refresh dữ liệu:", error);
    } finally {
      setRefreshing(false); // Tắt spinner khi đã tải xong
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: "#f8fafc" }}
      // Cấu hình RefreshControl ở đây
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh} 
          colors={["#2563eb"]} // Màu cho Android
          tintColor="#2563eb"    // Màu cho iOS
        />
      }
    >
      <UserSection data={myAccount} />
      
      {/* Bao bọc các Section bằng View để padding nếu cần */}
      <View style={styles.contentContainer}>
        <EventSection data={events} />
        <SurveySection data={surveys} />
        <LeaderBoardSection data={leaderBoard}/>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 20, // Khoảng cách cuối trang
  }
});