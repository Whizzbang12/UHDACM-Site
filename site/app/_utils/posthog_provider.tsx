"use client";

import { useEffect } from "react";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { usePublicEnv } from "../_context/PublicEnvContext/PublicEnvContext";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const public_env = usePublicEnv();  

  useEffect(() => {
    console.log("hadihadiwdhid");
    if (!public_env.NEXT_PUBLIC_ENABLE_RUM) return;
    console.log("initializing posthog");
    // posthog.init(private_env_vars. as string, {
    posthog.init(public_env.NEXT_PUBLIC_POSTHOG_KEY as string, {
      api_host: public_env.NEXT_PUBLIC_POSTHOG_HOST,
      // api_host: "jsaojsaocj",
      defaults: "2025-11-30",
      autocapture: false,
      // opt_out_capturing_by_default: false,
    });
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
