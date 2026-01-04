import React, { useEffect, useState, useMemo } from "react";
import SurveyService from "../service/SurveyService";
import { 
  Clock, 
  ChevronRight, 
  ClipboardCheck, 
  MapPin, 
  CheckCircle2, 
  Lock, 
  AlertCircle,
  CalendarDays,
  ArrowRight,
  Search,
  Filter,
  SortDesc,
  X,
  Layers
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatVietnamDatetimeAMPM } from "../../../utils/date";

const SurveyPostPage = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // States cho bộ lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [completionFilter, setCompletionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all"); // Lọc trạng thái: all, ongoing, ended, upcoming
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const fetchPost = async () => {
    try {
      const res = await SurveyService.fetchSurveyForMember();
      const sortedData = res.sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
      setSurveys(sortedData);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khảo sát:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  const getSurveyStatus = (post) => {
    const now = new Date();
    const start = new Date(post.startedAt);
    const end = new Date(post.endedAt);
    if (now < start) return "upcoming";
    if (now >= start && now <= end) return "ongoing";
    return "ended";
  };

  const getStatusUI = (status) => {
    switch (status) {
      case "upcoming":
        return { label: "Chưa mở", color: "bg-slate-100 text-slate-600 border-slate-200", icon: <Clock size={12} />, canTake: false };
      case "ongoing":
        return { label: "Đang diễn ra", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: <CalendarDays size={12} />, canTake: true };
      default:
        return { label: "Đã kết thúc", color: "bg-red-100 text-red-700 border-red-200", icon: <Lock size={12} />, canTake: false };
    }
  };

  // Logic lọc dữ liệu tổng hợp
  const filteredSurveys = useMemo(() => {
    return surveys.filter((post) => {
      const status = getSurveyStatus(post);
      
      // 1. Lọc theo tên
      const matchesSearch = post.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 2. Lọc theo tiến độ hoàn thành
      const matchesCompletion = 
        completionFilter === "all" || 
        (completionFilter === "done" && post.isDone) || 
        (completionFilter === "todo" && !post.isDone);

      // 3. Lọc theo trạng thái (Đang diễn ra/Kết thúc...)
      const matchesStatus = statusFilter === "all" || status === statusFilter;

      // 4. Lọc theo khoảng thời gian
      let matchesDate = true;
      const surveyStart = new Date(post.startedAt).setHours(0,0,0,0);
      const surveyEnd = new Date(post.endedAt).setHours(23,59,59,999);

      if (dateRange.start) {
        const filterStart = new Date(dateRange.start).setHours(0,0,0,0);
        if (surveyEnd < filterStart) matchesDate = false;
      }
      if (dateRange.end) {
        const filterEnd = new Date(dateRange.end).setHours(23,59,59,999);
        if (surveyStart > filterEnd) matchesDate = false;
      }

      return matchesSearch && matchesCompletion && matchesStatus && matchesDate;
    });
  }, [surveys, searchTerm, completionFilter, statusFilter, dateRange]);

  const clearFilters = () => {
    setSearchTerm("");
    setCompletionFilter("all");
    setStatusFilter("all");
    setDateRange({ start: "", end: "" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8faff]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-slate-500 font-medium">Đang tải danh sách...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faff] p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Danh sách <span className="text-blue-600">Khảo sát</span>
          </h1>
          <p className="text-slate-500 font-medium tracking-tight">
            Tìm thấy <span className="text-slate-900 font-bold">{filteredSurveys.length}</span> khảo sát phù hợp
          </p>
        </div>

        {/* Filter Panel */}
        <div className="bg-white p-5 rounded-[32px] shadow-sm border border-slate-100 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative md:col-span-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder="Tìm tên..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none appearance-none text-sm font-medium text-slate-600 cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="ongoing">Đang diễn ra</option>
                <option value="upcoming">Chưa mở</option>
                <option value="ended">Đã kết thúc</option>
              </select>
            </div>

            {/* Completion Filter */}
            <div className="relative">
              <SortDesc className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none appearance-none text-sm font-medium text-slate-600 cursor-pointer"
                value={completionFilter}
                onChange={(e) => setCompletionFilter(e.target.value)}
              >
                <option value="all">Tất cả tiến độ</option>
                <option value="todo">Chưa làm</option>
                <option value="done">Đã làm</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold min-w-fit uppercase tracking-wider">
              <Filter size={14} /> Khoảng thời gian:
            </div>
            <div className="grid grid-cols-2 gap-3 w-full md:max-w-md">
              <input 
                type="date"
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-600 outline-none focus:border-blue-400 transition-all"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              />
              <input 
                type="date"
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-600 outline-none focus:border-blue-400 transition-all"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              />
            </div>
            {(dateRange.start || dateRange.end || searchTerm || completionFilter !== "all" || statusFilter !== "all") && (
              <button 
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-red-500 text-xs font-bold hover:bg-red-50 px-4 py-2 rounded-xl transition-all ml-auto"
              >
                <X size={14} /> Xóa bộ lọc
              </button>
            )}
          </div>
        </div>

        {/* Danh sách Survey */}
        <div className="grid gap-6">
          {filteredSurveys.length > 0 ? (
            filteredSurveys.map((post) => {
              const statusKey = getSurveyStatus(post);
              const statusUI = getStatusUI(statusKey);
              
              return (
                <div key={post._id} className={`bg-white rounded-[32px] p-6 shadow-sm border transition-all group ${post.isDone ? "border-emerald-100 bg-emerald-50/5" : "border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5"}`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex gap-5 items-start">
                      <div className={`p-4 rounded-2xl transition-all ${post.isDone ? "bg-emerald-100 text-emerald-600" : "bg-blue-50 text-blue-600 group-hover:scale-105"}`}>
                        {post.isDone ? <CheckCircle2 size={28} /> : <ClipboardCheck size={28} />}
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className={`text-xl font-bold transition-colors ${post.isDone ? "text-slate-500" : "text-slate-800"}`}>
                              {post.name}
                            </h3>
                            <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-black uppercase border ${statusUI.color}`}>
                              {statusUI.icon} {statusUI.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-400 text-sm font-medium">
                            <MapPin size={14} className="text-blue-400" /> 
                            <span>{post.chapterId?.name || "Chi đoàn hệ thống"}</span>
                          </div>
                        </div>

                        <div className="inline-flex flex-wrap items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                            <CalendarDays size={14} className="text-slate-400" />
                            {formatVietnamDatetimeAMPM(post.startedAt)}
                          </div>
                          <ArrowRight size={12} className="text-slate-300" />
                          <div className={`flex items-center gap-1.5 text-xs font-bold ${statusKey === "ended" ? "text-red-600" : "text-slate-600"}`}>
                            <Clock size={14} className={statusKey === "ended" ? "text-red-400" : "text-slate-400"} />
                            {formatVietnamDatetimeAMPM(post.endedAt)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end md:min-w-[160px]">
                      {post.isDone ? (
                        <Link to={`results/${post._id}`} className="w-full md:w-auto flex items-center justify-center gap-2 bg-white text-emerald-600 border border-emerald-200 px-6 py-3 rounded-2xl font-bold hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                          Kết quả <ChevronRight size={18} />
                        </Link>
                      ) : (
                        statusUI.canTake ? (
                          <Link to={`take/${post._id}`} className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-900/10 active:scale-95">
                            Làm ngay <ChevronRight size={18} />
                          </Link>
                        ) : (
                          <div className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-50 text-slate-400 px-6 py-3 rounded-2xl font-bold border border-slate-200 cursor-not-allowed">
                            <Lock size={18} /> <span>{statusKey === "ended" ? "Hết hạn" : "Chưa mở"}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-[40px] p-16 text-center border-2 border-dashed border-slate-200 flex flex-col items-center gap-4">
              <Search size={48} className="text-slate-200" />
              <div className="space-y-1">
                <p className="text-slate-500 font-bold text-lg">Không tìm thấy khảo sát phù hợp</p>
                <p className="text-slate-400 text-sm italic">Hãy thử thay đổi điều kiện lọc hoặc từ khóa tìm kiếm</p>
              </div>
              <button onClick={clearFilters} className="mt-2 text-blue-600 font-bold hover:underline flex items-center gap-1">
                <X size={16} /> Đặt lại tất cả
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurveyPostPage;