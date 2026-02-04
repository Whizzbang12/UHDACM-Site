// NOTE: these envs should never be used on the frontend.
// if you need access to th

const pe = process.env;
export const private_env_vars = {
  // self
  NEXT_PUBLIC_SELF_URL: pe.NEXT_PUBLIC_SELF_URL!,

  // strapi
  STRAPI_API_TOKEN: pe.STRAPI_API_TOKEN!,
  CMS_AUTH_TOKEN: pe.CMS_AUTH_TOKEN!,

  // auth
  CLERK_SECRET_KEY: pe.CLERK_SECRET_KEY!,
} as const;

