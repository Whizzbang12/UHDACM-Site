import {
  DefaultChevronLeft,
  DefaultChevronRight,
  DefaultShareOutline,
  DefaultCalendar,
  DefaultSearch,
} from "@/app/_icons/Icons";
import { CMSButtonIcon } from "@shared/types/cms/CMSTypes";
import { ReactNode } from "react";

export function getDefaultIconForCMSButton(icon: CMSButtonIcon) {
  const iconMap: Record<CMSButtonIcon, ReactNode> = {
    "chevron-left": <DefaultChevronLeft style={{ margin: '0 -0.25rem' }} strokeWidth={"0.175rem"} />,
    "chevron-right": <DefaultChevronRight style={{ margin: '0 -0.25rem' }} strokeWidth={"0.175rem"} />,
    share: <DefaultShareOutline strokeWidth={"0.15rem"} />,
    calendar: <DefaultCalendar strokeWidth={"0.17rem"} />,
    search: <DefaultSearch strokeWidth={'0.2rem'} />,
  };

  return iconMap[icon] || null;
}

