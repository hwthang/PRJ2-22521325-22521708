import apiClient, { base_url } from "../../../utils/api";

class SurveyService {
  hello = async () => {
    const res = await apiClient.get("/");
    const data = res.data;
    return data;
  };

  fetchAllSurveys = async () => {
    const response = await fetch(`${base_url}/api/surveys`);
    const json = await response.json();
    let surveys = json.data.surveys;

    const myAccount = localStorage.getItem("my_account");
    const chapterId = JSON.parse(myAccount)?.chapter?._id;
    if (chapterId) {
      surveys = surveys.filter((item) => item?.chapterId?._id == chapterId);
    }

    return surveys;
  };

  fetchSurveyById = async (id) => {
    const response = await fetch(`${base_url}/api/surveys/${id}`);
    const json = await response.json();

    // console.log(json);
    return json;
  };

  fetchAllSurveyResultById = async (id) => {
    const response = await fetch(`${base_url}/api/surveys/${id}/results`);
    const json = await response.json();

    return json;
  };

  fetchMemberResult = async (id) => {
    const data = await this.fetchAllSurveyResultById(id);
    const results = data.data.result.results;

    const memberId = JSON.parse(await localStorage.getItem("my_account"))
      ?.member?._id;
    const memberResult = results.filter(
      (item) => item?.member?._id == memberId
    );
    console.log(memberResult);
    return memberResult[0];
  };
  fetchMemberDone = async () => {
    const memberId = JSON.parse(await localStorage.getItem("my_account"))
      ?.member?._id;
    const res = await fetch(`${base_url}/api/surveys/member/${memberId}`);

    const json = await res.json();
    console.log(json);
    return json;
  };

 fetchSurveyForMember = async () => {
    try {
      // 1. Lấy tất cả khảo sát (đã được lọc theo ChapterId trong fetchAllSurveys)
      const allSurveys = await this.fetchAllSurveys();

      // 2. Lấy danh sách khảo sát đã hoàn thành
      const doneResponse = await this.fetchMemberDone();
      const doneSurveys = doneResponse?.data?.surveys || [];

      // Tạo một Set chứa ID của các khảo sát đã xong để tìm kiếm nhanh O(1)
      const doneIds = new Set(doneSurveys.map((s) => s._id));

      // 3. Kết hợp dữ liệu
      const combinedSurveys = allSurveys.map((survey) => {
        const isDone = doneIds.has(survey._id);
        
        // Tìm thông tin ngày nộp từ danh sách doneSurveys nếu có
        const doneInfo = isDone 
          ? doneSurveys.find(s => s._id === survey._id) 
          : null;

        return {
          ...survey,
          isDone: isDone,
          // Nếu đã xong thì lấy ngày nộp (createdAt) từ bảng kết quả, 
          // nếu chưa thì để null hoặc ngày tạo khảo sát
          submittedAt: doneInfo ? doneInfo.createdAt : null 
        };
      });

      return combinedSurveys;
    } catch (error) {
      console.error("Lỗi khi xử lý dữ liệu khảo sát cho member:", error);
      return [];
    }
  };
}

export default new SurveyService();
