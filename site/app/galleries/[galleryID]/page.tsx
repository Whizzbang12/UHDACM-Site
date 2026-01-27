import Button from "@/app/_components/Button/Button";
import MainHeroSection from "@/app/_sections/MainHeroSection/MainHeroSection";
import GalleryGrid from "./_components/GalleryGrid";
import { fetchCMS } from "@/app/_utils/cms";
import { isStrapiPicture, isValidSiteEvent } from "@shared/types/cms/CMSCheck";
import { StrapiPicture } from "@shared/types/cms/CMSTypes";
import Page404 from "@/app/not-found";
import { NavbarPadding } from "@/app/_pageRenderer/PageRenderer";
import ShareButton from "@/app/_components/Button/CommonVariants/ShareButton";
import HeroSingleImage from "@/app/_sections/SplitHeroSection/HeroSingleImage/HeroSingleImage";
import { generateGalleryShareText } from "@/app/_utils/types/cms/cmsTypeTools";
import { WrapInNavbarAndFooter } from "@/app/_utils/tsxTools";

type EventPageParams = Promise<{
  galleryID: string;
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

  return paths.map((galleryID) => ({ galleryID }));
};

export default async function EventPage({
  params,
}: {
  params: EventPageParams;
}) {
  const { galleryID } = await params;
  const res = await fetchCMS("events", {
    "populate[0]": "previewImage",
    "populate[1]": "gallery.media",
    "filters[urlSlug][$eq]": galleryID,
  }, ['galleries']);

  if (!res) {
    return <Galleries404 />;
  }

  const event = res.data[0];
  if (!isValidSiteEvent(event) || !event.gallery) {
    return <Galleries404 />;
  }

  const media = event.gallery.media || [];

  const validMedia: StrapiPicture[] = [];
  for (const pic of media) {
    if (isStrapiPicture(pic)) {
      validMedia.push(pic);
    }
  }

  return (
    <WrapInNavbarAndFooter>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          position: "relative",
        }}
      >
        <NavbarPadding />
        <MainHeroSection
          spanText="GALLERY"
          title={`${event.name}`}
          leftStyle={{ flex: 1 }}
          rightStyle={{ flex: 1 }}
          rightContent={
            isStrapiPicture(event.previewImage) ? (
              <HeroSingleImage image={event.previewImage} />
            ) : undefined
          }
          bottomContent={
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <ShareButton
                copyText={`${generateGalleryShareText(event)}`}
                replaceTextOnCopyString="Copied Gallery URL"
              />
            </div>
          }
        />

        <GalleryGrid media={validMedia} />
      </div>
    </WrapInNavbarAndFooter>
  );
}

function Galleries404() {
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
          <h1 className="H4">Gallery not found</h1>
          <Button href="/galleries#search">Back to Galleries</Button>
        </div>
      }
    />
  );
}
