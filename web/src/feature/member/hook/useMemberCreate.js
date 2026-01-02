import React from "react";
import apiClient from "../../../utils/api";

const useMemberCreate = () => {
  const createNewMember = async (
    data = {
      username: "dongb",
      password: "Cds@",
      email: "dongb.qldv@gmail.com",
      phoneNumber: "0987654322",
      name: "Chi đoàn khu phố Đông B",
      affliated: "Đoàn phường Đông Hòa",
      establishedAt: "1990-01-01",
      address: "19 Trần Quang Khải, phường Đông Hòa, thành phố Hồ Chí Minh",
    }
  ) => {
    const response = await apiClient.post("/api/members", data);
    return response;
  };

  return {createNewMember };
};

export default useMemberCreate;
