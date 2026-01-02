import React, { useEffect, useState } from "react";
import CustomInput from "../../component/custom/CustomInput";
import { PlusSquare, Search, Download, Pencil } from "lucide-react";

import CustomSection from "../../component/custom/CustomSection";
import { CheckOption } from "../../../core/components/CheckOption";
import CreateDocumentModal from "../component/CreateDocumentModal";
import apiClient from "../../../utils/api";
import customCache from "../../../utils/customCache";
import { CustomLabel } from "../../component/custom/CustomLabel";
import { DocumentItem } from "../component/DocumentItem";
import EditDocumentModal from "../component/EditDocumentModal";

export const documentTypes = {
  baoCao: { label: "Báo cáo", icon: "FileChartColumn", color: "blue" },
  huongDan: { label: "Hướng dẫn", icon: "BookOpen", color: "indigo" },
  keHoach: { label: "Kế hoạch", icon: "CalendarCheck", color: "cyan" },
  congVan: { label: "Công văn", icon: "FileText", color: "gray" },
  ketLuan: { label: "Kết luận", icon: "CheckCircle", color: "emerald" },
  quyetDinh: { label: "Quyết định", icon: "Stamp", color: "red" },
  thongBao: { label: "Thông báo", icon: "Bell", color: "yellow" },
  nghiQuyet: { label: "Nghị quyết", icon: "Scroll", color: "purple" },
  quyDinh: { label: "Quy định", icon: "ShieldCheck", color: "slate" },
  chiThi: { label: "Chỉ thị", icon: "Megaphone", color: "orange" },
  thongTri: { label: "Thông tri", icon: "Mail", color: "teal" },
  taiLieuChiDoan: {
    label: "Tài liệu sinh hoạt chi đoàn",
    icon: "Users",
    color: "green",
  },
  taiLieuCLB: {
    label: "Tài liệu sinh hoạt CLB Lý luận trẻ",
    icon: "Lightbulb",
    color: "pink",
  },
};

const DocumentListPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editDoc, setEditDoc] = useState(null);

  // ================================
  // FILTER
  // ================================
  const [filters, setFilters] = useState({
    searchText: "",
    selectedTypes: [],
  });

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // ================================
  // FETCH DOCUMENTS
  // ================================
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/api/documents");

      if (res.success) {
        setDocuments(res.data.documents || []);
      } else {
        setDocuments([]);
      }
    } catch (err) {
      console.error(err);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // ================================
  // FILTERED DATA
  // ================================
  const filteredDocuments = documents.filter((doc) => {
    const matchText =
      doc.name?.toLowerCase().includes(filters.searchText.toLowerCase()) ||
      doc.docCode?.toLowerCase().includes(filters.searchText.toLowerCase());

    const matchType =
      !filters.selectedTypes.length || filters.selectedTypes.includes(doc.type);

    return matchText && matchType;
  });

  const myAccount = localStorage.getItem("my_account");
  const role = JSON.parse(myAccount).type;

  return (
    <div className="p-6 flex flex-col">
      {/* SEARCH + CREATE + FILTER */}
      <div className="bg-white p-6 shadow-md rounded-md grid grid-cols-12 border border-gray-200 gap-6 mb-6">
        <CustomInput
          className={`${
            role == "chapter" ? "md:col-span-10" : "md:col-span-12"
          } col-span-12 text-sm`}
          beforeIcon={<Search />}
          value={filters.searchText}
          onChange={(e) => updateFilter("searchText", e.target.value)}
          placeholder="Nhập tên, số hiệu tài liệu"
        />
        {role == "chapter" && (
          <button
            onClick={() => setOpenModal(true)}
            className="text-sm font-medium col-span-12 md:col-span-2 flex p-2 gap-2 bg-blue-600 items-center justify-center text-white rounded-md"
          >
            <PlusSquare /> Thêm tài liệu
          </button>
        )}

        <CustomSection className="col-span-12" label="Loại tài liệu">
          <CheckOption
            options={documentTypes}
            multiple
            value={filters.selectedTypes}
            onChange={(val) => updateFilter("selectedTypes", val)}
          />
        </CustomSection>
      </div>

      {/* HEADER TABLE */}
      <div className="hidden md:grid grid-cols-12 px-4 py-2 gap-4 border rounded-md bg-blue-900 text-white text-sm uppercase mb-2">
        <span className="col-span-2 font-medium text-center">Số hiệu</span>
        <span className="col-span-4 font-medium">Tên tài liệu</span>

        <span className="col-span-2 font-medium text-center">
          Ngày ban hành
        </span>
        <span className="col-span-4 font-medium text-center">
          Loại tài liệu
        </span>
      </div>

      {/* CONTENT */}
      {loading && (
        <div className="text-center text-gray-500 py-6">
          Đang tải dữ liệu...
        </div>
      )}

      {!loading && filteredDocuments.length === 0 && (
        <div className="text-center text-gray-500 py-6">
          Không có tài liệu nào
        </div>
      )}

      {!loading &&
        filteredDocuments.map((doc) => (
          <DocumentItem
            key={doc._id}
            data={doc}
            onEdit={(item) => {
              setEditDoc(item);
              // mở modal edit
            }}
          />
        ))}

      {/* MODAL */}
      <CreateDocumentModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={async (data) => {
          const res = await apiClient.post("/api/documents", {
            ...data,
            type: data.type[0],
            chapterId: customCache.myAccount.get().chapter._id,
          });

          if (res.success) {
            setOpenModal(false);
            fetchDocuments();
          }
        }}
      />
      <EditDocumentModal
        open={!!editDoc}
        document={editDoc}
        onClose={() => setEditDoc(null)}
        onSubmit={async (payload) => {
          await apiClient.put(`/api/documents/${editDoc._id}`, payload);
          fetchDocuments();
        }}
      />
    </div>
  );
};

export default DocumentListPage;
