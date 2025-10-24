import { AppUserIdentity, authDx } from "@root/dal/auth-dx";
import { createAuth } from "@waelhabbaldev/next-jwt-auth";

import env from "./env";

export const auth = createAuth<AppUserIdentity>({
  dal: authDx,
  baseUrl: env.BASE_URL,
  secrets: {
    accessTokenSecret: env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: env.REFRESH_TOKEN_SECRET,
  },

  cookies: {
    access: {
      name: "__at",
      maxAge: 60 * 15,
    },
    refresh: {
      name: "__rt",
      maxAge: 60 * 60 * 24 * 30,
    },
  },

  redirects: {
    unauthenticated: "/signin",
    unauthorized: "/dashboard?error=unauthorized",
    forbidden: "/signin?error=forbidden",
  },

  refreshTokenRotationIntervalSeconds: 7 * 24 * 60 * 60,
  csrfEnabled: true,

  jwt: {
    issuer: "homam-jewelry",
    alg: "HS256",
  },

  debug: process.env.NODE_ENV === "development",
});
