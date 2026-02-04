'use client'

import { CMSButton as CMSButtonProps } from "@shared/types/cms/CMSTypes";
import Button from "../Button";
import { getDefaultIconForCMSButton } from "@/app/_utils/types/cms/cmsTypeToolsTsx";
import posthog from "posthog-js";

export default function CMSButton({
  text,
  icon,
  isIconOnRightSide,
  href,
  target,
}: CMSButtonProps) {
  const IconComp = icon ? getDefaultIconForCMSButton(icon) : undefined;

  const bre = () => {
    posthog.capture("Hello World", {
      programmed: "to work",
      and_not: "to feel",
    });
  };

  return (
    <Button
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
      }}
      href={href}
      target={target}
      onClick={bre}
    >
      {!isIconOnRightSide && IconComp && IconComp}
      <span className={"BodyLargeHeavy"}>{text}</span>
      {isIconOnRightSide && IconComp && IconComp}
    </Button>
  );
}
