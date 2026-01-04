import React, { useState, useEffect, useRef } from "react";
import {
  Edit2,
  User,
  Trophy,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  BookOpen,
  Globe,
  Hash,
  X,
  Camera,
  Star,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Zap,
  Crown,
  Check,
  ChevronRight,
  ClipboardList,
  ShieldAlert,
  FileText,
  CalendarDays,
  Loader2,
} from "lucide-react";

// --- CONFIG ---
const API_URL = "http://localhost:5000/api";

// Đảm bảo các đường dẫn này chính xác trong project của bạn
import { onUpload } from "../../utils/cloudinary"; 
import { defAvatar } from "../../core/assets/images";

// --- SUB-COMPONENTS (Phải định nghĩa trước hoặc ngoài component chính) ---

const InputField = ({ label, value, isEditing, onChange, type = "text" }) => (
  <div className="space-y-2.5 group">
    <label className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-blue-600 transition-colors">
      {label}
    </label>
    {isEditing ? (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-blue-50/30 border border-blue-100 rounded-2xl px-5 py-4 text-sm font-bold focus:bg-white focus:ring-4 ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300 shadow-sm"
      />
    ) : (
      <div className="bg-blue-50/20 rounded-2xl px-5 py-4 text-sm font-black text-slate-800 border border-transparent group-hover:bg-blue-50/50 group-hover:border-blue-100 transition-all cursor-default min-h-[52px] flex items-center">
        {value || (
          <span className="text-slate-300 font-normal italic">
            Chưa cập nhật
          </span>
        )}
      </div>
    )}
  </div>
);

const SideInfo = ({ label, value, icon }) => (
  <div className="flex items-center justify-between p-5 bg-blue-50/30 rounded-[1.8rem] border border-blue-100/30 hover:bg-white hover:shadow-xl hover:border-blue-200 transition-all group cursor-default">
    <div className="flex items-center gap-4 text-blue-400 group-hover:text-blue-600 transition-colors">
      <div className="p-2 bg-white rounded-xl shadow-sm border border-blue-50 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="text-[11px] font-black uppercase tracking-widest">
        {label}
      </span>
    </div>
    <span className="text-xs font-black text-blue-900">{value || "---"}</span>
  </div>
);

