"use client";
import Button from "@/app/_components/Button/Button";
// handles date, strictly on client side.

import styles from "./event.module.css";

import ShareButton from "@/app/_components/Button/CommonVariants/ShareButton";
import AddToCalendarButton from "@/app/_components/Button/Variants/AddToCalendarButton";
import StrapiRichTextRenderer from "@/app/_components/StrapiRichTextRenderer/StrapiRichTextRenderer";
import {
  DefaultClock,
  DefaultLocation,
  DefaultPeople,
} from "@/app/_icons/Icons";
import { NavbarPadding } from "@/app/_pageRenderer/PageRenderer";
import CallToActionSection from "@/app/_sections/CallToActionSection/CallToActionSection";
import MainHeroSection from "@/app/_sections/MainHeroSection/MainHeroSection";
import HeroSingleImage from "@/app/_sections/SplitHeroSection/HeroSingleImage/HeroSingleImage";
import { SiteEvent } from "@shared/types/cms/CMSTypes";
import { generateEventShareText } from "@/app/_utils/types/cms/cmsTypeTools";
import { isStrapiPicture } from "@shared/types/cms/CMSCheck";
import { getDefaultIconForCMSButton } from "@/app/_utils/types/cms/cmsTypeToolsTsx";

function ShareEventButton({ event }: { event: SiteEvent }) {
  return (
    <ShareButton
      copyText={generateEventShareText(event)}
      replaceTextOnCopyString={"Copied Invite"}
    />
  );
}

function CalendarButton({ event }: { event: SiteEvent }) {
  return (
    <AddToCalendarButton
      title={event.name}
      details={event.descriptionShort}
      location={event.location}
      start={event.dateStart}
      end={event.dateEnd}
    />
  );
}

export default function EventPageClientComponent({
  event,
}: {
  event: SiteEvent;
}) {
  const dateStart = new Date(event.dateStart);
  const dateEnd = new Date(event.dateEnd);

  // Format date as "MMM D, YYYY"
  const formatDate = (date: Date) =>
    date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // Format time as "h:mm AM/PM"
  const formatTime = (date: Date) =>
    date.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  const sameDay =
    dateStart.getFullYear() === dateEnd.getFullYear() &&
    dateStart.getMonth() === dateEnd.getMonth() &&
    dateStart.getDate() === dateEnd.getDate();

  const sameTime =
    dateStart.getHours() === dateEnd.getHours() &&
    dateStart.getMinutes() === dateEnd.getMinutes();

  let subheader = "";
  if (!sameDay) {
    subheader = `${formatDate(dateStart)} - ${formatDate(dateEnd)}`;
  } else if (!sameTime) {
    subheader = `${formatDate(dateStart)}, ${formatTime(
      dateStart
    )} - ${formatTime(dateEnd)}`;
  } else {
    subheader = `${formatDate(dateStart)}, ${formatTime(dateStart)}`;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <NavbarPadding />
      <MainHeroSection
        spanText="EVENT"
        title={event.name}
        leftStyle={{ flex: 1 }}
        rightStyle={{ flex: 1 }}
        rightContent={
          isStrapiPicture(event.previewImage) ? (
            <HeroSingleImage image={event.previewImage} />
          ) : undefined
        }
        bottomContent={
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <CalendarButton event={event} />
            <ShareEventButton event={event} />
          </div>
        }
      />
      <div
        style={{
          display: "flex",
          width: "95vw",
          maxWidth: "var(--page-max-width)",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "start",
          gap: "1rem",
          margin: "2rem 0rem",
          boxSizing: "border-box",
        }}
      >
        <EventDetails
          icon="clock"
          header="When"
          body={`${subheader}`}
          bodyColor="rgb(var(--color-font-primary))"
        />
        <EventDetails
          icon="location"
          header="Where"
          body={event.location || "Location not specified"}
          bodyColor="rgb(var(--color-font-secondary))"
        />
        <EventDetails
          icon="people"
          header="Host"
          body={
            event.organizations?.map((org) => org.name).join(", ") ||
            "No host specified"
          }
          bodyColor="rgb(var(--color-font-accent))"
        />
      </div>
      <div className="SectionRoot">
        <div className="SectionInner">
          <div className={styles.eventDescription}>
            <h1 className="H1">Event Description</h1>
            <div style={{ display: "flex", flexDirection: "column", maxWidth: '100%' }}>
              {event.descriptionFull && (
                <StrapiRichTextRenderer content={event.descriptionFull} />
              )}
            </div>
          </div>
        </div>
      </div>
      <CallToActionSection
        title={`Show up, Schedule, Share`}
        subtitle="Your next step is your best step. Be sure to make it count!"
        actionComponent={
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <CalendarButton event={event} />
            <ShareEventButton event={event} />
            <Button
              style={{
                display: "flex",
                gap: "0.5rem",
                justifyContent: "center",
              }}
              href="/events#search"
            >
              Other Events {getDefaultIconForCMSButton("chevron-right")}
            </Button>
          </div>
        }
      />
    </div>
  );
}

type EventDetailsProps = {
  icon: "clock" | "location" | "people";
  header: string;
  body: string;
  bodyColor?: string;
};

function EventDetails({ icon, header, body, bodyColor }: EventDetailsProps) {
  let IconComponent;
  let strokeWidth;
  switch (icon) {
    case "clock":
      IconComponent = DefaultClock;
      strokeWidth = "0.1rem";
      break;
    case "location":
      IconComponent = DefaultLocation;
      strokeWidth = "0.04rem";
      break;
    case "people":
      IconComponent = DefaultPeople;
      strokeWidth = "0.1rem";
      break;
    default:
      IconComponent = DefaultClock;
      strokeWidth = "0.15rem";
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        alignItems: "center",
        width: "12rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
        }}
      >
        <IconComponent
          size={"2rem"}
          color={"rgb(var(--color-font-default))"}
          strokeWidth={strokeWidth}
        />
        <h2 className="H2">{header}</h2>
      </div>
      <span
        className="BodyRegular"
        style={{
          textAlign: "center",
          whiteSpace: "pre-line",
          ...(bodyColor ? { color: bodyColor } : {}),
        }}
      >
        {body}
      </span>
    </div>
  );
}
