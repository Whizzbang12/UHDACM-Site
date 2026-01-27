// server component. Used to render logo and pass it in

import { fetchCMS } from "@/app/_utils/cms";
import { isValidSiteInfo } from "@shared/types/cms/CMSCheck";
import Navbar from "./Navbar";
import { TryGetImageFormatUrl } from "@/app/_utils/types/cms/cmsTypeTools";

export default async function NavbarSC() {
  let logoURL: string | undefined = undefined;
  const res = await fetchCMS("site-info", { populate: "*" });
  if (res) {
    const data = res.data;
    if (isValidSiteInfo(data)) {
      logoURL = TryGetImageFormatUrl(data.logo, 'small');
    }
  }

  return <Navbar logoURL={logoURL} />;
}
