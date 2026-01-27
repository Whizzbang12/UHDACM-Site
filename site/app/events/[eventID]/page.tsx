import Button from "@/app/_components/Button/Button";

import { fetchCMS } from "@/app/_utils/cms";
import { isValidSiteEvent } from "@shared/types/cms/CMSCheck";
import Page404 from "@/app/not-found";
import EventPageClientComponent from "./EventPageClientComponent";
import { WrapInNavbarAndFooter } from "@/app/_utils/tsxTools";

type EventPageParams = Promise<{
  eventID: string;
}>;

export const generateStaticParams = async () => {
  const res = await fetchCMS("events", {});

  const paths: string[] = [];
  if (res && res.data && Array.isArray(res.data)) {
    for (let event of res.data) {
      if (event.urlSlug) {
        paths.push(event.urlSlug);
      }
    }
  }
  // if (res && res.data && Array.isArray(res.data)) {
  //   paths.push(...res.data.map((event) => event.attributes.urlSlug));
  // }

  return paths.map((eventID) => ({ eventID }));
};

export default async function EventPage({
  params,
}: {
  params: EventPageParams;
}) {
  const { eventID } = await params;
  const res = await fetchCMS("events", {
    populate: "*",
    "filters[urlSlug][$eq]": eventID,
  });

  if (!res) {
    return <EventPage404 />;
  }

  const event = res.data[0]; // Assuming the API returns an array of events

  if (!event || !isValidSiteEvent(event)) {
    return <EventPage404 />;
  }

  return (
    <WrapInNavbarAndFooter>
      <EventPageClientComponent event={event} />;
    </WrapInNavbarAndFooter>
  );
}

// export function getStaticPaths () {

// }

function EventPage404() {
  return (
    <Page404
      customMessage={
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            textAlign: "center",
            gap: "0.5rem",
          }}
        >
          <h1 className="H4">Event not found</h1>
          <Button href="/events#search">Back to Events</Button>
        </div>
      }
    />
  );
}
