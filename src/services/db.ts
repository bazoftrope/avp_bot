import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { config } from "../config.js";
import type { UserRecord } from "../types/index.js";

const dbDir = path.dirname(config.dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(config.dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    telegram_id INTEGER PRIMARY KEY,
    uuid TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    key_url TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    expires_at INTEGER,
    is_active INTEGER DEFAULT 1
  )
`);

export function getUser(telegramId: number): UserRecord | undefined {
  return db
    .prepare(
      `
    SELECT
      telegram_id as telegramId,
      uuid,
      email,
      key_url as keyUrl,
      created_at as createdAt,
      expires_at as expiresAt,
      is_active as isActive
    FROM users WHERE telegram_id = ?
  `,
    )
    .get(telegramId) as UserRecord | undefined;
}

export function getAllUsers(): UserRecord[] {
  return db
    .prepare(
      `
    SELECT
      telegram_id as telegramId,
      uuid,
      email,
      key_url as keyUrl,
      created_at as createdAt,
      expires_at as expiresAt,
      is_active as isActive
    FROM users
  `,
    )
    .all() as UserRecord[];
}

export function createUser(user: UserRecord): void {
  db.prepare(
    `
    INSERT INTO users (telegram_id, uuid, email, key_url, created_at, expires_at, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `,
  ).run(
    user.telegramId,
    user.uuid,
    user.email,
    user.keyUrl,
    user.createdAt,
    user.expiresAt,
    user.isActive,
  );
}

export function deactivateUser(telegramId: number): void {
  db.prepare("UPDATE users SET is_active = 0 WHERE telegram_id = ?").run(
    telegramId,
  );
}
