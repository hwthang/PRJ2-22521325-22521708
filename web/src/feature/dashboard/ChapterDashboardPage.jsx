import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, Zap, FileText, ClipboardList, Crown, 
  Loader2, PieChart, Trophy, ChevronRight, 
  Globe, MapPin, BarChart3, TrendingUp, LayoutDashboard
} from "lucide-react";

// Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ChapterDashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [chapterInfo, setChapterInfo] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats] = useState({
    members: [],
    eventsCount: 0,
    docsCount: 0,
    surveysCount: 0,
    board: [],
  });

  const API_URL = "http://localhost:5000/api";
  const myAccount = JSON.parse(localStorage.getItem("my_account") || "{}");
  const chapterId = myAccount.chapter?._id;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      if (!chapterId) return;

      const [
        resMembers,
        resEvents,
        resDocs,
        resSurveys,
        resLeaderboard,
        resChapter,
      ] = await Promise.all([
        fetch(`${API_URL}/members?chapterId=${chapterId}`).then((r) => r.json()),
        fetch(`${API_URL}/events?chapterId=${chapterId}`).then((r) => r.json()),
        fetch(`${API_URL}/documents?chapterId=${chapterId}`).then((r) => r.json()),
        fetch(`${API_URL}/surveys?chapterId=${chapterId}`).then((r) => r.json()),
        fetch(`${API_URL}/members/leaderboard?chapterId=${chapterId}`).then((r) => r.json()),
        fetch(`${API_URL}/chapters/${chapterId}`).then((r) => r.json()),
      ]);

      if (resChapter?.success) {
        setChapterInfo(resChapter.data.chapter);
      }

      const allMembers = resMembers.data?.members || [];
      const boardMembers = allMembers.filter((m) => {
        const pos = m.position?.toLowerCase() || "";
        return pos.includes("bí thư") || pos.includes("ủy viên");
      });

      setStats({
        members: allMembers,
        eventsCount: resEvents.data?.total || resEvents.data?.events?.length || 0,
        docsCount: resDocs.data?.total || resDocs.data?.documents?.length || 0,
        surveysCount: resSurveys.data?.total || resSurveys.data?.surveys?.length || 0,
        board: boardMembers,
      });

      setLeaderboard(resLeaderboard.data?.leaderboard || []);
    } catch (error) {
      console.error("❌ Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ======================
      CHART DATA & CONFIG
  ====================== */
  const maleCount = stats.members.filter((m) => m.gender === "Nam").length;
  const femaleCount = stats.members.filter((m) => m.gender === "Nữ").length;

  const genderChartData = {
    labels: ["Nam", "Nữ"],
    datasets: [
      {
        data: [maleCount, femaleCount],
        backgroundColor: ["#3B82F6", "#F472B6"],
        hoverOffset: 20,
        borderWidth: 0,
      },
    ],
  };

  const overviewChartData = {
    labels: ["Hoạt động", "Tài liệu", "Khảo sát"],
    datasets: [
      {
        label: "Số lượng",
        data: [stats.eventsCount, stats.docsCount, stats.surveysCount],
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        hoverBackgroundColor: "#2563EB",
        borderRadius: 15,
        barThickness: 50,
      },
    ],
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          <LayoutDashboard className="text-blue-600" size={32} />
        </div>
        <span className="mt-8 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">
          Đang tải dữ liệu hệ thống
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FE] p-4 md:p-8 font-sans antialiased text-slate-700">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* --- HEADER --- */}
        <header className="relative bg-white rounded-[2.5rem] p-8 shadow-xl shadow-blue-100 border border-white overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <Globe size={160} strokeWidth={1} />
          </div>
          <div className="relative flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.2rem] flex items-center justify-center text-white shadow-2xl shadow-blue-200 transform hover:scale-105 transition-transform duration-500">
              <Globe size={48} strokeWidth={1.5} />
            </div>
            <div className="text-center md:text-left">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-3">
                Hệ thống Quản lý Chi Đoàn
              </div>
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                {chapterInfo?.name || "Chi Đoàn"}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-5 mt-3 text-slate-400">
                <span className="flex items-center gap-1.5 text-xs font-bold">
                  <MapPin size={14} className="text-blue-500" /> 
                  {chapterInfo?.address || "Chưa cập nhật địa chỉ"}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                <span className="text-xs font-black text-blue-600 uppercase tracking-widest">
                  ID: {chapterId?.slice(-6).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Đoàn viên" value={stats.members.length} icon={<Users size={24}/>} color="bg-blue-600" />
          <StatCard label="Hoạt động" value={stats.eventsCount} icon={<Zap size={24}/>} color="bg-orange-500" />
          <StatCard label="Khảo sát" value={stats.surveysCount} icon={<ClipboardList size={24}/>} color="bg-emerald-500" />
          <StatCard label="Tài liệu" value={stats.docsCount} icon={<FileText size={24}/>} color="bg-indigo-600" />
        </div>

        {/* --- MAIN CONTENT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT SIDE: LEADERS & TOP MEMBERS */}
          <div className="lg:col-span-4 space-y-8">
            {/* Leaderboard Section */}
            <section className="bg-white p-7 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50">
              <div className="flex items-center justify-between mb-8 px-2">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-orange-50 rounded-2xl"><Trophy className="text-orange-500" size={20} /></div>
                  <h3 className="text-xs font-black uppercase text-slate-900 tracking-widest">Bảng vinh danh</h3>
                </div>
                <TrendingUp size={18} className="text-slate-300" />
              </div>

              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-2 custom-scrollbar">
                {leaderboard.length > 0 ? leaderboard.map((m, i) => (
                  <button
                    key={m.memberId}
                    onClick={() => navigate(`/admin/members/${m.memberId}`)}
                    className="w-full flex items-center justify-between p-4 rounded-3xl bg-slate-50 hover:bg-blue-600 group transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={`https://ui-avatars.com/api/?name=${m.fullName}&background=random&bold=true`}
                          className="w-12 h-12 rounded-2xl shadow-sm border-2 border-white"
                          alt=""
                        />
                        <div className={`absolute -top-2 -left-2 w-6 h-6 rounded-lg text-[10px] font-black text-white flex items-center justify-center shadow-lg ${i === 0 ? "bg-yellow-500" : i === 1 ? "bg-slate-300" : i === 2 ? "bg-orange-400" : "bg-blue-400"}`}>
                          {i + 1}
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="font-black text-[11px] uppercase text-slate-800 group-hover:text-white leading-tight">
                          {m.fullName}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 group-hover:text-blue-200 mt-1">
                          {m.score.toLocaleString()} PTS
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-300 group-hover:text-white" />
                  </button>
                )) : (
                  <div className="text-center py-10 text-slate-400 text-xs font-bold uppercase tracking-widest">
                    Chưa có dữ liệu
                  </div>
                )}
              </div>
            </section>

            {/* Board Members Section */}
            <section className="bg-slate-900 p-7 rounded-[2.5rem] shadow-2xl text-white">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-white/10 rounded-2xl border border-white/10"><Crown size={20} className="text-yellow-400" /></div>
                <h3 className="text-xs font-black uppercase tracking-widest">Ban Chấp Hành</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {stats.board.map((b, i) => (
                  <div key={i} className="p-4 bg-white/5 rounded-3xl border border-white/5 text-center transition hover:bg-white/10">
                    <img
                      src={`https://ui-avatars.com/api/?name=${b.fullName}&background=ffffff&color=0f172a&bold=true`}
                      className="w-11 h-11 rounded-2xl mx-auto mb-3 shadow-lg"
                      alt=""
                    />
                    <p className="font-black text-[10px] uppercase leading-tight line-clamp-1">{b.fullName}</p>
                    <p className="text-[9px] font-bold text-blue-400 uppercase mt-1 tracking-tighter">{b.position}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT SIDE: ANALYTICS */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 gap-8">
              
              {/* Data Bar Chart - Expanded */}
              <section className="bg-white p-8 rounded-[3rem] border border-slate-50 shadow-xl shadow-slate-200/50">
                <div className="flex items-center gap-3 mb-10">
                  <div className="p-2.5 bg-indigo-50 rounded-2xl"><BarChart3 size={18} className="text-indigo-600" /></div>
                  <h4 className="text-[11px] font-black uppercase text-slate-900 tracking-widest">Thống kê dữ liệu tổng quan</h4>
                </div>
                <div className="h-80">
                  <Bar 
                    data={overviewChartData} 
                    options={{
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: {
                        y: { beginAtZero: true, grid: { color: "#F1F5F9" } },
                        x: { grid: { display: false } }
                      }
                    }} 
                  />
                </div>
              </section>

              {/* Gender Chart - Repositioned */}
              <div className="bg-white p-8 rounded-[3rem] border border-slate-50 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center gap-10">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-blue-50 rounded-2xl"><PieChart size={18} className="text-blue-600" /></div>
                    <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Cơ cấu giới tính</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50/50 p-4 rounded-3xl">
                      <p className="text-[10px] font-black uppercase text-blue-400 mb-1">Nam giới</p>
                      <p className="text-2xl font-black text-blue-600">{maleCount}</p>
                    </div>
                    <div className="bg-pink-50/50 p-4 rounded-3xl">
                      <p className="text-[10px] font-black uppercase text-pink-400 mb-1">Nữ giới</p>
                      <p className="text-2xl font-black text-pink-600">{femaleCount}</p>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-64 h-64 flex items-center justify-center">
                   <Pie 
                    data={genderChartData} 
                    options={{ 
                      maintainAspectRatio: false, 
                      plugins: { legend: { display: false } } 
                    }} 
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

/* ======================
    SUB COMPONENTS
====================== */

const StatCard = ({ label, value, icon, color }) => (
  <div className="group bg-white p-7 rounded-[2.5rem] border border-white shadow-xl shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300">
    <div className={`${color} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">{label}</p>
    <p className="text-3xl font-black text-slate-900 tracking-tighter">{value.toLocaleString()}</p>
  </div>
);

export default ChapterDashboardPage;