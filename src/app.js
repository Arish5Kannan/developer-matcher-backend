import express, { json } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import chatRoutes from "./routes/chat.routes.js";

config();

const app = express();

// Middleware
app.use(cors());
app.use(json());

// Routes 
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/chat",chatRoutes);

app.get('/', (req, res) => {
    res.json({ message: "Developer Matcher Backend is running 🚀" });
});

export { app };
