// index.js
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDb = require('./config/db');
const initSocket = require('./sockets'); // your socket index file

const PORT = process.env.PORT || 4000;

connectDb();

// 1. Create HTTP server from your Express app
const httpServer = http.createServer(app);

// 2. Create Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
});

// 3. Make io available in controllers via req.app.get('io')
app.set('io', io);

// 4. Initialize socket handlers
initSocket(io);

// 5. Start server
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
