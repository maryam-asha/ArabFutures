import { sql } from "@waelhabbaldev/mysql2-dx";
import { UserIdentity, UserIdentityDAL } from "@waelhabbaldev/next-jwt-auth";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { dbClient } from "./client";

export interface AppUserIdentity extends UserIdentity {
  userId: number;
  username: string;
  roles: string[];
}

const UserSchema = z.object({
  userId: z.number(),
  username: z.string(),
  passwordHash: z.string(),
  version: z.number(),
  isForbidden: z.number().transform(Boolean),
});

export const authDx: UserIdentityDAL<AppUserIdentity> = {
  /**
   * Called by the `signIn` function.
   * Fetches a user by their username and verifies their password.
   */
  async fetchIdentityByCredentials(username, password) {
    const user = await dbClient.selectSingleOrDefault("SELECT userId, username, passwordHash, version, isForbidden FROM users WHERE username = ?", [username], UserSchema);
    if (!user) return null;

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) return null;

    return { ...user, roles: ["admin"], identifier: user.userId.toString() };
  },

  /**
   * Called on every request for an authenticated user to refresh their session.
   * Fetches the latest user data to ensure roles, version, and forbidden status are up-to-date.
   */
  async fetchIdentityForSession(identifier) {
    const userId = parseInt(identifier, 10);
    if (isNaN(userId)) return null;

    const user = await dbClient.selectSingleOrDefault("SELECT userId, username, passwordHash, version, isForbidden FROM users WHERE userId = ?", [userId], UserSchema);

    if (!user) return null;

    return { ...user, roles: ["admin"], identifier: user.userId.toString() };
  },

  /**
   * Called by the `signOut` function.
   * Bumps the user's `version` number in the database, which invalidates all
   * previously issued refresh tokens for that user, effectively logging them out everywhere.
   */
  async invalidateAllSessionsForIdentity(identifier) {
    const userId = parseInt(identifier, 10);
    if (isNaN(userId)) return;

    await dbClient.update("users", { version: sql("version + 1") }, { userId });
  },

  /**
   * Checks if a JWT ID (JTI) has been used before to prevent token replay attacks.
   */
  async isTokenJtiUsed(jti) {
    const token = await dbClient.selectSingleOrDefault("SELECT jti FROM revokedTokens WHERE jti = ?", [jti], z.object({ jti: z.string() }));
    return !!token;
  },

  /**
   * Marks a JWT ID (JTI) as used by storing it in the database until its natural expiry.
   */
  async markTokenJtiAsUsed(jti, expirationInSeconds) {
    const expiresAt = new Date(Date.now() + expirationInSeconds * 1000);
    await dbClient.insert("revokedTokens", { jti, expiresAt });
  },
};
