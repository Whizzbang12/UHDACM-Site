"use client";

import { useSelector } from "react-redux";
import { RootState } from "./_features/store";
import PopupCarousel from "./_features/popupCarousel/components/popupCarousel";
import ScrollToSectionListener from "./_features/scrollToSectionListener/ScrollToSectionListener";
import Chatbot from "./_features/chatbot/chatbot";
import { usePostHog } from "posthog-js/react";

export default function Body({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { overflowY } = useSelector((store: RootState) => store.body);

  const posthog = usePostHog();

  function handlePurchase() {
    posthog.capture("purchase_completed", { amount: 99 });
  }

  return (
    <body
      className={`${className}`}
      style={{ overflowY: overflowY, overflowX: "hidden" }}
    >
      <ScrollToSectionListener>
        <button style={{position: 'fixed', zIndex: 1000, bottom: 10, left: 10}} onClick={handlePurchase}>Complete purchase</button>
        <Chatbot />
        <PopupCarousel />
        {children}
      </ScrollToSectionListener>
    </body>
  );
}
