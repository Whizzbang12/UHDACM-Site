import React, { ReactNode } from "react";

import styles from "./SplitHeroSection.module.css";
import {
  SiteSectionSplitHero,
  SplitHeroColumn
} from "@shared/types/cms/CMSTypes";
import {
  isValidSplitHeroColumnFloatingImages,
  isValidSplitHeroColumnForm,
  isValidSplitHeroColumnImageCollection,
  isValidSplitHeroColumnNone,
  isValidSplitHeroColumnSingleImage,
  isValidSplitHeroColumnTextBlock,
} from "@shared/types/cms/CMSCheck";
import HeroSingleImage from "./HeroSingleImage/HeroSingleImage";
import HeroImageCollection from "./HeroImageCollection/HeroImageCollection";
import HeroFloatingImages from "./HeroFloatingImage/HeroFloatingImages";
import { HeroTextBlock } from "./HeroTextBlock/HeroTextBlock";
import HeroForm from "./HeroForm/HeroForm";

function SplitHeroColumnToComponent(component?: SplitHeroColumn) {
  if (component == null) {
    return null;
  }
  if (isValidSplitHeroColumnNone(component)) {
    return;
  } else if (isValidSplitHeroColumnTextBlock(component)) {
    const { textBlock } = component;
    return <HeroTextBlock {...textBlock} />;
  } else if (isValidSplitHeroColumnSingleImage(component)) {
    const { singleImage } = component;
    return <HeroSingleImage image={singleImage.image} />;
  } else if (isValidSplitHeroColumnImageCollection(component)) {
    return <HeroImageCollection images={component.imageCollection.images} />;
  } else if (isValidSplitHeroColumnFloatingImages(component)) {
    return <HeroFloatingImages images={component.floatingImages.images} />;
  } else if (isValidSplitHeroColumnForm(component)) {
    return <HeroForm iFrameUrl={component.form.iFrameFormUrl} />;
  }
  // else if (type == 'form') {
  //   return <HeroFormSection {...props} />;
  // } else if (type == 'imageCollection') {
  //   return <HeroImageCollectionSection {...props} />;
  // }
}

type SplitHeroSectionProps = Omit<SiteSectionSplitHero, "__component" | "id">;

const SplitHeroSection: React.FC<SplitHeroSectionProps> = ({
  leftComponent,
  rightComponent,
  centerIfPossible,
  reverseOnDesktop,
  reverseOnMobile,
  sectionID,
}) => {
  let leftComp = SplitHeroColumnToComponent(leftComponent);
  let rightComp = SplitHeroColumnToComponent(rightComponent);

  if (!centerIfPossible) {
    if (!leftComp) {
      leftComp = <div style={{ flex: 1 }} />;
    }
    if (!rightComp) {
      rightComp = <div style={{ flex: 1 }} />;
    }
  }

  return (
    <div className={`SectionRoot ${styles.heroSection}`} id={sectionID}>
      <div
        className={`SectionInner ${styles.heroInner} ${
          reverseOnDesktop ? styles.reverseOnDesktop : ""
        } ${reverseOnMobile ? styles.reverseOnMobile : ""}`}
      >
        {leftComp}
        {rightComp}
      </div>
    </div>
  );
};




export default SplitHeroSection;
