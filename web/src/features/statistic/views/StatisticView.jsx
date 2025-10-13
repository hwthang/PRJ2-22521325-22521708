import React, { useState } from "react";
import { FiDownload } from "react-icons/fi";
import { STATISTIC } from "../mockup/statistics";
import PieChartBox from "../components/PieChartBox";
import BarChartBox from "../components/BarChartBox";
import LineChartBox from "../components/LineChartBox";
import DateRangeFilter from "../components/DateRangeFilter";
import * as XLSX from "xlsx";

export default function StatisticView() {
  const [filter, setFilter] = useState({ period: "month" });
  const [exportOptions, setExportOptions] = useState({
    members: true,
    events: true,
    documents: true,
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { members, events, documents } = STATISTIC;

  // Thay đổi kỳ lọc
  const handleFilterChange = (newFilter) => setFilter(newFilter);

  // Lấy dataset tương ứng kỳ lọc
  const getMemberData = () => {
    switch (filter.period) {
      case "week": return members.participationWeekly;
      case "month": return members.participationMonthly;
      case "quarter": return members.participationQuarterly;
      case "year": return members.participationYearly;
      default: return members.participationMonthly;
    }
  };
  const getEventData = () => {
    switch (filter.period) {
      case "week": return events.interactionWeekly;
      case "month": return events.interactionMonthly;
      case "quarter": return events.interactionQuarterly;
      case "year": return events.interactionYearly;
      default: return events.interactionMonthly;
    }
  };
  const getDocumentData = () => {
    switch (filter.period) {
      case "week": return documents.uploadedWeekly;
      case "month": return documents.uploadedMonthly;
      case "quarter": return documents.uploadedQuarterly;
      case "year": return documents.uploadedYearly;
      default: return documents.uploadedMonthly;
    }
  };

  // Export file Excel
  const handleExport = () => {
    const wb = XLSX.utils.book_new();

    if (exportOptions.members) {
      const ws1 = XLSX.utils.json_to_sheet(getMemberData());
      XLSX.utils.book_append_sheet(wb, ws1, `DoanVien_${filter.period}`);
    }
    if (exportOptions.events) {
      const ws2 = XLSX.utils.json_to_sheet(getEventData());
      XLSX.utils.book_append_sheet(wb, ws2, `SuKien_${filter.period}`);
    }
    if (exportOptions.documents) {
      const ws3 = XLSX.utils.json_to_sheet(getDocumentData());
      XLSX.utils.book_append_sheet(wb, ws3, `TaiLieu_${filter.period}`);
    }

    XLSX.writeFile(wb, `BaoCaoThongKe_${filter.period}.xlsx`);
    setIsDropdownOpen(false);
  };

  const getLabel = (period) => {
    switch (period) {
      case "week": return "tuần";
      case "month": return "tháng";
      case "quarter": return "quý";
      case "year": return "năm";
      default: return "tháng";
    }
  };

  return (
    <div className="p-6 bg-gray-100 space-y-8">
      {/* === THANH BỘ LỌC & EXPORT === */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-white p-4 rounded-lg shadow relative">
        <DateRangeFilter onFilter={handleFilterChange} />

        {/* Dropdown chọn loại xuất báo cáo */}
        <div className="relative">
          <button
  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium shadow transition"
>
  <FiDownload className="text-lg" />
  <span>Xuất báo cáo</span>
</button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
              <p className="font-semibold text-gray-700 mb-2">
                Chọn loại thống kê:
              </p>
              <div className="flex flex-col space-y-2">
                {[
                  { key: "members", label: "Đoàn viên" },
                  { key: "events", label: "Sự kiện" },
                  { key: "documents", label: "Tài liệu" },
                ].map((opt) => (
                  <label key={opt.key} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={exportOptions[opt.key]}
                      onChange={() =>
                        setExportOptions({
                          ...exportOptions,
                          [opt.key]: !exportOptions[opt.key],
                        })
                      }
                      className="accent-green-600"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>

              <button
                onClick={handleExport}
                className="mt-3 w-full bg-green-500 hover:bg-green-600 text-white text-sm py-2 rounded-md"
              >
                Xác nhận xuất
              </button>
            </div>
          )}
        </div>
      </div>

      {/* === 1️⃣ ĐOÀN VIÊN === */}
      <section>
        <h2 className="text-xl font-bold text-blue-700 mb-4">
          Thống kê đoàn viên
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PieChartBox title="Theo giới tính" data={members.byGender} />
          <PieChartBox title="Theo vai trò" data={members.byRole} />
          <PieChartBox title="Theo tình trạng" data={members.byStatus} />
        </div>
        <div className="mt-4">
          <BarChartBox
            title={`Hoạt động theo ${getLabel(filter.period)}`}
            data={getMemberData()}
            dataKey="participation"
          />
        </div>
      </section>

      {/* === SỰ KIỆN === */}
      <section>
        <h2 className="text-xl font-bold text-pink-700 mb-4">
          Thống kê sự kiện
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PieChartBox title="Theo tình trạng" data={events.byStatus} />
          <PieChartBox title="Theo loại" data={events.byType} />
        </div>
        <div className="mt-4">
          <LineChartBox
            title={`Tương tác theo ${getLabel(filter.period)}`}
            data={getEventData()}
            dataKeys={[
              { key: "likes", color: "#10b981" },
              { key: "comments", color: "#f59e0b" },
            ]}
          />
        </div>
      </section>

      {/* === TÀI LIỆU === */}
      <section>
        <h2 className="text-xl font-bold text-green-700 mb-4">
          Thống kê tài liệu
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PieChartBox title="Theo loại" data={documents.byType} />
          <PieChartBox title="Theo phạm vi" data={documents.byScope} />
          <BarChartBox
            title={`Tải lên theo ${getLabel(filter.period)}`}
            data={getDocumentData()}
            dataKey="value"
            color="#f43f5e"
          />
        </div>
      </section>
    </div>
  );
}
