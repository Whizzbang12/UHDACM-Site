import { StrapiPicture } from "@shared/types/cms/CMSTypes";
import styles from "./HeroSingleImage.module.css";
import { TryGetImageFormatUrl } from "@/app/_utils/types/cms/cmsTypeTools";

export default function HeroSingleImage({
  image,
}: {
  image: StrapiPicture;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
        <img
          src={TryGetImageFormatUrl(image, 'large')}
          alt={image.alternativeText}
          className={styles.image}
        />
      </div>
    </div>
  );
}