const EvaluationCard = ({ data }) => {
  const isReward = data.type === "reward";
  return (
    <div
      className={`group relative bg-white rounded-[2rem] border-l-4 p-5 shadow-sm hover:shadow-md transition-all duration-300 border-slate-100 ${
        isReward
          ? "border-l-emerald-500 bg-emerald-50/10"
          : "border-l-rose-500 bg-rose-50/10"
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                isReward
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-rose-100 text-rose-700"
              }`}
            >
              {isReward ? "Khen thưởng" : "Kỷ luật"}
            </div>
            <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold">
              <CalendarDays size={12} />
              {new Date(data.createdAt).toLocaleDateString("vi-VN")}
            </div>
          </div>

          <h3 className="text-slate-800 font-black text-sm group-hover:text-blue-600 transition-colors mb-1">
            {data.title}
          </h3>
          <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 font-medium">
            {data.description}
          </p>
        </div>

        {data.attachments?.length > 0 && (
          <div className="flex -space-x-2 overflow-hidden py-1">
            {data.attachments.map((file, idx) => (
              <a
                key={idx}
                href={file.path || file.url}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 flex items-center justify-center bg-white border-2 border-slate-100 rounded-xl text-blue-500 hover:-translate-y-1 hover:z-10 transition-all shadow-sm"
              >
                <FileText size={16} />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const MemberDashboard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [memberData, setMemberData] = useState(null);
  const [formData, setFormData] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [myRankInfo, setMyRankInfo] = useState({ rank: 0, score: 0 });
  const [evaluations, setEvaluations] = useState([]);
  const [evalLoading, setEvalLoading] = useState(false);

  const fileInputRef = useRef(null);

  const myAccount = JSON.parse(localStorage.getItem("my_account") || "{}");
  const memberId = myAccount.member?._id;
  const accountId = myAccount._id;

  const fetchEvaluations = async () => {
    if (!memberId) return;
    try {
      setEvalLoading(true);
      const res = await fetch(`${API_URL}/evaluations/?memberId=${memberId}`);
      const json = await res.json();
      if (json.success) {
        setEvaluations(json.data.evaluations);
      }
    } catch (e) {
      console.error("Lỗi lấy danh sách đánh giá:", e);
    } finally {
      setEvalLoading(false);
    }
  };

  const fetchLeaderboard = async (chapterId) => {
    try {
      const res = await fetch(`${API_URL}/members/leaderboard?chapterId=${chapterId}`);
      const json = await res.json();
      if (json.success) {
        const list = json.data.leaderboard || [];
        setLeaderboard(list);
        const myIndex = list.findIndex((item) => item.memberId === memberId);
        if (myIndex !== -1) {
          setMyRankInfo({
            rank: myIndex + 1,
            score: list[myIndex].score,
          });
        }
      }
    } catch (e) {
      console.error("Lỗi lấy BXH:", e);
    }
  };

  const fetchData = async () => {
    if (!memberId) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/members/${memberId}`);
      const json = await res.json();

      if (json.success) {
        const m = json.data.member;
        setMemberData(m);
        setFormData({
          fullName: m.fullName || "",
          email: m.accountId?.email || "",
          phoneNumber: m.accountId?.phoneNumber || "",
          dateOfBirth: m.dateOfBirth ? m.dateOfBirth.split("T")[0] : "",
          hometown: m.hometown || "",
          gender: m.gender || "Nam",
          memberCode: m.memberCode || "",
          position: m.position || "",
          chapterName: m.chapterId?.name || "",
          address: m.address || "",
          ethnicity: m.ethnicity || "",
          religion: m.religion || "",
          education: m.education || "",
          qualification: m.qualification || "",
          politicalTheory: m.politicalTheory || "",
          joinedAt: m.joinedAt ? m.joinedAt.split("T")[0] : "",
        });

        if (m.accountId?.avatar) {
          setAvatarPreview(m.accountId.avatar.url);
        }

        if (m.chapterId?._id) {
          fetchLeaderboard(m.chapterId._id);
        }
        fetchEvaluations();
      }
    } catch (e) {
      console.error("Lỗi lấy thông tin thành viên:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const oldPreview = avatarPreview;
    const tempURL = URL.createObjectURL(file);
    setAvatarPreview(tempURL);

    try {
      setIsUploadingAvatar(true);
      const media = await onUpload(file, "image");

      const res = await fetch(`${API_URL}/accounts/${accountId}/change-avatar`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: media }),
      });

      const json = await res.json();
      if (json.success) {
        setAvatarPreview(media.url);
      } else {
        throw new Error(json.message || "Server không chấp nhận ảnh");
      }
    } catch (error) {
      alert("Lỗi: " + (error.message || "Không thể cập nhật ảnh đại diện"));
      setAvatarPreview(oldPreview);
    } finally {
      setIsUploadingAvatar(false);
      URL.revokeObjectURL(tempURL);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/members/${memberId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsEditing(false);
        fetchData();
      } else {
        alert("Cập nhật thất bại!");
      }
    } catch (e) {
      alert("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  if (!memberData) {
    return (
      <div className="h-screen flex items-center justify-center bg-blue-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-black text-blue-900 uppercase tracking-widest text-xs">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F7FF] p-4 lg:p-6 text-sm text-slate-700 font-sans">
      <div className="max-w-6xl mx-auto space-y-5">
        
        {/* HEADER PROFILE */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-blue-100/50 border border-blue-50 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-3xl overflow-hidden ring-4 ring-blue-50 shadow-2xl relative bg-slate-100">
                <img
                  src={avatarPreview || `https://ui-avatars.com/api/?name=${formData.fullName}&background=2563EB&color=fff&size=128`}
                  alt="Avatar"
                  className={`w-full h-full object-cover transition-opacity duration-300 ${isUploadingAvatar ? 'opacity-40' : 'opacity-100'}`}
                />
                {isUploadingAvatar && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 size={24} className="text-blue-600 animate-spin" />
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current.click()}
                disabled={isUploadingAvatar}
                className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-xl shadow-lg hover:bg-blue-700 transition-all hover:scale-110 disabled:opacity-50 z-10"
              >
                <Camera size={16} />
              </button>
              <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleAvatarChange} />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-black text-blue-900 tracking-tight uppercase leading-none">{formData.fullName}</h1>
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-md shadow-blue-200">
                  {formData.position}
                </span>
                <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xs bg-blue-50 px-3 py-1.5 rounded-lg">
                  <Hash size={12} /> Mã: {formData.memberCode}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-blue-900 text-white px-8 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] hover:bg-blue-800 transition-all shadow-xl shadow-blue-200/50 active:scale-95"
              >
                <Edit2 size={14} /> Sửa hồ sơ
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleUpdate}
                  className="bg-emerald-600 text-white px-8 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] flex items-center gap-2 shadow-xl shadow-emerald-100 active:scale-95"
                >
                  <Check size={16} /> {loading ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-slate-100 text-slate-500 px-4 py-3.5 rounded-2xl hover:bg-slate-200 transition-colors active:scale-95"
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-8 space-y-6">
            {/* THÔNG TIN CÁ NHÂN */}
            <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-blue-50">
              <div className="flex items-center gap-3 mb-8 border-b border-blue-50 pb-6">
                <div className="p-2.5 bg-blue-600 rounded-2xl text-white shadow-blue-200 shadow-lg">
                  <User size={20} />
                </div>
                <h3 className="text-[13px] font-black text-blue-900 uppercase tracking-[0.2em]">Thông tin cá nhân</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
                <InputField label="Họ và tên" value={formData.fullName} isEditing={isEditing} onChange={(v) => setFormData({ ...formData, fullName: v })} />
                <InputField label="Địa chỉ Email" value={formData.email} isEditing={isEditing} onChange={(v) => setFormData({ ...formData, email: v })} />
                <InputField label="Số điện thoại" value={formData.phoneNumber} isEditing={isEditing} onChange={(v) => setFormData({ ...formData, phoneNumber: v })} />
                <InputField label="Ngày sinh" value={formData.dateOfBirth} type="date" isEditing={isEditing} onChange={(v) => setFormData({ ...formData, dateOfBirth: v })} />
                <InputField label="Giới tính" value={formData.gender} isEditing={isEditing} onChange={(v) => setFormData({ ...formData, gender: v })} />
                <InputField label="Quê quán" value={formData.hometown} isEditing={isEditing} onChange={(v) => setFormData({ ...formData, hometown: v })} />
                <div className="md:col-span-2">
                  <InputField label="Địa chỉ cư trú" value={formData.address} isEditing={isEditing} onChange={(v) => setFormData({ ...formData, address: v })} />
                </div>
              </div>
            </section>

            {/* KHEN THƯỞNG & KỶ LUẬT */}
            <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-blue-50">
              <div className="flex items-center justify-between mb-8 border-b border-blue-50 pb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-600 rounded-2xl text-white shadow-emerald-200 shadow-lg">
                    <ClipboardList size={20} />
                  </div>
                  <h3 className="text-[13px] font-black text-blue-900 uppercase tracking-[0.2em]">Khen thưởng & Kỷ luật</h3>
                </div>
              </div>
              <div className="space-y-4">
                {evalLoading ? (
                  <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-600" size={24} /></div>
                ) : evaluations.length > 0 ? (
                  evaluations.map((item) => <EvaluationCard key={item._id} data={item} />)
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200">
                    <ShieldAlert className="text-slate-300 mb-2" size={32} />
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">Chưa có dữ liệu đánh giá</p>
                  </div>
                )}
              </div>
            </section>

            {/* HỒ SƠ ĐOÀN VIÊN */}
            <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-blue-50">
              <div className="flex items-center gap-3 mb-8 border-b border-blue-50 pb-6">
                <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-indigo-200 shadow-lg">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="text-[13px] font-black text-blue-900 uppercase tracking-[0.2em]">Hồ sơ đoàn viên</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <SideInfo label="Chi đoàn" value={formData.chapterName} icon={<Globe size={18} />} />
                <SideInfo label="Ngày kết nạp" value={formData.joinedAt} icon={<Calendar size={18} />} />
                <SideInfo label="Trình độ học vấn" value={formData.education} icon={<GraduationCap size={18} />} />
                <SideInfo label="Lý luận chính trị" value={formData.politicalTheory} icon={<BookOpen size={18} />} />
              </div>
            </section>
          </div>

          {/* RIGHT CONTENT: LEADERBOARD */}
          <div className="lg:col-span-4 space-y-6">
            <section className="bg-white rounded-[2.5rem] p-7 shadow-2xl shadow-blue-200/40 border border-blue-50 sticky top-6">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">Bảng vàng chi đoàn</h3>
                  <p className="text-xl font-black text-blue-900 tracking-tighter">Top Gương mặt trẻ</p>
                </div>
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-2xl text-white shadow-xl shadow-blue-200">
                  <Trophy size={22} className="animate-pulse" />
                </div>
              </div>

              <div className="space-y-3.5">
                {leaderboard.length > 0 ? (
                  leaderboard.slice(0, 5).map((member, index) => (
                    <div
                      key={member.memberId}
                      className={`flex items-center justify-between p-3.5 rounded-[1.5rem] transition-all duration-500 ${
                        member.memberId === memberId
                          ? "bg-gradient-to-r from-blue-700 to-indigo-600 text-white shadow-xl shadow-blue-200 scale-[1.02] ring-2 ring-blue-400/20"
                          : "bg-blue-50/50 border border-blue-100/50 hover:bg-white hover:shadow-lg hover:border-blue-100"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img src={member?.avatar || defAvatar} className="w-11 h-11 rounded-2xl object-cover ring-2 ring-white" alt="" />
                          <div className={`absolute -top-2 -left-2 w-6 h-6 rounded-xl flex items-center justify-center text-[10px] font-black shadow-lg ${index === 0 ? "bg-yellow-400 text-white" : "bg-white text-blue-400"}`}>{index + 1}</div>
                        </div>
                        <div className="min-w-0">
                          <p className={`text-[12px] font-black truncate uppercase ${member.memberId === memberId ? "text-white" : "text-blue-900"}`}>{member.fullName}</p>
                          <div className={`flex items-center gap-1.5 text-[10px] font-bold ${member.memberId === memberId ? "text-blue-200" : "text-blue-400"}`}>
                            <Zap size={10} fill="currentColor" /> {member.score.toLocaleString()} PTS
                          </div>
                        </div>
                      </div>
                      {index < 3 && <Award size={18} className={index === 0 ? "text-yellow-400" : index === 1 ? "text-slate-300" : "text-orange-400"} />}
                    </div>
                  ))
                ) : <div className="py-10 text-center text-slate-400 italic">Chưa có dữ liệu</div>}
              </div>

              {/* CURRENT RANK BOX */}
              <div className="mt-8 pt-7 border-t border-dashed border-blue-100">
                <div className="bg-[#0F172A] rounded-[2rem] p-6 text-white relative overflow-hidden group">
                  <div className="relative flex justify-between items-center mb-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.25em]">Vị trí hiện tại</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">#{myRankInfo.rank || "--"}</span>
                        <span className="text-[11px] font-black text-slate-500 uppercase">/ {leaderboard.length}</span>
                      </div>
                    </div>
                    <div className="bg-blue-600/20 px-4 py-2.5 rounded-2xl border border-blue-500/30">
                      <p className="text-sm font-black flex items-center gap-2">
                        <Star size={16} className="text-blue-400" fill="currentColor" /> {myRankInfo.score.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase">
                      <span className="text-slate-500">Tỉ lệ vượt mức</span>
                      <span className="text-blue-400">
                        {leaderboard.length > 0 ? Math.round(((leaderboard.length - myRankInfo.rank + 1) / leaderboard.length) * 100) : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700">
                      <div 
                        className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${leaderboard.length > 0 ? ((leaderboard.length - myRankInfo.rank + 1) / leaderboard.length) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;