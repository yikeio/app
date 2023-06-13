import { useEffect } from "react"
import UserApi from "@/api/users"

import useAuth from "./use-auth"
import useLocalStorage from "./use-localstorage"

export default function UseReferrer() {
  const { user, refreshAuthUser } = useAuth()
  const [referralCode, setReferralCode] = useLocalStorage<string>("referrer", null)

  useEffect(() => {
    if (referralCode && user) {
      if (parseInt(user.referrer_id) <= 0) {
        UserApi.update({ referral_code: referralCode }).then(() => {
          setReferralCode(null)
          refreshAuthUser()
        })
      } else {
        setReferralCode(null)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [referralCode, user])
}
