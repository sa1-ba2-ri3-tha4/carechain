export type UserRole = "patient" | "doctor" | "provider" | "admin";

export interface DemoTokenPayload {
  email: string;
  role: UserRole;
}