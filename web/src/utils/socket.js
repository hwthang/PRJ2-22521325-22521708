import { io } from "socket.io-client";

class SocketClient {
  socket = null;
  connected = false;

  connect(accountId) {
    if (this.socket || !accountId) return;

    this.socket = io("http://localhost:5000", {
      auth: { accountId },
      autoConnect: true,
    });

    this.socket.on("connect", () => {
      this.connected = true;
      console.log("✅ Socket connected:", this.socket.id);
    });

    this.socket.on("disconnect", () => {
      this.connected = false;
      console.log("❌ Socket disconnected");
    });
  }

  isConnected() {
    return this.connected;
  }

  emit(event, data) {
    if (!this.connected) {
      console.warn("⚠️ Socket not connected, emit skipped:", event);
      return;
    }
    this.socket.emit(event, data);
  }

  on(event, callback) {
    this.socket?.on(event, callback);
  }

  off(event) {
    this.socket?.off(event);
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
    this.connected = false;
  }
}

export default new SocketClient();
