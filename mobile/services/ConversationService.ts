// --- INTERFACES ---

import { API_URL } from "./Api";

export interface UserBasicInfo {
  _id: string;
  fullname: string;
  avatar?: string;
  email?: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  senderId: string | UserBasicInfo;
  message: string;
  media?: string | null;
  seenBy: string[];
  createdAt: string;
}

export interface Conversation {
  _id: string;
  name: string;
  members: string[] | UserBasicInfo[];
  lastMessage?: Message | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  [key: string]: any; 
}

// --- SERVICE CLASS ---

class ConversationService {
  private baseUrl: string;

  constructor(baseUrl = `${API_URL}/api/conversations`) {
    this.baseUrl = baseUrl;
  }

  // Hàm helper để tối ưu việc gọi fetch và xử lý lỗi
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Đã có lỗi xảy ra");
    }
    return data;
  }

  /** 1. Tạo cuộc trò chuyện */
  async createConversation(payload: { name: string; members: string[] }): Promise<ApiResponse> {
    return this.request("/", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  /** 2. Lấy danh sách cuộc trò chuyện của user */
  async getMyConversations(accountId: string): Promise<Conversation[]> {
    const data = await this.request<ApiResponse>(`/my?accountId=${accountId}`, {
      method: "GET",
    });
    return data.conversations;
  }

  /** 3. Đổi tên cuộc trò chuyện */
  async renameConversation(conversationId: string, name: string): Promise<ApiResponse> {
    return this.request(`/${conversationId}/rename`, {
      method: "PUT",
      body: JSON.stringify({ name }),
    });
  }

  /** 4. Lấy danh sách thành viên */
  async getMembers(conversationId: string): Promise<ApiResponse> {
    return this.request(`/${conversationId}/members`, {
      method: "GET",
    });
  }

  /** 5. Thêm thành viên */
  async addMember(conversationId: string, accountId: string): Promise<ApiResponse> {
    return this.request(`/${conversationId}/members`, {
      method: "POST",
      body: JSON.stringify({ accountId }),
    });
  }

  /** 6. Xóa thành viên */
  async removeMember(conversationId: string, accountId: string): Promise<ApiResponse> {
    return this.request(`/${conversationId}/members/${accountId}`, {
      method: "DELETE",
    });
  }

  /** 7. Gửi tin nhắn */
  async sendMessage(
    conversationId: string, 
    payload: { senderId: string; message: string; media?: string | null }
  ): Promise<ApiResponse> {
    return this.request(`/${conversationId}/messages`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  /** 8. Lấy danh sách tin nhắn */
  async getMessages(
    conversationId: string, 
    params: { limit?: number; page?: number } = { limit: 1000, page: 1 }
  ): Promise<ApiResponse> {
    const queryString = `limit=${params.limit}&page=${params.page}`;
    return this.request(`/${conversationId}/messages?${queryString}`, {
      method: "GET",
    });
  }

  /** 9. Đánh dấu đã xem tin nhắn */
  async seenMessages(conversationId: string, accountId: string): Promise<ApiResponse> {
    return this.request(`/${conversationId}/seen`, {
      method: "PUT",
      body: JSON.stringify({ accountId }),
    });
  }

  /** 10. Khởi tạo conversation cho tất cả Chapter */
  async initConversationsForChapters(): Promise<ApiResponse> {
    return this.request(`/init-chapters`, {
      method: "POST",
    });
  }
}

export default new ConversationService();