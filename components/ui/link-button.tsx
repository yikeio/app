import React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "./button"

interface LinkButtonProps extends Pick<ButtonProps, "className" | "variant" | "size" | "children"> {
  href: string
}

const LinkButton = ({ className, variant, size = "default", ...props }: LinkButtonProps) => {
  return (
    <Link className={cn(buttonVariants({ variant, size, className }))} {...props}>
      {props.children}
    </Link>
  )
}

LinkButton.displayName = "LinkButton"

export default LinkButton
