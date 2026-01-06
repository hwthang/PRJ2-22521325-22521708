import { io, Socket } from "socket.io-client";
import { API_URL } from "@/services/Api"; // Đảm bảo bạn có export API_URL

class SocketManager {
  private socket: Socket | null = null;
  private connected: boolean = false;

  /**
   * Kết nối đến Server Socket
   * @param accountId ID của tài khoản để server định danh
   */
  connect(accountId: string | undefined): void {
    // Nếu đã có socket hoặc không có accountId thì không khởi tạo lại
    if (this.socket || !accountId) return;

    // Thay thế localhost bằng API_URL từ config của bạn
    this.socket = io(API_URL, {
      auth: { accountId },
      transports: ["websocket"], // Ưu tiên websocket để ổn định hơn trên Mobile
      autoConnect: true,
      reconnection: true,      // Tự động kết nối lại nếu mất mạng
      reconnectionAttempts: 5, // Thử lại tối đa 5 lần
    });

    this.setupBasicListeners();
  }

  private setupBasicListeners(): void {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      this.connected = true;
      console.log("✅ [Socket] Connected:", this.socket?.id);
    });

    this.socket.on("disconnect", (reason: any) => {
      this.connected = false;
      console.log("❌ [Socket] Disconnected:", reason);
    });

    this.socket.on("connect_error", (error: { message: any; }) => {
      this.connected = false;
      console.error("⚠️ [Socket] Connection Error:", error.message);
    });
  }

  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Gửi sự kiện lên server
   */
  emit(event: string, data: any): void {
    if (this.socket && this.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn(`⚠️ [Socket] Cannot emit '${event}', socket not connected.`);
    }
  }

  /**
   * Lắng nghe sự kiện từ server
   */
  on(event: string, callback: (data: any) => void): void {
    if (!this.socket) {
      console.warn(`⚠️ [Socket] Trying to listen to '${event}' but socket is null`);
      return;
    }
    this.socket.on(event, callback);
  }

  /**
   * Hủy lắng nghe một sự kiện
   */
  off(event: string): void {
    this.socket?.off(event);
  }

  /**
   * Ngắt kết nối hoàn toàn
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      console.log("🔌 [Socket] Manual disconnected");
    }
  }
}

// Export một instance duy nhất (Singleton)
export default new SocketManager();