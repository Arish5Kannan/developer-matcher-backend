import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";

// Create chat or get existing one
export const getOrCreateChat = async (user1, user2) => {
  let chat = await Chat.findOne({ members: { $all: [user1, user2] } });
  if (!chat) {
    chat = await Chat.create({ members: [user1, user2] });
  }
  return chat;
};

// Send message
export const sendMessage = async (chatId, sender, text) => {
    
  return await Message.create({ chatId, sender, text });
};

// Get chats for a user
export const getUserChats = async (userId) => {
  return await Chat.find({ members: userId }).populate("members", "username email");
};

// Get messages between users
export const getMessages = async (chatId) => {
  return await Message.find({ chatId }).populate("sender", "username email");
};
