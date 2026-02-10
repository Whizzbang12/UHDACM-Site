import { NavigationEntryObj } from "./types";
import { SocialObj } from "@shared/types/cms/CMSTypes";

export const NavigationTree: NavigationEntryObj[] = [
  {
    title: "About",
    path: "/about",
  },
  {
    title: "Events",
    path: "/events",
  },
  {
    title: "Media",
    path: "/media",
  },
  {
    title: "Contact",
    path: "/contact-us",
  },
];

export const defaultSocials: SocialObj[] = [
  { type: "github", url: "https://github.com/UHDACM" },
  { type: "linkedin", url: "https://www.linkedin.com/company/uhd-acm/" },
  { type: "youtube", url: "https://www.youtube.com/@uhdacm" },
  { type: "instagram", url: "https://www.instagram.com/uhdacm" },
  { type: "discord", url: "https://discord.com/invite/362vxfy7SE" },
] as const;
