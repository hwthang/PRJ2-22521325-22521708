import React from "react";
import { Route, Routes } from "react-router-dom";
import AuthLayout from "../src/layouts/AuthLayout";
import LoginView from "./features/auth/views/LoginView";
import RegisterView from "./features/auth/views/RegisterView";
import ForgotPasswordView from "./features/auth/views/ForgotPasswordView";
import MainLayout from "./layouts/MainLayout/MainLayout";
import DashboardView from "./features/dashboard/views/DashboardView";
import ChapterView from "./features/chapter/views/ChapterView";
import EventView from "./features/event/views/EventView";
import DocumentView from "./features/document/views/DocumentView";
import SurveyView from "./features/survey/views/SurveyView";
import StatisticView from "./features/statistic/views/StatisticView";
import ProfileView from "./features/profile/views/ProfileView";
import NotificationView from "./features/notification/views/NotificationView";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AccountView from "./features/account/views/AccountView";
import AccountDetail from "./features/account/components/AccountDetail";
import AccountListPage from "./features/account/pages/AccountListPage";
import AccountDetailPage from "./features/account/pages/AccountDetailPage";
import AcccountCreatePage from "./features/account/pages/AcccountCreatePage";
import ChapterListPage from "./features/chapter/pages/ChapterListPage";
import ChapterDetailPage from "./features/chapter/pages/ChapterDetailPage";
import MemberListPage from "./features/member/pages/MemberListPage";
import MemberDetailPage from "./features/member/pages/MemberDetailPage";
import EventListPage from "./features/event/pages/EventListPage";
import EventDetailPage from "./features/event/pages/EventDetailPage";
import DocumentListPage from "./features/document/pages/DocumentListPage";
import DocumentDetailPage from "./features/document/pages/DocumentDetailPage";
import SurveyListPage from "./features/survey/pages/SurveyListPage";
import SurveyDetailView from "./features/survey/views/SurveyDetailView";
import SurveyDetailPage from "./features/survey/pages/SurveyDetailPage";
import ChapterCreatePage from "./features/chapter/pages/ChapterCreatePage";
import MemberCreatePage from "./features/member/pages/MemberCreatePage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<LoginView />} />
          <Route path="register" element={<RegisterView />} />
          <Route path="forgot-password" element={<ForgotPasswordView />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="dashboard" element={<DashboardView />} />

          <Route path="accounts" element={<AccountListPage />} />
          <Route path="accounts/:id" element={<AccountDetailPage />} />
          <Route path="accounts/create" element={<AcccountCreatePage />} />

          <Route path="chapters" element={<ChapterListPage />} />
          <Route path="chapters/:id" element={<ChapterDetailPage />} />
          <Route path="chapters/create" element={<ChapterCreatePage />} />

          <Route path="members" element={<MemberListPage />} />
          <Route path="members/:id" element={<MemberDetailPage />} />
          <Route path="members/create" element={<MemberCreatePage />} />

          <Route path="events" element={<EventListPage />} />
          <Route path="events/:id" element={<EventDetailPage />} />

          <Route path="documents" element={<DocumentListPage />} />
          <Route path="documents/:id" element={<DocumentDetailPage />} />

          <Route path="surveys" element={<SurveyListPage />} />
          <Route path="surveys/:id" element={<SurveyDetailPage />} />

          <Route path="chapters" element={<ChapterView />} />
          <Route path="events" element={<EventView />} />
          <Route path="documents" element={<DocumentView />} />
          <Route path="surveys" element={<SurveyView />} />
          <Route path="statistics" element={<StatisticView />} />
          <Route path="profile" element={<ProfileView />} />
          <Route path="notifications" element={<NotificationView />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
