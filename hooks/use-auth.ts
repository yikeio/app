import { useEffect, useState } from "react"
import { AuthToken, getToken, getTokenViaSms } from "@/api/auth"
import UserApi, { User } from "@/api/users"
import Cookies from "js-cookie"

export default function useAuth() {
  const AUTH_TOKEN_KEY = "auth.token"
  const AUTH_USER_KEY = "auth.user"

  let [user, setUser] = useState<User>(null)
  let [hasLogged, setHasLogged] = useState(!!Cookies.get(AUTH_TOKEN_KEY))

  const redirectToLogin = () => {
    window.location.href = "/auth/login"
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const authToken = (): AuthToken => {
    return Cookies.get(AUTH_TOKEN_KEY)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getUser = async (): Promise<User> => {
    if (!hasLogged) {
      return null
    }

    const cache = localStorage.getItem(AUTH_USER_KEY)

    if (!cache) {
      await refreshAuthUser()
    } else {
      setUser(JSON.parse(cache))
    }

    return user
  }

  const refreshAuthUser = async (): Promise<User> => {
    const res = await UserApi.getAuthUser()

    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(res))
    setUser(res)

    return res
  }

  const handleOauthCallback = async (code: string, state: string): Promise<User> => {
    const token = await getToken(code, state)

    if (!token.value) {
      throw new Error(JSON.stringify(token))
    }

    saveToken(token)

    return await refreshAuthUser()
  }

  const handleLoginViaSms = async (phoneNumber, code): Promise<User> => {
    const params = { phoneNumber: `+86:${phoneNumber}`, code }
    const token = await getTokenViaSms(params)

    if (!token.value) {
      throw new Error(JSON.stringify(token))
    }

    saveToken(token)

    return await refreshAuthUser()
  }

  const saveToken = (token: { value: string; expires_at: string }): AuthToken => {
    Cookies.set(AUTH_TOKEN_KEY, token.value, {
      expires: new Date(token.expires_at),
    })

    return token
  }

  const logout = () => {
    Cookies.remove(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_USER_KEY)
    setUser(null)
  }

  useEffect(() => {
    if (!authToken) {
      return
    }
    getUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    hasLogged,
    user,
    logout,
    redirectToLogin,
    handleOauthCallback,
    handleLoginViaSms,
    refreshAuthUser,
    authToken: authToken(),
  }
}
