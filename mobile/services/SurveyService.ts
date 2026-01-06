import { API_URL } from "./Api";
import AuthService from "./AuthService";

class SurveyService {
  fetchAllDoneSurveys = async () => {
    const myAccount = await AuthService.getMyAccount()

    const res = await fetch(`${API_URL}/api/surveys/member/${myAccount.member._id}`);

    const json = await res.json();
    return json
  }

  fetchAllSurveys = async () => {
    const res = await fetch(`${API_URL}/api/surveys`);
    const json = await res.json();
    return json?.data?.surveys
  }

  fetchSurveyForMember = async () => {
    try {
      // 1. Lấy tất cả khảo sát (đã được lọc theo ChapterId trong fetchAllSurveys)
      const allSurveys = await this.fetchAllSurveys();

      // 2. Lấy danh sách khảo sát đã hoàn thành
      const doneResponse = await this.fetchAllDoneSurveys();
      const doneSurveys = doneResponse?.data?.surveys || [];

      // Tạo một Set chứa ID của các khảo sát đã xong để tìm kiếm nhanh O(1)
      const doneIds = new Set(doneSurveys.map((s: { _id: any; }) => s._id));

      // 3. Kết hợp dữ liệu
      const combinedSurveys = allSurveys.map((survey: { _id: unknown; }) => {
        const isDone = doneIds.has(survey._id);

        // Tìm thông tin ngày nộp từ danh sách doneSurveys nếu có
        const doneInfo = isDone
          ? doneSurveys.find((s: { _id: unknown; }) => s._id === survey._id)
          : null;

        return {
          ...survey,
          isDone: isDone,
          // Nếu đã xong thì lấy ngày nộp (createdAt) từ bảng kết quả,
          // nếu chưa thì để null hoặc ngày tạo khảo sát
          submittedAt: doneInfo ? doneInfo.createdAt : null,
        };
      });

      return combinedSurveys;
    } catch (error) {
      console.error("Lỗi khi xử lý dữ liệu khảo sát cho member:", error);
      return [];
    }
  };

  fetchSurveyResultById = async (surveyId: any) => {
    const response = await fetch(`${API_URL}/api/surveys/${surveyId}/results`);
    const json = await response.json();
    const results = json.data.result.results;


    const myAccount = await AuthService.getMyAccount()
    const memberId = myAccount.member._id

    const memberResult = results.find(
      (item: { member: { _id: any; }; }) => item?.member?._id == memberId
    );
    console.log(memberResult);
    return memberResult;
  }

  answerQuestion = async (data: any) => {
    const res = await fetch(`${API_URL}/api/answers`, {
      method: "POST", headers: {
        "Content-Type": "application/json"
      }, body: JSON.stringify(data)
    })

    const json = await res.json()

    console.log(json)
  }
}

export default new SurveyService()