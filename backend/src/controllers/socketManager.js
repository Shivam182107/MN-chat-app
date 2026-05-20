const { Server } = require("socket.io");

const connectSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "https://mn-chat-app.vercel.app",
      credentials: true,
    },
  });
  return io;
};
module.exports = connectSocket;
