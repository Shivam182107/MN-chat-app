const http = require("http");
const connectSocket = require("./src/controllers/socketManager");
const app = require("./app");
const server = http.createServer(app);

const io = connectSocket(server);

// io.on("connection", (socket) => {

//   // --------Purpose of setup = register the user on socket server-------
//   socket.on("setup", (userData) => {
//     socket.join(userData._id);
//     socket.emit("connected");
//   });
//   // -------Purpose of setup = register the user on socket server-------

//   // -------Purpose of join chat =  create 1 to 1 or group chat room -------
//   socket.on("join chat", (room) => {
//     socket.join(room);
//   });
//   // -------Purpose of join chat =  create 1 to 1 or group chat room -------

//   socket.on("typing", (room) => socket.to(room).emit("typing"));
//   socket.on("stop typing", (room) => socket.to(room).emit("stop typing"));

//   socket.on("send message", (message) => {
//     if (!message.chat.users) return console.log("chat.user is not defined");

//     message.chat.users.forEach((val) => {
//       if (val._id == message.sender._id) return;
//       socket.in(val._id).emit("message recieved", message);
//     });
//   });
// });

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.userId = userData._id;
    socket.emit("connected");
  });
  socket.on("join chat", (room) => socket.join(room));
  socket.on("typing", (room) => socket.to(room).emit("typing"));
  socket.on("stop typing", (room) => socket.to(room).emit("stop typing"));
  socket.on("send message", (message) => {
    if (!message.chat.users) return;
    message.chat.users.forEach((val) => {
      if (val._id == message.sender._id) return;
      socket.in(val._id).emit("message recieved", message);
    });
  });
  socket.on(
    "call-user",
    (receiverId, callerId, offer, withVideo, callerData) => {
      socket
        .to(receiverId)
        .emit("incomming-call", { offer, callerId, withVideo, callerData });
    },
  );
  socket.on("call-cancelled", (receiverId, callerId) => {
    socket.to(receiverId).emit("call-cancelled");
    io.to(receiverId).emit("call-history-update");
  });
  socket.on("answer-call", (receiverId, answer) => {
    socket.to(receiverId).emit("call-answered", { answer });
  });
  socket.on("ice-candidate", (receiverId, candidate) => {
    socket.to(receiverId).emit("ice-candidate", candidate);
  });
  socket.on("end-call", (receiverId) => {
    socket.to(receiverId).emit("call-ended");
    io.to(receiverId).emit("call-history-update");
  });
  socket.on("reject-call", (receiverId) => {
    socket.to(receiverId).emit("call-rejected");
    io.to(receiverId).emit("call-history-update");
  });
  socket.on("remote-mute", (isMute, receiverId) => {
    socket.to(receiverId).emit("remote-user-muted", isMute);
  });


  socket.on("disconnect", () => {
    if (socket.userId) {
      socket.leave(socket.userId);
    }
  });
});
server.listen(3000, () => {
  console.log("app is runnning on this port :", 3000);
});
