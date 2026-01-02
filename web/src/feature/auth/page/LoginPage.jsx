import React, { useState } from "react";
import { logo } from "../../../core/assets/images";
import CustomInput from "../../component/custom/CustomInput";
import CustomPassword from "../../component/custom/CustomPassword";
import apiClient from "../../../utils/api";
import customCache from "../../../utils/customCache";
import { useNavigate } from "react-router-dom";
import socket from "../../../utils/socket";

const LoginPage = () => {
  const navigate = useNavigate();

  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  /* =======================
          LOGIN
  ======================= */
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!account || !password) {
      alert("Vui lòng nhập đầy đủ tài khoản và mật khẩu");
      return;
    }

    try {
      setLoading(true);

      const response = await apiClient.post("/api/accounts/login", {
        account,
        password,
      });

      const token = response.data.token;

      // lưu cache
      customCache.myAccount.set(token);

      // 👉 AUTO CONNECT SOCKET NGAY SAU LOGIN
      socket.connect(token._id);

      // điều hướng
      switch (token.type) {
        case "admin":
          navigate("/app/admin/dashboard");
          break;
        case "chapter":
          navigate("/app/chapter/dashboard");
          break;
        case "member":
          navigate("/app/member/dashboard");
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
      alert("Sai tài khoản hoặc mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(to_bottom_right,_#2563eb,_#22d3ee)]">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl w-full max-w-sm shadow-xl flex flex-col gap-6"
      >
        <img src={logo} className="w-24 h-24 mx-auto" alt="Logo" />

        <h1 className="text-center text-3xl font-bold text-blue-700">
          CHI ĐOÀN SỐ
        </h1>

        <div className="flex flex-col gap-4 text-blue-700">
          <CustomInput
            label="Tài khoản"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            className={'text-sm'}
          />

          <CustomPassword
            label="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
             className={'text-sm'}
          />

          <button
            type="button"
            className="text-right text-blue-600 text-sm hover:underline"
          >
            Quên mật khẩu?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 active:bg-blue-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
