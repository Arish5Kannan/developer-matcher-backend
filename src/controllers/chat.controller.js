import * as chatService from "../services/chat.service.js";

// Create/Get Chat
export const createOrGetChat = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const chat = await chatService.getOrCreateChat(req.user.id, receiverId);
    res.json({ success: true, chat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Send Message
export const sendMessage = async (req, res) => {
  try {
    const { chatId, text } = req.body;
    const message = await chatService.sendMessage(chatId, req.user.id, text);    

    res.json({ success: true, message });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get User Chats
export const getChats = async (req, res) => {
  try {
    const chats = await chatService.getUserChats(req.user.id);
    res.json({ success: true, chats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Chat Messages
export const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await chatService.getMessages(chatId);
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
