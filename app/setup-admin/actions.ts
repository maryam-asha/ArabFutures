"use server";

import { dbClient } from "@root/dal/client";
import bcrypt from "bcryptjs";
import z from "zod";

interface ActionResult {
  success: boolean;
  message: string;
}

/**
 * A server action to create the initial admin user.
 * This should only be used once and the page that calls it should be removed for security.
 */
export async function createAdminUserAction(): Promise<ActionResult> {
  const username = "admin";
  const password = "admin123";

  try {
    const existingUser = await dbClient.selectSingleOrDefault(
      "SELECT userId FROM users WHERE username = ?",
      [username],
      z.object({
        userId: z.number(),
      }),
    );

    if (existingUser) {
      return {
        success: false,
        message: `User "${username}" already exists. Setup cannot proceed.`,
      };
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    await dbClient.insert("users", {
      username,
      passwordHash,
      version: 1,
      isForbidden: 0,
    });

    return {
      success: true,
      message: `Successfully created admin user "${username}" with the specified password. You should now delete the setup page.`,
    };
  } catch (error) {
    console.error("Failed to create admin user:", error);
    return {
      success: false,
      message: "An unexpected database error occurred. Check the server logs.",
    };
  }
}
