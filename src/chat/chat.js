import { Server } from "socket.io";

const setupChat = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client Connected", socket.id);

    socket.on("message", (body) => {
      socket.broadcast.emit("message", {
        body,
        from: socket.id.slice(6),
      });
    });
  });
};

export default setupChat;
