import React, { useEffect, useState } from "react";
import UserTable from "../components/UserTable";
import UserService from "../services/UserService";
import { useNavigate } from "react-router-dom";

// ================= Filter Components =================
function SearchInput({ value, onChange }) {
  return (
    <div className="relative flex-1 w-full">
      <input
        placeholder="Tìm kiếm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-2 border-gray-300 focus:border-blue-600 outline-none p-2 w-full rounded-lg"
      />
    </div>
  );
}

function RoleFilter({ selected, onChange }) {
  const roles = [
    { value: "admin", label: "Quản trị viên" },
    { value: "manager", label: "Quản lý" },
    { value: "member", label: "Đoàn viên" },
  ];

  const toggle = (role) => {
    if (selected.includes(role)) {
      onChange(selected.filter((r) => r !== role));
    } else {
      onChange([...selected, role]);
    }
  };

  return (
    <div className="flex-1 flex gap-4 items-center md:justify-around bg-blue-100 p-2 rounded-lg">
      <span className="text-nowrap font-medium w-30 md:w-fit">Vai trò:</span>
      <ul className="flex gap-4 w-full items-center md:justify-around flex-wrap">
        {roles.map((r) => (
          <li key={r.value} className="flex gap-2 items-center justify-center">
            <input
              type="checkbox"
              value={r.value}
              checked={selected.includes(r.value)}
              onChange={() => toggle(r.value)}
            />
            {r.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatusFilter({ selected, onChange }) {
  const statuses = [
    { value: "active", label: "Hoạt dộng" },
    { value: "locked", label: "Khóa" },
    { value: "pending", label: "Chờ duyệt" },
  ];

  const toggle = (status) => {
    if (selected.includes(status)) {
      onChange(selected.filter((s) => s !== status));
    } else {
      onChange([...selected, status]);
    }
  };

  return (
    <div className="flex-1 flex md:justify-around gap-4 items-center bg-blue-100 p-2 rounded-lg">
      <span className="text-nowrap font-medium w-30 md:w-fit">Trạng thái:</span>
      <ul className="flex w-full md:justify-around gap-4 items-center flex-wrap">
        {statuses.map((s) => (
          <li key={s.value} className="flex gap-2 items-center justify-center">
            <input
              type="checkbox"
              value={s.value}
              checked={selected.includes(s.value)}
              onChange={() => toggle(s.value)}
            />
            {s.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ================= Header Component =================
function UserHeader({ onRefresh, onAdd }) {
  return (
    <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
      <p className="font-medium text-2xl text-nowrap">Danh sách người dùng</p>
      <div className="flex w-full justify-between md:justify-end gap-6 items-center">
        <button
          onClick={onRefresh}
          className="px-6 py-2 bg-blue-900 active:bg-blue-800 text-white rounded-lg"
        >
          Làm mới
        </button>
        <button
          onClick={onAdd}
          className="px-6 py-2 bg-blue-900 active:bg-blue-800 text-white rounded-lg"
        >
          Thêm người dùng
        </button>
      </div>
    </div>
  );
}

// ================= Main Component =================
function UserListView() {
  const [searchText, setSearchText] = useState("");
  const [roles, setRoles] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const fetchUsers = async (search, role, status) => {
    const result = await UserService.fetchUsers();
    const users = result.data.filter((item) => {
      const fullname = item?.fullname?.toLowerCase() || "";
      const username = item?.username?.toLowerCase() || "";
      const searchTextLower = search.toLowerCase();
      const matchesSearch =
        fullname.includes(searchTextLower) || username.includes(searchTextLower);

      const matchesStatus = status.length > 0 ? status.includes(item.status) : true;
      const matchesRole = role.length > 0 ? role.includes(item.role) : true;

      return matchesSearch && matchesStatus && matchesRole;
    });
    setData(users);
  };

  const handleRefreshClick = async () => {
    setSearchText("");
    setRoles([]);
    setStatuses([]);
    await fetchUsers("", [], []);
  };

  const handleAddUserClick = () => {
    navigate("create");
  };

  useEffect(() => {
    fetchUsers(searchText, roles, statuses);
  }, [searchText, roles, statuses]);

  return (
    <div className="h-full w-full relative z-10">
      <div className="h-fit w-full p-6 md:p-10 flex flex-col gap-6 md:gap-10">
        {/* Bộ lọc */}
        <div className="bg-white rounded-lg p-6 flex flex-col gap-6 relative">
          <SearchInput value={searchText} onChange={setSearchText} />
          <div className="flex flex-col gap-6 md:flex-row">
            <RoleFilter selected={roles} onChange={setRoles} />
            <StatusFilter selected={statuses} onChange={setStatuses} />
          </div>
        </div>

        {/* Bảng người dùng */}
        <div className="flex flex-col gap-2">
          <div className="bg-white p-6 rounded-lg h-full w-full overflow-auto flex flex-col gap-6">
            <UserHeader onRefresh={handleRefreshClick} onAdd={handleAddUserClick} />
            <div className="h-fit w-full overflow-auto">
              <UserTable data={data} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserListView;
