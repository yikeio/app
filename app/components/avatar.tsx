import React from "react";
import classNames from "../utils/classnames";

interface AvatarProps {
  src: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "avatar",
  size = "md",
  className,
}) => {
  const sizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <img
      src={src}
      alt={alt}
      className={classNames(sizes[size], "rounded-full", className)}
    />
  );
};

export default Avatar;
