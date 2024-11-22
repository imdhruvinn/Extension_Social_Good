const { Server } = require("socket.io");

let io;

function setupWebSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Example: Broadcast a message when a user connects
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });
}

function emitChatbotEvent(data) {
  if (io) {
    io.emit("triggerChatbot", data);
  } else {
    console.error("WebSocket not initialized!");
  }
}

module.exports = { setupWebSocket, emitChatbotEvent };
