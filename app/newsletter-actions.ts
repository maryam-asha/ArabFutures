"use server";

import { BrevoClient } from "@getbrevo/brevo";
import { createActionParser, createPublicAction } from "@lib/action-handler";
import env from "@lib/env";
import { ActionState } from "@root/types";
import { z } from "zod";

const brevo = new BrevoClient({
  apiKey: env.BREVO_API_KEY,
});

const ipRateLimit = new Map<string, { count: number; expires: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_COUNT = 3;

function checkRateLimit(ip: string = "global") {
  const now = Date.now();
  const limit = ipRateLimit.get(ip) ?? { count: 0, expires: 0 };

  if (now > limit.expires) {
    limit.count = 0;
    limit.expires = now + RATE_LIMIT_WINDOW;
  }

  limit.count++;
  ipRateLimit.set(ip, limit);

  return limit.count > RATE_LIMIT_COUNT;
}

const NewsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});
type NewsletterInput = z.infer<typeof NewsletterSchema>;

const subscribeToActionHandler = async (data: NewsletterInput): Promise<ActionState<NewsletterInput>> => {
  if (checkRateLimit()) {
    return {
      success: false,
      message: "tooManyRequests",
      errors: {} as any,
    };
  }

  try {
    await brevo.contacts.createContact({
      email: data.email,
      listIds: [Number(env.BREVO_LIST_ID)],
      updateEnabled: false,
    });

    return {
      success: true,
      message: "subscribeSuccess",
    };
  } catch (error: any) {
    console.error("Brevo API Error:", error.response?.data || error.message);

    // check for 'duplicate_parameter' or conflict status 400/409
    const errorCode = error.response?.data?.code;
    if (errorCode === "duplicate_parameter") {
      return {
        success: true,
        message: "alreadySubscribed",
      };
    }

    return {
      success: false,
      message: "genericError",
      errors: {} as any,
    };
  }
};

export const subscribeToAction = createPublicAction(NewsletterSchema, subscribeToActionHandler, createActionParser());
