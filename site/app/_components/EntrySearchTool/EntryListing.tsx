"use client";

import Select from "@/app/_components/Select/Select";
import { useState } from "react";
import EntryTile, { EntryTileProps } from "../EntryTile/EntryTile";
import {
  EntrySortMode,
  EntrySortModes,
  ListingMode,
  ListingModes,
} from "@shared/types/cms/CMSTypes";
import { Month } from "@shared/types/general/generalTypes";
import { monthToInt, toTitleCase } from "@/app/_utils/tools";

import styles from "./EntryListing.module.css";

// TODO: Maybe migrate this to types?
interface EventListingProps {
  day: number;
  month: string;
  year: string;
  entryTypePlural: string;
  entryTypeSingular: string;
  entries: EntryTileProps[];
  search?: string;
  defaultListingMode?: ListingMode;
  defaultSortingMode?: EntrySortMode;
  onDatePress?: () => void;
}

export function EntryListing({
  day,
  month,
  year,
  entryTypePlural,
  entries,
  entryTypeSingular,
  search,
  defaultListingMode,
  defaultSortingMode,
  onDatePress,
}: EventListingProps) {
  const [listingMode, setListingMode] = useState<ListingMode>(
    defaultListingMode || "after",
  );
  const [sortingMode, setSortingMode] = useState<EntrySortMode>(
    defaultSortingMode || "ascending",
  );

  const entryList = entries;
  const remainingEntrySet = new Set<number>();
  entryList.forEach((entry, entryIndex) => {
    if (entry.header) {
      if (!entry.header.toLowerCase().includes(search?.toLowerCase() || "")) {
        return;
      }
    }

    // const eventID = entries.id.toString();
    const eventDate = new Date(entry.date);
    const selectedDate = new Date(
      Number(year),
      Number(monthToInt(month as Month)),
      Number(day),
    );

    // Zero out the time for both dates to compare only year, month, day
    eventDate.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    if (listingMode.toLowerCase() === "on") {
      if (
        !(
          eventDate.getFullYear() === selectedDate.getFullYear() &&
          eventDate.getMonth() === selectedDate.getMonth() &&
          eventDate.getDate() === selectedDate.getDate()
        )
      ) {
        return;
      }
    } else if (listingMode.toLowerCase() === "before") {
      if (!(eventDate <= selectedDate)) {
        return;
      }
    } else {
      // "after"
      if (!(eventDate >= selectedDate)) {
        return;
      }
    }
    remainingEntrySet.add(entryIndex);
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        width: "100%",
        height: "100%",
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <h3 className={`H5`} style={{ margin: 0, userSelect: "none" }}>
            {entryTypePlural}
          </h3>
          <div className={`BodyLargeHeavy ${styles.selectWrapper}`}>
            <Select
              inputStyling={{
                backgroundColor: "rgba(var(--color-neutral-1000), 0.5)",
              }}
              selected={toTitleCase(listingMode)}
              onSelect={(v) => setListingMode(v as ListingMode)}
              options={[...ListingModes]}
            />
          </div>
          <h3
            className={`H5 ${styles.underlineOnMobile}`}
            style={{
              margin: 0,
              color: "rgb(var(--color-font-secondary))",
              userSelect: "none",
            }}
            onClick={onDatePress}
          >
            {`${toTitleCase(month)} ${day}, ${year}`}
          </h3>
        </div>
        <div
          style={{ marginLeft: "auto", display: "flex", justifyContent: "end" }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "0.5rem",
              alignItems: "center",
            }}
          >
            <span className="BodyRegular">{entryTypeSingular} Order</span>
            <div
              className="BodyLarge"
              style={{
                width: "8.5rem",
                display: "flex",
                alignItems: "end",
                flexDirection: "column",
                gap: "0.25rem",
              }}
            >
              <Select
                onSelect={(v) =>
                  setSortingMode(v.toLowerCase() as EntrySortMode)
                }
                selected={toTitleCase(sortingMode)}
                options={[...EntrySortModes]}
                inputStyling={{
                  backgroundColor: "rgba(var(--color-neutral-1000), 0.5)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <h5 className="H5" style={{ opacity: "0.75" }}>
          {remainingEntrySet.size === 0 &&
            `No ${entryTypePlural.toLowerCase()} found`}
          {remainingEntrySet.size != 0 &&
            `${remainingEntrySet.size} ${
              remainingEntrySet.size == 1
                ? `${entryTypeSingular.toLowerCase()} found`
                : `${entryTypePlural.toLowerCase()} found`
            }`}
        </h5>
      </div>
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            // maxHeight: "80vh",
            paddingBottom: "8rem",
            // overflowY: remainingEntrySet.size != 0 ? "auto" : 'visible',
          }}
        >
          {entryList
            .sort((a, b) => {
              const diff =
                new Date(a.date).getTime() - new Date(b.date).getTime();
              if (sortingMode == "ascending") {
                return diff;
              } else {
                return -diff;
              }
            })
            .map((entry, i) => {
              if (!remainingEntrySet.has(i)) {
                return undefined;
              }
              return (
                <div key={i} className={`${styles["CardContainer"]}`}>
                  <EntryTile {...entry} />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
