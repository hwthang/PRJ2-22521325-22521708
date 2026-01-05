import { API_URL } from "./Api";
import AuthService from "./AuthService";

class EvaluationService {
  fetchAllEvaluations = async () => {
    const myAccount = await AuthService.getMyAccount()
    const res = await fetch(`${API_URL}/api/evaluations/?memberId=${myAccount.member._id}`);
    const json = await res.json();
    return json
  }
}

export default new EvaluationService()