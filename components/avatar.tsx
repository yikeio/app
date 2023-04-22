import React from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import classNames from "classnames"

import { Icons } from "@/components/icons"
import { Message, useSettingsStore } from "../store"

interface AvatarProps {
  src: string
  alt?: string
  size?: "sm" | "md" | "lg"
  className?: string
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
  }

  return (
    <Image
      src={src}
      alt={alt}
      height={sizes[size]}
      width={sizes[size]}
      className={classNames(
        "rounded-full bg-white shadow-inner shadow-gray-300",
        className
      )}
    />
  )
}

const Emoji = dynamic(async () => (await import("emoji-picker-react")).Emoji, {
  loading: () => <Icons.loading />,
})

export function UserAvatar(props: { role: Message["role"] }) {
  const config = useSettingsStore((state) => state.config)

  if (props.role !== "user") {
    return (
      <Avatar src="/logo.svg" className="h-10 w-10 shrink-0 rounded-full" />
    )
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-inner shadow-gray-300">
      <Emoji unified={config.avatar} size={32} />
    </div>
  )
}

export default Avatar
