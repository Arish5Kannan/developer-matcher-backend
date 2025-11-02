import { Router } from "express";
import * as chatController from "../controllers/chat.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js"; 

const router = Router();

router.post("/create", authMiddleware, chatController.createOrGetChat);
router.post("/send", authMiddleware, chatController.sendMessage);
router.get("/", authMiddleware, chatController.getChats);
router.get("/:chatId", authMiddleware, chatController.getChatMessages);

export default router;
