import React, { useEffect, useMemo, useState } from "react";
// Giả định đường dẫn chính xác
import customCache from "../../utils/customCache";
// Import các component biểu đồ từ react-chartjs-2
import { Pie, Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
// Import Lucide Icons
import { Users, Building, CheckCircle } from "lucide-react";
import apiClient from "../../utils/api";

// Đăng ký các thành phần cần thiết của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// --- 1. DỮ LIỆU MOCKUP (Dùng để thay thế tạm thời) ---
const MOCK_DATA = {
  accounts: [], 
  chapters: [
    { id: "c1", name: "Chi đoàn A", isActive: true },
    { id: "c2", name: "Chi đoàn B", isActive:true },
  ],
  members: [], 
};

// --- LOGIC XỬ LÝ (Giữ nguyên logic thống kê) ---
const useDashboardStats = (data) => {
  return useMemo(() => {
    const accounts = data.accounts || [];
    const chapters = data.chapters || MOCK_DATA.chapters;
    const members = data.members || [];
    
    // Thống kê chung
    const totalAccounts = accounts.length;
    const activeAccounts = accounts.filter((acc) => acc.isActive).length;
    const inactiveAccounts = totalAccounts - activeAccounts;
    const totalChapters = chapters.length;
    const totalMembers = members.length;

    // Thống kê loại tài khoản
    const accountTypes = accounts.reduce((acc, current) => {
      if (current.type === 'chapter' || current.type === 'member') {
        acc[current.type] = (acc[current.type] || 0) + 1;
      }
      return acc;
    }, {});
    
    // Thống kê giới tính
    const genderData = members.reduce((acc, current) => {
      acc[current.gender] = (acc[current.gender] || 0) + 1;
      return acc;
    }, {});

    // Thống kê theo Chi đoàn
    const membersByChapter = members.reduce((acc, current) => {
      const chapterName =
        chapters.find((c) => c._id === current.chapterId)?.name || "Khác";
      acc[chapterName] = (acc[chapterName] || 0) + 1;
      return acc;
    }, {});

    // Thống kê Đoàn viên mới theo tháng
    const newMembersByMonth = members.reduce((acc, current) => {
      if (current.joinedAt) {
        const monthYear = current.joinedAt.substring(0, 7);
        acc[monthYear] = (acc[monthYear] || 0) + 1;
      }
      return acc;
    }, {});
    const sortedDatesMembers = Object.keys(newMembersByMonth).sort();
    const lineLabelsMembers = sortedDatesMembers.map((date) => date);
    const lineDataMembers = sortedDatesMembers.map(
      (date) => newMembersByMonth[date]
    );

    // Thống kê Tăng trưởng TÀI KHOẢN mới theo tháng
    const newAccountsByMonth = accounts.reduce((acc, current) => {
      if (current.createdAt) {
        const monthYear = current.createdAt.substring(0, 7); // YYYY-MM
        acc[monthYear] = (acc[monthYear] || 0) + 1;
      }
      return acc;
    }, {});

    const sortedDatesAccounts = Object.keys(newAccountsByMonth).sort();
    const lineLabelsAccounts = sortedDatesAccounts.map((date) => date);
    const lineDataAccounts = sortedDatesAccounts.map(
      (date) => newAccountsByMonth[date]
    );

    // Bảng Tóm tắt Tài khoản mới (5 tài khoản mới nhất)
    const latestAccounts = accounts
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5); // Lấy 5 tài khoản mới nhất

    return {
      stats: {
        totalAccounts,
        activeAccounts,
        inactiveAccounts,
        totalChapters,
        totalMembers,
        accountTypes,
      },
      charts: {
        genderData,
        membersByChapter,
        memberLineChart: { labels: lineLabelsMembers, data: lineDataMembers },
        accountLineChart: {
          labels: lineLabelsAccounts,
          data: lineDataAccounts,
        },
      },
      tables: {
        latestAccounts,
        chapters,
      },
    };
  }, [data]);
};

// --- 2. CÁC COMPONENT PHỤ TRỢ (UI ELEMENTS) ---

// B. Overview Statistic Cards (ĐÃ BỎ breakdown và subtitle)
const StatCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition duration-300 hover:shadow-lg">
    <div className="flex justify-between items-start">
      <div className="text-3xl font-bold text-gray-800">{value}</div>
      {/* Lucide Icons */}
      <Icon className="w-8 h-8 text-blue-600 opacity-75" />
    </div>
    <p className="text-sm font-semibold text-gray-500 mt-1">{title}</p>
  </div>
);

// C. Biểu đồ (Tỉ lệ loại tài khoản - Pie Chart)
const AccountTypePieChart = ({ data }) => {
  const chartData = {
    labels: Object.keys(data).map((item) =>
      item === "chapter" ? "Chi đoàn" : item === "member" ? "Đoàn viên" : item
    ),
    datasets: [
      {
        data: Object.values(data),
        backgroundColor: [
          '#2563EB', // chapter: blue-600 (Xanh dương)
          '#38BDF8', // member: cyan-400 (Xanh cyan)
        ],
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "right" },
      title: {
        display: true,
        text: "Tỷ lệ loại tài khoản",
        font: { size: 16 },
      },
    },
  };

  return <Pie data={chartData} options={options} />;
};

