import { Fragment } from "react";
import Button from "../_components/Button/Button";
import ShareButton from "../_components/Button/CommonVariants/ShareButton";
import AddToCalendarButton from "../_components/Button/Variants/AddToCalendarButton";
import { EntryTileProps } from "../_components/EntryTile/EntryTile";
import Footer from "../_components/Footer/Footer";
import NavbarSC from "../_components/Navbar/NavbarSC";
import { DefaultChevronRight } from "../_icons/Icons";
import { SiteEvent } from "@shared/types/cms/CMSTypes";
import { generateEventShareText, ProduceDateRangeText, TryGetImageFormatUrl } from "./types/cms/cmsTypeTools";
import { isStrapiPicture } from "@shared/types/cms/CMSCheck";

export function EventToEntry(event: SiteEvent): EntryTileProps {
  const imgUrl = isStrapiPicture(event.previewImage)
    ? `${TryGetImageFormatUrl(event.previewImage, 'medium')}`
    : undefined;

  const subheader = ProduceDateRangeText(event.dateStart, event.dateEnd);

  return {
    date: event.dateStart,
    dateEnd: event.dateEnd,
    CallToAction: (
      <div
        className="BodyLarge"
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          justifyContent: "end",
        }}
      >
        <AddToCalendarButton
          title={event.name}
          details={event.descriptionShort}
          location={event.location}
          start={event.dateStart}
          end={event.dateEnd}
          // menuLeft={true}
        />
        <ShareButton
          copyText={generateEventShareText(event)}
          replaceTextOnCopyString="Copied Invite"
        />
        <Button href={`/events/${event.urlSlug}`}>
          <span style={{ fontWeight: 500 }}>View</span>
          <DefaultChevronRight
            fontSize={"inherit"}
            style={{ marginRight: "-0.25rem" }}
            strokeWidth={"0.20rem"}
          />
        </Button>
      </div>
    ),
    description: event.descriptionShort,
    header: event.name,
    imageSrc: imgUrl,
    imageAlt: event.previewImage?.alternativeText,
    style: undefined,
    subheader: subheader,
    subheaderTwo: event.location,
  };
}

export function WrapInNavbarAndFooter({ children }: { children: React.ReactNode }) {
  return (
    <Fragment key="PageWrapperNavbarFooter">
      <NavbarSC key="Navbar" />
      {children}
      <Footer key="Footer" />
    </Fragment>
  );
}
