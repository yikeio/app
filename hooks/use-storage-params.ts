import { useEffect } from "react"
import Cookies from "js-cookie"

/**
 * 需要存在 localStorage 里的属性集合
 * referrer：邀请码，用于激活账号等
 **/
const STORE_PARAMS = ["referrer"]

export const useStorageParams = () => {
  useEffect(() => {
    const { searchParams } = new URL(location.href)
    STORE_PARAMS.forEach((param) => {
      if (searchParams.get(param)) {
        Cookies.set(param, searchParams.get(param))
      }
    })
  }, [])
}
