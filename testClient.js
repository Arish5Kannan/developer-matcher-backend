import { io } from "socket.io-client";
import readline from "readline";

// Setup terminal input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let chatId;
let senderId;
let socket;

//Ask for Chat ID and User ID
rl.question("Enter Chat Room ID: ", (chatInput) => {
  chatId = chatInput.trim() || "chat123"; 
  rl.question("Enter Your User ID: ", (userInput) => {
    senderId = userInput.trim() || "user123"; 

    // Connect to server
    socket = io("http://localhost:5000", {
      transports: ["websocket"], 
    });

    // On connect
    socket.on("connect", () => {
      console.log("✅ Connected to server. Socket ID:", socket.id);

      // Join the selected chat room
      socket.emit("joinChat", chatId);
      console.log(`📌 Joined room: ${chatId} as ${senderId}`);

      // Enable input loop for sending messages
      rl.setPrompt("💬 Type message (or 'exit' to quit): ");
      rl.prompt();

      rl.on("line", (text) => {
        if (text.toLowerCase() === "exit") {
          rl.close();
          socket.disconnect();
          return;
        }

        // Send message to server
        socket.emit("sendMessage", {
          chatId,
          senderId,
          text,
        });

        rl.prompt();
      });
    });

    // Listen for incoming messages
    socket.on("newMessage", (msg) => {
      console.log(`\n${msg.sender}: ${msg.text}`);
      rl.prompt();
    });

    // Handle server errors
    socket.on("errorMessage", (err) => {
      console.error("Error:", err.error);
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("Disconnected from server.");
      rl.close();
    });
  });
});
