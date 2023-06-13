import { useEffect, useState } from "react"
import { AuthToken, getToken, getTokenViaSms } from "@/api/auth"
import UserApi, { User } from "@/api/users"
import Cookies from "js-cookie"
import useSWR from "swr"

export default function useAuth() {
  const AUTH_TOKEN_KEY = "auth.token"
  const AUTH_USER_KEY = "auth.user"

  const [token, setToken] = useState<string>(Cookies.get(AUTH_TOKEN_KEY))

  const { data: user, isLoading, mutate } = useSWR<User>([token], ([token]) => (token ? UserApi.getAuthUser() : null))

  let [hasLogged, setHasLogged] = useState(!!Cookies.get(AUTH_TOKEN_KEY))

  const redirectToLogin = () => {
    window.location.href = "/auth/login"
  }

  const handleOauthCallback = async (code: string, state: string): Promise<User> => {
    const token = await getToken(code, state)

    if (!token.value) {
      throw new Error(JSON.stringify(token))
    }

    saveToken(token)

    return await mutate()
  }

  const handleLoginViaSms = async (phoneNumber, code): Promise<User> => {
    const params = { phoneNumber: `+86:${phoneNumber}`, code }
    const token = await getTokenViaSms(params)

    if (!token.value) {
      throw new Error(JSON.stringify(token))
    }

    saveToken(token)

    return await mutate()
  }

  const saveToken = (token: AuthToken): AuthToken => {
    Cookies.set(AUTH_TOKEN_KEY, token.value, {
      expires: new Date(token.expires_at),
    })

    setHasLogged(true)

    setToken(token.value)

    return token
  }

  const logout = () => {
    Cookies.remove(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_USER_KEY)
    setToken(null)
  }

  useEffect(() => {
    setHasLogged(!!user)
  }, [user])

  return {
    hasLogged,
    user,
    logout,
    isLoading,
    redirectToLogin,
    handleOauthCallback,
    handleLoginViaSms,
    refreshAuthUser: mutate,
    authToken: token,
  }
}
