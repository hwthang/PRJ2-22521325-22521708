import { API_URL } from "./Api";
import AuthService from "./AuthService";

class MemberService {
  fetchLeaderBoard = async () => {
    const myAccount = await AuthService.getMyAccount()
    const res = await fetch(`${API_URL}/api/members/leaderboard?chapterId=${myAccount.member.chapterId}`);
    const json = await res.json();

    return json
  }
}
export default new MemberService()