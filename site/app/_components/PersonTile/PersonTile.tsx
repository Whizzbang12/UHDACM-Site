"use client";

import React, { HTMLAttributeAnchorTarget, useEffect, useState } from "react";
import "./PersonTile.css";
import Transition from "../Transition/Transition";
import {
  DefaultFacebook,
  DefaultGithub,
  DefaultGlobe,
  DefaultLinkedin,
  DefaultInstagram,
  DefaultTwitter,
  DefaultYoutube,
  DefaultClose,
  DefaultDiscord,
} from "@/app/_icons/Icons";
import { SocialSite } from "@shared/types/cms/CMSTypes";
import {
  FunctionUnknown,
  CardinalDirection,
} from "@shared/types/general/generalTypes";
import { useBodyOverflowY } from "@/app/_features/body/useSetBodyOverflowY";
import IndicateScrollableDiv from "../IndicateScrollableDiv/IndicateScrollableDiv";

type PersonTileSocial = {
  icon: SocialSite;
  style?: React.CSSProperties;
  href?: string;
  href_target?: HTMLAttributeAnchorTarget;
  onClick?: FunctionUnknown;
};
type CoverOrContain = "cover" | "contain";

const iconMap = {
  personal_site: DefaultGlobe,
  facebook: DefaultFacebook,
  instagram: DefaultInstagram,
  linkedin: DefaultLinkedin,
  x: DefaultTwitter,
  github: DefaultGithub,
  youtube: DefaultYoutube,
  discord: DefaultDiscord,
};
export default function PersonTile({
  tileStyle,
  previewTitleStyle,
  previewSubTitleStyle,
  img,
  imgCoverOrContain = "cover",
  previewTitle,
  previewSubTitle,
  fullTitle,
  fullSubtitle,
  fullDescription,
  socials,
  onClickTile,
  onClose,
}: {
  tileStyle?: React.CSSProperties;
  previewTitleStyle?: React.CSSProperties;
  previewSubTitleStyle?: React.CSSProperties;
  img?: string;
  imgCoverOrContain?: CoverOrContain;
  previewTitle?: string;
  previewSubTitle?: string;
  fullTitle?: string;
  fullSubtitle?: string;
  fullDescription?: string;
  socials?: PersonTileSocial[];
  onClickTile?: FunctionUnknown;
  onClose?: FunctionUnknown;
}) {
  const [open, setOpen] = useState(false);
  const { disableOverflowY, enableOverflowY } = useBodyOverflowY();

  useEffect(() => {
    if (open) {
      disableOverflowY();
    } else {
      enableOverflowY();
    }
  }, [open]);

  return (
    <>
      <div
        onClick={() => {
          setOpen(!open);
          onClickTile && onClickTile();
        }}
        style={tileStyle}
        className="ImgContainer"
      >
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            margin: "0.5rem",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            gap: "0.1rem",
          }}
        >
          <p
            style={{
              color: "white",
              margin: 0,
              ...previewTitleStyle,
            }}
            className={"BodyLargeHeavy"}
          >
            {previewTitle || "Title"}
          </p>
          <p
            style={{
              color: "white",
              margin: 0,
              ...previewSubTitleStyle,
            }}
            className={"BodySmall"}
          >
            {previewSubTitle || "Subtitle"}
          </p>
        </div>
        <div className="previewImageOverlayGradient" />
        <img
          style={{
            height: "100%",
            width: "100%",
            objectFit: imgCoverOrContain,
          }}
          src={img}
        />
      </div>
      <PersonTileExpanded
        t={fullTitle}
        sT={fullSubtitle}
        desc={fullDescription}
        imgCoverOrContain={imgCoverOrContain}
        setOpen={setOpen}
        open={open}
        socials={socials}
        img={img}
        onClose={onClose}
      />
    </>
  );
}

const wipeDir: CardinalDirection = "right";
const SocialIconStyle: React.CSSProperties = {
  margin: 0,
  padding: 3,
  borderRadius: 10,
  cursor: "pointer",
  color: "rgb(var(--color-font-default))",
};

function PersonTileExpanded({
  open,
  setOpen,
  style,
  t,
  sT,
  desc,
  socials,
  img,
  onClose,
  imgCoverOrContain,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  style?: React.CSSProperties;
  t?: string;
  sT?: string;
  desc?: string;
  socials?: PersonTileSocial[];
  img?: string;
  onClose?: FunctionUnknown;
  imgCoverOrContain?: CoverOrContain;
}) {
  function HandleClickSocialIcon(
    href?: string,
    href_target?: HTMLAttributeAnchorTarget,
  ) {
    href && window.open(href, href_target || "_blank");
  }

  return (
    <Transition
      delayAfter={300}
      transitionSpeedMS={200}
      fps={30}
      type="fade"
      toggle={open}
      forceStyle={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100%",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: "100vw",
          height: "100vh",
          position: "absolute",
          top: 0,
          left: 0,
          backgroundColor: "#0008",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className={"expandedImgAndCardContainer"}>
          <Transition
            transitionSpeedMS={300}
            hideOnToggleOff={false}
            type="wipe"
            toggle={open}
            delayBefore={200}
            delayAfter={100}
            fps={60}
            direction={wipeDir}
            easing="inOutQuart"
            forceClass="imageShiftMobile"
          >
            <div style={style} className={"expandedImgContainer"}>
              <img
                style={{
                  height: "100%",
                  width: "100%",
                  objectFit: imgCoverOrContain,
                  position: "relative",
                }}
                src={img}
              />
            </div>
          </Transition>
          <Transition
            transitionSpeedMS={400}
            delayBefore={200}
            hideOnToggleOff={false}
            type="wipe"
            direction={wipeDir}
            fps={60}
            toggle={open}
            easing="inOutQuart"
          >
            <div className={"expandedDescriptionCard"}>
              <div className={"expandedDescription"}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.1rem",
                  }}
                >
                  <p
                    style={{
                      color: "rgb(var(--color-font-default))",
                    }}
                    className={"expandedCardText H3"}
                  >
                    {t || "Title"}
                  </p>
                  <p
                    style={{
                      color: "rgb(var(--color-font-default))",
                      fontWeight: 500,
                    }}
                    className={"expandedCardText H5"}
                  >
                    {sT || "Subtitle"}
                  </p>
                </div>
                <IndicateScrollableDiv
                  className={
                    "expandedCardText expandedCardFullDescription BodyLarge"
                  }
                >
                  {desc || "Description"}
                </IndicateScrollableDiv>
              </div>
              <div className="expandedCardIconContainer">
                {socials?.map(
                  ({ icon, style, href, href_target, onClick }, index) => {
                    const key = `Social_Icon_${index}`;
                    const onClickFunc = () => {
                      HandleClickSocialIcon(href, href_target);
                      onClick && onClick();
                    };
                    const combinedStyles = { ...SocialIconStyle, ...style };
                    const IconComponent = iconMap[icon];
                    if (!IconComponent) return null;
                    return (
                      <IconComponent
                        size={"2rem"}
                        style={combinedStyles}
                        onClick={onClickFunc}
                        key={key}
                      />
                    );
                  },
                )}
              </div>
              <DefaultClose
                style={{
                  position: "absolute",
                  top: "0.5rem",
                  right: "0.5rem",
                  cursor: "pointer",
                  color: "rgb(var(--color-font-default))",
                }}
                size={"2rem"}
                onClick={() => {
                  setOpen(false);
                  onClose && onClose();
                }}
              />
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  );
}
