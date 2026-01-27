import { fetchCMS } from "@/app/_utils/cms";
import { isValidQnA, isValidSiteEvent } from "@shared/types/cms/CMSCheck";
import { ReactNode, Suspense } from "react";

import styles from "./SearchSection.module.css";
import { SearchSectionType } from "@shared/types/cms/CMSTypes";
import { EntrySortMode, ListingMode, QnA, SiteEvent } from "@shared/types/cms/CMSTypes";
import { EventSearchTool, GallerySearchTool, QnASearchTool } from "./SearchSectionSearchTools";
export default async function SearchSection({
  header,
  type,
  listingMode,
  defaultSortingMode,
  sectionID,
}: {
  header?: string;
  type: SearchSectionType;
  listingMode: ListingMode;
  defaultSortingMode: EntrySortMode;
  sectionID?: string;
}) {

  const CurrentSearchSectionSearchToolProps = {
    listingMode,
    defaultSortingMode,
  };

  let Comp: ReactNode = undefined;

  if (type == "events") {
    Comp = <EventsSearchTool {...CurrentSearchSectionSearchToolProps} />;
  } else if (type == "galleries") {
    Comp = <GalleriesSearchTool {...CurrentSearchSectionSearchToolProps} />;
  } else if (type == "qnas") {
    Comp = <QnAsSearchTool {...CurrentSearchSectionSearchToolProps} />;
  } else {
    return null;
  }

  return (
    <Suspense>
      <div className={"SectionRoot"} id={sectionID}>
        <div className={`SectionInner ${styles.innerStyling}`}>
          {header && (
            <h1 className={`H1 ${styles.searchHeaderTitle}`}>{header}</h1>
          )}
          {Comp}
        </div>
      </div>
    </Suspense>
  );
}

export type SearchSectionSearchToolProps = {
  listingMode: ListingMode;
  defaultSortingMode: EntrySortMode;
};

async function EventsSearchTool(props: SearchSectionSearchToolProps) {
  const res = await fetchCMS("events", { populate: "previewImage" });

  
  const validEvents: SiteEvent[] = [];
  if (res) {
    const eventsRaw = res.data;
    for (const event of eventsRaw) {
      if (isValidSiteEvent(event)) {
        validEvents.push(event);
      }
    }
  }

  return (
    <EventSearchTool
      events={validEvents}
      {...props}
    />
  );
}

async function GalleriesSearchTool(props: SearchSectionSearchToolProps) {
  const res = await fetchCMS("events", {
    "populate[0]": "previewImage",
    "populate[1]": "gallery",
  }, ['galleries']);
  const eventsRaw = res ? res.data : [];
  const validGalleryEvents: SiteEvent[] = [];
  for (const event of eventsRaw) {
    if (isValidSiteEvent(event) && event.gallery) {
      validGalleryEvents.push(event);
    }
  }
  return (
    <GallerySearchTool
      galleryEvents={validGalleryEvents}
      {...props}
    />
  );
}

async function QnAsSearchTool({
  listingMode = "before",
  defaultSortingMode = "descending",
}: SearchSectionSearchToolProps) {
  const res = await fetchCMS("qnas", { populate: "thumbnail" });

  const validQnAs: QnA[] = [];
  if (res) {
    const qnaRaw = res.data;
    for (const QnA of qnaRaw) {
      if (isValidQnA(QnA)) {
        validQnAs.push(QnA);
      }
    }
  }

  return (
    <QnASearchTool
      qnas={validQnAs}
      listingMode={listingMode}
      defaultSortingMode={defaultSortingMode}
    />
  );
}
