// File: app/setup-admin/actions.ts
"use server";

import { dbClient } from "@root/dal/client";
import bcrypt from "bcryptjs";
import z from "zod";

// File: app/setup-admin/actions.ts

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
    // 1. Check if the user already exists to prevent duplicates
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

    // 2. Hash the password securely
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 3. Insert the new user into the database
    // version starts at 1, isForbidden is false (0)
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
