import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initializeSocket = (userId: string, token: string, API_BASE: string): Socket => {
  if (socket?.connected) {
    return socket;
  }

  socket = io(API_BASE, {
    withCredentials: true,
    auth: {
      userId,
      token,
    },
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket?.id);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const joinVideoRoom = (videoId: string) => {
  if (socket?.connected) {
    socket.emit("joinVideoRoom", videoId);
    console.log("Joined video room:", videoId);
  }
};

export const leaveVideoRoom = (videoId: string) => {
  if (socket?.connected) {
    socket.emit("leaveVideoRoom", videoId);
    console.log("Left video room:", videoId);
  }
};

