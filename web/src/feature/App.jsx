import React from "react";
import { Route, Routes } from "react-router-dom";
import ExamplePage from "./example/page/ExamplePage";
import MainLayout from "../layouts/MainLayout/MainLayout";
import ChapterListPage from "./chapter/page/ChapterListPage";
import ChapterDetailPage from "./chapter/page/ChapterDetailPage";
import ChapterCreatePage from "./chapter/page/ChapterCreatePage";
import { ToastContainer } from "react-toastify";
import MemberListPage from "./member/page/MemberListPage";
import MemberDetailPage from "./member/page/MemberDetailPage";
import MemberCreatePage from "./member/page/MemberCreatePage";

function App() {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<ExamplePage />} />

          <Route path="chapters" element={<ChapterListPage />} />
          <Route path="chapters/:id" element={<ChapterDetailPage />} />
          <Route path="chapters/create" element={<ChapterCreatePage />} />

          <Route path="members" element={<MemberListPage />} />
          <Route path="members/:id" element={<MemberDetailPage />} />
          <Route path="members/create" element={<MemberCreatePage />} />
          
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
