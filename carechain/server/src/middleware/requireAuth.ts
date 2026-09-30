import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";

const sessionSchema = z.object({
  email: z.string().email(),
  role: z.enum(["patient", "doctor", "provider", "admin"]),
});

export function requireAuth(request: Request, response: Response, next: NextFunction): void {
  const authorization = request.header("authorization");
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : null;
  if (!token) {
    response.status(401).json({ error: "A demo session is required." });
    return;
  }

  try {
    const claims = sessionSchema.safeParse(
      jwt.verify(token, process.env.JWT_SECRET ?? "carechain-local-demo-secret"),
    );
    if (!claims.success) {
      response.status(401).json({ error: "The demo session is invalid." });
      return;
    }
    response.locals.user = claims.data;
    next();
  } catch {
    response.status(401).json({ error: "The demo session is invalid or expired." });
  }
}