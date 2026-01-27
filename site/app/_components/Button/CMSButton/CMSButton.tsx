import { CMSButton as CMSButtonProps } from "@shared/types/cms/CMSTypes";
import Button from "../Button";
import { getDefaultIconForCMSButton } from "@/app/_utils/types/cms/cmsTypeToolsTsx";

export default function CMSButton({
  text,
  icon,
  isIconOnRightSide,
  href,
  target,
}: CMSButtonProps) {
  const IconComp = icon ? getDefaultIconForCMSButton(icon) : undefined;
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
    >
      {!isIconOnRightSide && IconComp && IconComp}
      <span className={"BodyLargeHeavy"}>{text}</span>
      {isIconOnRightSide && IconComp && IconComp}
    </Button>
  );
}
