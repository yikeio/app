import React from "react";
import classNames from "../utils/classnames";
import Image from "next/image";

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
  className = "",
}) => {
  const sizes = {
    sm: 32,
    md: 48,
    lg: 64,
  };

  return (
    <Image
      src={src}
      alt={alt}
      height={sizes[size]}
      width={sizes[size]}
      className={classNames(
        "rounded-full bg-white shadow-inner shadow-gray-300",
        className,
      )}
    />
  );
};

export default Avatar;
