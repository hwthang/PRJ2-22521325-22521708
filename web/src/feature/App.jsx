import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import socket from "../utils/socket";

import MainLayout from "../layouts/MainLayout/MainLayout";
import ChapterListPage from "./chapter/page/ChapterListPage";
import ChapterDetailPage from "./chapter/page/ChapterDetailPage";
import ChapterCreatePage from "./chapter/page/ChapterCreatePage";
import ExamplePage from "./example/page/ExamplePage";
import MemberListPage from "./member/page/MemberListPage";
import MemberCreatePage from "./member/page/MemberCreatePage";
import MemberDetailPage from "./member/page/MemberDetailPage";
import EventListPage from "./event/page/EventListPage";
import EventDetailPage from "./event/page/EventDetailPage";
import EventCreatePage from "./event/page/EventCreatePage";
import LoginPage from "./auth/page/LoginPage";
import { AdminDashboardPage } from "./dashboard/AdminDashboardPage";
import ChapterMemberPage from "./member/page/ChapterMemberPage";
import DocumentListPage from "./document/page/DocumentListPage";
import DocumentDetailPage from "./document/page/DocumentDetailPage";
import ChapterDashboardPage from "./dashboard/ChapterDashboardPage";
import SurveyListPage from "./survey/page/SurveyListPage";
import SurveyDetailPage from "./survey/page/SurveyDetailPage";
import CreateSurveyPage from "./survey/page/CreateSurveyPage";
import MemberDashboard from "./dashboard/MemberDashboard";
import EventPostPage from "./event/page/EventPostPage";
import DocumentPostPage from "./document/page/DocumentPostPage";
import SurveyPostPage from "./survey/page/SurveyPostPage";
import TakeSurveyPage from "./survey/page/TakeSurveyPage";
import { RegistrationPage } from "./registration/page/RegistrationPage";
import SurveyDetailResultPage from "./survey/page/SurveyDetailResultPage";
import ChatPage from "./chat/page/ChatPage";
import VideoCallPage from "./video-call/VideoCallPage";
import IncomingCallPage from "./video-call/IncomingCallPage";
import { WaitingCallPage } from "./video-call/WaitingCallPage";
import ChatBotPage from "./chatbot/ChatBotPage";

