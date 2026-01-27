"use client";

import { DefaultChevronLeft, DefaultChevronRight } from "@/app/_icons/Icons";
import React from "react";
import Select from "../Select/Select";
import { Month, Months } from "@shared/types/general/generalTypes";
import { monthToInt, toTitleCase } from "@/app/_utils/tools";
import styles from "./Calendar.module.css";

const startingYear = new Date().getFullYear() + 1;
const Years = Array.from({ length: 3 }, (_, i) => `${startingYear - i}`);

type CalendarProps = {
  day: number;
  setDay: React.Dispatch<React.SetStateAction<number>>;
  month: string;
  setMonth: React.Dispatch<React.SetStateAction<string>>;
  year: string;
  setYear: React.Dispatch<React.SetStateAction<string>>;
  dotsOnDates?: Date[];
};

export default function Calendar({
  day,
  setDay,
  month,
  setMonth,
  year,
  setYear,
  dotsOnDates,
}: CalendarProps) {
  const CalendarDate = new Date(
    parseInt(year),
    Months.indexOf(month.toLowerCase() as Month),
    1
  );

  const firstDayOfWeek = CalendarDate.getDay();

  const daysInMonth = new Date(
    CalendarDate.getFullYear(),
    CalendarDate.getMonth() + 1,
    0
  ).getDate();

  function handleSetDay(newDay: number) {
    const newMonthIndex = Months.indexOf(month.toLowerCase() as Month);
    const newYear = parseInt(year);
    let finalDay = newDay;
    let finalMonthIndex = newMonthIndex;
    let finalYear = newYear;

    if (newDay < 1) {
      // Go to previous month
      finalMonthIndex -= 1;
      if (finalMonthIndex < 0) {
        finalMonthIndex = 11;
        finalYear -= 1;
      }
      finalDay = new Date(finalYear, finalMonthIndex + 1, 0).getDate();
    } else {
      const daysInCurrentMonth = new Date(
        newYear,
        newMonthIndex + 1,
        0
      ).getDate();
      if (newDay > daysInCurrentMonth) {
        // Go to next month
        finalMonthIndex += 1;
        if (finalMonthIndex > 11) {
          finalMonthIndex = 0;
          finalYear += 1;
        }
        finalDay = 1;
      }
    }

    setYear(finalYear.toString());
    setMonth(toTitleCase(Months[finalMonthIndex]));
    setDay(finalDay);
  }

  const dotsOnDatesYMD = dotsOnDates
    ? dotsOnDates.map(
        (date) =>
          `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
      )
    : [];
  return (
    <div
      style={{
        background: "rgb(var(--color-neutral-800))",
        borderRadius: "0.5rem",
        padding: "1rem",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
          className="H5"
        >
          {/* Left controls */}
          <div style={{ display: "flex", gap: "0.5rem", marginRight: "1rem" }}>
            <div style={{ width: "9rem" }}>
              <Select
                options={Months}
                selected={month}
                onSelect={(v) => setMonth(v)}
                placeholder="Month"
              />
            </div>
            <div style={{ width: "6rem" }}>
              <Select
                options={Years}
                selected={year}
                onSelect={(v) => setYear(v)}
                placeholder="Year"
              />
            </div>
          </div>
          {/* Right chevrons */}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <DefaultChevronLeft
              className={`${styles["Chevron"]}`}
              size="1.5rem"
              strokeWidth={"0.175rem"}
              onClick={() => handleSetDay(day - 1)}
            />
            <DefaultChevronRight
              className={`${styles["Chevron"]}`}
              size="1.5rem"
              strokeWidth={"0.175rem"}
              onClick={() => handleSetDay(day + 1)}
            />
          </div>
        </div>
      </div>
      {/* Calendar grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "0.5rem",
          width: "100%",
        }}
        className={`BodyLarge`}
      >
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d, i) => {
          return (
            <div
              key={d}
              className={"H5"}
              style={{
                background: "transparent",
                width: "100%",
                padding: "0.5rem 0rem",
                display: "flex",
                justifyContent: "center",
                userSelect: "none",
                position: "relative",
                color:
                  i == 0 || i == 6
                    ? "rgb(var(--color-font-secondary))"
                    : "inherit",
              }}
            >
              {d}
            </div>
          );
        })}
        {/* Puts buffer before first day of the month */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => {
          return (
            <div
              key={`buffer${i}`}
              className={`${styles["CalendarDay"]} ${styles["buffer"]}`}
            />
          );
        })}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const EventOnToday = dotsOnDatesYMD.includes(
            `${year}-${monthToInt(month as Month) + 1}-${i + 1}`
          );
          return (
            <div
              key={`${month}${i}`} // makes component update if month changes too (fixes increment changes)
              className={`${styles["CalendarDay"]} ${
                i + 1 == day ? styles["active"] : ""
              }`}
              onClick={() => setDay(i + 1)}
              style={{
                color:
                  i + 1 === new Date().getDate() &&
                  Months.indexOf(month.toLowerCase() as Month) ===
                    new Date().getMonth()
                    ? "rgb(var(--color-font-secondary))"
                    : undefined,
              }}
            >
              {i + 1}
              {EventOnToday && <div className={`${styles["eventDot"]}`} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
