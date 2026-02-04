'use client'

import { StrapiPicture } from "@shared/types/cms/CMSTypes";
import styles from "./HeroSingleImage.module.css";
import { TryGetImageFormatUrl } from "@/app/_utils/types/cms/cmsTypeTools";
import { usePublicEnv } from "@/app/_context/PublicEnvContext/PublicEnvContext";

export default function HeroSingleImage({
  image,
}: {
  image: StrapiPicture;
}) {
  const public_env = usePublicEnv();
  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
        <img
          src={TryGetImageFormatUrl(image, 'large', public_env.NEXT_PUBLIC_CMS_URL)}
          alt={image.alternativeText}
          className={styles.image}
        />
      </div>
    </div>
  );
}