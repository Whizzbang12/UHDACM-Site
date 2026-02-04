const pe = process.env;

/**
 * Note: while this contains public env variables, next struggles to use process.env in client components when imported this way.
 * 
 * To use public_env in client components, call the `usePublicEnv` hook.
 */
export const public_env_vars = {
  // self
  NEXT_PUBLIC_SELF_URL: pe.NEXT_PUBLIC_SELF_URL!,

  // strapi
  NEXT_PUBLIC_CMS_URL: pe.NEXT_PUBLIC_CMS_URL!,

  // auth
  NEXT_PUBLIC_ENABLE_AUTH: pe.NEXT_PUBLIC_ENABLE_AUTH == "true",
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: pe.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,

  NEXT_PUBLIC_ENABLE_RUM: process.env.NEXT_PUBLIC_ENABLE_RUM! == 'true',
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY!,
  NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST!,

  // chatbot
  NEXT_PUBLIC_CHATBOT_ENDPOINT: process.env.NEXT_PUBLIC_CHATBOT_ENDPOINT!
} as const;

export type public_env_vars_type = typeof public_env_vars;
