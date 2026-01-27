import { ReactNode } from "react";
export type NavigationEntryObj = {
  title: ReactNode;
  path: string;
  children?: NavigationEntryObj[];
};
