import React from "react";
import apiClient from "../../../utils/api";

const useMemberUpdate = () => {
  const updateMember = async (id, data) => {
    const response = await apiClient.put(`/api/members/${id}`, data);
    return response;
  };

  return { updateMember };
};

export default useMemberUpdate;