// C. Biểu đồ (Đoàn viên theo Chi đoàn - Bar Chart)
const MembersByChapterBarChart = ({ data }) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: "Số lượng Đoàn viên",
        data: Object.values(data),
        backgroundColor: "#2563EB", // blue-600
        borderColor: "#1E3A8A",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Phân bố đoàn viên theo chi đoàn",
        font: { size: 16 },
      },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Số lượng" } },
      x: { title: { display: true, text: "Tên chi đoàn" } },
    },
  };

  return <Bar data={chartData} options={options} />;
};

// C. Biểu đồ (Đoàn viên mới theo tháng - Line Chart)
const NewMembersLineChart = ({ labels, data }) => {
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Đoàn viên mới",
        data: data,
        fill: false,
        borderColor: "#38BDF8", // cyan-400
        backgroundColor: "#38BDF8",
        tension: 0.1,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Đoàn viên mới theo tháng",
        font: { size: 16 },
      },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  return <Line data={chartData} options={options} />;
};

// C. Biểu đồ (Tăng trưởng Tài khoản theo tháng - Line Chart)
const AccountGrowthLineChart = ({ labels, data }) => {
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Tài khoản mới",
        data: data,
        fill: false,
        borderColor: "#2563EB", // blue-600
        backgroundColor: "#2563EB",
        tension: 0.1,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Tăng trưởng Tài khoản theo tháng",
        font: { size: 16 },
      },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  return <Line data={chartData} options={options} />;
};

// C. Biểu đồ (Tỉ lệ giới tính - Doughnut Chart)
const GenderDoughnutChart = ({ data }) => {
  const chartData = {
    labels: ["Nam", "Nữ"],
    datasets: [
      {
        data: [data["Nam"] || 0, data["Nữ"] || 0],
        backgroundColor: [
          "#2563EB", // Nam: blue-600
          "#FB7185", // Nữ: pink-400
        ],
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "right" },
      title: {
        display: true,
        text: "Tỷ lệ giới tính đoàn viên",
        font: { size: 16 },
      },
    },
  };

  return <Doughnut data={chartData} options={options} />;
};

// D. BẢNG (TABLE) – Tóm tắt Tài khoản mới
const NewAccountsTable = ({ accounts, chapters }) => (
  <div className="bg-white p-6 rounded-xl shadow-md mt-6 border border-gray-100">
    <h3 className="text-xl font-bold text-gray-800 mb-4">
      Tóm tắt Tài khoản mới (5 gần nhất)
    </h3>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Username
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Loại Tài khoản
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Chi đoàn (nếu có)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ngày tạo
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {accounts.map((account) => (
            <tr key={account.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {account.username || `ID ${account.id}`}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                {account.type}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {account.chapterId
                  ? chapters.find((c) => c.id === account.chapterId)?.name ||
                    account.chapterId
                  : "N/A"}
              </td>
              <td
                className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                  account.isActive ? "text-green-600" : "text-red-500"
                }`}
              >
                {account.isActive ? "Active" : "Inactive"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {account.createdAt}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// --- 3. MAIN COMPONENT ---

export const AdminDashboardPage = () => {
  const [data, setData] = useState({ 
      accounts: [], 
      chapters: MOCK_DATA.chapters, 
      members: [] 
  });
  const [isLoading, setIsLoading] = useState(true);

  const { stats, charts, tables } = useDashboardStats(data);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get("/api/statistic/admin");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    
    fetchData();
  }, []);
  
  if (isLoading) {
    return (
        <div className="p-8 text-center text-xl text-gray-600 min-h-screen bg-gray-50">
            <p>Đang tải dữ liệu Dashboard...</p>
        </div>
    );
  }

  return (
    // A. BỐ CỤC CHUNG: Nền trang và Fade-in
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen transition-opacity duration-1000 opacity-100 animate-fade-in">
      

      {/* B. OVERVIEW STATISTIC CARDS (ĐÃ BỎ "Tổng tài khoản" và CHUYỂN THÀNH LƯỚI 3 CỘT) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        <StatCard
          title="Tổng chi đoàn"
          value={stats.totalChapters}
          icon={Building}
        />
        <StatCard
          title="Tổng đoàn viên"
          value={stats.totalMembers}
          icon={Users}
        />
        <StatCard
          title="Tài khoản đang hoạt động"
          value={stats.activeAccounts}
          icon={CheckCircle}
        />
      </div>

      {/* C. BIỂU ĐỒ THỐNG KÊ (5 Biểu đồ - Bố cục 2-2-1) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hàng 1 */}
        <div className="bg-white p-6 rounded-xl shadow-md h-96 border border-gray-100">
          <AccountTypePieChart data={stats.accountTypes} />
        </div>
       

        {/* Hàng 2 */}
        
        <div className="bg-white p-6 rounded-xl shadow-md h-96 border border-gray-100">
          <GenderDoughnutChart data={charts.genderData} />
        </div>
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md h-96 border border-gray-100">
          <NewMembersLineChart
            labels={charts.memberLineChart.labels}
            data={charts.memberLineChart.data}
          />
        </div>
 <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md h-96 border border-gray-100">
          <MembersByChapterBarChart data={charts.membersByChapter} />
        </div>
      
        {/* <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md h-96 border border-gray-100">
          <AccountGrowthLineChart
            labels={charts.accountLineChart.labels}
            data={charts.accountLineChart.data}
          />
        </div> */}
      </div>

    
      {/* <NewAccountsTable
        accounts={tables.latestAccounts}
        chapters={tables.chapters}
      /> */}
    </div>
  );
};

export default AdminDashboardPage;