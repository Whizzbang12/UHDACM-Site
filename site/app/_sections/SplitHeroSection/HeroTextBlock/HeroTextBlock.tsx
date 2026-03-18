import { HeroTextBlock as HeroTextBlockProps } from "@shared/types/cms/CMSTypes";
import { Fragment, ReactNode } from "react";
import styles from "./HeroTextBlock.module.css";
import CMSButton from "@/app/_components/Button/CMSButton/CMSButton";

export function HeroTextBlock({
  preheader,
  header,
  headerType,
  subheader,
  buttonsVisible,
  buttons,
  alignment,
}: HeroTextBlockProps) {
  let trueAlignment = "start";
  if (alignment === "center") trueAlignment = "center";
  else if (alignment === "right") trueAlignment = "end";

  function toNode(
    text?: string,
    type?:
      | HeroTextBlockProps["headerType"]
      | "Title"
      | "BodySmall"
      | "SubtitleRegular",
  ): ReactNode {
    if (!text) return null;
    const lines = text.split("\\n");
    return lines.map((line, idx) => (
      <Fragment key={idx}>
        {extractColorSpans(line, type)}
        {/* {line} */}
        {idx < lines.length - 1 && <br />}
      </Fragment>
    ));
  }

  const preheaderNode = toNode(preheader, "BodySmall");
  const headerNode = toNode(header, headerType ? headerType : "Title");
  const subheaderNode = toNode(subheader, "SubtitleRegular");

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <div
        style={{
          alignItems: trueAlignment,
        }}
        className={styles.textBlockInner}
      >
        <div className={styles.heroHeader}>
          {preheader && (
            <span
              style={{ textAlign: alignment }}
              className={`BodySmall ${styles.span}`}
            >
              {preheaderNode}
            </span>
          )}
          {header && (
            <div
              className={headerType ? ` ${headerType}` : "Title"}
              style={{ textAlign: alignment }}
            >
              {headerNode}
            </div>
          )}
        </div>
        {subheader && (
          <div
            style={{ whiteSpace: "pre-line", textAlign: alignment }}
            className="SubtitleRegular"
          >
            {subheaderNode}
          </div>
        )}
        {buttonsVisible && (
          <div className={styles.heroButtons}>
            {buttons?.map((button, index) => (
              <CMSButton key={index} {...button} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const LENGTH_WEIGHT = 0.06;
function extractColorSpans(
  str: string,
  type?:
    | HeroTextBlockProps["headerType"]
    | "Title"
    | "BodySmall"
    | "SubtitleRegular",
) {
  let lastEndIndex = 0;
  const strs: ReactNode[] = [];
  for (let i = 0; i < str.length; i++) {
    if (str.charAt(i) == "$" && str.charAt(i + 1) == "#") {
      // find closing
      let openIndex = i + 3;
      let closeIndex = -1;
      for (let j = openIndex; j < str.length; j++) {
        if (str.charAt(j) == "$" && str.charAt(j + 1) == "#") {
          closeIndex = j;
          break;
        }
      }

      if (closeIndex == -1) {
        // not valid, no closing tag.
        strs.push(<span key={i} className={type}>{str.substring(lastEndIndex)}</span>);
        lastEndIndex = str.length;
        break;
      }

      // color code should be index after #
      const colorCode = str.charAt(i + 2);
      const spanText = str.substring(openIndex, closeIndex);
      console.log(colorCode, spanText);

      // How many stops to shift per character. Adjust to taste.
      const stopShift = Math.min(4, Math.round(spanText.length * LENGTH_WEIGHT));

      let gradientFrom = "";
      let gradientTo = "";
      if (colorCode == "P") {
        gradientFrom = "--color-primary-500";
        gradientTo = `--color-primary-${600 + stopShift * 100}`;
      } else if (colorCode == "S") {
        gradientFrom = "--color-secondary-400";
        gradientTo = `--color-secondary-${500 + stopShift * 100}`;
      } else if (colorCode == "N") {
        gradientFrom = "--color-neutral-100";
        gradientTo = `--color-neutral-${200 + stopShift * 100}`;
      } else {
        // aint jack to do here, error.
        continue;
      }

      // color code present, add everything before this point
      // add it
      strs.push(
        <span
          className={type}
          style={{
            background: `linear-gradient(to right, rgba(var(${gradientFrom}), 1), rgba(var(${gradientTo}), 1))`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            display: "inline-block",
            color: "transparent",
            // color: "rgb(var(--color-primary-200))",
          }}
          key={i}
        >
          {spanText}
        </span>
      );
      lastEndIndex = closeIndex + 2;
    }
  }
  strs.push(<span key={'end'} className={type}>{str.substring(lastEndIndex)}</span>);
  return strs;
}


