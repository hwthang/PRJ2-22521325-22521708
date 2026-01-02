import React, { useState } from 'react';
import { UserCircle, Calendar, MessageSquare, X, Info } from 'lucide-react';

const SurveyResultsSection = ({ results }) => {
  const [selectedResult, setSelectedResult] = useState(null);

  if (!results || results.length === 0) return null;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-lg font-black text-blue-800 uppercase tracking-tight">
          Phản hồi gần đây
        </h2>
      </div>

      <div className="grid gap-4">
        {results.slice(0, 5).map((res, idx) => {
          const memberInfo = res.member?.accountId || {};
          const firstAnswer = res.answers?.[0];

          return (
            <div 
              key={res._id || idx} 
              onClick={() => setSelectedResult(res)}
              className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all group cursor-pointer active:scale-[0.99]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {memberInfo.avatar?.path ? (
                    <img 
                      src={memberInfo.avatar.path} 
                      alt="avatar" 
                      className="w-10 h-10 rounded-full object-cover border-2 border-slate-100 shadow-sm"
                    />
                  ) : (
                    <UserCircle size={40} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                  )}
                  <div>
                    <span className="font-bold text-slate-800 text-sm block italic group-hover:not-italic group-hover:text-blue-700 transition-all">
                      {memberInfo.displayName || "Người dùng ẩn danh"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      Mã SV: {res.member?.memberCode || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 text-[10px] text-slate-400 font-bold">
                  <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg text-slate-500">
                    <Calendar size={12} />
                    {new Date(res.completedAt || res.createdAt).toLocaleString('vi-VN')}
                  </div>
                </div>
              </div>
              
              {firstAnswer && (
                <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100/50">
                  <p className="text-[10px] text-blue-600 font-black uppercase mb-1 flex items-center gap-1.5">
                    <MessageSquare size={12} /> {firstAnswer.question}
                  </p>
                  <p className="text-xs text-slate-700 font-medium italic line-clamp-2">
                    "{Array.isArray(firstAnswer.answer) ? firstAnswer.answer.join(", ") : firstAnswer.answer}"
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* POPUP XEM CHI TIẾT */}
      {selectedResult && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 transition-all">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setSelectedResult(null)}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-xl max-h-[85vh] overflow-hidden rounded-[32px] shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200">
                  <Info size={20} />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 uppercase text-sm tracking-tight">Chi tiết phản hồi</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    ID: {selectedResult._id?.slice(-8)}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedResult(null)}
                className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-red-500 transition-all border border-transparent hover:border-slate-100 shadow-sm"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {/* Member Info Card */}
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <img 
                  src={selectedResult.member?.accountId?.avatar?.path || "https://ui-avatars.com/api/?name=" + selectedResult.member?.accountId?.displayName} 
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                  alt="avatar"
                />
                <div>
                  <p className="font-bold text-slate-900">{selectedResult.member?.accountId?.displayName}</p>
                  <p className="text-xs text-slate-500 font-medium">{selectedResult.member?.accountId?.email || 'Chưa cập nhật email'}</p>
                </div>
              </div>

              {/* Answers List */}
              <div className="flex flex-col gap-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Danh sách câu trả lời</p>
                {selectedResult.answers?.map((ans, i) => (
                  <div key={i} className="group p-4 rounded-2xl border border-slate-100 bg-white hover:border-blue-200 transition-all">
                    <p className="text-xs font-bold text-slate-500 mb-2 flex items-start gap-2 leading-relaxed">
                      <span className="bg-slate-100 text-slate-500 w-5 h-5 rounded-md flex items-center justify-center text-[10px] flex-shrink-0">
                        {i + 1}
                      </span>
                      {ans.question}
                    </p>
                    <div className="pl-7">
                       <p className="text-sm font-bold text-blue-700 bg-blue-50/50 p-3 rounded-xl border border-blue-100/30">
                        {Array.isArray(ans.answer) ? (
                          <div className="flex flex-wrap gap-2">
                            {ans.answer.map((item, idx) => (
                              <span key={idx} className="bg-white px-2 py-0.5 rounded-lg shadow-sm border border-blue-100">{item}</span>
                            ))}
                          </div>
                        ) : (
                          ans.answer
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button 
                onClick={() => setSelectedResult(null)}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
              >
                Đóng lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyResultsSection;