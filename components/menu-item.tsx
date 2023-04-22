import Link from "next/link"
import { useRouter } from "next/router"
import classNames from "classnames"

import { buttonVariants } from "./ui/button"

export default function MenuItem({ menu: { icon, label, href } }) {
  const Icon = icon
  href = href || "#"
  const { asPath: currentPath } = useRouter()
  let baseClassNames = `focus-visible:ring-ring ring-offset-background inline-flex h-9 w-full  hover:bg-secondary/80  items-center justify-start rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50`

  let className = classNames(baseClassNames, "text-gray-600 hover:text-white")

  if (currentPath === href) {
    className = classNames(
      baseClassNames,
      "text-primray bg-secondary text-secondary-foreground"
    )
  }

  return (
    <Link href={href} className={className}>
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </Link>
  )
}
