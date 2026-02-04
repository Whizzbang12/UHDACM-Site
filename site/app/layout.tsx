import "./figma.css";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ReduxProvider from "./_features/ReduxProvider";
import Body from "./body";
// import { Analytics } from "@vercel/analytics/next";
import { ClerkProvider } from "@clerk/nextjs";
import { Fragment } from "react/jsx-runtime";
import { PostHogProvider } from "./_utils/posthog_provider";
import "./_utils/env_var_checker";
import { public_env_vars } from "./_utils/public_env_vars";
import { PublicEnvProvider } from "./_context/PublicEnvContext/PublicEnvContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UHD ACM",
  description: "Home page of UHD ACM",
  icons: {
    icon: "/favicon_io/favicon-32x32.png",
    shortcut: "/favicon_io/favicon-32x32.png",
    apple: "/favicon_io/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const AuthWrapper = public_env_vars.NEXT_PUBLIC_ENABLE_AUTH
    ? ClerkProvider
    : Fragment;

  return (
    <html lang="en">
      <link rel="manifest" href="favicon_io/site.webmanifest" />
      <PublicEnvProvider env={public_env_vars}>
        <AuthWrapper>
          <PostHogProvider>
            <ReduxProvider>
              {/* <Analytics /> */}
              <Body className={`${inter.variable} antialiased`}>
                {children}
              </Body>
            </ReduxProvider>
          </PostHogProvider>
        </AuthWrapper>
      </PublicEnvProvider>
    </html>
  );
}
