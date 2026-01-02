import { useState, useMemo } from "react";
import { EVENT_TAGS, EVENT_STATUS } from "../shared/EventMap";

/**
 * Custom hook quản lý danh sách events, filter và search
 */
export const useEventList = (
  initialEvents = [
    {
      id: 1,
      name: "Mùa Hè Xanh 2025",
      scope: "noi_bo",
      tags: ["mua_he_xanh", "hoat_dong_tinh_nguyen"],
      status: "sap_dien_ra",
      startedAt: "2025-06-01T08:00:00.000Z",
      endedAt: "2025-06-10T18:00:00.000Z",
      venue: "Số 123, Đường Lê Lợi, Phường Bến Thành, Quận 1, TP.HCM",
    },
    {
      id: 2,
      name: "Xuân Tình Nguyện 2025",
      scope: "cong_khai",
      tags: ["xuan_tinh_nguyen", "tuyen_truyen_giao_duc"],
      status: "dang_dien_ra",
      startedAt: "2025-01-15T08:00:00.000Z",
      endedAt: "2025-01-20T18:00:00.000Z",
      venue: "Số 45, Đường Trần Hưng Đạo, Phường Cửa Nam, Hoàn Kiếm, Hà Nội",
    },
    {
      id: 3,
      name: "Hiến Máu Nhân Đạo Tháng 4",
      scope: "noi_bo",
      tags: ["hien_mau_nhan_dao", "an_sinh_xa_hoi"],
      status: "da_huy",
      startedAt: "2025-04-20T08:00:00.000Z",
      endedAt: "2025-04-20T12:00:00.000Z",
      venue: "Số 201, Đường Nguyễn Thị Minh Khai, Phường 6, Quận 3, TP.HCM",
    },
    {
      id: 4,
      name: "Hội Trại Thanh Niên 2025",
      scope: "cong_khai",
      tags: [
        "hoi_trai_thanh_nien",
        "phat_trien_doan_vien",
        "phong_trao_thanh_nien",
      ],
      status: "sap_dien_ra",
      startedAt: "2025-07-10T08:00:00.000Z",
      endedAt: "2025-07-12T18:00:00.000Z",
      venue: "Số 78, Khu du lịch Đồng Mô, Xã Đại Thịnh, Huyện Mê Linh, Hà Nội",
    },
    {
      id: 5,
      name: "Sáng Tạo Trẻ 2025",
      scope: "noi_bo",
      tags: ["sang_tao_tre", "khoi_nghiep_tre", "tu_hoc_phat_trien"],
      status: "dang_dien_ra",
      startedAt: "2025-09-01T08:00:00.000Z",
      endedAt: "2025-09-05T18:00:00.000Z",
      venue: "Số 10, Đường Nguyễn Văn Trỗi, Phường 12, Quận Phú Nhuận, TP.HCM",
    },
    {
      id: 6,
      name: "Bảo Vệ Môi Trường",
      scope: "cong_khai",
      tags: ["bao_ve_moi_truong", "bao_ton_van_hoa"],
      status: "sap_dien_ra",
      startedAt: "2025-05-10T07:00:00.000Z",
      endedAt: "2025-05-15T17:00:00.000Z",
      venue: "Số 56, Đường Trần Phú, Phường Vĩnh Ninh, TP. Huế",
    },
    {
      id: 7,
      name: "Hỗ Trợ Đồng Bào Miền Trung",
      scope: "noi_bo",
      tags: ["giup_do_dong_bao"],
      status: "dang_dien_ra",
      startedAt: "2025-08-01T08:00:00.000Z",
      endedAt: "2025-08-10T18:00:00.000Z",
      venue: "Số 89, Đường Lý Thường Kiệt, Phường An Hải, Quảng Nam",
    },
    {
      id: 8,
      name: "Văn Nghệ – Thể Thao Thanh Niên",
      scope: "cong_khai",
      tags: ["van_nghe_the_thao", "tri_an_den_on"],
      status: "da_huy",
      startedAt: "2025-11-15T08:00:00.000Z",
      endedAt: "2025-11-16T18:00:00.000Z",
      venue: "Số 22, Đường Hoàng Diệu, Phường 5, Quận 3, TP.HCM",
    },
    {
      id: 9,
      name: "Khởi Nghiệp Trẻ 2025",
      scope: "noi_bo",
      tags: ["khoi_nghiep_tre"],
      status: "sap_dien_ra",
      startedAt: "2025-03-01T08:00:00.000Z",
      endedAt: "2025-03-05T18:00:00.000Z",
      venue: "Số 11, Đường Võ Văn Kiệt, Phường An Lạc, Quận Bình Tân, TP.HCM",
    },
    {
      id: 10,
      name: "Tự Học – Phát Triển Bản Thân",
      scope: "cong_khai",
      tags: ["tu_hoc_phat_trien"],
      status: "dang_dien_ra",
      startedAt: "2025-02-10T08:00:00.000Z",
      endedAt: "2025-02-12T18:00:00.000Z",
      venue: "Số 34, Đường Trần Phú, Phường 3, TP. Đà Lạt",
    },
    {
      id: 11,
      name: "An Sinh Xã Hội 2025",
      scope: "noi_bo",
      tags: ["an_sinh_xa_hoi"],
      status: "dang_dien_ra",
      startedAt: "2025-04-05T08:00:00.000Z",
      endedAt: "2025-04-08T18:00:00.000Z",
      venue: "Số 90, Đường Nguyễn Huệ, Phường 1, TP. Vũng Tàu",
    },
    {
      id: 12,
      name: "Chuyển Đổi Số Thanh Niên",
      scope: "cong_khai",
      tags: ["chuyen_doi_so"],
      status: "sap_dien_ra",
      startedAt: "2025-07-15T08:00:00.000Z",
      endedAt: "2025-07-18T18:00:00.000Z",
      venue: "Số 56, Đường Hai Bà Trưng, Phường Tân Định, TP.HCM",
    },
    {
      id: 13,
      name: "Bảo Vệ Tổ Quốc – Thanh Niên",
      scope: "noi_bo",
      tags: ["bao_ve_to_quoc"],
      status: "dang_dien_ra",
      startedAt: "2025-06-20T08:00:00.000Z",
      endedAt: "2025-06-25T18:00:00.000Z",
      venue: "Số 23, Đường Trần Quốc Toản, Phường 7, Quận 3, TP.HCM",
    },
    {
      id: 14,
      name: "Phong Trào Thanh Niên",
      scope: "cong_khai",
      tags: ["phong_trao_thanh_nien"],
      status: "da_huy",
      startedAt: "2025-08-15T08:00:00.000Z",
      endedAt: "2025-08-20T18:00:00.000Z",
      venue: "Số 101, Đường Phan Chu Trinh, Phường Bến Nghé, Quận 1, TP.HCM",
    },
    {
      id: 15,
      name: "Tri Ân – Đền Ơn Đáp Nghĩa",
      scope: "noi_bo",
      tags: ["tri_an_den_on"],
      status: "sap_dien_ra",
      startedAt: "2025-09-10T08:00:00.000Z",
      endedAt: "2025-09-12T18:00:00.000Z",
      venue: "Số 7, Đường Lý Thường Kiệt, Phường 2, TP. Huế",
    },
    {
      id: 16,
      name: "Bảo Tồn Văn Hóa 2025",
      scope: "cong_khai",
      tags: ["bao_ton_van_hoa"],
      status: "dang_dien_ra",
      startedAt: "2025-10-01T08:00:00.000Z",
      endedAt: "2025-10-05T18:00:00.000Z",
      venue: "Số 12, Đường Nguyễn Trãi, Phường 1, TP. Hội An",
    },
  ]
) => {
  // Danh sách gốc
  const [events, setEvents] = useState(initialEvents);

  // Tìm kiếm text
  const [searchText, setSearchText] = useState("");

  // Filter trạng thái: array of keys, ví dụ ["sap_dien_ra", "da_huy"]
  const [statusFilter, setStatusFilter] = useState([]);

  // Filter tags: array of keys, ví dụ ["mua_he_xanh"]
  const [tagFilter, setTagFilter] = useState([]);

  // Sort order: "asc" hoặc "desc"
  const [sortOrder, setSortOrder] = useState("asc");

  // Danh sách filtered & searched
  const filteredEvents = useMemo(() => {
    return events
      .filter((event) => {
        // Filter theo trạng thái
        if (statusFilter.length > 0 && !statusFilter.includes(event.status))
          return false;

        // Filter theo tags (event.tags là array)
        if (
          tagFilter.length > 0 &&
          !event.tags.some((tag) => tagFilter.includes(tag))
        )
          return false;

        // Search theo tên event (hoặc các trường khác nếu muốn)
        if (
          searchText &&
          !event.name.toLowerCase().includes(searchText.toLowerCase())
        )
          return false;

        return true;
      })
      .sort((a, b) => {
        if (sortOrder === "asc")
          return new Date(a.startDate) - new Date(b.startDate);
        else return new Date(b.startDate) - new Date(a.startDate);
      });
  }, [events, searchText, statusFilter, tagFilter, sortOrder]);

  return {
    events: filteredEvents,
    setEvents,
    searchText,
    setSearchText,
    statusFilter,
    setStatusFilter,
    tagFilter,
    setTagFilter,
    sortOrder,
    setSortOrder,
  };
};
