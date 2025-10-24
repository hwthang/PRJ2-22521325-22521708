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

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<LoginView />} />
          <Route path="register" element={<RegisterView />} />
          <Route path="forgot-password" element={<ForgotPasswordView />} />
        </Route>

        <Route path="/cds" element={<MainLayout />}>
          <Route path="dashboard" element={<DashboardView />} />

          <Route path="accounts" element={<AccountView />} />
          <Route path="accounts/:id" element={<AccountDetail/>} />

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
