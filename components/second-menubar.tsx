import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import classNames from "classnames"

export default function SecondMenubar(props) {
  const router = useRouter()
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(!router.asPath.includes("#hide-nav"))
  }, [router])

  return (
    <div
      className={classNames(
        " bg-white border-r inset-0 w-full lg:w-72 min-h-screen pb-16 md:pb-0 overflow-y-auto shrink-0 fixed flex flex-col gap-6 p-6 md:relative z-20",
        props.className,
        { "-ml-[100vw]": !show }
      )}
    >
      {props.children}
    </div>
  )
}
