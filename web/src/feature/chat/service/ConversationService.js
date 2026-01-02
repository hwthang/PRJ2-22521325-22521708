class ConversationService {
  constructor(baseUrl = "http://localhost:5000/api/conversations") {
    this.baseUrl = baseUrl;
  }

  /* =====================================================
     1. TẠO CUỘC TRÒ CHUYỆN
     -----------------------------------------------------
     REQUEST:
       POST /api/conversations
       body:
       {
         "name": "Nhóm ABC",
         "members": ["accountId1", "accountId2"]
       }

     RESPONSE:
     {
       "success": true,
       "conversation": {
         "_id": "64f...",
         "name": "Nhóm ABC",
         "members": ["accountId1", "accountId2"],
         "lastMessage": null,
         "createdAt": "...",
         "updatedAt": "..."
       }
     }
  ===================================================== */
  async createConversation({ name, members }) {
    const res = await fetch(`${this.baseUrl}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, members }),
    });

    return res.json();
  }

  /* =====================================================
     2. LẤY DANH SÁCH CUỘC TRÒ CHUYỆN CỦA USER
     -----------------------------------------------------
     REQUEST:
       GET /api/conversations/my?accountId=xxx

     RESPONSE:
     {
       "success": true,
       "conversations": [
         {
           "_id": "64f...",
           "name": "Nhóm ABC",
           "members": [
             {
               "_id": "a1",
               "fullname": "Nguyễn Văn A",
               "avatar": "avatar.png"
             }
           ],
           "lastMessage": {
             "_id": "m1",
             "message": "Hello",
             "senderId": {
               "_id": "a1",
               "fullname": "Nguyễn Văn A",
               "avatar": "avatar.png"
             },
             "createdAt": "..."
           },
           "updatedAt": "..."
         }
       ]
     }
  ===================================================== */
  async getMyConversations(accountId) {
    const res = await fetch(
      `${this.baseUrl}/my?accountId=${accountId}`
    );

    const data = await res.json();
    return data.conversations;
  }

  /* =====================================================
     3. ĐỔI TÊN CUỘC TRÒ CHUYỆN
     -----------------------------------------------------
     REQUEST:
       PUT /api/conversations/:conversationId/rename
       body:
       {
         "name": "Tên mới"
       }

     RESPONSE:
     {
       "success": true,
       "conversation": {
         "_id": "...",
         "name": "Tên mới",
         "members": [...],
         "updatedAt": "..."
       }
     }
  ===================================================== */
  async renameConversation(conversationId, name) {
    const res = await fetch(
      `${this.baseUrl}/${conversationId}/rename`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      }
    );

    return res.json();
  }

  /* =====================================================
     4. LẤY DANH SÁCH THÀNH VIÊN
     -----------------------------------------------------
     REQUEST:
       GET /api/conversations/:conversationId/members

     RESPONSE:
     {
       "success": true,
       "members": [
         {
           "_id": "a1",
           "fullname": "Nguyễn Văn A",
           "email": "a@gmail.com",
           "avatar": "avatar.png"
         }
       ]
     }
  ===================================================== */
  async getMembers(conversationId) {
    const res = await fetch(
      `${this.baseUrl}/${conversationId}/members`
    );

    return res.json();
  }

  /* =====================================================
     5. THÊM THÀNH VIÊN
     -----------------------------------------------------
     REQUEST:
       POST /api/conversations/:conversationId/members
       body:
       {
         "accountId": "a2"
       }

     RESPONSE:
     {
       "success": true,
       "conversation": {
         "_id": "...",
         "members": ["a1", "a2"]
       }
     }
  ===================================================== */
  async addMember(conversationId, accountId) {
    const res = await fetch(
      `${this.baseUrl}/${conversationId}/members`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId }),
      }
    );

    return res.json();
  }

  /* =====================================================
     6. XÓA THÀNH VIÊN
     -----------------------------------------------------
     REQUEST:
       DELETE /api/conversations/:conversationId/members/:accountId

     RESPONSE:
     {
       "success": true,
       "conversation": {
         "_id": "...",
         "members": ["a1"]
       }
     }
  ===================================================== */
  async removeMember(conversationId, accountId) {
    const res = await fetch(
      `${this.baseUrl}/${conversationId}/members/${accountId}`,
      { method: "DELETE" }
    );

    return res.json();
  }

  /* =====================================================
     7. GỬI TIN NHẮN
     -----------------------------------------------------
     REQUEST:
       POST /api/conversations/:conversationId/messages
       body:
       {
         "senderId": "a1",
         "message": "Hello",
         "media": null
       }

     RESPONSE:
     {
       "success": true,
       "message": {
         "_id": "m1",
         "conversationId": "...",
         "senderId": "a1",
         "message": "Hello",
         "media": null,
         "seenBy": ["a1"],
         "createdAt": "..."
       }
     }
  ===================================================== */
  async sendMessage(conversationId, { senderId, message, media = null }) {
    const res = await fetch(
      `${this.baseUrl}/${conversationId}/messages`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId, message, media }),
      }
    );

    return res.json();
  }

  /* =====================================================
     8. LẤY DANH SÁCH TIN NHẮN
     -----------------------------------------------------
     REQUEST:
       GET /api/conversations/:conversationId/messages
       ?limit=20&page=1

     RESPONSE:
     {
       "success": true,
       "messages": [
         {
           "_id": "m1",
           "message": "Hello",
           "senderId": {
             "_id": "a1",
             "fullname": "Nguyễn Văn A",
             "avatar": "avatar.png"
           },
           "seenBy": ["a1"],
           "createdAt": "..."
         }
       ]
     }
  ===================================================== */
  async getMessages(conversationId, { limit = 20, page = 1 } = {}) {
    const res = await fetch(
      `${this.baseUrl}/${conversationId}/messages?limit=${limit}&page=${page}`
    );

    return res.json();
  }

  /* =====================================================
     9. ĐÁNH DẤU ĐÃ XEM TIN NHẮN
     -----------------------------------------------------
     REQUEST:
       PUT /api/conversations/:conversationId/seen
       body:
       {
         "accountId": "a2"
       }

     RESPONSE:
     {
       "success": true
     }
  ===================================================== */
  async seenMessages(conversationId, accountId) {
    const res = await fetch(
      `${this.baseUrl}/${conversationId}/seen`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId }),
      }
    );

    return res.json();
  }

  /* =====================================================
     10. INIT CONVERSATION CHO TẤT CẢ CHAPTER
     -----------------------------------------------------
     REQUEST:
       POST /api/conversations/init-chapters

     RESPONSE:
     {
       "success": true,
       "message": "Tạo conversation cho tất cả chapter thành công"
     }
  ===================================================== */
  async initConversationsForChapters() {
    const res = await fetch(
      `${this.baseUrl}/init-chapters`,
      { method: "POST" }
    );

    return res.json();
  }
}

export default new ConversationService();
