// socket.js
module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Socket connected', socket.id);

    // Get userId from handshake auth (frontend should send it)
    const { userId } = socket.handshake.auth || {};
    if (userId) {
      socket.join(`user-${userId}`);
      console.log(`Socket ${socket.id} joined user room user-${userId}`);
    }

    // Join a room for a specific video
    socket.on('joinVideoRoom', (videoId) => {
      socket.join(`video-${videoId}`);
      console.log(`Socket ${socket.id} joined video room video-${videoId}`);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected', socket.id);
    });
  });
};
