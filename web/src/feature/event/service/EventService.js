import { base_url } from "../../../utils/api";

class EventService {
  fetchAllEvent = async () => {
    const res = await fetch(`${base_url}/api/events`);
    const json = await res.json();
    console.log(json);
    return json;
  };

  fetchAllEventForMember = async () => {
    const memberId = JSON.parse(await localStorage.getItem("my_account"))
      ?.member?._id;

    const data = await this.fetchAllEvent();
    const events = data.data.events;

    const res = await fetch(`${base_url}/api/attendances/members/${memberId}`);
    const json = await res.json();
    const isRegistered = json.data.attendances;

    const isLiked = await this.getLikedEvents();

    return events.map((item) => ({
      ...item,
      hadRegistered: isRegistered.includes(item?._id),
      isLiked: isLiked.includes(item?.postId?._id),
    }));
  };

  /* =========================
      EVENT REGISTER
  ========================= */
  registerEvent = async (id) => {
    const memberId = JSON.parse(await localStorage.getItem("my_account"))
      ?.member?._id;

    const res = await fetch(`${base_url}/api/attendances`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId: id, memberId }),
    });

    return await res.json();
  };

  /* =========================
      LIKE / UNLIKE EVENT
  ========================= */
  likeEvent = async (postId) => {
    const accountId = JSON.parse(await localStorage.getItem("my_account"))?._id;

    const res = await fetch(`${base_url}/api/likes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, accountId }),
    });

    return await res.json();
  };

  unlikeEvent = async (postId) => {
    const accountId = JSON.parse(await localStorage.getItem("my_account"))?._id;

    const res = await fetch(`${base_url}/api/likes`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, accountId }),
    });

    return await res.json();
  };

  getLikedEvents = async () => {
    const accountId = JSON.parse(await localStorage.getItem("my_account"))?._id;
    const res = await fetch(`${base_url}/api/likes/${accountId}`);
    const json = await res.json();
    return json.data.likes;
  };

  /* =========================
      COMMENT APIs
  ========================= */

  createComment = async (postId, data) => {
    const accountId = JSON.parse(await localStorage.getItem("my_account"))?._id;

    const res = await fetch(`${base_url}/api/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accountId,
        postId,
        comment: data.comment,
        image: data.image,
      }),
    });

    const json = await res.json();
    return json.data;
  };

  getCommentByPostId = async (postId) => {
    const res = await fetch(`${base_url}/api/comments?postId=${postId}`);
    return await res.json();
  };

  /* =========================
      ➕ NEW: UPDATE COMMENT
  ========================= */
  updateComment = async (commentId, data) => {
    const res = await fetch(`${base_url}/api/comments/${commentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        comment: data.comment,
        image: data.image,
      }),
    });

    return await res.json();
  };

  /* =========================
      ➕ NEW: DELETE COMMENT
  ========================= */
  deleteComment = async (commentId) => {
    const res = await fetch(`${base_url}/api/comments/${commentId}`, {
      method: "DELETE",
    });

    return await res.json();
  };

  /* =========================
      ➕ NEW: REPORT COMMENT
  ========================= */
  reportComment = async (commentId) => {
    const res = await fetch(`${base_url}/api/comments/${commentId}`, {
      method: "PATCH",
    });

    return await res.json();
  };

  /* =========================
      ATTENDANCE APIs
  ========================= */

  /**
   * [POST] /api/attendances
   * → Đăng ký tham gia sự kiện
   *
   * Request body:
   * {
   *   eventId: string,
   *   memberId: string
   * }
   *
   * Response:
   * {
   *   success: true,
   *   message: "Đăng ký tham gia sự kiện thành công",
   *   data: {
   *     attendance: {
   *       _id,
   *       eventId,
   *       memberId,
   *       status,
   *       createdAt
   *     }
   *   }
   * }
   */
  registerEvent = async (eventId) => {
    const memberId = JSON.parse(localStorage.getItem("my_account"))
      ?.member?._id;

    const res = await fetch(`${base_url}/api/attendances`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId,
        memberId,
      }),
    });

    return await res.json();
  };

  /**
   * [PATCH] /api/attendances/check-in
   * → Điểm danh (check-in) sự kiện
   *
   * Request body:
   * {
   *   eventId: string,
   *   memberId: string
   * }
   *
   * Response:
   * {
   *   success: true,
   *   message: "Điểm danh đăng ký tham gia sự kiện thành công",
   *   data: {
   *     attendance: {
   *       status: "attended"
   *     }
   *   }
   * }
   */
  checkInEvent = async (eventId) => {
    const memberId = JSON.parse(localStorage.getItem("my_account"))
      ?.member?._id;

    const res = await fetch(`${base_url}/api/attendances/check-in`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId,
        memberId,
      }),
    });

    return await res.json();
  };

  /**
   * [GET] /api/attendances/members/:memberId
   * → Lấy danh sách EVENT ID mà member đã đăng ký
   *
   * Response:
   * {
   *   success: true,
   *   message: "Lấy danh sách sự kiện đã tham gia",
   *   data: {
   *     attendances: [eventId1, eventId2, ...]
   *   }
   * }
   */
  getAttendanceByMemberId = async () => {
    const memberId = JSON.parse(localStorage.getItem("my_account"))
      ?.member?._id;

    const res = await fetch(
      `${base_url}/api/attendances/members/${memberId}`
    );

    return await res.json();
  };

  /**
   * [GET] /api/attendances/events/:eventId
   * → Lấy danh sách thành viên đăng ký theo EVENT
   *
   * Response:
   * {
   *   success: true,
   *   message: "Lấy danh sách đăng ký theo sự kiện",
   *   data: {
   *     attendances: [
   *       {
   *         _id,
   *         memberId: {
   *           _id,
   *           fullname,
   *           avatar,
   *           email
   *         },
   *         status,
   *         createdAt
   *       }
   *     ]
   *   }
   * }
   */
  getAttendanceByEventId = async (eventId) => {
    const res = await fetch(
      `${base_url}/api/attendances/events/${eventId}`
    );

    return await res.json();
  };
}

export default new EventService();
