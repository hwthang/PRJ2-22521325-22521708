import React, { useEffect, useState, useMemo } from "react";
import { Loader2, X } from "lucide-react";
import { toast } from "react-toastify";
import { base_url } from "../../../utils/api";
import DocumentService from "../service/DocumentService";
import DocumentSidebar from "../component/DocumentSidebar";
import DocumentPreview from "../component/DocumentPreview";

const DocumentPostPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);

  // State Filter
  const [searchText, setSearchText] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);

  // Feedback State
  const [openFeedback, setOpenFeedback] = useState(false);
  const [feedbackDoc, setFeedbackDoc] = useState(null);
  const [feedbackContent, setFeedbackContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${base_url}/api/documents`);
        const json = await res.json();
        if (json.success) {
          setDocuments(json.data.documents);
          if (json.data.documents.length > 0) setSelectedDoc(json.data.documents[0]);
        }
      } catch (err) {
        toast.error("Không thể tải danh sách tài liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  // LOGIC LỌC TÀI LIỆU
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchText = !searchText || 
        doc.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        doc.docCode?.toLowerCase().includes(searchText.toLowerCase());
      
      const matchType = !selectedTypes.length || selectedTypes.includes(doc.type);
      
      return matchText && matchType;
    });
  }, [documents, searchText, selectedTypes]);

  const handleSubmitFeedback = async () => {
    if (!feedbackContent.trim()) return;
    try {
      setSubmitting(true);
      await DocumentService.createComment(feedbackDoc.postId._id, { comment: feedbackContent });
      toast.success("Gửi góp ý thành công");
      setOpenFeedback(false);
      setFeedbackContent("");
    } catch (err) {
      toast.error("Gửi góp ý thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <Loader2 size={40} className="animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="p-6 bg-[#f8faff] min-h-screen">
      <div className="max-w-[1700px] mx-auto">
        <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">KHO TÀI LIỆU</h1>
            <p className="text-slate-500 font-medium">Hệ thống quản lý văn bản và báo cáo trực tuyến</p>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-6">
          <DocumentSidebar 
            documents={filteredDocuments}
            selectedId={selectedDoc?._id}
            onSelect={setSelectedDoc}
            searchText={searchText}
            setSearchText={setSearchText}
            selectedTypes={selectedTypes}
            setSelectedTypes={setSelectedTypes}
            onOpenFeedback={(doc) => {
              setFeedbackDoc(doc);
              setOpenFeedback(true);
            }}
          />
          
          <DocumentPreview selectedDoc={selectedDoc} />
        </div>
      </div>

      {/* FEEDBACK MODAL */}
      {openFeedback && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-slate-800">Góp ý tài liệu</h2>
              <button onClick={() => setOpenFeedback(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
            </div>
            <div className="mb-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <p className="text-[10px] text-blue-600 font-bold uppercase mb-1">Đang góp ý cho:</p>
              <p className="font-bold text-slate-700 leading-tight">{feedbackDoc?.name}</p>
            </div>
            <textarea
              rows={5}
              value={feedbackContent}
              onChange={(e) => setFeedbackContent(e.target.value)}
              placeholder="Nội dung góp ý của bạn sẽ giúp tài liệu hoàn thiện hơn..."
              className="w-full border border-slate-200 rounded-2xl p-4 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all"
            />
            <div className="mt-8 flex justify-end gap-3">
              <button onClick={() => setOpenFeedback(false)} className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors">Hủy</button>
              <button
                disabled={submitting || !feedbackContent.trim()}
                onClick={handleSubmitFeedback}
                className="px-8 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-200"
              >
                {submitting ? "Đang gửi..." : "Gửi góp ý"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentPostPage;