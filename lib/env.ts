import { z } from "zod";

const zodEnv = z.object({
  BASE_URL: z.url(),

  DB_HOST: z.string(),
  DB_PORT: z.string().transform(Number),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),

  ACCESS_TOKEN_SECRET: z.string().length(64),
  REFRESH_TOKEN_SECRET: z.string().length(64),

  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

export const envObj = zodEnv.parse(process.env);
const env = Object.freeze(envObj);

export default env;
