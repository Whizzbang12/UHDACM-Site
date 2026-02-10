import SectionsRenderer from "../_sections/SectionRenderer/SectionsRenderer";
import { fetchCMSPage } from "../_utils/cms";
import { cmsSingleTypePage, SiteSection } from "@shared/types/cms/CMSTypes";
import { isValidSiteSection } from "@shared/types/cms/CMSCheck";
import Page404 from "../not-found";

import styles from './PageRenderer.module.css';

export default async function PageRenderer({ lostMessage, page }: { lostMessage?: string, page: cmsSingleTypePage }) {
  const res = await fetchCMSPage(page);
  if (!res || !res.data) {
    return <Page404 customMessage={lostMessage || "Page not found"} />;
  }
  // console.log('res', res);
  const data = res.data;

  // console.log("Fetched "+page+" data:", JSON.stringify(data, null, 2));

  const sections: SiteSection[] = data.sections;
  for (let section of sections) {
    if (!isValidSiteSection(section)) {
      // console.log("Invalid section found:", JSON.stringify(section, null, 2));
      return (
        <Page404
          customMessage={
            "Some or all of the requested page could not be generated"
          }
        />
      );
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <NavbarPadding />
      <SectionsRenderer sections={sections} />
      <NavbarPadding />
    </div>
  );
}

export function NavbarPadding() {
  return <div className={styles.NavbarPadding} />;
}
