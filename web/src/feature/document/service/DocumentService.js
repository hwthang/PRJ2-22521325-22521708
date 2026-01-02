import { base_url } from "../../../utils/api";

class DocumentService {
  createComment = async (postId, data) => {
    const accountId = JSON.parse(await localStorage.getItem("my_account"))?._id;

    const res = await fetch(`${base_url}/api/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accountId,
        postId,
        comment: data.comment,
      }),
    });

    const json = await res.json();
    return json.data;
  };
}

export default new DocumentService();
