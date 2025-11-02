import express from "express";
import * as profileController from "../controllers/profile.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js"; 

const router = express.Router();

// Protected routes
router.post("/", authMiddleware, profileController.createOrUpdateProfile);
router.get("/me", authMiddleware, profileController.getMyProfile);
router.get("/matches/knn", authMiddleware, profileController.getMatchesKNN);
router.delete("/", authMiddleware, profileController.deleteMyProfile);
router.get("/matches", authMiddleware, profileController.getMatches);

// Public route
router.get("/", profileController.getAllProfiles);

export default router;
