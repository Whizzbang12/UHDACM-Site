"use client";
import { BlocksContent, BlocksRenderer } from "@strapi/blocks-react-renderer";
import { ReactNode } from "react";
import { JSX } from "react/jsx-dev-runtime";

export default function StrapiRichTextRenderer({
  content,
}: {
  content: BlocksContent;
}) {
  return (
    <BlocksRenderer
      content={content}
      blocks={{
        paragraph: ({ children }: { children: ReactNode }) => (
          <p
            className="BodyLarge"
            style={{ marginBottom: "0.5rem", overflowWrap: "break-word" }}
          >
            {children}
          </p>
        ),
        heading: ({
          children,
          level,
        }: {
          children: ReactNode;
          level: number;
        }) => {
          const adjustedLevel = level + 1;
          const HeadingTag = `h${adjustedLevel}` as keyof JSX.IntrinsicElements;
          return (
            <HeadingTag
              style={{ marginTop: "1rem", overflowWrap: "break-word" }}
              className={`H${adjustedLevel}`}
            >
              {children}
            </HeadingTag>
          );
        },
        link: ({ children, url }: { children: ReactNode; url: string }) => (
          <a
            href={url}
            target="_blank"
            className="Link"
            style={{
              textDecoration: "underline",
              color: "rgb(var(--color-font-primary))",
              overflowWrap: "break-word",
            }}
          >
            {children}
          </a>
        ),
      }}
      modifiers={{
        bold: ({ children }: { children: ReactNode }) => (
          <strong>{children}</strong>
        ),
      }}
    />
  );
}
