import { useEffect } from "react"

export default function IndexPage() {
  useEffect(() => {
    location.href = `/${window.location.search}`
  }, [])
  return <></>
}
