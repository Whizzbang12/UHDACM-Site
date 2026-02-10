import { fetchCMS } from "@/app/_utils/cms";
import { isValidFeaturedEvent } from "@shared/types/cms/CMSCheck";
import FeaturedEventComp from "./FeaturedEventComp";
import styles from './FeaturedEventSection.module.css';

export default async function FeaturedEventSection({ sectionID }: { sectionID?: string }) {
  const res = await fetchCMS("featured-event", {
    "populate[event][populate]": "*",
    populate: "previewImageHD",
  }, ['events']);

  if (!res) {
    return;
  }

  const featuredEvent = res.data;
  if (!isValidFeaturedEvent(featuredEvent)) {
    return;
  }

  
  return (
    <div className={styles.SectionRoot} id={sectionID}>
      <div className={styles.SectionInner}>
        <h1 className="H1">Featured Event</h1>
        <FeaturedEventComp featuredEvent={featuredEvent} />
      </div>
    </div>
  );
}
