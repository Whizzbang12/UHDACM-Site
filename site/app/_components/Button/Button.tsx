"use client";

import React from "react";
import Link from "next/link";
import { FunctionUnknown } from "@shared/types/general/generalTypes";
import styles from "./Button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: FunctionUnknown;
  href?: string;
  target?: React.HTMLAttributeAnchorTarget;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const defaultProps = {
  className: [styles.Button, styles["LinkStyle"]].join(" "),
  tabIndex: 0,
};

const Button: React.FC<ButtonProps> = ({
  onClick,
  href,
  target,
  children,
  style,
  className,
  ...props
}) => {
  const classes = [defaultProps.className, styles[className || ""]]
    .filter(Boolean)
    .join(" ");
  if (href) {
    return (
      <Link
        {...defaultProps}
        onClick={onClick}
        href={href}
        style={style}
        className={classes}
        target={target}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      {...defaultProps}
      onClick={onClick}
      style={style}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
