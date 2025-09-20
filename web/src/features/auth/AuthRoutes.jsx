import React from "react";
import { Route, Routes } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import LoginView from "./views/LoginView";
import RegisterView from "./views/RegisterView";
import ForgotPasswordView from "./views/ForgotPasswordView";

function AuthRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AuthLayout />}>
        <Route index element={<LoginView/>} />
        <Route path='register' element={<RegisterView/>} />
        <Route path='forgot-password' element={<ForgotPasswordView/>} />
      </Route>
    </Routes>
  );
}

export default AuthRoutes;
