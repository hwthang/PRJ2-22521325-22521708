import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import apiClient, { base_url } from "../../../utils/api";
import EditDocumentForm from "../component/EditDocumentForm";
import DocumentFeedbackManager from "../component/DocumentFeedbackManager";
import { ChevronLeft } from "lucide-react";
import { toast } from "react-toastify";

const DocumentDetailPage = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]); // State riêng cho feedback
  const [loading, setLoading] = useState(true);

  const fetchFeedback = async (postId) => {
    try {
      const res = await fetch(`${base_url}/api/comments?postId=${postId}`);
      const json = await res.json();
      if (json.success) {
        setFeedbacks(json.data.comments); // Lưu danh sách comments vào state
      }
    } catch (error) {
      console.error("Lỗi fetch feedback:", error);
    }
  };

  const fetchDocument = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/api/documents/${id}`);
      setDocument(res.data.document);
      
      // Gọi fetch feedback dựa trên postId của tài liệu
      if (res.data.document?.postId?._id) {
        fetchFeedback(res.data.document.postId._id);
      }
    } catch (error) {
      toast.error("Không thể tải thông tin tài liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocument();
  }, [id]);

  const handleUpdate = async (payload) => {
    try {
      await apiClient.put(`/api/documents/${id}`, payload);
      toast.success("Tài liệu đã được cập nhật thành công!");
      fetchDocument();
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi cập nhật.");
    }
  };

  if (loading && !document)
    return <div className="p-10 text-center">Đang tải...</div>;

  return (
    <div className="p-6 flex flex-col gap-10 max-w-6xl mx-auto">
      <div className="flex items-center">
        <Link
          to={"/app/chapter/documents"}
          className="active:bg-gray-100 h-10 w-10 rounded-full flex items-center justify-center border border-gray-100 hover:shadow-sm transition-all"
        >
          <ChevronLeft />
        </Link>
        <h1 className="ml-4 font-bold text-gray-800 uppercase tracking-tight">
          Chi tiết tài liệu
        </h1>
      </div>

      <section>
        <EditDocumentForm document={document} onSubmit={handleUpdate} />
      </section>

      <div className="h-[1px] bg-gray-200 w-full"></div>

      {/* Truyền state feedbacks và hàm fetchDocument để refresh khi cần */}
      <DocumentFeedbackManager
        feedbacks={feedbacks}
        onRefresh={fetchDocument}
      />
    </div>
  );
};

export default DocumentDetailPage;