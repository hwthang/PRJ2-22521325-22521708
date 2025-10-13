import apiClient from "../../../utils/api";
import qs from "qs";

class AccountService {
  API_ROUTE = `/api/users`;

  getAccounts = async (search, role, status) => {
    const response = await apiClient.get(`${this.API_ROUTE}/`, {
      params: {
        search: search,
        role: role,
        status: status,
      },
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "repeat" }),
    });
    console.log(response);

    if (response.data) return response.data;
    return null;
  };

  getAccount = async (id) => {
    const response = await apiClient.get(`${this.API_ROUTE}/${id}`);
    console.log(response.data);

    if (response.data.username) return response.data;
    return null;
  };

  activeAccount = async (id) => {
    const response = await apiClient.patch(`${this.API_ROUTE}/active/${id}`);
    console.log(response.data);

    return response.data;
  };

  lockAccount = async (id) => {
    const response = await apiClient.patch(`${this.API_ROUTE}/lock/${id}`);
    console.log(response.data);

    return response.data;
  };

  updateUser = async (id, input) => {
    const response = await apiClient.put(`${this.API_ROUTE}/${id}`, input);
    console.log(response.data);

    return response.data;
  };
}

export default new AccountService();
