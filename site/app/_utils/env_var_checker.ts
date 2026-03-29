import { private_env_vars } from "./private_env_vars";
import { public_env_vars } from "./public_env_vars";

const total_env = {
  ...private_env_vars,
  ...public_env_vars
} as const;

type env_key = keyof typeof total_env;

for (const key of Object.keys(total_env)) {
  const mKey: env_key = key as unknown as env_key;
  const val = total_env[mKey];
  if (val == undefined) {

    // check env flags for optional vars
    if (mKey == 'CLERK_SECRET_KEY' || mKey == 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY') {
      if (!total_env.NEXT_PUBLIC_ENABLE_AUTH) continue;
    } else if (mKey == 'NEXT_PUBLIC_POSTHOG_KEY' || mKey == 'NEXT_PUBLIC_POSTHOG_HOST') {
      if (!total_env.NEXT_PUBLIC_ENABLE_RUM) continue;
    } 
    
    // or check if any values are okay being undefined
    if (mKey == 'NEXT_PUBLIC_CLOUDFLARE_TURNSTILE') continue;
    
    console.error(private_env_vars);
    throw new Error(`${key} should be defined`);
  }
}