"use client";
// search tools need to be generated client side due to date usage.

import Button from "@/app/_components/Button/Button";
import ShareButton from "@/app/_components/Button/CommonVariants/ShareButton";
import EntrySearchTool from "@/app/_components/EntrySearchTool/EntrySearchTool";
import { EntryTileProps } from "@/app/_components/EntryTile/EntryTile";
import { DefaultChevronRight, DefaultOpenInNewTab } from "@/app/_icons/Icons";
import { EventToEntry } from "@/app/_utils/tsxTools";
import { QnA, SiteEvent } from "@shared/types/cms/CMSTypes";
import { SearchSectionSearchToolProps } from "./SearchSection";
import { generateGalleryShareText, generateQnAShareText, TryGetImageFormatUrl } from "@/app/_utils/types/cms/cmsTypeTools";

interface GallerySearchToolProps extends SearchSectionSearchToolProps {
  galleryEvents: SiteEvent[];
}

export function GallerySearchTool({
  galleryEvents,
  listingMode,
  defaultSortingMode,
}: GallerySearchToolProps) {
  const entries: EntryTileProps[] = [];
  for (const galleryEvent of galleryEvents) {
    const entry = EventToEntry(galleryEvent);
    entry.CallToAction = (
      <div className="BodyLarge" style={{ display: "flex", gap: "0.5rem" }}>
        <ShareButton
          copyText={generateGalleryShareText(galleryEvent)}
          replaceTextOnCopyString="Copied Invite"
        />
        <Button href={`/galleries/${galleryEvent.urlSlug}`}>
          <span style={{ fontWeight: 500 }}>View Gallery</span>
          <DefaultChevronRight
            fontSize={"inherit"}
            style={{ marginRight: "-0.25rem" }}
            strokeWidth={"0.20rem"}
          />
        </Button>
      </div>
    );
    entries.push(entry);
  }

  return (
    <EntrySearchTool
      entries={entries}
      entryTypePlural="Galleries"
      entryTypeSingular="Gallery"
      defaultListingMode={listingMode}
      defaultSortingMode={defaultSortingMode}
    />
  );
}

interface EventSearchToolProps extends SearchSectionSearchToolProps {
  events: SiteEvent[];
}

export function EventSearchTool({
  events,
  listingMode,
  defaultSortingMode,
}: EventSearchToolProps) {
  const entries: EntryTileProps[] = [];
  for (const event of events) {
    const entry = EventToEntry(event);
    entries.push(entry);
  }

  return (
    <EntrySearchTool
      entries={entries}
      entryTypePlural="Events"
      entryTypeSingular="Event"
      defaultListingMode={listingMode}
      defaultSortingMode={defaultSortingMode}
    />
  );
}

interface QnASearchToolProps extends SearchSectionSearchToolProps {
  qnas: QnA[];
}
export function QnASearchTool({
  qnas,
  listingMode,
  defaultSortingMode,
}: QnASearchToolProps) {
  const getUploadDateString = (QnA: QnA) => {
    const date = new Date(QnA.uploadDate);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  const entries: EntryTileProps[] = [];
  for (const QnA of qnas) {
    const UploadDateString = getUploadDateString(QnA);
    entries.push({
      date: QnA.uploadDate,
      description: QnA.descriptionShort,
      header: QnA.videoName,
      imageSrc: QnA.thumbnail
        ? `${TryGetImageFormatUrl(QnA.thumbnail, "medium")}`
        : undefined,
      imageAlt: QnA.thumbnail?.alternativeText,
      style: undefined,
      subheader: `Guest: ${QnA.featuredGuests}`,
      subheaderTwo: UploadDateString,
      CallToAction: (
        <div className="BodyLarge" style={{ display: "flex", gap: "0.5rem" }}>
          <ShareButton
            copyText={`${generateQnAShareText(QnA)}`}
            replaceTextOnCopyString="Copied invite"
          />
          <Button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
            href={`${QnA.videoLink}`}
            target="_blank"
          >
            <span style={{ fontWeight: 500 }}>Watch QnA</span>
            <DefaultOpenInNewTab
              fontSize={"inherit"}
              // style={{ marginRight: "-0.25rem" }}
              // strokeWidth={"0.025rem"}
            />
          </Button>
        </div>
      ),
    });
  }

  return (
    <EntrySearchTool
      entries={entries}
      entryTypePlural="QnAs"
      entryTypeSingular="QnA"
      defaultListingMode={listingMode}
      defaultSortingMode={defaultSortingMode}
    />
  );
}
