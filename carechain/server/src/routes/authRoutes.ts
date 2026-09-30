import { Router } from "express";
import { getSession, login } from "../controllers/authController";
import { requireAuth } from "../middleware/requireAuth";

export const authRoutes = Router();
authRoutes.post("/login", login);
authRoutes.get("/session", requireAuth, getSession);