function App() {
  // 🔹 AUTO CONNECT SOCKET nếu có accountId
  const navigate = useNavigate();
  useEffect(() => {
    const myAccountRaw = localStorage.getItem("my_account");
    if (!myAccountRaw) return;

    const myAccount = JSON.parse(myAccountRaw);
    if (!myAccount?._id) return;

    socket.connect(myAccount._id);

    /* ========================
     SOCKET HANDLERS
  ======================== */

    const handleWelcome = (data) => {
      toast.success(`Chào mừng ${data.fullname}`);
      console.log("WELCOME:", data);
    };

    const handleNewEventForMember = (data) => {
      toast.success(`Chi đoàn vừa đăng tải một sự kiện mới, xem ngay`, {
        onClick: () => {
          navigate(`/app/member/events?id=${data}`);
        },
      });
    };

    // 🔔 BẮT TIN NHẮN MỚI
    const handleNewMessage = (payload) => {
      console.log("📩 NEW_MESSAGE:", payload);

      toast.info(`💬 Bạn có tin nhắn mới từ ${payload.chatName}`, {
        autoClose: 4000,
        onClick: () => {
          const myAccount = localStorage.getItem("my_account");
          const type = JSON.parse(myAccount).type;
          navigate(
            `/app/${type}/chat?conversationId=${payload.conversationId}`
          );
        },
      });
    };

    const handleIncomingCall = (payload) => {
      console.log("📩 INCOMING_CALL:", payload);

      const myAccount = localStorage.getItem("my_account");
      const type = JSON.parse(myAccount).type;
      navigate(
        `/app/${type}/incoming-call?from=${payload.from}&to=${payload.to}&callId=${payload.callId}`
      );
    };

    const handleCancelCall = (payload) => {
      console.log("📩 CANCEL_CALL:", payload);

      const myAccount = localStorage.getItem("my_account");
      const type = JSON.parse(myAccount).type;
      navigate(`/app/${type}/chat?conversationId=${payload.callId}`);
    };
    const handleRejectCall = (payload) => {
      console.log("📩 REJECT_CALL:", payload);

      const myAccount = localStorage.getItem("my_account");
      const type = JSON.parse(myAccount).type;
      navigate(`/app/${type}/chat?conversationId=${payload.callId}`);
    };

    const handleAcceptCall = (payload) => {
      console.log("📩 ACCEPT_CALL:", payload);

      const myAccount = localStorage.getItem("my_account");
      const type = JSON.parse(myAccount).type;
      navigate(
        `/app/${type}/video-call?callId=${payload.callId}&to=${payload.from}&from=${payload.to}`
      );
    };

    const handleOutCall = (payload) => {
      console.log("📩 OUT_CALL:", payload);

      const myAccount = localStorage.getItem("my_account");
      const type = JSON.parse(myAccount).type;
      navigate(`/app/${type}/chat?conversationId=${payload.callId}`);
    };

    socket.on("welcome", handleWelcome);
    socket.on("new_event_for_member", handleNewEventForMember);
    socket.on("new_message", handleNewMessage);

    socket.on("call:incoming", handleIncomingCall);
    socket.on("call:cancelled", handleCancelCall);
    socket.on("call:rejected", handleRejectCall);
    socket.on("call:accepted", handleAcceptCall);
    socket.on("call:ended", handleOutCall);

    return () => {
      socket.off("welcome", handleWelcome);
      socket.off("new_event_for_member", handleNewEventForMember);
      socket.off("new_message", handleNewMessage);
      socket.off("call:incoming", handleIncomingCall);
      socket.off("call:cancelled", handleCancelCall);
      socket.off("call:rejected", handleRejectCall);
      socket.off("call:accepted", handleAcceptCall);
      socket.off("call:ended", handleOutCall);
    };
  }, [navigate]);

  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/app" element={<MainLayout />}>
          <Route path="admin">
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="chapters" element={<ChapterListPage />} />
            <Route path="chapters/:id" element={<ChapterDetailPage />} />
            <Route path="chapters/create" element={<ChapterCreatePage />} />

            <Route path="members" element={<MemberListPage />} />
            <Route path="members/:id" element={<MemberDetailPage />} />
            <Route path="members/create" element={<MemberCreatePage />} />

            <Route path="events" element={<EventListPage />} />
            <Route path="events/:id" element={<EventDetailPage />} />
            <Route path="events/create" element={<EventCreatePage />} />
            <Route path="documents" element={<DocumentListPage />} />
            <Route path="documents/:id" element={<DocumentDetailPage />} />
            <Route path="surveys" element={<SurveyListPage />} />
            <Route path="surveys/create" element={<CreateSurveyPage />} />
            <Route path="surveys/:id" element={<SurveyDetailPage />} />
            <Route path="chatbot" element={<ChatBotPage />} />
               <Route path="chat" element={<ChatPage />} />
                <Route path="incoming-call" element={<IncomingCallPage />} />
            <Route path="waiting-call" element={<WaitingCallPage />} />
            <Route path="video-call" element={<VideoCallPage />} />
          </Route>

          <Route path="chapter">
            <Route path="dashboard" element={<ChapterDashboardPage />} />
            <Route path="members" element={<ChapterMemberPage />} />
            <Route path="members/:id" element={<MemberDetailPage />} />
            <Route path="members/create" element={<MemberCreatePage />} />
            <Route path="events" element={<EventListPage />} />
            <Route path="events/:id" element={<EventDetailPage />} />
            <Route path="events/create" element={<EventCreatePage />} />
            <Route path="documents" element={<DocumentListPage />} />
            <Route path="documents/:id" element={<DocumentDetailPage />} />
            <Route path="surveys" element={<SurveyListPage />} />
            <Route path="surveys/create" element={<CreateSurveyPage />} />
            <Route path="surveys/:id" element={<SurveyDetailPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="incoming-call" element={<IncomingCallPage />} />
            <Route path="waiting-call" element={<WaitingCallPage />} />
            <Route path="video-call" element={<VideoCallPage />} />
            <Route path="chatbot" element={<ChatBotPage />} />
          </Route>

          <Route path="member">
            <Route path="dashboard" element={<MemberDashboard />} />
            <Route path="events" element={<EventPostPage />} />
            <Route path="registrations" element={<RegistrationPage />} />
            <Route path="documents" element={<DocumentPostPage />} />
            <Route path="surveys" element={<SurveyPostPage />} />
            <Route path="surveys/take/:id" element={<TakeSurveyPage />} />
            <Route
              path="surveys/results/:id"
              element={<SurveyDetailResultPage />}
            />
            <Route path="chat" element={<ChatPage />} />
            <Route path="video-call" element={<VideoCallPage />} />
            <Route path="waiting-call" element={<WaitingCallPage />} />
            <Route path="incoming-call" element={<IncomingCallPage />} />
            <Route path="chatbot" element={<ChatBotPage />} />
          </Route>

          <Route path="events/:id" element={<EventDetailPage />} />
          <Route path="events/create" element={<EventCreatePage />} />
        </Route>
      </Routes>

      <ToastContainer position="top-right" />
    </>
  );
}

export default App;
