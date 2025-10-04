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
import AccountListView from "./features/account/views/AccountListView";
import AccountDetailView from "./features/account/views/AccountDetailView";

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
          <Route path="accounts" element={<AccountListView />} />
          <Route path="accounts/:key_account" element={<AccountDetailView/>}/>


          <Route path="chapters" element={<ChapterView />} />
          <Route path="events" element={<EventView />} />
          <Route path="documents" element={<DocumentView />} />
          <Route path="surveys" element={<SurveyView />} />
          <Route path="statistics" element={<StatisticView />} />
           <Route path="profile" element={<ProfileView />} />
            <Route path="notifications" element={<NotificationView />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
