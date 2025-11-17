import React from "react";
import { Route, Routes } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import LoginView from "./auth/views/LoginView";
import RegisterView from "./auth/views/RegisterView";
import ForgotPasswordView from "./auth/views/ForgotPasswordView";
import MainLayout from "../layouts/MainLayout/MainLayout";
import DashboardView from "./dashboard/views/DashboardView";
import ChapterView from "./chapter/views/ChapterView";
import EventView from "./event/views/EventView";
import DocumentView from "./document/views/DocumentView";
import SurveyView from "./survey/views/SurveyView";
import StatisticView from "./statistic/views/StatisticView";
import ProfileView from "./profile/views/ProfileView";
import NotificationView from "./notification/views/NotificationView";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AccountView from "./account/views/AccountView";
import AccountDetail from "./account/components/AccountDetail";
import AccountListPage from "./account/pages/AccountListPage";
import AccountDetailPage from "./account/pages/AccountDetailPage";
import AcccountCreatePage from "./account/pages/AcccountCreatePage";
import ChapterListPage from "./chapter/pages/ChapterListPage";
import ChapterDetailPage from "./chapter/pages/ChapterDetailPage";
import MemberListPage from "./member/pages/MemberListPage";
import MemberDetailPage from "./member/pages/MemberDetailPage";
import EventListPage from "./event/pages/EventListPage";
import EventDetailPage from "./event/pages/EventDetailPage";
import DocumentListPage from "./document/pages/DocumentListPage";
import DocumentDetailPage from "./document/pages/DocumentDetailPage";
import SurveyListPage from "./survey/pages/SurveyListPage";
import SurveyDetailView from "./survey/views/SurveyDetailView";
import SurveyDetailPage from "./survey/pages/SurveyDetailPage";
import ChapterCreatePage from "./chapter/pages/ChapterCreatePage";
import MemberCreatePage from "./member/pages/MemberCreatePage";
import DoSurveyPage from "./survey/pages/DoSurveyPage";
import EventRegistrationPage from "./event/pages/EventRegistrationPage";

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
          <Route path="registration" element={<EventRegistrationPage />} />

          <Route path="documents" element={<DocumentListPage />} />
          <Route path="documents/:id" element={<DocumentDetailPage />} />

          <Route path="surveys" element={<SurveyListPage />} />
          <Route path="surveys/do" element={<DoSurveyPage />} />
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
