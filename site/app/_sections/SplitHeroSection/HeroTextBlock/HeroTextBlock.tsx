import {  HeroTextBlock as HeroTextBlockProps, } from "@shared/types/cms/CMSTypes";
import { Fragment, ReactNode } from 'react';
import styles from './HeroTextBlock.module.css'
import CMSButton from '@/app/_components/Button/CMSButton/CMSButton';

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

  function toNode(text?: string): ReactNode {
    if (!text) return null;
    const lines = text.split("\\n");
    return lines.map((line, idx) => (
      <Fragment key={idx}>
        {line}
        {idx < lines.length - 1 && <br />}
      </Fragment>
    ));
  }

  const preheaderNode = toNode(preheader);
  const headerNode = toNode(header);
  const subheaderNode = toNode(subheader);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        width: '100%'
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