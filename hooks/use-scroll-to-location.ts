import { useEffect, useRef } from "react"
import { useRouter } from "next/router"

export default function useScrollToLocation() {
  const scrolledRef = useRef(false)
  const router = useRouter()
  const hash = router.asPath.split("#")[1] || ""
  const hashRef = useRef(hash)

  useEffect(() => {
    if (hash) {
      if (hashRef.current !== hash) {
        hashRef.current = hash
        scrolledRef.current = false
      }

      if (!scrolledRef.current) {
        const id = hash.replace("#", "")
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
          scrolledRef.current = true
        }
      }
    }
  })
}
