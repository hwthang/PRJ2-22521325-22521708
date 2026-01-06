import { API_URL } from "./Api";
import AuthService from "./AuthService";

class MemberService {
  fetchLeaderBoard = async () => {
    const myAccount = await AuthService.getMyAccount()
    const res = await fetch(`${API_URL}/api/members/leaderboard?chapterId=${myAccount.member.chapterId}`);
    const json = await res.json();

    return json
  }

  updateMemberById = async (id: any, data: any) => {
    const myAccount = await AuthService.getMyAccount()
    const res = await fetch(`${API_URL}/api/members/${myAccount.member._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      }
    );
    const json = await res.json();

    return json
  }
}
export default new MemberService()