"use client";

import { StrapiPicture } from "@shared/types/cms/CMSTypes";
import HeroSingleImageStyles from "../HeroSingleImage/HeroSingleImage.module.css";
import { DefaultImageCollection } from "@/app/_icons/Icons";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/_features/store";
import { setPopupCarousel } from "@/app/_features/popupCarousel/popupCarouselSlice";
import { CarouselFullScreenImage } from "@/app/galleries/[galleryID]/_components/CarouselFullScreenImage";
import { CarouselThumbnail } from "@/app/galleries/[galleryID]/_components/CarouselThumbnail";
import { TryGetImageFormatUrl } from "@/app/_utils/types/cms/cmsTypeTools";
import { isStrapiPicture } from "@shared/types/cms/CMSCheck";

export default function HeroImageCollection({
  images,
}: {
  images: StrapiPicture[];
}) {
  if (!images || images.length === 0) {
    return null;
  }

  const coolTileCount = Math.min(images.length - 1, 2);

  const dispatch = useDispatch<AppDispatch>();

  const mediaArray = images;

  const onImageClick = (index: number) => {
    dispatch(
      setPopupCarousel({
        items: mediaArray.map((img, i) => (
          <CarouselFullScreenImage
            key={img.id || i}
            src={`${isStrapiPicture(img) ? TryGetImageFormatUrl(img, 'large') : undefined}`}
            alt={img.alternativeText || `Gallery image ${i + 1}`}
            caption={img.caption}
          />
        )),
        thumbnails: mediaArray.map((img, i) => (
          <CarouselThumbnail
            key={img.id || i}
            src={`${isStrapiPicture(img) ? TryGetImageFormatUrl(img, 'thumbnail') : undefined}`}
            alt={img.alternativeText || `Gallery image ${i + 1}`}
          />
        )),
        showArrows: true,
        showThumbnails: true,
        activeIndex: index,
      })
    );
  };

  return (
    <div
      className={`${HeroSingleImageStyles.container} dimOnHover`}
      style={{
        paddingRight: `${0.25 * coolTileCount}rem`,
        boxSizing: "border-box",
        cursor: "pointer",
      }}
      onClick={() => onImageClick(0)}
    >
      <div
        className={HeroSingleImageStyles.imageWrapper}
        style={{ position: "relative" }}
      >
        <img
          src={`${isStrapiPicture(images[0]) ? TryGetImageFormatUrl(images[0], 'medium') : undefined}`}
          alt={images[0].alternativeText}
          className={HeroSingleImageStyles.image}
          style={{ zIndex: 10 }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "0.5rem",
            right: "0.5rem",
            backgroundColor: "rgba(var(--color-neutral-1000), 0.5)",
            padding: "0.5rem",
            borderRadius: "0.5rem",
            zIndex: 11,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <DefaultImageCollection
            color={"rgb(var(--color-font-default))"}
            size="1rem"
          />
        </div>
        {Array.from({ length: coolTileCount }).map((_, index) => (
          <div
            key={index}
            className={HeroSingleImageStyles.image}
            style={{
              zIndex: 9 - index,
              backgroundColor: `rgb(var(--color-neutral-1000), ${0.25})`,
              width: "100%",
              height: "100%",
              position: "absolute",
              borderRadius: "0.5rem",
              translate: `${0.25 + 0.25 * index}rem -${0.25 + 0.25 * index}rem`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
