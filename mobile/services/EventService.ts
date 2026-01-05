import { API_URL } from "./Api";
import AuthService from "./AuthService";

class EventService {
  eventTopics = {
    volunteer: { label: "Tình nguyện", color: "green", icon: "HandHeart" },
    blood_donation: { label: "Hiến máu", color: "red", icon: "Droplet" },
    environment: { label: "Môi trường", color: "emerald", icon: "Leaf" },
    startup: { label: "Khởi nghiệp", color: "blue", icon: "Rocket" },
    training: { label: "Tập huấn", color: "indigo", icon: "School" },
    sports: { label: "Thể thao", color: "orange", icon: "Trophy" },
    youth_union: { label: "Sinh hoạt Đoàn", color: "sky", icon: "UsersRound" },
    charity: { label: "Từ thiện", color: "pink", icon: "Heart" },
    culture: { label: "Văn hoá", color: "violet", icon: "Palette" },
    art: { label: "Nghệ thuật", color: "purple", icon: "Music" },
    technology: { label: "Công nghệ", color: "cyan", icon: "Cpu" },
    education: { label: "Giáo dục", color: "amber", icon: "BookOpen" },
    competition: { label: "Cuộc thi", color: "yellow", icon: "Medal" },
    career: { label: "Nghề nghiệp", color: "teal", icon: "Briefcase" },
    social_security: { label: "An sinh xã hội", color: "rose", icon: "HouseHeart" },
    festival: { label: "Lễ hội", color: "fuchsia", icon: "Sparkles" },
    exchange: { label: "Giao lưu", color: "lime", icon: "Handshake" },
    training_soft: { label: "Kỹ năng mềm", color: "purple", icon: "Lightbulb" },
    propaganda: { label: "Tuyên truyền", color: "red", icon: "Megaphone" },
    community: { label: "Cộng đồng", color: "green", icon: "Globe" },
  };
  fetchAllEvents = async () => {
    const res = await fetch(`${API_URL}/api/events`);
    const json = await res.json();
    return json
  }

  fetchAllEventForMember = async () => {
    const myAccount = await AuthService.getMyAccount()


    const data = await this.fetchAllEvents();

    const events = data.data.events;

    const res = await fetch(`${API_URL}/api/attendances/members/${myAccount.member._id}`);
    const json = await res.json();
    const isRegistered = json.data.attendances;

    // const isLiked = await this.getLikedEvents();

    return events.map((item: { _id: any; }) => ({
      ...item,
      hadRegistered: isRegistered.includes(item?._id),
      // isLiked: isLiked.includes(item?.postId?._id),
    }));
  }

  getComments = async (postId: any) => {
    const res = await fetch(`${API_URL}/api/comments?postId=${postId}`);
    return await res.json();
  }

  checkIn = async (eventId: any) => {
    const myAccount = await AuthService.getMyAccount()
    const memberId = myAccount.member._id
    const res = await fetch(`${API_URL}/api/attendances/check-in`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId,
        memberId,
      }),
    });
    return await res.json()
  }
}

export default new EventService()