import { config } from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./src/config/db.js";
import { app } from "./src/app.js";
import * as chatService from "./src/services/chat.service.js"; 

config();

// DB connect
connectDB();

const server = createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: { origin: "*" },
});

// Middleware to attach io to req
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Join a chat room
  socket.on("joinChat", (chatId) => {
  socket.join(chatId);

});


  // Socket-based sendMessage
  socket.on("sendMessage", async ({ chatId, text, senderId }) => {
    try {
      // Save message in DB
      const message = await chatService.sendMessage(chatId, senderId, text);
      
      // Emit to all clients in room
      io.to(chatId).emit("newMessage", message);
     
    } catch (err) {
      console.error("Error sending message via socket:", err.message);
      socket.emit("errorMessage", { error: err.message });
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
