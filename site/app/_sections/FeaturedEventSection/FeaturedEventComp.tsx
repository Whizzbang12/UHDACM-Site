'use client'

import styles from './FeaturedEventSection.module.css'
import Button from "@/app/_components/Button/Button";
import ShareButton from "@/app/_components/Button/CommonVariants/ShareButton";
import AddToCalendarButton from "@/app/_components/Button/Variants/AddToCalendarButton";
import FeaturedEvent from "@/app/_components/FeaturedEvent/FeaturedEvent";
import { DefaultChevronRight } from "@/app/_icons/Icons";
import { FeaturedEvent as FeaturedSiteEvent } from "@shared/types/cms/CMSTypes";
import { generateEventShareText, TryGetImageFormatUrl } from "@/app/_utils/types/cms/cmsTypeTools";
import { isStrapiPicture, isValidSiteEvent } from "@shared/types/cms/CMSCheck";
import { usePublicEnv } from '@/app/_context/PublicEnvContext/PublicEnvContext';

export default function FeaturedEventComp({
  featuredEvent,
}: {
  featuredEvent: FeaturedSiteEvent;
}) {
  const { event, previewImageHD } = featuredEvent;
  const public_env = usePublicEnv();

  if (!event || !isValidSiteEvent(event)) {
    return undefined;
  }

  const imgUrl = isStrapiPicture(previewImageHD)
    ? `${TryGetImageFormatUrl(previewImageHD, "medium", public_env.NEXT_PUBLIC_CMS_URL)}`
    : undefined;

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

  // return undefined;

  return (
    <div className={styles.featuredEventWrapper}>
      <FeaturedEvent
        title={event.name}
        largeHeavy={subheader}
        smallHeavy={event.location}
        caption={event.descriptionShort}
        BottomComponent={
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            <ShareButton
              copyText={generateEventShareText(event)}
              replaceTextOnCopyString="Copied Invite"
            />
            <AddToCalendarButton
              title={event.name}
              details={event.descriptionShort}
              location={event.location}
              start={event.dateStart}
              end={event.dateEnd}
            />
            <Button
              href={`/events/${event.urlSlug}`}
              // onClick: () => alert("Right button clicked!"),
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <span className="BodyLargeHeavy">View Event</span>
                <DefaultChevronRight
                  fontSize={"inherit"}
                  style={{ marginRight: "-0.3rem" }}
                  strokeWidth={"0.20rem"}
                />
              </div>
            </Button>
          </div>
        }
        img={`${imgUrl}`}
      />
    </div>
  );

}
