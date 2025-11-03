import React, { useEffect } from "react";
import AccountService from "../../features/account/services/AccountService";

const AccessContext = React.createContext();

export const AccessProvider = ({ children, }) => {
  localStorage.getItem("token");
  const [user, setUser] = React.useState(null);

  useEffect(() => {
    // Giả sử fetchUser là hàm lấy thông tin user từ API
    const fetchUser = async () => {
      // const res = await AccountService.getMyAccount();
      setUser({role: "admin" });
    };
    fetchUser();
  }, []);

  if (!user) {
    return <div>Loading...</div>; // Hoặc một spinner/loading component
  }
  return (
    <AccessContext.Provider value={{ user }}>
      {children}
    </AccessContext.Provider>
  );
};

export const useAccess = () => {
  return React.useContext(AccessContext);
}
