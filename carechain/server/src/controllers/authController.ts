import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import type { UserRole } from "../types/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.literal("demo"),
  role: z.enum(["patient", "doctor", "provider", "admin"]),
});

export function login(request: Request, response: Response): void {
  const parsed = loginSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ error: "Enter a valid email and the demo password." });
    return;
  }

  const payload = { email: parsed.data.email, role: parsed.data.role satisfies UserRole };
  const token = jwt.sign(payload, process.env.JWT_SECRET ?? "carechain-local-demo-secret", {
    expiresIn: "8h",
  });
  response.json({ token, user: payload });
}

export function getSession(_request: Request, response: Response): void {
  response.json({ user: response.locals.user });
}