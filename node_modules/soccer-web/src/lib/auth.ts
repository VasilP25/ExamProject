import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "../db";
import { users } from "../db/schema";
import { loadRootEnv } from "./env";

export const AUTH_COOKIE_NAME = "carapp_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export type AuthUser = {
  id: number;
  email: string;
  name: string;
  userType: string;
};

type AuthTokenPayload = {
  sub?: string;
  userId?: number;
};

function getJwtSecret(): string {
  loadRootEnv();

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return secret;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function createToken(user: AuthUser): string {
  return jwt.sign({ userId: user.id }, getJwtSecret(), {
    subject: String(user.id),
    expiresIn: SESSION_MAX_AGE_SECONDS,
  });
}

export function verifyToken(token: string): AuthTokenPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as AuthTokenPayload;
  } catch {
    return null;
  }
}

export async function findUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()));

  return user ?? null;
}

export async function findUserById(id: number): Promise<AuthUser | null> {
  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      userType: users.userType,
    })
    .from(users)
    .where(eq(users.id, id));

  return user ?? null;
}

export async function registerUser({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthUser> {
  const normalizedEmail = email.toLowerCase();
  const existing = await findUserByEmail(normalizedEmail);
  if (existing) {
    throw new Error("A user with this email already exists.");
  }

  const passwordHash = await hashPassword(password);
  const [user] = await db
    .insert(users)
    .values({ email: normalizedEmail, name, passwordHash, userType: "normal" })
    .returning({
      id: users.id,
      email: users.email,
      name: users.name,
      userType: users.userType,
    });

  if (!user) {
    throw new Error("Unable to create user.");
  }

  return user;
}

export async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<AuthUser> {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    throw new Error("Invalid email or password.");
  }

  const authUser = await findUserById(user.id);
  if (!authUser) {
    throw new Error("Invalid email or password.");
  }

  return authUser;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  const userId = Number(payload?.sub ?? payload?.userId);
  if (!Number.isInteger(userId)) {
    return null;
  }

  return findUserById(userId);
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

export async function requireAuth(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token || !verifyToken(token)) {
    redirect("/login");
  }
}
