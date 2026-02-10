"use client";
import { SearchBar } from "@/app/_components/SearchBar/SearchBar";
import Calendar from "@/app/_components/Calendar/Calendar";
import { useEffect, useState } from "react";
import { intToMonth, toTitleCase } from "@/app/_utils/tools";
import { EntrySortMode, ListingMode } from "@shared/types/cms/CMSTypes";
import { DefaultClose } from "@/app/_icons/Icons";
import { useBodyOverflowY } from "@/app/_features/body/useSetBodyOverflowY";
import { EntryTileProps } from "../EntryTile/EntryTile";
import { EntryListing } from "./EntryListing";

import styles from "./EntryListing.module.css";
import { getTodayYMD } from "@/app/_utils/clientTools";

export default function EntrySearchTool({
  entryTypePlural,
  entryTypeSingular,
  entries,
  defaultListingMode,
  defaultSortingMode,
}: {
  entryTypePlural: string;
  entryTypeSingular: string;
  entries: EntryTileProps[];
  defaultListingMode: ListingMode;
  defaultSortingMode?: EntrySortMode;
}) {
  const { disableOverflowY, enableOverflowY } = useBodyOverflowY();

  const [day, setDay] = useState(0);
  const [month, setMonth] = useState<string>(
    toTitleCase(intToMonth(0) || "january")
  );
  const [year, setYear] = useState<string>(`${0}`);
  const [search, setSearch] = useState("");
  const [calendarActive, setCalendarActive] = useState(false);

  useEffect(() => {
    const [nowYear, nowMonth, nowDay] = getTodayYMD();
    setYear(`${nowYear}`);
    const monthStr = intToMonth(nowMonth) || "january";
    setMonth(toTitleCase(monthStr));
    setDay(nowDay);
  }, []);

  const handleSetCalendarActive = (state: boolean) => {
    setCalendarActive(state);
    if (!state) {
      enableOverflowY();
    } else {
      disableOverflowY();
    }
  };

  // Force a rerender after 500ms to ensure client components load properly
  // this is a workaround
  const [_, setForceRerender] = useState(0);

  useEffect(() => {
    setTimeout(() => setForceRerender(1), 500);
  }, []);

  const SearchBarComp = (
    <SearchBar inputValue={search} onInputValueChange={(v) => setSearch(v)} />
  );

  const CalendarComp = (
    <Calendar
      day={day}
      month={month}
      year={year}
      setDay={setDay}
      setMonth={setMonth}
      setYear={setYear}
      dotsOnDates={entries.filter((e) => e.date).map((e) => new Date(e.date!))}
    />
  );

  const GenerateEntryListingComp = (onDatePressActive: boolean) => (
    <EntryListing
      entries={entries}
      day={day}
      month={month}
      year={year}
      entryTypePlural={entryTypePlural}
      entryTypeSingular={entryTypeSingular}
      search={search}
      defaultListingMode={defaultListingMode}
      defaultSortingMode={defaultSortingMode}
      onDatePress={
        onDatePressActive ? () => handleSetCalendarActive(true) : undefined
      }
    />
  );

  // console.log("entry listing settings", {
  //   day,
  //   month,
  //   year,
  //   search,
  //   listingMode: defaultListingMode,
  //   sortingMode: defaultSortingMode,
  //   entryTypeSingular,
  //   entries,
  // });

  if (!day || !month || !year) {
    return null;
  }

  return (
    <>
      <div style={{ width: "100%" }} className={styles.hideOnDesktop}>
        <div
          style={{
            width: "100%",
            height: "auto",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: "1rem",
            boxSizing: "border-box",
          }}
        >
          {GenerateEntryListingComp(true)}
          {calendarActive && (
            <div
              style={{
                width: "100vw",
                height: "100vh",
                position: "fixed",
                backgroundColor: "rgba(var(--color-neutral-1000), 0.75)",
                top: 0,
                left: 0,
                zIndex: 1000,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "95vw",
                  maxWidth: "25rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                <span className="H3">Select A Date</span>
                {CalendarComp}
              </div>
              <DefaultClose
                style={{ position: "absolute", top: "1rem", right: "1rem" }}
                color={"rgb(var(--color-font-default))"}
                size={"2.5rem"}
                onClick={() => handleSetCalendarActive(false)}
              />
            </div>
          )}
        </div>
      </div>
      <div style={{ width: "100%" }} className={styles.hideOnMobile}>
        <div
          style={{
            width: "100%",
            height: "auto",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: "1rem",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              flex: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              justifyContent: "flex-start",
            }}
          >
            <div
              style={{
                // maxWidth: "25rem",
                width: "100%",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {SearchBarComp}
              {CalendarComp}
            </div>
          </div>
          <div
            style={{
              flex: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              boxSizing: "border-box",
            }}
          >
            {GenerateEntryListingComp(false)}
          </div>
        </div>
      </div>
    </>
  );
}
