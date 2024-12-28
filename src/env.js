import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string() : z.string().url()
    ),
    // New environment variables
    HOSTED_URL: z.string().url(),
    YOUTUBE_API_KEY: z.string().optional(),
    OPENAI_API_KEY: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    UPLOADTHING_TOKEN: z.string(),
    RESEND_API_KEY: z.string(),
    PAYSTACK_PUBLIC_KEY: z.string(),
    PAYSTACK_SECRET_KEY: z.string(),
    LANGCHAIN_TRACING_V2: z.boolean().default(false),
    LANGCHAIN_ENDPOINT: z.string().url(),
    LANGCHAIN_API_KEY: z.string(),
    LANGCHAIN_PROJECT: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_ENV: z.enum(["development", "test", "production"]),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    HOSTED_URL: process.env.HOSTED_URL,
    YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    PAYSTACK_PUBLIC_KEY: process.env.PAYSTACK_PUBLIC_KEY,
    PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY,
    NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
    LANGCHAIN_TRACING_V2: process.env.LANGCHAIN_TRACING_V2 === 'true',
    LANGCHAIN_ENDPOINT: process.env.LANGCHAIN_ENDPOINT,
    LANGCHAIN_API_KEY: process.env.LANGCHAIN_API_KEY,
    LANGCHAIN_PROJECT: process.env.LANGCHAIN_PROJECT,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
