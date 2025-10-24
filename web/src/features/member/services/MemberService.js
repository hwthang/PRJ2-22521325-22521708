import apiClient from "../../../utils/api";

class MemberService {
  // Định nghĩa các phương thức dịch vụ ở đây
  update = async (id, memberData) => {
    try {
      const response = await apiClient.put(`/api/members/${id}`, memberData);
      const result = response.data;
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      return "Lỗi khi cập nhật thành viên";
    }
  };
}
export default new MemberService();