const { Server } = require("socket.io");

const connectSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,//"https://mn-chat-app.vercel.app"
      credentials: true,
    },
  });
  return io;
};
module.exports = connectSocket;
